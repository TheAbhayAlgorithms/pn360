import json
from pathlib import Path
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.http import JsonResponse, HttpResponseBadRequest
from django.db.models import Avg, Sum, Max

from .models import (
    Company, StudentProfile, Job, Resume, MockTest, Question, Answer,
    InterviewSession, InterviewAnswer, PlacementProgress, ScheduledTest
)
from .utils.resume_parser import extract_text
from .ai.gemini_engine import (
    analyze_resume_ats,
    generate_mcq_test,
    generate_interview_questions,
    evaluate_interview_answer,
    get_gemini_api_key
)

# =========================================================================
# PUBLIC / AUTHENTICATION VIEWS
# =========================================================================

def home(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    jobs = Job.objects.all().order_by('-created_at')[:6]
    return render(request, "home.html", {"jobs": jobs})

def register(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip().lower()
        password = request.POST.get("password", "")
        confirm_password = request.POST.get("confirm_password", "")
        phone = request.POST.get("phone", "").strip()
        technology = request.POST.get("technology", "Software Development").strip()
        image = request.FILES.get("image")

        if not email or not password:
            messages.error(request, "Email and Password are required.")
            return redirect("register")

        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return redirect("register")

        if not username:
            username = email.split("@")[0]

        if User.objects.filter(username=username).exists():
            username = f"{username}_{User.objects.count() + 1}"

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email is already registered. Please log in.")
            return redirect("login")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        StudentProfile.objects.create(
            user=user,
            phone=phone,
            technology=technology,
            image=image
        )

        PlacementProgress.objects.create(user=user)

        login(request, user)
        messages.success(request, f"Welcome to Placement Nexus 360, {user.username}!")
        return redirect("dashboard")

    return render(request, "register.html")

def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == "POST":
        email_or_user = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")

        user = None
        # Try authenticating directly
        user = authenticate(request, username=email_or_user, password=password)

        # If not, try by email lookup
        if user is None:
            user_obj = User.objects.filter(email__iexact=email_or_user).first()
            if user_obj:
                user = authenticate(request, username=user_obj.username, password=password)

        if user is not None:
            login(request, user)
            PlacementProgress.objects.get_or_create(user=user)
            if user.is_staff or user.is_superuser:
                return redirect("admin_home")
            return redirect("dashboard")
        else:
            messages.error(request, "Invalid credentials. Please verify your email/username and password.")

    return render(request, "login.html")

def logout_view(request):
    logout(request)
    messages.success(request, "You have been logged out successfully.")
    return redirect("login")

# =========================================================================
# DASHBOARD & RESUME ATS ANALYSIS
# =========================================================================

@login_required
def dashboard(request):
    profile, _ = StudentProfile.objects.get_or_create(user=request.user)
    progress, _ = PlacementProgress.objects.get_or_create(user=request.user)
    
    # Ensure default jobs exist if none are found
    if Job.objects.count() == 0:
        seed_default_jobs()

    jobs = Job.objects.all().order_by("-id")
    latest_resume = Resume.objects.filter(user=request.user).order_by("-uploaded_at").first()
    resumes = Resume.objects.filter(user=request.user).order_by("-uploaded_at")[:5]

    # Handle Resume Upload
    if request.method == "POST" and "upload_resume" in request.POST:
        uploaded_file = request.FILES.get("resume")
        job_id = request.POST.get("job_id")
        target_job = None
        job_title = "Software Development Engineer"
        job_desc = ""

        if job_id and job_id.isdigit():
            target_job = Job.objects.filter(id=int(job_id)).first()
            if target_job:
                job_title = target_job.title
                job_desc = target_job.description

        if uploaded_file:
            resume_obj = Resume.objects.create(
                user=request.user,
                file=uploaded_file,
                job=target_job,
                job_title=job_title
            )

            # Extract Text & Run Gemini ATS Analysis
            file_path = resume_obj.file.path
            resume_text = extract_text(file_path)
            
            ats_result = analyze_resume_ats(
                resume_text=resume_text,
                job_title=job_title,
                job_description=job_desc
            )

            resume_obj.ats_score = ats_result.get("ats_score", 65)
            resume_obj.role_fit = ats_result.get("role_fit", "Moderate")
            resume_obj.summary = ats_result.get("summary", "")
            resume_obj.strengths = ats_result.get("strengths", [])
            resume_obj.what_to_add = ats_result.get("what_to_add", [])
            resume_obj.what_to_remove = ats_result.get("what_to_remove", [])
            resume_obj.save()

            # Update student progress
            progress.resume_completed = True
            progress.resume_score = resume_obj.ats_score
            progress.calculate_readiness()

            messages.success(request, f"Resume successfully analyzed! ATS Score: {resume_obj.ats_score}%")
            return redirect("resume_result", resume_id=resume_obj.id)

    # Test Analytics
    mock_tests = MockTest.objects.filter(student=request.user, completed=True).order_by("started_at")
    mock_scores = [round(m.total_score) for m in mock_tests] or [0]

    interviews = InterviewSession.objects.filter(user=request.user, status="completed").order_by("created_at")
    interview_scores = [round(i.score) for i in interviews if i.score is not None] or [0]

    scheduled_tests = ScheduledTest.objects.filter(user=request.user).order_by("date", "time")

    context = {
        "profile": profile,
        "progress": progress,
        "jobs": jobs,
        "latest_resume": latest_resume,
        "resumes": resumes,
        "mock_scores": json.dumps(mock_scores),
        "interview_scores": json.dumps(interview_scores),
        "scheduled_tests": scheduled_tests,
        "has_gemini_key": bool(get_gemini_api_key()),
    }
    return render(request, "dashboard.html", context)

@login_required
def resume_result(request, resume_id):
    resume = get_object_or_404(Resume, id=resume_id, user=request.user)
    return render(request, "resume_result.html", {
        "resume": resume,
        "target_job": resume.job
    })

# =========================================================================
# STEP 2: MCQ TEST (30 QUESTIONS USING GEMINI)
# =========================================================================

@login_required
def select_tech(request):
    """
    Candidate selects one or multiple languages/topics.
    Gemini generates 30 placement preparation level questions.
    """
    available_techs = [
        {"name": "Python", "desc": "CPython, OOP, Generators, Memory & GIL", "badge": "Core"},
        {"name": "Java", "desc": "JVM, Collections, Multithreading & OOP", "badge": "Enterprise"},
        {"name": "C++", "desc": "Pointers, STL, Memory Management & Modern C++", "badge": "High-Perf"},
        {"name": "Data Structures & Algorithms", "desc": "Trees, Graphs, DP, Sorting & Complexity", "badge": "Essential"},
        {"name": "JavaScript", "desc": "Closures, Event Loop, Promises & Async/Await", "badge": "Web"},
        {"name": "SQL & DBMS", "desc": "ACID, Indexing, Normalization & Complex Joins", "badge": "Database"},
        {"name": "Operating Systems", "desc": "Process, Threads, Memory, Paging & Scheduling", "badge": "Systems"},
        {"name": "Computer Networks", "desc": "TCP/IP, HTTP/S, Sockets & Handshakes", "badge": "Infra"},
        {"name": "System Design", "desc": "Scalability, Caching, Load Balancing & Microservices", "badge": "Advanced"}
    ]

    if request.method == "POST":
        selected = request.POST.getlist("technologies")
        if not selected:
            messages.error(request, "Please select at least one technology or topic.")
            return redirect("select_tech")

        tech_label = ", ".join(selected)

        # Create MockTest record
        mock_test = MockTest.objects.create(
            student=request.user,
            technology=tech_label,
            total_questions=30
        )

        # Generate 30 questions with Gemini
        questions_data = generate_mcq_test(selected, count=30)

        for q in questions_data:
            options = q.get("options", ["A", "B", "C", "D"])
            while len(options) < 4:
                options.append(f"Option {len(options)+1}")

            Question.objects.create(
                test=mock_test,
                question_text=q.get("question", ""),
                question_type="mcq",
                topic=q.get("topic", tech_label),
                option1=options[0],
                option2=options[1],
                option3=options[2],
                option4=options[3],
                correct_answer=q.get("answer", options[0]),
                explanation=q.get("explanation", "")
            )

        return redirect("take_test", test_id=mock_test.id)

    return render(request, "select_tech.html", {"available_techs": available_techs})

@login_required
def take_test(request, test_id):
    test = get_object_or_404(MockTest, id=test_id, student=request.user)

    if test.completed:
        return redirect("test_result", test_id=test.id)

    if test.blocked:
        return render(request, "blocked.html", {
            "reason": "Test blocked due to excessive proctoring violations or tab switching."
        })

    questions = test.questions.all().order_by("id")

    return render(request, "test_page.html", {
        "test": test,
        "questions": questions,
        "total_count": questions.count(),
    })

@login_required
def submit_test(request, test_id):
    test = get_object_or_404(MockTest, id=test_id, student=request.user)
    if test.completed:
        return redirect("test_result", test_id=test.id)

    questions = test.questions.all()
    correct_count = 0
    total = questions.count() or 30

    for q in questions:
        user_answer = request.POST.get(f"q_{q.id}", "").strip()
        is_correct = False
        
        # Match exact string or letter index
        if user_answer and q.correct_answer:
            if user_answer.strip().lower() == q.correct_answer.strip().lower():
                is_correct = True
            elif user_answer in ["A", "B", "C", "D"]:
                opts = [q.option1, q.option2, q.option3, q.option4]
                idx = ord(user_answer) - ord("A")
                if 0 <= idx < len(opts) and opts[idx] == q.correct_answer:
                    is_correct = True

        score = 100.0 / total if is_correct else 0.0
        if is_correct:
            correct_count += 1

        Answer.objects.create(
            question=q,
            student=request.user,
            student_answer=user_answer,
            is_correct=is_correct,
            score=score
        )

    percentage = round((correct_count / total) * 100, 1)
    passed = percentage >= 60.0

    test.correct_count = correct_count
    test.total_score = percentage
    test.passed = passed
    test.completed = True
    test.save()

    # Update Progress
    progress, _ = PlacementProgress.objects.get_or_create(user=request.user)
    progress.mock_passed = passed
    progress.mock_score = percentage
    progress.calculate_readiness()

    return redirect("test_result", test_id=test.id)

@login_required
def test_result(request, test_id):
    test = get_object_or_404(MockTest, id=test_id, student=request.user)
    answers = Answer.objects.filter(question__test=test, student=request.user).select_related('question')

    return render(request, "test_result.html", {
        "test": test,
        "answers": answers,
        "passed": test.passed,
    })

# =========================================================================
# STEP 3: ONLINE INTERVIEW TEST (REAL-TIME FACE PROCTORING & SPEECH AI)
# =========================================================================

@login_required
def ai_interview(request):
    """
    Setup / Launch screen for online interview.
    """
    if request.method == "POST":
        target_role = request.POST.get("technology", "Software Development Engineer").strip()
        
        session = InterviewSession.objects.create(
            user=request.user,
            technology=target_role,
            status="in_progress"
        )

        questions = generate_interview_questions(target_role)

        request.session[f"interview_q_{session.id}"] = questions

        return redirect("live_interview", session_id=session.id)

    roles = [
        "Software Development Engineer",
        "Frontend Engineer (React / UI)",
        "Backend Developer (Python / Cloud)",
        "Full Stack Developer",
        "Data Engineer / ML Engineer",
        "DevOps & Cloud Architect"
    ]
    return render(request, "ai_interview.html", {"roles": roles})

@login_required
def live_demo_interview(request, session_id):
    session = get_object_or_404(InterviewSession, id=session_id, user=request.user)

    if session.status == "discarded":
        return render(request, "interview_discarded.html", {"session": session})

    if session.status == "completed":
        return redirect("interview_result", session_id=session.id)

    questions = request.session.get(f"interview_q_{session.id}")
    if not questions:
        questions = generate_interview_questions(session.technology)
        request.session[f"interview_q_{session.id}"] = questions

    return render(request, "live_demo_interview.html", {
        "session": session,
        "questions_json": json.dumps(questions),
    })

@login_required
def api_evaluate_interview_answer(request, session_id):
    """
    AJAX endpoint receiving spoken transcript and question text.
    Evaluates with Gemini and returns score %, correctness, feedback & improvement tips.
    """
    if request.method != "POST":
        return HttpResponseBadRequest("POST required")

    session = get_object_or_404(InterviewSession, id=session_id, user=request.user)
    if session.status == "discarded":
        return JsonResponse({"error": "Test was discarded"}, status=400)

    try:
        data = json.loads(request.body)
        question_text = data.get("question_text", "")
        spoken_transcript = data.get("spoken_transcript", "")

        eval_result = evaluate_interview_answer(
            question_text=question_text,
            spoken_transcript=spoken_transcript,
            role=session.technology
        )

        ans = InterviewAnswer.objects.create(
            session=session,
            question_text=question_text,
            spoken_text=spoken_transcript,
            score=eval_result.get("score_percentage", 60),
            verdict=eval_result.get("verdict", "Good"),
            feedback=eval_result.get("feedback", ""),
            improvement_tips=eval_result.get("improvement_tips", "")
        )

        return JsonResponse({
            "status": "success",
            "score": ans.score,
            "verdict": ans.verdict,
            "feedback": ans.feedback,
            "improvement_tips": ans.improvement_tips,
        })
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@login_required
def api_discard_interview(request, session_id):
    """
    Called when 3 proctoring warnings are reached (face out of range / multiple faces).
    Immediately discards the test and invalidates the session.
    """
    if request.method != "POST":
        return HttpResponseBadRequest("POST required")

    session = get_object_or_404(InterviewSession, id=session_id, user=request.user)
    data = json.loads(request.body or "{}")
    reason = data.get("reason", "Disqualified: 3 warnings reached for face out of camera range or multiple faces detected.")

    session.status = "discarded"
    session.warnings_count = 3
    session.discard_reason = reason
    session.save()

    return JsonResponse({
        "status": "discarded",
        "redirect_url": f"/interview-discarded/{session.id}/"
    })

@login_required
def interview_discarded(request, session_id):
    session = get_object_or_404(InterviewSession, id=session_id, user=request.user)
    return render(request, "interview_discarded.html", {"session": session})

@login_required
def api_finish_interview(request, session_id):
    """
    Calculates final average interview score, updates progress, and redirects to results.
    """
    if request.method != "POST":
        return HttpResponseBadRequest("POST required")

    session = get_object_or_404(InterviewSession, id=session_id, user=request.user)
    if session.status == "discarded":
        return JsonResponse({"redirect_url": f"/interview-discarded/{session.id}/"})

    avg_score = InterviewAnswer.objects.filter(session=session).aggregate(Avg("score"))["score__avg"] or 0
    avg_score = round(avg_score, 1)

    session.score = avg_score
    session.status = "completed"
    session.save()

    progress, _ = PlacementProgress.objects.get_or_create(user=request.user)
    progress.interview_passed = (avg_score >= 60.0)
    progress.interview_score = avg_score
    progress.calculate_readiness()

    return JsonResponse({
        "status": "completed",
        "redirect_url": f"/interview-result/{session.id}/"
    })

@login_required
def interview_result(request, session_id):
    session = get_object_or_404(InterviewSession, id=session_id, user=request.user)
    answers = session.answers.all().order_by("created_at")
    progress, _ = PlacementProgress.objects.get_or_create(user=request.user)

    return render(request, "interview_result.html", {
        "session": session,
        "answers": answers,
        "passed": (session.score or 0) >= 60,
        "progress": progress
    })

# =========================================================================
# LEADERBOARD, SCHEDULE & ADMIN HOME
# =========================================================================

@login_required
def leaderboard(request):
    progress_list = PlacementProgress.objects.select_related("user").order_by("-overall_readiness")[:20]
    return render(request, "leaderboard.html", {
        "leaderboard": progress_list,
        "top3": progress_list[:3],
        "others": progress_list[3:]
    })

@login_required
def schedule_test(request):
    if request.method == "POST":
        test_type = request.POST.get("type", "Mock Test")
        date = request.POST.get("date")
        time = request.POST.get("time")

        if date and time:
            ScheduledTest.objects.create(
                user=request.user,
                type=test_type,
                date=date,
                time=time
            )
            messages.success(request, f"Scheduled {test_type} for {date} at {time}.")

    return redirect("dashboard")

@staff_member_required
def admin_home(request):
    students = User.objects.filter(is_staff=False).order_by("-date_joined")
    jobs = Job.objects.all().order_by("-created_at")
    resumes = Resume.objects.all().order_by("-uploaded_at")[:20]
    interviews = InterviewSession.objects.all().order_by("-created_at")[:20]

    return render(request, "admin_home.html", {
        "students": students,
        "jobs": jobs,
        "resumes": resumes,
        "interviews": interviews,
        "total_students": students.count(),
        "total_jobs": jobs.count(),
        "total_resumes": resumes.count()
    })

@staff_member_required
def add_job(request):
    if request.method == "POST":
        title = request.POST.get("title")
        company = request.POST.get("company")
        location = request.POST.get("location", "Remote")
        salary = request.POST.get("salary", "10-15 LPA")
        skills = request.POST.get("required_skills", "")
        description = request.POST.get("description", "")

        if title and company and description:
            Job.objects.create(
                title=title,
                company=company,
                location=location,
                salary=salary,
                required_skills=skills,
                description=description
            )
            messages.success(request, f"Job '{title}' added successfully!")
            return redirect("admin_home")
        else:
            messages.error(request, "Please fill in all required job fields.")

    return render(request, "add_job.html")

@staff_member_required
def delete_job(request, id):
    job = get_object_or_404(Job, id=id)
    job.delete()
    messages.success(request, "Job listing deleted.")
    return redirect("admin_home")

@staff_member_required
def delete_student(request, id):
    user = get_object_or_404(User, id=id, is_staff=False)
    user.delete()
    messages.success(request, "Student account deleted.")
    return redirect("admin_home")

# =========================================================================
# SEED DEFAULT JOBS HELPER
# =========================================================================

def seed_default_jobs():
    default_jobs = [
        {
            "title": "Software Development Engineer - I",
            "company": "Amazon / Big Tech",
            "location": "Bengaluru / Hyderabad / Remote",
            "salary": "18 - 24 LPA",
            "required_skills": "Python, Java, Data Structures, Algorithms, Object-Oriented Design, System Design, SQL",
            "description": "Looking for talented SDE-1 engineers proficient in Data Structures, Algorithms, and Object-Oriented Programming. You will write high-performance scalable services, design clean APIs, collaborate in code reviews, and build resilient distributed systems."
        },
        {
            "title": "Full Stack Engineer",
            "company": "Stripe / FinTech",
            "location": "Remote",
            "salary": "16 - 22 LPA",
            "required_skills": "JavaScript, TypeScript, React, Python, Django, REST APIs, PostgreSQL, Docker",
            "description": "Build high-throughput web applications and payment experiences. Strong mastery of React, TypeScript, server-side frameworks (Django / Node.js), relational database optimization, and test-driven development is required."
        },
        {
            "title": "Data Engineer / Analytics Specialist",
            "company": "Google / Tech",
            "location": "Hyderabad / Remote",
            "salary": "15 - 20 LPA",
            "required_skills": "Python, SQL, Apache Spark, Data Pipelines, ETL, Pandas, BigQuery, AWS / GCP",
            "description": "Responsible for designing automated ETL data pipelines, data warehouses, and large-scale data ingestion architectures. Proficiency in SQL, Python data frameworks, and cloud storage systems."
        },
        {
            "title": "Frontend Developer (UI/UX & React)",
            "company": "Microsoft / Cloud Solutions",
            "location": "Noida / Bengaluru",
            "salary": "14 - 18 LPA",
            "required_skills": "HTML5, CSS3, JavaScript ES6+, React.js, Next.js, Redux, Performance Optimization",
            "description": "Craft responsive, accessible, pixel-perfect user interfaces with modern React, state management, CSS architectures, and Web Vitals performance tuning."
        },
        {
            "title": "Backend Systems Engineer",
            "company": "Uber / Mobility Platform",
            "location": "Bengaluru / Hybrid",
            "salary": "18 - 25 LPA",
            "required_skills": "Python, Golang, Microservices, Redis, Kafka, PostgreSQL, Docker, Kubernetes",
            "description": "Develop high-concurrency microservices, event-driven architectures with Kafka and Redis caching, asynchronous processing, and containerized deployments."
        }
    ]

    for j in default_jobs:
        Job.objects.get_or_create(
            title=j["title"],
            company=j["company"],
            defaults={
                "location": j["location"],
                "salary": j["salary"],
                "required_skills": j["required_skills"],
                "description": j["description"]
            }
        )
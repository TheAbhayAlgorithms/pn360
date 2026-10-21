import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse

from Placement.models import (
    Job, Resume, MockTest, Question, Answer, InterviewSession, InterviewAnswer, PlacementProgress
)
from Placement.ai.gemini_engine import (
    analyze_resume_ats,
    generate_mcq_test,
    generate_interview_questions,
    evaluate_interview_answer
)

class PlacementNexusWorkflowTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="candidate_rahul",
            email="rahul@example.com",
            password="SecurePassword123"
        )
        self.job = Job.objects.create(
            title="Software Development Engineer - I",
            company="Amazon / Tech",
            location="Bengaluru",
            salary="20 LPA",
            required_skills="Python, Data Structures, Algorithms, SQL, Git",
            description="Looking for SDE-1 engineers with strong proficiency in Data Structures and Algorithms."
        )

    def test_01_user_authentication(self):
        """Test registration and login flow"""
        login_success = self.client.login(username="candidate_rahul", password="SecurePassword123")
        self.assertTrue(login_success)

        resp = self.client.get(reverse('dashboard'))
        self.assertEqual(resp.status_code, 200)

    def test_02_resume_ats_analysis(self):
        """Test ATS analyzer generates score, what to add, and what to remove"""
        sample_resume = """
        Rahul Sharma
        Education: B.Tech Computer Science (GPA: 8.8)
        Skills: Python, Django, SQL, Git, Linux
        Projects: E-Commerce REST API with PostgreSQL, Redis cache, JWT authentication.
        """
        result = analyze_resume_ats(sample_resume, self.job.title, self.job.description)
        self.assertIn("ats_score", result)
        self.assertTrue(0 <= result["ats_score"] <= 100)
        self.assertIn("what_to_add", result)
        self.assertIn("what_to_remove", result)
        self.assertIn("strengths", result)
        self.assertGreater(len(result["what_to_add"]), 0)

    def test_03_30_mcq_generation(self):
        """Test that exactly 30 placement MCQs are generated with 4 options each"""
        questions = generate_mcq_test(["Python", "Data Structures"], count=30)
        self.assertEqual(len(questions), 30)

        for q in questions:
            self.assertEqual(len(q["options"]), 4)
            self.assertTrue(bool(q["question"]))
            self.assertTrue(bool(q["answer"]))

    def test_04_mcq_test_session_and_scoring(self):
        """Test complete MCQ test creation, question answering, and passing condition"""
        self.client.login(username="candidate_rahul", password="SecurePassword123")

        mock_test = MockTest.objects.create(
            student=self.user,
            technology="Python, DSA",
            total_questions=30
        )

        for i in range(1, 31):
            Question.objects.create(
                test=mock_test,
                question_text=f"Question {i}: Complexity of binary search?",
                option1="O(log n)",
                option2="O(n)",
                option3="O(1)",
                option4="O(n^2)",
                correct_answer="O(log n)",
                explanation="Binary search halves the search space each step."
            )

        # Submit answers (answering all correctly)
        post_data = {f"q_{q.id}": "O(log n)" for q in mock_test.questions.all()}
        resp = self.client.post(reverse('submit_test', kwargs={'test_id': mock_test.id}), data=post_data)
        self.assertEqual(resp.status_code, 302)

        mock_test.refresh_from_db()
        self.assertEqual(mock_test.correct_count, 30)
        self.assertEqual(mock_test.total_score, 100.0)
        self.assertTrue(mock_test.passed)

    def test_05_interview_generation_and_evaluation(self):
        """Test interview questions generation and voice transcript evaluation"""
        questions = generate_interview_questions("Software Development")
        self.assertGreaterEqual(len(questions), 3)

        sample_answer = "In 5 years, I envision myself as a Senior Software Engineer leading core architecture."
        eval_result = evaluate_interview_answer(questions[1]["question"], sample_answer)

        self.assertIn("score_percentage", eval_result)
        self.assertIn("verdict", eval_result)
        self.assertIn("improvement_tips", eval_result)
        self.assertTrue(0 <= eval_result["score_percentage"] <= 100)

    def test_06_proctoring_discard_api(self):
        """Test that reaching 3 proctoring warnings automatically discards the test"""
        self.client.login(username="candidate_rahul", password="SecurePassword123")
        
        session = InterviewSession.objects.create(
            user=self.user,
            technology="Software Development",
            status="in_progress"
        )

        payload = {"reason": "Disqualified: 3 warnings reached (face out of camera range)"}
        resp = self.client.post(
            reverse('api_discard_interview', kwargs={'session_id': session.id}),
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(resp.status_code, 200)

        session.refresh_from_db()
        self.assertEqual(session.status, "discarded")
        self.assertEqual(session.warnings_count, 3)

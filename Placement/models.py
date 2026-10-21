from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Company(models.Model):
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='company_logo/', blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, default='')
    technology = models.CharField(max_length=150, blank=True, default='Full Stack Development')
    target_role = models.CharField(max_length=150, blank=True, default='Software Development Engineer')
    image = models.ImageField(upload_to="students/", null=True, blank=True)

    def __str__(self):
        return self.user.username

class Job(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, default='Remote / Hybrid')
    salary = models.CharField(max_length=100, default='12-18 LPA')
    description = models.TextField()
    required_skills = models.CharField(max_length=300, blank=True, default='Python, Data Structures, SQL, REST APIs, Git')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} @ {self.company}"

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    file = models.FileField(upload_to="resumes/")
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True)
    job_title = models.CharField(max_length=200, default='Software Developer')
    ats_score = models.IntegerField(default=0)
    role_fit = models.CharField(max_length=100, default='Moderate')
    summary = models.TextField(blank=True, default='')
    strengths = models.JSONField(default=list, blank=True)
    what_to_add = models.JSONField(default=list, blank=True)
    what_to_remove = models.JSONField(default=list, blank=True)
    uploaded_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.job_title} ({self.ats_score}%)"

class MockTest(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mock_tests')
    technology = models.CharField(max_length=200)
    started_at = models.DateTimeField(default=timezone.now)
    total_questions = models.IntegerField(default=30)
    correct_count = models.IntegerField(default=0)
    total_score = models.FloatField(default=0)
    passed = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    cheating_count = models.IntegerField(default=0)
    blocked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.technology} ({self.total_score}%)"

class Question(models.Model):
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, default='mcq')
    topic = models.CharField(max_length=100, default='General')

    option1 = models.CharField(max_length=500, blank=True, null=True)
    option2 = models.CharField(max_length=500, blank=True, null=True)
    option3 = models.CharField(max_length=500, blank=True, null=True)
    option4 = models.CharField(max_length=500, blank=True, null=True)

    correct_answer = models.TextField(blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Q: {self.question_text[:50]}..."

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    student_answer = models.TextField(blank=True, default='')
    is_correct = models.BooleanField(default=False)
    score = models.FloatField(default=0)

    def __str__(self):
        return f"{self.student.username} - {self.question_id}"

class InterviewSession(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('discarded', 'Discarded due to Proctoring Violation'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interviews')
    technology = models.CharField(max_length=200, default='Software Development')
    score = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='in_progress')
    warnings_count = models.IntegerField(default=0)
    discard_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Interview: {self.user.username} - {self.technology} ({self.status})"

class InterviewAnswer(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='answers')
    question_text = models.TextField()
    spoken_text = models.TextField(blank=True, default='')
    score = models.FloatField(default=0)
    verdict = models.CharField(max_length=100, default='Good')
    feedback = models.TextField(blank=True, default='')
    improvement_tips = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.session_id} - {self.score}%"

class PlacementProgress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='placement_progress')
    resume_completed = models.BooleanField(default=False)
    resume_score = models.IntegerField(default=0)
    mock_passed = models.BooleanField(default=False)
    mock_score = models.FloatField(default=0)
    interview_passed = models.BooleanField(default=False)
    interview_score = models.FloatField(default=0)
    overall_readiness = models.FloatField(default=0)

    def calculate_readiness(self):
        total = 0
        weights = 0
        if self.resume_score:
            total += self.resume_score * 0.25
            weights += 0.25
        if self.mock_score:
            total += self.mock_score * 0.35
            weights += 0.35
        if self.interview_score:
            total += self.interview_score * 0.40
            weights += 0.40
        self.overall_readiness = round(total / max(weights, 1.0), 1)
        self.save()
        return self.overall_readiness

    def __str__(self):
        return f"Progress: {self.user.username} ({self.overall_readiness}%)"

class ScheduledTest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return f"{self.type} - {self.date} {self.time}"

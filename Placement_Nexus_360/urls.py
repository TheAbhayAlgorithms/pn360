from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Placement import views

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Authentication
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # Dashboard & Resume ATS
    path('dashboard/', views.dashboard, name='dashboard'),
    path('resume/<int:resume_id>/', views.resume_result, name='resume_result'),

    # Step 2: 30 MCQ Test (Gemini)
    path('mcq-test/', views.select_tech, name='select_tech'),
    path('start-test/', views.select_tech, name='start_test'), # alias
    path('take-test/<int:test_id>/', views.take_test, name='take_test'),
    path('submit-test/<int:test_id>/', views.submit_test, name='submit_test'),
    path('test-result/<int:test_id>/', views.test_result, name='test_result'),

    # Step 3: Online AI Interview with Real-Time Proctoring & Speech AI
    path('ai-interview/', views.ai_interview, name='ai_interview'),
    path('live-interview/<int:session_id>/', views.live_demo_interview, name='live_interview'),
    path('interview-result/<int:session_id>/', views.interview_result, name='interview_result'),
    path('interview-discarded/<int:session_id>/', views.interview_discarded, name='interview_discarded'),

    # Interview API Endpoints
    path('api/interview/<int:session_id>/evaluate/', views.api_evaluate_interview_answer, name='api_evaluate_interview_answer'),
    path('api/interview/<int:session_id>/discard/', views.api_discard_interview, name='api_discard_interview'),
    path('api/interview/<int:session_id>/finish/', views.api_finish_interview, name='api_finish_interview'),

    # Leaderboard & Scheduling
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('schedule-test/', views.schedule_test, name='schedule_test'),

    # Staff / Admin Portal
    path('admin-home/', views.admin_home, name='admin_home'),
    path('add-job/', views.add_job, name='add_job'),
    path('delete-job/<int:id>/', views.delete_job, name='delete_job'),
    path('delete-student/<int:id>/', views.delete_student, name='delete_student'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

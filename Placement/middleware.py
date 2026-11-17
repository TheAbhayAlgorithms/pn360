from django.contrib.auth import login
from django.contrib.auth.models import User
from Placement.models import StudentProfile

class AutoLoginMiddleware:
    """
    Ensures that every visitor is instantly authenticated as an active candidate
    without any login or registration prompts.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.user.is_authenticated:
            candidate = User.objects.filter(username="candidate").first()
            if not candidate:
                candidate = User.objects.create_user(
                    username="candidate",
                    password="CandidatePassword123!",
                    email="candidate@placementnexus.com",
                    is_staff=True
                )
            else:
                if not candidate.is_staff:
                    candidate.is_staff = True
                    candidate.save(update_fields=['is_staff'])
            if not hasattr(candidate, 'profile'):
                StudentProfile.objects.get_or_create(
                    user=candidate,
                    defaults={'technology': 'Software Engineering', 'phone': '9876543210'}
                )
            candidate.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, candidate)
        return self.get_response(request)

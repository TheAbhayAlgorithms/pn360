from pathlib import Path
import os
import shutil
from dotenv import load_dotenv

# ================= BASE DIRECTORY =================
BASE_DIR = Path(__file__).resolve().parent.parent

# ================= LOAD ENV =================
load_dotenv(BASE_DIR / ".env")

# ================= GEMINI API KEY =================
GEMINI_API_KEY = (os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or "").strip()


# ================= SECURITY =================
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-e=d!fvxy-@bx$^fuey7_bzye1i^%3=nwxxy4kt%ykmvs^b=#$s")
DEBUG = True
ALLOWED_HOSTS = ["*"]

# ================= INSTALLED APPS =================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Placement.apps.PlacementConfig',
]

# ================= MIDDLEWARE =================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Placement_Nexus_360.urls'

# ================= TEMPLATES =================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'Placement' / 'templates',
            BASE_DIR / 'templates',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Placement_Nexus_360.wsgi.application'

# ================= DATABASE =================
# On Vercel / Serverless deployments, the root directory (/var/task) is strictly read-only.
# We redirect SQLite to /tmp (the writable ephemeral filesystem on AWS Lambda/Vercel)
# and copy over the pre-migrated seed database.
IS_VERCEL = bool(os.getenv("VERCEL") or not os.access(BASE_DIR, os.W_OK))
if IS_VERCEL:
    DB_PATH = Path("/tmp") / "db.sqlite3"
    SEED_DB = BASE_DIR / "db.sqlite3"
    if not DB_PATH.exists() and SEED_DB.exists():
        try:
            shutil.copy2(SEED_DB, DB_PATH)
        except Exception:
            pass
else:
    DB_PATH = BASE_DIR / "db.sqlite3"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': DB_PATH,
    }
}

# ================= COOKIE & SESSION PRIVACY =================
# Expire cookies on browser close (no persistent cookies saved on disk)
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_SAVE_EVERY_REQUEST = False
SESSION_COOKIE_AGE = 7200
CSRF_COOKIE_AGE = None
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True


# ================= PASSWORD VALIDATION =================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ================= INTERNATIONALIZATION =================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ================= STATIC FILES =================
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'Placement' / 'static',
]
STATIC_ROOT = BASE_DIR / 'staticfiles'

# ================= MEDIA FILES =================
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ================= AUTH REDIRECTS =================
LOGIN_URL = 'login'
LOGIN_REDIRECT_URL = 'dashboard'
LOGOUT_REDIRECT_URL = 'login'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
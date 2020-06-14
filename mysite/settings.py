import os

TIME_ZONE = 'Europe/Berlin'
LANGUAGE_CODE = 'en-us'

#BASE_DIR = os.path.dirname(os.path.abspath(_file_)))

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
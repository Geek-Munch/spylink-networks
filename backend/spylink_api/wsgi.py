import os
from django.core.wsgi import get_wsgi_application

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spylink_api.settings')

# This is the application object Gunicorn needs
application = get_wsgi_application()
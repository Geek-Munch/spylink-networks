import os
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spylink_api.settings')

# Add the backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Run migrations
from django.core.management import call_command

print("Running migrations...")
call_command('migrate', '--noinput')
print("Migrations completed")
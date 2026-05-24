"""
WSGI config for spylink_api project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

# AUTO-RUN MIGRATIONS ON RENDER
import os
if os.environ.get('RENDER'):
    from django.core.management import call_command
    try:
        call_command('migrate', '--noinput')
        print("Migrations completed successfully")
    except Exception as e:
        print(f"Migration error: {e}")

from django.apps import AppConfig
import os

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        if os.environ.get('RENDER'):
            try:
                from django.core.management import call_command
                call_command('migrate', '--noinput')
                print("✓ Migrations ran successfully")
            except Exception as e:
                print(f"Migration error: {e}")
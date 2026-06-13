from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'email', 'username', 'phone_number', 'is_subscriber', 'is_verified', 'is_staff', 'date_joined')
    list_filter = ('is_subscriber', 'is_verified', 'is_staff', 'is_active')
    search_fields = ('email', 'username', 'phone_number')
    readonly_fields = ('last_login', 'date_joined')
    
    fieldsets = (
        ('Personal Info', {'fields': ('email', 'username', 'phone_number', 'address', 'profile_picture')}),
        ('Subscription Info', {'fields': ('is_subscriber', 'subscription_balance')}),
        ('Verification', {'fields': ('is_verified', 'email_verification_code', 'verification_code_expires')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'phone_number', 'password1', 'password2'),
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()
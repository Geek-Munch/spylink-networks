from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'package', 'status', 'start_date', 'end_date', 'amount_paid')
    list_filter = ('status', 'auto_renew')
    search_fields = ('user__email', 'package__name')
    readonly_fields = ('created_at', 'updated_at')
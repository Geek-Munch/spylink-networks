from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'package', 'status', 'start_date', 'end_date', 'amount_paid', 'auto_renew')
    list_filter = ('status', 'auto_renew', 'package')
    search_fields = ('user__email', 'user__username', 'package__name')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Subscription Info', {'fields': ('user', 'package', 'status')}),
        ('Dates', {'fields': ('start_date', 'end_date')}),
        ('Payment', {'fields': ('amount_paid', 'payment_reference')}),
        ('Settings', {'fields': ('auto_renew',)}),
        ('Installation', {'fields': ('installation_fee_paid', 'installation_date', 'first_month_free', 'free_month_used')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    actions = ['activate_subscriptions', 'cancel_subscriptions']
    
    def activate_subscriptions(self, request, queryset):
        for sub in queryset:
            sub.activate()
        self.message_user(request, f"{queryset.count()} subscriptions activated")
    activate_subscriptions.short_description = "Activate selected subscriptions"
    
    def cancel_subscriptions(self, request, queryset):
        queryset.update(status='CANCELLED')
        self.message_user(request, f"{queryset.count()} subscriptions cancelled")
    cancel_subscriptions.short_description = "Cancel selected subscriptions"
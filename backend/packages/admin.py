from django.contrib import admin
from .models import InternetPackage
@admin.register(InternetPackage)
class InternetPackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'speed', 'price', 'package_type', 'is_active', 'is_popular')
    list_filter = ('package_type', 'is_active', 'is_popular')
    search_fields = ('name', 'description')
    list_editable = ('price', 'is_active', 'is_popular')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Info', {'fields': ('name', 'speed', 'price', 'description', 'package_type')}),
        ('Features', {'fields': ('features', 'validity_days')}),
        ('Pricing', {'fields': ('installation_fee', 'first_month_free')}),
        ('Status', {'fields': ('is_active', 'is_popular')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
from django.contrib import admin
from .models import InternetPackage

@admin.register(InternetPackage)
class InternetPackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'speed', 'price', 'package_type', 'is_active', 'is_popular')
    list_filter = ('package_type', 'is_active', 'is_popular')
    search_fields = ('name', 'description')
    list_editable = ('price', 'is_active', 'is_popular')
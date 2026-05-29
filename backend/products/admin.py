from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'product_count')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Number of Products'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'category', 'is_active', 'is_featured', 'created_at')
    list_filter = ('category', 'is_active', 'is_featured')
    search_fields = ('name', 'description', 'specifications')
    list_editable = ('price', 'stock', 'is_active', 'is_featured')
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Basic Info', {'fields': ('name', 'slug', 'category', 'description')}),
        ('Pricing & Stock', {'fields': ('price', 'stock')}),
        ('Images', {'fields': ('image', 'image_url', 'additional_images')}),
        ('Specifications', {'fields': ('specifications',)}),
        ('Status', {'fields': ('is_active', 'is_featured')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
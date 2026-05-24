from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    in_stock = serializers.SerializerMethodField()
    display_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'category', 'category_name', 
                  'description', 'price', 'stock', 'image', 'image_url', 'display_image',
                  'additional_images', 'specifications', 
                  'is_active', 'is_featured', 'in_stock', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_in_stock(self, obj):
        return obj.stock > 0
    
    def get_display_image(self, obj):
        # Return image_url if available, otherwise the uploaded image path
        if obj.image_url:
            return obj.image_url
        elif obj.image:
            # If image is a URL string, return it directly
            if hasattr(obj.image, 'url'):
                return obj.image.url
            elif isinstance(obj.image, str) and (obj.image.startswith('http://') or obj.image.startswith('https://')):
                return obj.image
        return None
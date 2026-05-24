from rest_framework import serializers
from .models import InternetPackage

class InternetPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternetPackage
        fields = ['id', 'name', 'speed', 'price', 'description', 
                  'package_type', 'features', 'validity_days', 
                  'is_active', 'is_popular', 'created_at']
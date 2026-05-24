from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import InternetPackage
from .serializers import InternetPackageSerializer

class PackageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing internet packages"""
    queryset = InternetPackage.objects.filter(is_active=True)
    serializer_class = InternetPackageSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular packages"""
        popular_packages = self.queryset.filter(is_popular=True)
        serializer = self.get_serializer(popular_packages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Filter packages by type"""
        package_type = request.query_params.get('type')
        if package_type:
            packages = self.queryset.filter(package_type=package_type)
            serializer = self.get_serializer(packages, many=True)
            return Response(serializer.data)
        return Response({"error": "Package type required"}, status=400)
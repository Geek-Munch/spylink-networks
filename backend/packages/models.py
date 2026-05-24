from django.db import models
from django.utils.translation import gettext_lazy as _

class InternetPackage(models.Model):
    """Internet subscription packages"""
    
    class PackageType(models.TextChoices):
        HOME = 'HOME', _('Home Internet')
        BUSINESS = 'BUSINESS', _('Business Internet')
        CORPORATE = 'CORPORATE', _('Corporate Internet')
    
    name = models.CharField(max_length=100)
    speed = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    package_type = models.CharField(max_length=20, choices=PackageType.choices, default=PackageType.HOME)
    features = models.JSONField(default=dict)
    validity_days = models.IntegerField(default=30)
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    installation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=10000.00)
    first_month_free = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'internet_packages'
        ordering = ['price']
    
    def __str__(self):
        return f"{self.name} - {self.speed} @ KES {self.price}"
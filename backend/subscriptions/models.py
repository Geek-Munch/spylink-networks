from django.db import models
from django.conf import settings
from packages.models import InternetPackage
from django.utils import timezone
from django.utils.translation import gettext_lazy as _ 

class Subscription(models.Model):
    """User subscriptions to internet packages"""
    
    class SubscriptionStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        ACTIVE = 'ACTIVE', _('Active')
        EXPIRED = 'EXPIRED', _('Expired')
        CANCELLED = 'CANCELLED', _('Cancelled')
        SUSPENDED = 'SUSPENDED', _('Suspended')
        INSTALLATION = 'INSTALLATION', _('Installation Scheduled')
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    package = models.ForeignKey(InternetPackage, on_delete=models.PROTECT, related_name='subscriptions')
    status = models.CharField(max_length=20, choices=SubscriptionStatus.choices, default=SubscriptionStatus.PENDING)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    auto_renew = models.BooleanField(default=False)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_reference = models.CharField(max_length=100, blank=True, null=True)
    
    # New fields for installation
    installation_fee_paid = models.BooleanField(default=False)
    installation_date = models.DateTimeField(null=True, blank=True)
    first_month_free = models.BooleanField(default=True)
    free_month_used = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscriptions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.package.name}"
    
    def calculate_total_due(self):
        """Calculate total amount due including installation fee"""
        total = self.package.price
        if not self.installation_fee_paid and not self.free_month_used:
            total += self.package.installation_fee
        return total
    
    def activate(self):
        """Activate subscription after installation"""
        self.status = self.SubscriptionStatus.ACTIVE
        self.start_date = timezone.now()
        # If first month is free, end date is 60 days from start (2 months)
        # First month free + first paid month
        if self.first_month_free and not self.free_month_used:
            self.end_date = self.start_date + timezone.timedelta(days=60)
            self.free_month_used = True
        else:
            self.end_date = self.start_date + timezone.timedelta(days=self.package.validity_days)
        self.save()
        
        self.user.is_subscriber = True
        self.user.save()
    
    def schedule_installation(self, installation_date):
        """Schedule installation date"""
        self.status = self.SubscriptionStatus.INSTALLATION
        self.installation_date = installation_date
        self.save()
    
    def complete_installation(self):
        """Mark installation as complete and activate billing"""
        self.installation_fee_paid = True
        self.activate()
        self.save()
    
    def is_active(self):
        """Check if subscription is currently active"""
        return (self.status == self.SubscriptionStatus.ACTIVE and 
                self.end_date and self.end_date > timezone.now())
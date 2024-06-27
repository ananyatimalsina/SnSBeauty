from django.db import models
from django.utils import timezone
from datetime import datetime

from phonenumber_field.modelfields import PhoneNumberField

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from django.contrib.auth import get_user_model

from .managers import CustomUserManager

# Create your models here.
class CustomUser(AbstractBaseUser, PermissionsMixin):
    phone = PhoneNumberField(_("Phone number"), unique=True, region="US")
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def get_username(self) -> str:
        return str(getattr(self, self.USERNAME_FIELD))

    def __str__(self):
        return str(self.phone)

class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.FloatField()
    duration = models.IntegerField(default=30)
    image = models.ImageField(upload_to='services/', default='services/default.jpg')

    def __str__(self):
        return self.name

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('passed', 'Passed'),
        ('canceled', 'Canceled')
    ]
    user = models.ForeignKey(get_user_model(), null=False, on_delete=models.CASCADE, editable=False)
    service = models.ForeignKey(Service, null=False, on_delete=models.CASCADE, editable=False) 
    date_created = models.DateField(default=timezone.now, editable=False)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def isDeletable(self):
        return (timezone.now().date() - self.date_created).days < 1

    def save(self, *args, **kwargs):
        current_datetime = timezone.now()
        appointment_datetime = datetime.combine(datetime.strptime(self.date, "%Y-%m-%d").date(), datetime.strptime(self.time, "%H:%M").time())
        if appointment_datetime.date() <= current_datetime.date() and current_datetime.time() < current_datetime.time():
            self.status = 'passed'
        super().save(*args, **kwargs)

    def __str__(self):
        if self.user:
            return self.user.get_username()
        else:
            return "Unknown User"
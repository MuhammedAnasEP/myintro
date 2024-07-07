from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True, verbose_name='email address')
    full_name = models.CharField(max_length=300)
    title = models.CharField(max_length=300)
    location = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=20)
    summary = models.TextField()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
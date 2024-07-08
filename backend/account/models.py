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
    
class SocialProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_profile')
    x = models.CharField(max_length=100, verbose_name='x-app')
    instagram = models.CharField(max_length=100, verbose_name='instagram')
    linkedin = models.CharField(max_length=100, verbose_name='linkedin')
    you_tube = models.CharField(max_length=100, verbose_name='youtube')
    
    class Meta:
        db_table = 'myintro_social_profile'
        verbose_name = 'Social Pofile'
        verbose_name_plural = 'Social Pofiles'
    
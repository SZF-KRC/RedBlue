# backend/api/models.py

'''
Defines core models for the application:
1. Order: Manages orders with fields for student info, study hours, status, and timestamps.
2. UserProfile: Tracks study hours and order completion status per user.
3. Reservation: Handles reservations with status updates, timing, and visibility settings.
4. ActiveUser: Logs last login times for user activity tracking.

These models support key functionalities in reservations, user profiles, and order management.
'''

from django.db import models
from django.contrib.auth.models import User

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    hours = models.PositiveIntegerField()
    terms_accepted = models.BooleanField()
    gdpr_accepted = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending') 

    def __str__(self):
        return f"Order by {self.student.username} for {self.hours} hours"

# Model representing a user profile with available study hours
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    study_hours = models.PositiveIntegerField(default=0)
    order_completed = models.BooleanField(default=False)  

    def __str__(self):
        return f"{self.user.username} - Available study hours: {self.study_hours}"  

    class Meta:
        verbose_name = "Student hour"  # Singular name for the model in Django Admin
        verbose_name_plural = "Student hours"  # Plural name for the model in Django Admin


# Model representing a reservation with a status and timestamps
class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE)  # The user making the reservation
    start_time = models.DateTimeField()  # Start time of the reservation
    end_time = models.DateTimeField()  # End time of the reservation
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')  # Status of the reservation
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp of when the reservation was created
    hidden_for_student = models.BooleanField(default=False)  # Visibility flag for the student

    def __str__(self):
        return f"{self.student.username} - {self.start_time} ({self.status})"  


# Model representing an active user for tracking purposes
class ActiveUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    last_login = models.DateTimeField(auto_now=True)  

    def __str__(self):
        return f"{self.user.username} is active" 
    
    class Meta:
        verbose_name = "History Login"  
        verbose_name_plural = "History Logins" 
    

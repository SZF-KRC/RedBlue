# backend/api/serializers.py
'''
Serializers for API data conversion and validation:
1. UserSerializer: Handles secure user creation with a write-only password and proper hashing.
2. ReservationSerializer: Serializes reservation data, ensuring read-only access to the student and created_at fields.
3. OrderSerializer: Manages order data serialization and enforces validation for unique email addresses, acceptance of terms, and GDPR policies.

These serializers enable secure and reliable data conversion between Django models and JSON, ensuring validation and consistency for API interactions.
'''


from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Reservation, Order

# Serializer for the User model, handles user creation and password write-only configuration
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]  # Exposes ID, username, and password fields
        extra_kwargs = {"password": {"write_only": True}}  # Password field is write-only for security

    def create(self, validated_data):
        # Creates a user with a hashed password by using create_user method
        user = User.objects.create_user(**validated_data)
        return user

# Serializer for the Reservation model, facilitates reservation data management
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'student', 'start_time', 'end_time', 'status', 'created_at']  # Exposes reservation fields
        read_only_fields = ['student', 'created_at']  # Fields student and created_at are read-only

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id', 'student', 'first_name', 'last_name', 'email', 'phone', 
            'address', 'hours', 'terms_accepted', 'gdpr_accepted', 'created_at', 'status', 'approved'
        ]
        read_only_fields = ['student', 'created_at']
    
    # Check if the email is already in use
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email address is already in use. Please use a different one.")
        return value
    
    # Verification that the user has confirmed the business conditions and GDPR
    def validate(self, data):
        if not data.get('terms_accepted'):
            raise serializers.ValidationError("You must accept the terms and conditions.")
        if not data.get('gdpr_accepted'):
            raise serializers.ValidationError("You must accept the GDPR policy.")
        return data



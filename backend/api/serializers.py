# backend/api/serializers.py
'''
Serializers for API data conversion:
1. UserSerializer: Manages user creation with write-only password for secure handling.
2. ReservationSerializer: Serializes reservation data with fields for timing, status, and read-only student info.
3. OrderSerializer: Serializes order data with validation for terms and GDPR acceptance.

These serializers enable model data to be converted to and from JSON for API interactions.
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

    def validate(self, data):
       # Verification that the user has confirmed the business conditions and GDPR
        if not data.get('terms_accepted'):
            raise serializers.ValidationError("You must accept the terms and conditions.")
        if not data.get('gdpr_accepted'):
            raise serializers.ValidationError("You must accept the GDPR policy.")
        return data


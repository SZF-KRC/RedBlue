# backend/api/apps.py

'''
Configuration for the API app in Django, setting default auto field and app name.
'''

from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

 

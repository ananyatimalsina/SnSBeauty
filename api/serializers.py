from rest_framework import serializers
from .models import Appointment, Service
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'phone', 'password']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    service = ServiceSerializer()
    isDeletable = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ["id", "service", "date", "time", "status", "isDeletable"]

    def get_isDeletable(self, obj):
        return obj.isDeletable()
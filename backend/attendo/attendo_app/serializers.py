from rest_framework import serializers
from .models import Student, Course, Unit, Attendance
from django.contrib.auth import authenticate


class StudentSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Student
        fields = ['full_name', 'student_id', 'password', 'course']

    # ✅ Must be defined at the class level — not inside Meta
    def create(self, validated_data):
        return Student.objects.create_user(**validated_data)


class StudentLoginSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(student_id=data['student_id'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid student ID or password")
        data['user'] = user
        return data


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'name', 'scheduled_time']


class AttendanceSerializer(serializers.ModelSerializer):
    unit_name = serializers.CharField(source='unit.name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['unit_name', 'timestamp']

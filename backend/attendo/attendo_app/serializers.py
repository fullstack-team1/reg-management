from rest_framework import serializers
from .models import Student, Course, Unit, Attendance
from django.contrib.auth import authenticate

class StudentRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Student
        fields = ['student_id', 'full_name', 'course', 'password']

    def create(self, validated_data):
        return Student.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        student = authenticate(**data)
        if not student:
            raise serializers.ValidationError("Invalid credentials")
        return student

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    unit_name = serializers.CharField(source='unit.name', read_only=True)
    course = serializers.CharField(source='unit.course.name', read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.utils.timezone import now
from .models import Unit, Attendance
from .serializers import (StudentRegisterSerializer, LoginSerializer, UnitSerializer, AttendanceSerializer)
from django.contrib.auth import login, logout
from datetime import datetime


# Register Student
class RegisterView(generics.CreateAPIView):
    serializer_class = StudentRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        token, _ = Token.objects.get_or_create(user=student)
        return Response({
            "token": token.key,
            "student_id": student.student_id,
            "full_name": student.full_name,
            "course": student.course.name
        }, status=status.HTTP_201_CREATED)


# Login
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=student)
        login(request, student)
        return Response({
            "token": token.key,
            "student_id": student.student_id,
            "full_name": student.full_name,
            "course": student.course.name
        })


# Logout
class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response({"message": "Logged out successfully."})


# Dashboard to show student's units
class DashboardView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        course = request.user.course
        units = Unit.objects.filter(course=course)
        serializer = UnitSerializer(units, many=True)
        return Response({
            "student": request.user.full_name,
            "course": course.name,
            "units": serializer.data
        })


# Mark Attendance
class MarkAttendanceView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        unit_id = request.data.get('unit_id')
        try:
            unit = Unit.objects.get(id=unit_id)
        except Unit.DoesNotExist:
            return Response({"error": "Unit not found"}, status=404)

        if unit.course != request.user.course:
            return Response({"error": "This unit is not in your course."}, status=403)

        # Check time
        current_time = now().time()
        if current_time < unit.scheduled_time:
            return Response({"error": "You can't mark attendance before the scheduled time."}, status=403)

        # Check if already marked today
        today = now().date()
        already_marked = Attendance.objects.filter(
            student=request.user, unit=unit, timestamp__date=today).exists()

        if already_marked:
            return Response({"error": "Attendance already marked for this unit today."}, status=400)

        Attendance.objects.create(student=request.user, unit=unit)
        return Response({"message": "Attendance marked successfully."})


# Attendance History
class AttendanceHistoryView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        records = Attendance.objects.filter(student=request.user).order_by('-timestamp')
        serializer = AttendanceSerializer(records, many=True)
        return Response(serializer.data)

from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.timezone import now  # ← correct import

from .models import Unit, Attendance
from .serializers import (
    StudentLoginSerializer,
    StudentSignupSerializer,
    UnitSerializer,
    AttendanceSerializer
)

# SignUp API
class SignupView(generics.CreateAPIView):
    serializer_class = StudentSignupSerializer


# Login API
class LoginView(APIView):
    def post(self, request):
        serializer = StudentLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })


# Dashboard units for student using ViewSet (for router compatibility)
class UnitListView(viewsets.ReadOnlyModelViewSet):
    serializer_class = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Unit.objects.filter(course=self.request.user.course)


# Attendance marking logic (still using APIView — not suited for router)
class MarkAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        unit_id = request.data.get("unit_id")
        try:
            unit = Unit.objects.get(id=unit_id, course=request.user.course)
        except Unit.DoesNotExist:
            return Response({"error": "Invalid Unit"}, status=400)

        current_time = now().time()

        already_marked = Attendance.objects.filter(
            student=request.user,
            unit=unit,
            timestamp__date=now().date()
        ).exists()

        if already_marked:
            return Response({"info": "Attendance already marked today"})

        if current_time >= unit.scheduled_time:
            Attendance.objects.create(student=request.user, unit=unit)
            return Response({"success": "Attendance marked successfully","unit": unit.name})
        else:
            return Response({"error": "Too early to mark attendance"}, status=403)


# Attendance History using ViewSet (for router)
class AttendanceHistoryView(viewsets.ReadOnlyModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Attendance.objects.filter(student=self.request.user).order_by('-timestamp')

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SignupView,
    LoginView,
    UnitListView,
    MarkAttendanceView,
    AttendanceHistoryView
)

router = DefaultRouter()
router.register(r'dashboard', UnitListView, basename='dashboard')
router.register(r'attendance/history', AttendanceHistoryView, basename='attendance-history')

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('attendance/mark/', MarkAttendanceView.as_view(), name='mark-attendance'),
    path('', include(router.urls)),
]

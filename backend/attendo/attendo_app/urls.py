from django.urls import path
from django.shortcuts import render
from . import views

urlpatterns = [
    # Render the welcome
    path('', lambda request: render(request, 'welcome.html'), name='api_root'),

    # The Auth routes
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # Student dashboard and actions
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('markattendance/', views.MarkAttendanceView.as_view(), name='markattendance'),
    path('history/', views.AttendanceHistoryView.as_view(), name='history'),
]

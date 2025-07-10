from django.contrib import admin
from .models import Course, Unit, Student

# Register your models here.
admin.site.register(Course)
admin.site.register(Unit)
admin.site.register(Student)
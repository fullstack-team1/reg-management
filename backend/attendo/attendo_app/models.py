from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

class Course(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Unit(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    scheduled_time = models.TimeField()

    def __str__(self):
        return f"{self.name} - {self.course.name}"

class StudentManager(BaseUserManager):
    def create_user(self, student_id, full_name, course, password=None):
        if not student_id:
            raise ValueError("Student must have a student ID")
        student = self.model(student_id=student_id, full_name=full_name, course=course)
        student.set_password(password)
        student.save(using=self._db)
        return student

class Student(AbstractBaseUser):
    student_id = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)

    USERNAME_FIELD = 'student_id'
    REQUIRED_FIELDS = ['full_name', 'course']

    objects = StudentManager()

    def __str__(self):
        return self.full_name

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'unit', 'timestamp')

    def __str__(self):
        return f"{self.student} - {self.unit} - {self.timestamp.date()}"
 
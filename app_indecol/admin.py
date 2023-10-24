from django.contrib import admin
from .models import *
from .forms import *
from django import forms

# Register your models here.


class ProjectAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Project._meta.get_fields()]
    form = ProjectAdminForm

admin.site.register(Project, ProjectAdmin)
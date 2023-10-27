from django.contrib import admin
from .models import *
from .forms import *
from django import forms



# Register your models here.


class ProjectAdmin(admin.ModelAdmin):
    
    list_display = [field.name for field in Project._meta.get_fields() if field.name != 'description'][:-4]
    form = ProjectAdminForm
    search_fields = ('methods','keywords','name','description')
    list_filter = ("keywords", "methods","type","groups")

    
# class PersonAdmin(admin.ModelAdmin):

#     list_display = [field.name for field in Person._meta.get_fields()]

# class GroupAdmin(admin.ModelAdmin):
#     list_display = [field.name for field in Group._meta.get_fields()][:-1]


admin.site.register(Project, ProjectAdmin)
admin.site.register(Person)
admin.site.register(Group)
admin.site.register(Partner)
admin.site.register(Ressource)


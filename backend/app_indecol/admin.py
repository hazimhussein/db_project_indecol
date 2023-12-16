from django.contrib import admin
from .models import *
from .forms import *
from django import forms
from django.db.models import Value
from django.db.models.functions import Concat
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.contrib.auth.admin import UserAdmin

# Register your models here.


class UsersAdmin(UserAdmin):

    list_display = ["id", "username", "email", "first_name", "last_name"]
class PersonAdmin(admin.ModelAdmin):
    form = PersonAdminForm

class ProjectAdmin(admin.ModelAdmin):

    list_display = ["name", "start_date", "keywords", "type", "assigned_persons", "assigned_resources", "assigned_partners"]
    
    form = ProjectAdminForm
    search_fields = ('methods','keywords','name','description', "persons__last_name", "persons__first_name")

    list_filter = ("keywords", "methods","type","groups","persons")





    @admin.display(description='Persons')
    def assigned_persons(self, obj):
        return [person for person in obj.persons.all()]


    @admin.display(description='resource')
    def assigned_resources(self, obj):
        return format_html("{}", mark_safe([f"<a href='../resource/{resource.id}'>{resource}</a>" for resource in obj.resources.all()]))
    
    @admin.display(description='Partners')
    def assigned_partners(self, obj):
        return format_html("{}", mark_safe([f"<a href='../partner/{partner.id}'>{partner}</a>" for partner in obj.partners.all()]))
        

admin.site.register(Project, ProjectAdmin)
admin.site.register(Person, PersonAdmin)
admin.site.register(Category)
admin.site.register(Group)
admin.site.register(Partner)
admin.site.register(Resource)
admin.site.register(User, UsersAdmin)
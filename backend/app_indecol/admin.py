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
        # list_url=[])
        # url =[resource.location for ressource in obj.ressources.all()]
        # print(url)
        # all_url ={}
        # all_text={}

        # for a in range(len(url)):
        #     print(a)
        #     all_url[a] ='<a href="%s">%s,</a>' % (url[a],obj.ressources.all()[a]) 
        # print('all url',all_url)

        # return format_html( all_url[0])        
        # # return format_html("<a href='{url}'>{}</a>",url=[ressource.location for ressource in obj.ressources.all()],obj.ressources.all())
        # list_url=[]
        # list_name=[]
        # url = [ressource.location for ressource in obj.ressources.all()]
        # for a in range(0,len(url)):
        #     print(a)
        #     print('a',url[a])
        #     print('b',obj.ressources.all()[a])
        #     list_url.append(url[a])
        #     list_name.append(obj.ressources.all()[a])
        # print(list_name,list_url)
        
        # return format_html("<a href='{url}'>{text}</a>", 
        #                        url = list_url,text='test')
        #print('liste complete',url,len(url))
        # for a in range(0,len(url)):
        #     print(url[a],obj.ressources.all())
        #for a in range(0,len(obj.ressources.all())):
            #print('a',a,obj.ressources.all()[a])
        #return format_html(u'<a href="{}">{}</a>', 
                               #url[0],  obj.ressources.all()[0])
        # list_url = []
        # list_name =[]
        # for a, b in zip(range(len(url)), range(len(obj.ressources.all()))):
        #     print(url[a])
        #     print(obj.ressources.all()[b])
        #     list_url.append(url[a])
        #     list_name.append(obj.ressources.all()[b])

        
        # return format_html(u'<a href="{}"</a>'.format(list_url, list_name))
            # print(url[a],obj.ressources.all()[a])
            # for a in range(0,len(obj.ressources.all())):
            #      print(obj.ressources.all()[a])
            # list_url.append(url[a])
            # list_name.append(obj.ressources.all()[0])
        # print('url',list_url,'name',list_name)
        # return format_html(u'<a href="{}">{}</a>', 
        #                           list_url,  list_name)




admin.site.register(Project, ProjectAdmin)
admin.site.register(Person)
admin.site.register(Category)
admin.site.register(Group)
admin.site.register(Partner)
admin.site.register(Resource)
admin.site.register(User, UsersAdmin)
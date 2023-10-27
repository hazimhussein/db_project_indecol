from django.shortcuts import render
from . import models
from django.views import generic
from django.db.models import Q
from .models import Project,Person
from . import forms

# Create your views here.

def is_valid_queryparam(param):
    return param != '' and param is not None

def index(request):
    return render(request,'index.html')

def about(request):
    return render(request,'about.html')

def projects(request):
    all_projects = models.Project.objects.all()
    return render(request,'projects.html',{'projects': all_projects})

def persons(request):
    all_persons= models.Person.objects.all()
    return render(request,'persons.html',{'persons': all_persons})


class ProjectDetailView(generic.DetailView):
    template_name = 'project_details.html'
    model = models.Project
    context_object_name = 'project'
    
class PersonDetailView(generic.DetailView):
    template_name = 'person_details.html'
    model = models.Person
    context_object_name = 'person'




def BootstrapFilterView(request):
    qs = Project.objects.all()
    
    name_or_id_contains_query = request.GET.get('name_or_id_contain')
    description_contains_query = request.GET.get('description_contains')
    
    date_min = request.GET.get('date_min')
    date_max = request.GET.get('date_max')
    pro_type = request.GET.get('pro_type')
    keyword = request.GET.get('keyword')
    persons= Person.objects.all()


    person = request.GET.get('person')
 

    categories = Project.objects.values_list('type', flat=True).distinct()
    print(categories)

   
    if name_or_id_contains_query!= '' and name_or_id_contains_query is not None:
        qs = qs.filter(Q(project_id__icontains=name_or_id_contains_query) | Q(name__icontains=name_or_id_contains_query)).distinct()


    elif description_contains_query != '' and description_contains_query is not None:
        qs = qs.filter(description__icontains=description_contains_query)


    keywords = forms.keyword_choices
    keywords_list=[]

    for a in keywords : 
        keywords_list.append(a[0])
    
    keywords=keywords_list
    print('keywords',keywords)
    

    if is_valid_queryparam(date_min) :
        qs = qs.filter(start_date__gte=date_min)
   
    if is_valid_queryparam(date_max) :
        qs = qs.filter(start_date__lt=date_max)

    if is_valid_queryparam(pro_type) and pro_type != 'Choose...' :
        qs = qs.filter(type=pro_type)

    if is_valid_queryparam(keyword) and keyword != 'Choose...' :
        qs = qs.filter(keywords__icontains=keyword)

    if is_valid_queryparam(person) and person != 'Choose...':
        qs = qs.filter(persons__icontains=person)



    context = {
        'queryset' :qs,
        'persons' :persons,
        'categories':categories,
        'keywords' : keywords,

    }

    return render(request, "bootstrap_form.html",context)

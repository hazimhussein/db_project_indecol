from django.shortcuts import render
from . import models
from django.views import generic
from django.db.models import Q
from .models import Project,Person

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
    print('qs',qs)
    name_contains_query = request.GET.get('name_contains')
    description_contains_query = request.GET.get('description_contains')
    name_or_description_contains_query = request.GET.get('name_or_description_contains')

    date_min = request.GET.get('date_min')
    date_max = request.GET.get('date_max')
    person = request.GET.get('person')
    persons= Person.objects.all()
    #print(students)


    if name_contains_query != '' and name_contains_query is not None:
        qs = qs.filter(name__icontains=name_contains_query )


    elif description_contains_query != '' and description_contains_query is not None:
        qs = qs.filter(description__icontains=description_contains_query)
   
 
    # elif name_or_description_contains_query != '' and name_or_description_contains_query is not None:
    #     qs = qs.filter(Q(name__icontains=name_or_description_contains_query) | Q(description_contains_query=name_or_description_contains_query)).distinct()

    if is_valid_queryparam(date_min) :
        qs = qs.filter(start_date__gte=date_min)
   
    if is_valid_queryparam(date_max) :
        qs = qs.filter(start_date__lt=date_max)

    if is_valid_queryparam(person) and person != 'Choose...':
        print('author',person, persons)
        qs = qs.filter(persons__last_name=person)
     
   
    context = {
        'queryset' :qs,
        'persons' :persons,

    }

    return render(request, "bootstrap_form.html",context)
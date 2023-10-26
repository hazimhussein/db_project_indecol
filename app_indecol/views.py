from django.shortcuts import render
from . import models
from django.views import generic

# Create your views here.

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



# def BootstrapFilterView(request):
#     qs = Project.objects.all()
#     print('qs',qs)
    # name_contains_query = request.GET.get('name_contains')
    # description_contains_query = request.GET.get('description_contains')
    # date_min = request.GET.get('date_min')
    # date_max = request.GET.get('date_max')
    # student = request.GET.get('student')
    # students= Student.objects.all()
    # #print(students)


    # if name_contains_query != '' and name_contains_query is not None:
    #     qs = qs.filter(name__icontains=name_contains_query)


    # if description_contains_query != '' and description_contains_query is not None:
    #     qs = qs.filter(description__icontains=description_contains_query)
   
 

    # if is_valid_queryparam(date_min) :
    #     qs = qs.filter(start_date__gte=date_min)
   
    # if is_valid_queryparam(date_max) :
    #     qs = qs.filter(start_date__lt=date_max)

    # if is_valid_queryparam(student) and student != 'Choose...':
    #     print('author',student, students)
    #     qs = qs.filter(students__last_name=student)
     
   
    # context = {
    #     'queryset' :qs,
    #     'students' :students,

    # }

    # return render(request, "bootstrap_form.html",context)
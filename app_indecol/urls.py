from django.urls import path
from . import views
from app_indecol.views import BootstrapFilterView

urlpatterns = [
    path('', views.index, name = 'index'),
    path('about', views.about, name = 'about'),
    path('projects/', views.projects, name = 'projects'),
    path('persons', views.persons, name = 'persons'),
    path('project/<str:pk>', views.ProjectDetailView.as_view(), name = 'project_details'),
    path('person/<str:pk>', views.PersonDetailView.as_view(), name = 'person_details'),

    path('bootstrap/',BootstrapFilterView,name = 'bootstrap_form')
]

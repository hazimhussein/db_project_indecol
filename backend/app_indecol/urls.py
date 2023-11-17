from django.urls import path, include
from . import views, api
from app_indecol.views import BootstrapFilterView
from rest_framework import routers

router = routers.DefaultRouter()
router.register("person", api.PersonViewSet)
router.register("partner", api.PartnerViewSet)
router.register("group", api.GroupViewSet)
router.register("user", api.UserViewSet)
router.register("ressource", api.RessourceViewSet)
router.register("project", api.ProjectViewSet)

urlpatterns = [
    path('', views.index, name = 'index'),
    path('about', views.about, name = 'about'),
    path('projects/', views.projects, name = 'projects'),
    path('persons', views.persons, name = 'persons'),
    path('project/<str:pk>', views.ProjectDetailView.as_view(), name = 'project_details'),
    path('person/<str:pk>', views.PersonDetailView.as_view(), name = 'person_details'),
    
    path('api/', include((router.urls, 'app_indecol'))),
    path('bootstrap/',BootstrapFilterView,name = 'bootstrap_form')
]

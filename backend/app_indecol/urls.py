from django.urls import path, include
from . import api
from rest_framework import routers

router = routers.DefaultRouter()
router.register("faq", api.FaqViewSet)
router.register("category", api.CategoryViewSet)
router.register("fieldoption", api.FieldOptionViewSet)
router.register("team", api.TeamViewSet)
router.register("person", api.PersonViewSet)
router.register("partner", api.PartnerViewSet)
router.register("group", api.GroupViewSet)
router.register("user", api.UserViewSet)
router.register("resource", api.ResourceViewSet)
router.register("project", api.ProjectViewSet)

urlpatterns = [
    path('api/', include((router.urls, 'app_indecol'))),
    path('api/login', api.LDAPLogin.as_view()),
    path('api/logout', api.LDAPLogout.as_view()),
    path('api/loggeduser', api.UserView.as_view()),
]

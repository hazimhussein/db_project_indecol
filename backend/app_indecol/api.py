from django.contrib.auth import authenticate, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import permissions, status, viewsets
from .models import *
from .serializers import *
from django.contrib.sessions.models import Session
from importlib import import_module
from  django.contrib.auth.middleware import get_user
from django.http import HttpRequest
from rest_framework.metadata import SimpleMetadata
from rest_framework.relations import ManyRelatedField, RelatedField, PrimaryKeyRelatedField


class MyMetaData(SimpleMetadata):

    def get_field_info(self, field):
        field_info = super(MyMetaData, self).get_field_info(field)
        if isinstance(field, (PrimaryKeyRelatedField)):
            field_info['type'] = "foreign_key"
            field_info['name'] = field.queryset.model.__name__.lower()
        elif isinstance(field, (RelatedField, ManyRelatedField)):
            field_info['type'] = "foreign_key_many"
            field_info['name'] = field.child_relation.queryset.model.__name__.lower()
        return field_info

class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    metadata_class = MyMetaData
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class FieldOptionsViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    metadata_class = MyMetaData
    queryset = FieldOptions.objects.all()
    serializer_class = FieldOptionsSerializer
class TeamViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    metadata_class = MyMetaData
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
class PersonViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    metadata_class = MyMetaData
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    metadata_class = MyMetaData
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    metadata_class = MyMetaData
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class PartnerViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    metadata_class = MyMetaData
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer

class ResourceViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    metadata_class = MyMetaData
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    

class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    metadata_class = MyMetaData
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class LDAPLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    # authentication_classes = (SessionAuthentication,)
    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user, backend="django_python3_ldap.auth.LDAPBackend")
            try:
                login_user = User.objects.get(username=user.username)
            except:
                login_user = User(user)
                login_user.save()
                
            return Response(UserSerializer(login_user).data, status=status.HTTP_200_OK)

class LDAPLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
class UserView(APIView):
    permission_classes = (permissions.AllowAny,)
    # permission_classes = (permissions.IsAuthenticated,)
    # authentication_classes = (SessionAuthentication,)
    ##
    def get(self, request):
        serializer = UserSerializer(request.user)
        user = get_user(request) 
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
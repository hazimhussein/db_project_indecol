from django.contrib.auth import authenticate, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import permissions, status, viewsets
from .models import *
from .serializers import *

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer

class RessourceViewSet(viewsets.ModelViewSet):
    queryset = Ressource.objects.all()
    serializer_class = RessourceSerializer
    

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class LDAPLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    ##
    def post(self, request):
        # user_obj = authenticate(username=request.data['username'],
        #                         password=request.data['password'])
        # print(user_obj.__dict__)
        # login(request, user_obj, backend="django_python3_ldap.auth.LDAPBackend")
        # data={'detail': 'User logged in successfully'}
        # return Response(data, status=200)
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user, backend="django_python3_ldap.auth.LDAPBackend")
            return Response(serializer.data, status=status.HTTP_200_OK)

class LDAPLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', "first_name", "last_name", "email")


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("__all__")
class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ("__all__")
    
    def to_representation(self, instance):
        self.fields['users'] =  UserSerializer(many=True, read_only=True)
        return super(PersonSerializer, self).to_representation(instance)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("__all__")
    
    def to_representation(self, instance):
        self.fields['users'] =  UserSerializer(many=True, read_only=True)
        self.fields['persons'] =  PersonSerializer(many=True, read_only=True)
        return super(GroupSerializer, self).to_representation(instance)


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ("__all__")
    
    def to_representation(self, instance):
        self.fields['users'] =  UserSerializer(many=True, read_only=True)
        return super(PartnerSerializer, self).to_representation(instance)


class RessourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ressource
        fields = ("__all__")

    def to_representation(self, instance):
        self.fields['users'] =  UserSerializer(many=True, read_only=True)
        return super(RessourceSerializer, self).to_representation(instance)


class MasterProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name"]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('__all__')
    
    def to_representation(self, instance):
        self.fields['users'] =  UserSerializer(many=True, read_only=True)
        self.fields['persons'] =  PersonSerializer(many=True, read_only=True)
        self.fields['groups'] =  GroupSerializer(many=True, read_only=True)
        self.fields['partners'] =  PartnerSerializer(many=True, read_only=True)
        self.fields['ressources'] =  RessourceSerializer(many=True, read_only=True)
        self.fields['master_projects'] =  MasterProjectSerializer(many=True, read_only=True)
        return super(ProjectSerializer, self).to_representation(instance)
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    def check_user(self, clean_data):
        user = authenticate(username=clean_data['username'], password=clean_data['password'])
        
        if not user:
            raise LookupError('user not found')
        return user
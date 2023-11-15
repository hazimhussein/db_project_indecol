from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')


class PersonSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)
    class Meta:
        model = Person
        fields = ("__all__")


class GroupSerializer(serializers.ModelSerializer):
    persons = PersonSerializer(many=True)
    users = UserSerializer(many=True)

    class Meta:
        model = Group
        fields = ("__all__")


class PartnerSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)
    class Meta:
        model = Partner
        fields = ("__all__")


class RessourceSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)
    class Meta:
        model = Ressource
        fields = ("__all__")


class MasterProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name"]

class ProjectSerializer(serializers.ModelSerializer):
    persons = PersonSerializer(many=True)
    groups = GroupSerializer(many=True)
    partners = PartnerSerializer(many=True)
    ressources = RessourceSerializer(many=True)
    users = UserSerializer(many=True)
    master_projects = MasterProjectSerializer(many=True)

    class Meta:
        model = Project
        fields = ('__all__')
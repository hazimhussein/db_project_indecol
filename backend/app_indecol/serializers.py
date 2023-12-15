from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', "first_name", "last_name", "email", "is_superuser")


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


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ("__all__")

    def to_representation(self, instance):
        self.fields['users'] =  UserSerializer(many=True, read_only=True)
        return super(ResourceSerializer, self).to_representation(instance)


class RelatedSerializer(serializers.ModelSerializer):
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
        self.fields['resources'] =  ResourceSerializer(many=True, read_only=True)
        self.fields['related'] =  RelatedSerializer(many=True, read_only=True)
        return super(ProjectSerializer, self).to_representation(instance)
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    def check_user(self, clean_data):
        user = authenticate(username=clean_data['username'], password=clean_data['password'])
        
        if not user:
            raise LookupError('user not found')
        return user
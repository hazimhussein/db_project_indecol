from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password



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
    password = serializers.CharField(
        write_only=True,
        required=True,
        help_text='Leave empty if no change needed',
        style={'input_type': 'password', 'placeholder': 'Password'}
    )
    class Meta:
        model = User
        fields = ('id', 'username', "password", "first_name", "middle_name", "last_name", "email", "start_date", "end_date", "roles", "groups", "is_superuser")

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserSerializer, self).create(validated_data)
    
    def update(self, instance, validated_data):
        if validated_data.get('password') != None:
            validated_data['password'] = make_password(validated_data.get('password'))
        
        return super(UserSerializer, self).update(instance, validated_data)
    
    def to_representation(self, instance):
        self.fields['roles'] =  FieldOptionSerializer(many=True, read_only=True)
        self.fields['groups'] =  GpSerializer(many=True, read_only=True)
        return super(UserSerializer, self).to_representation(instance)


class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Faq
        fields = ("__all__")

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("__all__")

class FieldOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldOption
        fields = ("__all__")
    
    def to_representation(self, instance):
        self.fields['table'] =  CategorySerializer(many=False, read_only=True)
        return super(FieldOptionSerializer, self).to_representation(instance)
    
class GpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name", "start_date", "end_date", )

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ("__all__")
    
    def to_representation(self, instance):
        self.fields['roles'] =  FieldOptionSerializer(many=True, read_only=True)
        self.fields['groups'] =  GpSerializer(many=True, read_only=True)
        self.fields['users'] =  UserSerializer(many=True, read_only=True)
        return super(PersonSerializer, self).to_representation(instance)

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ("__all__")
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
        self.fields['type'] =  FieldOptionSerializer(many=False, read_only=True)
        self.fields['users'] =  UserSerializer(many=True, read_only=True)
        return super(PartnerSerializer, self).to_representation(instance)


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ("__all__")

    def to_representation(self, instance):
        self.fields['type'] =  FieldOptionSerializer(many=False, read_only=True)
        self.fields['users'] =  UserSerializer(many=True, read_only=True)
        return super(ResourceSerializer, self).to_representation(instance)


class RelatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "project_id", "name"]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('__all__')
    
    def to_representation(self, instance):
        self.fields['keywords'] =  FieldOptionSerializer(many=True, read_only=True)
        self.fields['methods'] =  FieldOptionSerializer(many=True, read_only=True)
        self.fields['type'] =  FieldOptionSerializer(many=False, read_only=True)
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
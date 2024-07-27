from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime


# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True, null=True)

    middle_name = models.CharField(unique=False, null=True, blank=True, max_length=50)

    start_date = models.DateField(null=True, blank=True)

    end_date = models.DateField(null=True, blank=True)

    roles = models.ManyToManyField("FieldOption", blank=True)
    groups = models.ManyToManyField("Group", through="Group_users", blank=True)

    def __str__(self):
        return self.first_name + " " + self.last_name


class Faq(models.Model):
    question = models.TextField(null=False, blank=False, max_length=5000)

    answer = models.TextField(null=True, blank=True, max_length=5000)

    manual = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)

    media = models.FileField(null=True, upload_to="media/")


class Category(models.Model):
    name = models.CharField(unique=False, null=False, blank=False, max_length=50)

    description = models.TextField(null=True, blank=True, max_length=5000)

    icon = models.FileField(null=True, upload_to="media/")

    def __str__(self):
        return self.name


class FieldOption(models.Model):
    name = models.CharField(unique=False, null=False, blank=False, max_length=50)
    value = models.CharField(unique=False, null=True, blank=True, max_length=60)
    table = models.ForeignKey(Category, on_delete=models.CASCADE)

    field = models.CharField(unique=False, null=False, blank=False, max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ("name", "table", "field")


class Team(models.Model):
    first_name = models.CharField(unique=False, null=False, blank=False, max_length=50)

    last_name = models.CharField(unique=False, null=False, blank=False, max_length=50)

    url = models.CharField(unique=False, null=True, blank=True, max_length=100)

    img_url = models.CharField(unique=False, null=True, blank=True, max_length=100)

    role = models.CharField(unique=False, null=True, blank=True, max_length=100)

    email = models.CharField(unique=False, null=True, blank=True, max_length=50)

    phone = models.CharField(unique=False, null=True, blank=True, max_length=15)

    def __str__(self):
        return self.first_name + " " + self.last_name


class Person(models.Model):

    first_name = models.CharField(unique=False, null=False, blank=False, max_length=50)

    middle_name = models.CharField(unique=False, null=True, blank=True, max_length=50)

    last_name = models.CharField(unique=False, null=False, blank=False, max_length=50)

    email = models.EmailField(null=True)

    start_date = models.DateField(null=True, blank=True)

    end_date = models.DateField(null=True, blank=True)

    roles = models.ManyToManyField(FieldOption, blank=True)
    groups = models.ManyToManyField("Group", through="Group_persons", blank=True)

    users = models.ManyToManyField(User)

    def __str__(self):
        return self.first_name + " " + self.last_name


class Group(models.Model):

    name = models.CharField(unique=True, null=False, blank=False, max_length=100)

    start_date = models.DateField(null=True, blank=True)

    end_date = models.DateField(null=True, blank=True)

    persons = models.ManyToManyField(Person)

    users = models.ManyToManyField(User)

    def __str__(self):
        return self.name


class Partner(models.Model):

    name = models.CharField(unique=True, null=False, blank=False, max_length=100)
    description = models.TextField(null=True, blank=True, max_length=5000)

    url = models.CharField(null=True, blank=True, max_length=200)

    type = models.ForeignKey(
        FieldOption,
        on_delete=models.SET_NULL,
        null=True,
        related_name="partner_type_field",
    )

    users = models.ManyToManyField(User)

    def __str__(self):
        return self.name


# function to create a path for saved files <entry_name>/<current_time>/<filename>
def resource_path(instance, filename):
    now = datetime.now()
    current_time = now.strftime("%Y.%m.%d_%H.%M.%S")

    return "files/{0}/{1}/{2}".format(instance.full_name, current_time, filename)


class Resource(models.Model):

    full_name = models.CharField(null=False, blank=False, max_length=100)

    description = models.TextField(null=True, blank=True, max_length=5000)

    location = models.CharField(null=True, blank=True, max_length=200)

    type = models.ForeignKey(
        FieldOption,
        on_delete=models.SET_NULL,
        null=True,
        related_name="resource_type_field",
    )

    confidential = models.BooleanField(default=False)

    file = models.FileField(null=True, upload_to=resource_path)

    users = models.ManyToManyField(User)

    def __str__(self):
        return self.full_name


class Project(models.Model):

    project_id = models.CharField(unique=True, null=False, blank=False, max_length=50)

    name = models.CharField(null=False, blank=False, max_length=200)

    description = models.TextField(null=True, blank=True, max_length=5000)

    start_date = models.DateField(null=True, blank=True)

    end_date = models.DateField(null=True, blank=True)

    keywords = models.ManyToManyField(
        FieldOption, related_name="project_keywords_field", blank=True
    )
    methods = models.ManyToManyField(
        FieldOption, related_name="project_methods_field", blank=True
    )

    type = models.ForeignKey(
        FieldOption,
        on_delete=models.SET_NULL,
        null=True,
        related_name="project_type_field",
    )

    persons = models.ManyToManyField(Person, blank=True)

    groups = models.ManyToManyField(Group, blank=True)
    partners = models.ManyToManyField(Partner, blank=True)
    resources = models.ManyToManyField(Resource, blank=True)

    related = models.ManyToManyField("self", blank=True)

    users = models.ManyToManyField(User)

    def __str__(self):
        return self.project_id

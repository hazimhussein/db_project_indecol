from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.


group_choices = (
    ('Cherubini Group','Francesco Cherubini Group'),
    ('Verones Group','Francesca Verones Group'),
    ('Stømman Group','Anders Strømman Group'),
    ('Hertwich Group','Edgar Hertwich Group'),
    ('Müller Group','Daniel Müller Group'),
    ('Pettersen Group','Johan Pettersen Group'),
    ('Ottelin Group','Juudit Ottelin Group'),
    ('IEDL Group','Konstantin Stadler Group'),
)

role_choices = (
    ('Master Student','Master Student'),
    ('PhD','PhD'),
    ('PostDoc','PostDoc'),
    ('Enginner','Enginner'),
    ('Associate Professor','Associate Professor'),
    ('Researcher','Researcher'),
    ('Professor','Professor'),
)

project_type_choices = (
    ('Master Project','Master Project'),
    ('PhD Project','PhD Project'),
    ('PostDoc Project','PostDoc Project'),
    ('Other type', 'Other type'),
    ('European Project','European Project')
)

partner_choices = (
    ('sintef','Sintef'),
    ('equinor','Equinor'),
    ('TK','Trondheim Kommune'),
    ('PUCP','Pontificia Universidad Católica del Perú'),
    ('ETH','ETH Zürich'),
    ('SUA','Sokoine University of Agriculture'),
    ('Government of the Netherlands','Government of the Netherlands'),
    ('Leiden University','Leiden University'),
    ('APRI','Africa Prolicy Research Institute'),
    ('WU','Vienna University of Economics and Business'),
    ('SGS','SGS'),
    ('No External Partners','No External Partners' )
)

partner_type_choices = (
    ('University','University'),
    ('Private sector','Private sector'),
    ('Industry','Industry'),
    ('N/A','N/A')
)

ressource_type_choices = (
    ('Software','Software'),
    ('Article','Article'),
    ('Website','Website'),
    ('Report','Report'),
)


class User(AbstractUser):
    pass

class Category(models.Model):
    name = models.CharField(
        unique=False,
        null=False,
        blank=False,
        max_length=50
    )

    description = models.TextField(
        null = False,
        blank= False,
        max_length=2000
    )

    def __str__(self):
        return self.name
class Person(models.Model):


    first_name = models.CharField(
        unique=False,
        null=False,
        blank=False,
        max_length=50
    )

    middle_name = models.CharField(
        unique=False,
        null=True,
        blank=True,
        max_length=50
    )

    last_name = models.CharField(
        unique=False,
        null=False,
        blank=False,
        max_length=50
    )

    start_date= models.DateField(
        null = False,
        blank=False
    )

    end_date= models.DateField(
        null=True,
        blank = True
    )

    role = models.CharField(choices = role_choices,
                            max_length=50)
    
    users = models.ManyToManyField(User)
    
    def __str__(self):
        return self.first_name + ' ' + self.last_name
    
class Group(models.Model):

    name = models.CharField(choices = group_choices,
                            max_length=50)


    start_date= models.DateField(
        null = False,
        blank=False
    )

    end_date= models.DateField(
        null=True,
        blank = True
    )

    persons = models.ManyToManyField(
        Person
    )

    users = models.ManyToManyField(User)

    def __str__(self):
        return self.name
    
class Partner(models.Model):


    name= models.CharField(
        null = False,
        choices = partner_choices,
        max_length=50)

    description = models.TextField(
        null = False,
        blank= False,
        max_length=2000
    )

    url= models.CharField(
        null = False,
        blank=False,
        max_length=200
        )

    type= models.CharField(choices = partner_type_choices,
                            max_length=50)
    
    users = models.ManyToManyField(User)

    def __str__(self):
        return self.name

class Ressource(models.Model):


    full_name= models.CharField(
        null = False,
        blank= False,
        max_length=100

        )

    description = models.TextField(
        null = False,
        blank= False,
        max_length=2000
    )

    location= models.CharField(
        null = False,
        blank=False,
        max_length=200
        )

    type= models.CharField(choices = ressource_type_choices,
                            max_length=50)
    
    users = models.ManyToManyField(User)


    def __str__(self):
        return self.full_name
    
class Project(models.Model):

    project_id = models.CharField(
        unique=True,
        null=False,
        blank=False,
        max_length=50
    )


    name= models.CharField(
        null=False,
        blank=False,
        max_length=200
    )

    description = models.TextField(
        null = False,
        blank= False,
        max_length=2000
    )

    start_date= models.DateField(
        null = False,
        blank=False
    )

    end_date= models.DateField(
        null=True,
        blank = True
    )

    keywords = models.CharField(max_length=100)
    methods = models.CharField(max_length=50)

    type = models.CharField(choices = project_type_choices,
                            max_length=50,
                            default='-')
    
    persons = models.ManyToManyField(Person)

    groups = models.ManyToManyField(Group)
    partners = models.ManyToManyField(
        Partner,
        blank=True
    )
    ressources = models.ManyToManyField(
        Ressource, blank=True
    )

    master_projects = models.ManyToManyField("self", blank=True)

    users = models.ManyToManyField(User)

    def __str__(self):
        return self.project_id
    








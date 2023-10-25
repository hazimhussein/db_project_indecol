from django.db import models

# Create your models here.


group_choices = (
    ('Cherubini Group','Francesco Cherubini Group'),
    ('Stømman Group','Anders Strømman Group'),
    ('Hertwich Group','Edgar Hertwich Group'),
    ('Müller Group','Daniel Müller Group'),
    ('Pettersen Group','Johan Pettersen Group'),
    ('Stadler Group','Konstantin Stadler Group'),
)

role_choices = (
    ('M','Master Student'),
    ('PhD','PhD'),
    ('PD','PostDoc'),
    ('E','Enginner'),
    ('AP','Associate Professor'),
    ('R','Researcher'),
    ('P','Professor'),
)

project_type_choices = (
    ('M','Master Project'),
    ('PhD','PhD Project'),
    ('PD','PostDoc Project'),
    ('O', 'Other type'),
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
)

partner_type_choices = (
    ('University','University'),
    ('Private sector','Private sector'),
    ('Industry','Industry'),
)

ressource_type_choices = (
    ('Software','Software'),
    ('Article','Article'),
    ('Website','Website'),
    ('Report','Report'),
)



class Person(models.Model):

    person_id = models.CharField(
        unique=True,
        null=False,
        blank=False,
        max_length=50
    )

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
        max_length=50
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

    keywords = models.CharField(max_length=50)
    methods = models.CharField(max_length=50)

    type = models.CharField(choices = project_type_choices,
                            max_length=50,
                            default='-')
    
    persons = models.ManyToManyField(
        Person
    )

    groups = models.ManyToManyField(
        Group
    )
    partners = models.ManyToManyField(
        Partner
    )
    ressources = models.ManyToManyField(
        Ressource 
    )
    
    def __str__(self):
        return self.project_id
    









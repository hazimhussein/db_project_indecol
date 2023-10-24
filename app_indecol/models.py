from django.db import models

# Create your models here.

keyword_choices = (
    ('sustainibility','SUSTAINIBILITY'),
    ('car','CAR'),
    ('buildings', 'BUILDINGS'),
    ('recycling', 'RECYCLING'),
    ('materials', 'MATERIALS'),    
)

method_choices = (
    ('lca','Life Cycle Assessment'),
    ('eemrio','Environmentally Extended Multi-Regional Input-Output analysis'),
    ('ia', 'Impact Assessment'),
    ('mfa', 'Material Flow Analysis'),
)

group_choices = (
    ('Cherubini Group','Francesco Cherubini Group'),
    ('Verones Group','Francesca Verones Group'),
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

partner_choices = (
    ('sintef','Sintef'),
    ('equinor','Equinor'),
    ('TK','Trondheim Kommune'),

)

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
    )

    keywords = models.CharField(
        choices=keyword_choices,
        max_length=14,
        default='Choose'
    )

    methods = models.CharField(
        choices = method_choices,
        max_length=6,
        default='Choose'
    )







    
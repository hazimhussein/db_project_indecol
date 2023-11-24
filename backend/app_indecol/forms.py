from django import forms
from django.forms import ModelForm
from .models import *



keyword_choices = (
    ('circular economy','CIRCULAR ECONOMY'),
    ('resources','RESOURCES'),
    ('materials', 'MATERIALS'),
    ('recycling', 'RECYCLING'),
    ('environment', 'ENVIRONMENT'),  
    ('ecosystems','ECOSYSTEMS'),
    ('bioresources','BIORESOURCES'),
    ('biodiversity', 'BIODIVERSITY'),
    ('climate', 'CLIMATE'),
    ('bioenergy', 'BIOENERGY'),  
    ('food','FOOD'),
    ('biomaterials','BIOMATERIALS'),
    ('energy', 'ENERGY'),
    ('transport', 'TRANSPORT'),
    ('buildings', 'BUILDINGS'),  
    ('pollution','POLLUTION'),
    ('transformation pathways','TRANSFORMATION PATHWAYS'),
    ('human settlement', 'HUMAN SETTLEMENT'),
    ('Sustainable Production','SUSTAINABLE PRODUCTION' ),
    ('Consumption','CONSUMPTION'),  
    ('Production','PRODUCTION'),
    ('trade','TRADE'),
    ('economic growth','ECONOMIC GROWTH'),
    ('sustainability', 'SUSTAINABILITY'),
    ('exiobase', 'EXIOBASE'),
    ('database', 'DATABASE'),

)

method_choices = (
    ('lca','Life Cycle Assessment'),
    ('eemrio','Environmentally Extended Multi-Regional Input-Output analysis'),
    ('ia', 'Impact Assessment'),
    ('mfa', 'Material Flow Analysis'),
    ('sqlite','Sqlite')
)


class ProjectAdminForm(ModelForm):
    keywords = forms.MultipleChoiceField(choices = keyword_choices)
    methods = forms.MultipleChoiceField(choices = method_choices)

    class Meta:
        model = Project
        fields = '__all__'

    def clean(self):
        keywords = self.cleaned_data['keywords']
        methods = self.cleaned_data['methods']

        self.cleaned_data['keywords'] = ', '.join(keywords).replace("'", "")
        self.cleaned_data['methods'] = ', '.join(methods).replace("'", "")

        return self.cleaned_data
    



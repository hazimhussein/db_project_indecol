from django import forms
from django.forms import ModelForm
from .models import *

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


class ProjectAdminForm(ModelForm):
    keywords = forms.MultipleChoiceField(choices = keyword_choices)
    methods = forms.MultipleChoiceField(choices = method_choices)

    class Meta:
        model = Project
        fields = '__all__'

    def clean(self):
        keywords = self.cleaned_data['keywords']
        methods = self.cleaned_data['methods']

        self.cleaned_data['keywords'] = ', '.join(keywords)
        self.cleaned_data['methods'] = ', '.join(methods)

        return self.cleaned_data
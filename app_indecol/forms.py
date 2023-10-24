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

class ProjectAdminForm(ModelForm):
    keywords = forms.MultipleChoiceField(choices = keyword_choices)

    class Meta:
        model = Project
        fields = '__all__'

    def clean(self):
        keywords = self.cleaned_data['keywords']

        self.cleaned_data['keywords'] = ', '.join(keywords)
        return self.cleaned_data
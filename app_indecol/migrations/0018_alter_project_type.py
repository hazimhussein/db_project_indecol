# Generated by Django 4.2.6 on 2023-10-25 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_indecol', '0017_alter_group_name_alter_partner_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='type',
            field=models.CharField(choices=[('M', 'Master Project'), ('PhD', 'PhD Project'), ('PD', 'PostDoc Project'), ('O', 'Other type'), ('EU', 'EUropean Project')], default='-', max_length=50),
        ),
    ]
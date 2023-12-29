# Generated by Django 4.2.6 on 2023-12-21 22:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_indecol', '0010_fieldoptions_remove_person_roles_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('url', models.CharField(blank=True, max_length=100, null=True)),
                ('img_url', models.CharField(blank=True, max_length=100, null=True)),
                ('role', models.CharField(blank=True, max_length=100)),
            ],
        ),
    ]

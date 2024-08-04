---
layout: default
title: Backend
nav_order: 2
has_children: true
permalink: backend
---

# Backend ([Django][django-website])

The backend is built using [Django framework][django-website] which is a python framework for web development providing many convenient tools to build web servers, databases, API endpoints, .etc.. For this project some tools were used mainly [Django rest framework][djangorestframework] to build API endpoints for data in the database. As the main aim of the backend in this project is to create the database and serve API endpoints to be used by the frontend.
{: .fs-6 .fw-300 }

---

General Structure
-----

Django utilizes a structure of main project with installed django apps according to needs, for this project, there is only one app named "app_indecol" where specifications for the database and different API endpoints are initialized. Thus, the backend is structured like so

```
│   manage.py
├───app_indecol
├───project
└───static
```

- manage.py: is where the [django project manager][django-manager] lies. Django incorporates a manager that is responsible to handle the different project actions and it usually follows the following format:  
  `python manage.py <desired django command>` 
- app_indecol: where specifications for the database and different API endpoints are initialized.
- project: is where the general configurations for the project is stored.
- static: holds the static files (images, styles, javascript files) used by django services like the admin pages, .etc, but not by the main website as the website uses a seperate frontend. By default, this folder is not created inside the django project and in development, django doesn't require to have it, while in production it is required to have to run the django services properly. This is done easily by running the following django command:  
  `python manage.py collectstatic`


Important Django Commands
-------

Whenever new specifications are added to the database, django has to incorporate them into the database, this is done through:  
`python manage.py makemigration`
This will create the code representing the changes that were implemented, and it is stored in a new file having the name "<number of migration>_<something that represents the new changes>" in the following directory: 

```
├───app_indecol
│   ├───migrations
```

It is rare that it needs to be checked and modified. Usually, the new implementation just needs to be implemented, so after creating the migration file, implement by running:  
`python manage.py migrate`  
If it ran successfully, the new changes should be reflected in the database and the app can be ran safely. 


Helpful Django Commands
-------

- To run the app in development, use the command:  
  `python manage.py runserver`  
  This will run the development server on 127.0.0.1:8000. To specify custom host and port, they can be added to the command as such:  
  `python manage.py runserver <custom host>:<custom port>`  

- As mentioned above, the static folder should be created before production, the app would run successfully without it but the the admin page would be loaded without styles, using the command:  
  `python manage.py collectstatic`  

- Data in the database can be exported or imported, e.g to have some data in the database while development, to export the data run:  
  `python manage.py dumpdata > <filename>.json`  
  This will save the new file in the following directory:  
  ```
  ├───app_indecol
  │   ├───fixtures
  ```  
- To import data into the database, create the corresponding json files and save them in the above directory, then run:  
  `python manage.py loaddata <filename>.json`  
  



[django-website]:https://www.djangoproject.com/
[djangorestframework]:https://www.django-rest-framework.org/
[django-manager]:https://docs.djangoproject.com/en/5.0/topics/db/managers/
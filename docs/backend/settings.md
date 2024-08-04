---
layout: default
title: General Configurations
nav_order: 1
parent: Backend
permalink: backend/settings
---

Structure
======

The general configuration of the backend are saved inside the `/project` directory, like so:  
```
├───project
│   │   asgi.py
│   │   settings.py
│   │   urls.py
│   │   wsgi.py
│   │   __init__.py
│   │
│   ├───utils
│   │   │   ldap_search.py
```  
- asgi.py, wsgi.py, __init__.py: they contain some settings for django server, they are created automatically with django project and they were not modified for this project.
- urls.py: they contain the endpoints of the project, any endpoints created in the apps should be pointed to in this file. 
- settings.py: contain the settings of the project, further details downward.


Settings
-----

Django settings works by defining a set of variables to modify different properties, the variables modified in this project are as follows:  
- ```
ALLOWED_HOSTS
CORS_ORIGIN_ALLOW_ALL
CORS_ALLOW_CREDENTIALS
SESSION_ENGINE
CSRF_TRUSTED_ORIGINS
```  
These are used to define which hosts are allowed access to the backend endpoints.
- ```
INSTALLED_APPS
```  
To specify additional apps or tools used in the project, for this project in addition to the default apps these are added:  
  - ```
  "app_indecol.apps.AppIndecolConfig",
    "rest_framework",
    "corsheaders",
    'django_python3_ldap',
    'django_extensions',
    ```
    - "rest_framework", "corsheaders", "django_extensions": are django tools used in the project
    - "app_indecol": is the app we created in the project
    - "django_python3_ldap": a third party app used to implement authentication using LDAP
- ```
MIDDLEWARE
```  
Just added `"corsheaders.middleware.CorsMiddleware"` which is required by django corsheader tool:  
- ```
DATABASES
```  
Specified that the type of database used is sqlite3 and added the path to the sql file.

- ```
STATIC_URL
STATIC_ROOT
MEDIA_URL
MEDIA_ROOT
```  
To specify the path to where static and media (uploaded) files are stored and the endpoints to reach them, in production the endpoints should be prefixed by the host url "<host url>/static" and "<host url>/" for the media endpoint as django adds `media/` by default at the end of media endpoint.  


The remaining settings are for authentication using LDAP see [Authentication (LDAP) for more details.][auth]


[auth]:/docs/backend/auth

---
layout: default
title: Authentication
nav_order: 2
parent: Backend
permalink: backend/auth
---

Authentication (LDAP)
======

This project utilizes authentication through NTNU Lightweight Active Directory (LDAP), [explained by Esme Maxwell in indecol wiki][LDAP-wiki], by using the third party tool [django-python3-ldap][django-ldap] to incorporate it into the django project.  

The settings for the tool are defined inside 
``` 
├───project
│   │   settings.py 
```


The variables related to it are:
- ```
AUTH_USER_MODEL
```
where the table for storing and retrieving users is defined
- ```
AUTHENTICATION_BACKENDS
```
the tool is added to the list of backends that django should use for authentication
- ```
LDAP_AUTH_URL
```
where NTNU LDAP url is defined
- ```
LDAP_AUTH_USE_TLS
LDAP_AUTH_TLS_VERSION
```
to use secure connection while authentication
- ```
LDAP_AUTH_SEARCH_BASE
```
to specify ldap search base, for NTNU there are two options 
 - "ou=people,dc=ntnu,dc=no": returns many information (first/last name, email,...), but limited regarding the accounts publically available through it, as individuals have to allow it manually through studentweb.
 - "ou=users,dc=ntnu,dc=no": restricted information (name, but no email) but encompass all NTNU accounts, this is the current used option
- ```
LDAP_AUTH_OBJECT_CLASS
```
the object to return from the ldap search
- ```
LDAP_AUTH_USER_FIELDS
```
the field names in the database table and the corresponding name in the ldap object
- ```
LDAP_AUTH_USER_LOOKUP_FIELDS
```
the field name (using the above defined fields) used to look for the user
- ```
LDAP_AUTH_CONNECTION_USERNAME
LDAP_AUTH_CONNECTION_PASSWORD
```
they are set to `None` as this is an unbound ldap query
- ```
LDAP_AUTH_FORMAT_SEARCH_FILTERS
```
points to a custom function to use to modify the ldap search further. The function `custom_format_search_filters` is saved in: 
```
├───project
│   ├───utils
│   │   │   ldap_search.py
```
currently, there is no additional filters used. It was created to initialize the database with users from indecol using the filter `"(|(ntnuMemberOf=ioko))"`, the code for it is commented in the function. To sync users into the database manually without them logging in, specify some filters in the above function, to not sync all NTNU accounts, and then run the command:  
`python manage.py ldap_sync_users`  
To grant any of the users admin permissions (recommended: to do it through the app GUI or admin page) through the terminal, run:  
`python manage.py ldap_promote <username>`  
- ```
LOGGING
```
to help debug ldap authentication in development



Authentication (Custom)
=====

A custom authentication method is created to allow manual addition of external users, not associated with NTNU, which allows authentication using email/username and password. This is implemented in:  
```
├───app_indecol
│   │   backends.py
```
Then it was added to the project settings to the list of authentication backends, in the file:  
```
├───project
│   │   settings.py 
```
in the variable `AUTHENTICATION_BACKENDS`


[LDAP-wiki]:https://www.ntnu.no/wiki/pages/viewpage.action?spaceKey=iedl&title=LDAP%3A+Query+NTNU%27s+Active+Directory
[django-ldap]:https://github.com/etianen/django-python3-ldap
---
layout: default
title: "app_indecol"
nav_order: 3
has_children: true
parent: Backend
permalink: "backend/app_indecol"
---

app_indecol
=====

This is where the details of our database and API endpoints lie.

- [models.py][models]: specifications for database tables and fields
- [serializer.py][serializer]: middle man between database and API to define how the fields should be represented
- [api.py][api]: define the different APIs and their options
- [admin.py][admin]: define the tables to be available through django admin page and their settings
- [urls.py][urls]: define the different url routes of the app



[models]:/docs/backend/app_indecol/models
[serializer]:/docs/backend/app_indecol/serializer
[api]:/docs/backend/app_indecol/api
[admin]:/docs/backend/app_indecol/admin
[urls]:/docs/backend/app_indecol/urls
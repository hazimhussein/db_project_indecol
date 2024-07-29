---
layout: default
title: API Endpoits
nav_order: 3
parent: app_indecol
grand_parent: Backend
permalink: docs/backend/app_indecol/api
---

APIs
=====

This is where the API endpoints and their options are defined. Currently for all tables, a default view is used to return all fields without modifications except for the metadata and login/logout endpoints.

Custom Metadata
----

Django provide a request method named `"options"`, instead of the tables values returned by the method `"get"` it returns metadata about the table fields. By default a foreign key field is given the type `"object"`. This is modified to be `"foreign_key"` and `"foreign_key_many"`. In addition to modifying password field type from `"text"` to `"password"`.

---
layout: default
title: Models
nav_order: 1
parent: app_indecol
grand_parent: Backend
permalink: docs/backend/app_indecol/models
---

Database Tables
=====

This is where the database tables are defined. Currently, the defined tables are:

- ## Admin tables
  - `Faq`: items for the help section
  - `Team`: digital lab memebers to be viewed in the about section
  - ## Structural tables
    - `User`: this is the table used for users authentication
    - `Category`: records for the different tables available in the app
    - `FieldOption`: stores the available options for fields in the other tables that require a predefined list of options
- ## Public tables
  - `Person`: people associated to projects
  - `Group`: indecol groups
  - `Partner`: External partenrs who contributed to projects
  - `Resource`: stores projects' resources. It utilizes a custom function to store uploaded files in seperate folders following the structure `"files/<name of the resource>/<creation date>/<filename>"`, so when the the files are modified, they are saved in new folders while keeping the old files.
  - `Project`: stores the project records
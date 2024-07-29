---
layout: default
title: Serilaizers
nav_order: 2
parent: app_indecol
grand_parent: Backend
permalink: docs/backend/app_indecol/serializer
---

Serializers
=====

In django process, this is a required middle man between the database and API, to validate how the tables fields should be represented. No special options are defined for this project, except for:
- `UserSerializer`: some function were modified to account for the ability to manually create users
- `UserLoginSerializer`: this is a step needed to authenticate users
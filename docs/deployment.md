---
layout: default
title: Deployment
nav_order: 4
permalink: deployment
---

# Deploying the app to production  

## Pre-deployment
### lines of code to change
- `frontend/src/utils/api.js`:   
    

  ```
  let fetchingURL = 'http://localhost:8000/api/'
  ```  
  to  
  ```
  let fetchingURL = '/api/'
  ```
- `backend/project/settings.py`: 
    
      
  ```
  MEDIA_URL = 'http://localhost/'
  ```  
  to   
  ```
  MEDIA_URL = 'https//indecx.indecol.no/'
  ```
### Docker container
The app is wrappend in a docker container that combines multiple containers to serve the app, which include:
- backend container: that serves the backend through gunicorn
- frontend container: that serves the static version of the frontend
- nginx container: that uses the previous two containers to serve the final app through nginx server

## On the host
\[managed by IEDL staff\]

The app joined a traefik manager's docker service (`/traefikmaster/rproxy-setup.yaml`) running at `misc4iedl` VM of IEDL's `stack.it.ntnu.no` (access details @ wiki).
A DNS record `indecx.indecol.no` with A-record pointing at the VM's IP and the TXT record with ACME challege is public.
A TLS certificate is created and set for autorenewal in `/etc/letsencrypt/live/indecx.indecol.no/`.

### updating the app:
1. ssh into the VM
1. find the app's repo in `/traefikmaster/db_project_db/`
1. fetch the changes from git
1. if `./docker-compose.yaml` has updates - update the docker service `indecx.indecol.no` in `/traefikmaster/rproxy-setup.yaml` accordingly
1. restart/rebuild the traefik manager and other running docker services:
```bash
docker compose -f /traefikmaster/rproxy-setup.yaml up -d # restarts the services
docker compose -f /traefikmaster/rproxy-setup.yaml up -d --no-deps --build # rebuilds the containers and restarts the services
```

### database backup
The routines for backing up `./data/db/` live in [a separate project](https://github.com/NTNU-IndEcol/IndEcX_backup).
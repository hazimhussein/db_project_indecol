# db_project_indecol
Industrial Ecology Project Database : Creation of an internal database of projects and people associated with them.

# diagram
This diagram has been created via [draw.io](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiW-PKPtYSCAxUnnGoFHVuXC7AQFnoECBAQAQ&url=https%3A%2F%2Fapp.diagrams.net%2F&usg=AOvVaw28S23h4_WI8toant9FYDpi&opi=89978449) and can be modified as the .drawio file is also available in this repository.

![diagram_db.png](assets/diagram_indecol_DBproject-Page-1.jpg)


python manage.py makemigrations
python manage.py migrate
./manage.py ldap_sync_users <list of user lookups>
 ./manage.py ldap_promote <username>
 python manage.py loaddata <filename>


# deployment/hosting

The app joined a traefik manager's docker service (`/traefikmaster/rproxy-setup.yaml`) running at `misc4iedl` VM of IEDL's `stack.it.ntnu.no` (access details @ wiki).
A DNS record `indecx.indecol.no` with A-record pointing at the VM's IP and the TXT record with ACME challege is public.
A TLS certificate is created and set for autorenewal in `/etc/letsencrypt/live/indecx.indecol.no/`.

### Updating the app:
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
The content of `./data/db/` is synced into the mountpoint of IEDL's NAS drive at `./data/db_backup_mountp/` daily (9:01 AM).
This routine is implemented in `./data/syncro.py`, which runs in a tmux session and needs the `APScheduler`, hence `pip3 install -r backup_requs.txt` prior to using. 

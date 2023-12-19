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

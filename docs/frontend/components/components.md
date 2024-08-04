---
layout: default
title: Components
nav_order: 3
parent: Frontend
permalink: frontend/components
---

Website elements build up
=========

The website is build up of different components that utilizes non-component elements for the build up.  
  
<figure width="100%" style="text-align: center;">
<img src="./docs/images/docs_frontend_comp.png" width="75%" 
        alt="Components build up">
<figcaption>Components build up</figcaption>
</figure>

## Components
- `App`: main wrapper for the app to reroute according to url (currently, there is only one route to `Dashboard` component, but it is still recommended to have the `App` wrapper)
- `Dashboard`: main component that combines and defines the layout for all the other components
- `Progress`: progress bar depending on the global state
- `About`: information section about the digital lab team
- `Help`: rows of items with question/title and dropdown answers/details (Generally, just view of the data in the FAQ table)
- `NavTop`: navigation bar that includes logo and login/logout methods
- `TableView`: shows data in table format
- `Details`: shows details of items in the table
- `GeneralForm`: builds the form for adding/editing records
- `Alertbox`: confirmation alert when performing an action (e.g delete an element)
- `SelectSearch`: a form element to select from a dropdown list with option of searching in the list, with optional add button next to it depending on the logged in user and the passed in list
- `InputFileUpload`: a form element to upload files, with the option of previewing files such as images or videos small in size
- `PasswordInput`: a form element for passwords, with option to show/hide entered password

## Non-component elements
- `config`: file in the parent directory that includes some variables to customize the app behavior, including:
  - `tables_order`: optional variable to decide the order of appearance of the tables in the main page (tables in the variable appear first according to their order in the variable and then the rest of the tables)
  - `admin_tables`: tables that should be only available to admin users
  - `img_ext`, `vid_ext`: images and videos extensions that the form file upload element use to recognize images and videos from other files and then preview them (currently common extensions are added but more can be added without any extra configurations needed)
- [`html2canvas`][html2canvas], [`jsPDF`][jsPDF]: two libraries used to create pdf from the table element
- helper functions to build the table component:
  - `col_func`: depending on the logged in user, current table and columns options received from the API option request method, and the data received from the API get request method, it defines the columns for the table
  - `sort_cols`: defines the sorting functions for the different columns
  - `search_row_builder`: creates the search elements for the different columns
  - `modifiy_nodes`: filters the data according to the search values
  
# Data Pathway
The process by which API requests are called and the returned data are used can be summarized in the following illustration:  

![Data Pathway](./docs/images/docs_frontend_api.png "data pathway")




[jsPDF]:https://raw.githack.com/MrRio/jsPDF/master/docs/index.html
[html2canvas]:https://html2canvas.hertzen.com/
---
layout: default
title: Frontend
nav_order: 3
has_children: true
permalink: frontend
---

# Frontend ([React][react])

The frontend is built using [React framework][react], a javascript framework for web development, utilizing some tools like: [redux][Redux], [Material UI][mui], [React Bootstrap][rbtstrap], and regular [bootstrap][btstrap].


## [React][react]

Javascript framework for web development providing an extra level of abstraction summarized as follows:  
Web pages are composed of components and each component has it's own state. States are monitored so when they are changed, components are checked if they should be changed and then change accordingly without reloading the whole page. States can affect their components and their child components. The states should only be changed using specific tools to detect the change in states, a convenient tool for that which were used extensively in the app is [React hooks][hooks]. Two of the most used hooks in the app are:
- `useState`: to define a new state and the function to change it
- `useEffect`: define functions to run when the page is done loading and when specified variables values are changed.  

React is built on top of [NodeJs][nodejs] as development server, therefore [NodeJs][nodejs] and [NPM][npmjs] should be installed. In addition as mentioned above, react is an abstarction level over regular Html, CSS, JS. Thus, a set of pre- and post- processors are used to convert the react code. There are many different combinations of these processors available in the market. For this project, the app is initialized using [Vite][vite], which provides convenient processors and settings with no need for further modification.

 
## [Redux][redux]  

A state manager tool to provide and manage a global state shared by all components.  


## [Material UI][mui]/[React Bootstrap][rbtstrap]  

These provide components with predefined set of CSS styles and JS functions for convenience


## [Bootstrap][btstrap]  

These provide Html classes with predefined set of CSS styles and JS functions which can be added to any element.  

## General structure

The structure of the frontend folder:
```
├───node_modules
├───public
│   └───assets
│       ├───images
│       │   └───1x
│       └───styles
└───src
    ├───components
    │   ├───elements
    │   └───utils
    ├───reducers
    └───utils
```  
- `public`: includes static files (styles, images, js files, ...)
- [`src/reducers`][reducer]: includes the code for redux state manager
- [`src/utils`][utils]: includes helper functions and configurations for API methods (get, post, patch, delete, options)
- [`src/components`][components]: where the website components reside

### General website process

- APIs get data from the backend > data are sent to reducers > reducers update the global state > components use the data from the global state to build the website.  
    
<figure width="100%" style="text-align: center;">
<img src="/docs/images/docs_frontend.png" width="75%" 
     alt="General process">
<figcaption>General process</figcaption>
</figure>





[react]:https://react.dev/
[redux]:https://redux.js.org/
[mui]:https://mui.com/
[rbtstrap]:https://react-bootstrap.netlify.app/
[btstrap]:https://getbootstrap.com/
[nodejs]:https://nodejs.org/
[npmjs]:https://www.npmjs.com/
[vite]:https://vitejs.dev/
[hooks]:https://react.dev/reference/react/hooks
[reducer]:/docs/frontend/reducers
[utils]:/docs/frontend/utils
[components]:/docs/frontend/components
[reduxtk]:https://redux-toolkit.js.org/
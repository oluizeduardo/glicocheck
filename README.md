# my-diabetes-js
Web API to control diabetes. 
API developed in [NodeJS](https://nodejs.org/en/) with [ExpressJS](http://expressjs.com/) to manage the web application and [KnexJS](http://knexjs.org/) to build queries and datasource connection.

# Link
https://my-diabetes-js.herokuapp.com/api/

# How to run locally
- Clone this project.
- Run `npm install` to install the dependencies.
- Run `nodemon .\server.js` on your terminal.
- On your browser type `http://localhost:3000/api/{resource}`

# Endpoints
Use an API testing tool such as [Postman](https://www.postman.com/downloads/) or [Thunder Client for VS Code](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) to send requests to the following endpoints.

You can assume `{HOST}` as being `http://localhost:3000` for local testing or `https://my-diabetes-js.herokuapp.com` for production, both address use the same datasource.

## /users

| METHOD  | END-POINT                       | DESCRIPTION                       | REQUEST FIELDS                              |
| ------- |:-------------------------------:| :--------------------------------:|:----------------------------------------------:|
| GET     | {HOST}/api/users                |  Get all users.            |                   |
| GET     | {HOST}/api/users/{id}           |  Get user by id.           |                   |
| POST    | {HOST}/api/users                |  Create a new user.        | name, email, login, password, role_id    |
| DELETE  | {HOST}/api/users/{id}           |  Delete a user based on id.|                  |
| PUT     | {HOST}/api/users/{id}           |  Update a user based on id.| name, email, login, password, role_id    |


## /glucose

| METHOD  | END-POINT                         | DESCRIPTION                       | REQUEST FIELDS                              |
| ------- |:---------------------------------:| :--------------------------------:|:----------------------------------------------:|
| GET     | {HOST}/api/glucose                |  Get all glucose readings        |                   |
| GET     | {HOST}/api/glucose/{id}           |  Get a glucose reading by id.    |                   |
| GET     | {HOST}/api/glucose/user/{id}      |  Get glucose readings of a specific user.    |                   |
| POST    | {HOST}/api/glucose                |  Create a new glucose reading register.      | userId, glucose, unityId, date, hour, markerMealId    |
| DELETE  | {HOST}/api/glucose/{id}           |  Delete a glucose reading by id.|                  |
| PUT     | {HOST}/api/glucose/{id}           |  Update a glucose reading by id.| glucose, unityId, date, hour, markerMealId         |


## /markermeal

| METHOD  | END-POINT                       | DESCRIPTION                       | REQUEST FIELDS                              |
| ------- |:-------------------------------:| :--------------------------------:|:----------------------------------------------:|
| GET     | {HOST}/api/markermeal           |  Get all marker meals.           |                   |
| GET     | {HOST}/api/markermeal/{id}      |  Get a marker meal by id. |                   |
| POST    | {HOST}/api/markermeal           |  Create a new marker meal.         | description    |
| DELETE  | {HOST}/api/markermeal/{id}      |  Delete a marker meal by id.|                  |
| PUT     | {HOST}/api/markermeal/{id}      |  Update a marker meal by id.| description    |


# Technologies
- NodeJS
- Express
- KnexJS
- PostgresSQL
- Heroku

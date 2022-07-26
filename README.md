# my-diabetes-js
NodeJS web API to control diabetes.

# Link
https://my-diabetes-js.herokuapp.com/api/glucose

# How to run locally
- Run `npm install` to install the dependencies.
- Run `nodemon .\server.js` on your terminal.

# Endpoints
Use an API testing tool such as Postman to send requests to the following endpoints.

You can assume `{HOST}` as being `http://localhost:3000` or `https://my-diabetes-js.herokuapp.com`, both address use the same datasource.

## /users

| METHOD  | END-POINT                       | DESCRIPTION                       | REQUEST FIELDS                              |
| ------- |:-------------------------------:| :--------------------------------:|:----------------------------------------------:|
| GET     | {HOST}/api/users                |  List all users.           |                   |
| GET     | {HOST}/api/users/{id}           |  List details of a specific user. |                   |
| POST    | {HOST}/api/users                |  Create a new user.        | name, email, login, password, role_id    |
| DELETE  | {HOST}/api/users/{id}           |  Delete a user based on id.|                  |
| PUT     | {HOST}/api/users/{id}           |  Update a user based on id.| name, email, login, password, role_id    |


## /glucose

| METHOD  | END-POINT                         | DESCRIPTION                       | REQUEST FIELDS                              |
| ------- |:---------------------------------:| :--------------------------------:|:----------------------------------------------:|
| GET     | {HOST}/api/glucose                |  List all glucose readings        |                   |
| GET     | {HOST}/api/glucose/{id}           |  List details of a specific glucose reading. |                   |
| GET     | {HOST}/api/glucose/user/{id}      |  List glucose reading of a specific user.    |                   |
| POST    | {HOST}/api/glucose                |  Create a new glucose reading register.      | userId, glucose, unityId, date, hour, markerMealId    |
| DELETE  | {HOST}/api/glucose/{id}           |  Delete a glucose reading based on id.|                  |
| PUT     | {HOST}/api/glucose/{id}           |  Update a glucose reading based on id.| glucose, unityId, date, hour, markerMealId         |


## /markermeal

| METHOD  | END-POINT                       | DESCRIPTION                       | REQUEST FIELDS                              |
| ------- |:-------------------------------:| :--------------------------------:|:----------------------------------------------:|
| GET     | {HOST}/api/markermeal           |  List all marker meals.           |                   |
| GET     | {HOST}/api/markermeal/{id}      |  List details of a specific marker meal. |                   |
| POST    | {HOST}/api/markermeal           |  Create a new marker meal.         | description    |
| DELETE  | {HOST}/api/markermeal/{id}      |  Delete a marker meal based on id.|                  |
| PUT     | {HOST}/api/markermeal/{id}      |  Update a marker meal based on id.| description    |


# Technologies
- NodeJS
- Express
- KnexJS
- PostgresSQL
- Heroku

<div align="center">
  <img src="https://github.com/oluizeduardo/my-diabetes-js/blob/main/src/public/includes/imgs/glicocheck-logo-whitebg.png">
</div align="center">

# Glicocheck
Web platform to manage diabetes.

# Technologies applied
- Backend
    - NodeJS
    - Express
    - [Bcrypt](https://www.npmjs.com/package/bcrypt)
    - [Json Web Token](https://jwt.io/)
- Database
    - [SQLite](https://www.sqlite.org/index.html)
    - [KnexJS](https://knexjs.org/)
- Frontend
    - [Bootstrap](https://getbootstrap.com/)
    - [SweetAlert](https://sweetalert.js.org/)
- Quality
    - Test
        - [Jest](https://jestjs.io/)
        - [Supertest](https://www.npmjs.com/package/supertest)
    - Static analysis
        - [ESLint](https://eslint.org/)

# How to run locally
- Clone this project.
    - `git clone https://github.com/oluizeduardo/my-diabetes-js.git`
- Install all the dependencies.
    - `npm install`
- Run the server.
    - `npm run dev`

# How to run the static analysis
The project uses [ESLint](https://eslint.org/) for static analysis.
- `npm run lint` to execute the analysis.
- `npm run lint:fix` to fix the error reported by ESLint.

# Link
- Homepage: http://localhost:3000/site
- API: http://localhost:3000/api/{resource}

# Endpoints
Use an API testing tool such as [Postman](https://www.postman.com/downloads/) or [Thunder Client for VS Code](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) to send requests to the following endpoints.

You can assume `{HOST}` as being `http://localhost:3000` for local testing.

## /security

| METHOD  | END-POINT                     | DESCRIPTION              | REQUEST FIELDS                         | RESPONSE FIELDS                    |
| ------- |:-----------------------------:| :-----------------------:|:--------------------------------------:|:----------------------------------:|
| POST    | {HOST}/api/security/register  |  Register a new user.    | name, email, login, password, role_id  | id                                 |
| POST    | {HOST}/api/security/login     |  Login with credentials. | login, password                        | `TOKEN`, id, login, email, role_id |


## /users

| METHOD  | END-POINT                | DESCRIPTION                  | REQUEST FIELDS                                             |
| ------- |:------------------------:| :---------------------------:|:----------------------------------------------------------:|
| GET     | {HOST}/api/users         |  Get all users.              | `TOKEN` + `ADMIN`                                          |
| GET     | {HOST}/api/users/{id}    |  Get user by id.             | `TOKEN` + `ADMIN`                                          |
| DELETE  | {HOST}/api/users/{id}    |  Delete a user based on id.  | `TOKEN` + `ADMIN`                                          |
| PUT     | {HOST}/api/users/{id}    |  Update a user based on id.  | `TOKEN` + `ADMIN` + name, email, login, password, role_id  |


## /glucose

| METHOD  | END-POINT                                    | DESCRIPTION                                 | REQUEST FIELDS                                               |
| ------- |:--------------------------------------------:| :------------------------------------------:|:------------------------------------------------------------:|
| GET     | {HOST}/api/glucose                           |  Get all glucose readings                   | `TOKEN`                                                      |
| GET     | {HOST}/api/glucose/{id}                      |  Get a glucose reading by id.               | `TOKEN`                                                      |
| GET     | {HOST}/api/glucose/user/{id}                 |  Get glucose readings of a specific user.   | `TOKEN`                                                      |
| GET     | {HOST}/api/glucose/markermeal/{markermealid} |  Get all glucose readings by markermeal id. | `TOKEN`                                                      |
| POST    | {HOST}/api/glucose                           |  Create a new glucose reading register.     | `TOKEN` + `ADMIN` + userId, glucose, unityId, date, hour, markerMealId |
| DELETE  | {HOST}/api/glucose/{id}                      |  Delete a glucose reading by id.            | `TOKEN` + `ADMIN`                                            |
| DELETE  | {HOST}/api/glucose/user/{userid}             |  Delete glucose readings of a specific user.| `TOKEN` + `ADMIN`                                            |
| PUT     | {HOST}/api/glucose/{id}                      |  Update a glucose reading by id.            | `TOKEN` + `ADMIN` + glucose, unityId, date, hour, markerMealId         |


## /markermeal

| METHOD  | END-POINT                       | DESCRIPTION                       | REQUEST FIELDS                  |
| ------- |:-------------------------------:| :--------------------------------:|:-------------------------------:|
| GET     | {HOST}/api/markermeal           |  Get all marker meals.            | `TOKEN`                         |
| GET     | {HOST}/api/markermeal/{id}      |  Get a marker meal by id.         | `TOKEN`                         |
| POST    | {HOST}/api/markermeal           |  Create a new marker meal.        | `TOKEN` + `ADMIN` + description |
| DELETE  | {HOST}/api/markermeal/{id}      |  Delete a marker meal by id.      | `TOKEN` + `ADMIN`               |
| PUT     | {HOST}/api/markermeal/{id}      |  Update a marker meal by id.      | `TOKEN` + `ADMIN` + description |


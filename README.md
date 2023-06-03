<div align="center">
  <a href="https://glicocheck.onrender.com/site/index.html" target="_blank">
    <img src="https://github.com/oluizeduardo/my-diabetes-js/blob/main/src/public/includes/imgs/glicocheck-logo-whitebg.png">
  </a>  
</div align="center">

# Glicocheck
Web platform to manage diabetes.

# Technologies applied
- Backend
    - NodeJS
    - Express
    - [Bcrypt](https://www.npmjs.com/package/bcrypt)
    - [Json Web Token](https://jwt.io/)
    - [Nodemailer](https://nodemailer.com/about/)
- Database
    - [SQLite](https://www.sqlite.org/index.html)
    - [KnexJS](https://knexjs.org/)
- Frontend
    - [Bootstrap](https://getbootstrap.com/)
    - [SweetAlert](https://sweetalert.js.org/)
- Quality
    - Test
        - [Cypress](https://www.cypress.io/)
    - Static analysis
        - [ESLint](https://eslint.org/)
- Deploy
    - [Render](https://render.com/)
  

# Environment Variables
A `.env` file is required on the root folder and must contain the following key and values:

| Key           | Value         |
| ------------- |:-------------|
| `BASE_URL`    | The basic context of the application. Should contain the protocol + host + port.<br>Ex: `http://localhost:3000` |
| `PORT`        | The port where the application is running.<br>Ex: `3000`      |
| `EMAIL_HOST`  | The SMTP host to send emails messages.<br>Ex: `smtp-mail.outlook.com`     |
| `EMAIL_PORT`  | Where SMTP server is running.<br>Ex: `587`     |
| `EMAIL_USER`  | Email username for authentication.      |
| `EMAIL_PASS`  | The email password for authentication. |
| `SECRET_KEY`  | Any secret key encrypted using BCrypt.<br>Suggested tool: https://bcrypt-generator.com/      |
| `EDAMAM_APP_ID`  | Edamam `app id` to consult the nutritional table. https://www.edamam.com/      |
| `EDAMAM_APP_KEY`  | Edamam `app key`.      |

# How to run locally
- Clone this project.
    - `git clone https://github.com/oluizeduardo/glicocheck.git`
- Install all the dependencies.
    - `npm install`
- Run the server.
    - `npm run dev`

# Links
- Homepage (local): http://localhost:3000/site
- API (local): http://localhost:3000/api/{resource}

# Code analysis
[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/summary/new_code?id=oluizeduardo_glicocheck)

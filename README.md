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
    - [Nodemailer](https://nodemailer.com/about/)
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
        - [Cypress](https://www.cypress.io/)
    - Static analysis
        - [ESLint](https://eslint.org/)

# How to run locally
- Clone this project.
    - `git clone https://github.com/oluizeduardo/glicocheck.git`
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

# Code analysis
[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/summary/new_code?id=oluizeduardo_glicocheck)

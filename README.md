<div align="center">
  <img src="./docs/glicocheck-logo.png">  
</div>

# Glicocheck
Web platform for diabetes management.

# Technologies applied
- Backend
    - [Glicocheck-API](https://github.com/oluizeduardo/glicocheck-api)
- Frontend
    - [Bootstrap](https://getbootstrap.com/)
    - [SweetAlert](https://sweetalert.js.org/)
- Quality
    - Test
        - [Cypress](https://www.cypress.io/)
    - Static analysis
        - [ESLint](https://eslint.org/)
- CICD
    - [GitHub Actions](https://docs.github.com/en/actions)
- Deploy
    - [Render](https://render.com/)
  

# Environment Variables
A `.env` file is required on the root folder and must contain the following key and values:

| Key           | Value         |
| ------------- |:-------------|
| `BASE_URL`    | The basic context of the application. Should contain the protocol + host + port.<br>Ex: `http://localhost:3000` |
| `PORT`        | The port where the application is running.<br>Ex: `3000`      |

# How to run locally
- Clone this project.
    - `git clone https://github.com/oluizeduardo/glicocheck.git`
- Install all the dependencies.
    - `npm install`
- Run the server.
    - `npm run dev`

# Code analysis
[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/summary/new_code?id=oluizeduardo_glicocheck)

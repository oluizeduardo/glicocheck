const btnLogIn = document.getElementById('btnLogIn');
const fieldEmail = document.getElementById('field_Email');
const fieldPassword = document.getElementById('field_Password');

const SUCEESS = 200;
const FORBIDDEN = 401;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnLogIn.addEventListener('click', (event) => {
  event.preventDefault();

  if (isValidDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
        if (xmlhttp.status == SUCEESS) {
          executeProcessToLogIn(xmlhttp);
        } else if (xmlhttp.status == FORBIDDEN) {
          const message = `Please try again by entering the same email 
                                    and password used during account creation.`;
          swal('Wrong credentials', message, 'error');
        }
      }
    };
    sendRequestToLogin(xmlhttp);
  } else {
    showLoginError();
  }
});

/**
 * Checks whether the fields email and password are filled.
 * @return {boolean} true if the emails and password fields are filled.
 * Returns false otherwise.
 */
function isValidDataEntry() {
  return (fieldEmail.value && fieldPassword.value);
}

/**
 * Sends a request to the login endpoint.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendRequestToLogin(xmlhttp) {
  const jsonLogin = prepareJsonLogin();
  xmlhttp.open('POST', '/api/security/login');
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonLogin);
}

/**
 * Create a JSON object for the login process.
 * @return {JSON} JSON object.
 */
function prepareJsonLogin() {
  return JSON.stringify({
    email: fieldEmail.value,
    password: fieldPassword.value,
  });
}

/**
 * Execute the process needed to log in the system
 * and redirect the user to the home page.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function executeProcessToLogIn(xmlhttp) {
  const accessToken = getAuthorizationHeaderValue(xmlhttp);
  saveJwtToken(accessToken);
  const {user_id} = JSON.parse(xmlhttp.response);
  saveUserId(user_id);
  fetchSystemConfigurationAndRedirect(user_id, accessToken);
}

/**
 * Returns the text in the authorization header.
 * @param {XMLHttpRequest} xmlhttp The request object.
 * @return {string} The text in the authorization header.
 */
function getAuthorizationHeaderValue(xmlhttp) {
  return xmlhttp.getResponseHeader('authorization');
}

/**
 * Save the JWT token in the session storage.
 * @param {string} token The JWT token.
 */
function saveJwtToken(token) {
  sessionStorage.setItem('jwt', token);
}
/**
 * Save the user id in the session storage.
 * @param {string} userId The user id.
 */
function saveUserId(userId) {
  sessionStorage.setItem('userId', userId);
}
/**
 * Save the system configuration in the session storage.
 * @param {*} configuration
 */
function saveSystemConfiguration(configuration) {
  if (typeof configuration === 'object') {
    configuration = JSON.stringify(configuration);
  }
  sessionStorage.setItem('sysConfig', configuration);
}

/**
 * Redirects the user to the dashboard page.
 */
function redirectToDashboard() {
  location.href = './home.html';
}

/**
 * Shows the login error message.
 */
function showLoginError() {
  swal('Wrong credentials',
      'Please, inform the correct email and password.',
      'warning');
}

/**
 * Fetches the system configuration for a user
 * and redirects to another page after completion.
 * @param {string} userId - The user ID.
 * @param {string} accessToken - The access token for authentication.
 * @return {Promise<void>} A promise that resolves when the system
 * configuration is fetched, saved, and the redirection is complete.
 * @throws {Error} If an error occurs during the fetching or saving process.
 */
async function fetchSystemConfigurationAndRedirect(userId, accessToken) {
  try {
    await fetchSystemConfiguration(userId, accessToken);
    redirectToDashboard();
  } catch (error) {
    console.error('An error occurred: ', error);
  }
}

/**
 * Fetches the system configuration for a user and saves it.
 * @param {string} userId - The user ID.
 * @param {string} accessToken - The access token for authentication.
 * @return {Promise<void>} A promise that resolves when the system
 * configuration is fetched and saved successfully.
 */
function fetchSystemConfiguration(userId, accessToken) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetchData(userId, accessToken);
      const {status} = response;

      switch (status) {
        case 200:
          const data = await response.json();
          saveSystemConfiguration(data);
          resolve();
          break;

        case 401:
          console.error('Session expired.');
          reject(new Error('Session expired.'));
          break;

        case 404:
          showErrorConfigurationNotFound();
          break;

        default:
          showErrorConfigurationNotFound();
      }
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * Shows error message.
 */
function showErrorConfigurationNotFound() {
  swal({
    title: 'Error',
    text: 'Error loading system configuration.\n Please, log in again.',
    icon: 'error',
  }).then(() => {
    logOut();
  });
}

/**
 * This function is a utility function that simplifies the process
 * of sending HTTP requests to an API using the Fetch API.
 * @param {*} userId
 * @param {*} accessToken
 * @return {Response}
 */
async function fetchData(userId, accessToken) {
  const url = `/api/systemconfiguration/user/${userId}`;
  const headers = new Headers({'Authorization': 'Bearer ' + accessToken});
  const myInit = {method: 'GET', headers: headers};
  const response = await fetch(url, myInit);
  return response;
}

/* eslint-disable camelcase */
const btnLogIn = document.getElementById('btnLogIn');
const fieldEmail = document.getElementById('field_Email');
const fieldPassword = document.getElementById('field_Password');

const SUCCESS = 200;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;

btnLogIn.addEventListener('click', async (event) => {
  event.preventDefault();

  if (!isValidDataEntry()) {
    showInvalidCredentialMessage();
    return;
  }

  makeButtonDisabled(btnLogIn);

  try {
    const response = await sendRequestToLogin();

    if (response.status === SUCCESS) {
      executeProcessToLogIn(await response.json());
    } else if (response.status === UNAUTHORIZED ||
      response.status === FORBIDDEN || response.status === NOT_FOUND) {
      swal('Wrong credentials', 'Please try again.', 'error');
    } else {
      swal('Error', 'Error connecting to the server.', 'error');
    }
  } catch (error) {
    console.error('Request failed:', error);
    swal('Error', 'An unexpected error occurred.', 'error');
  } finally {
    removeDisabledFromButton(btnLogIn);
  }
});

/**
 * Function to send login request.
 * @return {Promise}
 */
async function sendRequestToLogin() {
  const url = API_BASE_REQUEST+'/authentication/login';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(getLoginData()),
  };

  return fetch(url, options);
}

/**
 * Create the login data.
 * @return {JSON} JSON object.
 */
function getLoginData() {
  return {
    email: fieldEmail.value,
    password: fieldPassword.value,
  };
}

/**
 * Makes a button disabled and sets "Loading..." with a spinner component.
 * @param {HTMLButtonElement} btn The button where the property and
 * the new message will be set.
 */
function makeButtonDisabled(btn) {
  btn.disabled = true;
  // eslint-disable-next-line max-len
  btn.innerHTML = 'Loading... <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';
}

/**
 * Remove disabled propoerty from a button and set a new message.
 * @param {HTMLButtonElement} btn The button where
 * the adjustments will be applied.
 */
function removeDisabledFromButton(btn) {
  btn.disabled = false;
  btn.innerHTML = 'Log in';
}

/**
 * Checks whether the fields email and password are filled.
 * @return {boolean} true if the emails and password fields are filled.
 * Returns false otherwise.
 */
function isValidDataEntry() {
  return (fieldEmail.value && fieldPassword.value);
}

/**
 * Execute the process needed to log in the system
 * and redirect the user to the home page.
 * @param {JSON} loginResponse The login response object.
 */
function executeProcessToLogIn(loginResponse) {
  const access_token = loginResponse.access_token;
  const cod_user = loginResponse.cod_user;
  saveJwtToken(access_token);
  saveUserId(cod_user);
  fetchSystemConfigurationAndRedirect(cod_user, access_token);
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
 * Redirects the user to the dashboard page.
 */
function redirectToDashboard() {
  location.href = './home.html';
}

/**
 * Shows invalid credential message.
 */
function showInvalidCredentialMessage() {
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
    showErrorLoadingSystemConfiguration();
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
        case SUCCESS:
          const data = await response.json();
          saveSystemConfiguration(data);
          resolve();
          break;

        case FORBIDDEN:
          reject(new Error('Session expired.'));
          break;

        case NOT_FOUND:
          reject(new Error('System configuration not found.'));
          break;

        default:
          reject(new Error('Error loading system configuration.'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Save the system configuration in the browser session storage.
 * @param {JSON} data
 */
function saveSystemConfiguration(data) {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  sessionStorage.setItem('sysConfig', data);
}

/**
 * Shows message error loading system configuration.
 */
function showErrorLoadingSystemConfiguration() {
  swal({
    title: 'Error',
    text: 'Error loading system configuration.\n Please, log in again.',
    icon: 'error',
  }).then(() => {
    logOut();
  });
}

/**
 * Utility function for the log out process.
 * It cleans the session storage and redirect to the index page.
 */
function logOut() {
  sessionStorage.clear();
  location.href = './index.html';
}

/**
 * This function is a utility function that simplifies the process
 * of sending HTTP requests to an API using the Fetch API.
 * @param {*} userId
 * @param {*} accessToken
 * @return {Response}
 */
async function fetchData(userId, accessToken) {
  const url = API_BASE_REQUEST+`/systemconfiguration/user/${userId}`;
  const headers = new Headers({'Authorization': 'Bearer ' + accessToken});
  const myInit = {method: 'GET', headers: headers};
  const response = await fetch(url, myInit);
  return response;
}

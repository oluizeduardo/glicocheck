/* eslint-disable no-unused-vars */

const SESSIONSTORAGE_SYSTEM_CONFIG = 'sysConfig';
const SESSIONSTORAGE_JWT = 'jwt';
const SESSIONSTORAGE_USER_ID = 'userId';
const SESSIONSTORAGE_DAIRY_DATE_RANGE = 'dairyDateRange';

/**
 * Checks if there is a JWT token.
 */
function checkAuthToken() {
  if (window.location.pathname !== '/index.html') {
    const jwtToken = getJwtToken();
    if (!jwtToken) {
      logOut();
    }
  }
}

/**
 * Utility function for the log out process.
 * It cleans the session storage and redirect to the index page.
 */
async function logOut() {
  try {
    const response = await sendRequestToLogout();
    if (response.status === SUCCESS) {
      console.log('Logout succesfully!');
    }
  } catch (error) {
    console.error('Erro Logout.');
  } finally {
    sessionStorage.clear();
    location.href = './index.html';
  }
}

/**
 * Function to send logout request.
 * @return {Promise}
 */
async function sendRequestToLogout() {
  const url = API_BASE_REQUEST+'/authentication/logout';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: getJwtToken(),
    }),
  };

  return fetch(url, options);
}

/**
 * Handle with the session expired.
 * Shows a warning message informing that the session
 * is expired and redirect the user to the login page.
 */
function handleSessionExpired() {
  swal({
    title: 'Session expired',
    text: 'Please, do the login again.',
    icon: 'warning',
  }).then(() => {
    logOut();
  });
}

/**
 * Gets the user id saved in the session storage.
 * @return {string} The user id.
 */
function getUserId() {
  return sessionStorage.getItem(SESSIONSTORAGE_USER_ID);
}

/**
 * Save the user id in the session storage.
 * @param {string} userId The user id.
 */
function saveUserId(userId) {
  sessionStorage.setItem(SESSIONSTORAGE_USER_ID, userId);
}

/**
 * Gets the JWT token from the session storage.
 * @return {string}
 */
function getJwtToken() {
  return sessionStorage.getItem(SESSIONSTORAGE_JWT);
}

/**
 * Save JWT token in the session storage.
 * @param {string} token
 */
function saveJwtToken(token) {
  sessionStorage.setItem(SESSIONSTORAGE_JWT, token);
}

/**
 * Gets system config from the session storage.
 * @return {string}
 */
function getSystemConfig() {
  return sessionStorage.getItem(SESSIONSTORAGE_SYSTEM_CONFIG);
}

/**
 * Save system configuration in the session storage.
 * @param {string} systemConfig
 */
function saveSystemConfig(systemConfig) {
  sessionStorage.setItem(SESSIONSTORAGE_SYSTEM_CONFIG, systemConfig);
}

/**
 * Gets date range from the session storage.
 * @return {string}
 */
function getDateRangeSessionStorage() {
  return sessionStorage.getItem(SESSIONSTORAGE_DAIRY_DATE_RANGE);
}

/**
 * Sets date range in the session storage.
 * @param {string} objectString
 */
function setDateRangeSessionStorage(objectString) {
  sessionStorage.setItem(SESSIONSTORAGE_DAIRY_DATE_RANGE, objectString);
}

/**
 * Removes date range from session storage.
 */
function removeDateRangeFromSession() {
  sessionStorage.removeItem(SESSIONSTORAGE_DAIRY_DATE_RANGE);
}

checkAuthToken();

/* eslint-disable no-unused-vars */

const SESSIONSTORAGE_SYSTEM_CONFIG = 'sysConfig';
const SESSIONSTORAGE_JWT = 'jwt';
const SESSIONSTORAGE_USER_ID = 'userId';
const SESSIONSTORAGE_DAIRY_DATE_RANGE = 'dairyDateRange';

/**
 * Checks if there is a JWT token.
 */
function checkAuthToken() {
  const jwtToken = getJwtToken();
  if (!jwtToken) {
    logOut();
  }
}

/**
 * Gets the JWT token from Local Storage.
 * @return {string} The JWT token.
 */
function getJwtToken() {
  return sessionStorage.getItem(SESSIONSTORAGE_JWT);
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
 * Gets the JWT token from the session storage.
 * @return {string} The JWT token.
 */
function getJwtToken() {
  return sessionStorage.getItem(SESSIONSTORAGE_JWT);
}

/**
 * Gets system config from the session storage.
 * @return {string} The system config object.
 */
function getSystemConfig() {
  return sessionStorage.getItem(SYSTEM_CONFIG_SESSIONSTORAGE);
}

/**
 * Removes date range from session storage.
 */
function removeDateRangeFromSession() {
  sessionStorage.removeItem(SESSIONSTORAGE_DAIRY_DATE_RANGE);
}

checkAuthToken();

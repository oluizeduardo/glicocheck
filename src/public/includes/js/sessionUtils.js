/* eslint-disable no-unused-vars */
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
  return sessionStorage.getItem('jwt');
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
  return sessionStorage.getItem('userId');
}

/**
 * Gets the JWT token from the session storage.
 * @return {string} The JWT token.
 */
function getJwtToken() {
  return sessionStorage.getItem('jwt');
}

checkAuthToken();

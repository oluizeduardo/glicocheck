/**
 * Checks if there is a web token.
 */
function checkAuthToken() {
  const jwtToken = getJwtToken();

  // TODO: In the future check if it is a valid token.

  if (!jwtToken) {
    location.href = './index.html';
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
function logOut() {
  sessionStorage.clear();
  location.href = './index.html';
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

checkAuthToken();

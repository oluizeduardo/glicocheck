/**
 * Checks if there is a web token.
 */
function checkAuthToken() {
  const jwtToken = getJwtToken();
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

checkAuthToken();

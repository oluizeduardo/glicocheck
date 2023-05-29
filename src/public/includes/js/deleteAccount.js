const btnConfirmDeleteAccount = document.getElementById('btnConfirmDeleteAccount');
const fieldPassword = document.getElementById('field_delete_account_Password');

const HTTP_SUCCESS = 200;
const NOTHING_FOUND = 404;
const HTTP_UNAUTHORIZED = 401;

btnConfirmDeleteAccount.addEventListener('click', (event) => {
  event.preventDefault();
  const password = fieldPassword.value;

  if (password) {
    checkUserPassword(password, (isCorrectPassword) => {
      if (isCorrectPassword) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
          if (xmlhttp.readyState == 4) {
            switch (xmlhttp.status) {
              case HTTP_SUCCESS:
              case NOTHING_FOUND:
                deleteUserSystemConfiguration();
                deleteUserAccount();
                break;

              case HTTP_UNAUTHORIZED:
                handleSessionExpired();
                break;

              default:
                swal('Error', 'Please, try again', 'error');
                break;
            }
          }
        };
        sendRequestToDeleteGlucoseReadings(xmlhttp);
      } else {
        const text = 'Please, inform the correct password to delete your account.';
        swal('Incorrect password', text, 'warning');
      }
    });
  } else {
    const text = 'Please, inform your password to delete your account.';
    swal('Password needed', text, 'warning');
  }
});

/**
 * Sends a DELETE request to exclude the glucose readings records
 * of a specific user.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendRequestToDeleteGlucoseReadings(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  xmlhttp.open('DELETE', `/api/glucose/user/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send();
}

/**
 * Delete an user account and redirect the user to logout.
 */
function deleteUserAccount() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      swal({
        title: 'Success!',
        text: 'Your account has been deleted.',
        icon: 'success',
        closeOnClickOutside: false,
      }).then(() => {
        logOut();
      });
    }
  };
  sendRequestToDeleteUserAccount(xmlhttp);
}

/**
 * Sends a DELETE request to exclude an user account.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendRequestToDeleteUserAccount(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  xmlhttp.open('DELETE', `/api/users/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send();
}
/**
 * Delete the user's specific system configuration.
 */
async function deleteUserSystemConfiguration() {
  const token = getJwtToken();
  const userId = getUserId();
  const url = `/api/systemconfiguration/user/${userId}`;
  const headers = new Headers({'Authorization': 'Bearer ' + token});
  const myInit = {method: 'DELETE', headers: headers};
  await fetch(url, myInit);
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

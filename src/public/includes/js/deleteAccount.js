/* eslint-disable max-len */
const btnConfirmDelete = document.getElementById('btnConfirmDeleteAccount');
const fieldPassword = document.getElementById('field_delete_account_Password');

const STATUS_DONE = 4;
const HTTP_SUCCESS = 200;
const NOTHING_FOUND = 404;
const HTTP_UNAUTHORIZED = 401;

btnConfirmDelete.addEventListener('click', (event) => {
  event.preventDefault();
  const password = fieldPassword.value;

  if (password) {
    checkUserPassword(password, (isCorrectPassword) => {
      if (isCorrectPassword) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
          if (xmlhttp.readyState === STATUS_DONE) {
            switch (xmlhttp.status) {
              case HTTP_SUCCESS:
              case NOTHING_FOUND:
                try {
                  deleteUserHealthInfo();
                  deleteUserSystemConfiguration();
                  deleteUserAccount();
                } catch (error) {
                  console.error(error);
                }
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
        swal('Incorrect password',
            'Please, inform the correct password to delete your account.',
            'warning');
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
    if (xmlhttp.readyState === STATUS_DONE &&
        xmlhttp.status === HTTP_SUCCESS) {
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
function deleteUserSystemConfiguration() {
  deleteFromUser('systemconfiguration');
}
/**
 * Delete the user's health info.
 */
function deleteUserHealthInfo() {
  deleteFromUser('healthinfo');
}

/**
 * Request sent to: '/api/${resource}/user/${userId}'.
 * @param {string} resource
 */
async function deleteFromUser(resource) {
  const token = getJwtToken();
  const userId = getUserId();
  const url = `/api/${resource}/user/${userId}`;
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

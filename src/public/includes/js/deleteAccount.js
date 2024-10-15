/* eslint-disable max-len */
const btnConfirmDelete = document.getElementById('btnConfirmDeleteAccount');
const fieldPassword = document.getElementById('field_delete_account_Password');

const STATUS_DONE = 4;

btnConfirmDelete.addEventListener('click', (event) => {
  event.preventDefault();
  const password = fieldPassword.value;
  if (!password) {
    swal('Password needed',
        'Please, inform your password to delete your account.',
        'warning');
    return;
  }
  checkUserPassword(password, processDeleteUserAccount);
});

/**
 * Sends a request to delete the user's account.
 * @param {boolean} isCorrectPassword
 */
function processDeleteUserAccount(isCorrectPassword) {
  if (!isCorrectPassword) {
    swal('Incorrect password',
        'Please, inform the correct password to delete your account.',
        'warning');
    return;
  }
  deleteUserAccount();
}

/**
 * Delete an user account and redirect the user to logout.
 */
function deleteUserAccount() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === STATUS_DONE) {
      switch (xmlhttp.status) {
        case 200:
          swal({
            title: 'Success!',
            text: 'Your account has been deleted.',
            icon: 'success',
            closeOnClickOutside: false,
          }).then(() => {
            logOut();
          });
          break;

        default:
          swal('Error', 'Error deleting user account.', 'error');
          logOut();
          break;
      }
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

  xmlhttp.open('DELETE', API_BASE_REQUEST+`/users/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send();
}

/* eslint-disable max-len */
const btnConfirmDelete = document.getElementById('btnConfirmDeleteAccount');
const fieldPassword = document.getElementById('field_delete_account_Password');

const STATUS_DONE = 4;

btnConfirmDelete.addEventListener('click', (event) => {
  event.preventDefault();

  makeButtonDisabled(btnConfirmDelete);

  const password = fieldPassword.value;
  if (!password) {
    removeDisabledFromButton(btnConfirmDelete);
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
    removeDisabledFromButton(btnConfirmDelete);
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
            removeDisabledFromButton(btnConfirmDelete);
            logOut();
          });
          break;

        default:
          swal({
            title: 'Error',
            text: 'Error deleting user account.',
            icon: 'error',
          }).then(() => {
            logOut();
          });
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

  if (!token || !userId) logOut();

  xmlhttp.open('DELETE', API_BASE_REQUEST+`/users/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send();
}

/**
 * Makes a button disabled and sets "Deleting..." with a spinner component.
 * @param {HTMLButtonElement} btn The button where the property and
 * the new message will be set.
 */
function makeButtonDisabled(btn) {
  btn.disabled = true;
  // eslint-disable-next-line max-len
  btn.innerHTML = 'Deleting... <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';
}

/**
 * Remove disabled propoerty from a button and set a new message.
 * @param {HTMLButtonElement} btn The button where
 * the adjustments will be applied.
 */
function removeDisabledFromButton(btn) {
  btn.disabled = false;
  btn.innerHTML = 'Delete account';
}

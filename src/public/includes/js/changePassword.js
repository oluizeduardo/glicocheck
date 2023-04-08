const fieldOldPassword = document.getElementById('field_oldPassword');
const fieldNewPassword = document.getElementById('field_newPassword');
const fieldConfirmPassword = document.getElementById('field_confirmPassword');
const btnChangePassword = document.getElementById('btnChangePassword');

const HTTP_OK = 200;
const INTERNAL_SERVER_ERROR = 500;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnChangePassword.addEventListener('click', (event) => {
  event.preventDefault();
  if (isValidDataEntry()) {
    checkUserPassword((isCorrectPassword) => {
      if (isCorrectPassword) {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
          if (xmlhttp.readyState === XMLHTTPREQUEST_STATUS_DONE) {
            switch (xmlhttp.status) {
              case HTTP_OK:
                showSuccessMessage();
                break;
              case INTERNAL_SERVER_ERROR:
                showInternalServerErrorMessage();
                break;
            }
          }
        };
        sendRequestToUpdatePassword(xmlhttp);
      } else {
        showInvalidCurrentPasswordMessage();
      }
    });
  } else {
    showWarningMessage();
  }
});
/**
 * Check whether a password is used by a specific user.
 * @param {Function} callback The callback function
 * to be executed when the password checking is done.
 */
function checkUserPassword(callback) {
  const userId = getUserId();
  const password = fieldOldPassword.value;

  const json = JSON.stringify({
    userId: userId,
    password: password,
  });

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/security/password/validation');
  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xhr.send(json);
  xhr.onload = () => {
    const passwordValidationResult = JSON.parse(xhr.response).result;
    callback(passwordValidationResult);
  };
}
/**
 * Checks whether the field is properly filled with a valid email address.
 * @return {boolean} true if the field contains a valid emails address.
 */
function isValidDataEntry() {
  return (fieldOldPassword.value && fieldNewPassword.value &&
    fieldConfirmPassword.value && isPasswordMatch());
}
/**
 * This function prepares a JSON object and send the request
 * to update the user password.
 * @param {XMLHttpRequest} xmlhttp The XMLHttpRequest object.
 */
function sendRequestToUpdatePassword(xmlhttp) {
  const jsonUpdatePassword = prepareJsonUpdateUserPassword();
  xmlhttp.open('PUT', '/api/reset/password');
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonUpdatePassword);
}
/**
 * Prepares the JSON object to be sent to update the user password.
 * @return {JSON} A JSON object.
 */
function prepareJsonUpdateUserPassword() {
  const userId = getUserId();
  const password = fieldNewPassword.value;
  return JSON.stringify({userId, password});
}
/**
 * Gets the user id saved in the session storage.
 * @return {string} The user id.
 */
function getUserId() {
  return sessionStorage.getItem('userId');
}
/**
 * Checks whether the passwords informed match.
 * @return {boolean} true if the passwords match, false otherwise.
 */
function isPasswordMatch() {
  return (fieldNewPassword.value === fieldConfirmPassword.value);
}
/**
 * Shows success message confirming
 */
function showSuccessMessage() {
  swal({
    title: 'Success',
    text: 'Your password has been updated. Please, log-in again.',
    icon: 'success',
  }).then(() => {
    location.href = './index.html';
  });
}
/**
 * Shows a message indicating internal server error
 * when trying to update the user password.
 */
function showInternalServerErrorMessage() {
  const message = `Error trying to reset your password. Please try again.`;
  swal('Error', message, 'error');
  cleanPasswordFields();
}
/**
 * Shows a message of invalid current password.
 */
function showInvalidCurrentPasswordMessage() {
  swal({
    title: 'Invalid password',
    text: 'Please, inform your current password.',
    icon: 'error',
    closeOnClickOutside: false,
  }).then(() => {
    cleanPasswordFields();
  });
}
/**
 * Shows a warning message informing that
 * all the fields need to be filled or the new
 * password informed needs to be confirmed.
 */
function showWarningMessage() {
  let message;
  if (!isPasswordMatch()) {
    message = 'Please, confirm the new password.';
    swal('Passwords don\'t match', message, 'warning');
  } else {
    message = 'Fill the fields to change your password.';
    swal('Please, fill in all the fields', message, 'warning');
  }
}
/**
 * Clean the password fields.
 */
function cleanPasswordFields() {
  fieldOldPassword.value = '';
  fieldNewPassword.value = '';
  fieldConfirmPassword.value = '';
}


const btnResetPassword = document.getElementById('btnResetPassword');
const fieldEmail = document.getElementById('field_Email');

const HTTP_SUCEESS = 200;
const HTTP_NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnResetPassword.addEventListener('click', (event) => {
  event.preventDefault();
  if (isValidDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
        switch (xmlhttp.status) {
          case HTTP_SUCEESS:
            showSuccessMessage();
            break;

          case HTTP_NOT_FOUND:
            showEmailNotFoundMessage();
            break;

          case INTERNAL_SERVER_ERROR:
            showErrorMessage();
            break;
        }
      }
    };
    sendRequestToResetPassword(xmlhttp);
  } else {
    showInvalidEmailMessage();
  }
});

/**
 * This function prepares a JSON object and send the request
 * to change the user password.
 * @param {XMLHttpRequest} xmlhttp The XMLHttpRequest object.
 */
function sendRequestToResetPassword(xmlhttp) {
  const jsonResetPassword = prepareJsonForgotPassword();
  xmlhttp.open('POST', API_BASE_REQUEST+'/reset-password/forgot-password');
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonResetPassword);
}
/**
 * Checks whether the field is properly filled with a valid email address.
 * @return {boolean} true if the field contains a valid emails address.
 */
function isValidDataEntry() {
  const email = fieldEmail.value;
  return (email && validateEmail(email));
}
/**
 * Verifies whether the informed string is a valid email address.
 * @param {string} email The email address to be verified.
 * @return {boolean} true if it's a valid email address.
 * Returns false otherwise.
 */
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
/**
 * Shows invalid email message.
 */
function showInvalidEmailMessage() {
  const message = 'Please, inform a valid email address.';
  swal('Invalid email', message, 'warning');
}
/**
 * Shows success message.
 */
function showSuccessMessage() {
  swal({
    title: 'We sent a link to your email',
    text: 'If you don\'t see the email in your inbox, '+
          'please check your spam folder.',
    icon: 'success',
  }).then(() => {
    location.href = './index.html';
  });
}
/**
 * Shows an error message when trying to reset the user password.
 */
function showErrorMessage() {
  const message = `Error trying to reset your password. Please try again.`;
  swal('Error', message, 'error');
}
/**
 * Shows email not found message.
 */
function showEmailNotFoundMessage() {
  const message = `The email provided is unknown by the system.`;
  swal('Unknown email', message, 'warning');
}
/**
 * This function prepares the json object that will be sent in the request
 * to change password.
 * @return {string} JSON object.
 */
function prepareJsonForgotPassword() {
  return JSON.stringify({
    email: fieldEmail.value,
  });
}

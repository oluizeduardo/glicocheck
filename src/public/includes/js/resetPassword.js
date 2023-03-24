const btnResetPassword = document.getElementById('btnResetPassword');
const fieldEmail = document.getElementById('field_Email');
const spinnerBorder = document.getElementById('spinnerBorder');

const HTTP_SUCEESS = 200;
const HTTP_NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnResetPassword.addEventListener('click', (event) => {
  event.preventDefault();
  if (isValidDataEntry()) {
    isDisabledButton(true);
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
        isDisabledButton(false);
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
  const jsonRestPassword = prepareJsonForgotPassword();
  xmlhttp.open('POST', '/api/reset/forgot-password');
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonRestPassword);
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
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}
/**
 * Shows invalid email message.
 */
function showInvalidEmailMessage() {
  message = 'Please, inform a valid email address.';
  swal('Invalid email', message, 'warning');
}
/**
 * Shows success message confirming
 */
function showSuccessMessage() {
  swal({
    title: 'Email sent',
    text: `The reset password link was sent to the email 
        ${fieldEmail.value}`,
    icon: 'success',
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
  const message = `This email is not registered in the system.
                    Please try another email address.`;
  swal('Email not registered', message, 'warning');
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
/**
 * Set the disabled attribute.
 * @param {boolean} disabled Indicates if the button has the disabled atribute.
 */
function isDisabledButton(disabled) {
  btnResetPassword.disabled = disabled;
  showSpinnerBorder(disabled);
}
/**
 * Set if the spinner border has to be visible.
 * @param {boolean} showBorder Indicates if the spinner border is visible.
 */
function showSpinnerBorder(showBorder) {
  if (showBorder) {
    spinnerBorder.classList.remove('invisible');
  } else {
    spinnerBorder.classList.add('invisible');
  }
}

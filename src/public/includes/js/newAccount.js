const btnRegister = document.getElementById('btnRegister');
const fieldName = document.getElementById('field_Name');
const fieldEmail = document.getElementById('field_Email');
const fieldPassword = document.getElementById('field_Password');
const confirmPassword = document.getElementById('field_ConfirmPassword');

const SUCEESS = 201;
const BAD_REQUEST = 400;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnRegister.addEventListener('click', (event) => {
  event.preventDefault();

  if (!isValidDataEntry()) {
    showAlertMessage();
    return;
  }

  makeButtonDisabled(btnRegister);

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHTTPREQUEST_STATUS_DONE) {
      let message ='';
      switch (xmlhttp.status) {
        case SUCEESS:
          redirectToLoginPage();
          break;

        case BAD_REQUEST:
          removeDisabledFromButton(btnRegister);
          message = `This email is already used. Please, try another one.`;
          swal('Refused email', message, 'error');
          break;

        default:
          removeDisabledFromButton(btnRegister);
          message = `Error trying to create new account.
            Please try again.`;
          swal('Error', message, 'error');
          break;
      }
    }
  };
  sendRequestToRegisterNewUser(xmlhttp);
});

/**
 * Makes a button disabled and sets "Creating..." with a spinner component.
 * @param {HTMLButtonElement} btn The button where the property and
 * the new message will be set.
 */
function makeButtonDisabled(btn) {
  btn.disabled = true;
  // eslint-disable-next-line max-len
  btn.innerHTML = 'Creating... <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';
}

/**
 * Remove disabled propoerty from a button and set a new message.
 * @param {HTMLButtonElement} btn The button where
 * the adjustments will be applied.
 */
function removeDisabledFromButton(btn) {
  btn.disabled = false;
  btn.innerHTML = 'Create account';
}

/**
 * Checks whether the fields are properly filled to register a new user.
 * @return {boolean} true if the fields are properly filled.
 */
function isValidDataEntry() {
  return (fieldName.value && fieldEmail.value &&
            fieldPassword.value && isPasswordMatch());
}

/**
 * Checks whether the passwords informed match.
 * @return {boolean} true if the passwords match, false otherwise.
 */
function isPasswordMatch() {
  return (fieldPassword.value === confirmPassword.value);
}

/**
 * Send a POST to register a new user.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendRequestToRegisterNewUser(xmlhttp) {
  const jsonNewUser = prepareJsonNewUser();
  xmlhttp.open('POST', API_BASE_REQUEST+'/users');
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonNewUser);
}

/**
 * Prepares the JSON object of a new user.
 * @return {JSON} A JSON obect.
 */
function prepareJsonNewUser() {
  return JSON.stringify({
    name: fieldName.value,
    email: fieldEmail.value,
    password: fieldPassword.value,
    id_role: 2,
  });
}

/**
 * Show the success message and redirect to the login page.
 */
function redirectToLoginPage() {
  swal({
    title: 'Success',
    text: 'New user created! Now you can log in.',
    icon: 'success',
  }).then(() => {
    location.href = './index.html';
  });
}

/**
 * Shows an alert message.
 */
function showAlertMessage() {
  let message;
  if (!isPasswordMatch()) {
    message = 'Please, confirm the password.';
    swal('Passwords don\'t match', message, 'warning');
  } else {
    message = 'All the fields need to be filled.';
    swal('Please, fill in all the fields', message, 'warning');
  }
}

const btnRegister = document.getElementById('btnRegister');
const fieldName = document.getElementById('field_Name');
const fieldEmail = document.getElementById('field_Email');
const fieldPassword = document.getElementById('field_Password');
const confirmPassword = document.getElementById('field_ConfirmPassword');

const SUCEESS = 201;
const BAD_REQUEST = 400;
const XMLHTTPREQUEST_STATUS_DONE = 4;
const DEFAULT_PROFILE_PICTURE = './includes/imgs/default-profile-picture.jpg';

btnRegister.addEventListener('click', (event) => {
  event.preventDefault();

  if (isValidDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === XMLHTTPREQUEST_STATUS_DONE) {
        let message ='';
        switch (xmlhttp.status) {
          case SUCEESS:
            handleLogin();
            break;

          case BAD_REQUEST:
            message = `This email is already used. Please, try another one.`;
            swal('Refused email', message, 'error');
            break;

          default:
            message = `Error trying to create new account. 
            Please try again.`;
            swal('Error', message, 'error');
            break;
        }
      }
    };
    sendRequestToRegisterNewUser(xmlhttp);
  } else {
    showAlertMessage();
  }
});

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
  xmlhttp.open('POST', '/api/security/register');
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
    picture: DEFAULT_PROFILE_PICTURE,
    role_id: 1, // ADMIN
  });
}

/**
 * Show the success message and redirect the user to the login page.
 */
function handleLogin() {
  swal({
    title: 'Success',
    text: 'New user created! Now you can log in.',
    icon: 'success',
  }).then(() => {
    location.href = './index.html';
  });
}

/**
 * Shows the alert message
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

const fieldName = document.getElementById('field_Name');
const fieldEmail = document.getElementById('field_Email');
const fieldPassword = document.getElementById('field_Password');
const fieldConfirmPassword = document.getElementById('field_confirm_Password');
const btnSave = document.getElementById('btnSave');

const OK = 200;
const SUCCESS = 201;
const XMLHTTPREQUEST_STATUS_DONE = 4;

/**
 * Sends a request to get the user's infos.
 */
function loadUserInfos() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
      if (xmlhttp.status == OK) {
        const data = JSON.parse(xmlhttp.responseText);
        fieldName.value = data.user.name;
        fieldEmail.value = data.user.email;
      }
    }
  };
  sendGETToUserById(xmlhttp);
}

function sendGETToUserById(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  if (token && userId) {
    xmlhttp.open('GET', `/api/users/${userId}`);
    xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
  } else {
    throw Error('Authentication token not found.');
  }
}

function getJwtToken() {
  return sessionStorage.getItem('jwt');
}
function getUserId() {
  return sessionStorage.getItem('userId');
}

btnSave.addEventListener('click', (event) => {
  event.preventDefault();

  if (isValidDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
        if (xmlhttp.status == SUCCESS) {
          swal('Saved!', '', 'success');
          fieldPassword.value = '';
          fieldConfirmPassword.value = '';
        } else {
          swal('Error', 'Error trying to update user infos.', 'error');
        }
      }
    };
    sendRequestToUserDetails(xmlhttp);
  } else {
    showAlertMessage();
  }
});

function isValidDataEntry() {
  return (fieldName.value && fieldEmail.value &&
            fieldPassword.value && fieldConfirmPassword.value);
}

function sendRequestToUserDetails(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  const jsonLogin = prepareJsonUser();
  xmlhttp.open('PUT', `/api/users/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonLogin);
}

function prepareJsonUser() {
  return JSON.stringify({
    name: fieldName.value,
    email: fieldEmail.value,
    password: fieldPassword.value,
    role_id: 1,
  });
}

function showAlertMessage() {
  swal('', 'All the fields need to be filled.', 'warning');
}

loadUserInfos();

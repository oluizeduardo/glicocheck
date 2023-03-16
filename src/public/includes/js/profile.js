const fieldName = document.getElementById('field_Name');
const fieldEmail = document.getElementById('field_Email');
const fieldPassword = document.getElementById('field_Password');
const fieldConfirmPassword = document.getElementById('field_confirm_Password');
const btnSave = document.getElementById('btnSave');
const userProfilePicture = document.getElementById('userProfilePicture');

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

/**
 * Sends a request to get the user details.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendGETToUserById(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  if (token && userId) {
    xmlhttp.open('GET', `/api/users/${userId}`);
    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
  } else {
    throw Error('Authentication token not found.');
  }
}

/**
 * Gets the JWT token from the session storage.
 * @return {string} The JWT token.
 */
function getJwtToken() {
  return sessionStorage.getItem('jwt');
}

/**
 * Gets the user id saved in the session storage.
 * @return {string} The user id.
 */
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

/**
 * Checks whether the fields are properly filled.
 * @return {boolean} true if all the fields are filled, false otherwise.
 */
function isValidDataEntry() {
  return (fieldName.value && fieldEmail.value &&
            fieldPassword.value && fieldConfirmPassword.value);
}

/**
 * Sends a request to update the user details.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendRequestToUserDetails(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  const jsonLogin = prepareJsonUser();
  xmlhttp.open('PUT', `/api/users/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonLogin);
}

/**
 * Creates a JSON object with values to be updated.
 * @return {JSON} A JSON object.
 */
function prepareJsonUser() {
  return JSON.stringify({
    name: fieldName.value,
    email: fieldEmail.value,
    password: fieldPassword.value,
    role_id: 1,
  });
}

/**
 * Shows a message warning the user to fill all the fields.
 */
function showAlertMessage() {
  swal('', 'All the fields need to be filled.', 'warning');
}

/**
 * Add click event listener to open a file selector
 * to let the user upload a profile picture.
 */
userProfilePicture.addEventListener('click', (event) => {
  const fileSelector = document.createElement('input');
  fileSelector.type = 'file';
  fileSelector.accept = 'image/*';
  fileSelector.multiple = false;

  new Promise(function(resolve) {
    fileSelector.onchange = () => {
      const files = Array.from(fileSelector.files);
      resolve(files[0]);
    };
    fileSelector.click();
  }).then((file) => {
    if (file && file.name) {
      const urlFile = URL.createObjectURL(file);
      userProfilePicture.src = urlFile;
    }
  });
});

loadUserInfos();

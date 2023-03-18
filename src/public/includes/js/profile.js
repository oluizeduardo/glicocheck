const fieldName = document.getElementById('field_Name');
const fieldEmail = document.getElementById('field_Email');
const fieldPassword = document.getElementById('field_Password');
const fieldConfirmPassword = document.getElementById('field_confirm_Password');
const btnSaveUserDetails = document.getElementById('btnSaveUserDetails');
const userProfilePicture = document.getElementById('userProfilePicture');

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const SUCCESS = 201;
const XMLHTTPREQUEST_STATUS_DONE = 4;

let profilePictureBase64 = '';

/**
 * Sends a request to get the user's infos.
 */
function loadUserInfos() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
      switch (xmlhttp.status) {
        case HTTP_OK:
          const data = JSON.parse(xmlhttp.responseText);
          fieldName.value = data.user.name;
          fieldEmail.value = data.user.email;
          userProfilePicture.src = data.user.picture;
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

btnSaveUserDetails.addEventListener('click', (event) => {
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
  return (fieldName.value && fieldEmail.value);
}

/**
 * Sends a request to update the user details.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendRequestToUserDetails(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  const jsonUpdateUser = prepareJsonUser();
  xmlhttp.open('PUT', `/api/users/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonUpdateUser);
}

/**
 * Creates a JSON object with values to be updated.
 * @return {JSON} A JSON object.
 */
function prepareJsonUser() {
  return JSON.stringify({
    name: fieldName.value,
    email: fieldEmail.value,
    picture: profilePictureBase64,
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
  const fileSelector = createFileSelector();

  new Promise(function(resolve) {
    fileSelector.onchange = () => {
      const files = Array.from(fileSelector.files);
      resolve(files[0]);
    };
    fileSelector.click();
  }).then((file) => {
    if (file && file.name) {
      fileURL = URL.createObjectURL(file);
      userProfilePicture.src = fileURL;
      generateDataURL(file);
    }
  });
});

/**
 * Creates a new file selector.
 * @return {Element} type input - File selector.
 */
function createFileSelector() {
  const fileSelector = document.createElement('input');
  fileSelector.type = 'file';
  fileSelector.accept = 'image/*';
  fileSelector.multiple = false;
  return fileSelector;
}

/**
 * This functions uses a FileReader object to
 * generate the Base64 dataURL from a given file.
 * @param {string} file The file path.
 * @return {Promise} A Promise object containing the result.
 */
async function generateDataURL(file) {
  await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  }).then((result) => {
    profilePictureBase64 = result;
  });
}

loadUserInfos();

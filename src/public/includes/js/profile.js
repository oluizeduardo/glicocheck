// USER DETAILS
const fieldName = document.getElementById('field_Name');
const fieldEmail = document.getElementById('field_Email');
const fieldBirthdate = document.getElementById('field_Birthdate');
const fieldGender = document.getElementById('field_Gender');
const fieldPhone = document.getElementById('field_Phone');
const fieldWeight = document.getElementById('field_Weight');
const fieldHeight = document.getElementById('field_Height');
const userProfilePicture = document.getElementById('userProfilePicture');
const btnSaveUserDetails = document.getElementById('btnSaveUserDetails');
// HEALTH INFO
const fieldDiabetesType = document.getElementById('field_DiabetesType');
const fieldDateOfDiagnosis = document.getElementById('field_DateOfDiagnosis');
const fieldBloodType = document.getElementById('field_BloodType');
const btnUpdateHealthInfo = document.getElementById('btnUpdateHealthInfo');

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const SUCCESS = 201;
const XMLHTTPREQUEST_STATUS_DONE = 4;

let profilePictureBase64 = '';

/**
 * Sends a request to get the user's infos.
 * If the request returns suceess, the data recovered
 * should be used to fill the fields on the screen.
 * In case the JWT token is expired, executes handleSessionExpired()
 * from security.js.
 */
function loadUserInfos() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
      switch (xmlhttp.status) {
        case HTTP_OK:
          const data = JSON.parse(xmlhttp.responseText);
          loadFiledsWithUserData(data);
          break;

        case HTTP_UNAUTHORIZED:
          handleSessionExpired();// security.js
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
 * Distributes the data response in the fields.
 * @param {Response} data The response data.
 */
function loadFiledsWithUserData(data) {
  fieldName.value = data.user.name;
  fieldEmail.value = data.user.email;
  profilePictureBase64 = data.user.picture;
  userProfilePicture.src = profilePictureBase64;
  fieldBirthdate.value = data.user.birthdate ? data.user.birthdate : '';
  fieldPhone.value = data.user.phone ? data.user.phone : '';
  fieldGender.value = data.user.gender_id ? data.user.gender_id : 0;
  fieldWeight.value = data.user.weight ? data.user.weight : '';
  fieldHeight.value = data.user.height ? data.user.height : '';
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

// /////////////////
// SAVE USER DETAILS
// /////////////////
btnSaveUserDetails.addEventListener('click', (event) => {
  event.preventDefault();

  if (isValidDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
        if (xmlhttp.status == SUCCESS) {
          swal('Saved!', '', 'success');
        } else {
          swal('Error', 'Error trying to update user details.', 'error');
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
 * The fields listed in this function are only the required fields.
 * @return {boolean} true if all the fields are filled, false otherwise.
 */
function isValidDataEntry() {
  return (fieldName.value && fieldEmail.value &&
          fieldBirthdate.value && fieldGender.selectedIndex > 0);
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
    birthdate: fieldBirthdate.value,
    phone: fieldPhone.value,
    gender_id: fieldGender.value,
    weight: fieldWeight.value,
    height: fieldHeight.value,
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

/**
 * Loads the gender list.
 */
async function loadGenderList() {
  const url = `/api/gender/`;
  const myHeaders = new Headers({'Authorization': 'Bearer '+getJwtToken()});
  const myInit = {method: 'GET', headers: myHeaders};
  const response = await fetch(url, myInit);

  const {status} = response;

  switch (status) {
    case 200:
      const data = await response.json();
      data.forEach((item) => {
        const html = createNewSelectOptionHTML(item.id, item.description);
        addSelectOptionElement(fieldGender, html);
      });
      break;

    case 401:
      console.log('Session expired.');
      break;

    case 404:
      console.log('No itens for gender list.');
      break;
  }
}

/**
 * Create a new HTML element to be a select option.
 * @param {Number} value The return value for this option.
 * @param {string} description The string that will be printed.
 * @return {string} String HTML of a new select option.
 */
function createNewSelectOptionHTML(value, description) {
  return `<option value="${value}">${description}</option>`;
}
/**
 * Adds a new select option.
 * @param {HTMLElement} selectElement The select element that will
 * receive the new option.
 * @param {string} html The string HTML of the select option.
 */
function addSelectOptionElement(selectElement, html) {
  selectElement.innerHTML = selectElement.innerHTML.concat(html);
}

loadUserInfos();
loadGenderList();

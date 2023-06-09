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
const fieldBloodType = document.getElementById('field_BloodType');
const fieldDiagnosisDate = document.getElementById('field_DateOfDiagnosis');
const btnUpdateHealthInfo = document.getElementById('btnUpdateHealthInfo');

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const SUCCESS = 201;
const XMLHTTPREQUEST_STATUS_DONE = 4;

const DEFAULT_PROFILE_PICTURE = '../includes/imgs/default-profile-picture.jpg';

let profilePictureBase64 = '';

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
          swal('Error', 'Error updating user details.', 'error');
        }
      }
    };
    sendRequestToUserDetails(xmlhttp);
  } else {
    showAlertMessage();
  }
});

// //////////////////
// UPDATE HEALTH INFO
// //////////////////
btnUpdateHealthInfo.addEventListener('click', (event) => {
  event.preventDefault();

  if (isValidHealthInfoDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
        if (xmlhttp.status == HTTP_OK) {
          swal('Saved!', '', 'success');
        } else {
          swal('Error', 'Error updating health info.', 'error');
        }
      }
    };
    sendRequestToUpdateHealthInfo(xmlhttp);
  } else {
    showAlertMessage();
  }
});

/**
 * @return {boolean} If the health info is trully filled.
 */
function isValidHealthInfoDataEntry() {
  return (fieldDiabetesType.selectedIndex > 0 &&
    fieldBloodType.selectedIndex > 0 &&
    fieldDiagnosisDate.value);
}


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
          const userData = JSON.parse(xmlhttp.responseText);
          loadFieldsWithUserData(userData);
          break;

        case HTTP_UNAUTHORIZED:
          handleSessionExpired();// sessionUtils.js
          break;

        default:
          swal('Error', 'Please, try again', 'error');
          break;
      }
    }
  };
  sendRequest(xmlhttp);
}

/**
 * Sends a request to get the user's details and health information.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendRequest(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  if (token && userId) {
    xmlhttp.open('GET', `/api/healthinfo/user/${userId}`);
    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
  } else {
    throw Error('Authentication token not found.');
  }
}

/**
 * Distributes the data response in the fields.
 * @param {Response} object The response data.
 */
function loadFieldsWithUserData(object) {
  // USER'S DETAILS
  fieldName.value = object.user.name;
  fieldEmail.value = object.user.email;
  fieldBirthdate.value = object.user.birthdate ? object.user.birthdate : '';
  fieldPhone.value = object.user.phone ? object.user.phone : '';
  fieldGender.value = object.user.gender_id ? object.user.gender_id : 0;
  fieldWeight.value = object.user.weight ? object.user.weight : '';
  fieldHeight.value = object.user.height ? object.user.height : '';
  fieldDiagnosisDate.value = object.month_diagnosis;
  // PICTURE
  if (!object.user.picture) {
    profilePictureBase64 = DEFAULT_PROFILE_PICTURE;
  } else {
    profilePictureBase64 = object.user.picture;
  }
  userProfilePicture.src = profilePictureBase64;
  setTimeout(() => {
    /* The SELECT element needs to be completly
    filled with options from the database before
    setting a value to it. That's why we're using
    this setTimeout.*/
    fieldGender.value = object.user.gender_id ? object.user.gender_id : 0;
    fieldDiabetesType.value = object.diabetes_type ? object.diabetes_type : 0;
    fieldBloodType.value = object.blood_type ? object.blood_type : 0;
  }, 20);
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
 * Sends a request to update the user's health info.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendRequestToUpdateHealthInfo(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  const jsonUpdateUser = prepareJsonHealthInfo();
  xmlhttp.open('PUT', `/api/healthinfo/user/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonUpdateUser);
}

/**
 * Creates a JSON object with the user's specific information.
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
 * Creates a JSON object with user's health info values.
 * @return {JSON} A JSON object.
 */
function prepareJsonHealthInfo() {
  return JSON.stringify({
    diabetesType: fieldDiabetesType.selectedIndex,
    monthDiagnosis: fieldDiagnosisDate.value,
    bloodType: fieldBloodType.selectedIndex,
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
 * This function is a utility function that simplifies the process
 * of sending HTTP requests to an API using the Fetch API.
 * @param {string} url The url you want to reach.
 * @return {Response}
 */
async function fetchData(url) {
  const headers = new Headers({'Authorization': 'Bearer ' + getJwtToken()});
  const myInit = {method: 'GET', headers: headers};
  const response = await fetch(url, myInit);
  return response;
}

/**
 * Loads the gender list.
 */
async function loadGenderList() {
  const response = await fetchData('/api/gender/');
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
 * Loads the diabetes type list.
 */
async function loadDiabetesTypeList() {
  const response = await fetchData('/api/diabetestype/');
  const {status} = response;

  switch (status) {
    case 200:
      const data = await response.json();
      data.forEach((item) => {
        const html = createNewSelectOptionHTML(item.id, item.description);
        addSelectOptionElement(fieldDiabetesType, html);
      });
      break;

    case 401:
      console.log('Session expired.');
      break;

    case 404:
      console.log('No itens for diabetes type list.');
      break;
  }
}

/**
 * Loads the blood type list.
 */
async function loadBloodTypeList() {
  const response = await fetchData('/api/bloodtype/');
  const {status} = response;

  switch (status) {
    case 200:
      const data = await response.json();
      data.forEach((item) => {
        const html = createNewSelectOptionHTML(item.id, item.description);
        addSelectOptionElement(fieldBloodType, html);
      });
      break;

    case 401:
      console.log('Session expired.');
      break;

    case 404:
      console.log('No itens for blood type list.');
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

loadGenderList();
loadDiabetesTypeList();
loadBloodTypeList();
loadUserInfos();

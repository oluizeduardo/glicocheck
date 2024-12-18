/* eslint-disable max-len */
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
const btnSaveHealthInfo = document.getElementById('btnSaveHealthInfo');

// HTTP STATUS CODE
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const XMLHTTPREQUEST_STATUS_DONE = 4;

// DEFAULT PICTURE
const DEFAULT_PROFILE_PICTURE = '../includes/imgs/default-profile-picture.jpg';
let profilePictureBase64 = '';

// /////////////////
// SAVE USER DETAILS
// /////////////////
btnSaveUserDetails.addEventListener('click', (event) => {
  event.preventDefault();

  if (!isValidDataEntry()) {
    showAlertMessage();
    return;
  }

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHTTPREQUEST_STATUS_DONE) {
      if (xmlhttp.status === HTTP_OK) {
        swal('Saved!', '', 'success');
      } else if (xmlhttp.status === 413) {
        swal('Too Large Request', 'The request was too large.', 'error');
      } else {
        showErrorMessage('Error updating user details.');
      }
    }
  };
  sendRequestToUserDetails(xmlhttp);
});

// ////////////////
// SAVE HEALTH INFO
// ////////////////
btnSaveHealthInfo.addEventListener('click', (event) => {
  event.preventDefault();

  if (!isValidHealthInfoDataEntry()) {
    showAlertMessage();
    return;
  }

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHTTPREQUEST_STATUS_DONE) {
      if (xmlhttp.status === HTTP_OK || xmlhttp.status === HTTP_CREATED) {
        swal('Saved!', '', 'success');
      } else {
        showErrorMessage('Error updating health info.');
      }
    }
  };
  sendRequestToUpdateHealthInfo(xmlhttp);
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
 * Sends a request to get the user's information.
 * If the request returns suceess, the data recovered
 * should be used to fill the fields on the screen.
 * In case the JWT token is expired, executes handleSessionExpired()
 * from security.js.
 */
function loadUserInfo() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHTTPREQUEST_STATUS_DONE) {
      switch (xmlhttp.status) {
        case HTTP_OK:
          const userData = JSON.parse(xmlhttp.responseText);
          loadFieldsWithUserData(userData);
          break;

        case HTTP_UNAUTHORIZED:
          handleSessionExpired();// sessionUtils.js
          break;

        default:
          showErrorMessage('Please, try again');
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
    xmlhttp.open('GET', API_BASE_REQUEST+`/users/${userId}`);
    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
  } else {
    swal({
      title: 'Error accessing user\'s information',
      text: 'Please, do the login again.',
      icon: 'error',
    }).then(() => {
      logOut();// sessionUtils.js
    });
  }
}

/**
 * Distributes the data response in the fields.
 * @param {Response} object The response data.
 */
function loadFieldsWithUserData(object) {
  // USER'S DETAILS
  fieldName.value = object.name;
  fieldEmail.value = object.email;
  fieldBirthdate.value = object.birthdate ? object.birthdate : '';
  fieldPhone.value = object.phone ? object.phone : '';
  fieldWeight.value = object.weight ? object.weight : '';
  fieldHeight.value = object.height ? object.height : '';
  fieldDiagnosisDate.value = object.month_diagnosis;
  // PICTURE
  if (!object.picture) {
    profilePictureBase64 = DEFAULT_PROFILE_PICTURE;
  } else {
    profilePictureBase64 = object.picture;
  }
  userProfilePicture.src = profilePictureBase64;
  setTimeout(() => {
    /* The SELECT element needs to be completly
    filled with options from the database before
    setting a value to it. That's why we're using
    this setTimeout.*/
    fieldGender.value = object.id_gender ? object.id_gender : 0;
    fieldDiabetesType.value = object.id_diabetes_type ? object.id_diabetes_type : 0;
    fieldBloodType.value = object.id_blood_type ? object.id_blood_type : 0;
  }, 20);
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

  if (!token || !userId) logOut();

  const jsonUpdateUser = prepareJsonUser();
  xmlhttp.open('PUT', API_BASE_REQUEST+`/users/${userId}`);
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

  if (!token || !userId) logOut();

  const jsonUpdateUser = prepareJsonHealthInfo();
  xmlhttp.open('PUT', API_BASE_REQUEST+`/healthinfo/user/${userId}`);
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
    id_gender: fieldGender.value,
    weight: fieldWeight.value,
    height: fieldHeight.value,
    picture: profilePictureBase64,
  });
}

/**
 * Creates a JSON object with user's health info values.
 * @return {JSON} A JSON object.
 */
function prepareJsonHealthInfo() {
  return JSON.stringify({
    id_diabetes_type: fieldDiabetesType.value,
    month_diagnosis: fieldDiagnosisDate.value,
    id_blood_type: fieldBloodType.value,
  });
}

/**
 * Shows a message warning the user to fill all the fields.
 */
function showAlertMessage() {
  swal('', 'All the fields need to be filled.', 'warning');
}

/**
 * Show error message.
 * @param {string} message
 */
function showErrorMessage(message) {
  swal('Error', message, 'error');
}

const profilePictureMaximumSizeInMB = 1.5;

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
      if (isFileSizeValid(file, profilePictureMaximumSizeInMB)) {
        userProfilePicture.src = URL.createObjectURL(file);
        generateDataURL(file);
      } else {
        swal('File too Large',
            `The file must be a maximum of ${profilePictureMaximumSizeInMB}MB.`,
            'warning');
      }
    }
  });
});

/**
 * Checks if the file size is within the specified maximum size in MB.
 * @param {File} file - The file to be checked.
 * @param {number} fileMaximumSizeInMB - The maximum allowed file size in megabytes.
 * @return {boolean} - Returns true if the file size is within the limit, otherwise false.
 */
function isFileSizeValid(file, fileMaximumSizeInMB) {
  if (fileMaximumSizeInMB <= 0) return false;
  const maxSizeInBytes = fileMaximumSizeInMB * 1048576; // 1MB = 1048576 bytes
  return file.size <= maxSizeInBytes;
}

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
  const response = await fetchData(API_BASE_REQUEST+'/genders/');
  const {status} = response;

  switch (status) {
    case HTTP_OK:
      const data = await response.json();
      data.forEach((item) => {
        const html = createNewSelectOptionHTML(item.id, item.description);
        addSelectOptionElement(fieldGender, html);
      });
      break;

    case HTTP_UNAUTHORIZED:
      handleSessionExpired();
      break;

    case HTTP_NOT_FOUND:
      console.log('No itens for gender list.');
      break;
  }
}

/**
 * Loads the diabetes type list.
 */
async function loadDiabetesTypeList() {
  const response = await fetchData(API_BASE_REQUEST+'/diabetestype/');
  const {status} = response;

  switch (status) {
    case HTTP_OK:
      const data = await response.json();
      data.forEach((item) => {
        const html = createNewSelectOptionHTML(item.id, item.description);
        addSelectOptionElement(fieldDiabetesType, html);
      });
      break;

    case HTTP_UNAUTHORIZED:
      handleSessionExpired();
      break;

    case HTTP_NOT_FOUND:
      console.log('No itens for diabetes type list.');
      break;
  }
}

/**
 * Loads the blood type list.
 */
async function loadBloodTypeList() {
  const response = await fetchData(API_BASE_REQUEST+'/bloodtype/');
  const {status} = response;

  switch (status) {
    case HTTP_OK:
      const data = await response.json();
      data.forEach((item) => {
        const html = createNewSelectOptionHTML(item.id, item.description);
        addSelectOptionElement(fieldBloodType, html);
      });
      break;

    case HTTP_UNAUTHORIZED:
      handleSessionExpired();
      break;

    case HTTP_NOT_FOUND:
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
loadUserInfo();

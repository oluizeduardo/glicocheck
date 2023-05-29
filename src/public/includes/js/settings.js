const fieldMeasurementUnity = document.getElementById('field_MeasurementUnity');
const measurementUnityHypo = document.getElementById('measurement_unity_hypo');
const measurementUnityHyper = document.getElementById('measurement_unity_hyper');
const fieldValueHypo = document.getElementById('valueHypo');
const fieldValueHyper = document.getElementById('valueHyper');
const hypoRange = document.getElementById('hypoRange');
const hyperRange = document.getElementById('hyperRange');
// Meal time
const fieldBreakfastPre = document.getElementById('field_breakfast_pre');
const fieldBreakfastPos = document.getElementById('field_breakfast_pos');
const fieldLunchPre = document.getElementById('field_lunch_pre');
const fieldLunchPos = document.getElementById('field_lunch_pos');
const fieldDinnerPre = document.getElementById('field_dinner_pre');
const fieldDinnerPos = document.getElementById('field_dinner_pos');
const fieldSleepTime = document.getElementById('field_sleep_time');
// Button
const btnSaveSettings = document.getElementById('btnSaveSettings');

const MG_DL = 'mg/dL';
const MMOL_L = 'mmol/L';

const SUCCESS = 201;
const XMLHTTPREQUEST_STATUS_DONE = 4;

/**
 * Update the meaurement unity label.
 */
function updateGlycemiaValueLabel() {
  const unity = getMeasurementUnity();
  convertGlycemiaValues(unity);
  measurementUnityHypo.innerText = unity;
  measurementUnityHyper.innerText = unity;
}
/**
 * It converts the glycemia value depending on the measurement unity.
 * @param {string} unity The measurement unity to convert to.
 */
function convertGlycemiaValues(unity) {
  let valueHypo;
  let valueHyper;

  if (unity === MG_DL) {
    valueHypo = '70';
    valueHyper = '160';
    setRangePropertiesForMGDL();
  } else {
    valueHypo = '4';
    valueHyper = '9';
    setRangePropertiesForMMOL();
  }
  fieldValueHypo.innerText = valueHypo;
  fieldValueHyper.innerText = valueHyper;
}
/**
 * Returns the glycemia meaurement unity.
 * @return {string} A string informing the glycemia measurement unity.
 */
function getMeasurementUnity() {
  return fieldMeasurementUnity.value === '1' ? MG_DL : MMOL_L;
}
/**
 * Update range fields.
 */
function setRangePropertiesForMGDL() {
  hypoRange.min = '60';
  hypoRange.max = '80';
  hypoRange.value = '70';
  hyperRange.min = '150';
  hyperRange.max = '170';
  hyperRange.value = '160';
}
/**
 * Update range fields.
 */
function setRangePropertiesForMMOL() {
  hypoRange.min = '3';
  hypoRange.max = '4';
  hypoRange.value = '4';
  hyperRange.min = '8';
  hyperRange.max = '9';
  hyperRange.value = '9';
}
/**
 * Initialize tooltip.
 */
function initializeTooltip() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
/**
 * Updates the time of the posprandial field
 * based on the preprandial value by adding two hours.
 *
 * @param {HTMLInputElement} preElement - The input element
 * containing the preprandial time value.
 * @param {HTMLInputElement} posElement - The input element
 * to update with the posprandial time value.
 * @return {void}
 */
function updatePosprandial(preElement, posElement) {
  const preValue = preElement.value;
  const [hour, minute] = preValue.split(':').map(Number);
  const plusTwoHours = (hour + 2) % 24;
  const posprandialHour = `${String(plusTwoHours).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  posElement.value = posprandialHour;
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
 * Loads the default system configuration.
 */
async function loadSystemConfiguration() {
  const response = await fetchData('/api/systemconfiguration/user/' + getUserId());
  const {status} = response;

  switch (status) {
    case 200:
      const data = await response.json();
      fillConfigurationFields(data);
      break;

    case 401:
      handleSessionExpired();
      break;

    case 404:
      swal('Error',
          `No system configuration found for this user.
          Please, contact an admin user.`,
          'error');
      break;
  }
}
/**
 * It fills the fields with the specific system configurations.
 * @param {Object} item Item received from the data response.
 */
function fillConfigurationFields(item) {
  fieldMeasurementUnity.value = item.glucose_unity_id;
  const measurementUnity = getMeasurementUnity();

  // Adjust min and max.
  if (measurementUnity === MMOL_L) {
    setRangePropertiesForMMOL();
  } else {
    setRangePropertiesForMGDL();
  }

  hypoRange.value = item.limit_hypo;
  hyperRange.value = item.limit_hyper;

  measurementUnityHypo.innerText = measurementUnity;
  measurementUnityHyper.innerText = measurementUnityHypo.innerText;
  fieldValueHypo.innerText = item.limit_hypo;
  fieldValueHyper.innerText = item.limit_hyper;

  fieldBreakfastPre.value = item.time_bf_pre;
  fieldBreakfastPos.value = item.time_bf_pos;
  fieldLunchPre.value = item.time_lunch_pre;
  fieldLunchPos.value = item.time_lunch_pos;
  fieldDinnerPre.value = item.time_dinner_pre;
  fieldDinnerPos.value = item.time_dinner_pos;
  fieldSleepTime.value = item.time_sleep;
}

// /////////////////////////
// SAVE SYSTEM CONFIGURATION
// /////////////////////////
btnSaveSettings.addEventListener('click', (event) => {
  event.preventDefault();

  if (isValidDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
        if (xmlhttp.status == SUCCESS) {
          swal('Saved!', '', 'success');
        } else {
          swal(
              'Error',
              'Error trying to update the system configuration.',
              'error');
        }
      }
    };
    sendRequestToUpdateSystemConfiguration(xmlhttp);
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
  return (fieldBreakfastPre.value && fieldBreakfastPos.value &&
          fieldLunchPre.value && fieldLunchPos.value &&
          fieldDinnerPre.value && fieldDinnerPos.value &&
          fieldSleepTime.value);
}
/**
 * Sends a request to update the system configuration.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendRequestToUpdateSystemConfiguration(xmlhttp) {
  const token = getJwtToken();
  const userId = getUserId();

  const jsonUpdateUser = prepareJsonRequest();
  xmlhttp.open('PUT', `/api/systemconfiguration/user/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonUpdateUser);
}
/**
 * Creates a JSON object with values to be updated.
 * @return {JSON} A JSON object.
 */
function prepareJsonRequest() {
  return JSON.stringify({
    glucoseUnityId: fieldMeasurementUnity.value,
    limitHypo: hypoRange.value,
    limitHyper: hyperRange.value,
    timeBreakfastPre: fieldBreakfastPre.value,
    timeBreakfastPos: fieldBreakfastPos.value,
    timeLunchPre: fieldLunchPre.value,
    timeLunchPos: fieldLunchPos.value,
    timeDinnerPre: fieldDinnerPre.value,
    timeDinnerPos: fieldDinnerPos.value,
    timeSleep: fieldSleepTime.value,
  });
}

loadSystemConfiguration();
initializeTooltip();

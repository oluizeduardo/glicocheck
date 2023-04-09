const btnSave = document.getElementById('btnSave');
const fieldGlucose = document.getElementById('field_Glucose');
const fieldDate = document.getElementById('field_Date');
const fieldMarkermeal = document.getElementById('field_Markermeal');

const HTTP_CREATED = 200;

btnSave.addEventListener('click', function(event) {
  event.preventDefault();

  if (isValidDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
        switch (xmlhttp.status) {
          case HTTP_CREATED:
            resetFields();
            resetChart();
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
    sendPOSTToGlucose(xmlhttp);
  } else {
    showWarningMessage();
  }
});

/**
 * Checks whether the fields are filled.
 * @return {boolean} true if the fields are filled. false otherwise.
 */
function isValidDataEntry() {
  return (fieldGlucose.value && fieldDate.value &&
            (fieldMarkermeal.selectedIndex > 0));
}

/**
 * Sends a POST request to register a new glucose reading enter.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendPOSTToGlucose(xmlhttp) {
  const jsonNewEnter = prepareJsonNewEnter();
  const token = getJwtToken();
  xmlhttp.open('POST', '/api/glucose');
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonNewEnter);
}

/**
 * Creates a JSON object to be sent to register a new glucose reading.
 * @return {JSON} A JSON object.
 */
function prepareJsonNewEnter() {
  return JSON.stringify({
    userId: getUserId(),
    glucose: fieldGlucose.value,
    unityId: 1,
    dateTime: fieldDate.value,
    markerMealId: fieldMarkermeal.selectedIndex,
  });
}

/**
 * Shows a message warning the user to fill all the fields.
 */
function showWarningMessage() {
  swal('', 'All the fields need to be filled.', 'warning');
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
 * Reset fields.
 */
function resetFields() {
  fieldGlucose.value = '';
  fieldMarkermeal.selectedIndex = 0;
  panelWelcomeCenter.classList.add('invisible');
  panelChart.classList.remove('invisible');
}

/**
 * Reset the chart by destroing it and load
 * the updated list of glucose readings.
 */
function resetChart() {
  destroyChart();
  loadGlucoseReadingsByUserId();
}

/**
 * Destroy the chart to run its update.
 */
function destroyChart() {
  if (glucoseReadingsChart != null) {
    glucoseReadingsChart.destroy();
  }
  glucoseValues = [];
  glucoseReadingDateLabels = [];
  hyperglycemiaValues = [];
  hypoglycemiaValues = [];
}

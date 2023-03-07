const btnSave = document.getElementById('btnSave');
const fieldGlucose = document.getElementById('field_Glucose');
const fieldDate = document.getElementById('field_Date');
const fieldMarkermeal = document.getElementById('field_Markermeal');

const CREATED = 200;
const XMLHTTPREQUEST_STATUS_DONE = 4;

btnSave.addEventListener('click', function(event) {
  event.preventDefault();

  if (isValidDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
        if (xmlhttp.status == CREATED) {
          resetFields();
          resetChart();
        } else {
          swal('Error', 'Please, try again', 'error');
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

function sendPOSTToGlucose(xmlhttp) {
  const jsonNewEnter = prepareJsonNewEnter();
  const token = getJwtToken();
  xmlhttp.open('POST', '/api/glucose');
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonNewEnter);
}

function prepareJsonNewEnter() {
  return JSON.stringify({
    userId: getUserId(),
    glucose: fieldGlucose.value,
    unityId: 1,
    date: getDate(),
    hour: getTime(),
    markerMealId: fieldMarkermeal.selectedIndex,
  });
}

function getDate() {
  const arrayDate = fieldDate.value.slice(0, 10).split('-');
  const day = arrayDate[2];
  const month = arrayDate[1];
  const year = arrayDate[0];
  return `${day}/${month}/${year}`;
}

function getTime() {
  return fieldDate.value.slice(11);
}

function showWarningMessage() {
  swal('', 'Please, fill in all the fields.', 'warning');
}

function getJwtToken() {
  return sessionStorage.getItem('jwt');
}

function getUserId() {
  return sessionStorage.getItem('userId');
}

function resetFields() {
  fieldGlucose.value='';
  fieldMarkermeal.selectedIndex = 0;
  panelWelcomeCenter.classList.add('invisible');
  panelChart.classList.remove('invisible');
}

function resetChart() {
  destroyChart();
  loadGlucoseReadingsByUserId();
}

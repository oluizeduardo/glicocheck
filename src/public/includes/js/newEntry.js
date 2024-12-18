/* eslint-disable no-unused-vars */
const btnSave = document.getElementById('btnSave');
const btnAddGlycemiaLog = document.getElementById('btnAddGlycemiaLog');
const fieldGlucose = document.getElementById('field_Glucose');
const fieldDate = document.getElementById('field_Date');
const fieldMarkermeal = document.getElementById('field_Markermeal');
const fieldFood = document.getElementById('field_Food');
const fieldTotalCarbs = document.getElementById('field_TotalCarbs');
const panelListFood = document.getElementById('panelListFood');
const labelTotalCarbs = document.getElementById('labelTotalCarbs');
let totalCarbs = 0;

const HTTP_CREATED = 201;
const NAME_PAGE_DAIRY = 'diary.html';

btnAddGlycemiaLog.addEventListener('click', function(event) {
  fieldDate.value = getLocalDateTime();
});

btnSave.addEventListener('click', function(event) {
  event.preventDefault();

  if (!isValidDataEntry()) {
    showWarningMessage();
    return;
  }

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHTTPREQUEST_STATUS_DONE) {
      switch (xmlhttp.status) {
        case HTTP_CREATED:
          if (location.href.endsWith(NAME_PAGE_DAIRY)) {
            window.location.reload();
          } else {
            resetFields();
            resetChart();
          }
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
  const jsonNewEntry = prepareJsonNewEntry();
  const token = getJwtToken();
  const userId = getUserId();

  if (!token || !userId) logOut();

  xmlhttp.open('POST', API_BASE_REQUEST + `/diary/users/${userId}`);
  xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send(jsonNewEntry);
}
/**
 * Loads the user's system configuration.
 * @return {number} The measurement unity id.
 */
function getMeasurementUnity() {
  const objectString = getSystemConfig();
  if (!objectString) {
    return 1;
  } else {
    return JSON.parse(objectString).id_measurement_unity;
  }
}
/**
 * Creates a JSON object to be sent to register a new glucose reading.
 * @return {JSON} A JSON object.
 */
function prepareJsonNewEntry() {
  return JSON.stringify({
    glucose: fieldGlucose.value,
    total_carbs: getTotalCarbs(),
    dateTime: fieldDate.value,
    id_markermeal: fieldMarkermeal.value,
    id_measurement_unity: getMeasurementUnity(),
  });
}
/**
 * @return {Number} The total amount of carbohydrates.
 */
function getTotalCarbs() {
  if (fieldTotalCarbs.value.trim()) {
    return parseInt(fieldTotalCarbs.value);
  }
  return 0;
}

/**
 * Shows a message warning the user to fill all the fields.
 */
function showWarningMessage() {
  swal('', 'All the fields need to be filled.', 'warning');
}

/**
 * Reset fields.
 */
function resetFields() {
  fieldGlucose.value = '';
  fieldDate.value = '';
  fieldMarkermeal.selectedIndex = 0;
  fieldTotalCarbs.value = '0';
  totalCarbs = 0;
  labelTotalCarbs.innerText = '0';
  panelListFood.innerHTML = '';
  panelWelcomeCenter.classList.add('invisible');
  panelChart.classList.remove('invisible');
}

/**
 * Reset the chart by destroing it and load
 * the updated list of glucose readings.
 */
function resetChart() {
  destroyChart();
  const [startDate, endDate] = getDateRangeByNumberOfWeeks(1);
  loadGlucoseReadingsByUserId({startDate, endDate});
}

/**
 * Destroys the glucose readings chart if it exists and
 * clears all associated data arrays.
 */
function destroyChart() {
  if (glucoseReadingsChart) glucoseReadingsChart.destroy();
  glucoseValues = [];
  glucoseReadingDateLabels = [];
  hyperglycemiaValues = [];
  hypoglycemiaValues = [];
}

/**
 * Add keypress listener to the field Food name.
 */
fieldFood.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const food = fieldFood.value.trim();
    if (food) {
      addNewListItem(food);
    }
  }
});

/**
 * Sends a request to the Nutrition table API.
 * @param {string} food The food that wants to check the
 * total of calories and carbohydrate. The ideal format
 * for this value is: amount of food followed by the food's name,
 * e.g. "1 cup of milk", "2 slices of cheese".
 */
async function addNewListItem(food) {
  const url = API_BASE_REQUEST + `/carbscounting/${food}`;
  const myHeaders = new Headers({Authorization: 'Bearer ' + getJwtToken()});
  const myInit = {method: 'GET', headers: myHeaders};
  const response = await fetch(url, myInit);

  const {status} = response;

  switch (status) {
    case 200:
      const data = await response.json();
      const carbohydrate = Math.round(data.carbohydrate);
      const calories = Math.round(data.calories);
      const html = createNewListItemHTML(food, carbohydrate, calories);
      addListItemElement(html);
      updateTotalCarbs(carbohydrate);
      break;

    case 401:
      handleSessionExpired();
      break;

    case 404:
      swal('No records found',
          'Please, check the spelling and try again.',
          'warning');
      break;
  }
  fieldFood.value = '';
}
/**
 * Updates the total amount of carbohydrate.
 * @param {Number} value A new value to be summed to the total.
 */
function updateTotalCarbs(value) {
  totalCarbs += value;
  labelTotalCarbs.textContent = totalCarbs;
  fieldTotalCarbs.value = totalCarbs;
}
/**
 * Creates the HTML string of a new list item.
 * @param {string} food
 * @param {Number} carbohydrate
 * @param {Number} calories
 * @return {string} String of a new list item HTML element.
 */
function createNewListItemHTML(food, carbohydrate, calories) {
  return `<li class="list-group-item list-group-item-action 
            d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">${food}</div>
              Carbs: ${carbohydrate}g | Cal: ${calories}Kcal
            </div>
            <button type="button" 
              class="btn btn-highlight" 
              style="width: 20px; height: 20px; padding: 0px;" 
              title="Delete"
              onclick="removeItem(this, ${carbohydrate})">x
            </button>
          </li>`;
}
/**
 * Adds a new list item to the list of food.
 * @param {string} html
 */
function addListItemElement(html) {
  panelListFood.innerHTML = panelListFood.innerHTML.concat(html);
}
/**
 * Removes a list item.
 * @param {HTMLElement} buttom The button which was clicked.
 * @param {Number} carbohydrate The amount to be subtracted.
 */
function removeItem(buttom, carbohydrate) {
  const item = buttom.parentNode;
  item.parentNode.removeChild(item);
  totalCarbs -= carbohydrate;
  labelTotalCarbs.textContent = totalCarbs;
  fieldTotalCarbs.value = totalCarbs;
}

/**
 * Gets the current date and time in the local timezone
 * and formats it as a string in the `YYYY-MM-DDTHH:MM` format,
 * suitable for input elements of type `datetime-local`.
 *
 * @return {string} - The formatted date and time string in
 * `YYYY-MM-DDTHH:MM` format.
 */
function getLocalDateTime() {
  const now = new Date();
  return now.getFullYear() + '-' +
         String(now.getMonth() + 1).padStart(2, '0') + '-' +
         String(now.getDate()).padStart(2, '0') + 'T' +
         String(now.getHours()).padStart(2, '0') + ':' +
         String(now.getMinutes()).padStart(2, '0');
}

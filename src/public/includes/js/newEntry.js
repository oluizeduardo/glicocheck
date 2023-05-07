const btnSave = document.getElementById('btnSave');
const fieldGlucose = document.getElementById('field_Glucose');
const fieldDate = document.getElementById('field_Date');
const fieldMarkermeal = document.getElementById('field_Markermeal');
const fieldFood = document.getElementById('field_Food');
const fieldTotalCarbs = document.getElementById('field_TotalCarbs');

const HTTP_CREATED = 200;
const NAME_PAGE_DAIRY = 'diary.html';

btnSave.addEventListener('click', function(event) {
  event.preventDefault();

  if (isValidDataEntry()) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
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
    glucose_unity_id: 1, // mg/dL
    total_carbs: getTotalCarbs(),
    dateTime: fieldDate.value,
    markerMealId: fieldMarkermeal.selectedIndex,
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

const panelListFood = document.getElementById('panelListFood');
const labelTotalCarbs = document.getElementById('labelTotalCarbs');
let totalCarbs = 0;


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
  const url = `/api/carbscounting/${food}`;
  const myHeaders = new Headers({'Authorization': 'Bearer '+getJwtToken()});
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
  return `<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
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

const selectMarkermeal = document.getElementById('field_Markermeal');

/**
 * Loads the marker meal list.
 */
async function loadMarkerMealList() {
  const response = await fetchData(API_BASE_REQUEST+'/markermeal/');
  const {status} = response;

  switch (status) {
    case 200:
      const data = await response.json();
      data.forEach((item) => {
        const html = createNewSelectOptionHTML(item.id, item.description);
        addSelectOptionElement(selectMarkermeal, html);
      });
      break;

    case 401:
      console.log('Session expired.');
      break;

    case 404:
      console.log('No itens found for the marker meal list.');
      break;
  }
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
 * Gets the JWT token from Local Storage.
 * @return {string} The JWT token.
 */
function getJwtToken() {
  return sessionStorage.getItem('jwt');
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
  selectElement.insertAdjacentHTML('beforeend', html);
}

loadMarkerMealList().catch((error) => {
  console.error('Error occurred while loading marker meal list:', error);
});

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const XMLHTTPREQUEST_STATUS_DONE = 4;

/**
 * Read from the database the list of glucose readings
 * of a specific user.
 */
function getGlucoseReadingsByUserId() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
      switch (xmlhttp.status) {
        case HTTP_OK:
          document.getElementById('diary-table-body').deleteRow(0);
          fillGlucoseDiaryTable(xmlhttp.responseText);
          break;

        case HTTP_NOT_FOUND:
          console.log('No registers found.');
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
  sendGETToGlucose(xmlhttp);
}
/**
 * Sends a GET request to recover the list of glucose readings
 * of the online user.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendGETToGlucose(xmlhttp) {
  const token = getJwtToken();

  if (token) {
    xmlhttp.open('GET', '/api/glucose/user/online');
    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
  } else {
    throw Error('Authentication token not found.');
  }
}
/**
 * Retrives the JWT token in the session storage.
 * @return {string} The JWt token.
 */
function getJwtToken() {
  return sessionStorage.getItem('jwt');
}
/**
 * Distributes on the table the values received from the API response.
 * @param {string} responseText The response text from XMLHttpRequest.
 */
function fillGlucoseDiaryTable(responseText) {
  const registers = JSON.parse(responseText);
  const diaryTable = document.getElementById('glucoseDiary')
      .getElementsByTagName('tbody')[0];

  for (i=0; i < registers.length; i++) {
    const dateTime = registers[i].dateTime;
    const glucoseValue = registers[i].glucose;
    addNewValueIntoTheTable(diaryTable, glucoseValue, dateTime);
  }
}

let currentDateOnTableRow = '';
let currentTableRow;

/**
 * Adds a new glucose reading value into the diary table.
 * The readings made in the same day will be distributed in the
 * same line on the table depending on the time.
 * @param {HTMLElement} diaryTable The HTML element representing the table.
 * @param {Number} glucoseValue The glucose value that should
 * be printed on the table.
 * @param {string} dateTime The date and time when this reading was made.
 */
function addNewValueIntoTheTable(diaryTable, glucoseValue, dateTime) {
  const date = dateTime.slice(0, 10);
  if (date !== currentDateOnTableRow) {
    currentTableRow = createTR(glucoseValue, dateTime);
    diaryTable.appendChild(currentTableRow);
    currentDateOnTableRow = date;
  } else {
    setGlucoseValueBasedOnTime(currentTableRow, glucoseValue, dateTime);
  }
}
/**
 * Creates a new TR HTML element.
 * @param {Number} glucoseValue The glucose value that should
 * be printed on the table.
 * @param {string} dateTime The date and time when this reading was made.
 * @return {Element} HTML element 'tr'.
 */
function createTR(glucoseValue, dateTime) {
  const newTR = document.createElement('tr');
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  newTR.appendChild(createTD(''));
  setGlucoseValueBasedOnTime(newTR, glucoseValue, dateTime);
  return newTR;
}
/**
 * Creates an instance of "td" element.
 * @param {string} data The text that should be printed inside td element.
 * @param {string} cssClass The CSS class.
 * @return {Element} HTML element 'td'.
 */
function createTD(data, cssClass='td') {
  const td = document.createElement('td');
  td.textContent = data;
  td.classList.add(cssClass);
  return td;
}
/**
 * Distributes the glucose value according to the date and time
 * when this glucose reading was recorded.
 * @param {HTMLElement} tr The table line where the glucose.
 * value will be printed.
 * @param {Number} glucoseValue The value to be showed on the table.
 * @param {string} dateTime A value representing the date and time when the
 * glucose reading was recorded.
 */
function setGlucoseValueBasedOnTime(tr, glucoseValue, dateTime) {
  const time = dateTime.slice(-5);
  const hour = Number.parseInt(time.slice(0, 2));
  const collection = tr.querySelectorAll('td');
  fillColumnDate(collection[0], dateTime);
  const element = collection[getIndex(hour)];
  element.appendChild(createDiv(glucoseValue));
}
/**
 * Fill the column responsible to receive information about the date.
 * @param {HTMLElement} element The TD element responsible
 * to receive information regarded the date.
 * @param {string} dateTime The date to be printed inside the element.
 */
function fillColumnDate(element, dateTime) {
  const weekday = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  const date = new Date(dateTime);
  element.textContent = weekday[date.getDay()];
  element.appendChild(document.createElement('br'));
  element.appendChild(createSmall(dateTime));
}
/**
 * Creates a small element with a date inside.
 * @param {string} dateTime A value representing the date and time when the
 * glucose reading was recorded.
 * @return {HTMLElement} A div element.
 */
function createSmall(dateTime) {
  const small = document.createElement('small');
  small.textContent = adaptLabelDate(dateTime);
  return small;
}
/**
 * This function adapts the string showed in the X axe of the chart.
 * @param {string} value The string in the date and time format.
 * @return {string} The date in simplified text.
 */
function adaptLabelDate(value) {
  const fullDate = value.slice(0, 10);
  const arrayDate = fullDate.split('-');
  const day = arrayDate[2];
  const month = arrayDate[1];
  const year = arrayDate[0];
  return `${day}/${month}/${year.slice(-2)}`;
}
/**
 * Creates a div element with the informed text.
 * @param {string} glucoseValue The glucose value to be printed
 * inside the element.
 * @return {HTMLElement} A div element.
 */
function createDiv(glucoseValue) {
  const div = document.createElement('div');
  applyStyle(div, glucoseValue);
  div.textContent = glucoseValue;
  return div;
}
/**
 * Gets an index based on the informed hour.
 * @param {Number} hour A number representing the hour.
 * @return {Number} A number representing an index.
 */
function getIndex(hour) {
  let index = 0;
  if (hour >= 0) {
    index = 19;

    if (hour >= 5) {
      index = 1;

      if (hour >= 8) {
        index = 4;

        if (hour >= 12) {
          index = 6;

          if (hour >= 14) {
            index = 9;

            if (hour >= 19) {
              index = 11;

              if (hour >= 21) {
                index = 14;

                if (hour >= 22) {
                  index = 16;
                }
              }
            }
          }
        }
      }
    }
  }
  return index;
}
/**
 * Applies style classes depending on the glucose value.
 * There are two different set of style classes: for hypoglycemia
 * and hyperglycemia.
 * @param {HTMLElement} element The element which will receive the style.
 * @param {Number} glucoseValue A number representing the glucose value.
 */
function applyStyle(element, glucoseValue) {
  const styleClasses = [
    'badge',
    'text-light',
    'border',
    'rounded-circle',
    'p-2',
  ];
  if (glucoseValue <= 60) {
    styleClasses.push('bg-danger');
  } else if (glucoseValue >= 160) {
    styleClasses.push('bg-primary');
  } else {
    styleClasses.push('bg-success');
  }
  styleClasses.forEach((style) => element.classList.add(style));
}

document.getElementById('btnExport').addEventListener('click', () => {
  const divElement = document.getElementById('glucoseDiaryDiv').innerHTML;
  const oldPage = document.body.innerHTML;
  document.body.innerHTML =
    `<html><head><title>Diary Report</title></head><body>${divElement}</body>`;
  window.print();
  document.body.innerHTML = oldPage;
  window.location.reload();
  return false;
});

getGlucoseReadingsByUserId();

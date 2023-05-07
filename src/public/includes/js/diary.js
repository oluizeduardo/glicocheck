const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const XMLHTTPREQUEST_STATUS_DONE = 4;

const HYPOGLYCEMIA = 70;
const HYPERGLYCEMIA = 160;

const listOfGlucoseValues = [];
let lowestGlucoseValue = 999;
let highestGlucoseValue = 0;

/**
 * Read from the database the list of glucose records of a specific user.
 */
function getGlucoseReadingsByUserId() {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
      switch (xmlhttp.status) {
        case HTTP_OK:
          deleteFirstTableRow();
          fillGlucoseDiaryTable(xmlhttp.responseText);
          fillProrgessBarGlucoseDistribution();
          fillStatisticsTable();
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
 * Sends a GET request to recover the list of glucose records
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
    const message = `Error consulting blood glucose diary data. 
    Please do the login again.`;
    swal({
      title: 'Error',
      text: message,
      icon: 'error',
    }).then(() => {
      logOut();
    });
  }
}
/**
 * Before printing values on the table, remove the
 * first table line wich contains a default message.
 */
function deleteFirstTableRow() {
  document.getElementById('diary-table-body').deleteRow(0);
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
  const diaryTable = getDiaryTable();

  for (i=0; i < registers.length; i++) {
    const specificData = getSpecificData(registers[i]);
    addNewRegisterIntoTheTable(diaryTable, specificData);
    updateGlucoseIndicators(registers[i].glucose);
  }
}
/**
 * Update the glucose indicators such as: the list of
 * glucose values, the highest and lowest values.
 * @param {Number} glucoseValue
 */
function updateGlucoseIndicators(glucoseValue) {
  listOfGlucoseValues.push(glucoseValue);
  if (glucoseValue < lowestGlucoseValue) {
    lowestGlucoseValue = glucoseValue;
  } else if (glucoseValue > highestGlucoseValue) {
    highestGlucoseValue = glucoseValue;
  }
}

/**
 * @return {HTMLElement} The glucose diary table body element.
 */
function getDiaryTable() {
  return document.getElementById('glucoseDiary')
      .getElementsByTagName('tbody')[0];
}
/**
 * Gets in JSON format the specific data to be printed on the diary table.
 * @param {Object} register
 * @return {JSON} A JSON object.
 */
function getSpecificData(register) {
  return {
    dateTime: register.dateTime,
    glucoseValue: register.glucose,
    totalCarbs: register.totalCarbs,
  };
}

let currentTableRow;
let currentDateOnCurrentTableRow = '';

/**
 * Adds a new glucose diary register into the table.
 * The blood glucose readings made in the same day will be
 * distributed in the same line on the table depending on the time.
 * @param {HTMLElement} diaryTable The HTML element representing the table.
 * @param {JSON} specificData Specific data to be printed on the table.
 */
function addNewRegisterIntoTheTable(diaryTable, specificData) {
  const date = specificData.dateTime.slice(0, 10);
  // If it's the same date, print it on the same table row.
  if (date !== currentDateOnCurrentTableRow) {
    currentTableRow = createTR(specificData);
    diaryTable.appendChild(currentTableRow);
    currentDateOnCurrentTableRow = date;
  } else {
    setGlucoseRegisterBasedOnTime(currentTableRow, specificData);
  }
}
/**
 * Creates a new TR HTML element populated with specific data.
 * @param {JSON} specificData Specific data to be printed on the table.
 * @return {Element} HTML element 'tr'.
 */
function createTR(specificData) {
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
  setGlucoseRegisterBasedOnTime(newTR, specificData);
  return newTR;
}
/**
 * Creates an instance of "td" element.
 * @param {string} text The text that should be printed inside td element.
 * @return {Element} HTML element 'td'.
 */
function createTD(text) {
  const td = document.createElement('td');
  td.textContent = text;
  td.classList.add('td');
  return td;
}
/**
 * Distributes the glucose value according to the date and time
 * when this glucose reading was recorded.
 * @param {HTMLElement} tr The table line where the glucose.
 * value will be printed.
 * @param {JSON} specificData Specific data to be printed on the table.
 */
function setGlucoseRegisterBasedOnTime(tr, specificData) {
  const hour = getHour(specificData.dateTime);
  const listOfTDs = tr.querySelectorAll('td');
  fillColumnDate(listOfTDs[0], specificData.dateTime);
  fillColumnGlycemia(listOfTDs, hour, specificData.glucoseValue);
  fillColumnCarbohydrate(listOfTDs, hour, specificData.totalCarbs);
}
/**
 * Extracts from a string a number representing the hour.
 * @param {string} dateTime Date and time in string format.
 * @return {Number} The hour in number format.
 */
function getHour(dateTime) {
  const time = dateTime.slice(-5);
  return Number.parseInt(time.slice(0, 2));
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

let totalSumBloodGlucoseValues = 0;

/**
 * Fill the column glycemia.
 * @param {Array} tdElements List of table TDs.
 * @param {Number} hour The hour when the glucose value was recorded.
 * @param {Number} glucoseValue The value to be printed on the table.
 */
function fillColumnGlycemia(tdElements, hour, glucoseValue) {
  const element = tdElements[getIndexGlycemiaTD(hour)];
  element.appendChild(createDiv(glucoseValue));
  totalSumBloodGlucoseValues += glucoseValue;
}
/**
 * Fill the column with the total amount of carbohydrate.
 * @param {Array} tdElements List of table TDs.
 * @param {Number} hour The hour when the glucose value was recorded.
 * @param {Number} totalCarbs The value to be printed on the table.
 */
function fillColumnCarbohydrate(tdElements, hour, totalCarbs) {
  const indexTD = getIndexCarbsTD(hour);
  if (indexTD > 0) {
    const element = tdElements[indexTD];
    if (totalCarbs === 0) {
      totalCarbs = '';
    }
    element.innerText = totalCarbs;
  }
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
 * @param {string} value A string in the date and time format.
 * @return {string} The date in the format dd/MM/yyyy.
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
 * @return {Number} A number representing the index.
 */
function getIndexCarbsTD(hour) {
  if (hour >= 22) return 18;
  if (hour >= 19 && hour < 21) return 13;
  if (hour >= 12 && hour < 14) return 8;
  if (hour >= 6 && hour < 8) return 3;
  return -1;
}
/**
 * Gets an index based on the informed hour.
 * @param {Number} hour A number representing the hour.
 * @return {Number} A number representing an index.
 */
function getIndexGlycemiaTD(hour) {
  if (hour >= 22) return 16;
  if (hour >= 21) return 14;
  if (hour >= 19) return 11;
  if (hour >= 14) return 9;
  if (hour >= 12) return 6;
  if (hour >= 8) return 4;
  if (hour >= 5) return 1;
  return 19;
}

let qtdRegistersHipoglycemia = 0;
let qtdRegistersHyperglycemia = 0;
let qtdRegistersNormalGlycemia = 0;

/**
 * Gets the number of registers found.
 * @return {Number} The number of registers found.
 */
function getNumberOfRegisters() {
  return (
    qtdRegistersHipoglycemia +
    qtdRegistersHyperglycemia +
    qtdRegistersNormalGlycemia
  );
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
  if (glucoseValue <= HYPOGLYCEMIA) {
    styleClasses.push('bg-danger');
    qtdRegistersHipoglycemia++;
  } else if (glucoseValue >= HYPERGLYCEMIA) {
    styleClasses.push('bg-primary');
    qtdRegistersHyperglycemia++;
  } else {
    styleClasses.push('bg-success');
    qtdRegistersNormalGlycemia++;
  }
  styleClasses.forEach((style) => element.classList.add(style));
}
/**
 * Fill the progressbar about the distribution of glucose values.
 */
function fillProrgessBarGlucoseDistribution() {
  const pbHypo = document.getElementById('pbHypo');
  const pbNormal = document.getElementById('pbNormal');
  const pbHyper = document.getElementById('pbHyper');

  const percentHypo = convertToPercentage(qtdRegistersHipoglycemia);
  const percentNormal = convertToPercentage(qtdRegistersNormalGlycemia);
  const percentHyper = convertToPercentage(qtdRegistersHyperglycemia);

  pbHypo.innerText = qtdRegistersHipoglycemia;
  pbNormal.innerText = qtdRegistersNormalGlycemia;
  pbHyper.innerText = qtdRegistersHyperglycemia;

  pbHypo.style.width = adaptValueToPercentageText(percentHypo);
  pbNormal.style.width = adaptValueToPercentageText(percentNormal);
  pbHyper.style.width = adaptValueToPercentageText(percentHyper);
}
/**
 * Concatenates a value with the percentage simbol.
 * @param {Number} value The number to be converted in text.
 * @return {string} A text with the informed value with percentage simbol.
 */
function adaptValueToPercentageText(value) {
  return ''.concat(value).concat('%');
}
/**
 * Converts a number to percentage according to the total number
 * of registers of glucose readings.
 * @param {Number} value The number to be converted in percentage.
 * @return {Number}
 */
function convertToPercentage(value) {
  return (value / getNumberOfRegisters()) * 100;
}

// /////////////
// EXPORT TO PDF
// /////////////
document.getElementById('btnExport').addEventListener('click', () => {
  const element = document.getElementById('glucoseDiaryDiv');
  const opt = {
    margin: 15,
    filename: 'Glicocheck-DiaryReport.pdf',
    html2canvas: {scale: 2},
    jsPDF: {unit: 'mm', format: 'B4', orientation: 'landscape'},
  };
  html2pdf().set(opt).from(element).save();
});

/**
 * The function calculates he standard deviation of a given
 * array of blood glucose numbers.
 * @param {Array} glycemia An array of blood glucose numbers.
 * @return {Number} The standard deviation value.
 */
function calculateStandardDeviation(glycemia) {
  const n = glycemia.length;
  if (n > 1) {
    const mean = glycemia.reduce((acc, val) => acc + val, 0) / n;
    const squaredDifferencesSum = glycemia.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const standardDeviation = Math.sqrt(squaredDifferencesSum / (n - 1));
    return Math.round(standardDeviation);
  }
  return 0;
}

/**
 * It fills the statistics table.
 */
function fillStatisticsTable() {
  // TABLE 1
  const statsGlicTests = document.getElementById('stats_glic_tests');
  const statsGlicAverage = document.getElementById('stats_glic_average');
  const statsGlicStddev = document.getElementById('stats_glic_stddev');
  const statsGlicLowest = document.getElementById('stats_glic_lowest');
  const statsGlicHighest = document.getElementById('stats_glic_highest');
  // Number of tests
  statsGlicTests.innerText = getNumberOfRegisters();
  // Average
  const average = Math.round(totalSumBloodGlucoseValues / getNumberOfRegisters());
  statsGlicAverage.innerText = ''.concat(average).concat(' mg/dL');
  // Standard deviation
  const standardDeviation = calculateStandardDeviation(listOfGlucoseValues);
  statsGlicStddev.innerText = ''.concat(standardDeviation).concat(' mg/dL');
  // Lowest and Highest
  statsGlicLowest.innerText = ''.concat(lowestGlucoseValue).concat(' mg/dL');
  statsGlicHighest.innerText = ''.concat(highestGlucoseValue).concat(' mg/dL');

  // TABLE 2
  const statsPercentHypo = document.getElementById('stats_percent_hypo');
  const statsPercentNormal = document.getElementById('stats_percent_normal');
  const statsPercentHyper = document.getElementById('stats_percent_hyper');
  const statsHypo = document.getElementById('stats_test_hypo');
  const statsNormal = document.getElementById('stats_test_normal');
  const statsHyper = document.getElementById('stats_test_hyper');

  const percentHypo = Math.round(convertToPercentage(qtdRegistersHipoglycemia));
  const percentNormal = Math.round(convertToPercentage(qtdRegistersNormalGlycemia));
  const percentHyper = Math.round(convertToPercentage(qtdRegistersHyperglycemia));

  statsPercentHypo.innerText = adaptValueToPercentageText(percentHypo);
  statsPercentNormal.innerText = adaptValueToPercentageText(percentNormal);
  statsPercentHyper.innerText = adaptValueToPercentageText(percentHyper);

  statsHypo.innerText = qtdRegistersHipoglycemia;
  statsNormal.innerText = qtdRegistersNormalGlycemia;
  statsHyper.innerText = qtdRegistersHyperglycemia;
}

getGlucoseReadingsByUserId();

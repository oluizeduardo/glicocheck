/* eslint-disable max-len */
const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const XMLHTTPREQUEST_STATUS_DONE = 4;

let HYPOGLYCEMIA = 70;
let HYPERGLYCEMIA = 160;

const listOfGlucoseValues = [];
let lowestGlucoseValue = 999;
let highestGlucoseValue = 0;

const SYSTEM_CONFIG_SESSIONSTORAGE = 'sysConfig';

let defaultTimeBFpre = 6;
let defaultTimeBFpos = 8;
let defaultTimeLunchpre = 12;
let defaultTimeLunchpos = 14;
let defaultTimeDinnerpre = 19;
let defaultTimeDinnerpos = 21;
let defaultTimeSleep = 23;

const COD_UNITY_MGDL = 1;
const LABEL_UNITY_MGDL = 'mg/dL';
const LABEL_UNITY_MMOL = 'mmol/L';
let UNITY_LABEL = '';

/**
 * Read from the database the list of glucose records of a specific user.
 */
function getGlucoseReadingsByUserId() {
  const dateRange = getDateRangeFromSession();
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
          if (dateRange) {
            swal('Nothing found',
                'No registers found for the informed date.',
                'info');
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
  sendGETToGlucose(xmlhttp, dateRange);
}
/**
 * Sends a GET request to recover the list of glucose records
 * of the online user.
 * @param {XMLHttpRequest} xmlhttp The request object.
 * @param {object} dateRange An object representing the data range
 * to be used as parameters in the url search.
 */
function sendGETToGlucose(xmlhttp, dateRange) {
  const token = getJwtToken();
  const userId = getUserId();
  let url = API_BASE_REQUEST+`/diary/users/${userId}`;

  if (dateRange) {
    url = url.concat(`?start=${dateRange.startDate}&end=${dateRange.endDate}`);
    removeDateRangeFromSession();
  }

  if (token) {
    xmlhttp.open('GET', url);
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
 * Gets the user id saved in the session storage.
 * @return {string} The user id.
 */
function getUserId() {
  return sessionStorage.getItem('userId');
}
/**
 * Retrieves the date range from the session storage.
 * @return {Object|null} The date range object retrieved
 * from the session storage, or null if not found.
 */
function getDateRangeFromSession() {
  const obj = sessionStorage.getItem(DATE_RANGE_SESSION_STORAGE);
  if (obj) {
    return JSON.parse(obj);
  }
  return null;
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
  if (listOfGlucoseValues.length === 1) {
    lowestGlucoseValue = glucoseValue;
    highestGlucoseValue = glucoseValue;
  } else {
    if (glucoseValue < lowestGlucoseValue) {
      lowestGlucoseValue = glucoseValue;
    } else if (glucoseValue > highestGlucoseValue) {
      highestGlucoseValue = glucoseValue;
    }
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
  if (hour >= defaultTimeSleep) return 18;
  if (hour >= defaultTimeDinnerpre && hour < defaultTimeDinnerpos) return 13;
  if (hour >= defaultTimeLunchpre && hour < defaultTimeLunchpos) return 8;
  if (hour >= defaultTimeBFpre && hour < defaultTimeBFpos) return 3;
  return -1;// don't print.
}
/**
 * Gets an index based on the informed hour.
 * @param {Number} hour A number representing the hour.
 * @return {Number} A number representing an index.
 */
function getIndexGlycemiaTD(hour) {
  if (hour >= defaultTimeSleep) return 16;
  if (hour >= defaultTimeDinnerpos) return 14;
  if (hour >= defaultTimeDinnerpre) return 11;
  if (hour >= defaultTimeLunchpos) return 9;
  if (hour >= defaultTimeLunchpre) return 6;
  if (hour >= defaultTimeBFpos) return 4;
  if (hour >= defaultTimeBFpre) return 1;
  return 1;// late night snack
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
    // eslint-disable-next-line max-len
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
  // eslint-disable-next-line max-len
  const average = Math.round(totalSumBloodGlucoseValues / getNumberOfRegisters());
  statsGlicAverage.innerText = ''.concat(average).concat(` ${UNITY_LABEL}`);
  // Standard deviation
  const standardDeviation = calculateStandardDeviation(listOfGlucoseValues);
  statsGlicStddev.innerText = ''.concat(standardDeviation).concat(` ${UNITY_LABEL}`);
  // Lowest and Highest
  statsGlicLowest.innerText = ''.concat(lowestGlucoseValue).concat(` ${UNITY_LABEL}`);
  statsGlicHighest.innerText = ''.concat(highestGlucoseValue).concat(` ${UNITY_LABEL}`);

  // TABLE 2
  const statsPercentHypo = document.getElementById('stats_percent_hypo');
  const statsPercentNormal = document.getElementById('stats_percent_normal');
  const statsPercentHyper = document.getElementById('stats_percent_hyper');
  const statsHypo = document.getElementById('stats_test_hypo');
  const statsNormal = document.getElementById('stats_test_normal');
  const statsHyper = document.getElementById('stats_test_hyper');

  const percentHypo = Math.round(convertToPercentage(qtdRegistersHipoglycemia));
  // eslint-disable-next-line max-len
  const percentNormal = Math.round(convertToPercentage(qtdRegistersNormalGlycemia));
  // eslint-disable-next-line max-len
  const percentHyper = Math.round(convertToPercentage(qtdRegistersHyperglycemia));

  statsPercentHypo.innerText = adaptValueToPercentageText(percentHypo);
  statsPercentNormal.innerText = adaptValueToPercentageText(percentNormal);
  statsPercentHyper.innerText = adaptValueToPercentageText(percentHyper);

  statsHypo.innerText = qtdRegistersHipoglycemia;
  statsNormal.innerText = qtdRegistersNormalGlycemia;
  statsHyper.innerText = qtdRegistersHyperglycemia;
}

/**
 * Loads values from system configuration.
 */
function loadFromSystemConfiguration() {
  const objectString = sessionStorage.getItem(SYSTEM_CONFIG_SESSIONSTORAGE);
  if (objectString) {
    const systemConfig = JSON.parse(objectString);
    setGlyceliaRange(systemConfig.limit_hypo, systemConfig.limit_hyper);
    setDefaultTimeInInt(systemConfig);
    setTimeValuesOnTheTable(systemConfig);
    setMeasurementUnityLabel(systemConfig);
  }
}
/**
 * Set the glycemia range: hypo and hyperglycemia limits.
 * @param {Number} hypo
 * @param {Number} hyper
 */
function setGlyceliaRange(hypo, hyper) {
  HYPOGLYCEMIA = hypo;
  HYPERGLYCEMIA = hyper;
}

/**
 * Set the default time values in integer format.
 * @param {Object} systemConfig
 */
function setDefaultTimeInInt(systemConfig) {
  defaultTimeBFpre = extractHour(systemConfig.time_bf_pre);
  defaultTimeBFpos = extractHour(systemConfig.time_bf_pos);
  defaultTimeLunchpre = extractHour(systemConfig.time_lunch_pre);
  defaultTimeLunchpos = extractHour(systemConfig.time_lunch_pos);
  defaultTimeDinnerpre = extractHour(systemConfig.time_dinner_pre);
  defaultTimeDinnerpos = extractHour(systemConfig.time_dinner_pos);
  defaultTimeSleep = extractHour(systemConfig.time_sleep);
}
/**
 * Extracts the integer part of the hour from a given
 * hour string in the format "HH:MM".
 * @param {string} hourString - The hour string in the format "HH:MM".
 * @return {number} The integer part of the hour.
 */
function extractHour(hourString) {
  return parseInt(hourString.split(':')[0], 10);
}
/**
 * Set the time values on the table.
 * @param {Object} systemConfig
 */
function setTimeValuesOnTheTable(systemConfig) {
  if (systemConfig) {
    const tbTimeBFpre = document.getElementById('time_bf_pre');
    const tbTimeBFpos = document.getElementById('time_bf_pos');
    const tbTimeLunchpre = document.getElementById('time_lunch_pre');
    const tbTimeLunchpos = document.getElementById('time_lunch_pos');
    const tbTimeDinnerpre = document.getElementById('time_dinner_pre');
    const tbTimeDinnerpos = document.getElementById('time_dinner_pos');
    const tbTimeSleep = document.getElementById('time_sleep');

    tbTimeBFpre.innerText = systemConfig.time_bf_pre;
    tbTimeBFpos.innerText = systemConfig.time_bf_pos;
    tbTimeLunchpre.innerText = systemConfig.time_lunch_pre;
    tbTimeLunchpos.innerText = systemConfig.time_lunch_pos;
    tbTimeDinnerpre.innerText = systemConfig.time_dinner_pre;
    tbTimeDinnerpos.innerText = systemConfig.time_dinner_pos;
    tbTimeSleep.innerText = systemConfig.time_sleep;
  }
}

/**
 * Configures the correct measurement unity label for the diary table.
 * @param {Object} config The system configuration object.
 */
function setMeasurementUnityLabel(config) {
  const unityLabel = getMeasurementUnityLabel(config.glucose_unity_id);
  const spans = document.querySelectorAll('span.label-measurement-unity');
  spans.forEach((span) => (span.textContent = unityLabel));
}

/**
 * Choose the correct measurement unity label.
 * @param {number} unityId
 * @return {string} The measurement unity label.
 */
function getMeasurementUnityLabel(unityId) {
  UNITY_LABEL = unityId == COD_UNITY_MGDL ? LABEL_UNITY_MGDL : LABEL_UNITY_MMOL;
  return UNITY_LABEL;
}

loadFromSystemConfiguration();
getGlucoseReadingsByUserId();

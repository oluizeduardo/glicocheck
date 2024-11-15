/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const fieldStartDate = document.getElementById('field_start_date');
const fieldEndDate = document.getElementById('field_end_date');
const NAME_ELEMENT_CHART = 'chart';
const NAME_ELEMENT_GLUCOSE_TABLE = 'table';
const FILTER_FLAG = 'FILTER';

/**
 * Updates the chart or diary table based on the specified number of weeks.
 * @param {string} element - An indicator of the element that wants to be updated.
 * @param {number} numOfWeeks - The number of weeks to retrieve data for.
 * @return {void}
 */
function updateDataByWeeks(element, numOfWeeks) {
  const [startDate, endDate] = getDateRangeByNumberOfWeeks(numOfWeeks);

  dateContext ={
    startDate,
    endDate,
    source: FILTER_FLAG,
  };

  switch (element) {
    case NAME_ELEMENT_CHART:
      loadGlucoseReadingsByUserId(dateContext);
      break;

    case NAME_ELEMENT_GLUCOSE_TABLE:
      saveDateRangeInSession(dateContext);
      window.location.reload();
      break;

    default:
      console.warn(`Unknown element type: ${element}`);
  }
}

/**
 * Gets a date range based on the specified number of weeks.
 *
 * @param {number} numOfWeeks - The number of weeks to go back from the current date.
 * A positive value will set the start date to the calculated weeks before the current date.
 * If 0 or negative, the start date will be the same as the end date (today).
 *
 * @return {string[]} An array with two formatted date strings [startDate, endDate] in the format `YYYY-MM-DD`.
 * The end date is always the current date, and the start date is calculated based on `numOfWeeks`.
 */
function getDateRangeByNumberOfWeeks(numOfWeeks) {
  if (typeof numOfWeeks !== 'number' || numOfWeeks < 0) {
    throw new TypeError('numOfWeeks must be a non-negative number');
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - numOfWeeks * 7);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return [formatDate(startDate), formatDate(endDate)];
}

/**
 * Saves the given date range object in the sessionStorage.
 * @param {Object} dateRangeObj - The date range object to be saved.
 */
function saveDateRangeInSession(dateRangeObj) {
  setDateRangeSessionStorage(JSON.stringify(dateRangeObj));
}

/**
 * Clears the values of the given array of fields.
 * @param {Array} fields - An array of field elements.
 */
function clearFields(fields) {
  fields.forEach((field) => {
    if (field && typeof field.value === 'string') {
      field.value = '';
    }
  });
}

/**
 * Process the date range and perform actions based on the specified element.
 * @param {string} element - An indicator of the element that wants to be updated.
 * @return {void}
 */
function processDateRange(element) {
  const [startDate, endDate] = getDateRange();

  if (isValidDateRange(startDate, endDate)) {
    if (element === NAME_ELEMENT_CHART) {
      loadGlucoseReadingsByUserId({startDate, endDate, source: FILTER_FLAG});
    } else if (element === NAME_ELEMENT_GLUCOSE_TABLE) {
      saveDateRangeInSession({startDate, endDate});
      window.location.reload();
    }
  } else {
    swal(
        'Invalid Date',
        'Please, inform the correct start and end date.',
        'warning',
    );
  }
  clearFields([fieldStartDate, fieldEndDate]);
}

/**
 * Checks if the first date is less than the second date,
 * indicating a valid date range.
 *
 * @param {string} inputDate1 - The first date to compare.
 * @param {string} inputDate2 - The second date to compare.
 * @return {boolean} Returns true if the first date is less
 * than the second date,indicating a valid date range. Otherwise, returns false.
 */
function isValidDateRange(inputDate1, inputDate2) {
  return (inputDate1 && inputDate2) ? (new Date(inputDate1) < new Date(inputDate2)) : false;
}

/**
 * Retrieves the start and end dates from the respective
 * fields and returns them as an array.
 * @return {Array} An array containing the start and end dates.
 */
function getDateRange() {
  return [fieldStartDate.value, fieldEndDate.value];
}

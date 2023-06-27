/* eslint-disable no-unused-vars */

const DATE_RANGE_SESSION_STORAGE = 'dairyDateRange';

/**
 * Get the start and end dates based on the number of weeks.
 * @param {number} numOfWeeks - The number of weeks.
 * @return {Date[]} An array with the start date and end date.
 */
function getDateRange(numOfWeeks) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (numOfWeeks * 7));
  const endDate = new Date();

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
 * @return {void}
 */
function saveDateRangeInSession(dateRangeObj) {
  const objectString = JSON.stringify(dateRangeObj);
  sessionStorage.setItem(DATE_RANGE_SESSION_STORAGE, objectString);
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
 * Removes date range from session storage.
 */
function removeDateRangeFromSession() {
  sessionStorage.removeItem(DATE_RANGE_SESSION_STORAGE);
}

/**
 * Updates the chart data based on the specified number of weeks.
 * @param {number} numOfWeeks - The number of weeks to retrieve data for.
 * @return {void}
 */
function updateChartDataByWeeks(numOfWeeks) {
  const [startDate, endDate] = getDateRange(numOfWeeks);
  destroyChart();
  loadGlucoseReadingsByUserId(startDate, endDate);
}

// DATE RANGE FIELDS
const fieldStartDate = document.getElementById('field_start_date');
const fieldEndDate = document.getElementById('field_end_date');

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
 * Updates chart data based on the selected date range.
 */
function updateChartDataByDateRange() {
  const startDate = fieldStartDate.value;
  const endDate = fieldEndDate.value;
  if (startDate && endDate) {
    if (isValidDateRange(startDate, endDate)) {
      destroyChart();
      loadGlucoseReadingsByUserId(startDate, endDate);
    } else {
      swal('Invalid Date',
          'The start date must be less than end date.',
          'warning');
    }
  } else {
    swal('Invalid Date',
        'Please, inform the start and end date.',
        'warning');
  }
  clearFields([fieldStartDate, fieldEndDate]);
}

/**
 * Updates the glucose diary table based on the selected date range.
 */
function updateDiaryTableByDateRange() {
  const startDate = fieldStartDate.value;
  const endDate = fieldEndDate.value;
  if (startDate && endDate) {
    if (isValidDateRange(startDate, endDate)) {
      saveDateRangeInSession({startDate, endDate});
      window.location.reload();
    } else {
      swal('Invalid Date',
          'The start date must be less than end date.',
          'warning');
    }
  } else {
    swal('Invalid Date',
        'Please, inform the start and end date.',
        'warning');
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
  return (new Date(inputDate1) < new Date(inputDate2));
}

/**
 * Updates the glucose diary table based on the specified number of weeks.
 * @param {number} numOfWeeks - The number of weeks to retrieve data for.
 * @return {void}
 */
function updateDiaryTableByWeeks(numOfWeeks) {
  const [startDate, endDate] = getDateRange(numOfWeeks);
  saveDateRangeInSession({startDate, endDate});
  window.location.reload();
}

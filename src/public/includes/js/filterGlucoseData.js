/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const fieldStartDate = document.getElementById('field_start_date');
const fieldEndDate = document.getElementById('field_end_date');
const NAME_ELEMENT_CHART = 'chart';
const NAME_ELEMENT_GLUCOSE_TABLE = 'table';

/**
 * Updates the chart or diary table based on the specified number of weeks.
 * @param {string} element - An indicator of the element that wants to be updated.
 * @param {number} numOfWeeks - The number of weeks to retrieve data for.
 * @return {void}
 */
function updateDataByWeeks(element, numOfWeeks) {
  const [startDate, endDate] = getDateRangeByNumberOfWeeks(numOfWeeks);

  if (element === NAME_ELEMENT_CHART) {
    loadGlucoseReadingsByUserId(startDate, endDate);
  } else if (element === NAME_ELEMENT_GLUCOSE_TABLE) {
    saveDateRangeInSession({startDate, endDate});
    window.location.reload();
  }
}

/**
 * Get the start and end dates based on the number of weeks.
 * @param {number} numOfWeeks - The number of weeks.
 * @return {Date[]} An array with the start date and end date.
 */
function getDateRangeByNumberOfWeeks(numOfWeeks) {
  const startDate = new Date(); // today
  startDate.setDate(startDate.getDate() - numOfWeeks * 7);
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
      loadGlucoseReadingsByUserId(startDate, endDate);
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
  if (inputDate1 && inputDate2) {
    return new Date(inputDate1) < new Date(inputDate2);
  }
  return false;
}

/**
 * Retrieves the start and end dates from the respective
 * fields and returns them as an array.
 * @return {Array} An array containing the start and end dates.
 */
function getDateRange() {
  const startDate = fieldStartDate.value;
  const endDate = fieldEndDate.value;
  return [startDate, endDate];
}

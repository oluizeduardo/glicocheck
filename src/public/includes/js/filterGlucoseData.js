/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const fieldStartDate = document.getElementById('field_start_date');
const fieldEndDate = document.getElementById('field_end_date');
const NAME_ELEMENT_CHART = 'chart';
const NAME_ELEMENT_GLUCOSE_TABLE = 'table';
const FILTER_FLAG = 'FILTER';

/**
 * Updates data based on the provided number of periods (weeks or months) and the element type.
 * Determines the date range and sets the context for subsequent operations.
 *
 * @param {string} element - The identifier for the element to be updated (e.g., chart or table).
 * @param {number} numOfPeriods - The number of periods (weeks or months) to determine the date range.
 * @param {string} unit - The unit of time for the periods, either 'weeks' or 'months'.
 */
function updateDataByPeriods(element, numOfPeriods, unit) {
  if (typeof numOfPeriods !== 'number' || numOfPeriods < 0) {
    throw new TypeError('numOfPeriods must be a non-negative number');
  }
  if (unit !== 'weeks' && unit !== 'months') {
    throw new TypeError('unit must be either \'weeks\' or \'months\'');
  }

  const [startDate, endDate] = getDateRangeByPeriods(numOfPeriods, unit);

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
 * Returns a date range based on the provided number of weeks or months.
 * The unit parameter specifies whether the input should be interpreted as weeks or months.
 *
 * @param {number} numOfPeriods - The number of weeks or months for the date range.
 * @param {string} unit - The unit of time, either 'weeks' or 'months'.
 * @return {string[]} - An array with the start date and end date formatted as 'YYYY-MM-DD'.
 * @throws {TypeError} - Throws if numOfPeriods is not a non-negative number or unit is invalid.
 */
function getDateRangeByPeriods(numOfPeriods, unit) {
  if (typeof numOfPeriods !== 'number' || numOfPeriods < 0) {
    throw new TypeError('numOfPeriods must be a non-negative number');
  }

  if (unit !== 'weeks' && unit !== 'months') {
    throw new TypeError('unit must be either \'weeks\' or \'months\'');
  }

  const endDate = new Date();
  const startDate = new Date();

  if (unit === 'weeks') {
    startDate.setDate(endDate.getDate() - numOfPeriods * 7);
  } else if (unit === 'months') {
    startDate.setMonth(endDate.getMonth() - numOfPeriods);
  }

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

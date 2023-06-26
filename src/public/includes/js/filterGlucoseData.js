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

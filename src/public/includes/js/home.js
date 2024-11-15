/* eslint-disable max-len */
const panelChart = document.getElementById('panel-chart');
const chartContext = document.getElementById('reports-chart');
const panelWelcomeCenter = document.getElementById('panel-welcome-center');
const searchDateRange = document.getElementById('search_date_range');
// Statistics
const averageValue = document.getElementById('average-value');
const deviationValue = document.getElementById('deviation-value');
const glycatedHemoValue = document.getElementById('glycated-hemo-value');
const hyposValue = document.getElementById('hypos-value');
const hypersValue = document.getElementById('hypers-value');

// eslint-disable-next-line no-var, no-unused-vars
var glucoseReadingsChart;
// eslint-disable-next-line prefer-const
let glucoseValues = [];
// eslint-disable-next-line prefer-const
let glucoseReadingDateLabels = [];

const HYPERGLYCEMIA = 160;
const HYPOGLYCEMIA = 70;
const COLOR_MY_GLYCEMIA = '#4154f1';
const COLOR_IDEAL_GLYCEMIA_RANGE = '#2eca6a';

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const XMLHTTPREQUEST_STATUS_DONE = 4;

/**
 * It loads the chart in the dashboard screen.
 */
function loadChart() {
  const chartConfiguration = getChartConfiguration();

  // Validate chart context and configuration
  if (!chartContext || !chartConfiguration) {
    console.error('Chart context or configuration is missing. Cannot render the chart.');
    return;
  }

  // Destroy existing chart if it exists to avoid memory leaks
  if (this.glucoseReadingsChart) {
    this.glucoseReadingsChart.destroy();
  }

  // Create and render the new chart
  this.glucoseReadingsChart = new ApexCharts(chartContext, chartConfiguration);
  this.glucoseReadingsChart.render().catch((error) => {
    console.error('Failed to render chart:', error);
  });
}

/**
 * Configures the chart which will be built on the screen.
 * @return {Object} Object representing the chart configured.
 */
function getChartConfiguration() {
  return {
    series: [
      {
        name: 'Glycemia',
        data: glucoseValues,
      },
    ],
    chart: {
      height: 330,
      type: 'area',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true,
        },
        export: {
          csv: {
            filename: 'Glicocheck',
            columnDelimiter: ',',
            headerCategory: 'Date',
            headerValue: 'Glycemia',
          },
          svg: {
            filename: 'Glicocheck',
          },
          png: {
            filename: 'Glicocheck',
          },
        },
      },
      events: {
        zoomed: function(chartContext, {xaxis, yaxis}) {
          if (xaxis && yaxis) {
            const startDate = glucoseReadingDateLabels[xaxis.min-1];
            const endDate = glucoseReadingDateLabels[xaxis.max-1];
            updateSearchDateRange([startDate, endDate]);
            updateStatisticsPanel(glucoseValues.slice(xaxis.min-1, xaxis.max));
          }
        },
        beforeResetZoom: function(chartContext) {
          chartContext.updateOptions({
            xaxis: {
              categories: glucoseReadingDateLabels,
            },
          });
          updateSearchDateRange(glucoseReadingDateLabels);
          updateStatisticsPanel(glucoseValues);
        },
      },
    },
    annotations: {
      yaxis: [
        {
          y: HYPERGLYCEMIA,
          y2: HYPOGLYCEMIA,
          borderColor: COLOR_IDEAL_GLYCEMIA_RANGE,
          fillColor: COLOR_IDEAL_GLYCEMIA_RANGE,
          opacity: 0.14,
          width: '100%',
        },
      ],
    },
    markers: {size: 4},
    colors: [COLOR_MY_GLYCEMIA],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {enabled: false},
    stroke: {curve: 'smooth', width: 2},
    xaxis: {
      type: 'string',
      categories: glucoseReadingDateLabels,
      labels: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
  };
}

/**
 * Read from the database the list of glucose readings
 * os a specific user.
 * @param {string} dateContext - An object containing the date
 * context for filtering diary entries.
 */
function loadGlucoseReadingsByUserId(dateContext) {
  glucoseValues = [];
  glucoseReadingDateLabels = [];

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
      switch (xmlhttp.status) {
        case HTTP_OK:
          JSON.parse(xmlhttp.response, (key, value) => {
            if (key === 'glucose') glucoseValues.push(value);
            if (key === 'dateTime') glucoseReadingDateLabels.push(adaptLabelDate(value));
          });
          updateSearchDateRange(glucoseReadingDateLabels);
          updateStatisticsPanel(glucoseValues);
          break;

        case HTTP_NOT_FOUND:
          if (dateContext.source === 'FILTER') {
            swal(
                'Nothing found',
                'No registers found for the informed date.',
                'info',
            );
          }
          break;

        case HTTP_UNAUTHORIZED:
          handleSessionExpired();
          break;

        default:
          swal('Error', 'Please, try again', 'error');
          break;
      }

      if (glucoseValues.length > 0) {
        if (glucoseReadingsChart != null) {
          glucoseReadingsChart.destroy();
        }
        makeChartPanelVisible();
        loadChart();
      }
    }
  };
  sendGETToGlucose(xmlhttp, dateContext);
}

/**
 * Update Statistics panel.
 * @param {Array} glucoseValues
 * @param {Array} glucoseReadingDateLabels
 */
function updateStatisticsPanel(glucoseValues) {
  averageValue.innerText = calculateAverage(glucoseValues);
  deviationValue.innerText = calculateStandardDeviation(glucoseValues);
  glycatedHemoValue.innerText = calculateHbA1c(glucoseValues);
  hyposValue.innerText = getHypoglycemiaCount(glucoseValues, HYPOGLYCEMIA);
  hypersValue.innerText = getHyperglycemiaCount(glucoseValues, HYPERGLYCEMIA);
}

/**
 * Updates the displayed date range in the format "dd/mm/yyyy-dd/mm/yyyy".
 *
 * @param {Array} glucoseReadingDateLabels - An array containing the start and end date.
 * @return {void} This function does not return a value; it updates the inner text
 *                 of the `searchDateRange` element directly.
 */
function updateSearchDateRange(glucoseReadingDateLabels) {
  if (!glucoseReadingDateLabels || glucoseReadingDateLabels.length === 0) {
    searchDateRange.innerText = ' ';
    return;
  }
  startDate = glucoseReadingDateLabels[0].split(' ')[0];
  endDate = glucoseReadingDateLabels[glucoseReadingDateLabels.length - 1].split(' ')[0];
  searchDateRange.innerText = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
}

/**
 * Sends a GET request to the glucose diary endpoint for a specific user within a date range.
 * If no valid token or user ID is found, it logs the user out.
 *
 * @param {XMLHttpRequest} xmlhttp - The XMLHttpRequest instance used to send the GET request.
 * @param {{startDate: string, endDate: string}} dateContext - An object containing the start
 * and end date for filtering diary entries.
 */
function sendGETToGlucose(xmlhttp, dateContext) {
  const token = getJwtToken();
  const userId = getUserId();
  if (!token || !userId) {
    logOut();
    return;
  }

  let url = API_BASE_REQUEST + `/diary/users/${userId}?sort=asc`;

  const {startDate, endDate} = dateContext;

  if (startDate && endDate) {
    url = url.concat(`&start=${startDate}&end=${endDate}`);
  }

  xmlhttp.open('GET', url);
  xmlhttp.setRequestHeader('Authorization', `Bearer ${token}`);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send();
}

/**
 * Adapts a date string from `YYYY-MM-DDTHH:MM:SS` format to `DD/MM/YY HH:MM`.
 *
 * @param {string} value - The date string in ISO format.
 * @return {string} The adapted date string in `DD/MM/YY HH:MM` format.
 * @throws {Error} If the input date string format is invalid.
 */
function adaptLabelDate(value) {
  if (typeof value !== 'string' || value.length < 16) {
    throw new Error('Invalid date format. Expected format: YYYY-MM-DDTHH:MM:SS');
  }

  const day = value.substring(8, 10);
  const month = value.substring(5, 7);
  const year = value.substring(2, 4);
  const time = value.substring(11, 16);

  return `${day}/${month}/${year} ${time}`;
}

/**
 * It makes the chart panel visible at the center of the screen.
 */
function makeChartPanelVisible() {
  if (!chartContext || !getChartConfiguration()) {
    console.error('Chart context or configuration is missing. Cannot render the chart.');
    return;
  }
  panelWelcomeCenter.classList.add('invisible');
  panelChart.classList.remove('invisible');
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

const [start, end] = getDateRangeByNumberOfWeeks(1);
dateContext ={
  startDate: start,
  endDate: end,
};
loadGlucoseReadingsByUserId(dateContext);

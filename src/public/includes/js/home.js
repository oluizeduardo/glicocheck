/* eslint-disable max-len */
const panelChart = document.getElementById('panel-chart');
const chartContext = document.getElementById('reports-chart');
const panelWelcomeCenter = document.getElementById('panel-welcome-center');
const searchDateRange = document.getElementById('search_date_range');
// Statistics
const averageValue = document.getElementById('average-value');
const deviationValue = document.getElementById('deviation-value');
const hyposValue = document.getElementById('hypos-value');
const hypersValue = document.getElementById('hypers-value');

// eslint-disable-next-line no-var
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
  this.glucoseReadingsChart = new ApexCharts(chartContext, chartConfiguration);
  this.glucoseReadingsChart.render();
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
      toolbar: {show: !isMaxWidth500px()},
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
    },
  };
}

/**
 * Screen width is 500px or less.
 * @return {boolean} true if the screen width is up to 500px.
 */
function isMaxWidth500px() {
  return (window.matchMedia('(max-width: 500px)').matches);
}

/**
 * Read from the database the list of glucose readings
 * os a specific user.
 * @param {string} startDate - The start date for the glucose data.
 * @param {string} endDate - The end date for the glucose data.
 */
function loadGlucoseReadingsByUserId(startDate, endDate) {
  glucoseValues = [];
  glucoseReadingDateLabels = [];

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
      switch (xmlhttp.status) {
        case HTTP_OK:
          JSON.parse(xmlhttp.response, (key, value) => {
            if (key === 'glucose') glucoseValues.push(value);
            if (key === 'dateTime') {
              glucoseReadingDateLabels.push(adaptLabelDate(value));
            }
          });
          updateSearchDateRange(glucoseReadingDateLabels);
          updateStatisticsPanel(glucoseValues);
          break;

        case HTTP_NOT_FOUND:
          if (startDate && endDate) {
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
  sendGETToGlucose(xmlhttp, startDate, endDate);
}

/**
 * Update Statistics panel.
 * @param {Array} glucoseValues
 * @param {Array} glucoseReadingDateLabels
 */
function updateStatisticsPanel(glucoseValues) {
  averageValue.innerText = calcAverage(glucoseValues);
  deviationValue.innerText = calculateStandardDeviation(glucoseValues);

  const {hypo, hyper} = countHypoAndHyper(glucoseValues);
  hyposValue.innerText = hypo;
  hypersValue.innerText = hyper;
}

/**
 * @param {Array} values
 * @return {object}
 */
function countHypoAndHyper(values) {
  const hypo = values.filter((valor) => valor <= HYPOGLYCEMIA).length;
  const hyper = values.filter((valor) => valor >= HYPERGLYCEMIA).length;
  return {hypo, hyper};
}

/**
 * @param {Array} values
 * @return {Number} The average.
 */
function calcAverage(values) {
  const sum = values.reduce((acc, valor) => acc + valor, 0);
  const average = sum / values.length;
  return Math.round(average);
}

/**
 * The function calculates he standard deviation of a given array of numbers.
 * @param {Array} values An array of blood glucose numbers.
 * @return {Number} The standard deviation value.
 */
function calculateStandardDeviation(values) {
  const n = values.length;
  if (n > 1) {
    const mean = values.reduce((acc, val) => acc + val, 0) / n;
    const squaredDifferencesSum = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const standardDeviation = Math.sqrt(squaredDifferencesSum / (n - 1));
    return Math.round(standardDeviation);
  }
  return 0;
}

/**
 * Updates the displayed date range in the format "dd/mm/yyyy-dd/mm/yyyy".
 *
 * @param {Array} glucoseReadingDateLabels - An array containing the start and end date.
 * @return {void} This function does not return a value; it updates the inner text
 *                 of the `searchDateRange` element directly.
 */
function updateSearchDateRange(glucoseReadingDateLabels) {
  startDate = glucoseReadingDateLabels[0].split(' ')[0];
  endDate = glucoseReadingDateLabels[glucoseReadingDateLabels.length - 1].split(' ')[0];
  searchDateRange.innerText = `${startDate}-${endDate}`;
}

/**
 * Sends a GET request to recover the list of glucose readings
 * of the online user.
 * @param {XMLHttpRequest} xmlhttp The request object.
 * @param {string} startDate - The start date for the glucose data.
 * @param {string} endDate - The end date for the glucose data.
 */
function sendGETToGlucose(xmlhttp, startDate, endDate) {
  const token = getJwtToken();
  const userId = getUserId();
  if (!token || !userId) logOut();

  let url = API_BASE_REQUEST + `/diary/users/${userId}?sort=asc`;

  if (startDate && endDate) {
    url = url.concat(`&start=${startDate}&end=${endDate}`);
  }

  xmlhttp.open('GET', url);
  xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
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
  panelWelcomeCenter.classList.add('invisible');
  panelChart.classList.remove('invisible');
}

loadGlucoseReadingsByUserId();

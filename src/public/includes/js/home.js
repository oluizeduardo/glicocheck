/* eslint-disable max-len */
const ctx = document.querySelector('#reportsChart');
const panelChart = document.querySelector('#panel-chart');
const panelWelcomeCenter = document.getElementById('panel-welcome-center');
const searchDateRange = document.getElementById('search_date_range');

// eslint-disable-next-line no-var
var glucoseReadingsChart;
// eslint-disable-next-line prefer-const
let glucoseValues = [];
// eslint-disable-next-line prefer-const
let glucoseReadingDateLabels = [];

const HYPERGLYCEMIA = 160;
const HYPOGLYCEMIA = 70;
const COLOR_HYPERGLYCEMIA = '#4154f1';
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
  this.glucoseReadingsChart = new ApexCharts(ctx, chartConfiguration);
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
      height: 400,
      type: 'area',
      toolbar: {show: true},
    },
    annotations: {
      yaxis: [
        {
          y: HYPERGLYCEMIA,
          y2: HYPOGLYCEMIA,
          strokeDashArray: 1,
          borderColor: COLOR_IDEAL_GLYCEMIA_RANGE,
          fillColor: COLOR_IDEAL_GLYCEMIA_RANGE,
          opacity: 0.13,
        },
      ],
    },
    markers: {size: 4},
    colors: [COLOR_HYPERGLYCEMIA],
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
  const time = value.slice(-5);
  return `${day}/${month}/${year.slice(-2)} ${time}`;
}

/**
 * It makes the chart panel visible at the center of the screen.
 */
function makeChartPanelVisible() {
  panelWelcomeCenter.classList.add('invisible');
  panelChart.classList.remove('invisible');
}

loadGlucoseReadingsByUserId();

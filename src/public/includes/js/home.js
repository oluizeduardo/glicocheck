/* eslint-disable max-len */
const ctx = document.querySelector('#myChart');
const panelChart = document.querySelector('#panel-chart');
const panelWelcomeCenter = document.getElementById('panel-welcome-center');

// eslint-disable-next-line no-var
var glucoseReadingsChart;
// eslint-disable-next-line prefer-const
let glucoseValues = [];
// eslint-disable-next-line prefer-const
let glucoseReadingDateLabels = [];
// eslint-disable-next-line prefer-const
let hyperglycemiaValues = [];
// eslint-disable-next-line prefer-const
let hypoglycemiaValues = [];

let HYPERGLYCEMIA = 160;
let HYPOGLYCEMIA = 70;
const COLOR_HYPERGLYCEMIA = 'rgba(5, 172, 228, 1)';
const COLOR_MY_GLYCEMIA = 'rgba(7, 140, 38, 2)';
const COLOR_HYPOGLYCEMIA = 'rgba(255, 99, 132, 1)';
const BORDER_WIDTH = 2;
const POINT_RADIUS_HYPERGLYCEMIA = 0;
const POINT_RADIUS_HYPOGLYCEMIA = 0;

const POINT_RADIUS_MY_GLICEMIA_BROWSER = 6;
const POINT_HOVER_RADIUS_BROWSER = POINT_RADIUS_MY_GLICEMIA_BROWSER * 2;
const POINT_RADIUS_MY_GLICEMIA_MOBILE = POINT_RADIUS_MY_GLICEMIA_BROWSER / 2;
const POINT_HOVER_RADIUS_MOBILE = POINT_RADIUS_MY_GLICEMIA_MOBILE * 2;

const CHART_LINE_TENSION = 0.3;
let Y_MIN_SCALE = 20;
let Y_MAX_SCALE = 220;
let Y_STEP_SIZE = 20;

const COD_UNITY_MGDL = 1;
const LABEL_UNITY_MGDL = 'mg/dL';
const LABEL_UNITY_MMOL = 'mmol/L';
let UNITY = LABEL_UNITY_MGDL;

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const XMLHTTPREQUEST_STATUS_DONE = 4;

/**
 * It loads the chart in the dashboard screen.
 */
function loadChart() {
  fillHypoAndHyperValues();
  this.glucoseReadingsChart = new Chart(ctx, getChartConfiguration());
  glucoseReadingsChart.update();
}

/**
 * Configures the chart which will be built on the screen.
 * @return {Object} Object representing the chart configured.
 */
function getChartConfiguration() {
  return {
    type: 'line',
    data: {
      labels: glucoseReadingDateLabels,
      datasets: [
        {
          label: 'Hyperglycemia',
          data: hyperglycemiaValues,
          borderColor: [COLOR_HYPERGLYCEMIA],
          backgroundColor: [COLOR_HYPERGLYCEMIA],
          borderWidth: BORDER_WIDTH,
          pointRadius: POINT_RADIUS_HYPERGLYCEMIA,
          pointHoverRadius: 0,
        },
        {
          label: 'My glycemia',
          data: glucoseValues,
          borderColor: (chart) => getColor(chart),
          backgroundColor: (chart) => getColor(chart),
          borderWidth: BORDER_WIDTH,
          pointRadius: isMaxWidth500px() ? POINT_RADIUS_MY_GLICEMIA_MOBILE : POINT_RADIUS_MY_GLICEMIA_BROWSER,
          pointHoverRadius: isMaxWidth500px() ? POINT_HOVER_RADIUS_MOBILE : POINT_HOVER_RADIUS_BROWSER,
        },
        {
          label: 'Hypoglycemia',
          data: hypoglycemiaValues,
          borderColor: [COLOR_HYPOGLYCEMIA],
          backgroundColor: [COLOR_HYPOGLYCEMIA],
          borderWidth: BORDER_WIDTH,
          pointRadius: POINT_RADIUS_HYPOGLYCEMIA,
          pointHoverRadius: 0,
        },
      ],
    },
    options: {
      interaction: {
        intersect: false,
        mode: 'nearest',
        axis: 'xy',
      },
      plugins: {
        tooltip: {
          titleAlign: 'center',
          callbacks: {
            footer: function(tooltipItems) {
              let status = 0;
              tooltipItems.forEach((tooltipItem) => {
                const value = tooltipItem.parsed.y;
                status = value <= HYPOGLYCEMIA ? 'Low' :
                value >= HYPERGLYCEMIA ? 'High' : 'Normal';
              });
              return '\nStatus: ' + status;
            },
          },
        },
        legend: {
          display: !isMaxWidth500px(),
          labels: {
            font: {
              size: 15,
            },
          },
        },
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'easeOutQuart',
          from: 1,
          to: CHART_LINE_TENSION,
        },
      },
      reposive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          min: Y_MIN_SCALE,
          max: Y_MAX_SCALE,
          ticks: {
            display: !isMaxWidth500px(),
            stepSize: Y_STEP_SIZE,
          },
          title: {
            display: !isMaxWidth500px(),
            text: `Glycemia ( ${UNITY} )`,
          },
        },
        x: {
          display: !isMaxWidth500px(),
          ticks: {
            display: !isMaxWidth500px(),
            callback: function(value) {
              let label = '';
              let previousLabel = '';
              const currentLabel = this.getLabelForValue(value);
              if (value > 0) {// at least two registers.
                previousLabel = this.getLabelForValue(value-1);
              }
              if (currentLabel.split(' ')[0] === previousLabel.split(' ')[0]) {
                label = '';
              } else {
                label = currentLabel.split(' ');
              }
              return label;
            },
          },
        },
      },
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
 * Chooses a color depending on the glucose level.
 * @param {Chart} chart The chart object.
 * @return {string} The right color depending on the glucose level.
 */
function getColor(chart) {
  const index = chart.dataIndex;
  const value = chart.dataset.data[index];
  return value <= HYPOGLYCEMIA ? COLOR_HYPOGLYCEMIA :
    value >= HYPERGLYCEMIA ? COLOR_HYPERGLYCEMIA :
    COLOR_MY_GLYCEMIA;
}

/**
 * It fills the list of hyperglycemia and
 * hypoglycemia with their initial values.
 */
function fillHypoAndHyperValues() {
  fillVariablesFromSystemConfiguration();
  glucoseValues.forEach(() => {
    hyperglycemiaValues.push(HYPERGLYCEMIA);
    hypoglycemiaValues.push(HYPOGLYCEMIA);
  });
}

/**
 * Read from the database the list of glucose readings
 * os a specific user.
 * @param {string} startDate - The start date for the glucose data.
 * @param {string} endDate - The end date for the glucose data.
 */
function loadGlucoseReadingsByUserId(startDate, endDate) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == XMLHTTPREQUEST_STATUS_DONE) {
      switch (xmlhttp.status) {
        case HTTP_OK:
          destroyChart();// Reset chart for new values.
          JSON.parse(xmlhttp.response, (key, value) => {
            if (key === 'glucose') glucoseValues.push(value);
            if (key === 'dateTime') {
              glucoseReadingDateLabels.push(adaptLabelDate(value));
            }
          });
          break;

        case HTTP_NOT_FOUND:
          if (startDate && endDate) {
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

  let url = API_BASE_REQUEST+`/diary/users/${userId}?sort=asc`;

  if (startDate && endDate) {
    url = url.concat(`&start=${startDate}&end=${endDate}`);
  }

  xmlhttp.open('GET', url);
  xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send();
}

/**
 * Destroy the chart to run its update.
 */
function destroyChart() {
  if (glucoseReadingsChart != null) {
    glucoseReadingsChart.destroy();
  }
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

/**
 * Fill the variables with the system configuration values.
 */
function fillVariablesFromSystemConfiguration() {
  const objectString = getSystemConfig();
  if (objectString) {
    const retrievedConfig = JSON.parse(objectString);
    const unity = retrievedConfig.id_measurement_unity;
    HYPERGLYCEMIA = retrievedConfig.limit_hyper;
    HYPOGLYCEMIA = retrievedConfig.limit_hypo;
    UNITY = getMeasurementUnityLabel(unity);
    setChartAxisYValues(unity);
  }
}

/**
 * Choose the correct measurement unity label.
 * @param {number} unityId
 * @return {string} The measurement unity label.
 */
function getMeasurementUnityLabel(unityId) {
  return unityId == COD_UNITY_MGDL ? LABEL_UNITY_MGDL : LABEL_UNITY_MMOL;
}
/**
 * Configure the values used in the axis Y on the chart panel.
 * @param {number} unityId
 */
function setChartAxisYValues(unityId) {
  if (unityId == COD_UNITY_MGDL) {
    // mg/dL
    Y_MAX_SCALE = 220;
    Y_MIN_SCALE = 20;
    Y_STEP_SIZE = 20;
  } else {
    // mmol/L
    Y_MAX_SCALE = 12;
    Y_MIN_SCALE = 2;
    Y_STEP_SIZE = 1;
  }
}

loadGlucoseReadingsByUserId();

const ctx = document.querySelector('#myChart');
const panelChart = document.querySelector('#panel-chart');
const panelWelcomeCenter = document.getElementById('panel-welcome-center');

var glucoseReadingsChart;
let glucoseValues = [];
let glucoseReadingDateLabels = [];
let hyperglycemiaValues = [];
let hypoglycemiaValues = [];

const HYPERGLYCEMIA = 160;
const HYPOGLYCEMIA = 70;
const COLOR_HYPERGLYCEMIA = 'rgba(5, 172, 228, 1)';
const COLOR_MY_GLYCEMIA = 'rgba(7, 140, 38, 2)';
const COLOR_HYPOGLYCEMIA = 'rgba(255, 99, 132, 1)';
const BORDER_WIDTH = 2;
const POINT_RADIUS_HYPERGLYCEMIA = 0;
const POINT_RADIUS_HYPOGLYCEMIA = 0;
const POINT_RADIUS_MY_GLICEMIA = 6;
const POINT_HOVER_RADIUS = 13;

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const XMLHTTPREQUEST_STATUS_DONE = 4;

const CHART_LINE_TENSION = 0.3;
const Y_MIN_SCALE = 20;
const Y_MAX_SCALE = 220;

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
        },
        {
          label: 'My glycemia',
          data: glucoseValues,
          borderColor: (chart) => getColor(chart),
          backgroundColor: (chart) => getColor(chart),
          borderWidth: BORDER_WIDTH,
          pointRadius: POINT_RADIUS_MY_GLICEMIA,
          pointHoverRadius: POINT_HOVER_RADIUS,
        },
        {
          label: 'Hypoglycemia',
          data: hypoglycemiaValues,
          borderColor: [COLOR_HYPOGLYCEMIA],
          backgroundColor: [COLOR_HYPOGLYCEMIA],
          borderWidth: BORDER_WIDTH,
          pointRadius: POINT_RADIUS_HYPOGLYCEMIA,
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
            stepSize: 20,
          },
          title: {
            display: true,
            text: 'Glycemia ( mg/dL )',
          },
        },
        x: {
          ticks: {
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
  glucoseValues.forEach(() => {
    hyperglycemiaValues.push(HYPERGLYCEMIA);
    hypoglycemiaValues.push(HYPOGLYCEMIA);
  });
}

/**
 * Read from the database the list of glucose readings
 * os a specific user.
 */
function loadGlucoseReadingsByUserId() {
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
          break;

        case HTTP_NOT_FOUND:
          console.log('No registers found.');
          break;

        case HTTP_UNAUTHORIZED:
          handleSessionExpired();
          break;

        default:
          swal('Error', 'Please, try again', 'error');
          break;
      }

      if (glucoseValues.length > 0) {
        makeChartPanelVisible();
        loadChart();
      }
    }
  };
  sendGETToGlucose(xmlhttp);
}

/**
 * Sends a GET request to recover the list of glucose readings
 * of the online user.
 * @param {XMLHttpRequest} xmlhttp The request object.
 */
function sendGETToGlucose(xmlhttp) {
  const token = getJwtToken();

  if (token) {
    xmlhttp.open('GET', '/api/glucose/user/online');
    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
  } else {
    throw Error('Authentication token not found.');
  }
}

/**
 * Retrives the JWT token in the session storage.
 * @return {string} The JWt token.
 */
function getJwtToken() {
  return sessionStorage.getItem('jwt');
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
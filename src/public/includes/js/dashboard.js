var ctx = document.querySelector('#myChart');
var panel_chart = document.querySelector('#panel-chart');
var panel_welcome_center = document.getElementById("panel-welcome-center");
var welcome_center = document.getElementById("welcome-center");

var glucoseReadingsChart;
var glucoseValues = [];
var glucoseReadingDateLabels = [];
var hyperglycemiaValues =[];
var hypoglycemiaValues =[];

const HYPERGLYCEMIA = 160;
const HYPOGLYCEMIA = 70;
const COLOR_HYPERGLYCEMIA = 'rgba(5, 172, 228, 1)';
const COLOR_HYPOGLYCEMIA = 'rgba(255, 99, 132, 1)';
const COLOR_MY_GLYCEMIA = 'rgba(7, 140, 38, 2)';
const BORDER_WIDTH = 2;
const POINT_RADIUS_HYPERGLYCEMIA = 0;
const POINT_RADIUS_HYPOGLYCEMIA = 0;
const POINT_RADIUS_MY_GLICEMIA = 6;
const POINT_HOVER_RADIUS = 13;


function loadChart(){

  fillHypoAndHyperValues(); 

  this.glucoseReadingsChart = new Chart(ctx, {
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
          pointRadius: POINT_RADIUS_HYPERGLYCEMIA
        },
        {
          label: 'My glycemia',
          data: glucoseValues,
          borderColor: [COLOR_MY_GLYCEMIA],
          backgroundColor: [COLOR_MY_GLYCEMIA],
          borderWidth: BORDER_WIDTH,
          pointRadius: POINT_RADIUS_MY_GLICEMIA,
          pointHoverRadius: POINT_HOVER_RADIUS
        },        
        {
          label: 'Hypoglycemia',
          data: hypoglycemiaValues,
          borderColor: [COLOR_HYPOGLYCEMIA],
          backgroundColor: [COLOR_HYPOGLYCEMIA],
          borderWidth: BORDER_WIDTH,
          pointRadius: POINT_RADIUS_HYPOGLYCEMIA
      }
      ]
    },
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0
        }
      },
      reposive: true,
      maintainAspectRatio: false,
      scales: {
          y: {
              min: 20,
              max: 220,
              ticks: {
                stepSize: 20
              }
          }
      }
    }
  });
  glucoseReadingsChart.update();
}

function fillHypoAndHyperValues(){
  glucoseValues.forEach(() => {
    hyperglycemiaValues.push(HYPERGLYCEMIA);
    hypoglycemiaValues.push(HYPOGLYCEMIA);
  })
}

function loadGlucoseReadingsByUserId(){
  const xmlhttp = new XMLHttpRequest();        
  xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) 
      {
        if(xmlhttp.status == 200)
        {
          JSON.parse(xmlhttp.response, function(key, value){
            if(key === 'glucose') glucoseValues.push(value);
            if(key === 'date') {
              glucoseReadingDateLabels.push(adaptLabelDate(value));
            }            
          })
        }
        if(glucoseValues.length > 0){
          makeChartPanelVisible();
          loadChart();
        }
      }
  };
  sendGETToGlucose(xmlhttp);
}

function sendGETToGlucose(xmlhttp){
  const token = getJwtToken();
  //const userId = getUserId();

//  if(token && userId){
  if(token){
    //xmlhttp.open("GET", `/api/glucose/user/${userId}`);
    xmlhttp.open("GET", '/api/glucose/user/online');
    xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send();
  }else{
    throw Error('Authentication token not found.');
  }
}

function getJwtToken() {
  return sessionStorage.getItem("jwt")
}
/*function getUserId() {
  return sessionStorage.getItem("userId")
}*/

function adaptLabelDate(value){
  const fullDate = value.slice(0,10);
  const arrayDate = fullDate.split("/");
  const day = arrayDate[0];
  const month = parseInt(arrayDate[1]);
  const initialNameMonths = ['Jan','Feb','Mar','Apr','May','Jun', 'Jul', 'Aug','Sep','Oct','Nov','Dec'];
  return `${day}-${initialNameMonths[month-1]}`;
}

function makeChartPanelVisible(){
  panel_welcome_center.classList.add('invisible');
  panel_chart.classList.remove('invisible');
}

function destroyChart(){
  if(glucoseReadingsChart != null){
    glucoseReadingsChart.destroy();
  }
  glucoseValues = [];
  glucoseReadingDateLabels = [];
  hyperglycemiaValues =[];
  hypoglycemiaValues =[];
}

loadGlucoseReadingsByUserId();
const ctx = document.getElementById('myChart');

let glucoseValues = [];
let glucoseReadingDateLabels = [];
let glucoseReadingsChart;
let hyperglycemiaValues =[];
let hypoglycemiaValues =[];

const HYPERGLYCEMIA = 160;
const HYPOGLYCEMIA = 70;


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
          borderColor: [              
              'rgba(5, 172, 228, 1)'
          ],
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: 'My glycemia',
          data: glucoseValues,
          borderColor: [
            'rgba(7, 140, 38, 2)'
          ],
          borderWidth: 2
        },        
        {
          label: 'Hypoglycemia',
          data: hypoglycemiaValues,
          borderColor: [
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 2,
          pointRadius: 0
      }
      ]
    },
    options: {
        scales: {
            y: {
                min: 40,
                ticks: {
                  stepSize: 20
                }
            }
        }
    }
  });
}

function fillHypoAndHyperValues(){
  glucoseValues.forEach(() => {
    hyperglycemiaValues.push(HYPERGLYCEMIA);
    hypoglycemiaValues.push(HYPOGLYCEMIA);
  })
}

function loadDateAndTimeFields(){
  const field_Time = document.getElementById('field_Time');
  const field_Date = document.getElementById('field_Date');

  const dateObject = new Date();
  field_Time.value = dateObject.toLocaleTimeString();
  field_Date.value = dateObject.toLocaleDateString();
}

function loadAllGlucoseReadings(){
  const xmlhttp = new XMLHttpRequest();        
  xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4) 
      {
        if(xmlhttp.status == 200)
        {
          JSON.parse(xmlhttp.response, function(key, value){
            if(key === 'glucose') glucoseValues.push(value);
            if(key === 'date') glucoseReadingDateLabels.push(value.slice(0,10));            
          })
          loadChart();
        }
      }
  };
  sendGETToGlucose(xmlhttp);
}

function sendGETToGlucose(xmlhttp){
  const token = getJwtToken();
  xmlhttp.open("GET", "/api/glucose");
  xmlhttp.setRequestHeader('Authorization', 'Bearer '+token);
  xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  xmlhttp.send();
}

function getJwtToken() {
    return sessionStorage.getItem("jwt")
}

loadAllGlucoseReadings();
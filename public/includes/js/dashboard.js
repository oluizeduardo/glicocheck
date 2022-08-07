const ctx = document.getElementById('myChart');

function loadChart(){
  //myLineChart.update();
  //myLineChart.reset();
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['glycemia1', 'glycemia2', 'glycemia3', 'glycemia4', 'glycemia5', 'glycemia6', 'glycemia7'],
        datasets: [
        {
          label: 'Hyperglycemia',
          data: [160, 160,160,160, 160, 160, 160],
          borderColor: [              
              'rgba(5, 172, 228, 1)'
          ],
          borderWidth: 2
        },
        {
          label: 'My glycemia',
          data: [63, 90, 138, 187, 140, 100, 103],
          borderColor: [
            'rgba(0, 0, 0, 2)'
          ],
          borderWidth: 2
        },        
        {
          label: 'Hypoglycemia',
          data: [70, 70,70,70, 70, 70, 70],
          borderColor: [
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 2
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

loadChart();
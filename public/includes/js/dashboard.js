/* globals Chart:false, feather:false */

(() => {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  const ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  /*const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        '04-Aug-22, 07:22',
        '04-Aug-22, 12:13',
        '04-Aug-22, 14:13',
        '04-Aug-22, 17:05',
        '04-Aug-22, 19:30',
        '04-Aug-22, 21:30',
        '04-Aug-22, 23:57'
      ],
      datasets: [{
        data: [
          98,
          87,
          154,
          116,
          94,
          138,
          99
        ],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })*/
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
                beginAtZero: true
            }
        }
    }
})
})()

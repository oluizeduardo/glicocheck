/* globals Chart:false, feather:false */

(() => {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  const ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  const myChart = new Chart(ctx, {
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
  })
})()

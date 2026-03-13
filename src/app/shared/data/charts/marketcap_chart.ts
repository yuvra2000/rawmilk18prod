export let BitcoinData = {
    series: [{
        data: [0, 32, 18, 58,45,45,35,56,34,55,75,46,76]
      }],
      chart: {
        height: 40,
        type: 'area',
        fontFamily: 'Poppins, Arial, sans-serif',
        foreColor: '#5d6162',
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        }
      },
      tooltip: {
        enabled: true,
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function () {
              return ''
            }
          }
        },
        marker: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: [1.5],
      },
      title: {
        text: undefined,
      },
      grid: {
        borderColor: 'transparent',
      },
      xaxis: {
        crosshairs: {
          show: false,
        }
      },
      colors: ["var(--primary-color)"],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.5,
          opacityTo: 0.2,
          stops: [0, 60],
          colorStops: [
            [
              {
                offset: 0,
                color: 'var(--primary02)',
                opacity: 1
              },
              {
                offset: 60,
                color: 'var(--primary02)',
                opacity: 0.1
              }
            ],
          ]
        }
      },
}
export let EthereumData  = {
    ...BitcoinData,
      colors: ["rgba(255, 90, 41)"],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.5,
          opacityTo: 0.2,
          stops: [0, 60],
          colorStops: [
            [
              {
                offset: 0,
                color: 'var(--primary02)',
                opacity: 1
              },
              {
                offset: 60,
                color: 'var(--primary02)',
                opacity: 0.1
              }
            ],
          ]
        }
      },
}
export let DashData = {
    ...BitcoinData,
    colors: ["rgba(12, 199, 99)"],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.5,
          opacityTo: 0.2,
          stops: [0, 60],
          colorStops: [
            [
              {
                offset: 0,
                color: 'var(--primary02)',
                opacity: 1
              },
              {
                offset: 60,
                color: 'var(--primary02)',
                opacity: 0.1
              }
            ],
          ]
        }
      },
}
export let BitSendData = {
  ...BitcoinData,
  colors: ["rgba(12, 156, 252)"],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
        colorStops: [
          [
            {
              offset: 0,
              color: 'var(--primary02)',
              opacity: 1
            },
            {
              offset: 60,
              color: 'var(--primary02)',
              opacity: 0.1
            }
          ],
        ]
      }
    },
}


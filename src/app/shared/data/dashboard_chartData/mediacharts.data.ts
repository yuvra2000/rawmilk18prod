export let EngagedChartData: any = {
    series: [
        {
            data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
        },
    ],
    chart: {
        height: 122,
        type: "area",
        fontFamily: "Roboto, Arial, sans-serif",
        foreColor: "#5d6162",
        zoom: {
            enabled: false,
        },
        sparkline: {
            enabled: true,
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 0,
            blur: 1,
            color: ["var(--primary-color)"],
            opacity: 0.05,
          },
    },
    tooltip: {
        enabled: true,
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function () {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
        width: [1.5],
    },
    title: {
        text: undefined,
    },
    grid: {
        borderColor: "transparent",
    },
    yaxis: {
     min: 0,
    },
    xaxis: {
        crosshairs: {
            show: false,
        },
    },
    colors: ["var(--primary-color)"],

    fill: {
        type: "gradient",
        gradient: {
            opacityFrom: 0.5,
            opacityTo: 0.2,
            stops: [0, 60],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "var(--primary01)",
                        opacity: 1
                      },
                      {
                        offset: 50,
                        color: "var(--primary01)",
                        opacity: 1
                      },
                      {
                        offset: 100,
                        color: 'var(--primary01)',
                        opacity: 0.5
                      }
                ],
            ],
        },
    },
}

export let ImpressionsChartData: any = {
    series: [
        {
            data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
        },
    ],
    chart: {
        height: 122,
        type: "area",
        fontFamily: "Roboto, Arial, sans-serif",
        foreColor: "#5d6162",
        zoom: {
            enabled: false,
        },
        sparkline: {
            enabled: true,
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 0,
            blur: 1,
            color: ["rgb(255, 90, 41)"],
            opacity: 0.05,
          },
    },
    tooltip: {
        enabled: true,
        x: {
            show: false,
        },
        y: {
            title: {
                formatter: function () {
                    return "";
                },
            },
        },
        marker: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
        width: [1.5],
    },
    title: {
        text: undefined,
    },
    grid: {
        borderColor: "transparent",
    },
    yaxis: {
     min: 0,
    },
    xaxis: {
        crosshairs: {
            show: false,
        },
    },
    colors: ["rgb(255, 90, 41)"],

    fill: {
        type: "gradient",
        gradient: {
            opacityFrom: 0.5,
            opacityTo: 0.2,
            stops: [0, 60],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "rgba(255, 90, 41,0.1)",
                        opacity: 1
                      },
                      {
                        offset: 50,
                        color: "rgba(255, 90, 41,0.1)",
                        opacity: 1
                      },
                      {
                        offset: 100,
                        color: 'rgba(255, 90, 41,0.1)',
                        opacity: 0.5
                      }
                ],
            ],
        },
    },
}
export let AudienceChartData: any = {
    series: [
        {
            name: "Followers",
            data: [20, 38, 38, 72, 55, 63, 43, 76, 55, 80, 40, 80],
            type: "column",
        }
    ],
    chart: {
        height: 278,
        type: "line",
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
    },
    plotOptions: {
        bar: {
            columnWidth: "35%",
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "all",
            borderRadius: 5,
            colors: {
                ranges: [{
                    from: 0,
                    to: 45,
                    color: 'var(--primary-color)'
                }, {
                    from: 45,
                    to: 65,
                    color: 'var(--primary03)'
                }, {
                    from: 65,
                    to: 100,
                    color: 'var(--primary01)'
                }]
            },
        }
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        position: "top",
        horizontalAlign: "center",
    },
    stroke: {
        curve: "smooth",
        width: ["0"],
    },
    grid: {
        borderColor: "#f1f1f1",
        strokeDashArray: 2,
        xaxis: {
            lines: {
                show: true
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        }
    },
    colors: ["var(--primary-color)"],
    xaxis: {
        type: "month",
        categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
        },
        labels: {
            rotate: -90,
        },
    },
}
export let AudienceReachedData: any = {
    series: [1200, 750],
        labels: ["Female", "Male"],
        chart: {
            height: 230,
            type: 'donut',
        },
        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false,
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'round',
            colors: "#fff",
            width: 2,
            dashArray: 0,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '85%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '20px',
                            color: '#495057',
                            fontFamily: "Montserrat, sans-serif",
                            offsetY: 0
                        },
                        value: {
                            show: true,
                            fontSize: '22px',
                            color: undefined,
                            offsetY: 10,
                            fontWeight: 600,
                            fontFamily: "Montserrat, sans-serif",
                            formatter: function (val:any) {
                                return val + "%"
                            }
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Audience Reached',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#495057',
                            formatter: function () {
                                return 1950
                            }
                        }
                    }
                }
            }
        },

        colors: ["var(--primary-color)", "rgb(255, 90, 41)"],
}
export let AnalysisChartData: any = {
    series: [
        {
            name: "Followers",
            data: [44, 42, 57, 86, 58, 55, 70, 43, 23, 54, 77, 34],
        },
        {
            name: "Account Reached",
            data: [74, 72, 87, 116, 88, 85, 100, 73, 53, 84, 107, 64],
        },
        {
            name: "People Engaged",
            data: [84, 82, 97, 126, 98, 95, 110, 83, 63, 94, 117, 74],
        }
    ],
    chart: {
        stacked: true,
        type: "area",
        height: 332, 
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 1,
            blur: 3,
            color: '#000',
            opacity: 0.1
        },
        toolbar: {
            show: false,
        }
    },
    grid: {
        borderColor: "#f5f4f4",
        strokeDashArray: 5,
        yaxis: {
            lines: {
                show: true,
            },
        },
    },
    colors: [
        "var(--primary-color)",
        "rgba(215, 124, 247, 1)",
        "rgba(12, 215, 177, 1)",
    ],
    stroke: {
        curve: ["smooth", "smooth", "smooth"],
        width: [2, 2, 2],
    },
    dataLabels: {
        enabled: false,
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "var(--primary05)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "var(--primary05)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "var(--primary05)",
                        opacity: 1
                    }
                ],
                [
                    {
                        offset: 0,
                        color: "rgba(215, 124, 247,0.5)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(215, 124, 247,0.5)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "rgba(215, 124, 247,0.5)",
                        opacity: 1
                    }
                ],
                [
                    {
                        offset: 0,
                        color: "rgba(12, 215, 177,0.5)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(12, 215, 177,0.5)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "rgba(12, 215, 177,0.5)",
                        opacity: 1
                    }
                ]
            ]
        }
    },
    legend: {
        show: true,
        position: "top",
    },
    yaxis: {
        title: {
            style: {
                color: "#adb5be",
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                cssClass: "apexcharts-yaxis-label",
            },
        },
        axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
        },
        labels: {
            formatter: function (y:any) {
                return y.toFixed(0) + "";
            },
        },
    },
    xaxis: {
        type: "month",
        categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "sep",
            "oct",
            "nov",
            "dec",
        ],
        axisBorder: {
            show: false,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: false,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
        },
        labels: {
            rotate: -90,
        },
    },
    tooltip: {
        theme: "dark",
    }
 }
  export let RevenueChartData: any = {
    series: [76, 67, 61, 90],
    chart: {
        height: 195,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
                margin: 5,
                size: '30%',
                background: 'transparent',
                image: undefined,
            },
            dataLabels: {
                name: {
                    show: false,
                },
                value: {
                    show: false,
                }
            }
        }
    },
    colors: ['var(--primary-color)', 'rgba(215, 124, 247, 1)', 'rgba(12, 215, 177, 1)', 'rgba(254, 124, 88, 1)'],
    labels: ['Youtube', 'Twitter', 'Facebook', 'Instagram'],
    legend: {
        show: false,
        floating: true,
        fontSize: '14px',
        position: 'left',
        labels: {
            useSeriesColors: true,
        },
        markers: {
            size: 0
        },
        formatter: function (seriesName:any, opts:any) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
        },
        itemMargin: {
            vertical: 3
        }
    },
    stroke: {
        lineCap: 'round',
    },
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                show: false
            }
        }
    }]
  }
  export let SessionChartData: any = {
    series: [
        {
            name: "Tablet",
            data: [[10, 35, 80]]
        },
        {
            name: "Mobile",
            data: [[22, 10, 80]]
        },
        {
            name: "Desktop",
            data: [[25, 25, 150]]
        },
    ],
    chart: {
        height: 355,
        type: "bubble",
        toolbar: {
            show: false
        }
    },
    grid: {
        borderColor: '#f3f3f3',
        strokeDashArray: 3
    },
    colors: ["var(--primary-color)", "rgb(215, 124, 247)", "rgb(12, 215, 177)"],
    dataLabels: {
        enabled: false
    },
    legend: {
        show: true,
        fontSize: '13px',
        labels: {
            colors: '#959595',
        },
        markers: {
            width: 10,
            height: 10,
        },
    },
    xaxis: {
        min: 0,
        max: 50,
        labels: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
    },
    yaxis: {
        max: 50,
        labels: {
            show: false,
        },
    },
    tooltip: {
        enabled: true,
        theme: "dark",
    }
  }

  export let BuySellChartData: any = {
    series: [ {
        name: 'Last Week',
        type: 'line',
        data:[44, 42, 57, 86, 112, 55, 70, 43, 23, 54, 77, 34]
      }, {
        name: 'Average',
        type: 'area',
        data: [20, 88, 78, 120, 80, 95, 35, 88, 60, 95, 85, 90]
      }],
      chart: {
        height: 380,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false
        },
        zoom:{
            enabled:false
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 10,
          left: 0,
          blur: 0,
          color:  ["rgba(255, 90, 41,0.8)", "var(--primary08)"],
          opacity: 0.05
        },
      },
      colors: ["rgba(255, 90, 41,1)", "var(--primary-color)"],
      fill: {
        type: ['solid', 'gradient', 'solid'],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100],
          colorStops: [
            [
              {
                offset: 0,
                color: "var(--primary01)",
                opacity: 0.1
              },
              {
                offset: 75,
                color: "var(--primary01)",
                opacity: 1
              },
              {
                offset: 100,
                color: 'var(--primary005)',
                opacity: 1
              }
            ],
            [
              {
                  offset: 0,
                  color: "var(--primary01)",
                  opacity: 0.1
                },
                {
                  offset: 75,
                  color: "var(--primary01)",
                  opacity: 1
                },
                {
                  offset: 100,
                  color: 'var(--primary01)',
                  opacity: 1
                }
            ],
          ]
        }
      },
      grid: {
        show: true,
        borderColor: 'rgba(119, 119, 142, 0.1)',
        strokeDashArray: 4,
      },
      stroke: {
        width: [1.5, 1.5],
        curve: 'smooth',
        dashArray: [6,0]
      },
      plotOptions: {
        bar: {
          columnWidth: '25%',
          borderRadius: 5,
        }
      },
      labels:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
      markers: {
        size: 0,
      },
      legend: {
        show: true,
        position: 'top',
        fontFamily: "Montserrat",
        markers: {
         size: 4,
        }
      },
      xaxis: {
        fontFamily: "Montserrat",
        axisBorder: {
          show: true,
          color: 'rgba(119, 119, 142, 0.05)',
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: 'rgba(119, 119, 142, 0.05)',
          width: 6,
          offsetX: 0,
          offsetY: 0
        },
        labels: {
          rotate: -90
        }
      },
      yaxis: {
          min:0,
        title: {
          style: {
            color: '	#adb5be',
            fontSize: '14px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-yaxis-label',
          },
        },
        labels: {
          formatter: function (y:any) {
            return y.toFixed(0) + "";
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y:any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " Hours";
            }
            return y;
  
          }
        }
      }
   }
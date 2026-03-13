export let StatisticsChartData: any = {
    chart: {
        height: 300,
        type: "line",
        stacked: false,
        toolbar: {
            show: false,
        },
        zoom:{
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    colors: ["var(--primary-color)", 'var(--primary04)', "rgb(255, 90, 41)"],
    series: [{
        name: 'Active Projects',
        type: 'column',
        data: [104, 102, 117, 146, 118, 115, 220, 103, 83, 114, 265, 174],
    }, {
        name: "Completed Projects",
        type: "column",
        data: [92, 75, 123, 111, 196, 122, 159, 102, 138, 136, 62, 240]
    }, {
        name: 'Project Revenue',
        type: 'line',
        data: [35, 52, 86, 65, 102, 70, 152, 87, 55, 92, 170, 80],
    }],
    stroke: {
        curve: 'smooth',
        width: [0, 0, 2],
        dashArray: [0, 0, 0]
    },
    plotOptions: {
        bar: {
            columnWidth: '30%',
        }
    },
    markers: {
        size: [0, 0, 5],
        colors: undefined,
        strokeColors: '#fff',
        strokeOpacity: 0.6,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        shape: "circle",
        radius: [0, 0, 2],
        offsetX: 0,
        offsetY: 0,
        onClick: undefined,
        onDblClick: undefined,
        showNullDataPoints: true,
        hover: {
            size: undefined,
            sizeOffset: 3
        }
    },
    fill: {
        opacity: [1, 1, 1]
    },
    grid: {
        borderColor: '#f2f6f7',
    },
    legend: {
        show: true,
        position: 'bottom',
        markers: {
            size: 4,
            strokeWidth: 0,
            strokeColor: '#fff',
            fillColors: undefined,
            radius: 5,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0
          },
    },
    yaxis: {
        min: 0,
        forceNiceScale: true,
        title: {
            style: {
                color: '	#adb5be',
                fontSize: '14px',
                fontFamily: 'poppins, sans-serif',
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
    xaxis: {
        type: 'month',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
    tooltip: {
        enabled: true,
        shared: false,
        intersect: true,
        x: {
            show: false
        }
    },

 }

 export let ProjectChartData: any = {
    chart: {
        height: 130,
        width: 130,
        type: "radialBar",
        zoom:{
            enabled: false
        }
    },
    series: [48],
    colors: ["var(--primary-color)"],
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: "60%",
                background: "#fff"
            },
            dataLabels: {
                name: {
                    offsetY: -10,
                    color: "#4b9bfa",
                    fontSize: "10px",
                    show: false
                },
                value: {
                    offsetY: 7,
                    color: "#4b9bfa",
                    fontSize: "18px",
                    show: true,
                    fontWeight: 500
                }
            }
        }
    }, grid: {
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
    },
    stroke: {
        lineCap: "round"
    },
    labels: ["Followers"]
  }

  export let ProgressChartData: any = { 
    chart: {
        type: 'area',
        height: 45,
        sparkline: {
            enabled: true
        },
        zoom:{
            enabled: false
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 1,
            color: '#fff',
            opacity: 0.05
        }
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 1.5,
        dashArray: 0,
    },
    
    series: [{
        name: 'Value',
        data: [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46]
    }],
    yaxis: {
        min: 0,
        show: false,
        axisBorder: {
            show: false
        },
    },
    xaxis: {
        axisBorder: {
            show: false
        },
    },
  
    colors: ["rgba(255, 90, 41, 1)"],
    fill: {
        type: ['gradient'],
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "rgba(255, 90, 41, 0.1)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(255, 90, 41, 0.05)",
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: 'rgba(255, 90, 41, 0.05)',
                        opacity: 0.1
                    }
                ],
            ],
            enabled:false
        }
        
    },
    tooltip: {
        enabled: false,
    }
  }
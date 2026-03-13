
export let CustomersChartData: any = { 
    chart: {
        type: 'area',
        height: 50,
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 1,
          color: "#fff",
          opacity: 0.05,
        },
      },
      stroke: {
        show: true,
        curve: "smooth",
        lineCap: "butt",
        colors: undefined,
        width: 1.5,
        dashArray: 0,
      },
      series: [
        {
          name: "Value",
          data: [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46],
        },
      ],
      fill: {
        type: ['gradient'],
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            enabled: false,
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "var(--primary005)",
                        opacity: 0.1
                    },
                    {
                        offset: 75,
                        color: "var(--primary01)",
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: 'var(--primary02)',
                        opacity: 1
                    }
                ],
            ]
        }
    },
      yaxis: {
        min: 0,
        show: false,
        axisBorder: {
            show: false,
          },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
      },
      colors: ["var(--primary-color)"],
      tooltip: {
        enabled: false,
      },
}
export let RevenueChartData: any = { 
    ...CustomersChartData,
    colors: ["rgb(255, 90, 41)"],
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
                        color: "rgba(255, 90, 41, 0.05)",
                        opacity: 0.1
                    },
                    {
                        offset: 75,
                        color: "rgba(255, 90, 41, 0.1)",
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: 'rgba(255, 90, 41, 0.2)',
                        opacity: 1
                    }
                ],
            ]
        }
    },
  
}
export let ConversionChartData: any = { 
    ...CustomersChartData,
    colors: ["rgb(12, 199, 99)"],
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
                        color: "rgba(12, 199, 99, 0.05)",
                        opacity: 0.1
                    },
                    {
                        offset: 75,
                        color: "rgba(12, 199, 99, 0.1)",
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: 'rgba(12, 199, 99, 0.2)',
                        opacity: 1
                    }
                ],
            ]
        }
    },
}
export let DealsChartData: any = { 
    ...CustomersChartData,
    colors: ["rgb(12, 156, 252)"],
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
                        color: "rgba(12, 156, 252, 0.05)",
                        opacity: 0.1
                    },
                    {
                        offset: 75,
                        color: "rgba(12, 156, 252, 0.1)",
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: 'rgba(12, 156, 252, 0.2)',
                        opacity: 1
                    }
                ],
            ]
        }
    },
};

export let RevenueChartData1: any = { 
    ...CustomersChartData,
    colors: ["rgb(255, 56, 60)"],
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
                        color: "rgba(255, 56, 60, 0.05)",
                        opacity: 0.1
                    },
                    {
                        offset: 75,
                        color: "rgba(255, 56, 60, 0.1)",
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: 'rgba(255, 56, 60, 0.2)',
                        opacity: 1
                    }
                ],
            ]
        }
    },
}
export let ConversionChartData1: any = { 
    ...CustomersChartData,
    colors: ["rgb(0, 216, 216)"],
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
                        color: "rgba(0, 216, 216, 0.05)",
                        opacity: 0.1
                    },
                    {
                        offset: 75,
                        color: "rgba(0, 216, 216, 0.1)",
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: 'rgba(0, 216, 216, 0.2)',
                        opacity: 1
                    }
                ],
            ]
        }
    },
}
export let DealsChartData1: any = { 
    ...CustomersChartData,
    colors: ["rgb(254, 84, 155)"],
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
                        color: "rgba(254, 84, 155, 0.05)",
                        opacity: 0.1
                    },
                    {
                        offset: 75,
                        color: "rgba(254, 84, 155, 0.1)",
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: 'rgba(254, 84, 155, 0.2)',
                        opacity: 1
                    }
                ],
            ]
        }
    },
};
export let CustomersChartData1: any = { 
    ...CustomersChartData,
    colors: ["rgb(255, 154, 19)"],
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
                        color: "rgba(255, 154, 19, 0.05)",
                        opacity: 0.1
                    },
                    {
                        offset: 75,
                        color: "rgba(255, 154, 19, 0.1)",
                        opacity: 0.5
                    },
                    {
                        offset: 100,
                        color: 'rgba(255, 154, 19, 0.2)',
                        opacity: 1
                    }
                ],
            ]
        }
    },
};

export let LeadsOverviewData: any = { 
    series: [
        {
            name: "Hot Leads",
            data: [80, 50, 30, 40, 100, 20],
        },
        {
            name: "Warm Leads",
            data: [20, 30, 40, 80, 20, 80],
        },
        {
            name: "Cold Leads",
            data: [15, 60, 50, 20, 30, 40],
        },
        {
            name: "Lost Leads",
            data: [44, 76, 78, 13, 43, 10],
        },
    ],
    chart: {
        height: 220,
        type: "radar",
        toolbar: {
            show: false,
        },
        zoom:{
            enabled:false
        }
    },
    colors: ["var(--primary02)", "rgba(255, 90, 41, 0.2)", "rgba(12, 199, 99, 0.2)", "rgba(12, 156, 252, 0.2)"],
    stroke: {
        width: 1.5,
        colors: ["var(--primary-color)", "rgb(255, 90, 41)", "rgb(12, 199, 99)", "rgb(12, 156, 252)"],
    },
    fill: {
        opacity: 0.1,
    },
    markers: {
        size: 0,
    },
    legend: {
        show: false,
        offsetX: 0,
        offsetY: 0,
        fontSize: "12px",
        markers: {
            width: 6,
            height: 6,
            strokeWidth: 0,
            strokeColor: "#fff",
            fillColors: undefined,
            radius: 5,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0,
        },
    },
    xaxis: {
        categories: ["2019", "2020", "2021", "2022", "2023", "2024"],
        axisBorder: { show: false },
    },
    yaxis: {
        axisBorder: { show: false },
    },
    grid: {
        padding: {
            bottom: 12
        }
    },
}

export let ProjectAnalysisChartData: any = {  
    series: [
        {
            name: "Total Income",
            data: [45, 30, 49, 45, 36, 42, 30, 35, 35, 54, 29, 36],
        },
        {
            name: "Total Expenses",
            data: [30, 35, 35, 30, 45, 25, 36, 54, 36, 29, 49, 42],
        },
        {
            name: "Total Deals",
            data: [45, 30, 49, 30, 45, 25, 36, 54, 36, 29, 49, 42],
        },
    ],
    chart: {
        type: "bar",
        height: 293,
        toolbar: {
            show: false,
        },
        dropShadow: {
            enabled: false,
        },
        stacked: true,
    },
    plotOptions: {
        bar: {
            columnWidth: "30%",
            borderRadiusApplication: "around",
            borderRadiusWhenStacked: "all",
            borderRadius: 3,
        },
    },
    responsive: [
        {
            breakpoint: 500,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: "60%",
                    },
                },
            },
        },
    ],
    stroke: {
        show: true,
        curve: "smooth",
        lineCap: "butt",
        width: [5, 5, 5],
        dashArray: 0,
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
    colors: ["var(--primary-color)", "rgb(255, 90, 41)", "rgb(12, 199, 99)"],
    dataLabels: {
        enabled: false,
    },
    legend: {
        position: "top",
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
}

export let ChannelsChartData: any = { 
    series: [76, 67, 61, 40],
        chart: {
            height: 175,
            type: "donut",
        },
        dataLabels: {
            enabled: false,
            color: "#fff",
        },
        legend: {
            show: false,
        },
        stroke: {
            show: true,
            curve: "smooth",
            lineCap: "round",
            colors: "#fff",
            width: 2,
            dashArray: 0,
        },
        fill: {
            type: "solid",
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: "80%",
                    background: "transparent",
                    labels: {
                      show: true,
                      name: {
                        show: true,
                        fontSize: '20px',
                        color: '#495057',
                        fontFamily: "Montserrat, sans-serif",
                        offsetY: -5
                      },
                      value: {
                        show: true,
                        fontSize: '22px',
                        color: undefined,
                        offsetY: 5,
                        fontWeight: 600,
                        fontFamily: "Montserrat, sans-serif",
                        formatter: function (val:any) {
                          return val + "%"
                        }
                      },
                      total: {
                        show: true,
                        showAlways: true,
                        label: 'Total Sales',
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#495057',
                      }
                    }
                },
            },
        },
        colors: [
            "var(--primary-color)",
            "rgb(255, 90, 41)",
            "rgb(12, 199, 99)",
            "rgb(12, 156, 252)",
        ],
        labels: ["Direct", "Referral", "Social", "Organic Search"],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        show: false,
                    },
                },
            },
        ],
 }

// export let RevenueChartData: any = { 
//     series: [
//         {
//             name: "Revenue",
//             type: "column",
//             data: [18, 23, 28, 36, 44, 52, 61, 71, 76, 88, 91, 100],
//         },
//         {
//             name: "Profit",
//             type: "area",
//             data: [ 34, 38, 46, 55, 59, 68, 73, 85, 92, 105, 125, 135],
//         }
//     ],
//     chart: {
//         toolbar: {
//             show: false,
//         },
//         height: 310,
//         stacked: false,
//         dropShadow: {
//             enabled: true,
//             enabledOnSeries: undefined,
//             top: 7,
//             left: 1,
//             blur: 3,
//             color: ["transparent", "#000"],
//             opacity: 0.2
//         },
//     },
//     stroke: {
//         width: [1.5, 1.5],
//         curve: "smooth",
//     },
//     plotOptions: {
//         bar: {
//             columnWidth: "20%",
//             borderRadius: 3,
//         },
//     },
//     colors: [
//         "var(--primary-color)",
//         "rgb(215, 124, 247)"
//     ],
//     fill: {
//         type: 'gradient',
//         gradient: {
//             shadeIntensity: 1,
//             opacityFrom: 0.4,
//             opacityTo: 0.1,
//             stops: [0, 90, 100],
//             colorStops: [ 
//                 [
//                     {
//                         offset: 0,
//                         color: "var(--primary-color)",
//                         opacity: 1
//                     },
//                     {
//                         offset: 75,
//                         color: "var(--primary-color)",
//                         opacity: 1
//                     },
//                     {
//                         offset: 100,
//                         color: "var(--primary-color)",
//                         opacity: 1
//                     }
//                 ],
//                 [
//                     {
//                         offset: 0,
//                         color: "rgba(215, 124, 247,0.15)",
//                         opacity: 1
//                     },
//                     {
//                         offset: 75,
//                         color: "rgba(215, 124, 247,0.15)",
//                         opacity: 1
//                     },
//                     {
//                         offset: 100,
//                         color: "rgba(215, 124, 247,0.15)",
//                         opacity: 1
//                     }
//                 ],
//             ]
//         }
//     },
//     labels: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//     ],
//     markers: {
//         size: 0,
//     },
//     xaxis: {
//         type: "month",
//     },
//     yaxis: {
//         min: 0,
//     },
//     tooltip: {
//         shared: true,
//         theme: "dark",
//         intersect: false,
//         y: {
//             formatter: function (y:any) {
//                 if (typeof y !== "undefined") {
//                     return y.toFixed(0) + " points";
//                 }
//                 return y;
//             },
//         },
//     },
//     legend: {
//         show: true,
//         position: "top",
//         horizontalAlign: "center",
//         fontFamily: "Montserrat",
//     },
// }
export let SourceChartData1: any = { 
    series: [
        {
            name: 'Actual',
            data: [
                {
                    x: 'Mobile',
                    y: 1292,
                },
                {
                    x: 'Desktop',
                    y: 4432,
                },
                {
                    x: 'Laptop',
                    y: 5423,
                },
                {
                    x: 'Tablet',
                    y: 6653,
                }
            ]
        }
    ],
    chart: {
        height: 317,
        type: 'bar'
    },
    plotOptions: {
        bar: {
            columnWidth: '40%',
            distributed: true,
            borderRadius: 3,
        }
    },
    colors: ['var(--primary-color)', "rgba(215, 124, 247, 1)", "rgba(12, 215, 177, 1)", "rgba(254, 124, 88, 1)"],
    dataLabels: {
        enabled: false
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 3
    },
    legend: {
        show: false,
        showForSingleSeries: true,
        customLegendItems: ['Expected'],
        fontFamily: "Montserrat",
    },
    xaxis: {
        labels: {
            show: true,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        }
    },
    yaxis: {
        labels: {
            show: true,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        }
    },
    tooltip: {
        theme: "dark",
    }
}
export let SourceChartData2: any = { 
    series: [14, 23, 21, 17, 15, 10],
    chart: {
        type: 'polarArea',
        height: 357
    },
    stroke: {
        colors: ['#fff'],
    },
    fill: {
        opacity: 1,
        text:'none'
    },
    legend: {
        position: 'bottom',
        itemMargin: {
            horizontal: 5,
            vertical: 5
        },
        fontFamily: "Montserrat",
    },
    labels: ['Organic Search', 'Paid Search', 'Direct Traffic', 'Social Media', 'Referrals', "Others"],
    colors: ["var(--primary-color)", "rgb(215, 124, 247)", "rgb(12, 215, 177)", "rgb(254, 124, 88)", "rgb(12, 163, 231)", "rgb(243, 157, 45)"],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
}


import { EChartsOption } from 'echarts';
import { data } from '../../components/charts/echarts/echarts';

//Echart (line Chart)
export let echartLineOption: EChartsOption = {
    
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        data: ['2013', '2014', '2015', '2016', '2017', '2018', '2019'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series: [{
		name: 'sales',
		type: 'bar',
		barMaxWidth: 20,
		stack: 'Stack',
		data: [10, 15, 9, 18, 10, 15, 20]
	}, {
		name: 'Profit',
		type: 'bar',
		stack: 'Stack',
		barMaxWidth: 20,
		data: [10, 14, 10, 15, 9, 25 , 16]
	}],
    color: ['#f7557a', '#285cf7'],

};

//combined line and bar chart   
export let echartLineBarOption: EChartsOption = {
    grid: {
        top: '6',
        right: '10',
        bottom: '17',
        left: '32',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        type: 'category',
        data: ['2013', '2014', '2015', '2016', '2017', '2018'],
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series: [{
		name: 'sales',
		type: 'bar',
		barMaxWidth: 20,
		stack: 'Stack',
		data: [10, 15, 9, 18, 10, 15]
	}, {
		name: 'Profit',
		type: 'bar',
		stack: 'Stack',
		barMaxWidth: 20,
		data: [10, 14, 10, 15, 9, 25]
	}],
    color: ['#f7557a', '#285cf7']
}
//Horizontal line chart
export let echartHorizontalLineChart: EChartsOption = {
    valueAxis: {
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(171, 167, 167,0.2)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['rgba(171, 167, 167,0.2)']
            }
        }
    },
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        data: ['2014', '2015', '2016', '2017', '2018', '2019'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series: [{
		name: 'sales',
		type: 'bar',
		barMaxWidth: 20,
		data: [10, 15, 9, 18, 10, 15]
	},  {
		name: 'growth',
		type: 'bar',
		barMaxWidth: 20,
		data: [10, 14, 10, 15, 9, 25]
	}],
    color: ['#285cf7', '#f7557a' ]
}
//Combined Horizontal line  and bar chart
export let echartHorizontalLineBarChart: EChartsOption = {
  grid: {
    left: "0%",
    right: "0%",
    bottom: "0%",
    top: "10%",
    containLabel: true
},
xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: {
        lineStyle: {
            color: "#8c9097"
        }
      },
        splitLine: {
            lineStyle: {
                color: "rgba(142, 156, 173,0.1)"
            }
        }
    
},
yAxis: {
    type: 'value',
    axisLine: {
        lineStyle: {
            color: "#8c9097"
        }
    },
    splitLine: {
        lineStyle: {
            color: "rgba(142, 156, 173,0.1)"
        }
    }
},
series: [
    {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
    }
],
color: "rgb(115, 93, 255)"
};
//stacked bar chart
export let echartStackedBarChart: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '32',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: 'rgba(119, 119, 142, 0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
    },
    yAxis: {
        type: 'category',
        data: ['2014', '2015', '2016', '2017', '2018', '2019'],
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series: [{
		name: 'sales',
		type: 'bar',
		barMaxWidth: 20,
		data: [10, 15, 9, 18, 10, 15]
	},  {
		name: 'growth',
		type: 'bar',
		barMaxWidth: 20,
		data: [10, 14, 10, 15, 9, 25]
	}],
    color: ['#285cf7', '#f7557a']

}
//Horizontal stacked bar chart
export let echartHoriStackedBarChart: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '32',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
    },
    yAxis: {
        type: 'category',
        data: ['2014', '2015', '2016', '2017', '2018', '2019'],
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series:[{
		name: 'sales',
		type: 'line',
		smooth: true,
		data: [10, 15, 9, 18, 10, 15],
		color: ['#285cf7']
	}, {
		name: 'Profit',
		type: 'line',
		smooth: true,
		// size: 10,
		data: [10, 14, 10, 15, 9, 25],
		color: ['#f7557a']
	}],
    color: ['#f7557a', '#285cf7', '#43d7ef']
}

//DATA ATTRIBUTES 1
export let dataAttributes1: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        data: ['2013', '2014', '2015', '2016', '2017', '2018'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series:[{
		name: 'data',
		type: 'line',
		data: [5, 15, 9, 18, 10, 15]
	}],
    color: ['#f7557a']
}

export let dataAttributes2: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    xAxis: {
        data: ['2013', '2014', '2015', '2016', '2017', '2018'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    },
    series:[{
		name: 'data',
		type: 'line',
		smooth: true,
		data: [5, 15, 9, 18, 10, 15]
	}],
    color: ['#285cf7']
}

export let dataAttributes3: EChartsOption = {
    grid: {
        top: '6',
        right: '0',
        bottom: '17',
        left: '25',
    },
    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#888180'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['rgba(171, 167, 167,0.2)']
            }
        }
    },
    valueAxis: {
        axisLine: {
            lineStyle: {
                color: '#888180'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(255,255,255,0.1)']
            }
        },
        splitLine: {
            lineStyle: {
                color: ['rgba(171, 167, 167,0.2)']
            }
        }
    },
    tooltip: {
        trigger: 'axis',
        position: ['35%', '32%'],
    },
    legend: {
        data: ['New Account', 'Expansion Account']
    },
    toolbox: {
        show: false
    },
    calculable: false,
    xAxis: [{
        type: 'category',
        data: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    }],
    yAxis: [{
        type: 'value',
        splitLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(171, 167, 167,0.2)'
            }
        },
        axisLabel: {
            fontSize: 10,
            color: '#5f6d7a'
        }
    }],
    series: [{
        name: 'View Price',
        type: 'bar',
        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        markPoint: {
            data: [{
                type: 'max',
                name: ''
            }, {
                type: 'min',
                name: ''
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: ''
            }]
        }
    }, {
        name: ' Purchased Price',
        type: 'bar',
        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        markPoint: {
            data: [{
                name: 'Purchased Price',
                value: 182.2,
                xAxis: 7,
                yAxis: 183,
            }, {
                name: 'Purchased Price',
                value: 2.3,
                xAxis: 11,
                yAxis: 3
            }]
        },
        markLine: {
            data: [{
                type: 'average',
                name: ''
            }]
        }
    }],
    color: ['#285cf7', '#f7557a']
}

//SMOOTH LINE CHART
export let smoothlinechart: EChartsOption = {
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
    },
  ],
  color: 'rgb(115, 93, 255)',
};

//Basic Area Chart
export let basicAreaChart: EChartsOption = {
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      areaStyle: {},
    },
  ],
  color: 'rgb(115, 93, 255)',
};

//STACKED LINE CHART
export let stackedlineChart: EChartsOption = {
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
    textStyle: {
      color: '#777',
    },
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
  color: ["rgb(115, 93, 255)", "rgb(215, 124, 247)", "#ecb403", "#ff5b51", "#45aaf2"]
};

//stackedAreaChart

export let stackedAreaChart: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
    textStyle: {
      color: '#777',
    },
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {
        lineStyle: {
          color: '#8c9097',
        },
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#8c9097',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(142, 156, 173,0.1)',
        },
      },
    },
  ],
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      label: {
        show: true,
        position: 'top',
      },
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
   color: ["rgb(115, 93, 255)", "rgb(215, 124, 247)", "#ecb403", "#ff5b51", "#45aaf2"]
};

//Step Lent Chart
export let steplineChart: EChartsOption = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Step Start', 'Step Middle', 'Step End'],
    textStyle: {
      color: '#777',
    },
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  series: [
    {
      name: 'Step Start',
      type: 'line',
      step: 'start',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Step Middle',
      type: 'line',
      step: 'middle',
      data: [220, 282, 201, 234, 290, 430, 410],
    },
    {
      name: 'Step End',
      type: 'line',
      step: 'end',
      data: [450, 432, 401, 454, 590, 530, 510],
    },
  ],
   color: ["rgb(115, 93, 255)", "rgb(215, 124, 247)", "#ecb403", "#ff5b51", "#45aaf2"]
};

//Basi Bar Line Chart
export let basicBarChart: EChartsOption = {
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
    },
  ],
  color: 'rgb(115, 93, 255)',
};

// bar with background chart
export let barBgChart: EChartsOption = {
  grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLine: {
                lineStyle: {
                    color: "#8c9097"
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: "#8c9097"
                }
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(142, 156, 173,0.1)"
                }
            }
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ],
        color: "rgb(115, 93, 255)"
};

//STYLE FOR A SINGLE BAR CHART
export let singleBarChart: EChartsOption = {
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  series: [
    {
      data: [
        120,
        {
          value: 200,
          itemStyle: {
            color: 'rgb(215, 124, 247)',
          },
        },
        150,
        80,
        70,
        110,
        130,
      ],
      type: 'bar',
    },
  ],
  color: 'rgb(115, 93, 255)',
};

//Water Fall Chart

export let waterFallChart: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: function (params:any) {
      let tar = params[1];
      return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
    },
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    splitLine: { show: false },
    data: ['Total', 'Rent', 'Utilities', 'Transportation', 'Meals', 'Other'],
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  series: [
    {
      name: 'Placeholder',
      type: 'bar',
      stack: 'Total',
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent',
      },
      emphasis: {
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent',
        },
      },
      data: [0, 1700, 1400, 1200, 300, 0],
    },
    {
      name: 'Life Cost',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'inside',
      },
      data: [2900, 1200, 300, 200, 900, 300],
    },
  ],
  color: 'rgb(115, 93, 255)',
};

// bar chart with negative values
let labelRight = {
   position: 'right',
 };
export let barChartNegativeChart: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    position: 'top',
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  yAxis: {
    type: 'category',
    axisLabel: { show: false },
    axisTick: { show: false },
    data: [
      'ten',
      'nine',
      'eight',
      'seven',
      'six',
      'five',
      'four',
      'three',
      'two',
      'one',
    ],
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
  },
  series: [
    {
      name: 'Cost',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        formatter: '{b}',
        position: 'right', // Set the position property to a valid value
      },
      data: [
        { value: -0.07 },
        { value: -0.09 },
        0.2,
        0.44,
        { value: -0.23 },
        0.08,
        { value: -0.17 },
        0.47,
        { value: -0.36 },
        0.18,
      ],
    },
  ],
  color: 'rgb(115, 93, 255)',
};

//Bar With Labels Chart

 let app:any = {};
 const posList = [
   'left',
   'right',
   'top',
   'bottom',
   'inside',
   'insideTop',
   'insideLeft',
   'insideRight',
   'insideBottom',
   'insideTopLeft',
   'insideTopRight',
   'insideBottomLeft',
   'insideBottomRight',
 ];
 app.config = {
   rotate: {
     min: -90,
     max: 90,
   },
   align: {
     options: {
       left: 'left',
       center: 'center',
       right: 'right',
     },
   },
   verticalAlign: {
     options: {
       top: 'top',
       middle: 'middle',
       bottom: 'bottom',
     },
   },
   position: {
     options: posList.reduce(function (map:any, pos:any) {
       map[pos] = pos;
       return map;
     }, {}),
   },
   distance: {
     min: 0,
     max: 100,
   },
 };
 app.config = {
   rotate: 90,
   align: 'left',
   verticalAlign: 'middle',
   position: 'insideBottom',
   distance: 15,
   onChange: function () {
     const labelOption = {
       rotate: app.config.rotate,
       align: app.config.align,
       verticalAlign: app.config.verticalAlign,
       position: app.config.position,
       distance: app.config.distance,
     };
   },
 };
let labelOption = {
  show: true,
  position: app.config.position,
  distance: app.config.distance,
  align: app.config.align,
  verticalAlign: app.config.verticalAlign,
  rotate: app.config.rotate,
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
    name: {},
  },
};
export let barLableChart: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['Forest', 'Steppe', 'Desert', 'Wetland'],
    textStyle: {
      color: '#777',
    },
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack'] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['2012', '2013', '2014', '2015', '2016'],
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(142, 156, 173,0.1)',
        },
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#8c9097',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(142, 156, 173,0.1)',
        },
      },
    },
  ],
  series: [
    {
      name: 'Forest',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series',
      },
      data: [320, 332, 301, 334, 390],
    },
    {
      name: 'Steppe',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290],
    },
    {
      name: 'Desert',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series',
      },
      data: [150, 232, 201, 154, 190],
    },
    {
      name: 'Wetland',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series',
      },
      data: [98, 77, 101, 99, 40],
    },
  ],
  
  color: ["rgb(115, 93, 255)", "rgb(215, 124, 247)", "#ecb403", "#45aaf2"]
};

//HORIZONTAL BAR CHART
export let horizontalBarChart: EChartsOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        textStyle: {
            color: '#777'
        }
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '10%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine: {
            lineStyle: {
                type: 'dashed',
                color: "rgba(142, 156, 173,0.1)"
            }
        }
    },
    yAxis: {
        type: 'category',
        data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'],
        axisLine: {
            lineStyle: {
                color: "#8c9097"
            }
        },
        splitLine: {
            lineStyle: {
                color: "rgba(142, 156, 173,0.1)"
            }
        }
    },
    series: [
        {
            name: '2011',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
        },
        {
            name: '2012',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
        }
    ],
    color: ["rgb(115, 93, 255)", "rgb(215, 124, 247)"]
}

//HORIZONTAL STACKED BAR CHART

export let horizontalStackedBarChart: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
    },
  },
  legend: {
    textStyle: {
      color: '#777',
    },
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '20%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  yAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  series: [
    {
      name: 'Direct',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [320, 302, 301, 334, 390, 330, 320],
    },
    {
      name: 'Mail Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Affiliate Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ad',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [150, 212, 201, 154, 190, 330, 410],
    },
    {
      name: 'Search Engine',
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      emphasis: {
        focus: 'series',
      },
      data: [820, 832, 901, 934, 1290, 1330, 1320],
    },
  ],
  color: ["rgb(115, 93, 255)", "rgb(215, 124, 247)", "#ecb403", "#45aaf2", "#ff5b51"]
};
//PIE CHART
export let pieChart: EChartsOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: '#777',
    },
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
  color: ["rgb(115, 93, 255)", "rgb(215, 124, 247)", "#ecb403", "#45aaf2", "#ff5b51"]
};


//DOUGHNUT CHART
export let doughutChart: EChartsOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '0%',
    left: 'center',
    textStyle: {
      color: '#777',
    },
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '17',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
    },
  ],
  color: ["rgb(115, 93, 255)", "rgb(215, 124, 247)", "#ecb403", "#45aaf2", "#ff5b51"]
};

//BASIC SCATTER CHART
export let scatterChart: EChartsOption = {
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  series: [
    {
      symbolSize: 20,
      data: [
        [10.0, 8.04],
        [8.07, 6.95],
        [13.0, 7.58],
        [9.05, 8.81],
        [11.0, 8.33],
        [14.0, 7.66],
        [13.4, 6.81],
        [10.0, 6.33],
        [14.0, 8.96],
        [12.5, 6.82],
        [9.15, 7.2],
        [11.5, 7.2],
        [3.03, 4.23],
        [12.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [4.05, 4.96],
        [6.03, 7.24],
        [12.0, 6.26],
        [12.0, 8.84],
        [7.08, 5.82],
        [5.02, 5.68],
      ],
      type: 'scatter',
    },
  ],
  color: ['rgb(115, 93, 255)'],
};

//BASIC SCATTER CHART
export let bubbleChart: EChartsOption = {
  legend: {
    right: '10%',
    top: '3%',
    data: ['1990', '2015'],
    textStyle: {
      color: '#777',
    },
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
  },
  xAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
    scale: true,
  },
  series: [
    {
      name: '1990',
      data: data[0],
      type: 'scatter',
      symbolSize: function (data: number[]) {
        return Math.sqrt(data[2]) / 5e2;
      },
      emphasis: {
        focus: 'series',
        label: {
          show: true,
          formatter: function (param: any) {
            return param.data[3];
          },
          position: 'top',
        },
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(25, 100, 150, 0.5)',
        shadowOffsetY: 5,
      },
    },
    {
      name: '2015',
      data: data[1],
      type: 'scatter',
      symbolSize: function (data: number[]) {
        return Math.sqrt(data[2]) / 5e2;
      },
      emphasis: {
        focus: 'series',
        label: {
          show: true,
          formatter: function (param: any) {
            return param.data[3];
          },
          position: 'top',
        },
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(120, 36, 50, 0.5)',
        shadowOffsetY: 5,
      },
    },
  ],
  color: ['#49b6f5', '#e6533c'],
};

export let candlestickChart: EChartsOption = {
  grid: {
    left: '5%',
    right: '0%',
    bottom: '10%',
    top: '10%',
  },
  xAxis: {
    data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'],
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#8c9097',
      },
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(142, 156, 173,0.1)',
      },
    },
  },
series: [
    {
        type: 'candlestick',
        data: [
            [20, 34, 10, 38],
            [40, 35, 30, 50],
            [31, 38, 33, 44],
            [38, 15, 5, 42],
        ],
        itemStyle: {
          color: "rgb(115, 93, 255)",
          color0: "rgb(215, 124, 247)",
          borderColor: "rgb(115, 93, 255)",
          borderColor0: "rgb(215, 124, 247)",
        },
    },
],
};
//BASIC RADAR CHART
export let radarChart: EChartsOption = {
  legend: {
    data: ['Allocated Budget', 'Actual Spending'],
    left: '0%',
    top: '0%',
    textStyle: {
      color: '#777',
    },
  },
  radar: {
    indicator: [
      { name: 'Sales', max: 6500 },
      { name: 'Administration', max: 16000 },
      { name: 'Information Technology', max: 30000 },
      { name: 'Customer Support', max: 38000 },
      { name: 'Development', max: 52000 },
      { name: 'Marketing', max: 25000 },
    ],
  },
  series: [
    {
      name: 'Budget vs spending',
      type: 'radar',
      data: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: 'Allocated Budget',
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: 'Actual Spending',
        },
      ],
    },
  ],
  color: ["rgb(115, 93, 255)", "rgb(215, 124, 247)"]
};

//basic treemap chart

export let treemapChart: EChartsOption = {
  series: [
    {
      type: 'treemap',
      data: [
        {
          name: 'nodeA',
          value: 10,
          children: [
            {
              name: 'nodeAa',
              value: 4,
            },
            {
              name: 'nodeAb',
              value: 6,
            },
          ],
        },
        {
          name: 'nodeB',
          value: 20,
          children: [
            {
              name: 'nodeBa',
              value: 20,
              children: [
                {
                  name: 'nodeBa1',
                  value: 20,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  color: ['rgb(115, 93, 255)', 'rgb(215, 124, 247)'],
};

//Funnel Chart
 export let funnelChart: EChartsOption = {
   tooltip: {
     trigger: 'item',
     formatter: '{a} <br/>{b} : {c}%',
   },
   toolbox: {
     feature: {
       dataView: { readOnly: false },
       restore: {},
       saveAsImage: {},
     },
   },
   legend: {
     data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order'],
     textStyle: {
       color: '#777',
     },
   },
   series: [
     {
       name: 'Funnel',
       type: 'funnel',
       left: '10%',
       top: 60,
       bottom: 60,
       width: '80%',
       min: 0,
       max: 100,
       minSize: '0%',
       maxSize: '100%',
       sort: 'descending',
       gap: 2,
       label: {
         show: true,
         position: 'inside',
       },
       labelLine: {
         length: 10,
         lineStyle: {
           width: 1,
           type: 'solid',
         },
       },
       itemStyle: {
         borderColor: '#fff',
         borderWidth: 1,
       },
       emphasis: {
         label: {
           fontSize: 20,
         },
       },
       data: [
         { value: 60, name: 'Visit' },
         { value: 40, name: 'Inquiry' },
         { value: 20, name: 'Order' },
         { value: 80, name: 'Click' },
         { value: 100, name: 'Show' },
       ],
     },
   ],
   color: ['rgb(115, 93, 255)', 'rgb(215, 124, 247)', '#fbbc0b', '#ee335e', '#49b6f5'],
 };
//Basic Gauge Chart
export let guageChart: EChartsOption = {
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%',
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      progress: {
        show: true,
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}',
      },
      data: [
        {
          value: 50,
          name: 'SCORE',
        },
      ],
    },
  ],
  color: ['rgb(115, 93, 255)'],
};

//Simple Graph Chart
 export let graphChart: EChartsOption = {
   tooltip: {},
   animationDurationUpdate: 1500,
   animationEasingUpdate: 'quinticInOut',
   series: [
     {
       type: 'graph',
       layout: 'none',
       symbolSize: 50,
       roam: true,
       label: {
         show: true,
       },
       edgeSymbol: ['circle', 'arrow'],
       edgeSymbolSize: [4, 10],
       edgeLabel: {
         fontSize: 20,
       },
       data: [
         {
           name: 'Node 1',
           x: 300,
           y: 300,
         },
         {
           name: 'Node 2',
           x: 800,
           y: 300,
         },
         {
           name: 'Node 3',
           x: 550,
           y: 100,
         },
         {
           name: 'Node 4',
           x: 550,
           y: 500,
         },
       ],
       links: [
         {
           source: 0,
           target: 1,
           symbolSize: [5, 20],
           label: {
             show: true,
           },
           lineStyle: {
             width: 5,
             curveness: 0.2,
           },
         },
         {
           source: 'Node 2',
           target: 'Node 1',
           label: {
             show: true,
           },
           lineStyle: {
             curveness: 0.2,
           },
         },
         {
           source: 'Node 1',
           target: 'Node 3',
         },
         {
           source: 'Node 2',
           target: 'Node 3',
         },
         {
           source: 'Node 2',
           target: 'Node 4',
         },
         {
           source: 'Node 1',
           target: 'Node 4',
         },
       ],
       lineStyle: {
         opacity: 0.9,
         width: 2,
         curveness: 0,
       },
     },
   ],
   color: ['rgb(115, 93, 255)'],
 };
 //Simple Graph Chart
 export let barChart: EChartsOption = {
  title: {
    text: 'Rainfall vs Evaporation',
    subtext: 'Fake Data'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Rainfall', 'Evaporation']
  },
  toolbox: {
    show: true,
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      // prettier-ignore
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Rainfall',
      type: 'bar',
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
      ],
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: 'Avg' }]
      }
    },
    {
      name: 'Evaporation',
      type: 'bar',
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      ],
      markPoint: {
        data: [
          { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
          { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: 'Avg' }]
      }
    }
    ],
   color:['rgb(115, 93, 255)','rgb(215, 124, 247)']
};

   
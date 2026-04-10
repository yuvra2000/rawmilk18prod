import { EChartsOption, PieSeriesOption } from 'echarts';
import { merge } from 'lodash-es';

// A ChartPlugin is a function that enhances an EChartsOption
export type ChartPlugin = (options: EChartsOption) => EChartsOption;

/** Adds a data zoom slider and inside-scroll functionality. */
export function withDataZoom(): ChartPlugin {
  return (options) => merge(options, {
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', start: 0, end: 100, height: 20, bottom: 10 }
    ]
  });
}

/** Adds a toolbox for saving, viewing data, and switching chart types. */
export function withToolbox(): ChartPlugin {
  return (options) => merge(options, {
    toolbox: {
      feature: {
        saveAsImage: { title: 'Save' },
        dataView: { readOnly: false, title: 'Data' },
        magicType: { type: ['line', 'bar'], title: { line: 'Line', bar: 'Bar' } },
        restore: { title: 'Reset' }
      }
    }
  });
}

/** Applies a consistent, professional theme to the chart. */
export function withAppTheme(): ChartPlugin {
  return (options) => merge(options, {
    color: ['#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE'],
    title: { textStyle: { color: '#2c3e50', fontWeight: 'bold' } },
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#ddd',
      borderWidth: 1,
      textStyle: { color: '#333' }
    }
  });
}


// src/app/shared/components/reusable-chart/plugins/chart.plugins.ts

// ... (other imports and plugins)

// Helper function to generate the tooltip HTML
function generateTooltipHtml(data: { name: string; value: number }[], total: number): string {
  const itemsHtml = data.map(item => `
    <div style="display: flex; justify-content: space-between; gap: 16px;">
      <span>${item.name}:</span>
      <strong style="font-weight: 600;">${item.value}</strong>
    </div>
  `).join('');

  return `
    <div style="font-family: sans-serif; font-size: 14px;">
      ${itemsHtml}
      <hr style="margin: 6px 0; border: none; border-top: 1px solid #4b1818ff;" />
      <div style="display: flex; justify-content: space-between; font-weight: bold;">
        <span>Total:</span>
        <span>${total}</span>
      </div>
    </div>
  `;
}

export function withDashboardCardTheme(): ChartPlugin {
  return (options: EChartsOption): EChartsOption => {
    // Data aur Total ko pehle hi nikal lein
    const data = (Array.isArray(options.series) && options.series[0]?.data ? options.series[0].data : []) as { name: string; value: number }[];
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    const dataSeries = {
      type: 'pie' as const,
      radius: ['64%', '90%'],
      data: data, // Use the pre-fetched data
      // ... baaki dataSeries properties waisi hi rahengi ...
      label: { show: false },
      labelLine: { show: false },
      emphasis: {
        label: { show: true, fontSize: '13', fontWeight: 'bold', color: 'black' },
        itemStyle: { borderWidth: 14 }
      },
    };

    const totalSeries = {
      type: 'pie' as const,
      radius: ['0%', '40%'],
      color: 'white',
      label: {
        show: true,
        position: 'center' as const,
        color: '#1D4380',
        fontSize: 16,
        fontWeight: 700,
        formatter: () => total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total.toString(),
      },
      data: [{ value: 1, name: 'Total' }],
      tooltip: {
        trigger: 'item',
        // Helper function ko yahaan call karein
        formatter: () => generateTooltipHtml(data, total)
      }
    };

    const finalOptions: EChartsOption = {
      ...options,
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)',
       
        appendTo:'body'
       },
      legend: { show: false },
      series: [dataSeries, totalSeries] as PieSeriesOption[],
    };

    return finalOptions;
  };
}
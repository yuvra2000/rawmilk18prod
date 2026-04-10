import { Injectable, computed, signal } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChartConfig, MultiSeriesData, SingleSeriesData } from '../models/chart-config.model';
import { groupBy, map } from 'lodash-es';

@Injectable()
export class ChartService {
  config = signal<ChartConfig | null>(null);

  chartOption = computed<EChartsOption>(() => {
    const currentConfig = this.config();
    if (!currentConfig) return {};

    let baseOptions: EChartsOption;
    switch (currentConfig.type) {
      case 'pie':
      case 'doughnut':
        baseOptions = this.buildPieChart(currentConfig.data, currentConfig.type);
        break;
      case 'bar':
      case 'line':
        baseOptions = this.buildBarOrLineChart(currentConfig.data, currentConfig.type);
        break;
      case 'horizontalBar':
        baseOptions = this.buildHorizontalBarChart(currentConfig.data);
        break;
      case 'groupedBar':
        baseOptions = this.buildGroupedBarChart(currentConfig.data);
        break;
      default:
        throw new Error(`[ChartService] Unknown chart type specified.`);
    }

    return (currentConfig.plugins ?? []).reduce(
      (options, plugin) => plugin(options),
      baseOptions
    );
  });

  // --- Private Builder Methods ---
  private buildPieChart(data: SingleSeriesData, type: 'pie' | 'doughnut'): EChartsOption {
    return {
      series: [{ type: 'pie', data: data, radius: type === 'doughnut' ? ['40%', '70%'] : '70%' }],
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' }
    };
  }

  private buildBarOrLineChart(data: SingleSeriesData, type: 'bar' | 'line'): EChartsOption {
    return {
      xAxis: { type: 'category', data: data.map(d => d.name) },
      yAxis: { type: 'value' },
      series: [{ type: type, data: data.map(d => d.value) }],
      tooltip: { trigger: 'axis' }
    };
  }
    
  private buildHorizontalBarChart(data: SingleSeriesData): EChartsOption {
    return {
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: data.map(d => d.name) },
      series: [{ type: 'bar', data: data.map(d => d.value) }],
      tooltip: { trigger: 'axis' },
      grid: { containLabel: true, left: 10, right: 20, top: 10, bottom: 10 }
    };
  }

  private buildGroupedBarChart(data: MultiSeriesData): EChartsOption {
    const groupedData = groupBy(data, 'series');
    const categories = [...new Set(data.map(d => d.name))];
    
    const series = map(groupedData, (seriesData, seriesName) => ({
      name: seriesName,
      type: 'bar',
      data: categories.map(cat => seriesData.find(d => d.name === cat)?.value ?? 0),
      emphasis: { focus: 'series' }
    } as const)); // The fix is applied here

    return {
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value' },
      series: series,
      tooltip: { trigger: 'axis' },
      legend: { show: true }
    };
  }
}
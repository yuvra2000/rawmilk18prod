import { ChartPlugin } from '../plugins/chart.plugin';

// Data shapes
export type SingleSeriesData = { name: string; value: number; }[];
export type MultiSeriesData = { name: string; series: string; value: number; }[];

// Base config with plugins
interface BaseConfig {
  plugins?: ChartPlugin[];
}

// Discriminated unions for specific charts
export interface BarChartConfig extends BaseConfig {
  type: 'bar' | 'line';
  data: SingleSeriesData;
  showBackground?: boolean; 
}

export interface HorizontalBarChartConfig extends BaseConfig {
  type: 'horizontalBar';
  data: SingleSeriesData;
}

export interface GroupedBarChartConfig extends BaseConfig {
  type: 'groupedBar';
  data: MultiSeriesData;
}

export interface PieChartConfig extends BaseConfig {
  type: 'pie' | 'doughnut';
  data: SingleSeriesData;
}

// The final config type
export type ChartConfig =
  | BarChartConfig
  | HorizontalBarChartConfig
  | GroupedBarChartConfig
  | PieChartConfig;
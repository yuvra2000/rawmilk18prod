export interface StatCardConfig {
  title: string;
  icon: string; // Path to the icon SVG or an icon class
  totalValue?: string; // The large value in the center, e.g., '3.2k'
  chartType?: 'pie' | 'doughnut' | 'bar' | 'horizontalBar' | 'line';
  typeLabel?: string;
  // Data for the donut chart, including the colors
  chartData: {
    name: string; // For the legend
    value: number;
    color: string; // Explicit color for this segment
    filterCode?: string | number;
    columnName?: string;
  }[];

  // Data for the detailed breakdown list on the right
  details?: {
    label: string;
    value: string;
    color: string; // Color for the legend dot
  }[];
}

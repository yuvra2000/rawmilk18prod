// src/app/shared/components/reusable-stat-card/reusable-stat-card.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfig } from '../reusable-chart/models/chart-config.model';
import { ReusableChartComponent } from '../reusable-chart/reusable-chart.component';
import { StatCardConfig } from './model/stat-card.model';
// Naye plugin ko import karein
import { withDashboardCardTheme } from '../reusable-chart/plugins/chart.plugin';

@Component({
  selector: 'app-reusable-stat-card',
  standalone: true,
  imports: [ReusableChartComponent, CommonModule],
  templateUrl: './reusable-stat-card.component.html',
  styleUrl: './reusable-stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableStatCardComponent {
  config = input.required<StatCardConfig>();
  sliceClick = output<any>();

  // Naya optional input: 2 ya 3 columns manually set karne ke liye
  overrideColumns = input<2 | 3>();
  titleStyle = input<Record<string, string | number>>({});
  iconStyle = input<Record<string, string | number>>({});
  legendStyle = input<Record<string, string | number>>({});
  truncateLabels = input<boolean>(false);
  maxLabelWidth = input<string>('120px');

  legendClass = computed(() => {
    const manualLayout = this.overrideColumns();
    if (manualLayout) {
      return `layout-${manualLayout}-col`;
    }
    const count = this.config().chartData.length;

    if (count >= 5) {
      // 5, 6, ya zyada items ke liye 3-column layout
      return 'layout-3-col';
    }
    // 2, 3, ya 4 items ke liye 2-column layout
    return 'layout-2-col';
  });

  chartConfig = computed<ChartConfig>(() => {
    const statConfig = this.config();

    return {
      type: statConfig.chartType || 'doughnut', // Type abhi bhi important hai ChartService ke liye
      data: statConfig.chartData.map((item) => ({
        name: item.name,
        value: item.value,
        filterCode: item.filterCode,
        columnName: item.columnName,
      })),
      // Humara naya plugin + custom colors ke liye ek aur plugin
      plugins: [
        withDashboardCardTheme(),
        // Colors ke liye ek chhota on-the-fly plugin
        (options) => {
          options.color = statConfig.chartData.map((item) => item.color);
          return options;
        },
      ],
    };
  });

  isImagePath(icon: string): boolean {
    return icon?.includes('/') || icon?.includes('.');
  }

  onChartEvent(event: any) {
    if (event.componentType === 'series' && event.type === 'click') {
      this.sliceClick.emit({
        cardTitle: this.config().title,
        clickedSlice: {
          name: event.name,
          value: event.value,
          filterCode: event?.filterCode,
          columnName: event?.columnName,
        },
      });
    }
  }
  // ✨ NAYA HELPER: Kyunki legend ke paas pehle se dynamic 'color' hai,
  // hume use custom styles ke sath jodna (merge karna) padega
  getLegendItemStyle(itemColor: string) {
    return {
      color: itemColor,
      ...this.legendStyle(), // Parent ki styles yahan merge ho jayengi
    };
  }
}

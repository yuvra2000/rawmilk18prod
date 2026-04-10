import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { ChartConfig } from './models/chart-config.model';
import { ChartService } from './service/chart-service';
import { ThemeService } from '../../services/theme.service';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { CommonModule, NgStyle } from '@angular/common';
import * as echarts from 'echarts';
@Component({
  selector: 'app-reusable-chart',
  standalone: true,
   imports: [NgxEchartsModule, CommonModule, NgStyle],
  templateUrl: './reusable-chart.component.html',
  styleUrl: './reusable-chart.component.scss',
   providers: [
    ChartService,
    { provide: NGX_ECHARTS_CONFIG, useFactory: () => ({ echarts }) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableChartComponent {
  config = input.required<ChartConfig>();
  style = input<Record<string, string>>({ height: '400px' });
  chartOption: ChartService['chartOption'];
   // ✅ ADD: Output for parent component
  chartEvent = output<any>();
  protected themeService = inject(ThemeService);

  constructor(private chartService: ChartService) {
    // Sync the input to the service's state
    this.chartOption = this.chartService.chartOption;
    effect(() => {
        this.chartService.config.set(this.config());
    },{ allowSignalWrites: true });
  }

    // ✅ ADD: Handle native ngx-echarts click event
  onChartClick(event: any): void {
    this.chartEvent.emit({
      type: 'click',
      componentType: event.componentType,
      name: event.name,
      value: event.value,
      dataIndex: event.dataIndex,
      seriesIndex: event.seriesIndex,
      filterCode: event?.data?.filterCode, 
      columnName: event?.data?.columnName
    });
  }
  // Expose the final chart option to the template
}

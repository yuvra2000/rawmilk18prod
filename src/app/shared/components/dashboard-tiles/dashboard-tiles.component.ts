import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-tiles',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './dashboard-tiles.component.html',
  styleUrls: ['./dashboard-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTilesComponent implements OnChanges {
  @Input() tilesData: any;

  tiles: string[] = [];

  chartOptions: any = {};
  countsMap: any = {};
  legendMap: any = {};

  ngOnChanges() {
    if (!this.tilesData) return;

    this.tiles = Object.keys(this.tilesData); // 🔥 FULLY DYNAMIC TILES

    this.tiles.forEach((tile) => {
      this.chartOptions[tile] = this.buildOptions(tile);
      this.countsMap[tile] = this.buildCounts(tile);
      this.legendMap[tile] = this.buildLegend(tile);
    });
  }

  /* LABEL FORMATTER */
  formatLabel(key: string) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase());
  }

  /* CENTER LABEL */
  getCenterLabel(value: number) {
    return {
      show: true,
      position: 'center',
      formatter: `${value}`,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1f3b73',
      silent: true,
    };
  }

  /* PIE CONFIG */
  getPieConfig(data: any[], total: number) {
    return {
      animation: false,
      animationDuration: 0,
      animationDurationUpdate: 0,

      tooltip: {
        trigger: 'item',
        formatter: (p: any) => `<b>${p.name}</b>: ${p.value}`,
      },

      series: [
        {
          type: 'pie',
          radius: ['65%', '95%'],
          avoidLabelOverlap: false,
          label: this.getCenterLabel(total),

          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 3,
          },

          data: data,
        },
      ],
    };
  }

  /* OPTIONS (FULLY DYNAMIC) */
  buildOptions(type: string) {
    const d = this.tilesData?.[type];
    if (!d) return {};

    const entries: any[] = [];

    Object.keys(d).forEach((key) => {
      if (key === 'total') return;

      // Supplier handling
      if (key.startsWith('quantity')) {
        const index = key.replace('quantity', '');
        const nameKey = 'name' + index;

        entries.push({
          name: d[nameKey] || `Item ${index}`,
          value: d[key],
        });
      }

      // Normal numeric keys
      else if (typeof d[key] === 'number') {
        entries.push({
          name: this.formatLabel(key),
          value: d[key],
        });
      }
    });

    const colors = [
      '#2db783',
      '#f08a24',
      '#2f54eb',
      '#d9d9d9',
      '#9254de',
      '#13c2c2',
    ];

    const data = entries.map((e, i) => ({
      ...e,
      itemStyle: { color: colors[i % colors.length] },
    }));

    return this.getPieConfig(data, d.total || 0);
  }

  /* COUNTS (DYNAMIC) */
  buildCounts(type: string) {
    const d = this.tilesData?.[type];
    if (!d) return '';

    const values: number[] = [];

    Object.keys(d).forEach((key) => {
      if (key === 'total') return;

      if (typeof d[key] === 'number') {
        values.push(d[key]);
      }
    });

    return values.join(' / ');
  }

  /* LEGEND (DYNAMIC) */
  buildLegend(type: string) {
    const d = this.tilesData?.[type];
    if (!d) return [];

    const colors = ['green', 'orange', 'blue', 'gray', 'purple', 'cyan'];

    const legends: any[] = [];
    let i = 0;

    Object.keys(d).forEach((key) => {
      if (key === 'total') return;

      if (key.startsWith('quantity')) {
        const index = key.replace('quantity', '');
        const nameKey = 'name' + index;

        legends.push({
          name: d[nameKey] || `Item ${index}`,
          color: colors[i % colors.length],
        });
        i++;
      } else if (typeof d[key] === 'number') {
        legends.push({
          name: this.formatLabel(key),
          color: colors[i % colors.length],
        });
        i++;
      }
    });

    return legends;
  }
}

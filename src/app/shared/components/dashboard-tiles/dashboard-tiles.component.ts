import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
// import { TilesResponse } from '../../../components/rawmilk/trip-dashboard/state-service/config';

import {
  TilesResponse,
  TileItem,
  TILE_UI_CONFIG,
} from '../../../components/rawmilk/trip-dashboard/state-service/config';

@Component({
  selector: 'app-dashboard-tiles',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './dashboard-tiles.component.html',
  styleUrls: ['./dashboard-tiles.component.scss'],
})
export class DashboardTilesComponent implements OnChanges {
  @Input() tilesData!: TilesResponse;

  tiles: string[] = [];
  chartOptions: any = {};
  legendMap: any = {};

  loading = signal(true);

  ngOnChanges() {
    if (!this.tilesData) return;

    this.tiles = Object.keys(this.tilesData);

    this.tiles.forEach((tile) => {
      this.chartOptions[tile] = this.buildOptions(tile);
      this.legendMap[tile] = this.buildLegend(tile);
    });

    this.loading.set(false); // 🔥 auto UI update
  }

  formatLabel(key: string) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase());
  }
  tiletitle(key: string) {
    if (['gps', 'eta'].includes(key.toLowerCase())) {
      return key.toUpperCase(); // ✅ GPS, ETA
    }
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase());
  }

  /* 🔥 MAIN PARSER */
  parseTile(type: string): TileItem[] {
    const d = this.tilesData?.[type];
    if (!d) return [];

    const config = TILE_UI_CONFIG[type] || {};

    const defaultColors = [
      '#31AA87',
      '#E77817',
      '#C7C7CC',
      '#1D4380',
      '#2f54eb',
      '#9254de',
      '#2db783',
      '#f08a24',
    ];

    const colors = config.colors || defaultColors;

    const items: TileItem[] = [];
    let i = 0;

    Object.keys(d).forEach((key) => {
      if (key === 'total') return;

      // ✅ supplier case
      if (key.startsWith('quantity')) {
        const index = key.replace('quantity', '');

        items.push({
          name: d['name' + index] || `Item ${index}`,
          value: d[key],
          color: colors[i++ % colors.length],
        });
      }

      // ✅ normal case (gps, alert, eta)
      else if (typeof d[key] === 'number') {
        items.push({
          name: config.labels?.[key] || this.formatLabel(key),

          value: d[key],
          color: colors[i++ % colors.length],
        });
      }
    });

    return items;
  }

  /* 📊 CHART */
  buildOptions(type: string) {
    const d = this.tilesData?.[type];
    if (!d) return {};

    const items = this.parseTile(type);
    const total = d.total ?? items.reduce((sum, i) => sum + i.value, 0);
    return {
      tooltip: {
        trigger: 'item',
        formatter: (p: any) => `${p.name}: ${p.value}`,
      },

      series: [
        {
          type: 'pie',
          radius: ['65%', '90%'],

          label: {
            show: true,
            position: 'center',
            formatter: `${total || 0}`,
            fontSize: 16,
            fontWeight: 'bold',
          },

          emphasis: {
            scale: true,
            scaleSize: 6,
          },

          data: items.map((i) => ({
            name: i.name,
            value: i.value,
            // itemStyle: { color: i.color },
            itemStyle: {
              color: i.color,
              borderWidth: 2, // 👈 add border thickness
              borderColor: '#fff', // 👈 border color (white looks clean)
            },
          })),
        },
      ],
    };
  }

  buildLegend(type: string) {
    return this.parseTile(type);
  }

  getIcon(tile: string): string {
    const map: any = {
      gps: 'fa-map-marker',
      alert: 'fa-bell',
      eta: 'fa-clock',
      supplier: 'fa-industry',
    };

    return map[tile] || 'fa-circle';
  }

  getIconColor(tile: string): string {
    const map: any = {
      gps: '#31AA87', // blue
      alert: '#E74C3C', // red
      eta: '#F39C12', // orange
      supplier: '#1D4380', // green
    };

    return map[tile] || '#666';
  }
}

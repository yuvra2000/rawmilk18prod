import { Component, Input } from '@angular/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
@Component({
  selector: 'spk-echarts',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './spk-echarts.component.html',
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: echarts }),
    },
  ],
  styleUrl: './spk-echarts.component.scss'
})
export class SpkEchartsComponent {
  @Input('options') chartOption:any;
}

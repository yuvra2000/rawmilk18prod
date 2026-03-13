import { Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'spk-currency-card',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './spk-currency-card.component.html',
  styleUrl: './spk-currency-card.component.scss'
})
export class SpkCurrencyCardComponent {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() percentageChange: string = '';
  @Input() increament: string = '';
  @Input() badge: string = '';
  @Input() value: string = '';
  @Input() Bgcolor: string = '';
  @Input() price: string = '';

  @Input('chartOptions') chartOptions:any;
}

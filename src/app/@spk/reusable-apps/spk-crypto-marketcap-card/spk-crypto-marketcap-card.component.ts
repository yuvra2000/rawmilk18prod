import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SpkApexchartsComponent } from "../../spk-apexcharts/apexcharts.component";

@Component({
  selector: 'spk-crypto-marketcap-card',
  standalone: true,
  imports: [CommonModule, SpkApexchartsComponent],
  templateUrl: './spk-crypto-marketcap-card.component.html',
  styleUrl: './spk-crypto-marketcap-card.component.scss'
})
export class SpkCryptoMarketcapCardComponent {
  @Input() title: string = '';
  @Input() currency: string = '';
  @Input() icon: string = '';
  @Input() change: string = ''; // Percentage change in the value
  @Input() amount: number | any ;
  @Input() amountCurrency: string = '';
  @Input() chartId: string = ''; // ID for the chart div
  @Input('chartOptions') chartOptions:any; // Chart data if needed
  @Input() changeClass: string = '';
  @Input() changeClass1: string = '';
  @Input() iconViewBox: string = '0 0 24 24';  // default viewBox if not passed
  @Input() iconPath: string = '';  // Default path for the icon
  @Input() iconPath1: string = '';  // Default path for the icon

}

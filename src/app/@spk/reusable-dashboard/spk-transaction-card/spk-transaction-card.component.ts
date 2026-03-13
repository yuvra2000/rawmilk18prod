import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SpkApexchartsComponent } from '../../spk-apexcharts/apexcharts.component';

@Component({
  selector: 'spk-transaction-card',
  standalone: true,
  imports: [NgApexchartsModule,CommonModule,SpkApexchartsComponent],
  templateUrl: './spk-transaction-card.component.html',
  styleUrl: './spk-transaction-card.component.scss'
})
export class SpkTransactionCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() badge: string = '';
  @Input() linkText: string = '';
  @Input() textcolor: string = '';
  @Input() svgBg: string = '';
  @Input() Bgcolor: string = '';
  @Input() badgColor: string = '';
  @Input() percentageChange: string = '';
  @Input() direction: string = '';
  @Input() chartOptions: any;

  @Input() icon!: SafeHtml; // Use SafeHtml type for icon

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SpkApexchartsComponent } from '../../spk-apexcharts/apexcharts.component';

@Component({
  selector: 'spk-analytics-card',
  standalone: true,
  imports: [NgApexchartsModule,CommonModule,SpkApexchartsComponent],
  templateUrl: './spk-analytics-card.component.html',
  styleUrl: './spk-analytics-card.component.scss'
})
export class SpkAnalyticsCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() linkText: string = '';
  @Input() textcolor: string = '';
  @Input() Bgcolor: string = '';
  @Input() percentageChange: string = '';
  @Input() direction: string = '';
  @Input() icon!: SafeHtml; // Use SafeHtml type for icon

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  @Input('chartOptions') chartOptions:any;
}

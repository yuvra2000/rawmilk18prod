import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'spk-total-employees-card',
  standalone: true,
  imports: [],
  templateUrl: './spk-total-employees-card.component.html',
  styleUrl: './spk-total-employees-card.component.scss'
})
export class SpkTotalEmployeesCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() trend: string = '';
  @Input() trendIcon: string = '';
  @Input() trendClass: string = '';
  @Input() svgClass: string = '';
  @Input() textClass: string = '';
  @Input() iconSvg!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

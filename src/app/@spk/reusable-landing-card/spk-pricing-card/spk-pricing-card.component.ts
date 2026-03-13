import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-pricing-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-pricing-card.component.html',
  styleUrl: './spk-pricing-card.component.scss'
})
export class SpkPricingCardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() price: string = '';
  @Input() bgTag: string = '';
  @Input() planLabel: string = '';
  @Input() backgroundClass: string = '';
  @Input() borderClass: string = '';
  @Input() buttonClass: string = '';
  @Input() buttonLabel: string = 'Schedule a Demo';
  @Input() iconPaths: Array<{ d: string; opacity?: string }> = [];
  @Input() features: Array<{ name: string; tag?: string }> = [];
}

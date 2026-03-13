import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-services-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-services-card.component.html',
  styleUrl: './spk-services-card.component.scss'
})
export class SpkServicesCardComponent {
  @Input() backgroundClass: string = '';
  @Input() iconPaths: Array<{ d: string; opacity?: string }> = [];
  @Input() title: string = '';
  @Input() description: string = '';
}

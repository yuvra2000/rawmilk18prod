import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-project-card.component.html',
  styleUrl: './spk-project-card.component.scss'
})
export class SpkProjectCardComponent {
  @Input() tasks: Array<{
    label: string;
    count: number;
    percentage: string;
    percentageClass: string;
    itemClass: string;
    iconClass: string;
  }> = [];
}

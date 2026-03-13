import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-jobs-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-jobs-card.component.html',
  styleUrl: './spk-jobs-card.component.scss'
})
export class SpkJobsCardComponent {
  @Input() jobs: Array<{
    icon?: string;
    image?: string;
    iconBackground: string;
    title: string;
    company: string;
  }> = [];

  @Input() showApplyButton: boolean = true;
showIcon: any;
}

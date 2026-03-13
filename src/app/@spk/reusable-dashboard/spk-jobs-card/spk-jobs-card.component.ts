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
  @Input() title: string ='';
  @Input() value: string | number |any;
  @Input() change: string =''; // Example: '+3.32%' or '-0.90%'
  @Input() changeClass: string =''; // Class for change (e.g., 'text-success', 'text-danger')
  @Input() iconPath: string =''; // The SVG path for the icon
  @Input() iconClass: string =''; // The class for the icon background

}

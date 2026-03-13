import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'spk-jobsearch-card',
  standalone: true,
  imports: [CommonModule,NgbTooltipModule],
  templateUrl: './spk-jobsearch-card.component.html',
  styleUrl: './spk-jobsearch-card.component.scss'
})
export class SpkJobsearchCardComponent {
  @Input() jobTitle: string = '';
  @Input() companyName: string = '';
  @Input() salary: string = '';
  @Input() avatarClass: string = '';
  @Input() iconClass: string = '';
  @Input() wishlistIcon: string = '';
  @Input() iconColorClass: string = '';
  @Input() tags: { icon: string, text: string }[] = [];
}

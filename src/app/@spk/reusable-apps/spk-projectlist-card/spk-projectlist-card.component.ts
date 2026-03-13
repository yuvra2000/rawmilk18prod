import { Component, Input } from '@angular/core';
import { SpkDropdownsComponent } from '../../../@spk/reusable-ui-elements/spk-dropdowns/spk-dropdowns.component';

@Component({
  selector: 'spk-projectlist-card',
  standalone: true,
  imports: [SpkDropdownsComponent],
  templateUrl: './spk-projectlist-card.component.html',
  styleUrl: './spk-projectlist-card.component.scss'
})
export class SpkProjectlistCardComponent {
  @Input() badge!: string;
  @Input() badgeClass!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() iconBackground!: string;
  @Input() iconClass!: string;
  @Input() taskTitle!: string;
  @Input() tasksCompleted!: string;
  @Input() taskDetails!: string;
  @Input() avatars: any[] = [];
  @Input() dueDate!: string;
}

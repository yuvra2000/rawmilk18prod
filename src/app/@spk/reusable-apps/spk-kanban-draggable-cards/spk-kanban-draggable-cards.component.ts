import { Component, Input } from '@angular/core';
import { SpkDropdownsComponent } from '../../../@spk/reusable-ui-elements/spk-dropdowns/spk-dropdowns.component';

@Component({
  selector: 'spk-kanban-draggable-cards',
  standalone: true,
  imports: [SpkDropdownsComponent],
  templateUrl: './spk-kanban-draggable-cards.component.html',
  styleUrl: './spk-kanban-draggable-cards.component.scss'
})
export class SpkKanbanDraggableCardsComponent {
  @Input() id!: string; // Card ID
  @Input() badges: string[] = []; // Array of badge labels
  @Input() title!: string; // Title of the card
  @Input() description!: string;// Optional description
  @Input() image?: string; // Optional image URL
  @Input() subTask!: { completed: number; total: number; progress: number }; // Sub-task progress
  @Input() actions: { label: string; icon: string }[] = []; // Action buttons
  @Input() likes!: number; // Number of likes
  @Input() comments!: number; // Number of comments
  @Input() avatars: string[] = []; // List of avatar image URLs
}

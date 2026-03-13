import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'spk-projectoverview-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-projectoverview-card.component.html',
  styleUrl: './spk-projectoverview-card.component.scss'
})
export class SpkProjectoverviewCardComponent {
  @Input() title: string = 'Project Categories';
  @Input() btnBg: string = 'primary';
  @Input() addButton: string = '';
  @Input() bgColor: string = 'success';
  @Input() categories: { name: string; iconClass: string; iconColor: string; cardCount: number; percentage: number; }[] = [];
  @Input() category: boolean = false;
  @Input() goal: boolean = false;
  @Input() items: { label: string; checked: boolean }[] = [];
  @Output() checkboxChange = new EventEmitter<{ label: string; checked: boolean }>();

  onCheckboxChange(item: { label: string; checked: boolean }, event: Event) {
    item.checked = (event.target as HTMLInputElement).checked;
    this.checkboxChange.emit(item);
  }
}

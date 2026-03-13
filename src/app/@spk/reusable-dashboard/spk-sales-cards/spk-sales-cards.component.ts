import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-sales-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-sales-cards.component.html',
  styleUrl: './spk-sales-cards.component.scss'
})
export class SpkSalesCardsComponent {
  @Input() name: string = '';
  @Input() sales: number = 0;
  @Input() change: string = '';
  @Input() trend: 'up' | 'down' = 'up';
}

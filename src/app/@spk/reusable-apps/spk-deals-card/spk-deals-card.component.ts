import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-deals-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-deals-card.component.html',
  styleUrl: './spk-deals-card.component.scss'
})
export class SpkDealsCardComponent {
  @Input() title: string = '';
  @Input() companyName: string = '';
  @Input() amount: string = '';
  @Input() date: string = '';
  @Input() imgSrc: string = '';
  @Input() type: string = '';
}

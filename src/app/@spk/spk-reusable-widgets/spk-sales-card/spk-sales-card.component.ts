import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-sales-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-sales-card.component.html',
  styleUrl: './spk-sales-card.component.scss'
})
export class SpkSalesCardComponent {
  @Input() bgClass: string = ''; // Background class for the avatar container
  @Input() iconClass: string = ''; // Icon class for the avatar
  @Input() title: string = ''; // Title of the card
  @Input() value: string = ''; // Value displayed on the card
  @Input() badgeClass: string = ''; // Badge class for the percentage indicator
  @Input() percentage: string = ''; // Percentage text
  @Input() description: string = ''; // Description below the percentage
  @Input() linkText: string = 'View More'; // Text for the link
  
}

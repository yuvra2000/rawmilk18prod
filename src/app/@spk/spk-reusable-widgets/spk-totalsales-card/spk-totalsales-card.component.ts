import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SpkApexchartsComponent } from '../../spk-apexcharts/apexcharts.component';
import { SpkDropdownsComponent } from '../../reusable-ui-elements/spk-dropdowns/spk-dropdowns.component';

@Component({
  selector: 'spk-totalsales-card',
  standalone: true,
  imports: [CommonModule,SpkApexchartsComponent,SpkDropdownsComponent],
  templateUrl: './spk-totalsales-card.component.html',
  styleUrl: './spk-totalsales-card.component.scss'
})
export class SpkTotalsalesCardComponent {
  @Input() iconClass: string = ''; // Class for the icon
  @Input() avatarBgClass: string = ''; // Background class for the avatar
  @Input() title: string = ''; // Card title
  @Input() value: string = ''; // Main value displayed in the card
  @Input() percentage: string = ''; // Percentage change
  @Input() percentageClass: string = ''; // Class for the percentage badge
  @Input() chartOptions: any; // Chart options for the spk-apexcharts component
  @Input() dropdownOptions: string[] = []; // Dropdown menu options

}

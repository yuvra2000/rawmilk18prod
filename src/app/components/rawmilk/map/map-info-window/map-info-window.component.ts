import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-map-info-window',
  standalone: true,
    imports: [CommonModule], // ✅ ADD THIS
  templateUrl: './map-info-window.component.html',
  styleUrls: ['./map-info-window.component.scss']
})
export class MapInfoWindowComponent {
  @Input() vehicle: any;
  @Input() address: string = '';
}
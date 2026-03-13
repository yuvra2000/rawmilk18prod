import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spk-progress.component.html',
  styleUrl: './spk-progress.component.scss',
})

export class SpkProgressComponent {
  @Input() value: number = 0; // Progress value between 0 and 100
  @Input() size: string = ''; // e.g., 'progress-xs', 'progress-sm', 'progress-lg', 'progress-xl'
  @Input() barClass: string = ''; // Bootstrap classes for colors
  @Input() showLabel: boolean = false; // Whether to show the percentage label
  @Input()  color: any;
  @Input()  title: any;
}

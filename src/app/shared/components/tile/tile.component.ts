import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss'
})
export class TileComponent {
  title = input.required<string>();
  quantity = input.required<number>();
  color = input<string>();
}

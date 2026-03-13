import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-tags',
  standalone: true,
  imports: [],
  templateUrl: './spk-tags.component.html',
  styleUrl: './spk-tags.component.scss'
})
export class SpkTagsComponent {
  @Input() tags: string[] = []; 
}

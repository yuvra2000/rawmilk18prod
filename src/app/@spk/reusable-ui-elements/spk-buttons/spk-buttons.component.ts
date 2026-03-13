import { Component, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'spk-buttons',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './spk-buttons.component.html',
  styleUrl: './spk-buttons.component.scss'
})
export class SpkButtonsComponent {
  @Input() class:string='';
  @Input() disabled:boolean=false;
  @Input() length:boolean=false;


}

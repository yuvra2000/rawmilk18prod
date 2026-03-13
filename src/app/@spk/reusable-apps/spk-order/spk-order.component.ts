import { Component, Input, input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SpkDropdownsComponent } from '../../../@spk/reusable-ui-elements/spk-dropdowns/spk-dropdowns.component';

@Component({
  selector: 'spk-order',
  standalone: true,
  imports: [NgbDropdownModule,SpkDropdownsComponent],
  templateUrl: './spk-order.component.html',
  styleUrl: './spk-order.component.scss'
})
export class SpkOrderComponent {
  @Input() id:string = ''; 
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() date: string = '';
  @Input() status: string = '';
  @Input() statusClass: string = '';
  @Input() customerImage: string = '';
  @Input() customerName: string = '';
  @Input() price: string = '';


}

import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SpkTooltipComponent } from '../../reusable-ui-elements/spk-tooltip/spk-tooltip.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'spk-wishlist',
  standalone: true,
  imports: [CommonModule,NgbTooltipModule,SpkTooltipComponent,RouterModule],
  templateUrl: './spk-wishlist.component.html',
  styleUrl: './spk-wishlist.component.scss'
})
export class SpkWishlistComponent {
  @Input() stockStatus:string = ''; 
  @Input() stockStatusClass:string = ''; 
  @Input() rating:boolean |any; 
  @Input() image:string = '';  
  @Input() brand:string = ''; 
  @Input() price:string = ''; 
  @Input() originalPrice:string = ''; 
  @Input() name:string = ''; 


}

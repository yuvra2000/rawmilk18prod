import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SpkTooltipComponent } from '../../reusable-ui-elements/spk-tooltip/spk-tooltip.component';

@Component({
  selector: 'spk-product-card',
  standalone: true,
  imports: [NgbTooltipModule,RouterModule,CommonModule,SpkTooltipComponent],
  templateUrl: './spk-product-card.component.html',
  styleUrl: './spk-product-card.component.scss'
})
export class SpkProductCardComponent {
  @Input() discount:string = ''; 
  @Input() badgeClass:string = ''; 
  @Input() name:string = ''; 
  @Input() image:string = '';  
  @Input() brand:string = ''; 
  @Input() price:number|any;
  @Input() originalPrice:number|any;
  @Input() rating:number|any;
  @Input() ratingCount:number|any;

  Math = Math;
}

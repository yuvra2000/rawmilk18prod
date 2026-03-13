import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'spk-tooltip',
  standalone: true,
  imports: [NgbModule,CommonModule,RouterModule],
  templateUrl: './spk-tooltip.component.html',
  styleUrl: './spk-tooltip.component.scss'
})
export class SpkTooltipComponent {
  @Input() tooltipClass: string = 'primary';
  @Input() buttonClass: string = 'primary';
  @Input() disabled: string = '';
  @Input() routerLink!: string ;
  @Input() tooltipText: string = '';
  @Input() placement: string = 'auto'; 
  @Input() autoClose: boolean = true; 
  @Input() svgclass: string = '';
  @Input() svgContent: string = '';

  constructor( private sanitizer: DomSanitizer) { }

  getSanitizedSVG(svgContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  } 
}

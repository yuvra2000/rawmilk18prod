import { Component, Input } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SpkDropdownsComponent } from '../../reusable-ui-elements/spk-dropdowns/spk-dropdowns.component';

@Component({
  selector: 'spk-school-card',
  standalone: true,
  imports: [NgbDropdownModule,SpkDropdownsComponent],
  templateUrl: './spk-school-card.component.html',
  styleUrl: './spk-school-card.component.scss'
})
export class SpkSchoolCardComponent {
  @Input() svgBg : string = ''
  @Input() svgColor : string = ''
  @Input() time: string = '';
  @Input() title : string = ''
  @Input() textTitle : string = ''
  @Input() textColor : string = ''
  @Input() changePercentage : string = ''
  @Input() avatarBg : string = ''
  @Input() rightTitle : string = ''
  @Input() value : string = ''
  @Input() cryptotext : string = ''
  @Input() cryptotextBg : string = ''
  @Input() direction : string = ''
  @Input() arrowBg : string = ''
  @Input() bgValue : string = ''
  @Input() description: string = '';
  @Input() date : string = ''
  @Input() dateBg: string = '';
  @Input() buttonType: string = '';
  @Input() icon!: SafeHtml; // Use SafeHtml type for icon
  @Input() imageSrc?: string;
  @Input() fontIcon?: string;
  @Input() shouldShowButton: boolean = false;
  @Input() dropdown: boolean = false;
  @Input() Arrow: boolean = false;
  @Input() button: boolean = false;
  @Input() Verified: boolean = false;
  @Input() cryptovalue: boolean = false;
  @Input() btnTitle: string = '';
  @Input() svgType: string = '';
  @Input() avatarSize: string = '';
  
  constructor(private sanitizer: DomSanitizer) {}
  
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

import { Component, ElementRef, Input } from '@angular/core';
import { SpkApexchartsComponent } from '../../spk-apexcharts/apexcharts.component';
import { CommonModule } from '@angular/common';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'spk-listview-card',
  standalone: true,
  imports: [SpkApexchartsComponent,CommonModule],
  templateUrl: './spk-listview-card.component.html',
  styleUrl: './spk-listview-card.component.scss'
})
export class SpkListviewCardComponent {
  @Input() badgeClass!: string;
  @Input() chartId!: string;
  @Input() chartOptions!: any;
  @Input() title!: string;
  @Input() count!: number;
  @Input() countClass!: string;
  @Input() total!: string;
  @Input() percentage!: number;
  @Input() changeDirection!: string;
  @Input() icon!: SafeHtml; // Use SafeHtml type for icon

  constructor(private sanitizer: DomSanitizer,private elRef: ElementRef) {}

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  ngAfterViewInit(): void {
    this.animateCounter();
  }

  animateCounter(): void {
    const counterElement = this.elRef.nativeElement.querySelector('.count-up');
    if (counterElement) {
      const target = Number(this.count);
      let current = 0;
      const step = Math.ceil(target / 100); // Change "100" to adjust animation speed

      const updateCounter = () => {
        current += step;
        if (current >= target) {
          current = target; // Ensure the count ends exactly at the target
          counterElement.textContent = current.toString();
        } else {
          counterElement.textContent = current.toString();
          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();
    }
  }
}

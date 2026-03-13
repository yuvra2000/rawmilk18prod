import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'spk-glance-cards',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="card custom-card landing-card landingmain border">
      <div class="card-body">
        <div class="mb-4">
          <span [ngClass]="'avatar avatar-xl ' + avatarBackground">
            <span [ngClass]="'avatar avatar-lg ' + avatarIconBackground">
              <i [ngClass]="iconClass + ' fs-25'"></i>
            </span>
          </span>
        </div>
        <h5 class="fw-semibold">{{ title }}</h5>
        <p class="fs-14 text-muted">{{ description }}</p>
        <a href="javascript:void(0);" class="fw-medium text-primary">
          {{ linkText }}
          <i class="ti ti-arrow-narrow-right ms-2 fs-5 align-middle"></i>
        </a>
      </div>
    </div>
 
`,
})
export class SpkGlanceCardsComponent {
  @Input() avatarBackground: string = '';
  @Input() avatarIconBackground: string = '';
  @Input() iconClass: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() linkText: string = 'Read More';
}

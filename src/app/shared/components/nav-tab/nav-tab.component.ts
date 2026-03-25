import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, input, model, signal, Type } from '@angular/core';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
// Interface banaya taaki code clean rahe
export interface TabConfig {
  title: string;
  content?: string;
  component?: Type<any>; // 'any' ki jagah Type<any>
}
@Component({
  selector: 'app-nav-tab',
  standalone: true,
  imports: [NgbNavModule, NgComponentOutlet, NgbModule, CommonModule],
  templateUrl: './nav-tab.component.html',
  styleUrl: './nav-tab.component.scss',
})
export class NavTabComponent {
 tabs = input.required<TabConfig[]>();
 active = model<number>(0);
}

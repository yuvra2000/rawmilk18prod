import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavService } from '../../../core/services/nav';
import { CommonModule } from '@angular/common';
// import { NavService } from '../../services/navservice';

// Define a type for our breadcrumb links for type safety
export interface Breadcrumb {
  label: string;
  url: string;
}
@Component({
  selector: 'app-common-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './common-header.component.html',
  styleUrl: './common-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonHeaderComponent {
  constructor(public navService: NavService) {}
  title = input.required<string>();
  // The breadcrumb trail, also passed in from the parent
  // @Input({ required: true }) breadcrumbs!: Breadcrumb[];
  breadcrumbs = input.required<Breadcrumb[]>();
  userName = localStorage.getItem('UserName') || 'User';
  usertype = localStorage.getItem('usertype') || 'User Type';
  groupType = localStorage.getItem('GroupType') || 'Group Type';
  isFullscreen: boolean = false;
  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
  protected toggleSidebar() {
    this.navService.toggleSidebar();
  }
}

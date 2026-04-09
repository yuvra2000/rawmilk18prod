import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';
import { FooterComponent } from './components/footer/footer.component';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { FullscreenDirective } from './directives/fullscreen.directive';
import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive';
import { SvgReplaceDirective } from './directives/svgReplace.directive';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { DropdownPositionDirective } from './directives/dropdown-position.directive';

@NgModule({
  declarations: [
    PageHeaderComponent,
    SidebarComponent,
    MainLayoutComponent,
    SwitcherComponent,
    HeaderComponent,
    TapToTopComponent,
    FooterComponent,
    SvgReplaceDirective,
    AuthenticationLayoutComponent,
  ],
  exports: [
    PageHeaderComponent,
    MainLayoutComponent,
    SidebarComponent,
    SwitcherComponent,
    HeaderComponent,
    FooterComponent,
    TapToTopComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    OverlayscrollbarsModule,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    FullscreenDirective,
    HoverEffectSidebarDirective,
    DropdownPositionDirective,
  ],
})
export class SharedModule {}

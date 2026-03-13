import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  routerEvents: any[] = [];
  hideHeader: boolean = false;

  constructor(private router: Router) {
   this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.routerEvents = event.url.split('/').filter(e => e != '');
      }
    })
  }
}

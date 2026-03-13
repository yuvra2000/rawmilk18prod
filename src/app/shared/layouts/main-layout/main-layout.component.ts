import { Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { Menu, NavService } from '../../services/navservice';
import { SwitcherService } from '../../../shared/services/switcher.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})

export class MainLayoutComponent {
  private offcanvasService = inject(NgbOffcanvas);
  lastSegment: any;
  public menuItems!: Menu[];
  constructor(
    private router:Router,
    private elementRef: ElementRef,
    public navServices: NavService,
    public SwitcherService: SwitcherService,
    public renderer: Renderer2
  ) {
    this.navServices.items.subscribe((menuItems: any) => {
      this.menuItems = menuItems;
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      window.scrollTo(0, 0);
    });
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (window.innerWidth <= 992) {
      html?.setAttribute('data-toggled', html?.getAttribute('data-toggled') == 'close' ? 'close' : 'close');
    }
  }
  clickOnBody() {
    document.querySelector('#headersearch')?.classList.remove('searchdrop')
    document.querySelector('#cartitemclose')?.classList.remove('show');
    document.querySelector('#header-cart-items-scroll')?.removeAttribute('class');
    document.querySelector('#notificationitemclose')?.classList.remove('show')||document.querySelector('#notificationitemclose')?.classList.remove('show');
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
      this.renderer.removeAttribute(htmlElement, 'data-icon-overlay');

      const navStyle = document.documentElement.getAttribute('data-nav-style');
      
    if (document.documentElement.getAttribute('data-toggled')  == 'icon-text-close') {
      this.renderer.removeAttribute(htmlElement, 'data-icon-text');
    }
    if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal'
            && window.innerWidth > 992) {
            this.closeMenu();
    } else
    if (navStyle === 'menu-click' || navStyle === 'menu-hover' || navStyle === 'icon-click' || navStyle === 'icon-hover') {
      document.querySelector('.double-menu-active')?.setAttribute('style', 'display: none;');
    }   

    const switcher = this.elementRef.nativeElement.querySelector('.switcher');
    if (switcher) {
      this.renderer.removeClass(switcher, 'show');
      document.querySelector('#responsive-overlay')?.classList.add('active');
    } else {
      document.querySelector('#responsive-overlay')?.classList.remove('active');
    }
    const sidebar = this.elementRef.nativeElement.querySelector('.sidebar');
    if (sidebar) {
      this.renderer.removeClass(sidebar, 'show');
    }

    document.querySelector('#responsive-overlay')?.classList.remove('active');
    if (window.innerWidth <= 992) {
      htmlElement?.setAttribute(
        'data-toggled',
        htmlElement?.getAttribute('data-toggled') == 'close' ? 'close' : 'close'
      );
    }
  }

  closeMenu() {
    this.menuItems?.forEach((a: any) => {
      if (this.menuItems) {
        a.active = false;
      }
      a?.children?.forEach((b: any) => {
        if (a.children) {
          b.active = false;
        } 
      });
    });
  }

  layoutClass: string = 'container-fluid'; // Default class

  ngOnInit(): void {
    // Set the initial class based on the current route
    this.updateLayoutClass(this.router.url);

    // Listen for route changes and update the class
    this.router.events.subscribe(() => {
      this.updateLayoutClass(this.router.url);
    });
  }

  private updateLayoutClass(currentRoute: string): void {
    // Replace 'your-component-route' with the actual route of the component
    if (currentRoute === '/pages/terms-conditions') {
      this.layoutClass = 'container'; // Apply 'container' class
    } else {
      this.layoutClass = 'container-fluid'; // Default to 'container-fluid'
    }
  }

}

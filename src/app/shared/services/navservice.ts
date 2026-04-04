import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
// Menu
export interface Menu {
  headTitle?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  title1?: string;
  icon?: string;
  type?: string;
  badgeValue?: string;
  badgeClass?: string;
  badgeText?: string;
  bgshadow?: string;
  active?: boolean;
  selected?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  children2?: Menu[];
  Menusub?: boolean;
  target?: boolean;
  menutype?: string;
  dirchange?: boolean;
  nochild?: any;
  items?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth,
  );

  // Search Box
  public search = false;

  // Language
  public language = false;

  // Mega Menu
  public megaMenu = false;
  public levelMenu = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen = false;
  active: any;

  constructor(private router: Router) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next;
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    // Dashboard
    // { headTitle: 'OVERVIEW' },
    {
      title: 'Dashboards',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M104,216V152h48v64h64V120a8,8,0,0,0-2.34-5.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,120v96Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>`,
      type: 'sub',
      selected: false,
      active: false,
      dirchange: false,
      children: [
        { path: '', title: 'Home', type: 'link', dirchange: false },
        {
          path: 'view-indent',
          title: 'View Indent',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'view-indent-supplier',
          title: 'View Indent (Supplier)',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'Allocate',
          title: 'Allocated Indent',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'Inventory',
          title: 'Inventory',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'leci-dashboard',
          title: 'LECI Dashboard',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'trip-dashboard',
          title: 'Trip Dashboard',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'projection',
          title: 'Projection',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'load-planning',
          title: 'Load Planning',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'document-wallet',
          title: 'Document Wallet',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'dairy/cart-dashboard',
          title: 'Cart Dashboard',
          type: 'link',
          dirchange: false,
        },
      ],
    },
    { headTitle: 'OPERATIONS' },
    {
      title: 'Production Planning',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polygon></svg>`,
      type: 'sub',
      active: false,
      children: [
        {
          path: 'production-planning/dispatch-planning/',
          title: 'Dispatch Planning',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'production-planning/eta-report/',
          title: 'ETA Report',
          type: 'link',
          dirchange: false,
        },
      ],
    },
    {
      headTitle: 'REPORTS',
    },
    {
      title: 'Trip Report',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M104,216V152h48v64h64V120a8,8,0,0,0-2.34-5.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,120v96Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>`,
      type: 'sub',
      selected: false,
      active: false,
      dirchange: false,
      children: [
        {
          path: 'reports/tanker-wise',
          title: 'Tanker Wise',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/indent-wise',
          title: 'Indent Wise',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/mpc-wise',
          title: 'MPC Wise',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/alert-report',
          title: 'Alert Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/travel-report',
          title: 'Travel Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/distance-report',
          title: 'Distance Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/monthly-report',
          title: 'Monthly Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/halt-report',
          title: 'Halt Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/e-lock-report',
          title: 'E-lock Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/lid',
          title: 'Lid Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/leci-report',
          title: 'LECI Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/trip-summary',
          title: 'Trip Summary',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/cart-report',
          title: 'Cart Report',
          type: 'link',
          dirchange: false,
        },
      ],
    },
    {
      title: 'Cart Report',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="80" cy="216" r="16"></circle><circle cx="184" cy="216" r="16"></circle><path d="M42.3,72H221l-25.1,96.3a16,16,0,0,1-15.5,11.7H82.6a16,16,0,0,1-15.5-11.7L36.7,40H16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>`,
      type: 'sub',
      selected: false,
      active: false,
      dirchange: false,
      children: [
        {
          path: 'reports/cart/cart-report',
          title: 'Cart Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/cart/franchise-report',
          title: 'Franchise Report',
          type: 'link',
          dirchange: false,
        },
      ],
    },
  ];

  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}

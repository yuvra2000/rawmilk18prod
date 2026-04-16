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
    const groupId: number = Number(localStorage.getItem('GroupId')); // ✅ DEFINE HERE
    const accounttype: number = Number(localStorage.getItem('AccountType')); // ✅ DEFINE HERE

    this.filterMenuByGroup(groupId,accounttype); // ✅ NOW VALID

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

  // constructor(private router: Router) {
  //   this.setScreenWidth(window.innerWidth);

  //   const groupId: number = Number(localStorage.getItem('groupId')); // ✅ DEFINE HERE

  //   this.filterMenuByGroup(groupId); // ✅ NOW VALID

  //   fromEvent(window, 'resize')
  //     .pipe(debounceTime(500), takeUntil(this.unsubscriber))
  //     .subscribe((evt: any) => {
  //       this.setScreenWidth(evt.target.innerWidth);
  //     });
  // }
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
        { path: 'Home', title: 'Home', type: 'link', dirchange: false },
        { path: 'live', title: 'Live', type: 'link', dirchange: false },
        // nav service added
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
          path: 'remote-lock-unlock',
          title: 'Remote Lock/Unlock',
          type: 'link',
          dirchange: false,
        },
        // {
        //   path: 'Allocate',
        //   title: 'Allocated Indent',
        //   type: 'link',
        //   dirchange: false,
        // },
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
          path: 'trip-dashboard-vlc',
          title: 'Trip Dashboard VLC',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'summary-dashboard',
          title: 'Summary Dashboard',
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
          path: 'cart-dashboard',
          title: 'Cart Dashboard',
          type: 'link',
          dirchange: false,
        },
        // {
        //   path: 'mcc-mapping-info',
        //   title: 'MCC Mapping Info',
        //   type: 'link',
        //   dirchange: false,
        // },
        // {
        //   path: 'agreement-info',
        //   title: 'Agreement Info',
        //   type: 'link',
        //   dirchange: false,
        // },
        // {
        //   path: 'maker-checker',
        //   title: 'Maker Checker',
        //   type: 'link',
        //   dirchange: false,
        // },
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
          path: 'dispatch-planning-report',
          title: 'Dispatch Planning',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'eta-report',
          title: 'ETA Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'summarized-report',
          title: 'Summarized Report',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'blacklist',
          title: 'Blacklist Report',
          type: 'link',
          dirchange: false,
        },
      ],
    },
    {
      title: 'Cart Module',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="80" cy="216" r="16"></circle><circle cx="184" cy="216" r="16"></circle><path d="M42.3,72H221l-25.1,96.3a16,16,0,0,1-15.5,11.7H82.6a16,16,0,0,1-15.5-11.7L36.7,40H16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>`,
      type: 'sub',
      active: false,
      children: [
        {
          path: 'adda',
          title: 'Adda',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'franchise',
          title: 'Franchise',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'franchise-mapping',
          title: 'Franchise Mapping',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'cart-mapping',
          title: 'Cart Mapping',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'cart-timing',
          title: 'Cart Timing',
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
          path: 'reports/lid-report',
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
          title: 'Trip Summary Report',
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
      title: 'Cart Report Exception',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="80" cy="216" r="16"></circle><circle cx="184" cy="216" r="16"></circle><path d="M42.3,72H221l-25.1,96.3a16,16,0,0,1-15.5,11.7H82.6a16,16,0,0,1-15.5-11.7L36.7,40H16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>`,
      type: 'sub',
      selected: false,
      active: false,
      dirchange: false,
      children: [
        {
          path: 'reports/cart-report-exception',
          title: 'Cart Report EX',
          type: 'link',
          dirchange: false,
        },
        {
          path: 'reports/franchise-report',
          title: 'Franchise Report',
          type: 'link',
          dirchange: false,
        },
      ],
    },
  ];

  filterMenuByGroup(groupId: any,accounttype:any) {
    // ✅ If NOT 5839 → show full menu
     // ✅ Apply filter ONLY when BOTH match
  if (!(groupId == 5938 && accounttype == '12')) {
    this.items.next(this.MENUITEMS);
    return;
  }

    // ✅ Allowed paths
    const allowedPaths = [
      'cart-dashboard',
      'reports/cart-report',
      'reports/cart-report-exception',
      'reports/franchise-report',
    ];
    //add  cart report frenchise

    // ✅ Build new menu
    const filteredMenu: Menu[] = [];

    this.MENUITEMS.forEach((menu) => {
      if (menu.children) {
        const filteredChildren = menu.children.filter((child) =>
          allowedPaths.includes(child.path || ''),
        );

        if (filteredChildren.length > 0) {
          filteredMenu.push({
            ...menu,
            children: filteredChildren,
          });
        }
      }
    });

    this.items.next(filteredMenu);
  }

  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}

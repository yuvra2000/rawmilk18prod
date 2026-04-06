import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  TemplateRef,
} from '@angular/core';
import { AppStateService } from '../../services/app-state.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SwitcherComponent } from '../switcher/switcher.component';
import { Menu, NavService } from '../../services/navservice';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarStateService } from '../../services/sidebar-state-service.service';
interface Item {
  id: number;
  name: string;
  type: string;
  title: string;
  // Add other properties as needed
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private modalService = inject(NgbModal);
  UserName: string = localStorage.getItem('UserName') || 'User';
  routerEvents: string[] = [];
  isSideBarOpen: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public elementRef: ElementRef,
    private appStateService: AppStateService,
    public navServices: NavService,
    private sidebarStateService: SidebarStateService,
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // Get the URL before the "?"
        const urlWithoutQuery = event.url.split('?')[0];
        // Split and filter as before
        this.routerEvents = urlWithoutQuery.split('/').filter((e) => e != '');
      }
    });
    this.sidebarStateService.sidebarState$.subscribe((state: boolean) => {
      this.isSideBarOpen = state;
      // this.cdr.detectChanges(); // Optional: if you need to trigger change detection
    });
  }
  isNotifyEmpty: boolean = false;
  isCartEmpty: boolean = false;
  cartItemCount: number = 5;
  notificationCount: number = 15;

  cartItems = [
    {
      id: 'row1',
      brand: 'Puma',
      title: 'Classic tufted leather sofa',
      price: 75,
      originalPrice: 99,
      quantity: 4,
      image: './assets/images/ecommerce/png/1.png',
      avatarClass: 'bg-primary-transparent',
    },
    {
      id: 'row2',
      brand: 'Puma',
      title: 'Polaroid Medium Camera',
      price: 120,
      originalPrice: 149,
      quantity: 12,
      image: './assets/images/ecommerce/png/14.png',
      avatarClass: 'bg-secondary-transparent',
    },
    {
      id: 'row3',
      brand: 'Puma',
      title: 'Creed Aventus Luxury Perfume',
      price: 30,
      originalPrice: 49,
      quantity: 9,
      image: './assets/images/ecommerce/png/33.png',
      avatarClass: 'bg-success-transparent',
    },
    {
      id: 'row4',
      brand: 'Puma',
      title: 'Ethan Allen Wall Clock',
      price: 70,
      originalPrice: 129,
      quantity: 7,
      image: './assets/images/ecommerce/png/34.png',
      avatarClass: 'bg-warning-transparent',
    },
    {
      id: 'row5',
      brand: 'Puma',
      title: 'Louis Vuitton Handbag',
      price: 200,
      originalPrice: 249,
      quantity: 5,
      image: './assets/images/ecommerce/png/31.png',
      avatarClass: 'bg-pink-transparent',
    },
  ];

  handleCardClick(event: MouseEvent) {
    event.stopPropagation();
  }

  removeCart(id: string) {
    const rowElement = document.getElementById(id);
    if (rowElement) {
      rowElement.remove();
    }
    this.cartItemCount--;
    this.isCartEmpty = this.cartItemCount === 0;
  }

  updateQuantity(id: string, change: number) {
    const item = this.cartItems.find((item) => item.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change); // Prevent quantity from being less than 1
    }
  }

  removeNotify(rowId: string) {
    const rowElement = document.getElementById(rowId);
    if (rowElement) {
      rowElement.remove();
    }
    this.notificationCount--;
    this.isNotifyEmpty = this.notificationCount === 0;
  }
  openSm(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
  }

  updateTheme(theme: string) {
    this.appStateService.updateState({ theme, menuColor: theme });
    if (theme == 'light') {
      this.appStateService.updateState({
        theme,
        themeBackground: '',
        headerColor: 'light',
        menuColor: 'light',
      });
      let html = document.querySelector('html');
      html?.style.removeProperty('--body-bg-rgb');
      html?.style.removeProperty('--body-bg-rgb2');
      html?.style.removeProperty('--light-rgb');
      html?.style.removeProperty('--form-control-bg');
      html?.style.removeProperty('--input-border');
      html?.setAttribute('data-toggled', 'close');
      html?.setAttribute(
        'data-toggled',
        window.innerWidth <= 992 ? 'close' : '',
      );
    }
    if (theme == 'dark') {
      this.appStateService.updateState({
        theme,
        themeBackground: '',
        headerColor: 'dark',
        menuColor: 'dark',
      });
      let html = document.querySelector('html');
      html?.style.removeProperty('--body-bg-rgb');
      html?.style.removeProperty('--body-bg-rgb2');
      html?.style.removeProperty('--light-rgb');
      html?.style.removeProperty('--form-control-bg');
      html?.style.removeProperty('--input-border');
      // html?.style.removeProperty('--primary');
      // html?.style.removeProperty('--primary-rgb');

      html?.setAttribute('data-toggled', 'close');
      html?.setAttribute(
        'data-toggled',
        window.innerWidth <= 992 ? 'close' : '',
      );
    }
  }

  localStorageBackUp() {
    let styleId = document.querySelector('#style');

    let html = document.querySelector('html');
    //Theme Color Mode:
    if (localStorage.getItem('zynixHeader') == 'dark') {
      if (localStorage.getItem('zynixdarktheme')) {
        const type: any = localStorage.getItem('zynixdarktheme');
        html?.setAttribute('data-theme-mode', type);
        html?.setAttribute('data-header-styles', type);
        html?.setAttribute('data-menu-styles', type);
      }
      if (localStorage.getItem('zynixdarktheme') == 'light') {
        const type: any = localStorage.getItem('zynixdarktheme');
        html?.setAttribute('data-theme-mode', type);
        html?.setAttribute('data-header-styles', type);
        html?.setAttribute('data-menu-styles', type);
      }
    }
  }

  togglesidebar() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (html?.getAttribute('data-toggled') == 'true') {
      document.querySelector('html')?.getAttribute('data-toggled') ==
        'icon-overlay-close';
    } else if (html?.getAttribute('data-nav-style') == 'menu-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-click-closed'
          ? ''
          : 'menu-click-closed',
      );
    } else if (html?.getAttribute('data-nav-style') == 'menu-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-hover-closed'
          ? ''
          : 'menu-hover-closed',
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-click-closed'
          ? ''
          : 'icon-click-closed',
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-hover-closed'
          ? ''
          : 'icon-hover-closed',
      );
    } else if (html?.getAttribute('data-vertical-style') == 'overlay') {
      html?.setAttribute('data-vertical-style', 'overlay');
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-overlay-close'
          ? ''
          : 'icon-overlay-close',
      );
    } else if (html?.getAttribute('data-vertical-style') == 'overlay') {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
            .querySelector('html')
            ?.setAttribute('data-toggled', 'icon-overlay-close');
    } else if (html?.getAttribute('data-vertical-style') == 'closed') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close-menu-close'
          ? ''
          : 'close-menu-close',
      );
    } else if (html?.getAttribute('data-vertical-style') == 'icontext') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-text-close'
          ? ''
          : 'icon-text-close',
      );
    } else if (html?.getAttribute('data-vertical-style') == 'detached') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'detached-close'
          ? ''
          : 'detached-close',
      );
    } else if (html?.getAttribute('data-vertical-style') == 'doublemenu') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'double-menu-close' &&
          document
            .querySelector('.slide.open')
            ?.classList.contains('has-sub') &&
          document.querySelector('.double-menu-active')
          ? 'double-menu-open'
          : 'double-menu-close',
      );
    }

    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'open' ? 'close' : 'open',
      );
    }
  }
  isFullscreen: boolean = false;
  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  private offcanvasService = inject(NgbOffcanvas);
  toggleSwitcher() {
    this.offcanvasService.open(SwitcherComponent, {
      position: 'end',
      scroll: true,
    });
  }

  // Search
  public menuItems!: Menu[];
  public items!: Menu[];
  public text!: string;
  public SearchResultEmpty: boolean = false;
  selectedItem: string | null = 'selectedItem';

  ngOnInit(): void {
    const storedSelectedItem = localStorage.getItem('selectedItem');
    // this.updateSelectedItem();
    // If there's no selected item stored, set a default one
    if (!storedSelectedItem) {
      this.selectedItem = 'Sales Dashboard'; // You can set any default item here
      localStorage.setItem('selectedItem', this.selectedItem);
    } else {
      this.selectedItem = storedSelectedItem;
    }
    this.navServices.items.subscribe((menuItems) => {
      this.items = menuItems;
    });
    // To clear and close the search field by clicking on body
    document.querySelector('.main-content')?.addEventListener('click', () => {
      this.clearSearch();
    });
    this.text = '';
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSelectedItem();
      });
  }

  private updateSelectedItem() {
    const dashboard = this.activatedRoute.snapshot.firstChild?.url[0]?.path;
    this.selectedItem = dashboard
      ? dashboard.charAt(0).toUpperCase() + dashboard.slice(1) + ' Dashboard'
      : this.selectedItem;
  }
  ngOnDestroy(): void {
    const windowObject: any = window;
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;

    window.addEventListener('resize', () => {
      if (localStorage.getItem('zynixverticalstyles') != 'icon-text-close') {
        if (windowObject.innerWidth <= '991') {
          html?.setAttribute('data-toggled', 'open');
        } else {
          if (!(localStorage.getItem('zynixverticalstyles') == 'doublemenu')) {
            html?.removeAttribute('data-toggled');
          }
        }
      } else {
        document
          .querySelector('html')
          ?.setAttribute('data-toggled', 'icon-text-close');
      }
    });
  }
  Search(searchText: string) {
    if (!searchText) return (this.menuItems = []);
    // items array which stores the elements
    const items: Item[] = [];
    // Converting the text to lower case by using toLowerCase() and trim() used to remove the spaces from starting and ending
    searchText = searchText.toLowerCase().trim();
    this.items.filter((menuItems: Menu) => {
      // checking whether menuItems having title property, if there was no title property it will return
      if (!menuItems?.title) return false;
      //  checking wheteher menuitems type is text or string and checking the titles of menuitems
      if (
        menuItems.type === 'link' &&
        menuItems.title.toLowerCase().includes(searchText)
      ) {
        // Converting the menuitems title to lowercase and checking whether title is starting with same text of searchText
        if (menuItems.title.toLowerCase().startsWith(searchText)) {
          // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(menuItems))
          // If both are matching then the code is pushed to items array
          items.push(menuItems as Item);
        }
      }
      //  checking whether the menuItems having children property or not if there was no children the return
      if (!menuItems.children) return false;
      menuItems.children.filter((subItems: Menu) => {
        if (!subItems?.title) return false;
        if (
          subItems.type === 'link' &&
          subItems.title.toLowerCase().includes(searchText)
        ) {
          if (subItems.title.toLowerCase().startsWith(searchText)) {
            // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subItems))
            items.push(subItems as Item);
          }
        }
        if (!subItems.children) return false;
        subItems.children.filter((subSubItems: Menu) => {
          if (subSubItems.title?.toLowerCase().includes(searchText)) {
            if (subSubItems.title.toLowerCase().startsWith(searchText)) {
              // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subSubItems))
              items.push(subSubItems as Item);
            }
          }
        });
        return true;
      });
      return (this.menuItems = items);
    });
    // Used to show the No search result found box if the length of the items is 0
    if (!items.length) {
      this.SearchResultEmpty = true;
    } else {
      this.SearchResultEmpty = false;
    }
    return true;
  }
  SearchModal(SearchModal: any) {
    this.modalService.open(SearchModal);
  }
  //  Used to clear previous search result
  clearSearch() {
    const headerSearch = document.querySelector('.header-search');
    if (headerSearch) {
      headerSearch.classList.remove('searchdrop');
    }
    this.text = '';
    this.menuItems = [];
    this.SearchResultEmpty = false;
    return (this.text, this.menuItems);
  }
  SearchHeader() {
    document.querySelector('.header-search')?.classList.toggle('searchdrop');
  }
  isInputFocused: boolean = false;

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    this.isInputFocused = false;
  }
  formatTitle(value: string): string {
    // debugger;
    if (!value) return '';
    return value
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

// src/app/core/services/nav.service.ts
import {
  Injectable,
  OnDestroy,
  effect,
  inject,
  signal,
  computed,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from '../services/storage'; // Ensure this path is correct
// import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faChartBar,
  faPhone,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../shared/services/auth.service';

// --- TYPE DEFINITIONS for better code quality ---
export interface Menu {
  path?: string;
  title?: string;
  icon?: any;
  type?: 'link' | 'sub';
  isOpen?: boolean;
  children?: Menu[];
  tab?: string; // Added for completeness from your pages
  active?: boolean;
  selected?: boolean;
  dirchange?: boolean;
  isChildActive?: boolean;
}

interface AccessPage {
  name: string;
  title: string;
  tab?: string;
}

interface AccessMenu {
  Dashboard?: AccessPage[];
  Report?: AccessPage[];
  CallCenter?: AccessPage[];
  Manage?: AccessPage[];
}

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  // --- DEPENDENCY INJECTION ---
  private router = inject(Router);
  private storageService = inject(StorageService);
  private authService = inject(AuthService);

  // --- PRIVATE, WRITABLE STATE SIGNALS ---
  private _isSidebarCollapsed = signal(window.innerWidth < 991);
  private _menuItems = signal<Menu[]>([]);

  // --- OPTIMIZATION: Computed for memoized accountData (recomputes only on storage change) ---
  private accountData = computed(() => {
    const raw = this.getStorageItem('AccountData');
    return typeof raw === 'string' ? JSON.parse(raw) : raw || {};
  });

  // --- PUBLIC, READ-ONLY SIGNALS FOR CONSUMERS ---
  public readonly isSidebarCollapsed = this._isSidebarCollapsed.asReadonly();
  public readonly menuItems = this._menuItems.asReadonly();

  constructor() {
    // --- EVENT LISTENERS (Modern, Clean, Leak-Proof) ---
    // 1. Router events for active states and auto-collapse
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntilDestroyed(),
      )
      .subscribe(({ url }) => {
        this.updateSubMenuStateForUrl(url);
        if (window.innerWidth < 991) {
          this.collapseSidebar();
        }
      });

    // 2. Debounced window resize
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntilDestroyed())
      .subscribe(() => this.onResize());

    // 3. Effect for storage reactivity (runs only on storageKeys() changes)
    effect(
      () => {
        console.log('navHit');

        this.storageService.storageKeys(); // Dependency trigger
        this.buildMenuFromStorage(); // Rebuild menu
      },
      { allowSignalWrites: true },
    );
  }

  ngOnDestroy(): void {
    // takeUntilDestroyed handles all—empty for clarity
  }

  // --- PUBLIC API / ACTIONS ---
  public toggleSidebar(): void {
    this._isSidebarCollapsed.update((val) => !val);
  }

  public collapseSidebar(): void {
    this._isSidebarCollapsed.set(true);
  }

  public toggleSubMenu(clickedItem: Menu): void {
    this._menuItems.update((items) =>
      items.map((item) => {
        if (item.type !== 'sub') return item;
        // Toggle clicked, close others (immutable)
        const isOpen = item === clickedItem ? !(item.isOpen ?? false) : false;
        return { ...item, isOpen };
      }),
    );
  }

  // --- PRIVATE LOGIC ---
  private onResize(): void {
    this._isSidebarCollapsed.set(window.innerWidth < 991);
  }

  private buildMenuFromStorage(): void {
    const accessMenu =
      this.storageService.getItem<AccessMenu>('AccessMenu') || {};
    const builtMenu: Menu[] = [];

    // Dashboard: No section prefix
    if (accessMenu.Dashboard?.length) {
      builtMenu.push({
        title: 'Dashboard',
        icon: faHome,
        type: 'sub' as const,
        children: this.generateChildrenItems(accessMenu.Dashboard), // Empty prefix
      });
    }

    // Reports: Add 'Report' prefix
    if (accessMenu.Report?.length) {
      builtMenu.push({
        title: 'Reports',
        icon: faChartBar,
        type: 'sub' as const,
        children: this.generateChildrenItems(accessMenu.Report, 'Report'), // 'Report' prefix
      });
    }
    if (accessMenu?.CallCenter?.length) {
      builtMenu.push({
        title: 'CallCenter',
        icon: faPhone,
        type: 'sub' as const,
        children: this.generateChildrenItemsForCallcenter(
          accessMenu.CallCenter,
          'CallCenter',
        ), // 'Report' prefix
      });
    }
    if (accessMenu?.Manage?.length) {
      builtMenu.push({
        title: 'Manage',
        icon: faCogs, // FontAwesome se faCogs (ya koi aur suitable icon) import kar lein
        type: 'sub' as const,
        children: this.generateChildrenItemsForCallcenter(
          accessMenu.Manage,
          'Manage',
        ),
      });
    }

    this._menuItems.set(builtMenu);
    this.updateSubMenuStateForUrl(this.router.url);
  }

  private updateSubMenuStateForUrl(url: string): void {
    this._menuItems.update((items) =>
      items.map((parent) => {
        if (parent.type !== 'sub' || !parent.children) return parent;
        const isChildActive = parent.children.some(
          (child) => child.path && url.includes(child.path),
        );
        return {
          ...parent,
          // Auto-open the menu if a child is active,
          // but respect manual close if it was already open.
          isOpen: isChildActive ? true : parent.isOpen,
          isChildActive, // ✅ NEW: Track for persistent styling
        };
      }),
    );
  }

  // --- FLEXIBLE PATH GENERATOR: Reusable, Pure Function ---
  private generateChildrenItems(
    pages: AccessPage[] = [],
    sectionPrefix: string = '', // e.g., '' for Dashboard, 'Report' for Reports
  ): Menu[] {
    if (!pages || !Array.isArray(pages)) {
      console.warn('Pages is undefined or not an array—returning empty menu.');
      return [];
    }

    const accountData = this.accountData(); // Memoized!
    const excludeTitles: string[] = []; // Configurable—inject via token for reusability

    return pages
      .filter((page) => !excludeTitles.includes(page.title))
      .map((page) => {
        const path = this.generatePath(accountData, sectionPrefix, page.name);
        return {
          path,
          tab: page.tab || '',
          title: page.title,
          type: 'link' as const,
          active: false,
          selected: false,
          dirchange: false,
        };
      });
  }

  // --- PURE HELPER: Extensible Path Builder (Future: Make Injectable) ---
  private generatePath(
    accountData: any,
    sectionPrefix: string,
    pageName: string,
  ): string {
    const basePath = `/cv/${accountData?.Class || ''}`;
    const routesSegment = accountData?.Routes ? `/${accountData.Routes}` : '';
    const sectionSegment = sectionPrefix ? `/${sectionPrefix}` : '';
    return `${basePath}${routesSegment}${sectionSegment}/${pageName}`;
  }

  // --- UPDATED: Parse JSON for Object Safety ---
  private getStorageItem(key: string): any {
    try {
      const stored: any =
        this.storageService?.getItem(key) || localStorage.getItem(key) || '';
      console.log(stored, 'stored');

      return stored || null; // Parse string to object
    } catch (error) {
      console.error(`Error parsing ${key} from storage:`, error);
      return null;
    }
  }
  // --- NEW METHOD FOR CALLCENTER MENU GENERATION ---
  private generateChildrenItemsForCallcenter(
    pages: AccessPage[] = [],
    sectionPrefix: string = '', // e.g., '' for Dashboard, 'Report' for Reports
  ): Menu[] {
    if (!pages || !Array.isArray(pages)) {
      console.warn('Pages is undefined or not an array—returning empty menu.');
      return [];
    }

    const accountData = this.accountData(); // Memoized!
    const excludeTitles: string[] = []; // Configurable—inject via token for reusability

    return pages
      .filter((page) => !excludeTitles.includes(page.title))
      .map((page) => {
        const path = this.generatePathForCallcenter(
          accountData,
          sectionPrefix,
          page.name,
        );
        return {
          path,
          tab: page.tab || '',
          title: page.title,
          type: 'link' as const,
          active: false,
          selected: false,
          dirchange: false,
        };
      });
  }
  private generatePathForCallcenter(
    accountData: any,
    sectionPrefix: string,
    pageName: string,
  ): string {
    const path = this.getPathValue(pageName);
    const basePath = `/cv/${accountData?.Class || ''}`;
    const routesSegment = accountData?.Routes ? `/${accountData.Routes}` : '';
    const sectionSegment = sectionPrefix ? `/${sectionPrefix}` : '';
    return `${basePath}${routesSegment}/${path}`;
  }
  getPathValue(url: any) {
    const params = new URL(url).searchParams;
    return params.get('path');
  }
}

import {
  NavTabComponent,
  TabConfig,
} from '../components/nav-tab/nav-tab.component';
// services/universal-modal.service.ts
import {
  Injectable,
  isSignal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Type } from '@angular/core';
import {
  FormModalComponent,
  FormModalConfig,
} from '../components/reusable-modal/shared/form-modal/form-modal.component';
import {
  GridModalComponent,
  GridModalConfig,
} from '../components/reusable-modal/shared/grid-modal/grid-modal.component';
import {
  MapModalComponent,
  MapModalData,
} from '../components/google-map-viewer/map-modal';
import { NavTabsModalComponent } from '../components/reusable-modal/shared/nav-tab-modal/nav-tab-modal.component';
import { AdvancedGridComponent } from '../components/ag-grid/ag-grid/ag-grid.component';

export interface ModalData {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  backdrop?: boolean | 'static';
  centered?: boolean;
  [key: string]: any; // Allow any additional data
}

export interface NavTabsModalData extends ModalData {
  tabList: TabConfig[];
  activeTab?: number;
}
@Injectable({
  providedIn: 'root',
})
export class UniversalModalService {
  constructor(private modalService: NgbModal) {}

  /**
   * Open any component as modal content
   * @param component - The component to display
   * @param data - Data to pass to the component
   * @param options - Modal configuration options
   * @returns Promise that resolves with result or rejects if dismissed
   */
  // open<T, D extends ModalData = ModalData, R = any>(
  //   component: Type<T>,
  //   data?: D,
  //   options?: NgbModalOptions
  // ): Promise<R> {
  //   const modalRef = this.modalService.open(component, {
  //     backdrop: data?.backdrop !== false ? 'static' : false,
  //     centered: data?.centered !== false,
  //     size: data?.size || 'md',
  //     scrollable: false,
  //     ...options
  //   });

  //   // Pass all data to the component instance
  //   if (data) {
  //     Object.assign(modalRef.componentInstance, data);
  //   }

  //   return modalRef.result;
  // }
  open<T, D extends ModalData = ModalData, R = any>(
    component: Type<T>,
    data?: D,
    options?: NgbModalOptions,
  ): Promise<R> {
    const modalRef = this.modalService.open(component, {
      backdrop: data?.backdrop !== false ? 'static' : false,
      centered: data?.centered !== false,
      size: data?.size || 'md',
      scrollable: true, // Allow scrolling for large content
      ...options,
    });

    // Smart signal-aware injection
    if (data) {
      const instance = modalRef.componentInstance as any;

      Object.entries(data).forEach(([key, value]) => {
        const prop = instance[key];
        if (prop && isSignal(prop)) {
          // Writable signal detected → update reactively
          try {
            (prop as WritableSignal<any>).set(value);
          } catch {
            // Fallback: direct assignment (backward compatible)
            instance[key] = value;
          }
        } else {
          // Fallback: direct assignment (backward compatible)
          instance[key] = value;
        }
      });
    }

    return modalRef.result;
  }

  /**
   * ADD THIS NEW METHOD
   * Opens an <ng-template> as modal content.
   * @param templateRef - The TemplateRef to display.
   * @param options - Standard NgbModalOptions.
   * @returns A promise that resolves when the modal is closed.
   */
  openTemplate<R = any>(
    templateRef: TemplateRef<any>,
    options?: NgbModalOptions,
  ): Promise<R> {
    // Note: Data is not passed here because the template uses the context
    // of the component where it is defined.
    return this.modalService.open(templateRef, {
      scrollable: true,
      ...options,
    }).result;
  }

  public openForm(config: FormModalConfig): Promise<any> {
    const options: NgbModalOptions = {
      centered: true,
      size: config.size || 'md',
      backdrop: 'static',
      keyboard: false,
    };

    const modalRef = this.modalService.open(FormModalComponent, options);

    // ✅ Set via signal for reactivity (post-instantiation safe)
    (modalRef.componentInstance as FormModalComponent).config.set(config);

    return modalRef.result;
  }

  public openMapModal(config: MapModalData): Promise<any> {
    const options: NgbModalOptions = {
      centered: true,
      size: config.size || 'md',
      backdrop: 'static',
      keyboard: false,
    };

    const modalRef = this.modalService.open(MapModalComponent, options);

    // ✅ Set via signal for reactivity (post-instantiation safe)
    (modalRef.componentInstance as MapModalComponent).config.set(config);

    return modalRef.result;
  }

  public openGridModal(config: GridModalConfig): Promise<any> {
    const options: NgbModalOptions = {
      centered: true,
      size: config.size || 'lg',
      backdrop: 'static',
      keyboard: false,
    };

    const modalRef = this.modalService.open(GridModalComponent, options);

    // ✅ Set via signal for reactivity (post-instantiation safe)
    (modalRef.componentInstance as GridModalComponent).config.set(config);

    return modalRef.result;
  }

  public openNavTabsModal<R = any>(
    data: NavTabsModalData,
    options?: NgbModalOptions,
  ): Promise<R> {
    const modalRef = this.modalService.open(NavTabsModalComponent, {
      backdrop: data?.backdrop !== false ? 'static' : false,
      centered: data?.centered !== false,
      size: data?.size || 'lg',
      scrollable: true,
      ...options,
    });

    const instance = modalRef.componentInstance as any;

    // ✅ Map tabList to tabs signal
    if (isSignal(instance.tabs)) {
      (instance.tabs as WritableSignal<any>).set(data.tabList);
      instance.modalTitle.set(data.title || '');
    } else {
      instance.tabs = data.tabList;
    }

    return modalRef.result;
  }

  // public closeAll() {
  //   this.modalService.dismissAll();
  // }

  openSimpleMapModal(data?: {
    center?: { lat: number; lng: number };
    zoom?: number;
    markers?: any[];
    title?: string;
  }) {
    const modalRef = this.modalService.open(MapModalComponent, {
      centered: true,
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });

    const instance = modalRef.componentInstance as any;

    // pass data directly (NO SIGNAL COMPLEXITY)
    instance.center = data?.center || { lat: 26.8467, lng: 80.9462 };
    instance.zoom = data?.zoom || 8;
    instance.markers = data?.markers || [];
    instance.title = data?.title || 'Vehicle Map';

    return modalRef;
  }
}

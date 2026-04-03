import {
  Component,
  viewChild,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  TemplateRef,
  Signal,
  input,
  effect,
  output,
  ViewChild,
} from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FieldConfig,
  FilterFormComponent,
} from '../../../filter-form/filter-form.component';
import { ReusableModalComponent } from '../../reusable-modal.component';
import { CopyUrlComponent } from '../../../copy-url/copy-url.component';
import { AlertService } from '../../../../services/alert.service';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../ag-grid/ag-grid/ag-grid.component';
import { GoogleMapViewerComponent } from '../../../google-map-viewer/google-map-viewer.component';

import { MapFormService } from './MapForm.services';
import { MediaViewerComponent } from '../media-viewer.component';
export type MapSelectionEvent =
  | { type: 'marker'; position: { lat: number; lng: number } }
  | { type: 'circle'; center: { lat: number; lng: number }; radius: number }
  | { type: 'polygon'; paths: { lat: number; lng: number }[] }
  | {
      type: 'rectangle';
      bounds: { south: number; west: number; north: number; east: number };
    };
export type DrawingTool = 'marker' | 'circle' | 'polygon' | 'rectangle';
export interface FooterConfig {
  showFooter?: boolean;
  saveText?: string;
  saveIcon?: string;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  cancelText?: string;
  saveButtonClass?: string;
  cancelButtonClass?: string;
  cancelIcon?: string;
  // Future footer properties go here...
}
export interface FormModalConfig {
  title: string;
  subtitle?: string;
  fields?: Signal<FieldConfig[]> | FieldConfig[];
  initialData?: Signal<any> | any;
  buttonName?: Signal<string> | string;
  mode: 'form' | 'link' | 'table' | 'template' | 'form-table';
  map?: boolean;
  allowedDrawingTools?: DrawingTool[];
  onMapSelect?: (event: MapSelectionEvent, allFormData?: any) => void;
  fetchFn?: (data: any) => Promise<any>; // Optional async function to fetch data
  fetchKey?: string; // Key to store the fetched result under (e.g., 'linkToCopy', 'dropdownOptions')
  linkToCopy?: string;
  onSave?: (formData: any, fetchedData?: any) => Promise<any>;
  onFieldChange?: (
    event: { controlName: string; value: any; form?: any },
    allFormData?: any,
  ) => void;

  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  showValidationSummary?: boolean;
  dependentDataMap?: any;
  dependentDataPair?: any;
  resetOnSuccess?: boolean;
  staticContentTpl?: Signal<TemplateRef<any> | undefined>;
  layout?:
    | 'form-only'
    | 'static-left'
    | 'static-right'
    | 'static-top'
    | 'static-bottom';
  // ✅ ADD GRID SPECIFIC CONFIG
  gridConfig?: GridConfig;
  rowData?: Signal<any[]> | any[]; // Use this if data is static, otherwise use fetchFn
  gridLeftSlotTpl?: Signal<TemplateRef<any> | null>;
  onGridSelection?: (selectedRows: any[]) => void;
  filterButtonClass?: string;
  showFooter?: boolean;
  mapLayout?: 'top' | 'bottom' | 'left' | 'right'; // ✅ Added mapLayout
  initialDrawingData?: any[];
  // For Media Viewer
  showMedia?: boolean;
  mediaUrl?: Signal<string | null> | string | null; // Signal handle karne ke liye
  isFetching?: boolean;
  mediaLayout?: 'left' | 'right' | 'top' | 'bottom';
  mediaConfig?: {
    allowZoom?: boolean;
    allowRotate?: boolean;
    allowDownload?: boolean;
    allowReset?: boolean;
  };
  // ✅ NEW: Auto-Filter feature ko On/Off karne ke liye (Default false rahega)
  enableGridFilter?: boolean;
  // ✅ NEW: Form control name aur Grid column name ki mapping ke liye
  gridFilterMapping?: Record<string, string>;
  footerConfig?: FooterConfig; //footer config
  showFormArrayButtons?: boolean; // For showing add/remove buttons in form arrays
}
@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [
    ReusableModalComponent,
    FilterFormComponent,
    CopyUrlComponent,
    NgTemplateOutlet,
    AdvancedGridComponent,
    GoogleMapViewerComponent,
    MediaViewerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-base-modal
      [title]="config()?.title || 'Loading...'"
      [subtitle]="config()?.subtitle || ''"
      [showSaveButton]="config()?.showCloseButton || true"
      [saveDisabled]="saveDisabled()"
      [showCloseButton]="config()?.showCloseButton ?? true"
      [showFooter]="config()?.showFooter"
      [isSaving]="isSaving()"
      [saveText]="resolvedButtonName() || 'submit'"
      [onSaveAction]="handleSave.bind(this)"
      bodyClass="form-modal-body"
      bodyHeight="fit-content"
      (keydown.escape)="activeModal.dismiss()"
      (keydown.enter)="config()?.mode === 'link' && handleSave()"
      [showFooter]="resolvedFooter()?.showFooter"
      [showSaveButton]="resolvedFooter()?.showCloseButton || true"
      [showCloseButton]="resolvedFooter()?.showCloseButton ?? true"
      [saveText]="resolvedFooter()?.saveText ?? ''"
      [saveIcon]="resolvedFooter()?.saveIcon ?? ''"
      [saveButtonClass]="
        resolvedFooter()?.saveButtonClass ?? 'btn reusable-save-btn'
      "
      [cancelButtonClass]="
        resolvedFooter()?.cancelButtonClass ?? 'btn reusable-close-btn'
      "
      ;
      [cancelIcon]="resolvedFooter()?.cancelIcon ?? 'Cancel'"
    >
      @defer (on immediate) {
        @if (config()) {
          <div class="modal-layout-wrapper" [class]="layoutClass()">
            @if (config()!.staticContentTpl) {
              <div class="static-content">
                <ng-container
                  [ngTemplateOutlet]="config()!.staticContentTpl!() ?? null"
                >
                </ng-container>
              </div>
            }
            <div class="dynamic-content">
              @if (
                config()!.mode === 'form' || config()?.mode === 'form-table'
              ) {
                @if (config()?.map && config()?.mapLayout === 'top') {
                  <ng-container [ngTemplateOutlet]="mapTemplate"></ng-container>
                }

                <div
                  class="form-map-container"
                  [class.side-by-side]="
                    config()?.mapLayout === 'left' ||
                    config()?.mapLayout === 'right'
                  "
                  [class.reverse-row]="config()?.mapLayout === 'left'"
                >
                  <div class="form-section">
                    <filter-form
                      #dynamicForm
                      [dynamicFields]="resolvedFields()"
                      [initialData]="resolvedInitialData() || {}"
                      [containerClass]="'col-lg-12 col-12'"
                      [buttonName]="resolvedButtonName() || 'Submit'"
                      (formSubmit)="onFormSubmit($event)"
                      (controlValueChange)="onControlValueChange($event)"
                      [dependentDataMap]="config()?.dependentDataMap"
                      [dependentPairs]="config()?.dependentDataPair"
                      [btnClass]="config()?.filterButtonClass ?? 'mt-2'"
                      [showButtons]="config()?.showFormArrayButtons ?? true"
                    >
                    </filter-form>
                  </div>
                  <!-- // For Media Viewer  -->
                  @if (config()?.showMedia) {
                    <div
                      class="media-section"
                      style="flex: 1.5; min-width: 300px;"
                    >
                      <app-media-viewer
                        [url]="resolvedMediaUrl()"
                        [allowZoom]="
                          safeConfig()?.mediaConfig?.allowZoom ?? true
                        "
                        [allowRotate]="
                          safeConfig()?.mediaConfig?.allowRotate ?? true
                        "
                        [allowDownload]="
                          safeConfig()?.mediaConfig?.allowDownload ?? true
                        "
                      >
                      </app-media-viewer>
                    </div>
                  }
                  @if (
                    config()?.map &&
                    (config()?.mapLayout === 'left' ||
                      config()?.mapLayout === 'right')
                  ) {
                    <div class="map-side-section">
                      <ng-container
                        [ngTemplateOutlet]="mapTemplate"
                      ></ng-container>
                    </div>
                  }
                </div>

                @if (
                  config()?.map &&
                  (!config()?.mapLayout || config()?.mapLayout === 'bottom')
                ) {
                  <ng-container [ngTemplateOutlet]="mapTemplate"></ng-container>
                }

                <!-- @if (config()?.map) {
            <div  class="" style="height: 400px; margin-top: 15px;">
          
             <app-google-map-viewer
            #mapViewer
            [center]="center()"
            [markers]="markers()" 
            [zoom]="14"
            [enableDrawing]="true"
            (shapeCreated)="onLocationSelected($event)"
            [allowedDrawingTools]="config()?.allowedDrawingTools || ['marker', 'circle', 'polygon', 'rectangle']"
          >
        </app-google-map-viewer>
              </div>
          } -->
              } @else if (config()!.mode === 'link') {
                @if (isLoading()) {
                  <div class="link-loading py-3">
                    <div
                      class="spinner-border spinner-border-sm"
                      role="status"
                    ></div>
                    <span> Fetching link...</span>
                  </div>
                } @else {
                  <app-copy-url
                    [url]="
                      config()!.linkToCopy ||
                      fetchedData()?.[config()!.fetchKey || 'data'] ||
                      ''
                    "
                  ></app-copy-url>
                }
              }
              @if (
                config()!.mode === 'table' || config()?.mode === 'form-table'
              ) {
                @if (isLoading()) {
                  <div
                    class="d-flex justify-content-center align-items-center p-5"
                  >
                    <div
                      class="spinner-border text-primary"
                      role="status"
                    ></div>
                    <span class="ms-2">Loading data...</span>
                  </div>
                } @else {
                  <app-advanced-grid
                    [rowData]="
                      fetchedData()?.[config()!.fetchKey || 'data'] ||
                      resolvedRowData() ||
                      []
                    "
                    [config]="config()!.gridConfig!"
                    [loadingRowData]="isGridLoading()"
                    (selectionChanged)="config()?.onGridSelection?.($event)"
                    #modalGrid
                  >
                    @if (config()?.gridLeftSlotTpl?.(); as leftTemplate) {
                      <div slot="left" class="d-flex gap-2 align-items-center">
                        <ng-container
                          *ngTemplateOutlet="leftTemplate"
                        ></ng-container>
                      </div>
                    }
                  </app-advanced-grid>
                }
              }
            </div>
          </div>
        }
      } @placeholder {
        <div class="form-skeleton p-3">
          <div class="skeleton-line mb-2"></div>
          <div class="skeleton-line mb-3"></div>
          <div class="skeleton-line"></div>
        </div>
      } @error {
        <div class="alert alert-danger">Failed to load form content.</div>
      }
      @if (error()) {
        <div
          class="alert alert-danger mt-3 p-2"
          role="alert"
          aria-live="assertive"
        >
          <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error() }}
        </div>
      }
      @if (isSaving()) {
        <div class="saving-overlay" aria-busy="true">
          <div class="spinner-border text-light" role="status"></div>
        </div>
      }
    </app-base-modal>
    <ng-template #mapTemplate>
      <div class="map-wrapper">
        <app-google-map-viewer
          #mapViewer
          [center]="center()"
          [markers]="markers()"
          [polygons]="polygons()"
          [circles]="circles()"
          [rectangles]="rectangles()"
          [zoom]="14"
          [enableDrawing]="true"
          (shapeCreated)="onLocationSelected($event)"
          (shapeEdited)="onLocationSelected($event)"
          [allowedDrawingTools]="
            config()?.allowedDrawingTools || [
              'marker',
              'circle',
              'polygon',
              'rectangle',
            ]
          "
        >
        </app-google-map-viewer>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .form-modal-body {
        max-height: 60vh;
        overflow-y: auto;
        position: relative;
        @media (max-width: 576px) {
          padding: 1rem;
        }
      }
      .modal-layout-wrapper {
        display: flex;
        flex-wrap: wrap; /* Wraps on small screens */
        gap: 0.5rem;
        width: 100%;
        /* Apply padding here */

        @media (max-width: 576px) {
          padding: 1rem;
          gap: 1rem;
        }
      }
      /* --- Layout direction classes --- */
      .layout-row,
      .layout-row-reverse {
        flex-direction: row;
        flex-wrap: wrap; /* Wrap on small screens for side-by-side */
      }
      .layout-row-reverse {
        flex-direction: row-reverse;
      }
      .layout-column {
        flex-direction: column;
        flex-wrap: nowrap; /* Don't wrap when stacked */
      }
      .layout-column-reverse {
        flex-direction: column-reverse; /* Form upar, Template neeche */
        flex-wrap: nowrap;
      }

      /* Sizing bhi column jaisa hi rahega */
      .layout-column-reverse .static-content,
      .layout-column-reverse .dynamic-content {
        flex-basis: auto;
        width: 100%;
      }
      /* --- Children sizing for side-by-side --- */
      .layout-row .static-content,
      .layout-row-reverse .static-content {
        flex: 1; /* grow, shrink, basis */
        padding: 12px;
      }
      .layout-row .dynamic-content,
      .layout-row-reverse .dynamic-content {
        flex: 1;
        max-width: 46%;
      }

      /* --- Children sizing for stacked --- */
      .layout-column .static-content,
      .layout-column .dynamic-content {
        flex-basis: auto; /* Reset flex-basis */
        width: 100%;
      }

      /* --- Form-only layout --- */
      .layout-form-only .dynamic-content {
        width: 100%;
      }

      .form-skeleton .skeleton-line {
        height: 40px;
        background: linear-gradient(
          90deg,
          #f0f0f0 25%,
          #e0e0e0 50%,
          #f0f0f0 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 4px;
        margin-bottom: 1rem;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .saving-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
      }

      .alert ul {
        padding-left: 1.25rem;
      }

      // map-------------------
      .form-map-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
      }

      .form-map-container.side-by-side {
        flex-direction: row;
        align-items: flex-start;
      }

      .form-map-container.reverse-row {
        flex-direction: row-reverse;
      }

      // .form-section {
      //   flex: 1;
      //   min-width: 300px;
      // }

      .map-side-section {
        flex: 1;
        min-width: 60%;
        height: 400px;
      }

      .map-wrapper {
        height: 400px;
        margin-top: 15px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #ddd;
      }

      @media (max-width: 768px) {
        .form-map-container.side-by-side {
          flex-direction: column !important;
        }
        .map-side-section {
          width: 100%;
          height: 300px;
        }
      }
    `,
  ],
})
export class FormModalComponent {
  layoutClass = computed(() => {
    const layout = this.config()?.layout ?? 'form-only';

    // If no static content is passed, always default to form-only
    if (!this.config()?.staticContentTpl) {
      return 'layout-form-only';
    }

    switch (layout) {
      case 'static-left':
        return 'layout-row';
      case 'static-right':
        return 'layout-row-reverse';
      case 'static-top':
        return 'layout-column';
      case 'static-bottom':
        return 'layout-column-reverse';
      default:
        return 'layout-form-only';
    }
  });

  // ✅ New handler: Forwards to config callback (runs in parent's scope)

  // Writable signal for dynamic modal injection
  config = signal<FormModalConfig | null>(null);

  // Signal-based ViewChild
  dynamicForm = viewChild<FilterFormComponent>('dynamicForm');
  modalGrid = viewChild<AdvancedGridComponent>('modalGrid');
  // Component class ke andar ek computed bana lein jo 'any' cast kare
  readonly safeConfig = computed(() => this.config() as any);
  // Reactive state (no more private writable signals for derived state)
  protected error = signal<string | null>(null);
  private saving = signal(false);

  // ✅ State for Lazy Fetching
  protected fetchState = signal<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  );
  protected fetchedData = signal<any>(null); // Stores the result of fetchFn
  isLoading = computed(() => this.fetchState() === 'loading'); // Computed loading state

  // ✅ Computed: Safely unwrap fields (handles both Signal and array)
  resolvedFields = computed(() => {
    const fields = this.config()?.fields;

    if (!fields) return [];
    console.log('fields', fields);
    // Check if it's a Signal by checking for a function call
    return typeof fields === 'function' ? fields() : fields;
  });
  resolvedRowData = computed(() => {
    const fields = this.config()?.rowData;

    if (!fields) return [];
    console.log('fields', fields);
    // Check if it's a Signal by checking for a function call
    return typeof fields === 'function' ? fields() : fields;
  });
  isGridLoading = computed(() => {
    // Agar data already hai (refresh case), toh overlay mat dikhao
    // sirf background mein update hone do.
    const data = this.config()?.rowData;
    if (data && data.length > 0) {
      return false;
    }
    console.log(this.config()?.isFetching);
    return this.config()?.isFetching ?? true;
  });
  resolvedButtonName = computed(() => {
    const button = this.config()?.buttonName;

    if (!button) return 'Submit';
    // Check if it's a Signal by checking for a function call
    return typeof button === 'function' ? button() : button;
  });
  // ✅ Computed: Safely unwrap InitialData (handles both Signal and array)
  resolvedInitialData = computed(() => {
    // console.log("initialData",this.config()?.initialData);
    const fields = this.config()?.initialData;
    if (!fields) return [];
    // Check if it's a Signal by checking for a function call
    return typeof fields === 'function' ? fields() : fields;
  });
  // ✅ Computed: Pure derivation of validity (memoized, no writes needed)
  formValid = computed(() => {
    const form = this.dynamicForm();
    const cfg = this.config();
    // Fallback to form.form.valid if isFormValid isn't exposed; adjust as needed
    return !!(form && cfg && (form.isFormValid ?? form.form?.valid));
  });

  // Computed values (memoized)
  saveDisabled = computed(
    () => !this.formValid() || this.saving() || !this.config(),
  );
  isSaving = computed(() => this.saving());

  private alert = inject(AlertService);
  @ViewChild('mapViewer') mapViewer!: GoogleMapViewerComponent;

  // Center और Markers के Signals (जो मैप को बाइंड हैं)
  center = signal<google.maps.LatLngLiteral>({ lat: 20.5937, lng: 78.9629 });
  markers = signal<any[]>([]);
  polygons = signal<any[]>([]);
  circles = signal<any[]>([]);
  rectangles = signal<any[]>([]);
  // ✅ Inject the Map Logic Service
  private mapService = inject(MapFormService);
  // Add to your signals/computed section
  // For Media Viewer
  resolvedMediaUrl = computed(() => {
    const media = this.config()?.mediaUrl;
    // Agar media undefined hai (config null hone ki wajah se), toh null return karein
    const value = typeof media === 'function' ? media() : media;
    return value ?? null;
  });
  readonly resolvedFooter = computed(() => {
    const cfg = this.config();
    if (!cfg) return null;

    const fCfg = cfg.footerConfig;

    // We already have resolvedButtonName in your code, we can reuse its logic
    const oldButtonName =
      typeof cfg.buttonName === 'function' ? cfg.buttonName() : cfg.buttonName;

    return {
      // Priority: 1. FooterConfig -> 2. Legacy Flat Config -> 3. Default fallback
      showFooter: fCfg?.showFooter ?? cfg.showFooter ?? false,
      saveIcon: fCfg?.saveIcon ?? 'save',
      saveText: fCfg?.saveText ?? oldButtonName ?? 'Submit',
      showCloseButton: fCfg?.showCloseButton ?? cfg.showCloseButton ?? true,
      showCancelButton: fCfg?.showCancelButton ?? true, // default to true based on app-base-modal default
      cancelText: fCfg?.cancelText ?? 'Cancel',
      saveButtonClass: fCfg?.saveButtonClass ?? 'btn reusable-save-btn',
      cancelButtonClass: fCfg?.cancelButtonClass ?? 'btn reusable-close-btn',
      cancelIcon: fCfg?.cancelIcon ?? 'cancel',
    };
  });
  incomingConfig = input<FormModalConfig | null>(null);
  constructor(public activeModal: NgbActiveModal) {
    effect(
      () => {
        const cfg = this.incomingConfig();
        if (cfg) this.config.set(cfg);
      },
      { allowSignalWrites: true },
    );
    // ✅ Effect to trigger lazy fetch when config is ready
    effect(
      () => {
        const currentConfig = this.config();
        console.log('currentConfig', currentConfig);
        if (currentConfig?.fetchFn && currentConfig.fetchKey) {
          // Use initialData as the payload for the fetch function
          this.lazyFetch(
            currentConfig.fetchFn,
            currentConfig.initialData,
            currentConfig.fetchKey,
          );
        }
        // ✅ NEW: Handle Initial Drawing Data (Edit Mode)
        // ✅ Use Service to process initial drawing data
        if (
          currentConfig?.initialDrawingData &&
          currentConfig.initialDrawingData.length > 0
        ) {
          const shapes = this.mapService.processInitialDrawings(
            currentConfig.initialDrawingData,
          );

          this.polygons.set(shapes.polygons);
          this.markers.set(shapes.markers);
          this.circles.set(shapes.circles);
          this.rectangles.set(shapes.rectangles);
          if (shapes.center) this.center.set(shapes.center);
        }
      },
      { allowSignalWrites: true },
    );
  }

  // ✅ Method to perform the lazy fetch
  private async lazyFetch(
    fetchFn: (data: any) => Promise<any>,
    payload: any,
    key: string,
  ): Promise<void> {
    this.fetchState.set('loading');
    this.fetchedData.set(null); // Clear previous data
    this.error.set(null);
    console.log(`Lazy fetching data for key: ${key} with payload:`, payload);

    try {
      const result = await fetchFn(payload);
      this.fetchedData.set({ [key]: result }); // Store result under the specified key
      this.fetchState.set('success');
      console.log(`Lazy fetch successful for key: ${key}`, result);
    } catch (err: any) {
      const msg = err?.error?.message || 'Failed to load data. Please retry.';
      console.error(`❌ Lazy fetch error for key ${key}:`, err);
      this.error.set(msg);
      this.fetchState.set('error');
    }
  }
  // ✅ NEW: Process drawing data from service
  private processInitialDrawings(data: any[]) {
    const polygonsList: any[] = [];
    const markersList: any[] = [];
    let newCenter: google.maps.LatLngLiteral | null = null;
    console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', data);
    data.forEach((item) => {
      // 1. Polygon Handling
      if (item.type === 'polygon' && item.path) {
        polygonsList.push({
          paths: item.path,
          // Editable options ensure user can modify the loaded polygon
          editable: true,
          draggable: true,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          strokeWeight: 2,
        });

        // Center map to the first point of the first polygon
        if (!newCenter && item.path.length > 0) {
          newCenter = item.path[0];
        }
      }

      // 2. Marker Handling
      else if (item.type === 'marker' && item.position) {
        markersList.push(item);
        if (!newCenter) newCenter = item.position;
      }
    });

    this.polygons.set(polygonsList);
    this.markers.set(markersList);

    if (newCenter) {
      this.center.set(newCenter);
    }
  }
  // Public API: For runtime config updates
  updateConfig(newConfig: FormModalConfig): void {
    this.config.set(newConfig);
    this.error.set(null);
  }

  async handleSave(): Promise<void> {
    const cfg = this.config();
    if (this.dynamicForm()?.form.invalid) {
      this.dynamicForm()?.form.markAllAsTouched();
      return;
    }
    if (!cfg) {
      this.error.set('Please fix validation errors before saving.');
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    try {
      const formData =
        cfg.mode === 'form' || cfg.mode === 'form-table'
          ? this.dynamicForm()?.form.getRawValue() || {}
          : {};
      console.log(formData, 'formData');
      if (!cfg.onSave) {
        return;
      }
      const result = await cfg.onSave(formData);

      //yeh use kiya hai taaki agar mode 'form-table' hai toh form ko reset na karein aur modal bhi na band ho kyunki user ko table dekhna hai apne filled data ke saath. Baaki modes mein form reset kar denge aur modal close kar denge jaise pehle karte the.
      if (cfg.mode === 'form-table') {
        return;
      }

      if (cfg.resetOnSuccess && this.dynamicForm()) {
        this.dynamicForm()!.form.reset();
      }

      this.activeModal.close(result);
    } catch (err: any) {
      console.log(err, this.config());

      const msg =
        err?.error?.Message ||
        err?.error?.message ||
        err?.message ||
        'Save failed. Please retry.';
      console.error('❌ Save error:', err);
      this.error.set(msg);
      // this.alert.error(msg);
    } finally {
      this.saving.set(false);
    }
  }

  onFormSubmit(formData: any): void {
    console.log('formData');

    this.handleSave();
  }

  // Public API for programmatic control
  resetForm(): void {
    this.dynamicForm()?.form.reset();
    this.error.set(null);
    // No need to set validationErrors—computed auto-updates
  }

  closeModal(): void {
    this.activeModal.dismiss('cancelled');
  }
  // onLocationSelected(event: MapSelectionEvent) {
  //   // 1. Form ka current data nikalein (bilkul onFieldChange ki tarah)
  //   const fullFormData = this.dynamicForm()?.form.getRawValue() || {};

  //   // 2. Parent ko data bhejein agar callback defined hai
  //   if (this.config()?.onMapSelect) {
  //     this.config()?.onMapSelect?.(event, fullFormData);
  //   }

  //   console.log('Map Shape Selected:', event);
  // }
  // onLocationSelected(event: any) {
  //   const form = this.dynamicForm()?.form;
  //   if (!form) return;

  //   // 1. Clear fields if no event
  //   if (!event) {
  //     form.patchValue({ geocode: '', geofenceRadius: '' }, { emitEvent: false });
  //     return;
  //   }

  //   let latLngString = '';

  //   // 2. Multi-Coordinate Extraction Logic
  //   switch (event.type) {
  //     case 'marker':
  //       latLngString = `${event.position.lat}, ${event.position.lng}`;
  //       break;

  //     case 'circle':
  //       latLngString = `${event.center.lat}, ${event.center.lng}`;
  //       break;

  //     case 'polygon':
  //       // Sabhi paths ko map karke join karna: "lat1,lng1 | lat2,lng2 | ..."
  //       if (event.paths && Array.isArray(event.paths)) {
  //         latLngString = event.paths
  //           .map((p: any) => `${p.lat}, ${p.lng}`)
  //           .join(' | ');
  //       }
  //       break;

  //     case 'rectangle':
  //       // Rectangle ke 4 corners (NW, NE, SE, SW) ko join karna
  //       if (event.bounds) {
  //         const { north, south, east, west } = event.bounds;
  //         latLngString = [
  //           `${north}, ${west}`, // Top-Left
  //           `${north}, ${east}`, // Top-Right
  //           `${south}, ${east}`, // Bottom-Right
  //           `${south}, ${west}`  // Bottom-Left
  //         ].join(' | ');
  //       }
  //       break;
  //   }

  //   // 3. Patch Geocode with emitEvent: false
  //   if (form.get('geocode')) {
  //     form.patchValue({ geocode: latLngString }, { emitEvent: false });
  //   }

  //   // 4. Circle Radius matching (Optimized)
  //   if (event.type === 'circle' && form.get('geofenceRadius')) {
  //     const radiusInKm = event.radius / 1000;
  //     const geofenceField = this.resolvedFields().find(f => f.name === 'geofenceRadius');
  //     const options = geofenceField?.options?.map((opt: any) => opt.id) || [0.5, 1, 2, 5];

  //     const closestRadius = options.reduce((prev: number, curr: number) => {
  //       return Math.abs(curr - radiusInKm) < Math.abs(prev - radiusInKm) ? curr : prev;
  //     });

  //     form.patchValue({ geofenceRadius: closestRadius }, { emitEvent: false });
  //   }

  //   // 5. Notify Parent
  //   const fullFormData = form.getRawValue();
  //   this.config()?.onMapSelect?.(event, fullFormData);

  //   console.log(`Updated Form with ${event.type} data:`, { geocode: latLngString });
  // }
  // onControlValueChange(event: { controlName: string; value: any }): void {

  //   // 1. Data nikalein
  //   const fullFormData = this.dynamicForm()?.form.getRawValue() || {};

  //   // 2. Call karein (Purane users 'fullFormData' ko ignore karenge, Naye use karenge)
  //   this.config()?.onFieldChange?.(event, fullFormData);

  //   if (event.controlName === 'geocode' || event.controlName === 'latLong') {

  //     const inputVal = event.value;

  //     // 2. वैल्यू को पार्स करें (String "28.5, 77.2" -> Lat/Lng Object)
  //     if (inputVal && typeof inputVal === 'string' && inputVal.includes(',')) {
  //         const parts = inputVal.split(',').map(s => parseFloat(s.trim()));

  //         // अगर Valid Coordinates हैं
  //         if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
  //             const newPos = { lat: parts[0], lng: parts[1] };
  //             console.log('📍 Input se Location mili:', newPos);

  //             // 3. मैप अपडेट करें
  //             this.updateMapFromInput(newPos);
  //         }
  //     }
  // }
  // }

  // ✅ Optimized: Uses Service Logic
  onLocationSelected(event: any) {
    const form = this.dynamicForm()?.form;
    if (!form || !event) return;

    // 1. Get String Representation from Service
    const latLngString = this.mapService.convertShapeToCoordinates(event);

    // 2. Patch Form
    if (form.get('geocode') && latLngString) {
      form.patchValue({ geocode: latLngString }, { emitEvent: false });
    }

    // 3. Update Radius for Circle using Service
    if (event.type === 'circle' && form.get('geofenceRadius')) {
      const geofenceField = this.resolvedFields().find(
        (f) => f.name === 'geofenceRadius',
      );
      const closestRadius = this.mapService.getClosestRadius(
        event.radius,
        geofenceField?.options || [],
      );
      form.patchValue({ geofenceRadius: closestRadius }, { emitEvent: false });
    }

    // 4. Notify Parent
    this.config()?.onMapSelect?.(event, form.getRawValue());
  }

  // onControlValueChange(event: { controlName: string; value: any }): void {
  //   const fullFormData = this.dynamicForm()?.form.getRawValue() || {};
  //   this.config()?.onFieldChange?.(event, fullFormData);

  //   // ✅ Sync Text Input -> Map using Service
  //   if (event.controlName === 'geocode' || event.controlName === 'latLong') {
  //     const newPos = this.mapService.parseInputToLatLng(event.value);
  //     if (newPos) {
  //       this.updateMapFromInput(newPos);
  //     }
  //   }
  // }
  updateMapFromInput(position: google.maps.LatLngLiteral) {
    if (this.mapViewer) {
      // A. पुराने ड्राइंग्स (जो माउस से बने थे) साफ़ करें
      this.mapViewer.clearDrawings();
    }
    // B. मैप का सेंटर बदलें
    this.center.set(position);
    // C. वहां एक मार्कर दिखाएं (ताकि यूजर को पता चले कि लोकेशन कहाँ है)
    this.markers.set([
      {
        position: position,
        title: 'Selected Location',
        markerType: 'landmark', // Landmark स्टाइल (Blue/Red pin)
        // options...
      },
    ]);
  }
  onControlValueChange(event: {
    controlName: string;
    value: any;
    form: any;
  }): void {
    const fullFormData = this.dynamicForm()?.form.getRawValue() || {};
    this.config()?.onFieldChange?.(event, fullFormData);

    // / 🚀 NEW FEATURE: GRID AUTO-FILTERING (100% Safe & Backward Compatible)
    const cfg = this.config();
    if (cfg?.enableGridFilter) {
      console.log('process', cfg?.enableGridFilter);
      const gridInstance = this.modalGrid();

      if (gridInstance) {
        // Mapping se column name nikalo, agar nahi hai toh controlName use karo
        const columnField =
          cfg.gridFilterMapping?.[event.controlName] || event.controlName;
        console.log(columnField);
        const currentFilterModel = gridInstance.getFilterModel();

        if (!event.value || event.value.id === '' || event.value.id === 'ALL') {
          // 🧹 ADVANCED CLEAR: Sirf us column ki key ko JSON se uda do
          delete currentFilterModel[columnField];
        } else {
          // 🎯 ADVANCED SET: Us column ki key me naya filter set kar do
          currentFilterModel[columnField] = {
            filterType: 'text', // Aapka base filter type (text, number, ya date)
            type: 'equals',
            filter: event.value.name || event.value,
          };
        }

        // 🚀 THE MAGIC: Grid ko naya state pass kar do.
        // Ye automatically diff calculate karega aur UI refresh kar dega (No need for onFilterChanged!)
        gridInstance.setFilterModel(currentFilterModel);
      }
    }
    if (['geocode', 'latLong', 'GeoCoord'].includes(event.controlName)) {
      const inputVal = event.value;

      // Reset Map Shapes
      this.clearAllShapes();

      // 1. Try Polygon
      const polyPath = this.mapService.parseToPolygonPath(inputVal);
      if (polyPath && polyPath.length >= 3) {
        this.polygons.set([
          {
            paths: polyPath,
            editable: true,
            draggable: true,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            strokeWeight: 2,
          },
        ]);
        this.center.set(polyPath[0]);
        return;
      }

      // 2. Try Marker
      const latLng = this.mapService.parseInputToLatLng(inputVal);
      if (latLng) {
        this.markers.set([
          {
            position: latLng,
            title: 'Location',
            markerType: 'landmark',
            draggable: true,
          },
        ]);
        this.center.set(latLng);
      }
    }
  }

  // Helper to clear signals
  private clearAllShapes() {
    this.polygons.set([]);
    this.circles.set([]);
    this.rectangles.set([]);
    this.markers.set([]);
    // Clear Viewer Drawings too if needed
    if (this.mapViewer) this.mapViewer.clearDrawings();
  }
}

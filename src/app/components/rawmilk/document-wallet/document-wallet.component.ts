import {
  Component,
  OnInit,
  signal,
  computed,
  ViewChild,
  TemplateRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import {
  FilterFormComponent,
  FieldConfig,
} from '../../../shared/components/filter-form/filter-form.component';
import { SpkApexchartsComponent } from '../../../@spk/spk-apexcharts/apexcharts.component';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { AlertService } from '../../../shared/services/alert.service';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { DocumentWalletService } from './document-wallet.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import {
  filterfields,
  vehicleDocumentColumns,
  actionColumn,
  editColumn,
  editVehicleDocumentFields,
} from './state-service/config';
import { NavTabComponent } from '../../../shared/components/nav-tab/nav-tab.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-document-wallet',
  standalone: true,
  imports: [
    CommonModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    SpkApexchartsComponent,
    AdvancedGridComponent,
    NavTabComponent,
    SharedModule
  ],
  templateUrl: './document-wallet.component.html',
  styleUrl: './document-wallet.component.scss',
})
export class DocumentWalletComponent implements OnInit {
  documentTypesList = signal<any[]>([]);
  suppliersList = signal<any[]>([]);
  transportersList = signal<any[]>([]);
  vehiclesList = signal<any[]>([]);
  chartData = signal<any>(null);
  vehicleChartData = signal<any>(null);
  driverChartData = signal<any>(null);
  tableData = signal<any[]>([]);
  tableDataVehicle = signal<any[]>([]);
  tableDataDriver = signal<any[]>([]);
  tabState = signal<string>('vehicle');
  tabsConfigs = signal([
    {
      title: 'Vehicle',
    },
    { title: 'Driver' },
  ]);

  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    context: {
      componentParent: this,
    },
    columns: [...vehicleDocumentColumns, actionColumn, editColumn],
  });

  public documentStatusChartOptions = {
    series: [
      {
        name: 'Active',
        data: [11, 29, 15, 16, 31, 41],
      },
      {
        name: 'About To Expire',
        data: [2, 1, 1, 4, 1, 0],
      },
      {
        name: 'Expired',
        data: [39, 24, 31, 34, 20, 7],
      },
    ],
    chart: {
      type: 'bar',
      height: 200,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Pollution Certificate',
        'Registration Certificate',
        'National Goods Permit',
        'Insurance',
        'Vehicle Fitness Certificate',
        'FSSAI',
      ],
      labels: {
        style: {
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 50,
      tickAmount: 5,
    },
    fill: {
      opacity: 1,
    },
    colors: ['#61ba46', '#214376', '#f26822'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      markers: {
        radius: 4,
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toString();
        },
      },
    },
  };

  filterfieldsOptions = computed<FieldConfig[]>(() =>
    filterfields(
      this.documentTypesList(),
      this.suppliersList(),
      this.transportersList(),
      this.vehiclesList(),
      this.tabState(),
    ),
  );

  @ViewChild('imageModal') imageModal!: TemplateRef<any>;
  private modalService = inject(NgbModal);
  private universalModalService = inject(UniversalModalService);
  private alertService = inject(AlertService);
  selectedImagePath: string = '';

  token = localStorage.getItem('AccessToken') || '';
  groupId = localStorage.getItem('GroupId');

  constructor(private documentWalletService: DocumentWalletService) {}

  ngOnInit(): void {
    this.loadFilterOptions();
    this.fetchData();
  }

  loadFilterOptions(): void {
    const docTypePayload = createFormData(this.token, { ForWeb: '1' });
    const indentPayload = createFormData(this.token, {
      GroupId: this.groupId,
      ForApp: '0',
    });
    const tankerPayload = createFormData(this.token, { ForWeb: '1' });
    const vdListPayload = createFormData(this.token, { ForWeb: '1' });

    forkJoin({
      docTypes: this.documentWalletService.getDocumentTypes(docTypePayload),
      indentMaster:
        this.documentWalletService.getCreateIndentMaster(indentPayload),
      tankerFilter: this.documentWalletService.getTankerFilter(tankerPayload),
      vdListing: this.documentWalletService.getVehicleListing(vdListPayload),
    }).subscribe({
      next: (result) => {
        if (result.docTypes?.Status === 'success') {
          this.documentTypesList.set(result.docTypes.DriverDocumentTypes || []);
        }

        if (result.indentMaster?.PlantSupplier) {
          const suppliers = result.indentMaster.PlantSupplier.filter(
            (item: any) =>
              item.type == '6' ||
              item.type === 6 ||
              item.Type == '6' ||
              item.Type === 6,
          );
          this.suppliersList.set(suppliers || []);
        }

        if (result.tankerFilter?.TransporterList) {
          this.transportersList.set(result.tankerFilter.TransporterList || []);
        }

        if (result.vdListing?.Status === 'success') {
          this.vehiclesList.set(result.vdListing.VehicleData || []);
        }
      },
      error: (error) => {
        console.error('Error loading filter options', error);
      },
    });
  }

  onFormSubmit(data: any): void {
    console.log('Form submitted with data:', data);
    this.fetchData(data);
  }

  fetchData(filterValues: any = {}): void {
    const payloadData = {
      ForWeb: '1',
      FromDate: filterValues?.fromDate || '',
      ToDate: filterValues?.toDate || '',
      VehicleId:
        filterValues?.vehicle?.VehicleId || filterValues?.vehicle?.id || '',
      DocTypeId:
        filterValues?.documentType?.DocumentTypeId ||
        filterValues?.documentType?.id ||
        '',
      Status: filterValues?.status?.id,
      MpcId:
        filterValues?.supplier?.PlantId ||
        filterValues?.supplier?.id ||
        filterValues?.supplier?.SupplierId ||
        '',
      TransporterId:
        filterValues?.transporter?.TransporterId ||
        filterValues?.transporter?.id ||
        '',
    };

    const payload = createFormData(this.token, payloadData);

    this.documentWalletService.getDocumentWalletRepo(payload).subscribe({
      next: (res: any) => {
        if (res && res.BarCount) {
          const vehicleData = res.BarCount || {};
          const driverData = res.DriverBarCount || {};

          this.vehicleChartData.set({
            Active: vehicleData.Active || [],
            Expired: vehicleData.Expired || [],
            ExpiredSoon: vehicleData.ExpiredSoon || [],
          });
          this.driverChartData.set({
            driverActive: driverData.Active || [],
            driverExpired: driverData.Expired || [],
            driverExpiredSoon: driverData.ExpiredSoon || [],
          });
        }

        if (res && res.DocWalletVehicleData) {
          this.tableDataVehicle.set(res.DocWalletVehicleData || []);
          this.tableDataDriver.set(res.DocWalletDriverData || []);
          this.changeTab(0);
        } else {
          this.tableDataVehicle.set([]);
          this.tableDataDriver.set([]);
        }
      },
      error: (error) => {
        console.error('Error fetching chart data', error);
      },
    });
  }

  onView(imagePath: string): void {
    console.log('View clicked for image path:', imagePath);
    this.selectedImagePath = imagePath || '';
    if (this.imageModal) {
      this.modalService.open(this.imageModal, { size: 'lg', centered: true });
    }
  }

  onEdit(data: any): void {
    const editFields = editVehicleDocumentFields(
      this.documentTypesList(),
      this.vehiclesList(),
    );

    // Attempt to map the initial options back based on data
    const initialVehicle = this.vehiclesList().find(
      (v) =>
        v.VehicleNumber === data.VehicleNumber ||
        v.VehicleNum === data.VehicleNumber,
    );
    const initialDocType = this.documentTypesList().find(
      (d) => d.DocumentTypeName === data.DocumentTypeName,
    );

    const initialData = {
      vehicle: initialVehicle || null,
      documentType: initialDocType || null,
      documentNumber1: data.DocumentNo || '',
      from_Date1: data.IssueDate || '',
      To_Date1: data.ExpiryDate || '',
      remark: data.Remark || '',
    };

    this.universalModalService.openForm({
      title: 'Edit Document For Vehicle',
      fields: editFields,
      mode: 'form',
      buttonName: 'ADD', // As per the screenshot
      size: 'lg',
      initialData: initialData,
      onSave: (formValues: any) => {
        return new Promise((resolve, reject) => {
          try {
            const formData = new FormData();
            formData.append('AccessToken', this.token);
            formData.append('Category', 'Vehicle');
            formData.append(
              'DocumentTypeId',
              formValues?.documentType?.DocumentTypeId ||
                initialDocType?.DocumentTypeId ||
                '',
            );
            formData.append(
              'DocumentTypeName',
              formValues?.documentType?.DocumentTypeName ||
                initialDocType?.DocumentTypeName ||
                '',
            );
            formData.append('DocumentNo', formValues?.documentNumber1 || '');
            formData.append('IssueDate', formValues?.from_Date1 || '');
            formData.append('ExpiryDate', formValues?.To_Date1 || '');

            if (
              formValues?.uploadDocument &&
              formValues.uploadDocument instanceof File
            ) {
              formData.append('DocumentFile', formValues.uploadDocument);
            } else if (formValues?.uploadDocument?.file) {
              formData.append('DocumentFile', formValues.uploadDocument.file);
            } else {
              formData.append('DocumentFile', '');
            }

            formData.append('Remark', formValues?.remark || '');
            formData.append(
              'VehicleId',
              formValues?.vehicle?.VehicleId ||
                initialVehicle?.VehicleId ||
                data.VehicleId ||
                '',
            );
            formData.append('ForWeb', '1');

            // Add DocumentIds for an edit operation
            if (data.DocumentId) {
              formData.append('DocumentIds', JSON.stringify([data.DocumentId]));
            }

            this.documentWalletService.editDocument(formData).subscribe({
              next: (res: any) => {
                if (res.Status === 'success') {
                  this.alertService.success(
                    res.Message || 'Document updated successfully.',
                  );
                  this.fetchData(); // Refresh grid
                  resolve(true);
                } else {
                  this.alertService.error(
                    res.Message || 'Failed to update document.',
                  );
                  reject(res.Message);
                }
              },
              error: (err: any) => {
                this.alertService.error(
                  err?.message || 'Error updating document',
                );
                reject(err);
              },
            });
          } catch (error: any) {
            this.alertService.error(error?.message || 'Error processing form');
            reject(error);
          }
        });
      },
    });
  }

  changeTab(tabIndex: number) {
    console.log('Active tab index:', tabIndex);
    console.log('here.:', this.vehicleChartData());
    if (tabIndex === 0) {
      this.tabState.set('vehicle');
      this.tableData.set(this.tableDataVehicle());
      this.documentStatusChartOptions = {
        ...this.documentStatusChartOptions,
        series: [
          {
            name: 'Active',
            data: this.vehicleChartData()?.Active || [],
          },
          {
            name: 'About To Expire',
            data: this.vehicleChartData()?.ExpiredSoon || [],
          },
          {
            name: 'Expired',
            data: this.vehicleChartData()?.Expired || [],
          },
        ],
      };
    } else if (tabIndex === 1) {
      this.tabState.set('driver');
      this.tableData.set(this.tableDataDriver());
      this.documentStatusChartOptions = {
        ...this.documentStatusChartOptions,
        series: [
          {
            name: 'Active',
            data: this.driverChartData().driverActive || [],
          },
          {
            name: 'About To Expire',
            data: this.driverChartData().driverExpiredSoon || [],
          },
          {
            name: 'Expired',
            data: this.driverChartData().driverExpired || [],
          },
        ],
      };
    }
  }
}

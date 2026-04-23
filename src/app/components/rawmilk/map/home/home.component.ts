import { Component, inject } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { SharedModule } from '../../../../shared/shared.module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';
import { LinkPanelComponent } from '../../home traking/link-panel/link-panel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import {
  AllCommunityModule,
  ColDef,
  GridOptions,
  ModuleRegistry,
} from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
} from 'ag-grid-community';
import { Router } from '@angular/router';
import { getVehicleColumnDefs } from '../state-service/vehicle-grid.config';
import { GridTableComponent } from '../grid-table/grid-table.component';
import { GeofenceStore, LandmarkStore, VehicleStore } from '../state-service/vehicle.store';
import { createFormData, handleApiError, handleApiResponse, handleSessionExpiry } from '../../../../shared/utils/shared-utility.utils';
import { HomeService } from '../services/home.service';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MapComponent,
    SharedModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgSelectComponent,
    LinkPanelComponent,
    GoogleMapsModule,
    NgbModule,
    AgGridAngular,
    GridTableComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private router = inject(Router);
  vehicleStore = inject(VehicleStore);
  landmarkStore = inject(LandmarkStore);
  geofenceStore = inject(GeofenceStore);
    private toastService = inject(AlertService);
  service = inject(HomeService);
  GroupId: any = localStorage.getItem('GroupId');
  AccountId: any = localStorage.getItem('AccountId');
  // localStorage.setItem('UserName1', resp.Data.UserName);
  AccessToken: any = localStorage.getItem('AccessToken');
  GroupType: any = localStorage.getItem('GroupTypeId');
  isOpen = true;
  isSliderVisible = true;
  isReport = true;
  activeTab: string = 'vehicle';
  statusCount = {
    active: 0,
    inactive: 0,
    noGps: 0,
    noData: 0,
    breakdown: 0,
    all: 0,
  };

  filterForm!: FormGroup;
  vehiclegtrackingflag: boolean = false
  useCellId: string = "0";
  useLandmark: string = "0";
  useGeofence: string = "0";
    time_interval: any = "30"
    mapData: any = null;
  // items = [
  //   { label: 'All', count: this.statusCount.all, color: '#1D4380' },
  //   { label: 'Active', count: this.statusCount.active, color: '#2d8d4e' },
  //   { label: 'NoData', count: this.statusCount.noData, color: 'red' },
  //   {
  //     label: 'Breakdown',
  //     count: this.statusCount.breakdown,
  //     color: '#d214149c',
  //   },
  //   { label: 'NoGPS', count: this.statusCount.noGps, color: '#3434d0' },
  //   { label: 'InActive', count: this.statusCount.inactive, color: '#696969' },
  // ];
  get items() {
    const c = this.vehicleStore.statusCount$();

    return [
      { label: 'All', count: c.all, color: '#1D4380' },
      { label: 'Active', count: c.active, color: '#2d8d4e' },
      { label: 'NoData', count: c.noData, color: 'red' },
      { label: 'Breakdown', count: c.breakdown, color: '#d214149c' },
      { label: 'NoGPS', count: c.noGps, color: '#3434d0' },
      { label: 'InActive', count: c.inactive, color: '#696969' },
    ];
  }

  plauytrackFlag: boolean = false;

  isTracking: boolean = false;
  // gridOptions: GridOptions = {
  //   rowSelection: {
  //     // mode: 'singleRow',
  //     mode: 'multiRow',
  //     checkboxes: true,
  //     headerCheckbox: false,
  //     selectAll: 'filtered',
  //     enableClickSelection: false   // 👈 replaces suppressRowClickSelection
  //   },
  //   // rowSelection: 'multiple',
  //   suppressRowClickSelection: true,
  //   enableCellTextSelection: true,
  //   suppressCellFocus: true
  // };
  // defaultColDef: ColDef = {
  //   sortable: true,
  //   filter: true,
  //   resizable: true,

  // };
  // defaultColDefReport: ColDef = {
  //   resizable: true,
  //   sortable: true,
  //   wrapText: true,
  //   autoHeight: true

  // };
  selectedVehicles: any[] = [];
  //  gridApi!: GridApi;
  filteredVehicleArray: any[] = [];

  ngOnInit() {
    this.vehicleStore.loadInitialData();
      this.landmarkStore.loadLandmarks();
        this.geofenceStore.loadGeofences();
  }

  toggleSlider() {
    this.isOpen = !this.isOpen;
  }

  //   columnDefs: ColDef[] = [
  //   {

  //     headerName: 'Vehicle No',

  //     field: 'VehicleNo',
  //     // width: 100,

  //     cellClass: params => this.getVehicleClass(params.data.VehicleStatus),

  //   },
  //   // {
  //   //   headerName: 'Vehicle No',
  //   //   field: 'VehicleNo',
  //   //   width: 160,

  //   //   cellRenderer: (params: any) => {
  //   //     const container = document.createElement('div');
  //   //     container.style.display = 'flex';
  //   //     container.style.alignItems = 'center';
  //   //     container.style.gap = '8px';

  //   //     // Vehicle number
  //   //     const text = document.createElement('span');
  //   //     text.innerText = params.value;

  //   //     // Icon
  //   //     const icon = document.createElement('i');
  //   //     icon.style.cursor = 'pointer';
  //   //     icon.style.fontSize = '14px';

  //   //     // 🔁 set icon based on condition
  //   //     const isPlaying = params.data.isPlaying === true;

  //   //     icon.className = isPlaying
  //   //       ? 'fa fa-pause play-pause-icon pause'
  //   //       : 'fa fa-play play-pause-icon play';

  //   //     icon.title = isPlaying ? 'Pause Track' : 'Play Track';

  //   //     icon.addEventListener('click', (event) => {
  //   //       event.stopPropagation();

  //   //       this.playtrack1(params.data);

  //   //       // toggle state
  //   //       params.data.isPlaying = !params.data.isPlaying;

  //   //       // refresh ONLY this cell
  //   //       params.api.refreshCells({
  //   //         rowNodes: [params.node],
  //   //         columns: ['VehicleNo'],
  //   //         force: true
  //   //       });
  //   //     });

  //   //     container.appendChild(text);
  //   //     container.appendChild(icon);

  //   //     return container;
  //   //   },

  //   //   cellClass: params => this.getVehicleClass(params.data.VehicleStatus),
  //   // },
  //   //////////////////////////////////////////////////////////////////////////////////////////////////////

  //   {
  //     headerName: 'Location',
  //     field: 'locationDisplay',   // 👈 virtual field (not from API)
  //     width: 130,

  //     valueGetter: () => true,     // 👈 required so grid treats it as valid

  //     //   cellRenderer: (params: any) => {
  //     //     const row = params.data;
  //     //     if (!row) return '';

  //     //     const dots: string[] = [];

  //     //     // MAIN device dot
  //     //     if (row.LatLong) {
  //     //       const [lat, lng] = row.LatLong.split(',').map(Number);
  //     //       dots.push(`
  //     //   <span class="loc-dot main"
  //     //         title="${row.Location} (${lat}, ${lng})"
  //     //         data-type="main"
  //     //         data-lat="${lat}"
  //     //         data-lng="${lng}">
  //     //         &nbsp;
  //     //   </span>
  //     // `);
  //     //     }

  //     //     // OTHER devices dots
  //     //     if (Array.isArray(row.otherDevices)) {
  //     //       row.otherDevices.forEach((d: any, index: number) => {
  //     //         if (d.Location && d.LatLong) {
  //     //           const [lat, lng] = d.LatLong.split(',').map(Number);
  //     //           dots.push(`
  //     //       <span class="loc-dot other"
  //     //             title="${d.Location} (${lat}, ${lng})"
  //     //             data-type="other"
  //     //             data-index="${index}"
  //     //             data-lat="${lat}"
  //     //             data-lng="${lng}">
  //     //             &nbsp;
  //     //       </span>
  //     //     `);
  //     //         }
  //     //       });
  //     //     }

  //     //     return dots.join('');
  //     //   }
  //     cellRenderer: (params: any) => {
  //       const row = params.data;
  //       if (!row) return '';

  //       const dots: string[] = [];

  //       // 🎨 function to decide class
  //       const getStatusClass = (status: string) => {
  //         if (!status) return 'nodata';

  //         const s = status.toLowerCase();

  //         if (s === 'active') return 'active';
  //         if (s === 'inactive') return 'inactive';
  //         if (s === 'nodata') return 'nodata';
  //         if (s === 'breakdown') return 'Breakdown';
  //         if (s === 'nogps') return 'NoGPS';

  //         return 'nodata'; // default fallback
  //       };

  //       // MAIN device dot
  //       if (row.LatLong) {
  //         const [lat, lng] = row.LatLong.split(',').map(Number);
  //         const statusClass = getStatusClass(row.VehicleStatus);

  //         dots.push(`
  //     <span class="loc-dot main ${statusClass}"
  //           title="${row.Location} (${lat}, ${lng})"
  //           data-type="main"
  //           data-lat="${lat}"
  //           data-lng="${lng}">
  //           &nbsp;
  //     </span>
  //   `);
  //       }

  //       // OTHER devices dots
  //       if (Array.isArray(row.otherDevices)) {
  //         row.otherDevices.forEach((d: any, index: number) => {
  //           if (d.Location && d.LatLong) {
  //             const [lat, lng] = d.LatLong.split(',').map(Number);
  //             const statusClass = getStatusClass(d.VehicleStatus);

  //             dots.push(`
  //         <span class="loc-dot other ${statusClass}"
  //               title="${d.Location} (${lat}, ${lng})"
  //               data-type="other"
  //               data-index="${index}"
  //               data-lat="${lat}"
  //               data-lng="${lng}">
  //               &nbsp;
  //         </span>
  //       `);
  //           }
  //         });
  //       }

  //       return dots.join('');
  //     }
  //   },

  //   {
  //     headerName: 'Engine',
  //     // headerName: '',
  //     cellRenderer: (params: any) => {
  //       const status = params.value;
  //       const color =
  //         status === 'On' ? 'green' :
  //           status === 'Off' ? 'red' : 'grey';

  //       return `<i class="fa fa-key" style="color:${color}" title= "Engine-${params.value}"></i>`;
  //     },
  //     field: 'EngineStatus',
  //     width: 80,
  //     filter: false,
  //   },
  //   {
  //     headerName: 'Temp',
  //     field: 'Temperature', // make sure your API provides this
  //     width: 90,
  //     filter: false,
  //     cellRenderer: (params: any) => {
  //       const temp = params.value;

  //       // 🚫 If null, undefined, empty string → show nothing
  //       if (temp === null || temp === undefined || temp === '' || temp === ' ') {
  //         return '';
  //       }

  //       const value = Number(temp);

  //       let color =
  //         value <= 15 ? 'green' :
  //           value <= 35 ? 'orange' :
  //             'red';

  //       return `
  //     <i class="fa fa-thermometer-half"
  //        style="color:${color}"
  //        title="Temperature: ${value}°C">
  //     </i>
  //     <span style="margin-left:4px;">${value}°C</span>
  //   `;
  //     }
  //   },
  //   {
  //     headerName: 'Battery',
  //     filter: false,
  //     cellClass: params => this.getVehicleClass(params.data.VehicleStatus),
  //     cellRenderer: (params: any) => {

  //       const b = params.data.Battery;
  //       const v = params.data.BatteryVoltage;
  //       const Color = this.getVehicleClass(params.data.VehicleStatus)

  //       let icon = 'fa-battery-empty';
  //       let color = 'gray';

  //       if (b == 0) { icon = 'fa fa-battery-empty'; color = `${Color}` }
  //       else if (b > 0 && b < 25) { icon = 'fa-battery-quarter'; color = ` ${Color}`; }
  //       else if (b >= 25 && b < 50) { icon = 'fa-battery-half'; color = `${Color} `; }
  //       else if (b >= 50 && b < 75) { icon = 'fa-battery-three-quarters'; color = `${Color} `; }
  //       else if (b >= 75 && b <= 100) { icon = 'fa-battery-full'; color = `${Color} `; }

  //       return `
  //       <i class="fa ${icon}"
  //          title="Battery-Level-${b} Battery-Volt-${v}"
  //          style="color:${color}">
  //       </i>`;
  //     },
  //     width: 80
  //   },

  //   {
  //     headerName: 'Status',
  //     // headerName: '',
  //     field: 'VehicleStatus',
  //     width: 100,
  //     cellClass: params => this.getVehicleClass(params.value),

  //   },
  //   {
  //     headerName: '',
  //     field: 'GPSVendor',
  //     width: 60,
  //     cellClass: params => this.getVehicleClass(params.data.VehicleStatus),

  //     // cellRenderer: (params: any) => {
  //     //   const showIcon =
  //     //     params.data?.GPSVendor && params.data?.DeviceType == '23';

  //     //   return showIcon
  //     //     ? `<i class="fa fa-video-camera video-icon"
  //     //    title="Live Video"
  //     //    style="cursor:pointer"></i>`
  //     //     : '';
  //     // },
  //     cellRenderer: (params: any) => {
  //       let matchedData = null;

  //       // ✅ Check main object
  //       if (
  //         params.data?.GPSVendor !== 'Secutrak' &&
  //         params.data?.DeviceType === '23'
  //       ) {
  //         matchedData = params.data;
  //       }

  //       // ✅ Check otherDevices
  //       if (!matchedData && params.data?.otherDevices?.length) {
  //         matchedData = params.data.otherDevices.find((d: any) =>
  //           d.GPSVendor !== 'Secutrak' && d.DeviceType === '23'
  //         );
  //       }

  //       return matchedData
  //         ? `<i class="fa fa-video-camera video-icon"
  //        title="Live Video"
  //        style="cursor:pointer"></i>`
  //         : '';
  //     },
  //     onCellClicked: (params: any) => {
  //       console.log("params", params);

  //       let matchedData = null;

  //       // ✅ Check main object
  //       if (
  //         params.data?.GPSVendor !== 'Secutrak' &&
  //         params.data?.DeviceType === '23'
  //       ) {
  //         matchedData = params.data;
  //       }

  //       // ✅ Check inside otherDevices
  //       if (!matchedData && params.data?.otherDevices?.length) {
  //         matchedData = params.data.otherDevices.find((d: any) =>
  //           d.GPSVendor !== 'Secutrak' && d.DeviceType === '23'
  //         );
  //       }

  //       // ✅ If found, send THAT object
  //       if (matchedData) {
  //         this.redirectLiveDashcam(matchedData);
  //       }
  //     }
  //     // onCellClicked: (params: any) => {
  //     //   console.log("params", params)
  //     //   if (params.data?.GPSVendor && params.data?.DeviceType == '23') {
  //     //     this.redirectLiveDashcam(params.data);
  //     //   }
  //     // }
  //   }

  // ];

  columnDefs = getVehicleColumnDefs(this);

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      tracking: [false],
      fromDate: [''],
      toDate: [''],
    });
  }

  openFilter(content: any) {}

  onButtonClick(label: string) {
    this.vehicleStore.setFilter(label);
  }

  setTab(tab: string) {
    this.activeTab = tab;
    // if (this.polylineMap) {
    //   this.polylineMap.forEach((polyline) => {
    //     polyline.setMap(null);
    //   });

    //   this.polylineMap.clear();
    // }
    // if (this.markers) {
    //   this.clearMarkers()
    //   this.markers.forEach(marker => marker.setMap(null));
    //   this.markers = [];
    // }
    // if (this.polyline) {
    //   this.polyline.setMap(null);
    //   // this.polyline = null;
    // }
    // if (this.stoppageFlagMarkers) {
    //   this.stoppageFlagMarkers.forEach((item: any) => {
    //     item.marker.setMap(null);
    //   })
    // }
    // if (this.Livemarkers) {
    //   this.Livemarkers.forEach((marker: any) => {

    //     marker.setMap(null);       // hide

    //   });
    // }
    // if (this.markerMap) {
    //   this.clearAllMarkers()
    // }
    // if (this.geofencePolygon) {
    //   this.geofencePolygon.setMap(null);
    //   this.geofencePolygon = null;
    // }
    // if (this.geofencePolygons) {
    //   this.geofencePolygons.forEach(p => p.setMap(null));
    //   this.geofencePolygons = [];
    // }
    // if (this.landmarkMarkers.length) {
    //   this.landmarkMarkers.forEach(m => m.setMap(null));
    //   this.landmarkMarkers = [];
    // }
    // if (tab == 'vehicle') {
    //   this.searchtab = false
    //   // this.vehiclegtrackingflag = true
    // }
    // else if (tab == 'location') {
    //   this.vehiclegtrackingflag = false
    //   this.rowData = this.locationRowData
    //   this.columns = [
    //     {
    //       type: 'checkbox', header: '',
    //       sortable: false,
    //       filterable: false
    //     },
    //     { header: 'Name', field: 'GeoName' },
    //     { header: 'Remark', field: 'Remark', width: 'auto' },
    //     {
    //       type: 'icon', header: 'View', iconClass: 'fa fa-eye', iconColor: '#2563eb',
    //       iconSize: 18,
    //       iconWidth: 50,
    //       iconHeight: 24,
    //       sortable: false,
    //       filterable: false
    //     },
    //     {
    //       type: 'icon', header: 'Delete', iconClass: 'fa fa-trash', iconColor: 'red',
    //       iconSize: 18,
    //       iconWidth: 70,
    //       iconHeight: 24,
    //       sortable: false,
    //       filterable: false
    //     }
    //   ];

    // }
    // else if (tab == "company") {
    //   this.searchtab = true
    //   this.vehiclegtrackingflag = false
    //   this.rowData = this.companyRowData
    //   this.columns = [
    //     {
    //       type: 'checkbox', header: '',
    //       sortable: false,
    //       filterable: false
    //     },
    //     { header: 'LandmarkName', field: 'LandmarkName' },
    //     {
    //       type: 'icon', header: 'View', iconClass: 'fa-edit', iconColor: '#2563eb',
    //       iconSize: 18,
    //       iconWidth: 50,
    //       iconHeight: 24,
    //       sortable: false,
    //       filterable: false
    //     },
    //     {
    //       type: 'icon', header: 'Delete', iconClass: 'fa-trash', iconColor: 'red',
    //       iconSize: 18,
    //       iconWidth: 70,
    //       iconHeight: 24,
    //       sortable: false,
    //       filterable: false
    //     }

    //   ];
    // }
    // else if (tab == "link") {
    //   this.vehiclegtrackingflag = false
    //   this.searchtab = false
    //   this.rowData = this.PolyLineData
    //   this.columns = [
    //     {
    //       type: 'checkbox', header: '',
    //       sortable: false,
    //       filterable: false
    //     },
    //     { header: 'PolyLineName', field: 'PolylineName' },
    //     // {
    //     //   type: 'icon', header: 'View', iconClass: 'fa fa-edit', iconColor: '#2563eb',
    //     //   iconSize: 18,
    //     //   iconWidth: 50,
    //     //   iconHeight: 24,
    //     //   sortable: false,
    //     //   filterable: false
    //     // },
    //     {
    //       type: 'icon', header: 'Delete', iconClass: 'fa fa-trash', iconColor: 'red',
    //       iconSize: 18,
    //       iconWidth: 70,
    //       iconHeight: 24,
    //       sortable: false,
    //       filterable: false
    //     }

    //   ];
    // }
    // else if (tab == 'user') {
    //   this.searchtab = false
    //   this.rowData = this.driver_list
    //   this.columns = [
    //     {
    //       type: 'checkbox',
    //       header: '',
    //       sortable: false,
    //       filterable: false
    //     },

    //     { header: 'Driver Name', field: 'Name' },
    //     { header: 'Assigned Vehicle', field: 'VehicleNo' },
    //     { header: 'Gender', field: 'Gender' },
    //     { header: 'Birth Date', field: 'BirthDate' },
    //     { header: 'Mobile Number', field: 'MobileNo' },

    //     {
    //       header: 'Alternate Mobile Number',
    //       field: 'AlternateMobileNo',
    //       valueGetter: (params: any) => {
    //         return params.data?.AlternateMobileNo === 'null'
    //           ? ''
    //           : params.data?.AlternateMobileNo;
    //       }
    //     },

    //     { header: 'Email Address', field: 'Email' },
    //     { header: 'Address', field: 'Address' },
    //     { header: 'Pincode', field: 'Pincode' },
    //     { header: 'City', field: 'CityName' },
    //     { header: 'State', field: 'StateName' },

    //     {
    //       header: 'Status',
    //       field: 'Status',
    //       cellRenderer: (params: any) => {
    //         return params.value == '1'
    //           ? `<span class="badge bg-success">Active</span>`
    //           : `<span class="badge bg-danger">Inactive</span>`;
    //       }
    //     },

    //     {
    //       type: 'icon',
    //       header: 'Edit',
    //       iconClass: 'fa fa-pencil',
    //       iconColor: '#2563eb',
    //       iconSize: 18,
    //       iconWidth: 50,
    //       sortable: false,
    //       filterable: false
    //     },

    //     {
    //       type: 'icon',
    //       header: 'Delete',
    //       iconClass: 'fa fa-trash',
    //       iconColor: 'red',
    //       iconSize: 18,
    //       iconWidth: 50,
    //       sortable: false,
    //       filterable: false
    //     }
    //   ];
    // }
  }

  // getVehicleClass(status: string): string {
  //   // console.log("class", status)
  //   switch (status) {
  //     case 'Active':
  //       return 'vehicle-active';
  //     case 'InActive':
  //       return 'vehicle-inactive';
  //     case 'NoData':
  //       return 'vehicle-nodata';
  //     case 'Breakdown':
  //       return 'vehicle-breakdown';
  //     case 'NoGPS':
  //       return 'vehicle-nogps';
  //     default:
  //       return '';
  //   }
  // }
onSubmit() {


  console.log('filterform', this.filterForm.value);
  this.vehiclegtrackingflag=true
  const formatDate = (date: string) => {
    if (!date) return '';
    return date.replace('T', ' ') + ':00';
  };

  const payload = createFormData(this.AccessToken, {
    startdate: formatDate(this.filterForm.value.fromDate),
    enddate: formatDate(this.filterForm.value.toDate),
    time_interval: this.time_interval,
    imei: this.selectedVehicles[0].ImeiNo,
    cell_id: this.useCellId || '',
    group_type: this.GroupType,
    group_id: this.GroupId,
    AccountId: this.AccountId,
    address: '1',
  });

  this.trakingdata(payload);
}


  trakingdata(payload:any){
        this.service.MAP_1(payload).subscribe({
            next: (res: any) => {
              const sessionExp = handleSessionExpiry(res, this.toastService);
              if (sessionExp) return;
      
              const success = handleApiResponse(res, this.toastService);
              if (!success) return;
      
              // 🔥 same structure as old code
               this.mapData = {
      points: res.data,
      stoppages: res.stoppages
    };
              console.log("track",res)
            },
            error: (err) => handleApiError(err, this.toastService),
          });
  }

  onTrackingToggle(event: any) {
    this.isTracking = event.target.checked;
  }


  //     onGridReady(params: GridReadyEvent) {
  //        this.gridApi = params.api;

  //      }

  //       onSelectionChanged(event: any) {
  //   if (!this.gridApi) return;

  //   const selectedNodes = this.gridApi.getSelectedNodes();
  //   const selectedRows = this.gridApi.getSelectedRows();

  //   // 🟢 LOCATION MODE → allow ONLY ONE row
  //   if (!this.isTracking) {
  //     if (selectedNodes.length > 1) {
  //       const lastSelected = selectedNodes[selectedNodes.length - 1];

  //       this.gridApi.deselectAll();
  //       lastSelected.setSelected(true);

  //       this.selectedVehicles = [lastSelected.data];
  //     } else {
  //       this.selectedVehicles = selectedRows;
  //     }

  //     if (this.selectedVehicles.length === 1) {
  //       // console.log('Location selected:', this.selectedVehicles[0]);
  //     }
  //   }

  //   // 🔵 TRACKING MODE → allow MULTIPLE rows
  //   else {
  //     this.selectedVehicles = selectedRows;

  //   }
  //   console.log('Tracking selected vehicles:', this.selectedVehicles);
  // }

  onSelectionChanged(data: any[]) {
    if (!this.isTracking && data.length > 1) {
      // ❌ only allow one
      this.selectedVehicles = [data[data.length - 1]];
    } else {
      // ✅ multi allowed
      this.selectedVehicles = data;
    }

    console.log('Selected:', this.selectedVehicles);
  }

  redirectLiveDashcam(data: any) {
    console.log('data', data);
    console.log('reports', this.filterForm.get('fromDate')?.value ?? '');
    localStorage.setItem(
      'fromdate',
      this.filterForm.get('fromDate')?.value ?? '',
    );
    localStorage.setItem('todate', this.filterForm.get('toDate')?.value ?? '');
    console.log('dashcam', data);
    localStorage.setItem('dashcam', JSON.stringify(data));
    console.log('dashcam....', localStorage.getItem('dashcam')!);
    // sessionStorage.setItem("dashcam", data)
    if (data.GPSVendor == 'Secutrak' || data.GPSVendor == 'Android/IOS') {
      this.router.navigate(['/dms/thirdlive']);
      // let link = `https://upfcs.secutrak.in/dashcam/auth/login/?exttkn=${localStorage.getItem('AccessToken')}`
      // window.open(link, '_blank');
    } else {
      this.router.navigate(['/dms/thirdlive']);
      // let link = `https://live-streaming.web.app/protocols/cvpro/index.html?deviceId=${data.MobileNo}&uniqueId=${data.ImeiNo}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTc1Njc1MzQsIm5iZiI6MTc1NzU2NzUzNCwianRpIjoiMzAxZTU0MDktNzIxNC00YWMzLTg1NDctOTZjZWE0OTdmMDc4IiwiZXhwIjoxNzU3ODI2NzM0LCJpZGVudGl0eSI6eyJpZCI6MTA4MzI3LCJkYiI6MCwiY28iOjEsIm5hbWUiOiJBcmhhbWFtYnVsYW5jZSIsInR5cGUiOiJhZG1pbiIsInJlYWRfb25seSI6MCwidHoiOi0zMzAsInR6X3MiOiJBc2lhL0tvbGthdGEiLCJzc28iOjAsImxhdCI6MEUtMTAsImxuZyI6MEUtMTAsImRldmljZSI6IndlYiIsImFsaWFzIjoiIn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.Eq_GJEa-Y3BU8bTlrvuYi0ALoxYZQtsTUO1Ad0MYnOU&streamingUrl=https://streaming.track360.net.in&authUrl=https://prod-s1.track360.net.in/api/v1/auth/&channel=[1,2,3]`
      // window.open(link, '_blank');
    }
  }

  onCellIdChange(event: any) {
    this.useCellId = event.target.checked ? "1" : "0";
    console.log("Use CellId Value:", this.useCellId);
  }



  getIntervalValaue(event: any) {
    console.log("event", event.target.value)
    this.time_interval = event.target.value
    // this.live_tracking()
  }

    // this.useLandmark = event.target.checked ? "1" : "0";
    // if (event.target.checked) {
    //   this.plotLandmarks(this.companyRowData)
    // }
    // else {
    //   if (this.landmarkMarkers.length) {
    //     this.landmarkMarkers.forEach(m => m.setMap(null));
    //     this.landmarkMarkers = [];
    //   }
    // }
  // }


    onLandmarkChange(event: any) {
    this.useLandmark = event.target.checked ? "1" : "0";
    // if (event.target.checked) {
    //   this.plotLandmarks(this.companyRowData)
    // }
    // else {
    //   if (this.landmarkMarkers.length) {
    //     this.landmarkMarkers.forEach(m => m.setMap(null));
    //     this.landmarkMarkers = [];
    //   }
    // }
  }


onPlayToggle(value: boolean) {
  // debugger
  console.log("HOME TOGGLE:", value);

  // 🔥 force new reference (important)
  this.plauytrackFlag = value ? true : false;
}
  onGeofenceChange(event: any) {
    this.useGeofence = event.target.checked ? "1" : "0";
    // if (event.target.checked) {
    //   this.plotGeofences()
    // }
    // else {
    //   this.clearGeofences()
    // }
  }
 
 
}

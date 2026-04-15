import { CommonModule } from '@angular/common';
import { Component, computed, inject, NgZone, Pipe, signal, ViewChild } from '@angular/core';
import { LinkPanelComponent } from '../link-panel/link-panel.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../home.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbAccordionModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { catchError, finalize, map, takeWhile } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as echarts from 'echarts';
import { filter } from 'rxjs/operators';
import { forkJoin, of, timer } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';


import {
  ClientSideRowModelModule,

  ColGroupDef,
  GridApi,

  GridReadyEvent,

  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
} from 'ag-grid-community';
import { AllCommunityModule, ColDef, GridOptions, ModuleRegistry } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../theme.service';
import { Router } from '@angular/router';
import { TimeScale } from 'chart.js';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MarkerWithLabel } from '@googlemaps/markerwithlabel';
import { SharedModule } from "../../../../shared/shared.module";

ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule,]);
declare var $: any
declare var google: any
declare var bootstrap: any;
// declare var MarkerWithLabel: any;
// declare var markerClusterer: any;

@Component({
  selector: 'app-live',
  standalone: true,
  imports: [NgbAccordionModule, NgbModule, AgGridAngular, CommonModule, LinkPanelComponent, FormsModule, ReactiveFormsModule, CommonModule, NgSelectComponent,
    GoogleMapsModule, NgbModule, SharedModule],
  templateUrl: './live.component.html',
  styleUrl: './live.component.scss'
})
export class LiveComponent {
  constructor(private router: Router, private cdr: ChangeDetectorRef, private themeService: ThemeService, private modalService: NgbModal, private toastr: ToastrService, public service: HomeService, private fb: FormBuilder) {

  }
  gridApi_report: any;
  reportTableData: any[] = [];
  private apiService = inject(HomeService);
  private ngZone = inject(NgZone);
  private isTracking = signal<boolean>(false);
  readonly isTrackingActive = computed(() => this.isTracking());

  private pollingSubscription: Subscription | null = null;
  private readonly POLLING_INTERVAL = 5000;

  private vehiclesMap = new Map<string, any>();
  private hasInitialZoomDone = false;
  private iconCache = new Map<string, string>();
  ngOnInit() {
    this.get_vehicle_list()


    this.filter();
  }
  vehicleMarker: google.maps.Marker | null = null;
  previousPosition: google.maps.LatLng | null = null;
  animationInterval: any;
  liveTrackingSub!: Subscription;
  infoWindow = new google.maps.InfoWindow();
  clusterInfoWindow: google.maps.InfoWindow | null = null;
  vehicleInfoWindow: google.maps.InfoWindow | null = null;
  zoomThreshold = 14;
  mode: string = 'map'; // default selected
  showArrow: boolean = false;
  showTail: boolean = false;
  /////////////////////////map ////////////////////
  clusterMode: string = 'without';


  markerCluster!: MarkerClusterer;
  markers: google.maps.Marker[] = [];

  // map: google.maps.Map; // already you have
  data: any[] = []; // your vehicle array
  modalRef: any = null;
  isOpen = true;
  isLoading = false
  isSliderVisible = true;
  mapInstance: google.maps.Map | null = null;
  center = { lat: 28.6139, lng: 77.2090 };
  zoom = 5;
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
    }
  };

  selectedRows: any[] = [];
  rowData: any[] = [];
  columns!: any[];
  //////////////////////////////////////////////////////////////
  statusCount = {

    active: 0,
    inactive: 0,
    noGps: 0,
    noData: 0,
    breakdown: 0,
    all: 0
  };
  items = [
    { label: 'All', count: this.statusCount.all, color: '#1D4380' },
    { label: 'Active', count: this.statusCount.active, color: '#2d8d4e' },
    { label: 'NoData', count: this.statusCount.noData, color: 'red' },
    { label: 'Breakdown', count: this.statusCount.breakdown, color: '#d214149c' },
    { label: 'NoGPS', count: this.statusCount.noGps, color: '#3434d0' },
    { label: 'InActive', count: this.statusCount.inactive, color: '#696969' },


  ];
  filteredVehicleArray: any[] = [];
  vehicleArray: any = []
  searchText = '';
  showSearch = false;
  activeTab: string = 'vehicle';
  vehicleCategoryIds: string = '';
  vehicleMakeIds: string = '';
  vehicleModelIds: string = '';
  store_valuesmodel: any[] = [];
  selectAll: any = {};
  Filter_list: any = {};
  Filter_list_keys: string[] = [];

  searchKeyword: any = {};
  filteredFilterList: any = {};
  multi_array: { [id: string]: any; } = [];
  currentTab: string = '';



  searchedKeywordfilter: string = '';





  //////////////////////////////////////////

  onMapReady(map: google.maps.Map) {
    this.mapInstance = map;
    this.mapInstance.addListener('zoom_changed', () => {
      if (this.selectedRows.length > 10) {
        this.updateMarkers();
      }

    });

  }
  updateMarkers() {
    const zoom = this.mapInstance?.getZoom() || 0;

    this.clearAll();

    // 👉 If only one marker OR cluster disabled
    if (this.selectedRows.length <= 1 || this.clusterMode === 'with') {
      this.showLabeledMarkers();
      return;
    }

    // 👉 Zoom logic
    if (zoom < this.zoomThreshold) {
      this.showClusterMarkers();   // 🌍 cluster view
    } else {
      this.showLabeledMarkers();   // 🔍 detailed view
    }
  }
  clearAll() {
    // remove markers
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];

    // remove cluster
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
      this.markerCluster.setMap(null); // ✅ important
      this.markerCluster = null!;
    }
  }
  showClusterMarkers() {
    const clusterMarkers: google.maps.Marker[] = [];

    this.selectedRows.forEach(item => {
      if (!item.LatLong) return;

      const [lat, lng] = item.LatLong.split(',').map(Number);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        icon: {
          url: item.VehicleImage || 'assets/default-car.png',
          scaledSize: new google.maps.Size(50, 30)
        }
      });

      // 🧠 Attach custom data
      (marker as any).vehicleData = {
        vehicleNo: item.VehicleNo,
        status: item.VehicleStatus
      };

      clusterMarkers.push(marker);
    });

    this.markerCluster = new MarkerClusterer({
      map: this.mapInstance,
      markers: clusterMarkers,
      onClusterClick: (event, cluster, map) => {
        // ❌ prevent default zoom
        event.stop();

        this.openClusterInfo(cluster);
      }
    });


  }
  openInfoWindow(marker: any, v: any) {

    console.log("Marker Click Data:", marker, v);

    let address = "Loading address...";

    const content = () => {

      const mainHoleHtml = `
      <div style="margin-top:8px; padding-left:8px; border-left:3px solid #1d4380;">
        <div style="font-weight:600; color:#1d4380;">Main Hole</div>

        <div><b>IMEI:</b> ${v.ImeiNo || '-'}</div>
        <div><b>Status:</b> ${v.VehicleStatus || '-'}</div>
        <div><b>Running:</b> ${v.RunningStatus || '-'}</div>
        <div><b>Battery:</b> ${v.Battery || 0}% (${v.BatteryVoltage || 0}v)</div>
        <div><b>Speed:</b> ${v.Speed || 0} km/h</div>
        <div><b>Last Update:</b> ${v.DeviceTime || '-'}</div>
      </div>
    `;

      let otherDevicesHtml = '';

      if (v.otherDevices && v.otherDevices.length > 0) {
        otherDevicesHtml = v.otherDevices.map((d: any) => {
          return `
          <hr/>
          <div style="margin-top:8px; padding-left:8px; border-left:3px solid green;">
            <div style="font-weight:600; color:green;">
              ${d.Location || 'Delivery Hole'}
            </div>

            <div><b>IMEI:</b> ${d.ImeiNo || '-'}</div>
            <div><b>Status:</b> ${d.VehicleStatus || d.RunningStatus || '-'}</div>
            <div><b>Running:</b> ${d.RunningStatus || '-'}</div>
            <div><b>Battery:</b> ${d.Battery || 0}% (${d.BatteryVoltage || 0}v)</div>
            <div><b>Speed:</b> ${d.Speed || 0} km/h</div>
            <div><b>Last Update:</b> ${d.DeviceTime || '-'}</div>
          </div>
        `;
        }).join('');
      }

      return `
      <div class="info-card" style="color:#1d4380">

        <div class="info-header">
          🚚 ${v.VehicleNo || v.vnumber}
          <span style="margin-left:8px; font-size:12px; color:#555;">
            (${v.VehicleCategory || 'N/A'})
          </span>

          <span class="status ${v.VehicleStatus?.toLowerCase()}">
            ${v.VehicleStatus || '-'}
          </span>
        </div>

        <div class="info-body">

          <div><b>Driver Name:</b> ${v.DriverName || '-'}</div>

          <div>
            <b>Address:</b>
            <span>${address}</span>
          </div>

          <div class="coords">
            (${marker.getPosition()?.lat().toFixed(6)},
             ${marker.getPosition()?.lng().toFixed(6)})
          </div>

          ${mainHoleHtml}
          ${otherDevicesHtml}

        </div>

        <div class="info-actions">
          <button onclick="window.changeDriver('${v.VehicleId}')">Driver</button>
          <button onclick="window.changeStatus('${v.VehicleId}')">Status</button>
          <button onclick="window.addLandmark('${v.VehicleId}')">Landmark</button>
          <button onclick="window.addGeofence('${v.VehicleId}')">Geofence</button>
        </div>

      </div>
    `;
    };

    // ✅ STEP 1: show loading UI first
    this.infoWindow.setContent(content());
    this.infoWindow.setPosition(marker.getPosition());
    this.infoWindow.open(this.mapInstance);

    // ✅ STEP 2: Fetch address
    const formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    formData.append('VehicleId', v.VehicleId);
    formData.append('ImeiNo', v.ImeiNo);
    formData.append(
      'LatLong',
      `${marker.getPosition()?.lat()},${marker.getPosition()?.lng()}`
    );

    this.service.Lastlocation(formData).subscribe((res: any) => {

      if (res.Status === "Failed") {
        localStorage.removeItem('AccessToken');
        alert("Session expired! Login again");
        location.href = 'https://secutrak.in/logout';
        return;
      }

      address = res.Data?.Address || "N/A";

      // ✅ STEP 3: Update UI with real address
      this.infoWindow.setContent(content());

    }, (err) => {
      console.error("Address API error:", err);
    });
  }

  showLabeledMarkersold() {
    this.selectedRows.forEach(item => {
      if (!item.LatLong) return;

      const [lat, lng] = item.LatLong.split(',').map(Number);

      const marker = new MarkerWithLabel({
        position: { lat, lng },
        map: this.mapInstance,

        icon: {
          url: item.VehicleImage || 'assets/default-car.png',
          scaledSize: new google.maps.Size(50, 30)
        },

        labelContent: `
        <span style="
          color:${this.getStatusColor(item.VehicleStatus)};
          font-weight:bold;
        ">
          ${item.VehicleNo}
        </span>
      `,

        labelClass: 'vehicle-label',
        labelAnchor: new google.maps.Point(20, -5)
      });
      marker.addListener('click', () => {
        this.openInfoWindow(marker, item);
      });
      this.markers.push(marker);
    });
  }
  showLabeledMarkers() {

    this.markers = [];

    this.selectedRows.forEach(item => {

      if (!item.LatLong) return;

      const [lat, lng] = item.LatLong.split(',').map(Number);

      const marker = new MarkerWithLabel({
        position: { lat, lng },
        map: this.mapInstance,

        icon: {
          url: item.VehicleImage || 'assets/default-car.png',
          scaledSize: new google.maps.Size(50, 30)
        },

        labelContent: `
        <span style="
          color:${this.getStatusColor(item.VehicleStatus)};
          font-weight:bold;
        ">
          ${item.VehicleNo}
        </span>
      `,

        labelClass: 'vehicle-label',
        labelAnchor: new google.maps.Point(20, -5)
      });

      // ✅ CLICK EVENT (FIXED)
      marker.addListener('click', () => {
        this.openInfoWindow(marker, item);
      });

      this.markers.push(marker);
    });
  }
  openClusterInfo(cluster: any) {
    const markers = cluster.markers;

    // Close old cluster window
    if (this.clusterInfoWindow) {
      this.clusterInfoWindow.close();
    }

    let content = `
    <div id="clusterTable" style="max-height:220px; overflow:auto;">
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:6px; border:1px solid #ddd;">Vehicle No</th>
            <th style="padding:6px; border:1px solid #ddd;">Status</th>
          </tr>
        </thead>
        <tbody>
  `;

    markers.forEach((m: any, index: number) => {
      const data = m.vehicleData;

      content += `
      <tr class="vehicle-row" data-index="${index}" style="cursor:pointer;">
        <td style="padding:6px; border:1px solid #ddd; color:blue;">
          ${data.vehicleNo}
        </td>
        <td style="padding:6px; border:1px solid #ddd;">
          ${data.status}
        </td>
      </tr>
    `;
    });

    content += `</tbody></table></div>`;

    this.clusterInfoWindow = new google.maps.InfoWindow({
      content,
      position: cluster.position
    });

    this.clusterInfoWindow?.open(this.mapInstance);

    // Bind click events properly
    google.maps.event.addListenerOnce(this.clusterInfoWindow, 'domready', () => {
      const container = document.getElementById('clusterTable');

      if (!container) return;

      container.querySelectorAll('.vehicle-row').forEach((row: any) => {
        row.addEventListener('click', (e: any) => {
          e.stopPropagation();

          const index = row.getAttribute('data-index');
          const marker = markers[index];

          // 👉 Close cluster list FIRST
          this.clusterInfoWindow?.close();

          // 👉 Open vehicle with zoom
          this.openVehicleInfo(marker);
        });
      });
    });
  }



  openVehicleInfo(marker: any) {
    const data = marker.vehicleData;

    // Close previous vehicle window
    if (this.vehicleInfoWindow) {
      this.vehicleInfoWindow.close();
    }

    // 🎯 Center + Zoom (this is what you wanted)
    this.mapInstance?.panTo(marker.getPosition());
    this.mapInstance?.setZoom(15); // adjust zoom level as needed

    this.vehicleInfoWindow = new google.maps.InfoWindow({
      content: `
      <div>
        <h4>${data.vehicleNo}</h4>
        <p>Status: ${data.status}</p>
      </div>
    `
    });

    this.vehicleInfoWindow?.open(this.mapInstance, marker);
  }
  toggleSlider() {
    this.isOpen = !this.isOpen;
  }
  openFilter(content: any) {
    // If already open → do nothing
    if (this.modalRef) {
      return;
    }

    this.modalRef = this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: false,
    });

    // When modal closes → reset reference
    this.modalRef.result.finally(() => {
      this.modalRef = null;
    });
  }
  onsearch_filter(key: string) {

    const keyword = (this.searchKeyword[key] || '').toLowerCase().trim();

    if (!keyword) {

      this.filteredFilterList[key] = [...(this.Filter_list[key] || [])];

      return;
    }

    this.filteredFilterList[key] = (this.Filter_list[key] || []).filter((item: any) =>
      (item.name || '').toLowerCase().includes(keyword)
    );

  }
  filter() {

    const formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);

    this.service.Filter(formData).subscribe((res: any) => {
      console.log("filter", res)

      if (res.Status === 'success') {

        this.Filter_list = res.FilterData || {};

        this.Filter_list_keys = Object.keys(this.Filter_list);

        // initialize search + filtered list
        this.Filter_list_keys.forEach((key: string) => {

          this.searchKeyword[key] = '';

          this.filteredFilterList[key] = (this.Filter_list[key] || []).map((item: any) => ({
            ...item,
            checked: item.checked || false
          }));
          this.selectAll[key] = false;

        });

      }

    });

  }
  Tabs(key: string) {
    this.currentTab = key;
  }
  resetFilters() {

    this.Filter_list_keys.forEach((key: any) => {
      this.filteredFilterList[key].forEach((item: any) => item.checked = false);
      this.selectAll[key] = false;
    });

  }
  getSelectedIds(key: string): string {

    if (!this.filteredFilterList[key]) return '';

    return this.filteredFilterList[key]
      .filter((item: any) => item.checked)
      .map((item: any) => item.id)
      .join(',');

  }
  filters() {

    const vehicleCategoryIds = this.getSelectedIds('VehicleCategory');
    const vehicleMakeIds = this.getSelectedIds('VehicleMake');
    const vehicleModelIds = this.getSelectedIds('VehicleModel');

    console.log("Category:", vehicleCategoryIds);
    console.log("Make:", vehicleMakeIds);
    console.log("Model:", vehicleModelIds);
    //  this.SpinnerService.show();

    var arrays: any = [];
    for (var i = 0; i < this.Filter_list_keys.length; i++) {
      // multi_array['this.Filter_list_keys[]']=[];
      var keys = this.Filter_list_keys[i];
      arrays = [];
      for (var j = 0; j < this.Filter_list[keys].length; j++) {
        if (this.Filter_list[keys][j].checked == true) {
          arrays.push(this.Filter_list[keys][j].id);
        }
      }
      var strings = arrays.toString()
      this.multi_array[keys] = strings;
    }
    this.vehicle_filter();
  }
  vehicle_filter() {

    console.log("multiarray", this.multi_array)
    var formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    // for (var j = 0; j < this.Filter_list[keys].length; j++) {}
    // Districts,Agency,LoadedUnloaded


    if (this.multi_array['Plant'] !== undefined && this.multi_array['Plant'] !== '') {

      formData.append('Plants', this.multi_array['Plant']);
    }
    if (this.multi_array['Transporter'] !== undefined && this.multi_array['Transporter'] !== '') {

      formData.append('Transporters', this.multi_array['Transporter']);
    }
    if (this.multi_array['Region'] !== '' && this.multi_array['Region'] !== undefined) {

      formData.append('Regions', this.multi_array['Region']);
    }
    // if (this.geocoord !== undefined) {

    //   formData.append('Users', this.geocoord);
    // }
    if (this.multi_array['VehicleCategory'] !== '' && this.multi_array['VehicleCategory'] !== undefined) {

      formData.append('VehicleCategories', this.multi_array['VehicleCategory']);
    }
    // formData.append('VehicleCategories', '1');
    if (this.multi_array['VehicleMake'] !== '' && this.multi_array['VehicleMake'] !== undefined) {

      formData.append('VehicleMakes', this.multi_array['VehicleMake']);
    }
    if (this.multi_array['VehicleModel'] !== '' && this.multi_array['VehicleModel'] !== undefined) {
      formData.append('VehicleModels ', this.multi_array['VehicleModel']);
    }






    // this.service.vehicle_filter(formData).subscribe((res: any) => {
    //   console.log("filter responce ", res)

    //   if (res.Status == "failed") {




    //     alert("Data not found");
    //   }
    //   else {

    //   }
    // });
  }
  setTab(tab: string) {
    this.activeTab = tab;
    if (tab == 'vehicle') {


      this.rowData = this.filteredVehicleArray
      this.columns = [
        {
          type: 'checkbox', header: '',
          sortable: false,
          filterable: false
        },
        {
          header: 'Vehicle No',
          field: 'VehicleNo',
          type: 'textclass',

          iconColor: (row: any) => this.getVehicleClass(row.VehicleStatus) // returns CSS class
        },

        {
          type: 'iconclass',
          header: 'Battery',
          width: 100,

          iconClass: (row: any) => {
            const b = row.Battery;

            if (b == 0) return 'fa-battery-empty';
            else if (b < 25) return 'fa-battery-quarter';
            else if (b < 50) return 'fa-battery-half';
            else if (b < 75) return 'fa-battery-three-quarters';
            else return 'fa-battery-full';
          },
          iconColor: (row: any) => {
            return this.getVehicleClass(row.VehicleStatus); // should return color like 'red', '#28a745'
          },
          tooltip: (row: any) => {
            return `Battery-Level-${row.Battery} | Volt-${row.BatteryVoltage}`;
          },
          iconSize: 18,
          iconWidth: 50,
          sortable: false,
          filterable: false
        }

      ];
    }
    else if (tab == 'live') {
      this.rowData = [...this.selectedRows];
      console.log("row", this.rowData)
      this.columns = [
        {
          header: 'Vehicle No',
          field: 'VehicleNo',
          type: 'textclass',

          iconColor: (row: any) => this.getVehicleClass(row.VehicleStatus) // returns CSS class
        },
        {
          type: 'iconclass',
          header: 'Battery',
          width: 100,

          iconClass: (row: any) => {
            const b = row.Battery;

            if (b == 0) return 'fa-battery-empty';
            else if (b < 25) return 'fa-battery-quarter';
            else if (b < 50) return 'fa-battery-half';
            else if (b < 75) return 'fa-battery-three-quarters';
            else return 'fa-battery-full';
          },
          iconColor: (row: any) => {
            return this.getVehicleClass(row.VehicleStatus); // should return color like 'red', '#28a745'
          },
          tooltip: (row: any) => {
            return `Battery-Level-${row.Battery} | Volt-${row.BatteryVoltage}`;
          },
          iconSize: 18,
          iconWidth: 50,
          sortable: false,
          filterable: false
        }
      ]

    }

  }
  toggleSelectAll(key: string) {

    const checked = this.selectAll[key];

    this.filteredFilterList[key].forEach((item: any) => {
      item.checked = checked;
    });

  }
  toggleSearch() {
    this.showSearch = !this.showSearch;

    if (!this.showSearch) {
      this.searchText = '';
      this.onSearchChange('');
    }
  }

  onSearchChange(value: string) {
    console.log('User search:', value);
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      this.filteredVehicleArray = [...this.vehicleArray];
      return;
    }

    this.filteredVehicleArray = this.vehicleArray.filter((link: any) =>
      link?.VehicleNo?.toLowerCase().includes(text) ||
      link?.sim?.toLowerCase().includes(text) ||
      link?.VehicleStatus?.toLowerCase().includes(text) ||
      link?.EngineStatus?.toLowerCase().includes(text)
    );
    // apply filter logic here
  }
  get_vehicle_list() {
    var formdataCustomer = new FormData()
    formdataCustomer.append('AccessToken', localStorage.getItem("AccessToken")!)


    this.service.vehicleList(formdataCustomer).subscribe((res: any) => {
      if (res.Status == "failed") {
        alert(res.Message)

        return;
      }
      console.log("vehicle", res.VehicleList)
      // this.vehicleArray = Object.entries(res.VehicleList).map(([key, value]) => ({
      //   ...(value as any)




      // }));
      // this.vehicleArray = Object.entries(res.VehicleList).map(
      //   ([key, value]) => ({
      //     ...(value as any),
      //     VehicleNo: key   // 👈 push key into row
      //   })
      // );

      // this.filteredVehicleArray = [...this.vehicleArray];
      /////////////////////////
      this.vehicleArray = Object.entries(res.VehicleList).map(
        ([key, value]) => ({
          ...(value as any),
          VehicleNo: key
        })
      );

      // 🎯 Status priority map
      const statusPriority: any = {
        'Active': 1,
        'NoData': 2,
        'Breakdown': 3,
        'NoGPS': 4,
        'InActive': 5
      };

      // 🧹 Sort based on priority
      this.vehicleArray.sort((a: any, b: any) => {
        const aPriority = statusPriority[a.VehicleStatus] || 99;
        const bPriority = statusPriority[b.VehicleStatus] || 99;
        return aPriority - bPriority;
      });

      // 🔁 Assign filtered list
      this.filteredVehicleArray = [...this.vehicleArray];
      this.setTab('vehicle')

      this.statusCount = {
        active: 0,
        inactive: 0,
        noGps: 0,
        noData: 0,
        breakdown: 0,
        all: 0
      };
      this.vehicleArray.forEach((v: any) => {

        // Active / Inactive
        if (v.VehicleStatus === 'Active') {
          this.statusCount.active++;
        }


        // No GPS
        if (v.VehicleStatus === 'InActive') {
          this.statusCount.inactive++;
        }

        // No Data
        if (v.VehicleStatus === 'NoData') {
          this.statusCount.noData++;
        }
        if (v.VehicleStatus === 'NoGPS') {
          this.statusCount.noGps++;
        }

        // Breakdown
        if (v.VehicleStatus === 'Breakdown') {
          this.statusCount.breakdown++;
        }
        else {
          this.statusCount.all++;
        }

      });
      console.log("data", this.statusCount)
      this.items = [
        { label: 'All', count: this.statusCount.all, color: '#1D4380' },
        { label: 'Active', count: this.statusCount.active, color: '#2d8d4e' },
        { label: 'NoData', count: this.statusCount.noData, color: 'red' },
        { label: 'Breakdown', count: this.statusCount.breakdown, color: '#d214149c' },
        { label: 'NoGPS', count: this.statusCount.noGps, color: '#3434d0' },
        { label: 'InActive', count: this.statusCount.inactive, color: '#9090a7' },


      ];
    })
  }
  onButtonClick(item: any) {
    console.log('Clicked:', item);
    if (item == 'All') {
      this.filteredVehicleArray = [...this.vehicleArray];
      return;
    }
    else {
      this.filteredVehicleArray = this.vehicleArray.filter(
        (link: any) => link?.VehicleStatus === item
      );

    }

  }
  getVehicleClass(status: string): string {
    // console.log("class", status)
    switch (status) {
      case 'Active':
        return 'vehicle-active';
      case 'InActive':
        return 'vehicle-inactive';
      case 'NoData':
        return 'vehicle-nodata';
      case 'Breakdown':
        return 'vehicle-breakdown';
      case 'NoGPS':
        return 'vehicle-nogps';
      default:
        return '';
    }
  }
  onSelectedRows(rows: any[]) {
    console.log("rows", rows)
    this.selectedRows = rows;
    if (this.activeTab == 'vehicle') {
      //////////////////////////////////////



      ////////////////////////////////////
      if (rows.length == 0) {
        this.center = { lat: 28.6139, lng: 77.2090 };
        this.zoom = 5;

        // this.zoom = 10;

      }
      else {

      }

    }
    else if (this.activeTab == 'live') {

      // // get selected polyline ids
      // const previousIds = this.selectedRows.map((r: any) => r.PolylineId);
      // const newIds = rows.map((r: any) => r.PolylineId);

      // // find unchecked polylines
      // const removed = previousIds.filter(id => !newIds.includes(id));

      // removed.forEach(id => {
      //   this.removePolyline(id);



    }
  }
  onModeChange() {
    console.log('Mode:', this.mode);
    if (this.mode == "text") {
      this.open_report()
    }
  }

  onSelectChange(event: any) {
    console.log('Selected:', event.target.value);
  }

  onGoClick() {
    console.log('Go clicked with mode:', this.selectedRows);
    if (this.mode == "map") {


      if (this.selectedRows.length == 0) {
        this.clearAll()
        this.stopTracking(); // reset if already running
        this.hasInitialZoomDone = false;
        this.clearAllVehicles();
        alert("Please select vehicle")
        return;
      }
      else if (this.selectedRows.length == 1) {
        this.clearAllVehicles();
        this.clearAll()
        this.startLiveTracking()

      }
      else if (this.selectedRows.length > 1) {
        this.clearAllVehicles();
        this.clearAll()
        this.stopTracking();
        this.onClusterChange()
      }
    }
    else {
      this.open_report()
    }
  }

  startLiveTracking() {
    if (!this.selectedRows || this.selectedRows.length === 0) {
      console.warn('⚠️ No vehicle selected');
      return;
    }

    const payload = {
      ImeiNo: this.selectedRows[0].ImeiNo,
      AccessToken: localStorage.getItem('AccessToken')
    };

    this.startTracking(payload);
  }

  // =========================
  // 🔁 CORE TRACKING ENGINE
  // =========================
  private startTracking(payload: any) {
    this.stopTracking(); // reset if already running
    this.hasInitialZoomDone = false;
    this.clearAllVehicles();
    this.isTracking.set(true);

    this.pollingSubscription = timer(0, this.POLLING_INTERVAL)
      .pipe(
        takeWhile(() => this.isTracking()),
        switchMap(() => this.fetchVehicleData(payload))
      )
      .subscribe();
  }


  // // =========================
  // // 🌐 API CALL
  // // =========================
  private fetchVehicleData(payload: any) {
    const formData = new FormData();
    // formData.append('portal', 'itraceit');
    formData.append('ImeiNo', payload.ImeiNo);
    formData.append('AccessToken', payload.AccessToken);

    return this.apiService.live_tracking(formData).pipe(
      map((res: any) => {
        if (res?.Status === 'success') {
          this.processVehicleUpdates(res.Data);
        }
      }),
      catchError(() => of(null))
    );
  }



  private async processVehicleUpdatesnew(data: any[]) {
    if (!this.mapInstance) return;

    for (const v of data) {
      if (!v?.LatLong) continue;

      const [lat, lng] = v.LatLong.split(',').map(Number);
      const id = v.VehicleNo || v.ImeiNo;

      let vehicle = this.vehiclesMap.get(id);
      const newPosition = new google.maps.LatLng(lat, lng);

      // =============================
      // 🆕 CREATE VEHICLE
      // =============================
      if (!vehicle) {
        const iconObj = await this.getVehicleIconByStatus(v.vehicleStatus);

        const marker = new google.maps.Marker({
          position: newPosition,
          map: this.mapInstance,
          title: id,
          optimized: false,
          icon: {
            url: iconObj.url,
            scaledSize: new google.maps.Size(30, 15), // truck shape
            anchor: new google.maps.Point(15, 7),
          }
        });

        const polyline = new google.maps.Polyline({
          path: [newPosition],
          map: this.mapInstance,
          strokeColor: '#1D4380',
          strokeWeight: 2
        });

        this.vehiclesMap.set(id, {
          marker,
          polyline,
          lastLat: lat,
          lastLng: lng,
          status: v.vehicleStatus,
          baseIconUrl: iconObj.url
        });

        continue;
      }

      // =============================
      // 🔁 UPDATE EXISTING VEHICLE
      // =============================
      const marker = vehicle.marker;
      const oldPosition = marker.getPosition();

      if (!oldPosition) {
        marker.setPosition(newPosition);
        continue;
      }

      // 🎯 CALCULATE BEARING
      const bearing = this.getBearing(oldPosition, newPosition);
      const adjustedBearing = (bearing - 90 + 360) % 360;

      // 🎨 STATUS CHANGE ICON UPDATE
      if (vehicle.status !== v.vehicleStatus) {
        const iconObj = await this.getVehicleIconByStatus(v.vehicleStatus);
        vehicle.baseIconUrl = iconObj.url;
        vehicle.status = v.vehicleStatus;
      }

      // 🔄 ROTATE ICON
      const rotatedIconUrl = await this.rotateImageIcon(
        vehicle.baseIconUrl,
        adjustedBearing
      );

      marker.setIcon({
        url: rotatedIconUrl,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15),
      });

      // 🚗 SMOOTH MOVEMENT + 🛣️ POLYLINE
      this.animateMarker(vehicle, newPosition);

      vehicle.lastLat = lat;
      vehicle.lastLng = lng;

      // 🎯 CAMERA FOLLOW
      this.smoothPanTo(newPosition);
    }
  }
  private async processVehicleUpdates(data: any[]) {
    if (!this.mapInstance) return;

    for (const v of data) {
      if (!v?.LatLong) continue;

      const [lat, lng] = v.LatLong.split(',').map(Number);
      const id = v.VehicleNo || v.ImeiNo;

      let vehicle = this.vehiclesMap.get(id);
      const newPosition = new google.maps.LatLng(lat, lng);

      // =============================
      // 🆕 CREATE VEHICLE
      // =============================
      if (!vehicle) {
        const iconObj = await this.getVehicleIconByStatus(v.vehicleStatus);

        const marker = new google.maps.Marker({
          position: newPosition,
          map: this.mapInstance,
          title: id,
          optimized: false,
          icon: {
            url: iconObj.url,
            scaledSize: new google.maps.Size(30, 15),
            anchor: new google.maps.Point(20, 20),
          }
        });

        const polyline = new google.maps.Polyline({
          path: [newPosition],
          map: this.mapInstance,
          strokeColor: '#1D4380',
          strokeWeight: 2
        });

        this.vehiclesMap.set(id, {
          marker,
          polyline,
          lastLat: lat,
          lastLng: lng,
          status: v.vehicleStatus,
          baseIconUrl: iconObj.url // ⭐ store original icon
        });

        continue;
      }

      // =============================
      // 🔁 UPDATE EXISTING VEHICLE
      // =============================
      const marker = vehicle.marker;
      const oldPosition = marker.getPosition();

      if (!oldPosition) {
        marker.setPosition(newPosition);
        continue;
      }

      // 🎯 CALCULATE BEARING
      const bearing = this.getBearing(oldPosition, newPosition);
      const adjustedBearing = (bearing - 90 + 360) % 360;

      // =============================
      // 🎨 UPDATE BASE ICON IF STATUS CHANGED
      // =============================
      if (vehicle.status !== v.vehicleStatus) {
        const iconObj = await this.getVehicleIconByStatus(v.vehicleStatus);
        vehicle.baseIconUrl = iconObj.url;
        vehicle.status = v.vehicleStatus;
      }

      // =============================
      // 🔄 ROTATE ICON (FROM BASE ONLY)
      // =============================
      const rotatedIconUrl = await this.rotateImageIcon(
        vehicle.baseIconUrl,
        adjustedBearing
      );

      marker.setIcon({
        url: rotatedIconUrl,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(20, 20),
      });

      // =============================
      // 🚗 SMOOTH MOVEMENT
      // =============================
      this.animateMarker(marker, newPosition);

      // =============================
      // 📍 UPDATE PATH
      // =============================
      const path = vehicle.polyline.getPath();
      path.push(newPosition);

      vehicle.lastLat = lat;
      vehicle.lastLng = lng;

      // =============================
      // 🎯 SMOOTH CAMERA FOLLOW
      // =============================
      this.smoothPanTo(newPosition);
    }
  }
  getBearing(from: google.maps.LatLng, to: google.maps.LatLng): number {
    const lat1 = from.lat() * (Math.PI / 180);
    const lat2 = to.lat() * (Math.PI / 180);
    const deltaLng = (to.lng() - from.lng()) * (Math.PI / 180);

    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    const angle = Math.atan2(y, x);
    return (angle * 180 / Math.PI + 360) % 360;
  }

  async rotateImageIconold(iconUrl: string, angle: number): Promise<string> {
    const key = `${iconUrl}_${Math.round(angle)}`;
    if (this.iconCache.has(key)) return this.iconCache.get(key)!;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = iconUrl;

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        const rad = (angle * Math.PI) / 180;

        // 🧠 Calculate bounding box after rotation
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));

        const newWidth = width * cos + height * sin;
        const newHeight = width * sin + height * cos;

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, newWidth, newHeight);

        // 🎯 Move to center
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);

        // 🖼️ Draw original size (no distortion!)
        ctx.drawImage(img, -width / 2, -height / 2);

        const url = canvas.toDataURL('image/png');
        this.iconCache.set(key, url);

        resolve(url);
      };

      img.onerror = () => resolve(iconUrl);
    });
  }
  async rotateImageIcon(iconUrl: string, angle: number): Promise<string> {
    const key = `${iconUrl}_${Math.round(angle)}`;
    if (this.iconCache.has(key)) return this.iconCache.get(key)!;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = iconUrl;

      img.onload = () => {
        // 🔒 Keep canvas square (important for rotation stability)
        const canvasSize = 50;

        // 🚛 Your truck dimensions (RECTANGLE preserved)
        const truckWidth = 40;
        const truckHeight = 20;

        const canvas = document.createElement('canvas');
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        const rad = (angle * Math.PI) / 180;

        // 🎯 move to center
        ctx.translate(canvasSize / 2, canvasSize / 2);
        ctx.rotate(rad);

        // 🖼️ draw RECTANGULAR truck (no distortion)
        ctx.drawImage(
          img,
          -truckWidth / 2,
          -truckHeight / 2,
          truckWidth,
          truckHeight
        );

        const url = canvas.toDataURL('image/png');
        this.iconCache.set(key, url);

        resolve(url);
      };

      img.onerror = () => resolve(iconUrl);
    });
  }
  animateMarker(marker: google.maps.Marker, newPosition: google.maps.LatLng): void {
    const oldPosition = marker.getPosition();
    if (!oldPosition) {
      marker.setPosition(newPosition);
      return;
    }

    const duration = 10000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const lat = oldPosition.lat() + (newPosition.lat() - oldPosition.lat()) * progress;
      const lng = oldPosition.lng() + (newPosition.lng() - oldPosition.lng()) * progress;

      marker.setPosition(new google.maps.LatLng(lat, lng));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
  animateMarkernew(
    vehicle: any,
    newPosition: google.maps.LatLng
  ): void {

    const marker = vehicle.marker;
    const polyline = vehicle.polyline;

    const oldPosition = marker.getPosition();
    if (!oldPosition) {
      marker.setPosition(newPosition);
      return;
    }

    // 🛑 STOP previous animation
    if (vehicle.animationId) {
      cancelAnimationFrame(vehicle.animationId);
    }

    const duration = 1000; // ⚡ keep less than API interval
    const startTime = performance.now();
    const path = polyline.getPath();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const lat =
        oldPosition.lat() + (newPosition.lat() - oldPosition.lat()) * progress;

      const lng =
        oldPosition.lng() + (newPosition.lng() - oldPosition.lng()) * progress;

      const intermediatePosition = new google.maps.LatLng(lat, lng);

      // 🚚 Move marker smoothly
      marker.setPosition(intermediatePosition);

      // 🛣️ Draw path gradually
      if (progress === 1 || progress % 0.2 < 0.02) {
        path.push(intermediatePosition);
      }

      if (progress < 1) {
        vehicle.animationId = requestAnimationFrame(animate);
      }
    };

    vehicle.animationId = requestAnimationFrame(animate);
  }
  async getVehicleIconByStatus(status: string): Promise<google.maps.Icon> {
    const baseUrl = 'assets/imagesnew/kml/vehicle/trucklive.png';

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = baseUrl;

      // img.onload = () => {
      //   const size = 40;

      //   const canvas = document.createElement('canvas');
      //   canvas.width = size;
      //   canvas.height = size;

      //   const ctx = canvas.getContext('2d')!;
      //   ctx.drawImage(img, 0, 0, size, size);

      //   const imageData = ctx.getImageData(0, 0, size, size);
      //   const data = imageData.data;

      //   let targetColor: [number, number, number] | null = null;

      //   if (status === 'Running') targetColor = [0, 255, 0];
      //   else if (status === 'Inactive') targetColor = [128, 128, 128];
      //   else if (status === 'Stopped') targetColor = null;

      //   if (targetColor) {
      //     for (let i = 0; i < data.length; i += 4) {
      //       const r = data[i];
      //       const g = data[i + 1];
      //       const b = data[i + 2];
      //       const a = data[i + 3];

      //       if (a > 0 && r > 150 && g < 100 && b < 100) {
      //         data[i] = targetColor[0];
      //         data[i + 1] = targetColor[1];
      //         data[i + 2] = targetColor[2];
      //       }
      //     }
      //     ctx.putImageData(imageData, 0, 0);
      //   }

      //   resolve({
      //     url: canvas.toDataURL('image/png'),
      //     scaledSize: new google.maps.Size(40, 40)
      //   });
      // };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Decide target color based on status
        let targetColor: [number, number, number] | null = null;
        if (status === 'Running') targetColor = [0, 255, 0]; // green
        else if (status === 'Inactive') targetColor = [128, 128, 128]; // grey
        else if (status === 'Stopped') targetColor = null; // red for stopped keep origina;
        // if Stopped, keep targetColor = null (no recolor)

        if (targetColor) {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Detect red-ish pixels
            if (a > 0 && r > 150 && g < 100 && b < 100) {
              data[i] = targetColor[0]; // new R
              data[i + 1] = targetColor[1]; // new G
              data[i + 2] = targetColor[2]; // new B
            }
          }
          ctx.putImageData(imageData, 0, 0);
        }

        resolve({
          url: canvas.toDataURL('image/png'),
          scaledSize: new google.maps.Size(img.width, img.height)
        });
      };
      img.onerror = () => {
        resolve({
          url: baseUrl,
          scaledSize: new google.maps.Size(40, 40)
        });
      };
    });
  }
  // =========================
  // 🎬 SMOOTH ANIMATION
  // =========================

  smoothPanToold(position: google.maps.LatLng) {
    const currentCenter = this.mapInstance?.getCenter();
    if (!currentCenter) return;

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      currentCenter,
      position,

    );

    if (distance > 200) {
      this.mapInstance?.panTo(position);
    }

  }
  smoothPanTo(target: google.maps.LatLng) {
    if (!this.mapInstance) return;

    const start = this.mapInstance.getCenter();
    if (!start) return;

    const duration = 1000; // 1 second smooth motion
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const lat = start.lat() + (target.lat() - start.lat()) * progress;
      const lng = start.lng() + (target.lng() - start.lng()) * progress;

      this.mapInstance!.setCenter(new google.maps.LatLng(lat, lng));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }



  ///////////////////////////////



  //////////////////////////////////////
  stopTracking() {
    this.isTracking.set(false);

    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }
  private clearAllVehicles() {
    this.vehiclesMap.forEach((vehicle) => {
      if (vehicle.marker) {
        vehicle.marker.setMap(null); // ❌ remove marker
      }

      if (vehicle.polyline) {
        vehicle.polyline.setMap(null); // ❌ remove path
      }
    });

    this.vehiclesMap.clear(); // 🧠 reset memory
  }
  // =========================
  // 🗺️ MAP SETTER
  // =========================
  setMapInstance(map: google.maps.Map) {
    this.mapInstance = map;
  }

  ngOnDestroy() {
    this.stopTracking();
  }


  onArrowChange() {
    console.log('Arrow:', this.showArrow);
  }

  onTailChange() {
    console.log('Tail:', this.showTail);
  }

  plotMarkersold() {
    this.removeMarkers();
    console.log("this.data", this.selectedRows)
    // Clear old cluster
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }

    this.selectedRows.forEach(item => {
      if (!item.LatLong || !item.LatLong.includes(',')) return;

      const [lat, lng] = item.LatLong.split(',').map(Number);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        title: item.VehicleNo
      });

      this.markers.push(marker);
    });

    if (this.clusterMode === 'without') {
      this.markers.forEach(m => m.setMap(this.mapInstance));
    } else {
      this.markerCluster = new MarkerClusterer({
        map: this.mapInstance,
        markers: this.markers
      });
    }
  }
  getStatusColor(status: string): string {
    if (!status) return '#ff3b30'; // red (no data)

    switch (status.toLowerCase()) {
      case 'active': return '#34c759'; // green
      default: return '#ff3b30';
    }
  }

  plotMarkers() {
    this.removeMarkers();

    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
    }

    this.selectedRows.forEach(item => {
      if (!item.LatLong || !item.LatLong.includes(',')) return;

      const [lat, lng] = item.LatLong.split(',').map(Number);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        title: item.VehicleNo,

        icon: {
          url: item.VehicleImage || 'assets/default-car.png',
          scaledSize: new google.maps.Size(40, 40)
        },

        label: {
          text: item.VehicleNo,
          color: this.getLabelColor(item.VehicleStatus),
          fontSize: '12px',
          fontWeight: 'bold'
        }
      });

      this.markers.push(marker);
    });

    if (this.clusterMode === 'without') {
      this.markers.forEach(m => m.setMap(this.mapInstance));
    } else {
      this.markerCluster = new MarkerClusterer({
        map: this.mapInstance,
        markers: this.markers
      });
    }
  }
  getLabelColor(status: string): string {
    if (!status) return 'red'; // no data
    if (status.toLowerCase() === 'active') return 'green';
    return 'red';
  }
  onClusterChange() {
    // alert(0)
    if (!this.mapInstance) return;

    this.updateMarkers(); // ✅ just trigger main logic
  }
  removeMarkers() {
    // remove normal markers
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    // remove cluster
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
      this.markerCluster = null!;
    }
  }
  defaultColDefReport: ColDef = {
    resizable: true,
    sortable: true,
    wrapText: true,
    autoHeight: true


  };
  columnDefsReport: ColDef[] = [
    {
      headerName: 'Vehicle No', field: 'vehicleNo', filter: true, minWidth: 200,
      wrapText: true,     // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'IMEI', field: 'imei', wrapText: true, minWidth: 200,   // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'SIM', field: 'simNo', wrapText: true, minWidth: 200,    // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'Contact', field: 'contact', wrapText: true, minWidth: 200,   // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'Speed', field: 'speed', wrapText: true, minWidth: 200,    // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'Battery', field: 'battery', wrapText: true, minWidth: 200,    // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'Date Time', field: 'datetime', wrapText: true, minWidth: 200,    // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'Last Halt', field: 'lastHalt', wrapText: true, minWidth: 200,   // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'Reg No', field: 'registrationNo', wrapText: true, minWidth: 200,    // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'Temp', field: 'temperature', wrapText: true, minWidth: 200,    // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'Main Hole', field: 'mainHoleDoor', wrapText: true, minWidth: 200,   // ✅ wrap text
      autoHeight: true
    },
    {
      headerName: 'Address',
      field: 'address',
      flex: 1,
      minWidth: 300,
      wrapText: true,     // ✅ wrap text
      autoHeight: true    // ✅ increase row height automatically
    }
  ];

  ngAfterViewInit() {
    const modalElement: any = document.getElementById('reportModal');

    modalElement.addEventListener('shown.bs.modal', () => {
      if (this.gridApi_report) {
        console.log("Resizing grid...");
        this.gridApi_report.sizeColumnsToFit();
        this.gridApi_report.refreshCells();
      }
    });
  }
  onModalShown = () => {
    console.log("Modal fully opened");

    if (this.gridApi_report) {
      this.gridApi_report.sizeColumnsToFit();
    }
  };
  onGridReadyreport(params: any) {
    this.gridApi_report = params.api;
  }
  open_report() {

    this.reportTableData = [];

    if (!this.selectedRows || this.selectedRows.length === 0) {
      alert("Please select vehicles");
      return;
    }

    const requests = this.selectedRows.map((vehicle: any) => {
      const formData = new FormData();
      formData.append('AccessToken', localStorage.getItem('AccessToken')!);
      formData.append('VehicleId', vehicle.VehicleId);
      formData.append('ImeiNo', vehicle.ImeiNo);
      formData.append('LatLong', vehicle.LatLong);

      return this.service.vehicle_report(formData);
    });

    // forkJoin(requests).subscribe((responses: any[]) => {

    //   this.reportTableData = responses.map((res, index) => {
    //     const vehicle = this.selectedVehicles[index];
    //     const report = res.Data;

    //     return {
    //       vehicleNo: vehicle.VehicleNo,
    //       imei: vehicle.ImeiNo,
    //       simNo: vehicle.SimNo,
    //       contact: vehicle.DriverNo || vehicle.MobileNo,
    //       registrationNo: vehicle.RegistrationNo,
    //       temperature: vehicle.Temperature,
    //       mainHoleDoor: vehicle.MainHoleDoor,

    //       speed: report.Speed,
    //       battery: report.Battery,
    //       datetime: report.DateTime,
    //       lastHalt: report.LastHaltTime,
    //       address: report.Address
    //     };
    //   });

    //   console.log("final table data", this.reportTableData);
    //   this.reportTableData = [...this.reportTableData];
    //   this.cdr.detectChanges();

    //   console.log("final table data", this.reportTableData);

    //   // 🎯 Get modal
    //   const modalElement: any = document.getElementById('reportModal');

    //   if (!modalElement) {
    //     console.error("Modal not found!");
    //     return;
    //   }

    //   // ✅ Attach event ONLY ONCE (avoid duplicates)
    //   modalElement.removeEventListener('shown.bs.modal', this.onModalShown);
    //   modalElement.addEventListener('shown.bs.modal', this.onModalShown);

    //   // 🚀 OPEN MODAL (OUTSIDE event!)
    //   const modal = new bootstrap.Modal(modalElement);
    //   modal.show();
    //   setTimeout(() => {
    //     this.table_node()
    //   }, 500);


    // });
    // 🎯 OPEN MODAL DIRECTLY
    // const modalElement: any = document.getElementById('reportModal');

    forkJoin(requests).subscribe((responses: any[]) => {

      this.reportTableData = responses.map((res, index) => {
        const vehicle = this.selectedRows[index];
        const report = res.Data;

        return {
          vehicleNo: vehicle.VehicleNo,
          imei: vehicle.ImeiNo,
          simNo: vehicle.SimNo,
          contact: vehicle.DriverNo || vehicle.MobileNo,
          registrationNo: vehicle.RegistrationNo,
          temperature: vehicle.Temperature,
          mainHoleDoor: vehicle.MainHoleDoor,
          speed: report.Speed,
          battery: report.Battery,
          datetime: report.DateTime,
          lastHalt: report.LastHaltTime,
          address: report.Address
        };
      });

      this.cdr.detectChanges(); // 🔥 ensure DOM updated

      const modalElement: any = document.getElementById('reportModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();


      $('.modal-backdrop').remove();

      // this.initDataTable();




    });

  }
  onQuickFilterChanged(event: any) {
    // const value = event.target.value;
    // this.gridApi_report.setQuickFilter(value);
    this.gridApi_report.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    )
  }

  // 📊 Export Excel
  exportExcel() {
    this.gridApi_report.exportDataAsExcel({
      fileName: 'Vehicle_Report.xlsx'
    });
  }

  // 📄 Export CSV
  exportCSV() {
    this.gridApi_report.exportDataAsCsv({
      fileName: 'Vehicle_Report.csv'
    });
  }

  // 📕 Export PDF (basic)
  exportPDF() {
    const { jsPDF } = (window as any).jspdf;

    const rowData: any[] = [];

    // Collect data from grid
    this.gridApi_report.forEachNode((node: any) => {
      rowData.push(node.data);
    });

    if (!rowData.length) {
      alert('No data available');
      return;
    }

    // Headers
    const columns = this.columnDefsReport.map((col: any) => col.headerName);

    // Rows
    const rows = rowData.map((row: any) =>
      this.columnDefsReport.map((col: any) => row[col.field])
    );

    // Create PDF
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape

    // Title
    doc.setFontSize(14);
    doc.text('Vehicle Report', 14, 10);

    // Table
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 15,
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: [40, 167, 69] // green header
      }
    });

    // Save
    doc.save('Vehicle_Report.pdf');
  }

  // 📋 Copy Data
  copyData() {
    this.gridApi_report.copySelectedRowsToClipboard();
  }
  exportAsExcel() {
    // if (this.gridApi) {
    //   this.gridApi.exportDataAsCsv({ fileName: 'table-data.csv' });
    // }
    if (this.gridApi_report) {
      this.gridApi_report.exportDataAsCsv({
        fileName: 'tripReport-data.csv',
        processCellCallback: (params: any) => {
          const value = params.value;

          // Check if the column is Alert_Status_Text

          if (params.column.getColId() === 'Consignment_no') {
            // If the value is a large number, convert it to a string to avoid scientific notation
            return value ? `"${value}"` : '""';
          }
          // For other fields, handle complex data like arrays or objects
          if (Array.isArray(value)) {
            return value.map(item => {
              if (typeof item === 'object' && item !== null) {
                // If item is an object, extract relevant properties (e.g., alert_name, total_count)
                return Object.values(item).join(', '); // Joining values with a comma, adjust as needed
              }
              return item; // If it's not an object, just return the item itself
            }).join('; '); // Join array items with a semicolon or another separator
          }

          if (typeof value === 'object' && value !== null) {
            // If it's an object, just join the values, ignore key names
            return Object.values(value).join(', '); // Joining object values without keys
          }

          // Return value as-is for primitives (strings, numbers, booleans)
          return value;
        },
      });
    }
  }
}

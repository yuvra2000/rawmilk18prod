import { CommonModule } from '@angular/common';
import { Component, Pipe, ViewChild } from '@angular/core';
import { LinkPanelComponent } from '../link-panel/link-panel.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../home.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbAccordionModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as echarts from 'echarts';
import { filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
// import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';

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
import { SharedModule } from "../../../../shared/shared.module";
// import { LinkPanelComponent } from '../link-panel/link-panel.component';
// import { LinkPanelComponent } from '../link-panel/link-panel.component';
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule,]);
declare var $: any
declare var google: any
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbAccordionModule, NgbModule, AgGridAngular, CommonModule, FormsModule, ReactiveFormsModule, CommonModule, NgSelectComponent,LinkPanelComponent,
    GoogleMapsModule, NgbModule,SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  searchCoord: string = '';
  searchtab: boolean = true

  searchName: string = '';
  // landmarkData: any[] = []; // store your API response here
  markers_search: any[] = [];
  showArrows: boolean = true;
  gridApi_report: any;
  reportTableData: any[] = [];
  driver_list: any[] = [];
  top = 640;
  left = window.innerWidth - 350;

  isDragging = false;
  offsetX = 0;
  offsetY = 0;

  modalRef: any = null;
  vehiclegtrackingflag: boolean = false
  useCellId: string = "0";
  useLandmark: string = "0";
  useGeofence: string = "0";

  polylineMap = new Map<string, google.maps.Polyline>();
  PolyLineData: any = []
  // darkMapStyle = [
  //   { elementType: "geometry", stylers: [{ color: "#1e1e2f" }] },
  //   // { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  //   { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  //   { elementType: "labels.text.stroke", stylers: [{ color: "#1e1e2f" }] },
  //   // { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  //   { featureType: "water", elementType: "geometry", stylers: [{ color: "#193CB8" }] }
  //   // { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] }
  // ];
  darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },

    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },

    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },

    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }]
    },

    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }]
    },

    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }]
    },

    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }]
    },

    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }]
    },

    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }]
    },

    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }]
    },

    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }]
    },

    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }]
    },

    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },

    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }]
    },

    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }]
    },

    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }]
    }
  ];
  vehicleCategoryIds: string = '';
  vehicleMakeIds: string = '';
  vehicleModelIds: string = '';
  store_valuesmodel: any[] = [];
  selectAll: any = {};
  Filter_list: any = {};
  Filter_list_keys: string[] = [];

  searchKeyword: any = {};
  filteredFilterList: any = {};

  currentTab: string = '';



  searchedKeywordfilter: string = '';

  ///////////////////////////////



  // currentTab: string = '';
  searchedKeyword1: any;
  // filteredFilterList: any[] = [];
  // Location tab
  multi_array: { [id: string]: any; } = [];
  key_tabs: any = ""
  store_values: any = []
  filter_VehicleModel: any = []
  store_valuesmake: any = []
  Filter_data1: any = [];

  // Filter_list: any = []
  Filter_list1: any = []
  // Filter_list_keys: any = []
  vehicleInfowindowData: any
  Landmarktype: any = []
  vehicleStatus_Types: any = []
  landmarkForm!: FormGroup;
  showLandmarkPopup = false;
  landmarkMode = false;
  landmarkMarkers: google.maps.Marker[] = [];
  landmarkInfoWindow = new google.maps.InfoWindow();
  locationRowData: any[] = [];
  locationColumns: any[] = [];

  // Company tab
  companyRowData: any[] = [];
  companyColumns: any[] = [];

  // activeTab: string = 'location';
  // isDrawing = false;
  isGeoModalOpen = false;

  geoForm = {
    name: '',
    remark: ''
  };

  geoCoordinates: string = '';
  drawingControlDiv: HTMLElement | null = null;
  geofencePolygon: google.maps.Polygon | null = null;
  polygonCoords: google.maps.LatLng[] = [];
  isDrawing = false;
  geofenceCircle: google.maps.Circle | null = null;
  isPopupVisible: boolean = false
  trackData: any = []
  chartOption: any = []
  // polyline: any=[];
  leftbalace: any = 0
  polyline: google.maps.Polyline | null = null;
  polylinePath: google.maps.LatLngLiteral[] = [];
  markernew: any;
  currentIndex = 0;
  playInterval: any;
  animationFrame: any;
  chartData: any = []
  isLiveMarkerVisible = false;
  plauytrackFlag: boolean = false
  routePolyline!: google.maps.Polyline;

  // polylinePath: google.maps.LatLngLiteral[] = [];
  // markernew: any;
  // currentIndex = 0;
  // playInterval: any;
  // animationFrame: any;
  // chartData: any = []

  //  currentIndex = 0;
  // animationFrame: any;
  isPaused = false;
  isMinimized = false;
  // default playback speed (ms per segment)
  playbackSpeed = 2000; // 2 seconds
  // trackData: any = []
  // chartOption: any = []
  @ViewChild(LinkPanelComponent)
  table!: LinkPanelComponent;
  exportTrigger = 0;
  selectedRows: any[] = [];
  geofencePolygons: google.maps.Polygon[] = [];

  // geofencePolygon?: google.maps.Polygon;
  columns!: any[];
  rowData: any[] = [];
  userInteracting = false;
  markerVisibility: { [key: string]: boolean } = {
    green: true,
    yellow: true,
    red: true
  };
  arrowsVisible: boolean = true;
  isLoading = false
  boundsInitialized = false;
  show_balloons_div = false;

  showRed = true;
  showYellow = true;
  showGreen = true;
  showStartEnd = true;
  showPolyline = true;
  // polyline!: google.maps.Polyline;
  bounds!: google.maps.LatLngBounds;

  activeInfoWindow: any
  Map_info_stoppage_data: any = []
  Map_info: any = []
  time_interval: any = ""
  markers: any[] = [];
  Livemarkers: google.maps.Marker[] = [];

  infoWindow = new google.maps.InfoWindow();
  private stoppageFlagMarkers: { marker: google.maps.Marker, durationMinutes: number }[] = [];
  markerMap = new Map<string, google.maps.Marker>();
  mapInstance: google.maps.Map | null = null;

  // rowSelection: RowSelectionOptions | "single" | "multiple" = {
  //   mode: "multiRow",
  // };
  isTracking: boolean = false
  gridOptions: GridOptions = {
    rowSelection: {
      // mode: 'singleRow',
      mode: 'multiRow',
      checkboxes: true,
      headerCheckbox: false,
      selectAll: 'filtered',
      enableClickSelection: false   // 👈 replaces suppressRowClickSelection
    },
    // rowSelection: 'multiple',
    suppressRowClickSelection: true,
    enableCellTextSelection: true,
    suppressCellFocus: true
  };
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,


  };
  defaultColDefReport: ColDef = {
    resizable: true,
    sortable: true,
    wrapText: true,
    autoHeight: true


  };
  isReport = true;

  filteredVehicleArray: any[] = [];
  statusCount = {
    active: 0,
    inactive: 0,
    noGps: 0,
    noData: 0,
    breakdown: 0,
    all: 0
  };
  activeTab: string = 'vehicle';
  isOpen = true;
  showSearch = false;
  searchText = '';
  items = [
    { label: 'All', count: this.statusCount.all, color: '#1D4380' },
    { label: 'Active', count: this.statusCount.active, color: '#2d8d4e' },
    { label: 'NoData', count: this.statusCount.noData, color: 'red' },
    { label: 'Breakdown', count: this.statusCount.breakdown, color: '#d214149c' },
    { label: 'NoGPS', count: this.statusCount.noGps, color: '#3434d0' },
    { label: 'InActive', count: this.statusCount.inactive, color: '#696969' },


  ];
  Distance_variable = [
    { id: "0" },
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" },
    { id: "8" },
    { id: "9" },
    { id: "10" },
    { id: "20" },
    { id: "30" },
    { id: "40" },
    { id: "50" },
    { id: "60" },
    { id: "70" },
    { id: "80" },
    { id: "90" },
    { id: "100" },

  ]

  statusForm!: FormGroup;
  showStatusPopup = false;
  driverForm!: FormGroup;
  showdriverPopup = false;
  zoomLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  gridApi!: GridApi;
  constructor(private router: Router, private cdr: ChangeDetectorRef, private themeService: ThemeService, private modalService: NgbModal, private toastr: ToastrService, public service: HomeService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      tracking: [false],
      fromDate: [''],
      toDate: ['']
    });
  }
  ngOnInit() {
    // (window as any).redirectLiveDashcam = (rowIndex: number) => {
    //   const rowData = this.rowData[rowIndex];
    //   this.redirectLiveDashcam(rowData);
    // };
    (window as any).changeDriver = (vehicleId: string) => {
      this.openDriverPopup(vehicleId);
    };

    (window as any).changeStatus = (vehicleId: string) => {
      this.openStatusPopup(vehicleId);
    };

    (window as any).addLandmark = (vehicleId: string) => {
      this.openLandmarkPopup(vehicleId);
    };

    (window as any).addGeofence = (vehicleId: string) => {
      this.openGeofencePopup(vehicleId);
    };
    this.landmarkForm = new FormGroup({

      landmarkName: new FormControl('', Validators.required),
      landmarkType: new FormControl('', Validators.required),
      zoomLevel: new FormControl('1'),
      distanceVariable: new FormControl(''),
      coords: new FormControl(''),
      remark: new FormControl('')

    });
    // this.test()
    this.statusForm = this.fb.group({
      statusType: ['', Validators.required],
      startDate: ['', Validators.required],
      remark: ['']
    });
    this.driverForm = this.fb.group({
      driverName: ['', Validators.required],

    });
    this.get_vehicle_list()
    this.Driverlist()
    this.get_polyline()
    this.filter();
    this.vehicleStatusTypes()
    this.Landmark_type()
    this.geofencelist()
    this.landmarklist()
    this.filterForm.get('tracking')?.valueChanges.subscribe(isTracking => {
      this.updateSelectionMode(isTracking);
    });
    const now = new Date();
    const fromDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0
    );

    // To Date → current date & time
    const toDate = now;
    this.filterForm.patchValue({
      fromDate: this.formatDateTimeLocal(fromDate).replace('T', ' '),
      toDate: this.formatDateTimeLocal(toDate).replace('T', ' '),
    });
    this.columns = [
      {
        type: 'checkbox', header: '',
        sortable: false,
        filterable: false
      },
      { header: 'Name', field: 'GeoName' },
      { header: 'Remark', field: 'Remark' },
      {
        type: 'icon', header: 'View', iconClass: 'fa fa-eye', iconColor: '#2563eb',
        iconSize: 18,
        iconWidth: 50,
        iconHeight: 24,
        sortable: false,
        filterable: false
      },
      {
        type: 'icon', header: 'Delete', iconClass: 'fa fa-trash', iconColor: 'red',
        iconSize: 18,
        iconWidth: 70,
        iconHeight: 24,
        sortable: false,
        filterable: false
      }
    ];

    this.rowData = [

    ];

    this.markernew = new google.maps.Marker({
      map: this.mapInstance,
      // position: startPoint,
      // icon: this.getIcon(0)
    });
    this.themeService.theme$.subscribe(theme => {

      if (!this.mapInstance) return;

      if (theme === 'dark') {
        this.mapInstance.setOptions({ styles: this.darkMapStyle });
      } else {
        this.mapInstance.setOptions({ styles: [] });
      }

    });




  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;

    this.offsetX = event.clientX - this.left;
    this.offsetY = event.clientY - this.top;

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
  }

  onDrag = (event: MouseEvent) => {
    if (!this.isDragging) return;

    this.left = event.clientX - this.offsetX;
    this.top = event.clientY - this.offsetY;
  };

  stopDrag = () => {
    this.isDragging = false;

    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  };



  /////////////
  formatDateTimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return (
      date.getFullYear() + '-' +
      pad(date.getMonth() + 1) + '-' +
      pad(date.getDate()) + 'T' +
      pad(date.getHours()) + ':' +
      pad(date.getMinutes())
    );
  }
  test() {
    var formdataCustomer = new FormData()
    formdataCustomer.append('name', 'manoj')


    this.service.test(formdataCustomer).subscribe((res: any) => {
      console.log("vehicle", res)
    })
  }
  get_vehicle_list() {
    var formdataCustomer = new FormData()
    formdataCustomer.append('AccessToken', localStorage.getItem("AccessToken")!)


    this.service.vehicleList(formdataCustomer).subscribe((res: any) => {
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
  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.filteredVehicleArray = this.filteredVehicleArray.filter(d =>
      d.VehicleNo.toLowerCase().includes(val)
    );
  }

  toggleSlider() {
    this.isOpen = !this.isOpen;
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
  onFilterClick() {

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
  //////////////////////////////
  activeView: string = 'vehicle';

  setView(view: string) {
    this.activeView = view;
    console.log('Active View:', view);

    // optional: load API based on view
    // this.loadData(view);
  }
  get_polyline() {
    var formdataCustomer = new FormData()
    formdataCustomer.append('AccessToken', localStorage.getItem("AccessToken")!)


    this.service.polyline_full(formdataCustomer).subscribe((res: any) => {
      console.log("polyline_fullresponce", res)
      this.PolyLineData = res.Data
    })
  }
  setTab(tab: string) {
    this.activeTab = tab;
    if (this.polylineMap) {
      this.polylineMap.forEach((polyline) => {
        polyline.setMap(null);
      });

      this.polylineMap.clear();
    }
    if (this.markers) {
      this.clearMarkers()
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
    }
    if (this.polyline) {
      this.polyline.setMap(null);
      // this.polyline = null;
    }
    if (this.stoppageFlagMarkers) {
      this.stoppageFlagMarkers.forEach((item: any) => {
        item.marker.setMap(null);
      })
    }
    if (this.Livemarkers) {
      this.Livemarkers.forEach((marker: any) => {

        marker.setMap(null);       // hide


      });
    }
    if (this.markerMap) {
      this.clearAllMarkers()
    }
    if (this.geofencePolygon) {
      this.geofencePolygon.setMap(null);
      this.geofencePolygon = null;
    }
    if (this.geofencePolygons) {
      this.geofencePolygons.forEach(p => p.setMap(null));
      this.geofencePolygons = [];
    }
    if (this.landmarkMarkers.length) {
      this.landmarkMarkers.forEach(m => m.setMap(null));
      this.landmarkMarkers = [];
    }
    if (tab == 'vehicle') {
      this.searchtab = false
      // this.vehiclegtrackingflag = true
    }
    else if (tab == 'location') {
      this.vehiclegtrackingflag = false
      this.rowData = this.locationRowData
      this.columns = [
        {
          type: 'checkbox', header: '',
          sortable: false,
          filterable: false
        },
        { header: 'Name', field: 'GeoName' },
        { header: 'Remark', field: 'Remark', width: 'auto' },
        {
          type: 'icon', header: 'View', iconClass: 'fa fa-eye', iconColor: '#2563eb',
          iconSize: 18,
          iconWidth: 50,
          iconHeight: 24,
          sortable: false,
          filterable: false
        },
        {
          type: 'icon', header: 'Delete', iconClass: 'fa fa-trash', iconColor: 'red',
          iconSize: 18,
          iconWidth: 70,
          iconHeight: 24,
          sortable: false,
          filterable: false
        }
      ];

    }
    else if (tab == "company") {
      this.searchtab = true
      this.vehiclegtrackingflag = false
      this.rowData = this.companyRowData
      this.columns = [
        {
          type: 'checkbox', header: '',
          sortable: false,
          filterable: false
        },
        { header: 'LandmarkName', field: 'LandmarkName' },
        {
          type: 'icon', header: 'View', iconClass: 'fa-edit', iconColor: '#2563eb',
          iconSize: 18,
          iconWidth: 50,
          iconHeight: 24,
          sortable: false,
          filterable: false
        },
        {
          type: 'icon', header: 'Delete', iconClass: 'fa-trash', iconColor: 'red',
          iconSize: 18,
          iconWidth: 70,
          iconHeight: 24,
          sortable: false,
          filterable: false
        }


      ];
    }
    else if (tab == "link") {
      this.vehiclegtrackingflag = false
      this.searchtab = false
      this.rowData = this.PolyLineData
      this.columns = [
        {
          type: 'checkbox', header: '',
          sortable: false,
          filterable: false
        },
        { header: 'PolyLineName', field: 'PolylineName' },
        // {
        //   type: 'icon', header: 'View', iconClass: 'fa fa-edit', iconColor: '#2563eb',
        //   iconSize: 18,
        //   iconWidth: 50,
        //   iconHeight: 24,
        //   sortable: false,
        //   filterable: false
        // },
        {
          type: 'icon', header: 'Delete', iconClass: 'fa fa-trash', iconColor: 'red',
          iconSize: 18,
          iconWidth: 70,
          iconHeight: 24,
          sortable: false,
          filterable: false
        }


      ];
    }
    else if (tab == 'user') {
      this.searchtab = false
      this.rowData = this.driver_list
      this.columns = [
        {
          type: 'checkbox',
          header: '',
          sortable: false,
          filterable: false
        },

        { header: 'Driver Name', field: 'Name' },
        { header: 'Assigned Vehicle', field: 'VehicleNo' },
        { header: 'Gender', field: 'Gender' },
        { header: 'Birth Date', field: 'BirthDate' },
        { header: 'Mobile Number', field: 'MobileNo' },

        {
          header: 'Alternate Mobile Number',
          field: 'AlternateMobileNo',
          valueGetter: (params: any) => {
            return params.data?.AlternateMobileNo === 'null'
              ? ''
              : params.data?.AlternateMobileNo;
          }
        },

        { header: 'Email Address', field: 'Email' },
        { header: 'Address', field: 'Address' },
        { header: 'Pincode', field: 'Pincode' },
        { header: 'City', field: 'CityName' },
        { header: 'State', field: 'StateName' },

        {
          header: 'Status',
          field: 'Status',
          cellRenderer: (params: any) => {
            return params.value == '1'
              ? `<span class="badge bg-success">Active</span>`
              : `<span class="badge bg-danger">Inactive</span>`;
          }
        },

        {
          type: 'icon',
          header: 'Edit',
          iconClass: 'fa fa-pencil',
          iconColor: '#2563eb',
          iconSize: 18,
          iconWidth: 50,
          sortable: false,
          filterable: false
        },

        {
          type: 'icon',
          header: 'Delete',
          iconClass: 'fa fa-trash',
          iconColor: 'red',
          iconSize: 18,
          iconWidth: 50,
          sortable: false,
          filterable: false
        }
      ];
    }

  }
  /////////////////link panel////////////////////////////////
  filterForm!: FormGroup;
  linkData = [
    {
      vehicle: 'UP78DE1119',
      device: 'DEV-90231',
      sim: '9876543210',
      status: 'Active'
    },
    {
      vehicle: 'DL01LAA7092',
      device: 'DEV-77421',
      sim: '9123456789',
      status: 'Inactive'
    },
    {
      vehicle: 'WB19H7891',
      device: 'DEV-66290',
      sim: '9988776655',
      status: 'Active'
    }
  ];
  vehicleArray: any = []


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

  // get_vehicle_list() {
  //   var formdataCustomer = new FormData()
  //   formdataCustomer.append('AccessToken', localStorage.getItem("AccessToken")!)


  //   this.service.vehicleList(formdataCustomer).subscribe((res: any) => {
  //     console.log("vehicle", res.VehicleList)
  //     this.vehicleArray = Object.entries(res.VehicleList).map(([key, value]) => ({
  //       ...(value as any)




  //     }));
  //     console.log("vehicle", this.vehicleArray)
  //     this.filteredVehicleArray = [...this.vehicleArray];
  //   })
  // }
  playpausetrack(event: any) {
    let e = event.target.checked
    if (e) {
      this.isPopupVisible = true
    }
    else {
      this.isPopupVisible = false
    }
    // this.toggleLiveMarkers()

    if (!this.mapInstance) {
      console.warn('Map not ready yet');
      return;
    }

    const isMarkerMode = this.plauytrackFlag; // ✅ real boolean

    if (!isMarkerMode) {

      // 🛑 Stop live tracking
      this.isPaused = true;
      // this.isPopupVisible = true

      this.Livemarkers.forEach((marker: google.maps.Marker) => {
        marker.setMap(this.mapInstance);
      });
      console.log("livemarker", this.Livemarkers);

      // cancelAnimationFrame(this.animationFrame);

      // Show static vehicle markers
      // this.live_tracking();
      if (this.markernew) {
        this.markernew.setMap(null);
      }

      this.currentIndex = 0; // optional reset

    } else {

      // 🔥 Hide static markers
      // this.clearLiveMarkers();

      this.isPaused = false;
      // this.isPopupVisible = false
      if (this.markernew) {
        this.markernew.setMap(this.mapInstance);
      }
      if (this.selectedVehicles.length) {
        this.playtrack1(this.selectedVehicles[0]);
        this.Livemarkers.forEach((marker: google.maps.Marker, index: number) => {

          if (index === 0 || index === this.Livemarkers.length - 1) {
            // ✅ Show first and last marker
            marker.setMap(this.mapInstance);
          } else {
            // ❌ Hide all middle markers
            marker.setMap(null);
          }

        });
      }
    }
  }
  toggleLiveMarkers() {
    this.isLiveMarkerVisible = !this.isLiveMarkerVisible;

    this.Livemarkers.forEach((marker: google.maps.Marker) => {
      marker.setMap(this.isLiveMarkerVisible ? this.mapInstance : null);
    });
  }
  ///////////////////////////////////////////////
  togglePlayPause() {
    if (this.isPaused) {
      // Pause
      this.isPaused = false;
      this.playTrack(this.currentIndex);

    } else {
      // Resume / Start
      this.isPaused = true;
      cancelAnimationFrame(this.animationFrame);

    }
  }
  // pauseTrack() {
  //   this.isPaused = true;
  //   cancelAnimationFrame(this.animationFrame);
  // }

  resumeTrack() {
    this.isPaused = false;
    this.playTrack(this.currentIndex);
  }

  resetTrack() {
    this.isPaused = true;
    this.currentIndex = 0;
    // this.polyline.setPath([]);
    // this.polyline?.setMap(null);
    // this.polyline = null;
    // this.polylinePath = [];
    const startPoint = {
      lat: Number(this.trackData[0].Latitude),
      lng: Number(this.trackData[0].Longitude)
    };
    const endPoint = {
      lat: Number(this.trackData[1].Latitude),
      lng: Number(this.trackData[1].Longitude)
    };
    const heading = this.getHeading(startPoint, endPoint);
    this.markernew.setPosition(startPoint);
    this.markernew.setIcon(this.getIcon(this.trackData[0].Speed, heading));
    // this.maps.panTo(startPoint);
  }

  // speed slider event
  updateSpeed(event: any) {
    const newValue = Number(event.target.value);
    console.log("value", newValue);
    // this.playbackSpeed = newValue;
    this.playbackSpeed = 5000 - newValue;
  }
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }
  hidePopup() {
    this.isPopupVisible = false;
    this.plauytrackFlag = false;
  }
  linechart(apiData: any[]) {
    let chartDom: any = document.getElementById('linechart');
    if (!chartDom) {
      console.error('Element with ID "linechart" not found.');
      return;
    }

    chartDom.style.height = '35vh';
    chartDom.style.width = '100vw';

    let echartO: any = echarts.init(chartDom, { useDirtyRect: false });

    // Extract X & Y data from API response
    const xAxisData = apiData.map(item => item.DateTime);   // Dates
    const yAxisData = apiData.map(item => Number(item.Speed)); // Speed values

    let option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          let p = params[0];
          return `
          <b>DateTime:</b> ${p.name}<br/>
          <b>Speed:</b> ${p.value} km/h
        `;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      legend: {
        data: ['Speed'],
        top: 'top',
        left: 'center',
        textStyle: {
          fontWeight: 'bold',
          color: 'black'
        }
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          rotate: 45,
          fontSize: 9,
          fontWeight: 'bold',
          color: 'black',
          formatter: function (value: string) {
            // Show only time part for clarity
            return value.split(" ")[1]; // e.g. "00:00:06"
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Speed (km/h)',
        splitLine: { show: true },
        axisLabel: {
          fontSize: 10,
          fontWeight: 'bold',
          color: 'black'
        },
        axisLine: {
          show: true,
          lineStyle: { color: 'black' }
        }
      },
      series: [
        {
          name: 'Speed',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#1976D2'
            // color: 'brown'
          },
          itemStyle: {
            color: '#1976D2'
            // color: 'brown'
          },
          label: {
            show: false
          },
          data: yAxisData
        }
      ]
    };

    echartO.setOption(option);

    // 🔹 Add click event on point
    echartO.on('click', (params: any) => {
      if (params.componentType === 'series') {
        console.log("Clicked point:", params);
        // this.getReportData1(params);  // pass clicked data point
      }
    });
    echartO.on('mouseover', (params: any) => {
      if (params.componentType === 'series') {
        const index = params.dataIndex; // index of apiData
        const hoveredItem = apiData[index]; // full object from API
        console.log("Hovered index:", index, "Data:", hoveredItem);
        // this.onHoverPoint(params);  // custom function on hover
        //  this.polyline.setPath([]);
        console.log("polyline", this.polyline)
        // this.polyline?.setMap(null);
        // this.polyline = null;
        // this.polylinePath = [];
        this.playTrack(index)
      }
    });

    echartO.resize();
  }
  onChartEvent(event: any) {
    console.log("chartdata", event)
    if (event?.seriesType === 'bar') {
      console.log('Hovered:', event);
      alert(`Vehicle: ${event.seriesName || 'Unknown'}
Time: ${new Date(event.value[0])}
Speed: ${event.value[1]} km/h`);
    }
  }
  onSubmit() {
    if (this.markernew) {
      this.markernew.setMap(null);
    }

    this.isOpen = false

    if (this.isReport) {


      if (this.isTracking) {
        this.plauytrackFlag = true
        if (this.mapInstance) this.clearAllMarkers()
        console.log('Form Values:', this.filterForm.value);
        if (!this.mapInstance) {
          console.warn('Map not ready yet');
          return;
        }

        this.plotMarkers(this.mapInstance, this.selectedVehicles)
        this.fitBoundsAfterPlot(this.mapInstance);
      }
      else {
        this.live_tracking()
        this.plauytrackFlag = false
      }
    }
    else {
      this.open_report()
    }
    // 🔄 Call API / filter table / update map here
  }

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
  table_node() {
    // $('#nodeTable')
    var table = $('#reportTable').DataTable();
    table.clear();
    table.destroy();

    //   {


    var tbl = $('#reportTable')


    $(document).ready(function () {



      $('#reportTable').DataTable({


        "language": {
          search: '',
          searchPlaceholder: 'Search'
        },
        pageLength: 10,
        fixedHeader: true,
        // scrollX: true,
        scrollY: '450px',
        scrollCollapse: true,
        paging: true,
        scrollX: true,
        destroy: true,
        responsive: true,


        //   fixedColumns:   {
        //     leftColumns: 11,
        //     select: true,

        //     // rightColumns: 5
        // },


        "order": [],
        dom: '<"html5buttons"B>lTfgitp',
        columnDefs: [
          { targets: 'no-sort', orderable: false }
        ],

        buttons:
          [


            {
              extend: 'csv',
              footer: true,
              autoClose: 'true',
              titleAttr: 'Download csv file',

              className: 'datatablecsv-btn fa fa-file-text-o ',
              text: '',
              tag: 'span',

              exportOptions: {

                columns: ':visible',


              },
              title: 'dashboard_repor'
            },
            {
              extend: 'pdf',
              footer: true,
              orientation: 'landscape',
              pageSize: 'LEGAL',

              autoClose: 'true',

              titleAttr: 'Download Pdf file',
              tag: 'span',

              className: 'datatablepdf-btn fa fa-file-pdf-o ',
              text: '',
              customize: function (doc: any) {
                var colCount = new Array();
                $(tbl).find('tbody tr:first-child td').each(() => {
                  if ($(this).attr('colspan')) {
                    for (var i = 1; i <= $(this).attr('colspan'); i++) {
                      colCount.push('*');
                    }
                  } else { colCount.push('*'); }
                });
                doc.content[1].table.widths = colCount;
              },


              exportOptions: {

                columns: ':visible',
                //  columns: [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22 ]

              },
              title: 'dashboard_repor'
            },
            {
              extend: 'copy',
              footer: true,
              titleAttr: ' Copy  file',

              tag: 'span',

              className: 'datatablecopy-btn fa fa-copy ',
              text: '',
              orientation: 'landscape',
              pageSize: 'LEGAL',
              exportOptions: {

                columns: ':visible'

              },
              title: 'dashboard_repor'
            },
            {
              extend: 'excel',
              footer: true,
              autoClose: 'true',
              //text: '',
              //className: 'fa fa-file-pdf-o',
              //color:'#ff0000',

              buttons: ['excel'],
              titleAttr: ' Download excel file',

              tag: 'span',

              className: 'datatableexcel-btn fa fa-file-excel-o',
              text: '',
              exportOptions: {

                columns: ':visible'

              },
              title: 'dashboard_repor'
            }]
      }

      );
    });

    // }



  }
  open_report() {

    this.reportTableData = [];

    if (!this.selectedVehicles || this.selectedVehicles.length === 0) {
      alert("Please select vehicles");
      return;
    }

    const requests = this.selectedVehicles.map((vehicle: any) => {
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
        const vehicle = this.selectedVehicles[index];
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

  initDataTable() {
    const table = $('#reportTable');

    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().clear().destroy();
    }

    table.DataTable({
      destroy: true,
      pageLength: 10,
      scrollY: '400px',
      scrollX: true,
      scrollCollapse: true,
      paging: true,
      autoWidth: false,
      responsive: false,

      language: {
        search: '',
        searchPlaceholder: 'Search...'
      },

      dom: '<"d-flex justify-content-between align-items-center mb-2"Bf>rtip',

      buttons: [
        { extend: 'copy', className: 'btn btn-secondary btn-sm', text: 'Copy' },
        { extend: 'csv', className: 'btn btn-info btn-sm', text: 'CSV' },
        { extend: 'excel', className: 'btn btn-success btn-sm', text: 'Excel' },
        { extend: 'pdf', className: 'btn btn-danger btn-sm', text: 'PDF' }
      ]
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
  onCellIdChange(event: any) {
    this.useCellId = event.target.checked ? "1" : "0";
    console.log("Use CellId Value:", this.useCellId);
  }
  onLandmarkChange(event: any) {
    this.useLandmark = event.target.checked ? "1" : "0";
    if (event.target.checked) {
      this.plotLandmarks(this.companyRowData)
    }
    else {
      if (this.landmarkMarkers.length) {
        this.landmarkMarkers.forEach(m => m.setMap(null));
        this.landmarkMarkers = [];
      }
    }
  }

  onGeofenceChange(event: any) {
    this.useGeofence = event.target.checked ? "1" : "0";
    if (event.target.checked) {
      this.plotGeofences()
    }
    else {
      this.clearGeofences()
    }
  }
  clearGeofences() {
    this.geofencePolygons.forEach(p => p.setMap(null));
    this.geofencePolygons = [];
  }
  plotGeofencesold() {

    const bounds = new google.maps.LatLngBounds(); // 🎯 magic box

    this.locationRowData.forEach(item => {

      let decoded = "";

      try {
        decoded = atob(item.GeoCoord);
      } catch (e) {
        console.error("Invalid Base64:", item.GeoCoord);
        return;
      }

      const path: any[] = [];

      const matches = decoded.match(/\(([^)]+)\)/g);

      if (!matches) return;

      matches.forEach(pair => {
        const cleaned = pair.replace(/[()]/g, "");
        const [latStr, lngStr] = cleaned.split(",");

        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (!isNaN(lat) && !isNaN(lng)) {
          const point = { lat, lng };
          path.push(point);

          // 📌 expand bounds for each point
          bounds.extend(point);
        }
      });

      if (path.length < 3) return;

      const polygon = new google.maps.Polygon({
        paths: path,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.25
      });

      polygon.setMap(this.mapInstance);
      this.geofencePolygons.push(polygon);
    });

    // 🚀 Focus map after all polygons are added
    if (!bounds.isEmpty()) {
      this.mapInstance?.fitBounds(bounds);

      // optional: add padding (zoom out a bit)
      setTimeout(() => {
        this.mapInstance?.panToBounds(bounds);
      }, 100);
    }
  }
  plotGeofences() {

    this.locationRowData.forEach(item => {

      let decoded = "";

      try {
        decoded = atob(item.GeoCoord);
      } catch (e) {
        console.error("Invalid Base64:", item.GeoCoord);
        return;
      }

      console.log("Decoded:", decoded);

      const path: any[] = [];

      // 🎯 Extract (lat, lng) pairs safely
      const matches = decoded.match(/\(([^)]+)\)/g);

      if (!matches) {
        console.warn("No valid coordinate pairs found");
        return;
      }

      matches.forEach(pair => {
        const cleaned = pair.replace(/[()]/g, "");
        const [latStr, lngStr] = cleaned.split(",");

        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (!isNaN(lat) && !isNaN(lng)) {
          path.push({ lat, lng }); // ✅ correct order
        } else {
          console.warn("Invalid pair:", pair);
        }
      });

      if (path.length < 3) {
        console.warn("Invalid polygon:", path);
        return;
      }

      const polygon = new google.maps.Polygon({
        paths: path,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.25
      });

      polygon.setMap(this.mapInstance);
      this.geofencePolygons.push(polygon);

    });
  }
  live_tracking() {
    this.vehiclegtrackingflag = true
    const formData = new FormData();

    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    formData.append('startdate', this.filterForm.get('fromDate')?.value ?? '');
    formData.append('enddate', this.filterForm.get('toDate')?.value ?? '');
    formData.append('time_interval', this.time_interval);
    formData.append('imei', this.selectedVehicles[0].ImeiNo);
    formData.append('cell_id', this.useCellId);
    // formData.append('cell_id', '0');
    formData.append('group_type', localStorage.getItem('GroupType')!);
    formData.append('group_id', localStorage.getItem('GroupId')!);
    formData.append('AccountId', localStorage.getItem('AccountId')!);
    formData.append('address', '1');

    this.isLoading = true; // 🚀 start spinner

    this.service.MAP_1(formData)
      .pipe(finalize(() => this.isLoading = false)) // 🛑 stop spinner
      .subscribe((res: any) => {

        if (res.Status === "Failed") {
          localStorage.removeItem('AccessToken');
          alert("Session expired! Login again.");
          location.href = 'https://secutrak.in/logout';
        } else {
          this.Map_info = res.data;
          this.plotStoppage(res.stoppages, this.mapInstance);
          this.plotlivemarker(res.data);
          this.plotPolyline();
        }
      });
  }
  // live_tracking() {
  //   var formData = new FormData();
  //   formData.append('AccessToken', localStorage.getItem('AccessToken')!);
  //   formData.append('startdate', this.filterForm.get('fromDate')?.value ?? '');
  //   formData.append('enddate', this.filterForm.get('toDate')?.value ?? '');

  //   formData.append('time_interval', this.time_interval);
  //   formData.append('imei', this.selectedVehicles[0].ImeiNo);
  //   formData.append('cell_id', '0');
  //   formData.append('group_type', localStorage.getItem('GroupType')!);
  //   formData.append('group_id', localStorage.getItem('GroupId')!);
  //   formData.append('AccountId', localStorage.getItem('AccountId')!);
  //   formData.append('address', '1');
  //   this.service.MAP_1(formData).subscribe((res: any) => {
  //     console.log("tracking", res)
  //     if (res.Status == "Failed") {

  //       localStorage.removeItem('AccessToken')
  //       alert("Session expired !. Login Again");
  //       location.href = 'https://secutrak.in/logout';


  //     }
  //     else {
  //       this.Map_info = res.data
  //       this.plotStoppage(res.stoppages, this.mapInstance)
  //       this.plotlivemarker(res.data)
  //       this.plotPolyline()

  //     }
  //   })

  // }
  getMarkerConfig(i: number) {
    const total = this.Map_info.length;
    const speed = Number(this.Map_info[i]?.speed) || 0;

    // START marker
    if (i === 0) {
      return {
        icon: 'assets/imagesnew/start_marker.png',
        color: 'start'
      };
    }

    // END marker
    if (i === total - 1) {
      return {
        icon: 'assets/imagesnew/stop_marker.png',
        color: 'end'
      };
    }

    // SPEED based markers
    if (speed <= 5) {
      return {
        icon: 'assets/imagesnew/red_Marker1.png',
        color: 'red'
      };
    }

    if (speed > 5 && speed <= 20) {
      return {
        icon: 'assets/imagesnew/yellow_Marker1.png',
        color: 'yellow'
      };
    }

    if (speed > 20) {
      return {
        icon: 'assets/imagesnew/green_Marker1.png',
        color: 'green'
      };
    }

    return {
      icon: 'assets/imagesnew/red_Marker1.png',
      color: 'red'
    };
  }
  shouldShowMarker(color: string): boolean {
    if (color === 'red') return this.showRed;
    if (color === 'yellow') return this.showYellow;
    if (color === 'green') return this.showGreen;
    if (color === 'start' || color === 'end') return this.showStartEnd;
    return true;
  }
  toggleMarkersByColor(color: string) {
    console.log("marker", this.Livemarkers, color)
    // flip visibility for that color
    this.markerVisibility[color] = !this.markerVisibility[color];

    this.Livemarkers.forEach((marker: any) => {
      if (marker.color === color) {
        if (this.markerVisibility[color]) {
          marker.setMap(this.mapInstance);  // show
        } else {
          marker.setMap(null);       // hide
        }
      }
    });
  }




  togglePolyline() {
    this.showPolyline = !this.showPolyline;
    this.polyline?.setMap(this.showPolyline ? this.mapInstance : null);
  }
  toggleArrows() {
    this.showArrows = !this.showArrows;

    if (this.polyline) {
      this.polyline.setOptions({
        icons: this.showArrows
          ? [
            {
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 2,
                strokeColor: '#2563eb'
              },
              offset: '100%',
              repeat: '120px'
            }
          ]
          : [] // 👈 remove arrows
      });
    }
  }
  plotPolyline() {
    if (this.polyline) {
      this.polyline.setMap(null);
      // this.polyline = null;
    }
    const path = this.Map_info.map((p: any) => ({
      lat: Number(p.lat),
      lng: Number(p.long)
    }));

    this.polyline = new google.maps.Polyline({
      path,
      map: this.showPolyline ? this.mapInstance : null,
      strokeColor: 'blue',
      // strokeColor: '#2563eb',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2,
            strokeColor: '#2563eb'
          },
          offset: '100%',
          repeat: '120px'
        }
      ]
    });

  }
  clearLiveMarkers() {
    this.Livemarkers.forEach(m => m.setMap(null));
    this.Livemarkers = [];
  }



  plotlivemarker(Map_info: any[]) {
    console.log("maplive",)

    // 🔥 clear old markers first
    this.clearLiveMarkers();
    if (this.polyline) {
      this.polyline.setMap(null);
      // this.polyline = null;
    }
    Map_info.forEach((point: any, i: number) => {

      const config = this.getMarkerConfig(i);
      if (!this.shouldShowMarker(config.color)) return;

      const marker = new google.maps.Marker({
        position: {
          lat: Number(point.lat),
          lng: Number(point.long)
        },
        map: this.mapInstance,
        icon: config.icon,
        visible: true,
      });

      marker.set('color', config.color);

      // 🔥 IMPORTANT: attach full data to marker
      marker.set('data', point);

      // 🔥 CLICK LISTENER
      marker.addListener('click', () => {

        const markerData = marker.get('data');
        console.log("markerdata", markerData)
        this.openInfoWindow(marker, this.selectedVehicles[0]);
        // this.openInfoWindow(marker, markerData);
      });

      this.Livemarkers.push(marker);
    });
    // Map_info.forEach((point: any, i: number) => {

    //   const config = this.getMarkerConfig(i);
    //   if (!this.shouldShowMarker(config.color)) return;

    //   const marker = new google.maps.Marker({
    //     position: {
    //       lat: Number(point.lat),
    //       lng: Number(point.long)
    //     },
    //     map: this.mapInstance,
    //     icon: config.icon,
    //     visible: true,
    //     // color: config.color,

    //   });
    //   marker.set('color', config.color);
    //   this.Livemarkers.push(marker);
    // });
    if (!this.mapInstance) return;
    this.fitBoundsAfterPlotlive(this.mapInstance);
    // this.setMarkerBounds();
  }



  private parseDurationToMinutes(durationStr: string): number {
    let totalMinutes = 0;
    // console.log("dataaaaa", durationStr)
    if (durationStr.includes('hrs')) {
      const parts = durationStr.split('hrs,');
      totalMinutes += parseInt(parts[0], 10) * 60;
      durationStr = parts[1] || ''; // Use the remainder of the string
    }

    if (durationStr.includes('min')) {
      totalMinutes += parseInt(durationStr, 10);
    }

    return totalMinutes;
  }
  clearMarkers() {

    this.Map_info_stoppage_data.forEach((m: any) => m.setMap(null)); // remove from map
    // this.Map_info_stoppage_data = []; // reset array
  }
  plotStoppage(points: any[], map: any) {
    if (this.Map_info_stoppage_data.length > 0) {
      this.clearMarkers(); // remove previous ones first
    }

    console.log("points", points)
    points.forEach(p => {
      const durationInMinutes = this.parseDurationToMinutes(p.duration_hrm);

      const position = { lat: Number(p.lat), lng: Number(p.long) };

      const marker = new google.maps.Marker({
        map,
        position,
        icon: {
          url: 'assets/imagesnew/icons-flag-big.png',
          scaledSize: new google.maps.Size(60, 40), // adjust size
          anchor: new google.maps.Point(20, 40),
          labelOrigin: new google.maps.Point(30, 12)       // X, Y position for label   // bottom center
        },
        label: {
          text: p.duration_hrm,   // e.g. "5hrs,29min"
          color: "#000000",
          fontSize: "10px",
          fontWeight: "bold"
        },
        title: p.duration_hrm
      });
      this.stoppageFlagMarkers.push({
        marker: marker,
        durationMinutes: durationInMinutes
      });
      this.Map_info_stoppage_data.push(marker);
      const contentString = `
    <div style="font-size:13px; line-height:1.5;">
      <b>Start Time:</b> ${p.start_time}<br>
      <b>End Time:</b> ${p.end_time}<br>
      <b>Duration:</b> ${p.duration_hrm} (${p.duration})
    </div>
  `;

      const infoWindow = new google.maps.InfoWindow({
        content: contentString
      });

      // click event
      marker.addListener("click", () => {
        // close previous if open
        if (this.activeInfoWindow) {
          this.activeInfoWindow.close();
        }
        infoWindow.open(map, marker);
        this.activeInfoWindow = infoWindow;
      });
    });
  }
  //////////////////////////////////////////////////////////////////
  columnDefs: ColDef[] = [
    {

      headerName: 'Vehicle No',

      field: 'VehicleNo',
      // width: 100,

      cellClass: params => this.getVehicleClass(params.data.VehicleStatus),



    },
    // {
    //   headerName: 'Vehicle No',
    //   field: 'VehicleNo',
    //   width: 160,

    //   cellRenderer: (params: any) => {
    //     const container = document.createElement('div');
    //     container.style.display = 'flex';
    //     container.style.alignItems = 'center';
    //     container.style.gap = '8px';

    //     // Vehicle number
    //     const text = document.createElement('span');
    //     text.innerText = params.value;

    //     // Icon
    //     const icon = document.createElement('i');
    //     icon.style.cursor = 'pointer';
    //     icon.style.fontSize = '14px';

    //     // 🔁 set icon based on condition
    //     const isPlaying = params.data.isPlaying === true;

    //     icon.className = isPlaying
    //       ? 'fa fa-pause play-pause-icon pause'
    //       : 'fa fa-play play-pause-icon play';

    //     icon.title = isPlaying ? 'Pause Track' : 'Play Track';

    //     icon.addEventListener('click', (event) => {
    //       event.stopPropagation();


    //       this.playtrack1(params.data);


    //       // toggle state
    //       params.data.isPlaying = !params.data.isPlaying;

    //       // refresh ONLY this cell
    //       params.api.refreshCells({
    //         rowNodes: [params.node],
    //         columns: ['VehicleNo'],
    //         force: true
    //       });
    //     });

    //     container.appendChild(text);
    //     container.appendChild(icon);

    //     return container;
    //   },

    //   cellClass: params => this.getVehicleClass(params.data.VehicleStatus),
    // },
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    {
      headerName: 'Location',
      field: 'locationDisplay',   // 👈 virtual field (not from API)
      width: 130,

      valueGetter: () => true,     // 👈 required so grid treats it as valid




      //   cellRenderer: (params: any) => {
      //     const row = params.data;
      //     if (!row) return '';

      //     const dots: string[] = [];

      //     // MAIN device dot
      //     if (row.LatLong) {
      //       const [lat, lng] = row.LatLong.split(',').map(Number);
      //       dots.push(`
      //   <span class="loc-dot main"
      //         title="${row.Location} (${lat}, ${lng})"
      //         data-type="main"
      //         data-lat="${lat}"
      //         data-lng="${lng}">
      //         &nbsp;
      //   </span>
      // `);
      //     }

      //     // OTHER devices dots
      //     if (Array.isArray(row.otherDevices)) {
      //       row.otherDevices.forEach((d: any, index: number) => {
      //         if (d.Location && d.LatLong) {
      //           const [lat, lng] = d.LatLong.split(',').map(Number);
      //           dots.push(`
      //       <span class="loc-dot other"
      //             title="${d.Location} (${lat}, ${lng})"
      //             data-type="other"
      //             data-index="${index}"
      //             data-lat="${lat}"
      //             data-lng="${lng}">
      //             &nbsp;
      //       </span>
      //     `);
      //         }
      //       });
      //     }

      //     return dots.join('');
      //   }
      cellRenderer: (params: any) => {
        const row = params.data;
        if (!row) return '';

        const dots: string[] = [];

        // 🎨 function to decide class
        const getStatusClass = (status: string) => {
          if (!status) return 'nodata';

          const s = status.toLowerCase();

          if (s === 'active') return 'active';
          if (s === 'inactive') return 'inactive';
          if (s === 'nodata') return 'nodata';
          if (s === 'breakdown') return 'Breakdown';
          if (s === 'nogps') return 'NoGPS';

          return 'nodata'; // default fallback
        };

        // MAIN device dot
        if (row.LatLong) {
          const [lat, lng] = row.LatLong.split(',').map(Number);
          const statusClass = getStatusClass(row.VehicleStatus);

          dots.push(`
      <span class="loc-dot main ${statusClass}"
            title="${row.Location} (${lat}, ${lng})"
            data-type="main"
            data-lat="${lat}"
            data-lng="${lng}">
            &nbsp;
      </span>
    `);
        }

        // OTHER devices dots
        if (Array.isArray(row.otherDevices)) {
          row.otherDevices.forEach((d: any, index: number) => {
            if (d.Location && d.LatLong) {
              const [lat, lng] = d.LatLong.split(',').map(Number);
              const statusClass = getStatusClass(d.VehicleStatus);

              dots.push(`
          <span class="loc-dot other ${statusClass}"
                title="${d.Location} (${lat}, ${lng})"
                data-type="other"
                data-index="${index}"
                data-lat="${lat}"
                data-lng="${lng}">
                &nbsp;
          </span>
        `);
            }
          });
        }

        return dots.join('');
      }
    },

    {
      headerName: 'Engine',
      // headerName: '',
      cellRenderer: (params: any) => {
        const status = params.value;
        const color =
          status === 'On' ? 'green' :
            status === 'Off' ? 'red' : 'grey';

        return `<i class="fa fa-key" style="color:${color}" title= "Engine-${params.value}"></i>`;
      },
      field: 'EngineStatus',
      width: 80,
      filter: false,
    },
    {
      headerName: 'Temp',
      field: 'Temperature', // make sure your API provides this
      width: 90,
      filter: false,
      cellRenderer: (params: any) => {
        const temp = params.value;

        // 🚫 If null, undefined, empty string → show nothing
        if (temp === null || temp === undefined || temp === '' || temp === ' ') {
          return '';
        }

        const value = Number(temp);

        let color =
          value <= 15 ? 'green' :
            value <= 35 ? 'orange' :
              'red';

        return `
      <i class="fa fa-thermometer-half" 
         style="color:${color}" 
         title="Temperature: ${value}°C">
      </i>
      <span style="margin-left:4px;">${value}°C</span>
    `;
      }
    },
    {
      headerName: 'Battery',
      filter: false,
      cellClass: params => this.getVehicleClass(params.data.VehicleStatus),
      cellRenderer: (params: any) => {

        const b = params.data.Battery;
        const v = params.data.BatteryVoltage;
        const Color = this.getVehicleClass(params.data.VehicleStatus)

        let icon = 'fa-battery-empty';
        let color = 'gray';

        if (b == 0) { icon = 'fa fa-battery-empty'; color = `${Color}` }
        else if (b > 0 && b < 25) { icon = 'fa-battery-quarter'; color = ` ${Color}`; }
        else if (b >= 25 && b < 50) { icon = 'fa-battery-half'; color = `${Color} `; }
        else if (b >= 50 && b < 75) { icon = 'fa-battery-three-quarters'; color = `${Color} `; }
        else if (b >= 75 && b <= 100) { icon = 'fa-battery-full'; color = `${Color} `; }

        return `
        <i class="fa ${icon}"
           title="Battery-Level-${b} Battery-Volt-${v}"
           style="color:${color}">
        </i>`;
      },
      width: 80
    },

    {
      headerName: 'Status',
      // headerName: '',
      field: 'VehicleStatus',
      width: 100,
      cellClass: params => this.getVehicleClass(params.value),

    },
    {
      headerName: '',
      field: 'GPSVendor',
      width: 60,
      cellClass: params => this.getVehicleClass(params.data.VehicleStatus),

      // cellRenderer: (params: any) => {
      //   const showIcon =
      //     params.data?.GPSVendor && params.data?.DeviceType == '23';

      //   return showIcon
      //     ? `<i class="fa fa-video-camera video-icon"
      //    title="Live Video"
      //    style="cursor:pointer"></i>`
      //     : '';
      // },
      cellRenderer: (params: any) => {
        let matchedData = null;

        // ✅ Check main object
        if (
          params.data?.GPSVendor !== 'Secutrak' &&
          params.data?.DeviceType === '23'
        ) {
          matchedData = params.data;
        }

        // ✅ Check otherDevices
        if (!matchedData && params.data?.otherDevices?.length) {
          matchedData = params.data.otherDevices.find((d: any) =>
            d.GPSVendor !== 'Secutrak' && d.DeviceType === '23'
          );
        }

        return matchedData
          ? `<i class="fa fa-video-camera video-icon"
         title="Live Video"
         style="cursor:pointer"></i>`
          : '';
      },
      onCellClicked: (params: any) => {
        console.log("params", params);

        let matchedData = null;

        // ✅ Check main object
        if (
          params.data?.GPSVendor !== 'Secutrak' &&
          params.data?.DeviceType === '23'
        ) {
          matchedData = params.data;
        }

        // ✅ Check inside otherDevices
        if (!matchedData && params.data?.otherDevices?.length) {
          matchedData = params.data.otherDevices.find((d: any) =>
            d.GPSVendor !== 'Secutrak' && d.DeviceType === '23'
          );
        }

        // ✅ If found, send THAT object
        if (matchedData) {
          this.redirectLiveDashcam(matchedData);
        }
      }
      // onCellClicked: (params: any) => {
      //   console.log("params", params)
      //   if (params.data?.GPSVendor && params.data?.DeviceType == '23') {
      //     this.redirectLiveDashcam(params.data);
      //   }
      // }
    }


  ];

  selectedVehicles: any[] = [];

  onSelectionChanged(event: any) {
    if (!this.gridApi) return;

    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedRows = this.gridApi.getSelectedRows();

    // 🟢 LOCATION MODE → allow ONLY ONE row
    if (!this.isTracking) {
      if (selectedNodes.length > 1) {
        const lastSelected = selectedNodes[selectedNodes.length - 1];

        this.gridApi.deselectAll();
        lastSelected.setSelected(true);

        this.selectedVehicles = [lastSelected.data];
      } else {
        this.selectedVehicles = selectedRows;
      }

      if (this.selectedVehicles.length === 1) {
        // console.log('Location selected:', this.selectedVehicles[0]);
      }
    }

    // 🔵 TRACKING MODE → allow MULTIPLE rows
    else {
      this.selectedVehicles = selectedRows;

    }
    console.log('Tracking selected vehicles:', this.selectedVehicles);
  }
  onMapReady(map: google.maps.Map) {
    this.mapInstance = map;
    this.markernew = new google.maps.Marker({
      map: this.mapInstance
    });
    // if (this.mapInstance) 
    map.addListener('zoom_changed', () => {
      this.userInteracting = true;
    });

    map.addListener('dragstart', () => {
      this.userInteracting = true;
    });
    // map.addListener('click', (event: google.maps.MapMouseEvent) => {
    //   if (!this.isDrawing || !event.latLng) return;

    //   this.polygonCoords.push(event.latLng);
    //   this.drawPolygon();
    // });


    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (!this.isDrawing || !event.latLng) return;

      this.polygonCoords.push(event.latLng);
      this.drawPolygon();
    });
  }
  openGeoModal() {
    this.isGeoModalOpen = true;
  }

  closeGeoModal() {
    this.isGeoModalOpen = false;
    // this.isDrawing = true;
    this.removeDrawingControl(this.mapInstance!)
    this.polygonCoords = [];

    if (this.geofencePolygon) {
      this.geofencePolygon.setMap(null);
      this.geofencePolygon = null;
    }
  }
  saveGeofence() {

    const formData = new FormData();

    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    formData.append('GeoName', this.geoForm.name);
    formData.append('Remark', this.geoForm.remark);
    formData.append('GeoCoord', this.geoCoordinates);

    console.log("key", this.geoCoordinates)

    this.service.save_geofence(formData).subscribe({
      next: (res: any) => {
        console.log('Geofence Saved', res);
        alert(res.Message)
        this.closeGeoModal();
      },
      error: (err) => {
        console.error('Error saving geofence', err);
      }
    });
  }
  createDrawingControl(map: google.maps.Map) {

    const wrapper = document.createElement("div");
    wrapper.style.marginTop = "60px";
    wrapper.style.marginRight = "10px";

    const controlDiv = document.createElement("div");
    controlDiv.style.background = "#ffffff";
    controlDiv.style.border = "2px solid #1976D2";
    controlDiv.style.borderRadius = "8px";
    controlDiv.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    controlDiv.style.cursor = "pointer";
    controlDiv.style.padding = "8px 12px";
    controlDiv.style.fontWeight = "600";

    controlDiv.innerHTML = "⏹ Stop Drawing";

    controlDiv.onclick = () => {

      if (this.isDrawing) {
        // STOP drawing
        this.isDrawing = false;
        controlDiv.innerHTML = "✏️ Continue Drawing";
        this.finishDrawing();
      } else {
        // START drawing again
        this.isDrawing = true;
        controlDiv.innerHTML = "⏹ Stop Drawing";
        this.startDrawing();
      }
    };

    wrapper.appendChild(controlDiv);
    this.drawingControlDiv = wrapper;

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(wrapper);
  }
  drawPolygon() {

    if (this.geofencePolygon) {
      this.geofencePolygon.setMap(null);
    }

    this.geofencePolygon = new google.maps.Polygon({
      paths: this.polygonCoords,
      map: this.mapInstance!,
      strokeColor: '#FF5722',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#FF5722',
      fillOpacity: 0.3,
      editable: true,
      draggable: false
    });
  }

  // createGeofence(latLng: google.maps.LatLng) {

  //   // Remove previous geofence if exists
  //   if (this.geofenceCircle) {
  //     this.geofenceCircle.setMap(null);
  //   }

  //   this.geofenceCircle = new google.maps.Circle({
  //     map: this.mapInstance!,
  //     center: latLng,
  //     radius: 500, // meters (change as needed)
  //     fillColor: '#1976D2',
  //     fillOpacity: 0.3,
  //     strokeColor: '#0D47A1',
  //     strokeWeight: 2,
  //     clickable: true,
  //     draggable: true,
  //     editable: true
  //   });

  //   console.log('Geofence created at:', latLng.lat(), latLng.lng());
  // }
  parseLatLng(latLong: string) {
    if (!latLong) return alert("latLong Not valid"), null;
    const [lat, lng] = latLong.split(',').map(Number);
    return { lat, lng };
  }

  plotMarkers(map: google.maps.Map, vehicles: any[]) {

    console.log("data", vehicles)
    vehicles.forEach((v: any) => {
      if (!v.LatLong) {
        this.toastr.error(`${v.VehicleNo} latlong not found`, 'Secutrak', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });;
        return
      }
      const [lat, lng] = v.LatLong.split(',').map(Number);
      if (!lat || !lng) {
        this.toastr.error(`${v.VehicleNo} latlong not found`, 'Secutrak', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });;
        return
      };

      const vehicleId = v.VehicleId;

      // remove old marker
      if (this.markerMap.has(vehicleId)) {
        this.markerMap.get(vehicleId)!.setMap(null);
        this.markerMap.delete(vehicleId);
      }

      // create new marker
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: v.VehicleNo,
        icon: this.getMarkerIcon(v.VehicleImage)
      });
      marker.addListener('click', () => {
        this.openInfoWindow(marker, v);
      });
      this.markerMap.set(vehicleId, marker);
    });
    if (!this.mapInstance) return


  }

  getMarkerIcon(image: string) {
    if (image && image !== 'N/A') {
      return {
        url: image,
        scaledSize: new google.maps.Size(50, 24), // 🔽 reduced
        anchor: new google.maps.Point(14, 14)
      };
    }

    return {
      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: new google.maps.Size(24, 24)
    };
  }

  fitBoundsAfterPlot(map: google.maps.Map) {

    const bounds = new google.maps.LatLngBounds();

    this.markerMap.forEach(marker => {
      bounds.extend(marker.getPosition()!);
    });

    if (bounds.isEmpty()) return;

    map.fitBounds(bounds);

    if (this.markerMap.size === 1) {
      map.setZoom(15); // sweet spot for vehicles
    }
  }
  fitBoundsAfterPlotlive(map: google.maps.Map) {

    const bounds = new google.maps.LatLngBounds();

    this.Livemarkers.forEach(marker => {
      bounds.extend(marker.getPosition()!);
    });

    if (bounds.isEmpty()) return;

    map.fitBounds(bounds);

    // if (this.Livemarkers.size === 1) {
    //   map.setZoom(15); // sweet spot for vehicles
    // }
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // this.gridApi.addEventListener('cellClicked', (event: any) => {
    //   if (event.colDef.headerName !== 'Location') return;

    //   const el = event.event.target as HTMLElement;
    //   if (!el.classList.contains('loc-dot')) return;
    //   else {
    //     const lat = Number(el.getAttribute('data-lat'));
    //     const lng = Number(el.getAttribute('data-lng'));
    //     const rows: any = (el.getAttribute('data-rows'));
    //     console.log("rows", event.data)
    //     let vehicledata: any = []
    //     vehicledata.push(event.data)
    //     if (!this.mapInstance) return
    //     this.plotMarkers(this.mapInstance, vehicledata)
    //     this.fitBoundsAfterPlot(this.mapInstance);
    //     console.log("rows", vehicledata)

    //   }



    // this.focusOnMap(rows);
    // });
    this.gridApi.addEventListener('cellClicked', (event: any) => {

      if (event.colDef.headerName !== 'Location') return;

      const el = event.event.target as HTMLElement;
      if (!el.classList.contains('loc-dot')) return;

      const type = el.getAttribute('data-type'); // main | other
      const lat = Number(el.getAttribute('data-lat'));
      const lng = Number(el.getAttribute('data-lng'));

      let vehicledata: any[] = [];

      if (type === 'main') {
        // ✅ user clicked MAIN device
        vehicledata.push({
          ...event.data,
          LatLong: `${lat},${lng}`
        });
      }

      if (type === 'other') {
        // ✅ user clicked OTHER device
        const index = Number(el.getAttribute('data-index'));
        const otherDevice = event.data.otherDevices[index];

        vehicledata.push({
          ...otherDevice,
          VehicleId: event.data.VehicleId,
          VehicleNo: event.data.VehicleNo
        });
      }

      if (!this.mapInstance) return
      if (this.mapInstance) this.clearAllMarkers()



      this.plotMarkers(this.mapInstance, vehicledata);
      this.fitBoundsAfterPlot(this.mapInstance);

      console.log('Plotted data:', vehicledata);
    });
  }



  openInfoWindow(marker: google.maps.Marker, v: any) {

    console.log("vdata", v);
    this.vehicleInfowindowData = v;

    let address = "Loading address...";

    
    const content = () => {

      // 🔵 MAIN HOLE (PRIMARY DEVICE)
      const mainHoleHtml = `
    <div style="margin-top:8px; padding-left:8px; border-left:3px solid #1d4380;">
      
      <div style="font-weight:600; color:#1d4380;">
        ${v.Location}
      </div>

      <div><b>IMEI:</b> ${v.ImeiNo || '-'}</div>
      <div><b>Status:</b> ${v.VehicleStatus || '-'}</div>
      <div><b>Running:</b> ${v.RunningStatus || '-'}</div>
      <div><b>Battery:</b> ${v.Battery || 0}% (${v.BatteryVoltage || 0}v)</div>
      <div><b>Speed:</b> ${v.Speed || 0} km/h</div>
      <div><b>Last Update:</b> ${v.DeviceTime || '-'}</div>

    </div>
  `;

      // 🟡 DELIVERY HOLES (OTHER DEVICES)
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

      // 🎯 FINAL UI
      return `
    <div class="info-card" style="color:#1d4380">

      <!-- 🚚 TOP COMMON HEADER -->
      <div class="info-header">
        🚚 ${v.VehicleNo || v.vnumber}
        <span style="margin-left:8px; font-size:12px; color:#555;">
          (${v.VehicleCategory || 'N/A'})
        </span>

        <span class="status ${v.VehicleStatus?.toLowerCase()}">
          ${v.VehicleStatus}
        </span>
      </div>

      <!-- 📦 BODY -->
      <div class="info-body">

        <div><b>Driver Name:</b> ${v.DriverName || '-'}</div>

        <div>
          <b>Address:</b>
          <span class="address">${address}</span>
        </div>

        <div class="coords">
          (${marker.getPosition()?.lat().toFixed(6)},
           ${marker.getPosition()?.lng().toFixed(6)})
        </div>

        <!-- 🔵 MAIN HOLE -->
        ${mainHoleHtml}

        <!-- 🟡 DELIVERY HOLES -->
        ${otherDevicesHtml}

      </div>

      <!-- 🔘 ACTION BUTTONS (UNCHANGED) -->
      <div class="info-actions">
        <button onclick="window.changeDriver('${v.VehicleId}')">
          <i class="fa fa-edit"></i> Driver
        </button>
        <button onclick="window.changeStatus('${v.VehicleId}')">
          <i class="fa fa-edit"></i> Status
        </button>
        <button onclick="window.addLandmark('${v.VehicleId}')">
          <i class="fa fa-plus"></i> Landmark
        </button>
        <button onclick="window.addGeofence('${v.VehicleId}')">
          <i class="fa fa-plus"></i> Geofence
        </button>
      </div>

    </div>
  `;
    };
    // ✅ Initial render (loading state)
    this.infoWindow.setContent(content());
    this.infoWindow.open(marker.getMap()!, marker);

    // ✅ API call for address
    const formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    formData.append('VehicleId', v.VehicleId);
    formData.append('ImeiNo', v.ImeiNo);
    formData.append(
      'LatLong',
      `${marker.getPosition()?.lat()},${marker.getPosition()?.lng()}`
    );

    this.service.Lastlocation(formData).subscribe((res: any) => {

      if (res.Status == "Failed") {
        localStorage.removeItem('AccessToken');
        alert("Session expired ! Login Again");
        location.href = 'https://secutrak.in/logout';
      } else {

        address = res.Data.Address || "N/A";

        // ✅ Update with real address
        this.infoWindow.setContent(content());
      }

    });
  }
  
  openDriverPopup(vehicleId: string) {
    // this.vehicle_id = vehicleId;
    // this.showDriverModal = true;
    this.showdriverPopup = true;
  }

  openStatusPopup(vehicleId: string) {

    // this.vehicle_id = vehicleId;
    // this.showStatusModal = true;
    this.showStatusPopup = true;
    console.log("dattata", this.vehicleInfowindowData)
  }

  openLandmarkPopup(vehicleId: string) {
    // this.vehicle_id = vehicleId;
    // this.showLandmarkPopup = true;
    this.enableLandmarkMode()
  }

  openGeofencePopup(vehicleId: string) {


    this.AddGeofence()

    // this.vehicle_id = vehicleId;
    // this.showGeofencePopup = true;

  }
  removeDrawingControl(map: google.maps.Map) {
    const controls = map.controls[google.maps.ControlPosition.TOP_RIGHT];

    for (let i = 0; i < controls.getLength(); i++) {
      if (controls.getAt(i) === this.drawingControlDiv) {
        controls.removeAt(i);
        break;
      }
    }

    this.drawingControlDiv = null;
  }


  closeStatusPopup() {
    this.showStatusPopup = false;
    this.statusForm.reset();
  }
  closedriverPopup() {
    this.showdriverPopup = false;
    this.driverForm.reset();
  }

  saveStatus() {

    if (this.statusForm.invalid) {
      return;
    }

    const formData = this.statusForm.value;

    console.log(formData);

    this.showStatusPopup = false;
  }
  saveDriver() {

    if (this.driverForm.invalid) {
      return;
    }

    const formData = this.driverForm.value;

    console.log(formData);

    this.showdriverPopup = false;
  }
  updateSelectionMode(isTracking: boolean) {
    console.log("istracking", isTracking)
    if (!this.gridApi) return;
    this.isTracking = isTracking;
    // Clear previous selection when mode changes
    this.gridApi.deselectAll();

    if (isTracking) {
      // 🔵 Tracking → Multi row (checkbox)
      this.gridApi.setGridOption('rowSelection', {
        mode: 'multiRow',
        checkboxes: true,
        headerCheckbox: true,
        selectAll: 'filtered',
        enableClickSelection: false
      });
    } else {
      // 🟢 Location → Single row (radio)
      this.gridApi.setGridOption('rowSelection', {
        mode: 'singleRow',
        // checkboxes: false,
        checkboxes: true,
        // headerCheckbox: false,
        enableClickSelection: true
      });
    }
  }
  clearAllMarkers() {
    this.markerMap.forEach(marker => marker.setMap(null));
    this.markerMap.clear();
  }

  //////////////////////map//////////////////////////////////
  center = { lat: 28.6139, lng: 77.2090 };
  zoom = 5;
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
    }
  };
  isSliderVisible = true;

  toggleSliderSection() {
    this.isSliderVisible = !this.isSliderVisible;
  }
  getIntervalValaue(event: any) {
    console.log("event", event.target.value)
    this.time_interval = event.target.value
    this.live_tracking()
  }

  filterStoppagesByDuration(minimumMinutes: any): void {
    console.log('Filtering stoppages with minimum duration:', minimumMinutes);
    if (!this.stoppageFlagMarkers) return;

    this.stoppageFlagMarkers.forEach((item: any) => {
      // Check if the marker's duration meets the filter criteria
      if (item.durationMinutes >= minimumMinutes.target.value) {
        item.marker.setMap(this.mapInstance); // Show the marker
      } else {
        item.marker.setMap(null); // Hide the marker
      }
    });
  }
  // setMarkerBounds() {
  //   this.bounds = new google.maps.LatLngBounds();

  //   this.Map_info.forEach((point: any) => {
  //     if (!point.lat || !point.long) return;

  //     this.bounds.extend(
  //       new google.maps.LatLng(
  //         Number(point.lat),
  //         Number(point.long)
  //       )
  //     );
  //   });

  //   // Fit map to all markers
  //   if (!this.bounds.isEmpty()) {
  //     this.mapInstance?.fitBounds(this.bounds);
  //   }
  // }

  setMarkerBounds() {
    if (this.userInteracting) return;

    const bounds = new google.maps.LatLngBounds();

    this.Map_info.forEach((point: any) => {
      if (!point.lat || !point.long) return;
      bounds.extend(new google.maps.LatLng(+point.lat, +point.long));
    });

    if (!bounds.isEmpty()) {
      this.mapInstance?.fitBounds(bounds);
    }
  }

  onTrackingToggle(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.clearMarkers()
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      if (this.polyline) {
        this.polyline.setMap(null);
        // this.polyline = null;
      }
      console.log('Tracking ON');
      // start live tracking
      // this.startTracking();
      this.stoppageFlagMarkers.forEach((item: any) => {
        item.marker.setMap(null);
      })
      this.Livemarkers.forEach((marker: any) => {

        marker.setMap(null);       // hide


      });
      // this.clearAllMarkers()
    } else {
      console.log('Tracking OFF');
      this.clearAllMarkers()
      // stop tracking
      // this.stopTracking();
    }
  }
  show_balloons() {
    this.show_balloons_div = !this.show_balloons_div;
  }
  ///////////////////location ///////////////////////////
  AddGeofence() {

    this.isDrawing = true;

    this.startDrawing();   // reset old data
    this.createDrawingControl(this.mapInstance!);
  }
  startDrawing() {

    this.polygonCoords = [];

    if (this.geofencePolygon) {
      this.geofencePolygon.setMap(null);
      this.geofencePolygon = null;
    }
  }
  finishDrawing() {

    if (!this.polygonCoords.length) return;

    // const coords = this.polygonCoords.map(p => ({
    //   lat: p.lat(),
    //   lng: p.lng()
    // }));
    this.openGeoModal()
    // console.log("Final Geofence:", coords);
    this.geoCoordinates = this.polygonCoords
      .map(p => `(${p.lat()},${p.lng()})`)
      .join(',');
  }
  decodeCoords(base64: string) {
    const decoded = atob(base64);
    return decoded;
  }
  parseCoordinates(coordString: string) {
    const coords: google.maps.LatLngLiteral[] = [];

    const matches = coordString.match(/\(([^)]+)\)/g);

    if (matches) {
      matches.forEach(point => {
        const cleaned = point.replace(/[()]/g, '');
        const [lat, lng] = cleaned.split(',').map(Number);

        coords.push({ lat: lat, lng: lng });
      });
    }

    return coords;
  }
  plotClusters(res: any) {

    if (res.Status !== "Success") return;

    res.Clusters.forEach((cluster: any) => {

      const decoded = this.decodeCoords(cluster.ClusterCoords);

      const path = this.parseCoordinates(decoded);

      const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: cluster.SegmentColor || "#FF0000",
        strokeOpacity: 1,
        strokeWeight: 4,
        map: this.mapInstance
      });

      // store unique polyline
      this.polylineMap.set(cluster.ClusterId, polyline);
      this.polylineMap.set(cluster.PolylineId, polyline);

    });

  }
  removePolyline(polylineId: string) {

    const polyline = this.polylineMap.get(polylineId);

    if (polyline) {
      polyline.setMap(null);
      this.polylineMap.delete(polylineId);
    }

  }
  clearPolylines() {

    this.polylineMap.forEach((polyline) => {
      polyline.setMap(null);
    });

    this.polylineMap.clear();

  }
  Polyline_list() {
    if (this.polylineMap) {
      this.clearPolylines()
    }

    this.selectedRows.forEach((item: any) => {

      const formData = new FormData();
      formData.append('AccessToken', localStorage.getItem('AccessToken')!);
      formData.append('PolylineId', item.PolylineId);

      this.service.polyline_path(formData).subscribe((res: any) => {

        console.log("Polyline Response:", item.PolylineName, res);

        if (res.Status == "Failed") {

          localStorage.removeItem('AccessToken');
          alert("Session expired !. Login Again");
          location.href = 'https://secutrak.in/logout';

        } else {
          this.plotClusters(res)
          // store or draw polyline here
          console.log("Polyline Path:", res);

        }

      });

    });

  }
  onIconClick(event: any) {
    console.log(event.row);
    const geofence = event.row;

    const path = this.decodeGeoCoord(geofence.GeoCoord);
    console.log(path)

    this.drawGeofence(path);
  }
  decodeGeoCoord(encoded: string): google.maps.LatLngLiteral[] {

    const decoded = atob(encoded);
    // "(27.25, 75.75),(26.86, 78.22),(25.76, 76.81)"

    const matches = decoded.match(/\(([^)]+)\)/g);
    if (!matches) return [];

    return matches.map(pair => {
      const [lat, lng] = pair
        .replace(/[()]/g, '')
        .split(',')
        .map(v => Number(v.trim()));

      return { lat, lng };
    });
  }

  drawSingleGeofence(path: google.maps.LatLngLiteral[]): google.maps.Polygon {
    // this.clearAllGeofences();
    return new google.maps.Polygon({
      paths: path,
      strokeColor: '#FF0000',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#FFB8B8',
      fillOpacity: 0.25,
      map: this.mapInstance
    });
  }

  drawGeofence(path: any) {

    // 🔁 Clear old geofence
    if (this.geofencePolygons) {
      this.geofencePolygons.forEach(p => p.setMap(null));
      this.geofencePolygons = [];
    }

    const geofencePolygons = new google.maps.Polygon({
      paths: path,
      strokeColor: '#FF0000',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#FFB8B8',
      fillOpacity: 0.25,
      map: this.mapInstance
    });
    this.geofencePolygons.push(geofencePolygons)
    // 🎯 Auto focus map
    const bounds = new google.maps.LatLngBounds();
    path.forEach((p: any) => bounds.extend(p));
    this.mapInstance?.fitBounds(bounds);
  }
  geofencelist() {
    var formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    this.service.geofence_list(formData).subscribe((res: any) => {

      if (res.Status == "failed") {
        localStorage.removeItem('AccessToken');
        alert("Session expired !. Login Again")
        location.href = 'https://secutrak.in/logout';


      }
      else {
        console.log("locationRowDataresponce", res)
        this.locationRowData = res.GeofenceList



      }
    });
  }
  AddLandmark() {

  }

  
  landmarklist() {
    var formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    this.service.landmarkList(formData).subscribe((res: any) => {

      if (res.Status == "failed") {
        localStorage.removeItem('AccessToken');
        alert("Session expired !. Login Again")
        location.href = 'https://secutrak.in/logout';


      }
      else {
        console.log("responcelandmark", res)
        this.companyRowData = res.LandmarkList
        // this.rowData = res.LandmarkList



      }
    });
  }

  onSelectedRows(rows: any[]) {
    console.log("rows", rows)
    this.selectedRows = rows;
    if (this.activeTab == 'company') {
      if (rows.length == 0) {
        this.center = { lat: 28.6139, lng: 77.2090 };
        this.zoom = 5;

        // this.zoom = 10;
        if (this.landmarkMarkers.length) {
          this.landmarkMarkers.forEach(m => m.setMap(null));
          this.landmarkMarkers = [];
        }
      }
      else {
        this.showLandmark()
        this.plotLandmarks(rows)
      }

    }
    else if (this.activeTab == 'link') {

      // get selected polyline ids
      const previousIds = this.selectedRows.map((r: any) => r.PolylineId);
      const newIds = rows.map((r: any) => r.PolylineId);

      // find unchecked polylines
      const removed = previousIds.filter(id => !newIds.includes(id));

      removed.forEach(id => {
        this.removePolyline(id);
      });


    }
  }
  showLandmark() {

  }
  plotLandmarks(data: any[]) {

    // 🧹 Remove old landmarks if already on map
    if (this.landmarkMarkers.length) {
      this.landmarkMarkers.forEach(m => m.setMap(null));
      this.landmarkMarkers = [];
    }

    const bounds = new google.maps.LatLngBounds();

    data.forEach(item => {

      if (!item.LandmarkGeoCoord) return;

      const [lat, lng] = item.LandmarkGeoCoord.split(',').map(Number);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.mapInstance,
        title: item.LandmarkName,
        icon: {
          url: 'assets/imagesnew/landmark.png',
          scaledSize: new google.maps.Size(35, 35) // adjust icon size
        }
        // icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });

      const content = `
      <div style="min-width:200px;font-family:Arial">
        <table style="width:100%">
          <tr>
            <td style="font-weight:bold">Landmark</td>
            <td>${item.LandmarkName}</td>
          </tr>
          <tr>
            <td style="font-weight:bold">LatLong</td>
            <td>${lat}, ${lng}</td>
          </tr>
        </table>
      </div>
    `;

      marker.addListener('click', () => {
        this.landmarkInfoWindow.setContent(content);
        this.landmarkInfoWindow.open(this.mapInstance, marker);
      });

      this.landmarkMarkers.push(marker);

      bounds.extend({ lat, lng });

    });

    // 🎯 Smooth focus
    if (data.length === 1) {
      this.mapInstance?.panTo(bounds.getCenter());
      this.mapInstance?.setZoom(15);
    } else {
      this.mapInstance?.fitBounds(bounds);
    }

  }
  // showOnMap() {
  //   console.log('Show on map:', this.selectedRows);
  //   if (this.selectedRows.length > 1) {



  //     this.drawMultipleGeofences(this.selectedRows);
  //     // this.drawGeofence(path);

  //   }
  //   else if (this.selectedRows.length == 1) {
  //     const path = this.decodeGeoCoord(this.selectedRows[0].GeoCoord);
  //     console.log(path)
  //     this.drawSingleGeofence(path)
  //   }
  //   else {
  //     this.geofencePolygons.forEach(p => p.setMap(null));
  //     this.geofencePolygons = [];
  //   }
  //   // 👉 call your map plotting function here
  //   // this.plotMarkers(this.selectedRows);
  // }
  clearAllGeofences() {
    this.geofencePolygons.forEach(p => p.setMap(null));
    this.geofencePolygons = [];
  }

  showOnMap() {
    console.log('Show on map:', this.selectedRows);

    // 🔁 Always clear first
    this.clearAllGeofences();

    // ❌ Nothing selected
    if (this.selectedRows.length == 0) {
      this.clearAllGeofences();
    };

    // 🟢 SINGLE GEOFENCE
    if (this.selectedRows.length === 1) {
      const path = this.decodeGeoCoord(this.selectedRows[0].GeoCoord);
      if (!path.length) return;

      const polygon = this.drawSingleGeofence(path);
      this.geofencePolygons.push(polygon);

      this.fitBoundsForPaths([path]);
    }

    // 🔵 MULTIPLE GEOFENCES
    else {
      const allPaths: google.maps.LatLngLiteral[][] = [];

      this.selectedRows.forEach(row => {
        const path = this.decodeGeoCoord(row.GeoCoord);
        if (!path.length) return;

        const polygon = this.drawSingleGeofence(path);
        this.geofencePolygons.push(polygon);
        allPaths.push(path);
        // const bounds = new google.maps.LatLngBounds();
        // path.forEach((p: any) => bounds.extend(p));
        // this.mapInstance?.fitBounds(bounds);
      });

      this.fitBoundsForPaths(allPaths);

    }
  }
  fitBoundsForPaths(paths: google.maps.LatLngLiteral[][]) {
    const bounds = new google.maps.LatLngBounds();

    paths.forEach(path =>
      path.forEach(p => bounds.extend(p))
    );

    if (!bounds.isEmpty()) {
      this.mapInstance?.fitBounds(bounds);
    }
  }

  drawMultipleGeofences(geoList: any[]) {

    // 🔁 Clear old polygons
    this.geofencePolygons.forEach(p => p.setMap(null));
    this.geofencePolygons = [];

    const bounds = new google.maps.LatLngBounds();

    geoList.forEach(geo => {
      if (!geo.GeoCoord) return;

      const path = this.decodeGeoCoord(geo.GeoCoord);
      if (!path.length) return;

      const polygon = this.drawSingleGeofence(path);
      this.geofencePolygons.push(polygon);

      // 📍 Extend bounds for auto focus
      path.forEach(p => bounds.extend(p));
    });

    // 🎯 Fit map to all polygons
    if (!bounds.isEmpty()) {
      this.mapInstance?.fitBounds(bounds);
    }
  }

  // downloadExcel() {
  //   if (!this.selectedRows || this.selectedRows.length === 0) return;

  //   const worksheet = XLSX.utils.json_to_sheet(this.selectedRows);
  //   const workbook = XLSX.utils.book_new();

  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  //   XLSX.writeFile(workbook, 'geofence-data.xlsx');
  // }
  downloadExcel() {
    this.table.exportExcel();
  }
  pauseTrack() {
    this.isPaused = true;
    cancelAnimationFrame(this.animationFrame);
  }

  playtrack1(data: any) {
    console.log("playtrack", data)

    var formData = new FormData();
    formData.append('AccessToken', localStorage.getItem("AccessToken")!);
    formData.append('VehicleNo', data.VehicleNo);
    formData.append('RunDate', this.filterForm.get('fromDate')?.value ?? '');
    formData.append('CloseDate', this.filterForm.get('toDate')?.value ?? '');
    formData.append('Interval', this.time_interval);
    formData.append('ImeiNo', data.ImeiNo);

    this.service.MAP(formData).subscribe((res: any) => {
      if (res.Status == "Failed") {

        localStorage.removeItem('AccessToken');
        alert("Session expired !. Login Again")
        location.href = 'https://secutrak.in/logout';


      }
      else {
        console.log("trackingdata", res)


        this.trackData = res.TrackData;

        // this.DataFrequency = res.DataFrequency;
        // this.dataGap = res.dataGap;
        // this.latlngbounds = new google.maps.LatLngBounds();
        // // for (var i = 0; i < this.Map_info.length - 1; i++) {  }
        // this.forvalue = 0;
        // // this.playgoogle();
        // //  this.isPaused=true
        // this.drawRouteWithArrows(res.TrackData);
        // this.addEndpoints(res.TrackData);
        this.playTrack(0);
        this.isPopupVisible = true
        this.chartData = res.TrackData.map((item: any) => [
          new Date(item.DateTime).getTime(), // x-axis
          Number(item.Speed)                 // y-axis
        ]);
        this.linechart(res.TrackData)
      }

    })
  }
  toPath(raw: any[]): google.maps.LatLngLiteral[] {
    return raw
      .map((r: any) => {

        // const lat = r.lat ?? r.lat;
        // const lng = r.long ?? r.lng;
        const lat = r.Latitude ?? r.lat;
        const lng = r.Longitude ?? r.lng;
        return (lat && lng) ? { lat: Number(lat), lng: Number(lng) } : null;
      })
      .filter((p): p is google.maps.LatLngLiteral => !!p);
  }
  drawRouteWithArrows(raw: any[]) {
    console.log("this.plyline", this.routePolyline)
    const path = this.toPath(raw);
    if (path.length < 2) return;

    if (this.routePolyline) this.routePolyline.setMap(null);

    this.routePolyline = new google.maps.Polyline({
      path,
      strokeColor: '#1976D2',
      strokeOpacity: 0.9,
      strokeWeight: 3,
      icons: [
        {
          offset: '0',
          repeat: '50px',
        },
      ],
      map: this.mapInstance,
    });

    const bounds = new google.maps.LatLngBounds();
    path.forEach((p: any) => bounds.extend(p));

    // 🧭 Fit map to route
    if (!this.mapInstance) return;
    this.mapInstance?.fitBounds(bounds);

    // Optional: prevent over-zoom when route is very small

    // const listener = google.maps.event.addListenerOnce(this.mapInstance, 'bounds_changed', () => {
    //   if (this.mapInstance.getZoom() > 18) {
    //     this.mapInstance.setZoom(18);
    //   }
    // });
  }
  playTrack(index: number = 0) {
    console.log("index", index, this.isPaused);

    if (index >= this.trackData.length - 1 || this.isPaused) return;

    const currentPoint = {
      lat: Number(this.trackData[index].Latitude),
      lng: Number(this.trackData[index].Longitude)
    };

    const nextPoint = {
      lat: Number(this.trackData[index + 1].Latitude),
      lng: Number(this.trackData[index + 1].Longitude)
    };

    // Anchor marker first
    this.markernew.setPosition(currentPoint);

    // Fix heading once for this segment
    const heading = this.getHeading(currentPoint, nextPoint);

    // Fix icon before moving
    this.markernew.setIcon(
      this.getIcon(this.trackData[index + 1].Speed, heading)
    );

    // Animate without changing heading mid-way
    this.animateMarker(currentPoint, nextPoint, this.playbackSpeed, () => {
      this.currentIndex = index + 1;
      this.playTrack(index + 1);
    }, heading); // 👈 pass heading to prevent recalculation
  }
  getIcon(speed: string | number, heading: number): google.maps.Icon | google.maps.Symbol {
    const baseUrl = '../assets/imagesnew/kml/vehicle/trucklive.png';
    let color = "#0000FF"; // default blue

    if (+speed === 0) {
      color = "#FF0000"; // stopped (red)
    } else if (+speed <= 20) {
      color = "#00FF00"; // green (slow)
    } else if (+speed <= 40) {
      color = "#FFFF00"; // yellow (medium)
    }

    return {
      // path: baseUrl,
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 4,
      strokeColor: color,
      rotation: heading
    };
    //    return {
    //   url: baseUrl, // your custom vehicle/truck icon
    //   scaledSize: new google.maps.Size(40, 40), // resize image
    //   anchor: new google.maps.Point(20, 20), // center anchor
    //   rotation: heading // won't rotate directly (extra handling below)
    // };
  }
  getHeading(from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral): number {
    const fromLat = this.deg2rad(from.lat);
    const fromLng = this.deg2rad(from.lng);
    const toLat = this.deg2rad(to.lat);
    const toLng = this.deg2rad(to.lng);

    const dLng = toLng - fromLng;

    const y = Math.sin(dLng) * Math.cos(toLat);
    const x = Math.cos(fromLat) * Math.sin(toLat) -
      Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng);

    const heading = Math.atan2(y, x);
    return (this.rad2deg(heading) + 360) % 360;
  }

  deg2rad(deg: number) {
    return deg * Math.PI / 180;
  }

  rad2deg(rad: number) {
    return rad * 180 / Math.PI;
  }
  animateMarker(from: any, to: any, duration: number, callback: () => void, heading?: number) {
    const start = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);

      const lat = from.lat + (to.lat - from.lat) * progress;
      const lng = from.lng + (to.lng - from.lng) * progress;

      this.markernew.setPosition({ lat, lng });

      // Do NOT recalc heading each frame → use fixed heading
      if (heading !== undefined) {
        this.markernew.setIcon(this.getIcon(this.trackData[this.currentIndex + 1]?.speed, heading));
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        callback();
      }
    };

    requestAnimationFrame(step);
  }
  tabfunction(data: any) {
    console.log("tab", data)
    if (data == "company") {
      this.enableLandmarkMode()
    }

  }

  enableLandmarkMode() {
    this.landmarkMode = true;
    this.mapInstance?.addListener('click', (event: any) => {

      if (!this.landmarkMode) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const coord = lat + ',' + lng;

      this.landmarkForm.patchValue({
        coords: coord
      });

      this.showLandmarkPopup = true;
      this.landmarkMode = false;

    });
  }
  saveLandmark() {
    console.log("landmarkform", this.landmarkForm)

    if (this.landmarkForm.invalid) return;

    const formValue = this.landmarkForm.value;

    const formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    formData.append("LandmarkName", formValue.landmarkName);
    formData.append("LandmarkTypeId", formValue.landmarkType);
    formData.append("ZoomLevel", formValue.zoomLevel);
    formData.append("DistanceVariable", formValue.distanceVariable);
    formData.append("LandmarkGeoCoord", formValue.coords);
    formData.append("Remark", formValue.remark);

    this.service.Landmark_add(formData).subscribe((res: any) => {

      if (res.Status == "Failed") {
        alert(res);
        // localStorage.removeItem('AccessToken');
        // this.router.navigate(['/auth/login']);
      }

      else {
        var k = res;
        alert("Your landmark successfully saved!");

        this.landmarklist();
        this.showLandmarkPopup = false
        this.landmarkMode = false;
      }
    })

  }
  cancelLandmark() {

    this.showLandmarkPopup = false;
    this.landmarkForm.reset();

  }
  vehicleStatusTypes() {
    var formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    this.service.vehicleStatusTypes(formData).subscribe((res: any) => {

      if (res.Status == "success") {
        this.vehicleStatus_Types = res.Data;

        // localStorage.removeItem('AccessToke
        // alert("Session expired !. Login Again")n');
        //  location.href ='https://secutrak.in/logout'; 


      }
      else {
        //  this.segmentUnion_list();
        //  this.polyline_RouteAssignment();

      }
    });
  }
  Landmark_type() {
    var formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    this.service.Landmark_type(formData).subscribe((res: any) => {
      if (res.Status == "Failed") {
        // alert("p");
        // localStorage.removeItem('AccessToken');
        // this.router.navigate(['/auth/login']);
      }
      else {
        console.log("landmarktype", res)
        this.Landmarktype = res.LandmarkType;
        // this.Landmark_converted = [];
        // for (var key in this.Landmarktype) {
        //   if (this.Landmarktype.hasOwnProperty(key)) {
        //     this.Landmark_converted.push({ id: this.Landmarktype[key].id, title: this.Landmarktype[key].name });

        //   }
        // }
      }
    });
  }


  filterold() {

    const formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);

    this.service.Filter(formData).subscribe((res: any) => {

      if (res.Status === 'success') {

        this.Filter_list = res.FilterData || {};

        this.Filter_list_keys = Object.keys(this.Filter_list);

        this.Filter_list_keys.forEach((key: string) => {

          if (!this.searchKeyword) {
            this.searchKeyword = {};
          }

          if (!this.filteredFilterList) {
            this.filteredFilterList = {};
          }

          this.searchKeyword[key] = '';

          this.filteredFilterList[key] = (this.Filter_list[key] || []).map((item: any) => ({
            ...item,
            checked: item.checked || false
          }));

        });

      }

    });

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
  List_vehicle() {
    // debugger;
    // data.preventDefault();


    var formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken') || "");
    // Vehicle_detail_pds

    this.service.Vehicle_detail_pds(formData).subscribe((res: any) => {

      console.log(res)



    })




    //  event.stopPropagation();
  }
  allchangesStatus(event: any) {
    var storevalues: any;
    if (event.target.checked == true) {
      (document.getElementsByName('searchBarfilter') as any)[0].value = '';
      for (var i = 0; i < this.Filter_list1.length; i++) {
        // checked
        // storevalues = this.Filter_list[this.tabsclass][ind];
        this.Filter_list1[i].checked = true;
      }
    } else {
      for (var i = 0; i < this.Filter_list1.length; i++) {
        // checked
        // storevalues = this.Filter_list[this.tabsclass][ind];
        this.Filter_list1[i].checked = false;
      }

    }


  }

  changesStatusold(index: number, event: Event) {
    console.log("filteredFilterList", this.filteredFilterList)

    const checked = (event.target as HTMLInputElement).checked;
    const tab = this.currentTab;

    const item = this.Filter_list[tab][index];
    item.checked = checked;

    if (tab === 'VehicleCategory') {
      this.updateCategory(item, checked);
    }

    if (tab === 'VehicleMake') {
      this.updateMake(item, checked);
    }

  }
  updateCategory(item: any, checked: boolean) {

    if (checked) {
      this.store_values.push(item);
    } else {
      this.store_values = this.store_values.filter((v: any) => v.id !== item.id);
    }

    const categoryIds = this.store_values.map((v: any) => v.id);

    const models = this.Filter_data1.filter((model: any) =>
      categoryIds.includes(model.vehicle_category_id)
    );

    this.Filter_list['VehicleModel'] = models;
    this.filter_VehicleModel = models;

    this.applyMakeFilter();
  }
  updateMake(item: any, checked: boolean) {

    if (checked) {
      this.store_valuesmake.push(item);
    } else {
      this.store_valuesmake = this.store_valuesmake.filter((v: any) => v.id !== item.id);
    }

    this.applyMakeFilter();
  }
  applyMakeFilter() {

    if (!this.store_valuesmake.length) return;

    const makeIds = this.store_valuesmake.map((v: any) => v.id);

    const models = this.filter_VehicleModel.filter((model: any) =>
      makeIds.includes(model.vehicle_make_id)
    );

    this.Filter_list['VehicleModel'] = models;
    console.log("this.filter", this.Filter_list)
  }
  changesStatus(index: number, event: Event) {

    const checked = (event.target as HTMLInputElement).checked;
    const tab = this.currentTab;

    const item = this.Filter_list[tab][index];
    item.checked = checked;

    if (tab === 'VehicleCategory') {
      this.updateCategory(item, checked);
      this.vehicleCategoryIds = this.store_values.map((v: any) => v.id).join(',');
    }

    if (tab === 'VehicleMake') {
      this.updateMake(item, checked);
      this.vehicleMakeIds = this.store_valuesmake.map((v: any) => v.id).join(',');
    }

    if (tab === 'VehicleModel') {

      if (checked) {
        this.store_valuesmodel.push(item);
      } else {
        this.store_valuesmodel = this.store_valuesmodel.filter((v: any) => v.id !== item.id);
      }

      this.vehicleModelIds = this.store_valuesmodel.map((v: any) => v.id).join(',');
    }

    console.log("CategoryIds:", this.vehicleCategoryIds);
    console.log("MakeIds:", this.vehicleMakeIds);
    console.log("ModelIds:", this.vehicleModelIds);

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
  toggleSelectAllold(key: string) {

    const checked = this.selectAll[key];

    this.filteredFilterList[key].forEach((item: any) => {
      item.checked = checked;
    });

  }
  toggleSelectAll(key: string) {

    const checked = this.selectAll[key];

    this.filteredFilterList[key].forEach((item: any) => {
      item.checked = checked;
    });

  }

  resetFilters() {

    this.Filter_list_keys.forEach((key: any) => {
      this.filteredFilterList[key].forEach((item: any) => item.checked = false);
      this.selectAll[key] = false;
    });

  }
  redirectLiveDashcam(data: any) {
    console.log("data", data)
    console.log("reports", this.filterForm.get('fromDate')?.value ?? '')
    localStorage.setItem("fromdate", this.filterForm.get('fromDate')?.value ?? '')
    localStorage.setItem("todate", this.filterForm.get('toDate')?.value ?? '')
    console.log("dashcam", data)
    localStorage.setItem("dashcam", JSON.stringify(data));
    console.log("dashcam....", localStorage.getItem("dashcam")!)
    // sessionStorage.setItem("dashcam", data)
    if (data.GPSVendor == "Secutrak" || data.GPSVendor == "Android/IOS") {
      this.router.navigate(['/dms/thirdlive']);
      // let link = `https://upfcs.secutrak.in/dashcam/auth/login/?exttkn=${localStorage.getItem('AccessToken')}`
      // window.open(link, '_blank');
    }
    else {
      this.router.navigate(['/dms/thirdlive']);
      // let link = `https://live-streaming.web.app/protocols/cvpro/index.html?deviceId=${data.MobileNo}&uniqueId=${data.ImeiNo}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTc1Njc1MzQsIm5iZiI6MTc1NzU2NzUzNCwianRpIjoiMzAxZTU0MDktNzIxNC00YWMzLTg1NDctOTZjZWE0OTdmMDc4IiwiZXhwIjoxNzU3ODI2NzM0LCJpZGVudGl0eSI6eyJpZCI6MTA4MzI3LCJkYiI6MCwiY28iOjEsIm5hbWUiOiJBcmhhbWFtYnVsYW5jZSIsInR5cGUiOiJhZG1pbiIsInJlYWRfb25seSI6MCwidHoiOi0zMzAsInR6X3MiOiJBc2lhL0tvbGthdGEiLCJzc28iOjAsImxhdCI6MEUtMTAsImxuZyI6MEUtMTAsImRldmljZSI6IndlYiIsImFsaWFzIjoiIn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.Eq_GJEa-Y3BU8bTlrvuYi0ALoxYZQtsTUO1Ad0MYnOU&streamingUrl=https://streaming.track360.net.in&authUrl=https://prod-s1.track360.net.in/api/v1/auth/&channel=[1,2,3]`
      // window.open(link, '_blank');

    }



  }

  Driverlist() {

    var formData = new FormData();
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    if (localStorage.getItem('GroupId') !== 'undefined') {
      formData.append('GroupId', localStorage.getItem('GroupId')!);
    }
    if (localStorage.getItem('GroupId') == 'undefined') {

      formData.append('GroupId', '');
    }
    this.service.Driver_list(formData).subscribe((res: any) => {
      console.log("driverlist", res)
      if (res.Status == "failed") {

        // alert(res.Message);
        // localStorage.removeItem('AccessToke
        // alert("Session expired !. Login Again")n');
        //   location.href ='https://secutrak.in/logout'; 


      }
      else {
        this.driver_list = res.List


      }
    });
  }
  activateSelected() {
    if (!this.selectedRows.length) {
      alert('Select at least one user');
      return;
    }

    console.log('Activate:', this.selectedRows);

    // API call example
    // this.service.activateUsers(this.selectedRows).subscribe(...)
  }
  deactivateSelected() {
    if (!this.selectedRows.length) {
      alert('Select at least one user');
      return;
    }

    console.log('Deactivate:', this.selectedRows);
  }
  deleteSelected() {
    if (!this.selectedRows.length) {
      alert('Select at least one user');
      return;
    }

    if (confirm('Are you sure you want to delete selected users?')) {
      console.log('Delete:', this.selectedRows);
    }
  }
  addUser() {
    console.log('Add user clicked');

    // Example navigation
    // this.router.navigate(['/add-user']);
  }
  searchByNameold() {
    if (!this.searchName) return;

    // 🔎 Find match (case-insensitive)
    const result = this.companyRowData.find(item =>
      item.LandmarkName.toLowerCase().includes(this.searchName.toLowerCase())
    );

    if (!result) {
      alert('Landmark not found!');
      return;
    }

    const [lat, lng] = result.LandmarkGeoCoord.split(',').map(Number);

    const position = { lat, lng };

    // 📍 Add marker
    const marker = new google.maps.Marker({
      position,
      map: this.mapInstance,
      title: result.LandmarkName,
      icon: {
        url: 'assets/imagesnew/landmark.png',
        scaledSize: new google.maps.Size(35, 35) // adjust icon size
      }
    });

    // 🧠 Info window
    const info = new google.maps.InfoWindow({
      content: `<b>${result.LandmarkName}</b><br>${result.LandmarkTypeName}<br>
      <b>${lat}, ${lng}</b>`
    });

    marker.addListener('click', () => {
      info.open(this.mapInstance, marker);
    });

    this.markers_search.push(marker);

    // 🎯 Focus map
    this.mapInstance?.setCenter(position);
    this.mapInstance?.setZoom(15);
  }
  searchByName() {

    // 🧽 If input empty → clear markers & stop
    if (!this.searchName || !this.searchName.trim()) {
      this.clearSearchMarkers();
      return;
    }

    const result = this.companyRowData.find(item =>
      item.LandmarkName.toLowerCase().includes(this.searchName.toLowerCase())
    );

    if (!result) {
      alert('Landmark not found!');
      return;
    }

    // 🧹 Remove old markers before adding new one
    this.clearSearchMarkers();

    const [lat, lng] = result.LandmarkGeoCoord.split(',').map(Number);
    const position = { lat, lng };

    const marker = new google.maps.Marker({
      position,
      map: this.mapInstance,
      title: result.LandmarkName,
      icon: {
        url: 'assets/imagesnew/landmark.png',
        scaledSize: new google.maps.Size(35, 35)
      }
    });

    const info = new google.maps.InfoWindow({
      content: `<b>${result.LandmarkName}</b><br>${result.LandmarkTypeName}<br>
      <b>${lat}, ${lng}</b>`
    });

    marker.addListener('click', () => {
      info.open(this.mapInstance, marker);
    });

    this.markers_search.push(marker);

    this.mapInstance?.setCenter(position);
    this.mapInstance?.setZoom(15);
  }
  plotSearchLocationold() {
    if (!this.searchCoord) return;

    const parts = this.searchCoord.split(',');

    if (parts.length !== 2) {
      alert('Use format: lat,lng');
      return;
    }

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Invalid coordinates');
      return;
    }

    const position = { lat, lng };

    const marker = new google.maps.Marker({
      position,
      map: this.mapInstance,
      title: 'Custom Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    this.mapInstance?.setCenter(position);
    this.mapInstance?.setZoom(14);
  }
  clearSearchMarkers() {
    this.markers_search.forEach(marker => marker.setMap(null));
    this.markers_search = [];
  }
  plotSearchLocation() {

    // 🧽 If empty → clear markers
    if (!this.searchCoord || !this.searchCoord.trim()) {
      this.clearSearchMarkers();
      return;
    }

    const parts = this.searchCoord.split(',');

    if (parts.length !== 2) {
      alert('Use format: lat,lng');
      return;
    }

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Invalid coordinates');
      return;
    }

    // 🧹 Clear old markers
    this.clearSearchMarkers();

    const position = { lat, lng };

    const marker = new google.maps.Marker({
      position,
      map: this.mapInstance,
      title: 'Custom Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    this.markers_search.push(marker);

    this.mapInstance?.setCenter(position);
    this.mapInstance?.setZoom(14);
  }
  getColor(status: string): string {
    switch (status) {
      case 'Active': return 'green';
      case 'InActive': return 'gray';
      case 'NoData': return 'orange';
      case 'Breakdown': return 'red';
      default: return 'black';
    }
  }
  createDot(status: string, location: string): string {
    const color = this.getColor(status);

    return `
    <span 
      style="
        display:inline-block;
        width:12px;
        height:12px;
        border-radius:50%;
        margin-right:4px;
        background:${color};
        cursor:pointer;
      "
      title="${location} - ${status}">
    </span>
  `;
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




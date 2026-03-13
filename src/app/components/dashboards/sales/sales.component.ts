import {Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { StatisticsChartData, TopCategoryChartData, VisitorsData, VisitorsReportData } from '../../../shared/data/dashboard_chartData/salechart.data';
import { SpkApexchartsComponent } from '../../../@spk/spk-apexcharts/apexcharts.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { SpkActivityCardComponent } from '../../../@spk/reusable-dashboard/spk-activity-card/spk-activity-card.component';
import { SpkProjectCardComponent } from '../../../@spk/reusable-dashboard/spk-project-card/spk-project-card.component';
import { SpkSalesCardsComponent } from '../../../@spk/reusable-dashboard/spk-sales-cards/spk-sales-cards.component';
import { SpkSchoolCardComponent } from '../../../@spk/reusable-dashboard/spk-school-card/spk-school-card.component';
import { SpkDashboardCardComponent } from '../../../@spk/reusable-dashboard/spk-dashboard-card/spk-dashboard-card.component';
import { SpkReusableTablesComponent } from '../../../@spk/spk-reusable-tables/spk-reusable-tables.component';
import { SpkFlatpickrComponent } from '../../../@spk/spk-flatpickr/spk-flatpickr.component';
import { SpkDropdownsComponent } from '../../../@spk/reusable-ui-elements/spk-dropdowns/spk-dropdowns.component';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [RouterModule,SharedModule,NgbModule,FormsModule,SpkFlatpickrComponent,SpkApexchartsComponent,SpkDashboardCardComponent,SpkActivityCardComponent,
    SpkReusableTablesComponent,SpkProjectCardComponent,CommonModule,SpkSchoolCardComponent,SpkSalesCardsComponent,SpkDropdownsComponent],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent  {
  public chartOptions = StatisticsChartData;
  public chartOptions2 = TopCategoryChartData;
  public chartOptions1 = VisitorsReportData;
  public chartOptions3 = VisitorsData;

  constructor(private sanitizer : DomSanitizer){
    document.querySelector('.single-page-header')?.classList.add('d-none');
    document.body.classList.remove('authenticationcover-background','bg-primary-transparent','position-relative');
  }
  
  ngOnDestroy(){
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }

  cardData = [
    {id:1, title:"Total Sales",
      value:'32,981',
      icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect><path d="M168,88a40,40,0,0,1-80,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>`,
      footerTitle:'View all sales',
      Bgcolor:'primary',
      textdecoration:'text-decoration-underline',
      percentageChange:'0.29%',
      direction:'up',
      textcolor:"success" },

    {id:2, title:"Total Revenue",
      value:'$14,32,145',
      icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="128" y1="24" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M184,88a40,40,0,0,0-40-40H112a40,40,0,0,0,0,80h40a40,40,0,0,1,0,80H104a40,40,0,0,1-40-40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`,
      footerTitle:'complete revenue',
      Bgcolor:'secondary',
      percentageChange:'3.45%',
      textdecoration:'text-decoration-underline',
      direction:'up',
      textcolor:"danger" },

    {id:3, title:"Page Views",
        value:'4,678',
        icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><circle cx="84" cy="108" r="52" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M10.23,200a88,88,0,0,1,147.54,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M172,160a87.93,87.93,0,0,1,73.77,40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M152.69,59.7A52,52,0,1,1,172,160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`,
        footerTitle:'Total page views',
        Bgcolor:'success',
        percentageChange:'11.54%',
        textdecoration:'text-decoration-underline',
       direction:'up',
        textcolor:"success" },

    {id:4, title:"Profit By Sales",
          value:'$645',
          icon:` <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M40,56V184a16,16,0,0,0,16,16H216a8,8,0,0,0,8-8V80a8,8,0,0,0-8-8H56A16,16,0,0,1,40,56h0A16,16,0,0,1,56,40H192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="180" cy="132" r="12"/></svg>`,
          footerTitle:'Total profit earned',
          Bgcolor:'info',
          percentageChange:'0.18%',
          textdecoration:'text-decoration-underline',
         direction:'up',
          textcolor:"success" },
]

sanitizeIcon(icon: string): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(icon);
}
TransactionColumn = [
  {
    header:'Payment Mode'
  },
  {
    header:'Amount Paid'
  }
]
Transaction = [
  {
    id: '****2783',
    method: 'Paypal',
    iconClass: 'ri-paypal-line fs-18',
    iconColor:'primary',
    amount:' $1234.78',
    date: 'Nov 22, 2024',
    description: 'Online Transaction',
  },
  {
    id: '',
    method: 'Digital Wallet',
    iconClass: 'ri-wallet-3-line fs-18',
    iconColor:'secondary',
    amount: '$623.99',
    date: 'Nov 22, 2024',
    description: 'Online Transaction',
  },
  {
    id: '****7893',
    method: 'Mastro Card',
    iconClass: 'ri-mastercard-line fs-18',
    iconColor:'success',
    amount: '$1324.00',
    date: 'Nov 21, 2024',
    description: 'Card Payment',
  },
  {
    id: '',
    method: 'Cash On Delivery',
    iconClass: 'ti ti-currency-dollar fs-18',
    iconColor:'info',
    amount: '$1123.49',
    date: 'Nov 20, 2024',
    description: 'Pay On Delivery',
  },
  {
    id: '****2563',
    method: 'Visa Card',
    iconClass: 'ri-visa-line fs-18',
    iconColor:'warning',
    amount: '$1289.00',
    date: 'Nov 18, 2024',
    description: 'Card Payment',
  }
]

Ordercolumn =[
{
  header:'Product'
},
{
  header:'Category'
},
{
  header:'Quantity'
},
{
  header:'Customer'
},
{
  header:'Status'
},
{
  header:'Price'
},
{
  header:'Ordered Date	'
},
{
  header:'Action'
},
]
Order = [
  {
    id: 1,
    product: 'Classic tufted leather sofa',
    imageUrl: './assets/images/ecommerce/png/1.png',
    category: 'Furniture',
    quantity: 1,
    customer: 'Lucas Hayes',
    customerImageUrl: './assets/images/faces/1.jpg',
    status: 'Shipped',
    price: 1200.00,
    date: '2024-05-18',
    checked: false
  },
  {
    id: 2,
    product: 'Rose Flower Pot',
    imageUrl: './assets/images/ecommerce/png/36.png',
    category: 'Decoration',
    quantity: 2,
    customer: 'Abigail Scott',
    customerImageUrl: './assets/images/faces/2.jpg',
    status: 'Delivered',
    price: 250.00,
    date: '2024-05-19',
    checked: true
  },
  {
    id: 3,
    product: 'Leather Handbag',
    imageUrl: './assets/images/ecommerce/png/31.png',
    category: 'Fashion',
    quantity: 1,
    customer: 'Mason Wallace',
    customerImageUrl: './assets/images/faces/10.jpg',
    status: 'Processing',
    price: 800.00,
    date: '2024-05-20',
    checked: true
  },
  {
    id: 4,
    product: 'Polaroid Medium Camera',
    imageUrl: './assets/images/ecommerce/png/14.png',
    category: 'Electronics',
    quantity: 3,
    customer: 'Chloe Lewis',
    customerImageUrl: './assets/images/faces/3.jpg',
    status: 'Pending',
    price: 50.00,
    date: '2024-05-20',
    checked: false
  },
  {
    id: 5,
    product: 'Digital Watch',
    imageUrl: './assets/images/ecommerce/png/13.png',
    category: 'Fashion',
    quantity: 2,
    customer: 'Henry Morgan',
    customerImageUrl: './assets/images/faces/11.jpg',
    status: 'Shipped',
    price: 100.00,
    date: '2024-05-21',
    checked: false
  }
];

recentActivityData = [
  {
    activity: 'Jane Smith ordered 5 new units of',
    highlight: 'Product Y.',
    highlight1:'',
    highlightClass: 'text-primary fw-semibold',
    time: '12:45 Am',
  },
  {
    activity: 'Scheduled demo with potential client DEF for next Tuesday',
    highlight: '',
    highlight1:'',
    time: '03:26 Pm',
  },
  {
    activity: 'Product X price updated to',
    highlight: '$XX.XX',
    highlight1:' per every unit',
    highlightClass: 'text-success fw-semibold',
    time: '08:52 Pm',
  },
  {
    activity: 'Database backup completed successfully',
    highlight: '',
    highlight1:'',
    time: '02:54 Am',
  },
  {
    activity: 'Generated',
    highlight: '$10,000',
    highlight1:'in revenue',
    highlightClass: 'text-warning fw-semibold',
    time: '11:38 Am',
  },
  {
    activity: 'Processed refund for Order',
    highlight: '#13579',
    highlight1:' due to defective item',
    highlightClass: 'text-danger fw-semibold',
    time: '01:42 Pm',
  },
];

countries = [
  {
    name: 'United States',
    flag: './assets/images/flags/us_flag.jpg',
    avatarBg:'avatar p-2 bg-light border avatar-rounded',
    sales: '32,190 Sales',
    revenue: '$32,190',
    change: '0.27%',
    bgValue:'success',
    trend: 'up',
     Arrow:true
  },
  {
    name: 'Germany',
    flag: './assets/images/flags/germany_flag.jpg',
    avatarBg:'avatar p-2 bg-light border avatar-rounded',
    sales: '8,798 Sales',
    revenue: '$29,234',
    change: '0.12%',
    bgValue:'success',
    trend: 'up',
    Arrow:true
  },
  {
    name: 'Mexico',
    flag: './assets/images/flags/mexico_flag.jpg',
    avatarBg:'avatar p-2 bg-light border avatar-rounded',
    sales: '16,885 Sales',
    revenue: '$26,166',
    change: '0.75%',
    bgValue:'danger',
    trend: 'down',
    Arrow:true
  },
  {
    name: 'UAE',
    flag: './assets/images/flags/uae_flag.jpg',
    avatarBg:'avatar p-2 bg-light border avatar-rounded',
    sales: '14,885 Sales',
    revenue: '$24,263',
    change: '1.45%',
    bgValue:'success',
    trend: 'up',
    Arrow:true
  },
  {
    name: 'Argentina',
    flag: './assets/images/flags/argentina_flag.jpg',
    avatarBg:'avatar p-2 bg-light border avatar-rounded',
    sales: '17,578 Sales',
    revenue: '$23,897',
    change: '0.36%',
    bgValue:'success',
    trend: 'up',
    Arrow:true
  },
  {
    name: 'Russia',
    flag: './assets/images/flags/russia_flag.jpg',
    avatarBg:'avatar p-2 bg-light border avatar-rounded',
    sales: '10,118 Sales',
    revenue: '$20,212',
    change: '0.68%',
    bgValue:'danger',
    trend: 'down',
    Arrow:true
  }
];

categories = [
  {
    name: 'Electronics',
    sales: 1754,
    percentageChange: 0.64,
    trend: 'up',
    trendIcon: 'ti ti-trending-up',
    trendClass: 'text-success',
    status: 'Increased'
  },
  {
    name: 'Accessories',
    sales: 1234,
    percentageChange: -2.75,
    trend: 'down',
    trendIcon: 'ti ti-trending-down',
    trendClass: 'text-danger',
    status: 'Decreased'
  },
  {
    name: 'Home Appliances',
    sales: 878,
    percentageChange: 1.54,
    trend: 'up',
    trendIcon: 'ti ti-trending-up',
    trendClass: 'text-success',
    status: 'Increased'
  },
  {
    name: 'Beauty Products',
    sales: 270,
    percentageChange: 1.54,
    trend: 'up',
    trendIcon: 'ti ti-trending-up',
    trendClass: 'text-success',
    status: 'Increased'
  },
  {
    name: 'Furniture',
    sales: 456,
    percentageChange: -0.12,
    trend: 'down',
    trendIcon: 'ti ti-trending-down',
    trendClass: 'text-danger',
    status: 'Decreased'
  }
];

segments = [
  {
    label: 'On Going Tasks',
    count: 1823,
    percentage: '0.78%',
    percentageClass: 'text-success',
    itemClass: 'male',
    iconClass: 'up'
  },
  {
    name: 'Male',
    count: 18235,
    change: '0.78%',
    trend: 'up',
    class: 'male'
  },
  {
    label: 'On Going Tasks',
    count: 1823,
    percentage: '0.78%',
    percentageClass: 'text-success',
    itemClass: 'male',
    iconClass: 'ti ti-arrow-narrow-up'
  },
  {
    name: 'Female',
    count: 12743,
    change: '1.57%',
    trend: 'down',
    class: 'female'
  },
  {
    name: 'Others',
    count: 5369,
    change: '0.32%',
    trend: 'up',
    class: 'others'
  },
  {
    name: 'Not Mentioned',
    count: 16458,
    change: '19.45%',
    trend: 'up',
    class: 'not-mentioned'
  }
];

taskActivities = [
  {
    label: 'Male',
    count: 18235,
    percentage: '0.78%',
    percentageClass: 'text-success',
    itemClass: 'male',
    iconClass: 'ti ti-arrow-narrow-up'
  },
  {
    label: 'Female',
    count: 12743,
    percentage: '1.57%',
    percentageClass: 'text-danger',
    itemClass: 'female',
    iconClass: 'ti ti-arrow-narrow-down'
  },
  {
    label: 'Others',
    count: 5369,
    percentage: '0.32%',
    percentageClass: 'text-success',
    itemClass: 'others',
    iconClass: 'ti ti-arrow-narrow-up'
  },
  {
    label: 'Not Mentioned',
    count: 16458,
    percentage: '19.45%',
    percentageClass: 'text-success',
    itemClass: 'not-mentioned',
    iconClass: 'ti ti-arrow-narrow-up'
  }
];

visitorsBrowserList = [
  {
    name: 'Chrome',
    company: 'Google LLC',
    change: '3.26%',
    visitors: '13,546',
    progress: 70,
    trend: 'up',
    imageUrl: './assets/images/browsers/chrome.png',
    progressBarClass: 'bg-primary'
  },
  {
    name: 'Edge',
    company: 'Microsoft Corp',
    change: '0.96%',
    visitors: '11,322',
    progress: 60,
    trend: 'down',
    imageUrl: './assets/images/browsers/edge.png',
    progressBarClass: 'bg-secondary'
  },
  {
    name: 'Firefox',
    company: 'Mozilla Corp',
    change: '1.64%',
    visitors: '6,236',
    progress: 30,
    trend: 'up',
    imageUrl: './assets/images/browsers/firefox.png',
    progressBarClass: 'bg-success'
  },
  {
    name: 'Safari',
    company: 'Apple Inc',
    change: '6.38%',
    visitors: '10,235',
    progress: 50,
    trend: 'up',
    imageUrl: './assets/images/browsers/safari.png',
    progressBarClass: 'bg-warning'
  },
  {
    name: 'UCBrowser',
    company: 'UCWeb',
    change: '5.18%',
    visitors: '14,965',
    progress: 80,
    trend: 'up',
    imageUrl: './assets/images/browsers/uc.png',
    progressBarClass: 'bg-danger'
  },
  {
    name: 'Opera',
    company: 'Opera Software AS',
    change: '1.65%',
    visitors: '8,432',
    progress: 40,
    trend: 'down',
    imageUrl: './assets/images/browsers/opera.png',
    progressBarClass: 'bg-info'
  },
  {
    name: 'Samsung Internet',
    company: 'Samsung',
    change: '0.99%',
    visitors: '4,134',
    progress: 36,
    trend: 'up',
    imageUrl: './assets/images/browsers/samsung-internet.png',
    progressBarClass: 'bg-orange'
  }
];

}
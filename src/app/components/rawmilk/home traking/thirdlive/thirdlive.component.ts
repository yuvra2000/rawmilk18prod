import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomeService } from '../home.service';
// import { NavService } from '../../../shared/services/navservice';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AgGridAngular } from 'ag-grid-angular';
import { LinkPanelComponent } from '../link-panel/link-panel.component';
import { SharedModule } from "../../../../shared/shared.module";

@Component({
  selector: 'app-thirdlive',
  standalone: true,
  imports: [NgbAccordionModule, NgbModule, AgGridAngular, CommonModule, LinkPanelComponent, FormsModule, ReactiveFormsModule, CommonModule, NgSelectComponent,
    GoogleMapsModule, NgbModule, SharedModule],
  templateUrl: './thirdlive.component.html',
  styleUrl: './thirdlive.component.scss'
})
export class ThirdliveComponent {
  channels = [1, 2, 3];
  cameradata: any = []
  LiveFlag: boolean = true
  safeUrl!: SafeResourceUrl;
  /////////////////////////////////////////////
  selectedChannels = {
    cam1: true,
    cam2: true,
    cam3: false,
    cam4: false
  };

  streams: any[] = [];


  //////////////////////////////////////////
  constructor(private sanitizer: DomSanitizer, private service: HomeService) { }

  ngOnInit(): void {



    localStorage.getItem("dashcam")
    let dashcam: any = JSON.parse(localStorage.getItem("dashcam") || '{}');
    this.updateStreams()
    // let dashcam: any = localStorage.getItem("dashcam")
    this.getAlertData(dashcam.VehicleNo)
    const data = {
      MobileNo: dashcam.MobileNo,
      ImeiNo: dashcam.ImeiNo,
      channels: [1, 2, 3]
    };

    console.log("dashcam1", dashcam)
    // &channel=${JSON.stringify(data.channels)}
    // const link = `https://live-streaming.web.app/protocols/cvpro/index.html?deviceId=${data.MobileNo}&uniqueId=${data.ImeiNo}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTc1Njc1MzQsIm5iZiI6MTc1NzU2NzUzNCwianRpIjoiMzAxZTU0MDktNzIxNC00YWMzLTg1NDctOTZjZWE0OTdmMDc4IiwiZXhwIjoxNzU3ODI2NzM0LCJpZGVudGl0eSI6eyJpZCI6MTA4MzI3LCJkYiI6MCwiY28iOjEsIm5hbWUiOiJBcmhhbWFtYnVsYW5jZSIsInR5cGUiOiJhZG1pbiIsInJlYWRfb25seSI6MCwidHoiOi0zMzAsInR6X3MiOiJBc2lhL0tvbGthdGEiLCJzc28iOjAsImxhdCI6MEUtMTAsImxuZyI6MEUtMTAsImRldmljZSI6IndlYiIsImFsaWFzIjoiIn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.Eq_GJEa-Y3BU8bTlrvuYi0ALoxYZQtsTUO1Ad0MYnOU&streamingUrl=https://streaming.track360.net.in&authUrl=https://prod-s1.track360.net.in/api/v1/auth/`;
    // console.log("link", link)
    // this.streams = this.channels.map(ch => {
    //   const url = `${link}&channel=[${ch}]#disableScroll`;
    //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // });


  }
  liveplaybackF(data: any) {
    if (data == 'Live') {
      this.LiveFlag = true
    }
    else {
      this.LiveFlag = false
      this.playback()
    }
  }
  openVideo(urls: string[]) {
    this.LiveFlag = false
    if (urls && urls.length > 0) {
      const videoUrl = urls[0];

      // Option 1: open in new tab
      // window.open(videoUrl, '_blank');
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);

      // Option 2 (better UX): show in modal (if you want, I can help)
    }
  }
  playback() {
    let dashcam: any = JSON.parse(localStorage.getItem("dashcam") || '{}');
    // const dashcam = this.dashcam; // assume you already have dashcam details

    const data = {
      MobileNo: dashcam.MobileNo,
      ImeiNo: dashcam.ImeiNo,
    };

    const link = `https://live-streaming.web.app/protocols/cvpro/index_timeline.html?deviceId=${data.MobileNo}&uniqueId=${data.ImeiNo}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTc1Njc1MzQsIm5iZiI6MTc1NzU2NzUzNCwianRpIjoiMzAxZTU0MDktNzIxNC00YWMzLTg1NDctOTZjZWE0OTdmMDc4IiwiZXhwIjoxNzU3ODI2NzM0LCJpZGVudGl0eSI6eyJpZCI6MTA4MzI3LCJkYiI6MCwiY28iOjEsIm5hbWUiOiJBcmhhbWFtYnVsYW5jZSIsInR5cGUiOiJhZG1pbiIsInJlYWRfb25seSI6MCwidHoiOi0zMzAsInR6X3MiOiJBc2lhL0tvbGthdGEiLCJzc28iOjAsImxhdCI6MEUtMTAsImxuZyI6MEUtMTAsImRldmljZSI6IndlYiIsImFsaWFzIjoiIn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.Eq_GJEa-Y3BU8bTlrvuYi0ALoxYZQtsTUO1Ad0MYnOU&streamingUrl=https%3A%2F%2Fstreaming.track360.net.in&authUrl=https%3A%2F%2Fprod-s1.track360.net.in%2Fapi%2Fv1%2Fauth%2F&channel=%5B1%2C2%2C3%5D`
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  updateStreams() {
    let dashcam: any = JSON.parse(localStorage.getItem("dashcam") || '{}');
    // const dashcam = this.dashcam; // assume you already have dashcam details

    const data = {
      MobileNo: dashcam.MobileNo,
      ImeiNo: dashcam.ImeiNo,
    };

    const link = `https://live-streaming.web.app/protocols/cvpro/index.html?deviceId=${data.MobileNo}&uniqueId=${data.ImeiNo}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTc1Njc1MzQsIm5iZiI6MTc1NzU2NzUzNCwianRpIjoiMzAxZTU0MDktNzIxNC00YWMzLTg1NDctOTZjZWE0OTdmMDc4IiwiZXhwIjoxNzU3ODI2NzM0LCJpZGVudGl0eSI6eyJpZCI6MTA4MzI3LCJkYiI6MCwiY28iOjEsIm5hbWUiOiJBcmhhbWFtYnVsYW5jZSIsInR5cGUiOiJhZG1pbiIsInJlYWRfb25seSI6MCwidHoiOi0zMzAsInR6X3MiOiJBc2lhL0tvbGthdGEiLCJzc28iOjAsImxhdCI6MEUtMTAsImxuZyI6MEUtMTAsImRldmljZSI6IndlYiIsImFsaWFzIjoiIn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.Eq_GJEa-Y3BU8bTlrvuYi0ALoxYZQtsTUO1Ad0MYnOU&streamingUrl=https://streaming.track360.net.in&authUrl=https://prod-s1.track360.net.in/api/v1/auth/`;
    // Determine which channels are selected
    const selected: number[] = [];
    if (this.selectedChannels.cam1) selected.push(1);
    if (this.selectedChannels.cam2) selected.push(2);
    if (this.selectedChannels.cam3) selected.push(3);
    if (this.selectedChannels.cam4) selected.push(4);

    this.streams = selected.map(ch => {
      const url = `${link}&channel=[${ch}]#disableScroll`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }
  cleanDate(dateStr: string | null): string {
    if (!dateStr) return "";

    // Replace "T" with space and ensure seconds exist
    return dateStr.replace("T", " ").trim();
  }

  getAlertData(vehicleNo: string) {
    const formData = new FormData();

    // Get current date & time
    const now = new Date();

    // Format helper
    const formatDateTime = (date: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      const yyyy = date.getFullYear();
      const MM = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const mm = pad(date.getMinutes());
      const ss = pad(date.getSeconds());
      return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
    };

    // Build FromDate (today 00:00:01)
    const fromDate = new Date(now);
    fromDate.setHours(0, 0, 1, 0);

    // Build ToDate (current time)
    const toDate = now;

    // Append values
    const from = this.cleanDate(localStorage.getItem("fromdate"));
    const to = this.cleanDate(localStorage.getItem("todate"));

    formData.append('FromDate', from);
    formData.append('ToDate', to);

    // formData.append('ToDate', '2025-10-28 23:59:59');
    // formData.append('FromDate', formatDateTime(fromDate));
    // formData.append('ToDate', formatDateTime(toDate));
    formData.append('AccessToken', localStorage.getItem('AccessToken')!);
    formData.append('ForWeb', '1');
    formData.append('MpcId', '');
    formData.append('AlertType', '');
    formData.append('AlertParentType', 'DASHCAM');
    formData.append('VehicleNo', vehicleNo);



    // Call API
    // this.service.liveAlert(formData).subscribe({
    //   next: (res: any) => {
    //     this.cameradata = res.Data;
    //     console.log('Alert data response:', res);
    //   },
    //   error: (err) => {
    //     console.error('Error fetching alert data:', err);
    //   }
    // });
    this.service.liveAlert(formData).subscribe({
      next: (res: any) => {
        console.log('Alert data response:', res);

        // ✅ Handle API-level failure
        if (res?.Status === 'failed') {
          alert(res?.Message || 'Something went wrong');

          // optional: clear old data
          this.cameradata = [];

          return;
        }

        // ✅ Success case
        this.cameradata = res.Data;
      },

      error: (err: any) => {
        console.error('Error fetching alert data:', err);

        // ✅ Network / server error
        alert('Server error. Please try again later.');
      }
    });

  }

  // this.liveStreamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
  // this.streams = data.channels.map(channel => {
  //   const link = `https://live-streaming.web.app/protocols/cvpro/index.html?deviceId=${data.MobileNo}&uniqueId=${data.ImeiNo}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTc1Njc1MzQsIm5iZiI6MTc1NzU2NzUzNCwianRpIjoiMzAxZTU0MDktNzIxNC00YWMzLTg1NDctOTZjZWE0OTdmMDc4IiwiZXhwIjoxNzU3ODI2NzM0LCJpZGVudGl0eSI6eyJpZCI6MTA4MzI3LCJkYiI6MCwiY28iOjEsIm5hbWUiOiJBcmhhbWFtYnVsYW5jZSIsInR5cGUiOiJhZG1pbiIsInJlYWRfb25seSI6MCwidHoiOi0zMzAsInR6X3MiOiJBc2lhL0tvbGthdGEiLCJzc28iOjAsImxhdCI6MEUtMTAsImxuZyI6MEUtMTAsImRldmljZSI6IndlYiIsImFsaWFzIjoiIn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.Eq_GJEa-Y3BU8bTlrvuYi0ALoxYZQtsTUO1Ad0MYnOU&streamingUrl=https://streaming.track360.net.in&authUrl=https://prod-s1.track360.net.in/api/v1/auth/&channel=[${channel}]`;
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  // });
  // this.streams = data.channels.map(channel => {
  //   const link = `https://live-streaming.web.app/protocols/cvpro/index.html?deviceId=${data.MobileNo}&uniqueId=${data.ImeiNo}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTc1Njc1MzQsIm5iZiI6MTc1NzU2NzUzNCwianRpIjoiMzAxZTU0MDktNzIxNC00YWMzLTg1NDctOTZjZWE0OTdmMDc4IiwiZXhwIjoxNzU3ODI2NzM0LCJpZGVudGl0eSI6eyJpZCI6MTA4MzI3LCJkYiI6MCwiY28iOjEsIm5hbWUiOiJBcmhhbWFtYnVsYW5jZSIsInR5cGUiOiJhZG1pbiIsInJlYWRfb25seSI6MCwidHoiOi0zMzAsInR6X3MiOiJBc2lhL0tvbGthdGEiLCJzc28iOjAsImxhdCI6MEUtMTAsImxuZyI6MEUtMTAsImRldmljZSI6IndlYiIsImFsaWFzIjoiIn0sImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.Eq_GJEa-Y3BU8bTlrvuYi0ALoxYZQtsTUO1Ad0MYnOU&streamingUrl=https://streaming.track360.net.in&authUrl=https://prod-s1.track360.net.in/api/v1/auth/&channel=[${channel}]`;
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  // });


  toggleFullScreen(event: MouseEvent) {
    const iframe = (event.currentTarget as HTMLElement).querySelector('iframe');
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen().catch(err => console.error('Fullscreen error:', err));
      } else {
        document.exitFullscreen();
      }
    }
  }

  // sidebarToggle() {
  //   let App = document.querySelector('.app');

  //   // Toggle the collapseSidebar property correctly
  //   this.navServices.collapseSidebar = !this.navServices.collapseSidebar;

  //   // Add or remove the class based on the state of collapseSidebar
  //   if (this.navServices.collapseSidebar) {
  //     App?.classList.add('sidenav-toggled');
  //   } else {
  //     App?.classList.remove('sidenav-toggled');
  //   }


  // }
}



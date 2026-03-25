import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: 'app-vehicle-cell-renderer',
  standalone: true,
  template: `
    <a
      (click)="onVehicleClick()"
      style="color:rgb(66, 66, 138);cursor:pointer; margin-right: 8px;"
    >
      {{ params.value }}
    </a>
    <button (click)="onDownloadClick()" title="Download Excel">
      <i style="color: #1a741a;font-size: 16px;" class="fas fa-download"></i>
    </button>
  `,
})
export class VehicleCellRenderer implements ICellRendererAngularComp {
  public params: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onVehicleClick() {
    this.params.onMapClick(this.params.data);
  }

  onDownloadClick() {
    this.params.onDownloadClick(this.params.data);
  }
}
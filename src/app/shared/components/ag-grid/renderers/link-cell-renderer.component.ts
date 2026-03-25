import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-link-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="isScheduled; else disabledLink">
      <button (click)="onClick()" title="Link Trip">
        <img
          style="cursor:pointer;"
          src="assets/tripIcon/add_link.svg"
          alt="Link"
        />
      </button>
    </ng-container>
    <ng-template #disabledLink>
      <img src="assets/tripIcon/disable_link.svg" alt="Disabled Link" />
    </ng-template>
  `,
})
export class LinkCellRenderer implements ICellRendererAngularComp {
  private params: any;
  public isScheduled: boolean = false;

  agInit(params: any): void {
    this.params = params;
    this.isScheduled = params.data?.TripStatus === 'Schedule';
  }

  refresh(params: any): boolean {
    return false;
  }

  onClick() {
    this.params.clicked(this.params.data);
  }
}
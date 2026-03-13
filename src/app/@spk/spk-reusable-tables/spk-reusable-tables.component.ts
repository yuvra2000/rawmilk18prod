import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'spk-reusable-tables',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './spk-reusable-tables.component.html',
  styleUrl: './spk-reusable-tables.component.scss'
})
export class SpkReusableTablesComponent {
  @Input() columns: any[] = [];
  @Input() tableClass: string='';
  @Input() tableHead: string='';
  @Input() tableFooter: string='';
  @Input() tableBody: string='';
  @Input() checkboxClass: string='';
  @Input() tableHeadColumn: string='';
  @Input() data: any[] = [];
  @Input() title: any[] = [];
  @Input() footerData: any[] = [];
  @Input() showFooter: boolean = false;
  @Input() showCheckbox :boolean=false;
  @Input() rows: { checked: boolean; [key: string]: any }[] = [];
  allTasksChecked: boolean = false;
  tableData: any;

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.allTasksChecked = checked;
    this.tableData.forEach((row: { checked: boolean; }) => (row.checked = checked));
}

toggleRowChecked(row: any) {
    this.allTasksChecked = this.tableData.every((row: { checked: any; }) => row.checked);
}
}

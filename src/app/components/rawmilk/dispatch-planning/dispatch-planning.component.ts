import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { DispatchPlanningStore } from './state-service/store';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dispatch-planning',
  standalone: true,
  imports: [FilterFormComponent, NgbTooltip],
  templateUrl: './dispatch-planning.component.html',
  styleUrl: './dispatch-planning.component.scss',
})
export class DispatchPlanningComponent implements OnInit {
  store: DispatchPlanningStore = new DispatchPlanningStore();
  @ViewChild('dispatchPlanningFilter')
  dispatchPlanningFilter!: FilterFormComponent;

  ngOnInit(): void {
    this.store.loadInitialData();
  }

  async onExcelUpload(event: Event): Promise<void> {
    const rows = await this.store.uploadExcelFile(event);

    if (!rows.length || !this.dispatchPlanningFilter) {
      return;
    }

    const formArray =
      this.dispatchPlanningFilter.getFormArray('dispatchDetails');
    const dispatchField = this.store
      .filterfields()
      .find((field) => field.name === 'dispatchDetails');
    const subFields = dispatchField?.formArrayFields || [];

    while (formArray.length < rows.length) {
      this.dispatchPlanningFilter.addFormArrayItem(
        'dispatchDetails',
        subFields,
      );
    }

    this.dispatchPlanningFilter.populateForm({
      dispatchDetails: rows,
    });
  }
}

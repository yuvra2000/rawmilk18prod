import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-collapse-wrapper',
  standalone: true,
  imports: [NgbCollapseModule, CommonModule],
  templateUrl: './collapse-wrapper.component.html',
  styleUrl: './collapse-wrapper.component.scss',
})
export class CollapseWrapperComponent {
  @Output() iconClick = new EventEmitter<void>();
  collapseSectionClass = input<string>(''); // Input for additional classes to collapse section
  collapsed = model(false);
  filterText = input('Filter');
  toggleCollapse(): void {
    this.collapsed.update((value) => !value);
  }
  onIconClick(): void {
    this.iconClick.emit();
  }
}

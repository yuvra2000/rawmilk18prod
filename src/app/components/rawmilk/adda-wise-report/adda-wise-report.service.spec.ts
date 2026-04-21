import { TestBed } from '@angular/core/testing';

import { AddaWiseReportService } from './adda-wise-report.service';

describe('AddaWiseReportService', () => {
  let service: AddaWiseReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddaWiseReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

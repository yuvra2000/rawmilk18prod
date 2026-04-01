import { TestBed } from '@angular/core/testing';

import { LeciReportService } from './leci-report.service';

describe('LeciReportService', () => {
  let service: LeciReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeciReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

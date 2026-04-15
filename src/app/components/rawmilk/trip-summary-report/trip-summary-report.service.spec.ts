import { TestBed } from '@angular/core/testing';

import { TripSummaryReportService } from './trip-summary-report.service';

describe('TripSummaryReportService', () => {
  let service: TripSummaryReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripSummaryReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

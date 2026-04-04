import { TestBed } from '@angular/core/testing';

import { ElockTripReportService } from './elock-trip-report.service';

describe('ElockTripReportService', () => {
  let service: ElockTripReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElockTripReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

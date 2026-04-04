import { TestBed } from '@angular/core/testing';

import { LidTripReportService } from './lid-trip-report.service';

describe('LidTripReportService', () => {
  let service: LidTripReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LidTripReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

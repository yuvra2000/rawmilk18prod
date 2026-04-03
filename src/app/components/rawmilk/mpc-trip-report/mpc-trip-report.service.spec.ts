import { TestBed } from '@angular/core/testing';

import { MpcTripReportService } from './mpc-trip-report.service';

describe('MpcTripReportService', () => {
  let service: MpcTripReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MpcTripReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

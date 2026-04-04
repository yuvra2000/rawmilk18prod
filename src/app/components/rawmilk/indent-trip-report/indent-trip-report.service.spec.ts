import { TestBed } from '@angular/core/testing';

import { IndentTripReportService } from './indent-trip-report.service';

describe('IndentTripReportService', () => {
  let service: IndentTripReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndentTripReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

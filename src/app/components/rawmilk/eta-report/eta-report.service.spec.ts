import { TestBed } from '@angular/core/testing';

import { EtaReportService } from './eta-report.service';

describe('EtaReportService', () => {
  let service: EtaReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtaReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { FranchiseReportService } from './franchise-report.service';

describe('FranchiseReportService', () => {
  let service: FranchiseReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FranchiseReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

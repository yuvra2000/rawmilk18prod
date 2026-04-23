import { TestBed } from '@angular/core/testing';

import { OtherStoppageReportService } from './other-stoppage-report.service';

describe('OtherStoppageReportService', () => {
  let service: OtherStoppageReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherStoppageReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

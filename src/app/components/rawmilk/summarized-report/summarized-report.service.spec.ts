import { TestBed } from '@angular/core/testing';

import { SummarizedReportService } from './summarized-report.service';

describe('SummarizedReportService', () => {
  let service: SummarizedReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummarizedReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

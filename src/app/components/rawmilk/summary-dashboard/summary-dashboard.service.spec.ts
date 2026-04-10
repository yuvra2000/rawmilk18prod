import { TestBed } from '@angular/core/testing';

import { SummaryDashboardService } from './summary-dashboard.service';

describe('SummaryDashboardService', () => {
  let service: SummaryDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

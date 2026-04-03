import { TestBed } from '@angular/core/testing';

import { LeciDashboardService } from './leci-dashboard.service';

describe('LeciDashboardService', () => {
  let service: LeciDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeciDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

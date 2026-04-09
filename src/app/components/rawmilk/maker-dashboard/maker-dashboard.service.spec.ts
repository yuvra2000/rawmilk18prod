import { TestBed } from '@angular/core/testing';

import { MakerDashboardService } from './maker-dashboard.service';

describe('MakerDashboardService', () => {
  let service: MakerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

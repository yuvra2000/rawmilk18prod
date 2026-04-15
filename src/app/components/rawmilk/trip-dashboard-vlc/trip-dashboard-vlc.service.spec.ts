import { TestBed } from '@angular/core/testing';

import { TripDashboardVlcService } from './trip-dashboard-vlc.service';

describe('TripDashboardVlcService', () => {
  let service: TripDashboardVlcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripDashboardVlcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

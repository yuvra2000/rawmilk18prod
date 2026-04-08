import { TestBed } from '@angular/core/testing';

import { LoadPlanningService } from './load-planning.service';

describe('LoadPlanningService', () => {
  let service: LoadPlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadPlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

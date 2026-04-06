import { TestBed } from '@angular/core/testing';

import { DispatchPlanningService } from './dispatch-planning.service';

describe('DispatchPlanningService', () => {
  let service: DispatchPlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchPlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

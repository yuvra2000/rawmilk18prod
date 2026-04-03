import { TestBed } from '@angular/core/testing';

import { LeciAddFormService } from './leci-add-form.service';

describe('LeciAddFormService', () => {
  let service: LeciAddFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeciAddFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

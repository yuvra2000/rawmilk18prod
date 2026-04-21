import { TestBed } from '@angular/core/testing';

import { CartWiseReportService } from './cart-wise-report.service';

describe('CartWiseReportService', () => {
  let service: CartWiseReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartWiseReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

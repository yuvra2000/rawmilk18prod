import { TestBed } from '@angular/core/testing';

import { ViewIndentSupplierService } from './view-indent-supplier.service';

describe('ViewIndentSupplierService', () => {
  let service: ViewIndentSupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewIndentSupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

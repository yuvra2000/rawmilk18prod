import { TestBed } from '@angular/core/testing';

import { CartMappingService } from './cart-mapping.service';

describe('CartMappingService', () => {
  let service: CartMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

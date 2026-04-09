import { TestBed } from '@angular/core/testing';

import { DocumentWalletService } from './document-wallet.service';

describe('DocumentWalletService', () => {
  let service: DocumentWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

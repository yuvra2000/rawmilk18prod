import { TestBed } from '@angular/core/testing';

import { RemoteLockUnlockService } from './remote-lock-unlock.service';

describe('RemoteLockUnlockService', () => {
  let service: RemoteLockUnlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteLockUnlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

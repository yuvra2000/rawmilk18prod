import { TestBed } from '@angular/core/testing';

import { MccMappingInfoService } from './mcc-mapping-info.service';

describe('MccMappingInfoService', () => {
  let service: MccMappingInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MccMappingInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

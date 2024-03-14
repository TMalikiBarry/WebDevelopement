import { TestBed } from '@angular/core/testing';

import { BeneficiaireMEService } from './beneficiaire-me.service';

describe('BeneficiaireMEService', () => {
  let service: BeneficiaireMEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaireMEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

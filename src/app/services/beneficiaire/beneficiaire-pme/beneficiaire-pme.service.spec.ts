import { TestBed } from '@angular/core/testing';

import { BeneficiairePmeService } from './beneficiaire-pme.service';

describe('BeneficiairePmeService', () => {
  let service: BeneficiairePmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiairePmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

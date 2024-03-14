import { TestBed } from '@angular/core/testing';

import { BeneficiaireGieService } from './beneficiaire-gie.service';

describe('BeneficiaireGieService', () => {
  let service: BeneficiaireGieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaireGieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

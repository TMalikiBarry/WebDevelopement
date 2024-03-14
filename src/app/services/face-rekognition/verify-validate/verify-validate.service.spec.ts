import { TestBed } from '@angular/core/testing';

import { VerifyValidateService } from './verify-validate.service';

describe('VerifyValidateService', () => {
  let service: VerifyValidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyValidateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

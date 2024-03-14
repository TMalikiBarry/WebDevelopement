import { TestBed } from '@angular/core/testing';

import { TypeFinancementService } from './type-financement.service';

describe('TypeFinancementService', () => {
  let service: TypeFinancementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeFinancementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { InstrumentFinancementService } from './instrument-financement.service';

describe('InstrumentFinancementService', () => {
  let service: InstrumentFinancementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstrumentFinancementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

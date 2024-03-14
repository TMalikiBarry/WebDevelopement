import { TestBed } from '@angular/core/testing';

import { NiveauInstructionService } from './niveau-instruction.service';

describe('NiveauInstructionService', () => {
  let service: NiveauInstructionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NiveauInstructionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

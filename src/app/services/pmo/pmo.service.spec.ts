import { TestBed } from '@angular/core/testing';

import { PmoService } from './pmo.service';

describe('PmoService', () => {
  let service: PmoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ZoneGeographiqueService } from './zone-geographique.service';

describe('ZoneGeographiqueService', () => {
  let service: ZoneGeographiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneGeographiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

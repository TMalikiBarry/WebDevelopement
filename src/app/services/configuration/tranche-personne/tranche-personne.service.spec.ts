import { TestBed } from '@angular/core/testing';

import { TranchePersonneService } from './tranche-personne.service';

describe('TranchePersonneService', () => {
  let service: TranchePersonneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranchePersonneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

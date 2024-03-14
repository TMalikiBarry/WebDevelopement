import { TestBed } from '@angular/core/testing';

import { TrancheAnneeActiviteService } from './tranche-annee-activite.service';

describe('TrancheAnneeActiviteService', () => {
  let service: TrancheAnneeActiviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrancheAnneeActiviteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

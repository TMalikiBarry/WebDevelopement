import { TestBed } from '@angular/core/testing';

import { TranchAnneeActivitesService } from './tranch-annee-activites.service';

describe('TranchAnneeActivitesService', () => {
  let service: TranchAnneeActivitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranchAnneeActivitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

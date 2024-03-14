import { TestBed } from '@angular/core/testing';

import { NotificationBeneficiaireService } from './notification-beneficiaire.service';

describe('NotificationBeneficiaireService', () => {
  let service: NotificationBeneficiaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationBeneficiaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

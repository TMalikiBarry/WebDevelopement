import { TestBed } from '@angular/core/testing';

import { ReinitializePasswordService } from './reinitialize-password.service';

describe('ReinitializePasswordService', () => {
  let service: ReinitializePasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReinitializePasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

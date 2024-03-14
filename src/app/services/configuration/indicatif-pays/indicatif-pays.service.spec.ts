import { TestBed } from '@angular/core/testing';

import { IndicatifPaysService } from './indicatif-pays.service';

describe('IndicatifPaysService', () => {
  let service: IndicatifPaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatifPaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

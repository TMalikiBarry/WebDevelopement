import { TestBed } from '@angular/core/testing';

import { TouchPointService } from './touch-point.service';

describe('TouchPointService', () => {
  let service: TouchPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouchPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

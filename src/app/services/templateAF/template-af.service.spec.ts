import { TestBed } from '@angular/core/testing';

import { TemplateAFService } from './template-af.service';

describe('TemplateAFService', () => {
  let service: TemplateAFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateAFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

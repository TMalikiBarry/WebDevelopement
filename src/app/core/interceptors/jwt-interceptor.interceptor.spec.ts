import { TestBed } from '@angular/core/testing';

import { HttpGeneralInterceptorInterceptor } from './http-general-interceptor.interceptor';

describe('HttpGeneralInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpGeneralInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpGeneralInterceptorInterceptor = TestBed.inject(HttpGeneralInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

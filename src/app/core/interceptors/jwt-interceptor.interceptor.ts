import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {AuthService} from "../../services/security/auth/auth.service";
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthService, private router : Router) { 
    // console.log('jwt interceptor');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
        .pipe(catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            localStorage.removeItem('currentUser');
            this.router.navigateByUrl('/login');
          }
          const err = error.status || error.message;
          return throwError(error);
    }))
  }
  
}

/** Http interceptor providers in outside-in order */
export const httpInterceptorProvidersJwt = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
];

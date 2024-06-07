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
import {catchError, switchMap} from 'rxjs/operators';
import { Router } from '@angular/router';

import {RefreshtokenRequest} from "../../model/rToken/refreshtoken-request";

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthService, private router : Router) {
    // console.log('jwt interceptor');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }


    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.error('GETTING ERROR ON request ', error)
        if ([401, 403].includes(error.status) && currentUser) {
          return this.authenticationService.refreshToken({ refreshToken: currentUser.refreshToken! }).pipe(
            switchMap((response: any) => {
              const updatedUser = this.authenticationService.currentUserValue;
              // console.log('UTILISATEUR AFTER REFRESH TOKEN ', updatedUser)

              if (updatedUser && updatedUser.token) {

                request = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${updatedUser.token}`
                  }
                });
              }
              return next.handle(request);
            }),
            catchError(err => {
              // console.error('CHECK ERROR BEFORE LOOGING OUT ', error)

              this.authenticationService.logout();
              this.router.navigateByUrl('/login');
              return throwError(err);
            })
          );
        }

        return throwError(error);
      })
    );
    /*return next.handle(request)
        .pipe(catchError((error: HttpErrorResponse) => {
          if ([401, 403].some(s => s == error.status)) {
            const currentUser = this.authenticationService.currentUserValue;
            if (currentUser && currentUser.token) {
              const rt: RefreshtokenRequest = {refreshToken: currentUser.refreshToken!}
              this.authenticationService.refreshToken(rt).pipe(

              ).subscribe()
            }

            localStorage.removeItem('currentUser');
            this.router.navigateByUrl('/login');
          }
          const err = error.status || error.message;
          return throwError(error);
    }))*/
  }

}

/** Http interceptor providers in outside-in order */
export const httpInterceptorProvidersJwt = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
];

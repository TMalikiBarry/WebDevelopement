import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let url: string = state.url;
    // console.log('test &')
    // console.log(this.checkUserLogin(next, url))
    return this.checkUserLogin(next, url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    console.log('test 1');
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getRole();
      if (route.data.roles && route.data.roles.indexOf(userRole) === -1) {
        console.log("fouma nek")
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    console.log('test 2');
    this.router.navigate(['']);
    return false;
  }
}

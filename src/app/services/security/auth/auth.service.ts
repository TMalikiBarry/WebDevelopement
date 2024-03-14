import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { Login } from 'src/app/model/login';
import { SignUp } from 'src/app/model/sign-up';
import { environment } from 'src/environments/environment';
import {User} from "../../../model/user";
import {map} from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private host = environment.host;
  /*
    constructor(private http: HttpClient ) { }

    signup(signup: SignUp): Observable<SignUp> {
      return this.http.post<SignUp>(this.host + "/auth/signup", signup)
    }
    signin(login: Login): Observable<Login> {
      return this.http.post<Login>(this.host + "/auth/signin", login)
    }*/
  isLogin = false;
  private currentUserSubject!: BehaviorSubject<User>;
  public currentUser!: Observable<Login>;
  roleAs!: string | null;
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(<string>localStorage.getItem("currentUser")));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.host + "/auth/signin", { username, password })
      .pipe(map(user => {
        // console.log('user', user);
        // login successful if there's a jwt token in the response
        if (user && user.token) {
        //   if(user.roles?.includes("SUPERVISEUR_BE") && user.personne?.beneficiaire?.statut?.trim()=='PENDING_REGISTRED'){
        //     localStorage.setItem('currentUserNotActivated', JSON.stringify(user));
        //     this.router.navigateByUrl('/beneficiaire/validate_code');
        //     return;
        //   }
        //   // store user details and jwt token in local storage to keep user logged in between page refreshes
        //   localStorage.setItem('currentUser', JSON.stringify(user));
        //   localStorage.setItem('STATE', 'true');
        //   localStorage.setItem('ROLE', user.roles);
          this.isLogin = true;
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  routingAlreadyConnectedApp(){
    // console.log('babs');
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      // console.log('local storage', user);
      this.isLogin = true;
      if (user.roles?.includes("SUPERVISEUR_BE")){
        // console.log('babs');
        this.router.navigateByUrl('/beneficiaire')
      }else if ((user.roles?.includes("SUPERVISEUR_PMO") && user.idParent !== 11) || user.roles?.includes("AGENT_PMO") ){
        this.router.navigateByUrl('/pmo');
      }else if((user.roles?.includes("SUPERVISEUR_PMO") && user.idParent === 11) || user.roles?.includes("AGENT_INITIATEUR") || user.roles?.includes("AGENT_VALIDATEUR") || user.roles?.includes("ANALYSTE_FINANCIER") ){
        this.router.navigateByUrl('/touch_point');
      }
    }
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    this.currentUserSubject.next(new User());
    this.router.navigateByUrl('');
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    if (loggedIn == 'true')
      this.isLogin = true;
    else
      this.isLogin = false;
    return this.isLogin;
  }

  getRole() {
    this.roleAs = localStorage.getItem('ROLE');
    // console.log(this.roleAs);
    return this.roleAs;
  }
}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Login} from 'src/app/model/login';
import {environment} from 'src/environments/environment';
import {User} from "../../../model/user";
import {catchError, map} from "rxjs/operators";
import {Router} from '@angular/router';
import {StorageService} from "../../Storage/storage.service";
import {CodeOTPInfos} from "../../../model/CodeOTP/code-otp";
import {RefreshtokenRequest} from "../../../model/rToken/refreshtoken-request";
import {RefreshtokenResponse} from "../../../model/rToken/refreshtoken-response";

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
  freq: number = 0;

  constructor(private http: HttpClient, private router: Router, public storage: StorageService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(<string>this.storage.getItem("currentUser")));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.host + "/auth/signin", { username, password })
      .pipe(map(user => {
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
          this.storage.setItem('currentUser', JSON.stringify(user));
          this.isLogin = true;
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  refreshToken(rtRequest: RefreshtokenRequest) {
    // console.log('TOKEN ID ', rtRequest);

    return this.http.post<RefreshtokenResponse>(this.host+'/auth/signin/refreshtoken', rtRequest).pipe(
      map(response => {
        let currentUser = this.currentUserValue;

        // console.log('FREQUENCE REFRESH TOKEN ', ++this.freq);
        // Update local storage with new token
        if (response.accessToken) {
          currentUser.token = response.accessToken;
          // currentUser.refreshToken = response.refreshToken;
          this.storage.setItem('currentUser', JSON.stringify(currentUser));
          this.currentUserSubject.next(currentUser);
        }
        return response;
      }),
      catchError(error => {
        return throwError(error);
      }));
  }

  routingAlreadyConnectedApp(){
    // console.log('babs');
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(this.storage.getItem('currentUser') || '{}');
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
    this.currentUserSubject.next(new User());
    localStorage.clear();
    this.freq = 0;
    this.router.navigateByUrl('');
  }

  isLoggedIn() {
    const loggedIn = this.storage.getItem('STATE');
    this.isLogin = loggedIn == 'true';
    return this.isLogin;
  }

  getRole() {
    this.roleAs = this.storage.getItem('ROLE');
    // console.log(this.roleAs);
    return this.roleAs;
  }

  validateOtp(codeOTPInfos: CodeOTPInfos) {


    return this.http.post<CodeOTPInfos>(this.host + "/auth/signin/validateOTP", codeOTPInfos)

  }
}

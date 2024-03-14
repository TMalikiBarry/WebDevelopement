import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../services/security/auth/auth.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  param = {value: 'world'};
  validateForm!: UntypedFormGroup;
  returnUrl: string | undefined;
  loading = false;
  submitted = false;
  isSpinning: boolean =false;
  isLogginOk = true;
  error = '';

  /*submitForm(): void {
    if(this.validateForm.controls['userName'].value=="773003030"){
      this.router.navigateByUrl("/pmo")
    }
    if(this.validateForm.controls['userName'].value=="774004040"){
      this.router.navigateByUrl("/beneficiaire")
    }
  }*/

  get form() { return this.validateForm.controls; }

  passwordVisible : any  ;

  tooltipStyle : Object =  {
    'font-family' : "Manrope"
  };

  constructor(private fb: UntypedFormBuilder , private router : Router,  private route: ActivatedRoute,  private authService: AuthService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    if (this.authService.isLoggedIn()){
     this.authService.routingAlreadyConnectedApp();
    }
  }

  submitForm() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.validateForm.invalid) {
      return;
    }
    // this.loading = true;
    this.isSpinning = true;
    this.authService.login(this.form.username.value, this.form.password.value)
      .pipe(first())
      .subscribe(
        data => {
          //console.log(this.authService.currentUserValue.personne.acces?.hasAlreadyConnected);
          //console.log('superviseur ' , this.authService.currentUserValue.roles?.includes("SUPERVISEUR_PMO") );
          //console.log('superviseur ' , this.authService.currentUserValue.roles?.includes("AGENT_PMO") );
          this.isSpinning = false;
          console.log(data);
          let user = data;
          if (user && user.token) {
            if(user.roles?.includes("SUPERVISEUR_BE") && user.personne?.beneficiaire?.statut?.trim()=='PENDING_REGISTRED'){
              localStorage.setItem('currentUserNotActivated', JSON.stringify(user));
              this.router.navigateByUrl('/beneficiaire/validate_code');
              return;
            }


            // if( !this.authService.currentUserValue.personne.acces?.hasAlreadyConnected
            //   &&  ( this.authService.currentUserValue.roles?.includes("AGENT_INITIATEUR") || this.authService.currentUserValue.roles?.includes("AGENT_VALIDATEUR") || this.authService.currentUserValue.roles?.includes("ANALYSTE_FINANCIER") )){
            //   localStorage.setItem('currentUserPMO', JSON.stringify(user));
            //   localStorage.setItem('ROLE', user.roles);
            //   this.router.navigateByUrl('/newpassword');
            //   return ;
            // }

            // check for PMO first connection
            if( !this.authService.currentUserValue.personne.acces?.hasAlreadyConnected
              &&  ( this.authService.currentUserValue.roles?.includes("SUPERVISEUR_PMO") || this.authService.currentUserValue.roles?.includes("AGENT_PMO") )){
                localStorage.setItem('currentUserPMO', JSON.stringify(user));
                localStorage.setItem('ROLE', user.roles);
              this.router.navigateByUrl('/newpassword');
              return ;
            }
            // check for PMO first connection
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('STATE', 'true');
            localStorage.setItem('ROLE', user.roles);

          }
          // console.log(data);
          this.isLogginOk = true;
          //console.log(this.authService.currentUserValue.roles);
          if (this.authService.currentUserValue.roles?.includes("SUPERVISEUR_BE") || this.authService.currentUserValue.roles?.includes("AGENT_BE")){
            //console.log('babs');
            this.router.navigateByUrl('/beneficiaire');
          }else if ((this.authService.currentUserValue.roles?.includes("SUPERVISEUR_PMO")  && this.authService.currentUserValue.idParent !== 11) || this.authService.currentUserValue.roles?.includes("AGENT_PMO")){
            this.router.navigateByUrl('/pmo')
          }else if ((this.authService.currentUserValue.roles?.includes("SUPERVISEUR_PMO") && this.authService.currentUserValue.idParent === 11) || this.authService.currentUserValue.roles?.includes("AGENT_INITIATEUR") || this.authService.currentUserValue.roles?.includes("AGENT_VALIDATEUR") || this.authService.currentUserValue.roles?.includes("ANALYSTE_FINANCIER")){
            this.router.navigateByUrl('/touch_point')
          }
          else{
            this.isLogginOk = false;
          }
        },
        error => {
          this.isSpinning = false;
          //console.log(error);
          this.isLogginOk = false;
          this.error = error;
          this.loading = false;
        });
  }

  resetPassword(){
    this.router.navigateByUrl('/reset_password');
  }
}

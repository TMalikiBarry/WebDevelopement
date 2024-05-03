import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../services/security/auth/auth.service";
import {first} from "rxjs/operators";
import {NgStyleInterface} from "ng-zorro-antd/core/types";
import {AUTHLICYCLEStatus} from "../../model/acces";

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

  tooltipStyle: NgStyleInterface = {
    'font-family' : "Manrope"
  };

  constructor(private fb: UntypedFormBuilder, private router: Router, private route: ActivatedRoute,
              private authService: AuthService) {
  }

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

          // console.log('isLoggin ', data)
          this.isSpinning = false;

          let user = data;
          if (user && user.token) {
            // console.log('hasLoggin ', data)

            let goToScan: boolean = [null, undefined, AUTHLICYCLEStatus.GENERATED]
              .some(v => v === user.auth_statut);

            this.authService.storage.setItem('SUQALI_QR', user.codeQR);

            this.isLogginOk = true;

            this.router.navigateByUrl(goToScan ? '/two-fa-scan' : '/two-fa');
          } else {
            this.isLogginOk = false;
          }
          // console.log(data);
          //console.log(this.authService.currentUserValue.roles);
          /*if (this.authService.currentUserValue.roles?.includes("SUPERVISEUR_BE") || this.authService.currentUserValue.roles?.includes("AGENT_BE")){
            //console.log('babs');
            this.router.navigateByUrl('/beneficiaire');
          }else if ((this.authService.currentUserValue.roles?.includes("SUPERVISEUR_PMO")  && this.authService.currentUserValue.idParent !== 11) || this.authService.currentUserValue.roles?.includes("AGENT_PMO")){
            this.router.navigateByUrl('/pmo')
          }else if ((this.authService.currentUserValue.roles?.includes("SUPERVISEUR_PMO") && this.authService.currentUserValue.idParent === 11) || this.authService.currentUserValue.roles?.includes("AGENT_INITIATEUR") || this.authService.currentUserValue.roles?.includes("AGENT_VALIDATEUR") || this.authService.currentUserValue.roles?.includes("ANALYSTE_FINANCIER")){
            this.router.navigateByUrl('/touch_point')
          }
          else{
            this.isLogginOk = false;
          }*/
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

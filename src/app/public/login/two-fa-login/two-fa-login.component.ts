import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../model/user";
import {CodeOTPInfos} from "../../../model/CodeOTP/code-otp";
import {AuthService} from "../../../services/security/auth/auth.service";
import {StorageService} from "../../../services/Storage/storage.service";

@Component({
  selector: 'app-two-fa-login',
  templateUrl: './two-fa-login.component.html',
  styleUrls: ['./two-fa-login.component.scss']
})
export class TwoFaLoginComponent implements OnInit {
  twoFaActivated = true;
  hasInstalledGa = false;

  otp: string[] = ['', '', '', '', '', '']; // le tableau des inputs OTP

  otpResponse!: CodeOTPInfos;

  code1: string = '';
  code2: string = '';
  code3: string = '';
  code4: string = '';
  code5: string = '';
  code6: string = '';

  otpForm: FormGroup;
  currentUser!: User;

  constructor(private authService: AuthService, private router: Router, private storage: StorageService,
              private route: ActivatedRoute, private builder: FormBuilder) {


    this.otpForm = this.builder.group({
      code1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      code2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      code3: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      code4: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      code5: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],
      code6: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]],

    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.storage.getItem('currentUser')!);
    // console.log("on Init : user = ", this.currentUser);
    this.focusNext(0);

    if (this.authService.isLoggedIn()) {
      this.authService.routingAlreadyConnectedApp();
    }
  }

  isSubmitDisabled(): boolean {
    return this.otp.some((element) => element === '' || element === null || element === undefined);
  }

  focusNext(index: number) {
    // Automatically focus on the next input field
    if (index < 6) {
      const nextInput = document.getElementById(`otp${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }


  onSubmit() {
    const enteredOTP: string = this.otpForm.value.code1! + this.otpForm.value.code2 + this.otpForm.value.code3
      + this.otpForm.value.code4 + this.otpForm.value.code5 + this.otpForm.value.code6;

    let codeOTPInfos: CodeOTPInfos = {
      codeOTP: enteredOTP,
      login: this.currentUser.username.toString(),
    }

    this.authService.validateOtp(codeOTPInfos).subscribe(res => {
      /*      console.log("#####################");
            console.log(res);
            console.log("#####################");
            console.log(res.errorCode);
            console.log("#####################");
            console.log(res.codeOtp == enteredOTP);
            console.log("Le code OTP valide est : " + res.codeOtp);
            console.log("Le code OTP entré est : " + enteredOTP);*/

      if (res.codeError === "200") {

        /*        console.log("Connexion réussie");
                this.router.navigate(["home"]);*/
        if (this.currentUser && this.currentUser.token) {
          this.storage.setItem('STATE', 'true');
          this.storage.setItem('ROLE', this.currentUser.roles?.toString()!);
          if (this.currentUser.roles?.includes("SUPERVISEUR_BE")) {
            /*            this.authService.storage.setItem('currentUserNotActivated', JSON.stringify(this.currentUser))
                        this.router.navigateByUrl('/beneficiaire/validate_code');
                        this.currentUser.personne.beneficiaire.statut = 'REGISTRED';
                        localStorage.setItem('currentUser', JSON.stringify(this.user));
                        this.authService.storage.setItem('currentUser', JSON.stringify(this.currentUser));
                        localStorage.removeItem('currentUserNotActivated');
                        this.notification.success('Notification','Votre validation est terminée !'); */
            this.router.navigateByUrl('/beneficiaire');
            return;
          }


          // check for PMO first connection
          if (!this.authService.currentUserValue.personne.acces?.hasAlreadyConnected
            && (this.authService.currentUserValue.roles?.includes("SUPERVISEUR_PMO") || this.authService.currentUserValue.roles?.includes("AGENT_PMO"))) {
            // localStorage.setItem('currentUserPMO', JSON.stringify(this.currentUser));
            this.authService.storage.setItem('currentUserPMO', JSON.stringify(this.currentUser))

            this.storage.setItem('ROLE', this.currentUser.roles?.toString()!);
            this.router.navigateByUrl('/newpassword');
            return;
          }
          // check for PMO first connection

        }
        // console.log(data);
        //console.log(this.authService.currentUserValue.roles);
        if (this.authService.currentUserValue.roles?.includes("SUPERVISEUR_BE") || this.authService.currentUserValue.roles?.includes("AGENT_BE")) {
          //console.log('babs');
          this.router.navigateByUrl('/beneficiaire');
        } else if ((this.authService.currentUserValue.roles?.includes("SUPERVISEUR_PMO") && this.authService.currentUserValue.idParent !== 11) || this.authService.currentUserValue.roles?.includes("AGENT_PMO")) {
          this.router.navigateByUrl('/pmo')
        } else if ((this.authService.currentUserValue.roles?.includes("SUPERVISEUR_PMO") && this.authService.currentUserValue.idParent === 11) || this.authService.currentUserValue.roles?.includes("AGENT_INITIATEUR") || this.authService.currentUserValue.roles?.includes("AGENT_VALIDATEUR") || this.authService.currentUserValue.roles?.includes("ANALYSTE_FINANCIER")) {
          this.router.navigateByUrl('/touch_point')
        }
      } else {
        /*        console.log(this.currentUser);
                console.log(enteredOTP);
                console.log("Connexion échouée");*/
        this.otpForm.reset();
        alert("Le code OTP n'est pas valide. Veuillez réessayer.");
      }
    })
  }
}

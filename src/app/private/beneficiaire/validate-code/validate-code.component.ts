import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PmoService } from 'src/app/services/pmo/pmo.service';
import { AuthService } from 'src/app/services/security/auth/auth.service';
import { OtpService } from 'src/app/services/security/otp/otp.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './validate-code.component.html',
  styleUrls: ['./validate-code.component.scss']
})
export class ValidateCodeComponent implements OnInit, OnDestroy {
  showSuccess = false ;
  showError = false ;
  renvoiCode: boolean = true;
  nombreSecond: number = 0;
  user:any;
  errorMessage: string = '';
  showCodeOtpForm = false ;
  idPersonneContact: number=0;
  benefApiResponse: any;
  passwordVisible = false ;
  numeroTelephone: string= '';
  confirmPasswordVisible = false ;
  isSpinning: boolean =false;
  baseUrlFile = environment.baseUrlFile;
  timeoutId: any;

  constructor(private fb : UntypedFormBuilder , private pmoService : PmoService, private modal: NzModalService, private authService: AuthService,
    private otpService :OtpService, private router : Router, private notification : NzNotificationService,) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUserNotActivated') || '{}');
    console.log(this.user);
    let listContact = this.user?.personne?.beneficiaire?.personnes?.filter((item:any) =>
    {return item.typePersonnes?.map(function(e:any) {
      // //console.log(e);
      return e.code; }).indexOf("CONTACT")!==-1

    });
    console.log(listContact);
    if (listContact && listContact.length>0) {
      // let personneContact = listContact[0];
      this.numeroTelephone = listContact[0].numeroMobile;
      this.idPersonneContact = listContact[0].id;
    }
    this.renvoyerCode();
  }

  validateCodeForm = this.fb.group({
    code : ['' , Validators.compose([Validators.minLength(6) ,Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(6)])]
  })

  errorOtp(): void {
    this.modal.error({
      nzTitle: 'Erreur Code de Validation',
      nzContent: 'Veuillez saisir le bon Code de validation'
    });
  }

  validerCode(){
    this.isSpinning = true;
    if(this.validateCodeForm.valid){
      this.otpService.sendCode(this.validateCodeForm.controls['code'].value , this.idPersonneContact).subscribe(
        response => {
          //console.log(response);
          this.isSpinning = false;
          this.showSuccess =true;
          this.showCodeOtpForm=false ;
          this.user.personne.beneficiaire.statut = 'REGISTRED';
          localStorage.setItem('currentUser', JSON.stringify(this.user));
          localStorage.removeItem('currentUserNotActivated');
          this.notification.success('Notification','Votre validation est terminée !')
          this.router.navigateByUrl('/beneficiaire');
        },
        error =>{
          console.log(error);
          this.isSpinning = false;
          this.errorOtp();

          //this.createBasicNotification();
        }
      )
    }

  }

  renvoyerCode(){
    //console.log('regenerate code');

    this.otpService.regenerateCode(this.numeroTelephone , this.idPersonneContact).subscribe(
      response => {
        //console.log(response );
        this.renvoiCode = true;
        this.nombreSecond = 60;
        this.getTimer();
        this.notification.success('Notification','Le code a été bien renvoyé ')

      },
      error => {
        console.log(error);
        this.notification.error('Attention','Une erreur est survenue, renvoyer le code ')
        // this.renvoiCode = false;
        this.renvoiCode = true;
        this.nombreSecond = 20;
        this.getTimer();
      }
    )
  }

  premiere(){
    this.renvoiCode = true;
    // @ts-ignore

    // Store the timeout ID in a variable
    const timeoutId = setInterval(()=>{
      this.deuxieme()
    },1000);

    // Store the timeout ID somewhere where it can be accessed later
    // For example, you could store it as a property of the class
    this.timeoutId = timeoutId;
}


  getTimer() {
      this.premiere();
  }

  deuxieme() {
    if(this.nombreSecond !== 0){
      this.nombreSecond --;
    }else{

      this.renvoiCode = false;
      clearTimeout(this.timeoutId);

    }
  }

  // validerCodeOtp(){
  //   console.log('call validate code');
  //   this.isSpinning = true;
  //   if(this.changePasswordForm.valid){
  //     let username : string = this.user.personne?.acces?.login;
  //     this.pmoService.changePassword(this.changePasswordForm.controls['oldPassword'].value ,this.changePasswordForm.controls['newPassword'].value, username).subscribe(
  //       response => {
  //         this.isSpinning = false;
  //         console.log(response);
  //         // if(response.status==200){
  //           this.showSuccess = true ;
  //           this.showError = false;
  //           this.errorMessage = '';
  //       },
  //       error=>{
  //         console.log(error);
  //         this.isSpinning = false;
  //         this.showSuccess = false ;
  //         // this.showCodeOtpForm=true ;
  //         this.showError = true;
  //         this.errorMessage = 'Une erreur est survenue';
  //       }
  //     )
  //   }
  // }

  showConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Deconnexion',
      nzOkText: 'Oui',
      nzContent: 'Voulez-vous vraiment vous déconnecter ?',
      nzOnOk: () => {
        this.logout();
      }
    });
  }

  logout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('currentUserNotActivated');
  }

}

import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PmoService } from 'src/app/services/pmo/pmo.service';
import { AuthService } from 'src/app/services/security/auth/auth.service';
import { OtpService } from 'src/app/services/security/otp/otp.service';
import { environment } from 'src/environments/environment';
import { PasswordValidator } from './confirmPassword';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  showSuccess = false ;
  showError = false ;
  user:any;
  errorMessage: string = '';
  showCodeOtpForm = false ;
  benefApiResponse: any;
  passwordVisible = false ;
  confirmPasswordVisible = false ;
  isSpinning: boolean =false;
  baseUrlFile = environment.baseUrlFile;
  
  constructor(private fb : UntypedFormBuilder , private pmoService : PmoService, private modal: NzModalService, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log(this.user);
  }

  changePasswordForm = this.fb.group({
    oldPassword : [ '' ,  [Validators.required ,Validators.pattern('(.{8,})') ] ],
    newPassword : [ '' ,  [Validators.required ,Validators.pattern('(.{8,})') ] ],
    newPasswordConfirmation : [ '' ,  [Validators.required ,Validators.pattern('(.{8,})') ]  ],
  }, { 'validator': (PasswordValidator.isMatching)})


  validerChangePassword(){
    console.log('call validate password');
    this.isSpinning = true;
    if(this.changePasswordForm.valid){
      let username : string = this.user.personne?.acces?.login;
      this.pmoService.changePassword(this.changePasswordForm.controls['oldPassword'].value ,this.changePasswordForm.controls['newPassword'].value, username).subscribe(
        response => {
          this.isSpinning = false;
          console.log(response);
          // if(response.status==200){
            this.showSuccess = true ;
            this.showError = false;
            this.errorMessage = '';
        },
        error=>{
          console.log(error);
          this.isSpinning = false;
          this.showSuccess = false ;
          // this.showCodeOtpForm=true ;
          this.showError = true;
          this.errorMessage = 'Une erreur est survenue';
        }
      )
    }
  }

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

}

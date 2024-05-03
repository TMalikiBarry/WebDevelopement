import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {OtpService} from 'src/app/services/security/otp/otp.service';
import {PasswordValidator} from './confirmPassword';
import {StorageService} from "../../services/Storage/storage.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  showSuccess = false ;
  showError = false ;
  errorMessage: string = '';
  showCodeOtpForm = false ;
  benefApiResponse: any;

  constructor(private fb: UntypedFormBuilder, private otpService: OtpService, private storage: StorageService) {
  }

  ngOnInit(): void {

  }

  resetPasswordForm = this.fb.group({
    username : [ '' , [ Validators.required ,
       Validators.pattern('(^(?![0-9]*$)[a-zA-Z0-9\\._-]{4,}$)|(^((?![0-9]+)[a-zA-Z0-9\\._-]+)@[a-zA-Z-_]+\.[a-zA-Z]{2,}$)|(((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7})') ]]
  });


  otpForm = this.fb.group({
    code : ['' , Validators.compose([Validators.minLength(6) ,Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(6)])],
    password : [ '' ,  [Validators.required , Validators.minLength(8), Validators.pattern('((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,})') ] ],
    passwordConfirmation : ['' , [Validators.required ,Validators.minLength(8), Validators.pattern('((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,})') ]]
  }, { 'validator': (PasswordValidator.isMatching)})

  resetPassword(){
    this.otpService.resetPassword(this.resetPasswordForm.controls['username'].value).subscribe(
      response => {
        //console.log(response);
        this.benefApiResponse = response;
        // if(response.status==200){
          // this.showSuccess = true ;
          this.showCodeOtpForm=true ;
          this.showError = false;
          this.errorMessage = '';
        this.storage.setItem('username', this.resetPasswordForm.controls['username'].value);
        // }
        // else{
        //   this.showSuccess = false ;
        //   this.showCodeOtpForm=false ;
        //   this.showError = true;
        //   // this.errorMessage = error.errorMessage;
        //   this.errorMessage = 'Une erreur est survenue';
        // }
      },
      error=>{
        //console.log(error);
        this.showSuccess = false ;
        this.showCodeOtpForm=false ;
        this.showError = true;
        this.errorMessage = error.error.errorMessage;
        // this.errorMessage = 'Une erreur est survenue';
      }
    )
  }

  validerResetPassword(){
    //console.log('call validate password');
    if(this.otpForm.valid){
      let username: string = this.storage.getItem('username') || '';
      this.otpService.validateResetPassword(this.otpForm.controls['code'].value ,this.otpForm.controls['password'].value, username).subscribe(
        response => {
          //console.log(response);
          // if(response.status==200){
            this.showSuccess = true ;
            this.showCodeOtpForm=false;
            this.showError = false;
            this.errorMessage = '';
            localStorage.removeItem('username');
          // }
          // else{
          //   this.showSuccess = false ;
          //   this.showCodeOtpForm=false;
          //   this.showError = true;
          //   this.errorMessage = 'Une erreur est survenue';
          // }

        },
        error=>{
          //console.log(error);
          this.showSuccess = false ;
          // this.showCodeOtpForm=true ;
          this.showError = true;
          this.errorMessage = 'Une erreur est survenue';
        }
      )
    }
  }

}

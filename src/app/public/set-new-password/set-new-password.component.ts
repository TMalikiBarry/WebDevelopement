import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ReinitModel} from 'src/app/model/reinit-model';
import {
  ReinitializePasswordService
} from 'src/app/services/security/ReinitializePassword/reinitialize-password.service';
import {StorageService} from "../../services/Storage/storage.service";

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss']
})
export class SetNewPasswordComponent implements OnInit, OnDestroy {

  constructor(private fb : UntypedFormBuilder,
              private storage: StorageService,
              private reinitService : ReinitializePasswordService,
              private router : Router ) { }

  newPasswordForm = this.fb.group({
    newPassword : ['' , [ Validators.required , Validators.pattern('(.{8,})')]],
    newPasswordConfirmation : [ '', [ Validators.required , Validators.pattern('(.{8,})')]]
  })

  ngOnInit(): void {
  }

  passwordVisible = false ;
  submitted = false ;
  samePasswordCheck = false ;

  onSubmit(){
    this.samePasswordCheck = false;
    if(this.newPasswordForm.controls.newPassword.valid && this.newPasswordForm.controls.newPasswordConfirmation.valid){

      // check if the value is the same

      if(this.newPasswordForm.controls.newPassword.value == this.newPasswordForm.controls.newPasswordConfirmation.value){

        //console.log('od');

         // udpate the information in database
         let newPasswordObject = new ReinitModel();
         newPasswordObject.newPassword = this.newPasswordForm.controls.newPassword.value;

         if (localStorage.getItem('currentUserPMO')) {
           let user = JSON.parse(this.storage.getItem('currentUserPMO')!);
          newPasswordObject.username = user.username;
         }

         this.reinitService.reinitializePassword(newPasswordObject).subscribe(
          (response)=>{
            // console.log(response);
            localStorage.removeItem('currentUserPMO');
            this.storage.setItem('currentUser', this.storage.getItem('currentUserPMO')!);
            this.storage.setItem('STATE', 'true');
            this.router.navigateByUrl('/pmo')
          }
         );
      }
      else{
        this.samePasswordCheck = true ;
      }
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('currentUserPMO');
    // localStorage.removeItem('ROLE');
  }
}


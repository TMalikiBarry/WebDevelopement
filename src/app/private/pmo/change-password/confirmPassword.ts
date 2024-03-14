import { UntypedFormGroup } from '@angular/forms';


export class PasswordValidator {

  static isMatching(group: UntypedFormGroup): any{

      let firstPassword = group.controls['newPassword'].value;
      let secondPassword = group.controls['newPasswordConfirmation'].value;
      if((firstPassword && secondPassword) && (firstPassword != secondPassword)){
      //console.log("mismatch");
      group.controls['newPasswordConfirmation'].setErrors({"pw_mismatch": true});
      return { "pw_mismatch": true };
      }
      else{
      return null;
    }

    }


}

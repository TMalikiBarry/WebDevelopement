import { UntypedFormGroup } from '@angular/forms';


export class PasswordValidator {

  static isMatching(group: UntypedFormGroup): any{

      let firstPassword = group.controls['password'].value;
      let secondPassword = group.controls['passwordConfirmation'].value;
      if((firstPassword && secondPassword) && (firstPassword != secondPassword)){
      //console.log("mismatch");
      group.controls['passwordConfirmation'].setErrors({"pw_mismatch": true});
      return { "pw_mismatch": true };
      }
      else{
      return null;
    }

    }


}

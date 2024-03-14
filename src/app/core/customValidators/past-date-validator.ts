import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PastDateValidator {
}



export function pasteDateValidator (control: AbstractControl): ValidationErrors | null  {
    // if input empty
    if(control.value=='') return null ;

    let valueReceived = control.value ;
    let dateCreation = new Date(valueReceived);
    let today = new Date();
    today.setHours(0,0,0,0);
    let result : boolean = (dateCreation.getTime() - today.getTime() ) <= 0  ;
    return result ? null : {pastDateValidator: {value: control.value}};
  };

export function minValidator(limit: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(control.value=='' || control.value == null || limit == '' || limit == null) return null ;
    if (parseInt((control.value)?.replace(/\s/g, "")) - parseInt(limit?.replace(/\s/g, ""))  < 0){
      return { 'minValidator': true };
    }
    return null;
  };
}

export function maxValidator(limit: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(control.value=='' || control.value == null || limit == '' || limit == null) return null ;
    if (parseInt((control.value)?.replace(/\s/g, "")) - parseInt(limit?.replace(/\s/g, ""))  > 0){
      return { 'maxValidator': true };
    }
    return null;
  };
}


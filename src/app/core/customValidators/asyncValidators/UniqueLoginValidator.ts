import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BeneficiaireService } from "src/app/services/beneficiaire/beneficiaire.service";
import { CheckLoginService } from "src/app/services/security/checkLogin/check-login.service";

@Injectable({providedIn:'root' })

export class UniqueLoginValidator implements  AsyncValidator  {

  constructor(private checkUnicity : CheckLoginService,
              private activatedRoute : ActivatedRoute,
              private beneficiareService : BeneficiaireService ){

                this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
                this.beneficiaireId = this.user.idParent ;

              //  console.log('benficiaire id of checke r' , this.beneficiaireId);
                // get the user
                if(this.beneficiaireId){
                   this.beneficiareService.getAllDemande(this.beneficiaireId).subscribe(
                    response => {
                      this.beneficiaireNumeroDuringUpdate = response.personnes?.filter(el => {

                        if(el.typePersonnes?.length==1 && el.typePersonnes.map(value => value.code).includes('CONTACT')) return true;

                        if( el.typePersonnes?.map(value => value.code).includes('CONTACT') && el.typePersonnes?.map(value => value.code).includes('CONTACT')) return true;

                        return false;
                      })[0].numeroCNI ;

                    //  console.log(this.beneficiaireNumeroDuringUpdate)
                    }
                  );
                }

            }


  beneficiaireId : any ;
  user : any ;
  beneficiaireNumeroDuringUpdate : any  ;

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {

    return this.checkUnicity.checkLogin(control.value).pipe(
      map( (result) => {
        if(result.reponse){
          //console.log('asynv validators ' , result.reponse);
          return null ;
        }
        else{
          return { loginDuplicated: true }
        }
      }),
      catchError( ()=> of(null))
    )
  }


  checkLoginExist(): AsyncValidatorFn {

    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> =>  {


      return this.checkUnicity.checkLogin(control.value).pipe(
        map( (result) => {


          if(!result.reponse){
            //console.log('asynv validators ' , result.reponse);
            return null ;
          }
          else{
            //console.log('asynv validators ' , result.reponse);
            return { loginDuplicated: true }
          }
        }),
        catchError( ()=> of(null))
      )
    }
  }

  // checkNumPieceExist(): AsyncValidatorFn {
  //
  //   return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> =>  {
  //     let result : any;
  //     if(this.beneficiaireId){
  //     //  console.log('comparsion num value ' , control.value == this.beneficiaireNumeroDuringUpdate)
  //
  //       if(control.value == this.beneficiaireNumeroDuringUpdate) return of(null) ;
  //
  //     }
  //
  //     return this.checkUnicity.checkNumPiece(control.value, localStorage.getItem('idPersonneContact') || '').pipe(
  //       map( (result) => {
  //
  //         if(result.reponse){
  //           //console.log('asynv validators not exist ' , result.reponse);
  //           return null ;
  //         }
  //         else{
  //           //console.log('asynv validators exist ' , result.reponse);
  //           return { numPieceDuplicated: true }
  //         }
  //       }),
  //       catchError( ()=> of(null))
  //     )
  //   }
  // }

  checkCodeClientExist(): AsyncValidatorFn {

    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> =>  {
      let result : any;
      if(this.beneficiaireId){
      //  console.log('comparsion num value ' , control.value == this.beneficiaireNumeroDuringUpdate)

        if(control.value == this.beneficiaireNumeroDuringUpdate) return of(null) ;

      }

      return this.checkUnicity.checkCodeClient(control.value, localStorage.getItem('typeBenef') || '').pipe(
        map( (result) => {
          console.log(result);
          return null ;

        }),
        catchError( (error)=> {
          console.log(error);
          return of({ codeError: true });
        })
      )
    }
  }
}

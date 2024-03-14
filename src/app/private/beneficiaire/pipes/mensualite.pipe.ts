import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'mensualite'})
export class MensualitePipe implements PipeTransform {

    transform(budgetTotal:string, interet:string, dureeNominale:string) {
      let mensualite;
      //console.log('pipe format called');
        if (budgetTotal && interet && dureeNominale) {
          mensualite = (Number(budgetTotal)*(Number(1+interet)))/Number(dureeNominale);
            return mensualite;
        }
        return mensualite;
    }

}

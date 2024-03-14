
import {PMO} from "./pmo";
import {TypeFinancement} from "./type-financement";

export class Credit {

  date? :Date;
   montant?: number;
   typeFinancement?: TypeFinancement;
   remboursement?:number;
   remboursement_avec_retard?: number;
   institution_credit?: PMO;
}

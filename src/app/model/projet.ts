import { TrancheNombrePersonne } from "./tranche-nombre-personne";

export class Projet {
  id?:	number;
  description?:	string ;
  cout?:	string;
  businessPlan?:	string;
  complementInformations?:	string[] = [];
  businessInformations?:	string[] = [];
  nombreEmploisPermanent?:	TrancheNombrePersonne;
  nombreEmploisPermanentMe?:	string;
  nombreEmploisAdditionnelPermanent?:	number;
  nombreFemmePrevuePermanent	?:number;
  pourcentageFemmePermanent?:	number;
  nombreJeunePermanent	?:number;
  pourcentageJeunePermanent?:	number;
  nombreEmploisNonPermanent?:	TrancheNombrePersonne;
  nombreEmploisNonPermanentMe?:	string;
  nombreEmploisAdditionnelNonPermanent?:	number;
  nombreFemmePrevueNonPermanent	?:number;
  pourcentageFemmeNonPermanent?:	number;
  nombreJeuneNonPermanent	?:number;
  pourcentageJeuneNonPermanent?:	number;
  salairePlusBas?:	number;
  salaireMoyen?:	number;
}

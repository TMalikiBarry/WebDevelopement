import {SecteurActivite} from "./secteur-activite";
import {Session} from "./session";
import {TrancheNombreAnneeActivite} from "./tranche-nombre-annee-activite";
import { TrancheNombrePersonne } from "./tranche-nombre-personne";
import { ZoneGeographique } from "./zone-geographique";

export class ActiviteBeneficiaire {
  supprime?:	boolean
  dateCreation?:	string;
  dateModification?:	string;
  session?:	Session;
  id?:	number;
  occupation?:	string
  nombreAnneeActivite?:	TrancheNombreAnneeActivite;
  zoneGeographique?: ZoneGeographique;
  nombreEmplois?:	string;
  secteurActivites?: SecteurActivite[] = [];
  autreSecteurActivite? : string ;
  chiffreAffaireHorsTaxeAnMois1?:	string;
  chiffreAffaireHorsTaxeAnMois2?:	string;
  etatFinancierAnMois1?:	string ;
  etatFinancierAnMois2?:	string ;
  nombreEmployePermanent?:	TrancheNombrePersonne;
  nombreEmployePermanentExactAdate?:	number;
  pourcentageFemmeEmployePermanent?:	number;
  pourcentageJeuneEmployePermanent?:	number;
  nombreFemmeEmployePermanent?:	number;
  nombreJeuneEmployePermanent?:	number;
  nombreEmployeNonPermanent?:	TrancheNombrePersonne;
  nombreEmployeNonPermanentExactAdate?:	number;
  nombreFemmeEmployeNonPermanent?:	number;
  nombreJeuneEmployeNonPermanent?:	number;
  pourcentageFemmeNonPermanent?:	number;
  pourcentageJeuneNonPermanent?:	number;
  revenueTotalAnMoins1?:	number;
  revenueTotalAnMoins2?:	number;
  revenuplusBasParMois?:	number;
  revenuMoyenneParMois?:	number;
  nombrePersonneAChargeMoyenne?:	number;
}

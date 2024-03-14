import {ZoneGeographique} from "./zone-geographique";
import {ActiviteBeneficiaire} from "./activite-beneficiaire";
import {Projet} from "./projet";
import {Demande} from "./demande";
import {Personne} from "./personne";
import {Session} from "./session";
import {PMO} from "./pmo";

export class Beneficiaire {

  id?: number;
  nom?: string;
  supprime?: boolean;
  dateCreation?: Date;
  dateModification?: string;
  session?:	Session;

  telephone?: string
  codeClient ?: 	string ;
  zoneGeographique?: ZoneGeographique;
  centreUrbain?: string;
  adresse?: string;
  statut?: string;
  typeBeneficiaire? : string;
  activiteBeneficiaires?: ActiviteBeneficiaire[] =[];

  projets?: Projet[] =[];

  selfie ?: 	string ;
  scanCNIRecto? : 	string ;
  scanCNIVerso? : 	string ;

  demandes?: Demande[] =[];

  personnes?: Personne[] = [] ;

  pmoRefere?: PMO;
  pmoRattachement?: PMO;
}

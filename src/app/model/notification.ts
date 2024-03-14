import { Beneficiaire } from "./beneficiaire";
import { Demande } from "./demande";
import { Personne } from "./personne";
import {PMO} from "./pmo";

export class Notification {
  id : number = 0 ;
  dateCreation ?: string;
  motif : string = '';
  beneficiaire : Beneficiaire = new Beneficiaire()  ;
  demande : Demande = new Demande();
  auteur : Personne = new Personne();
  medias ?: String[];
  pmo ?: PMO

}

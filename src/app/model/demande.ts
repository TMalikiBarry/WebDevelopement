import {Session} from "./session";
import {Offre} from "./offre";
import {Beneficiaire} from "./beneficiaire";
import {Projet} from "./projet";
import {Garantie} from "./garantie";
import {FinancementObtenu} from "./FinancementObtenu";
import { Commentaire } from "./commentaire";



export class Demande {
  id?: number;
  typeDemande?: string;
  montant?: number;
  apport?: number;
  garantie?: Garantie;
  valeurGarantie?: number;
  tauxInteretAnnuelleSouhaite?: number;
  tauxInteretAnnuelleApplicable?: number;
  duree?: number;
  financementObtenue?: string;
  institutionFinanciere?: string;
  typeCredit?: number;
  dateFinancement?: string;
  tableauAmortissement?: string;
  dateRemboursement?: Date ;
  statusFinancement?: string;
  dateMiseADisposition?:	Date ;
  dateSignatureAccord?:	string;
  categorie?:	string
  montantOctroye?:	number;
  garantieDemandes?: string[];
  dureeCredit?:	number;
  tauxInteretAnnuelHT?:	number;
  tauxInteretAnnuelTTC?:	number;
  tauxInteretAnnuelTEG?:	number;
  statutDossier?:	string;
  dateLastStatut?: string;
  supprime?: boolean;
  dateCreation?: string;
  dateModification?: string;
  session?:	Session;
  offre?: Offre;
  commentaires?: Commentaire[];
  beneficiaire?: Beneficiaire;
  projets?: Projet[] = [];
  financementObtenus?: FinancementObtenu[];
  nombreMembresConcernes?: number;
  montantDemandeParMembre?: number;

}

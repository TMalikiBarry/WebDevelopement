import {Genre} from "./genre";
import {NiveauInstruction} from "./niveau-instruction";
import {Titre} from "./titre";
import {Acces} from "./acces";
import {TypePersonne} from "./type-personne";
import { TrancheAge } from "./tranche-age";

export class Personne {
  id?: number;
  nom?: string;
  prenom?: string;
  genre?: Genre;
  numeroCNI?:	string ;
  nomDocumentCNI?: string ;
  numeroPassport?:	string;
  nomDocumentPassport?:	string;
  email?:	string;
  numeroMobile?:	string;
  numeroFixe?:	string;
  adresse?:	string;
  dateNaissance?:	string;
  niveauInstruction?: NiveauInstruction;
  nombrePersonneACharge?: number;
  pourcentageDetenueCapital?:	number;
  otp?:	string;
  codeClient ?: 	string ;
  dateGenerationOTP?:	string;
  titre?: Titre;
  acces?: Acces;
  typePersonnes?: TypePersonne[];
  supprime?: boolean;
  age? : TrancheAge ;
}

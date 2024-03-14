import {Session} from "./session";
import {ZoneGeographique} from "./zone-geographique";
import {ActiviteBeneficiaire} from "./activite-beneficiaire";
import {Demande} from "./demande";
import {Personne} from "./personne";
import {NiveauInstruction} from "./niveau-instruction";
import {TrancheAge} from "./tranche-age";
import {Beneficiaire} from "./beneficiaire";

export class BeneficiaireME extends Beneficiaire{
  prenom?: string;
  nom?: string;
  chiffreAffaireAnMoins1?: string;
  chiffreAffaireAnMoins2?: string;
  age?: TrancheAge;
  numeroCNI?: string;
  scanNumeroCNI?: string;
  niveauInstruction?: NiveauInstruction;
  nombrePersonneACharge?: number;

}

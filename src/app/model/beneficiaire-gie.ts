import {Session} from "./session";
import {ZoneGeographique} from "./zone-geographique";
import {ActiviteBeneficiaire} from "./activite-beneficiaire";
import {Demande} from "./demande";
import {Personne} from "./personne";
import { Projet } from "./projet";
import {Beneficiaire} from "./beneficiaire";

export class BeneficiaireGie extends Beneficiaire{

  nom?: string;
  email?: string;
  statusJuridique?: string;
  nomDocumentConstitution?: string;
}

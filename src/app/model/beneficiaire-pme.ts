import {Personne} from "./personne";
import {Demande} from "./demande";
import {ActiviteBeneficiaire} from "./activite-beneficiaire";
import {ZoneGeographique} from "./zone-geographique";
import {Session} from "./session";
import {Beneficiaire} from "./beneficiaire";

export class BeneficiairePME extends Beneficiaire{

  denominationSociale?: string;
  numeroRCCM?: string;
  documentRCCM?: string;
  ninea?: string;
  documentNinea?: string;
  statusJuridique?: string;
  documentConstitution?: string;
}

import {Session} from "./session";
import {Offre} from "./offre";
import {ZoneGeographique} from "./zone-geographique";
import {SecteurActivite} from "./secteur-activite";
import {Activite} from "./activite";

export class OffreMatrice{
  supprime?: boolean;
  dateCreation?: string;
  dateModification?: string;
  session?:	Session;
  id?: number;
  offre?: Offre;
  typeBeneficiaire?: string;
  montantMax?:	number;
  montantMin?:	number;
  dateButoirTeranga?:	string;
  dateButoirPMO?:	string;
  dureeNominale?:	number;
  dureeMax?:	number;
  activite?: Activite;
  zoneGeographiques?: ZoneGeographique[];
  secteurActivites?: SecteurActivite[];
}

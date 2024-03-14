import {SecteurActivite} from "./secteur-activite";
import {ZoneGeographique} from "./zone-geographique";
import {InstrumentFinancement} from "./instrument-financement";
import {Personne} from "./personne";
import {Offre} from "./offre";

export class PMO {
  id?: number;
  denominationSociale?:	string;
  numeroRCCM?:	string;
  ninea?:	string;
  logo?:	string;
  nom?:	string;
  sigle? : string;
  nomRapportActiviteAnMoins1?:	string;
  nomRapportActiviteAnMoins2?:	string;
  nomRapportActiviteAnMoins3?:	string;
  nomRapportGestionAnMoins1?:	string;
  nomRapportGestionAnMoins2?:	string;
  nomRapportGestionAnMoins3?:	string
  nomEtatFinancierAnMoins1?:	string;
  nomEtatFinancierAnMoins2?:	string;
  nomEtatFinancierAnMoins3?:	string;
  isInstitutionFinancement?:	boolean;
  portefeuilleActuel?:	number;
  pourcentageJeune?:	number;
  pourcentageFemme?:	number;
  nomDocumentAutres?: string[];
  principauxPartenaires?: string;
  secteurActivites?: SecteurActivite[];
  secteurActiviteRepresentatifs?: SecteurActivite[];
  zoneInterventions?: ZoneGeographique[];
  instrumentFinancements?: InstrumentFinancement;
  personne?: Personne;
  offres?: Offre[];
  supprime?: boolean;
}

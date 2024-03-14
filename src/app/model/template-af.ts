import {Session} from "./session";
import {Profil} from "./profil";
import {Demande} from "./demande";
import {Credit} from "./credit";
import {Prevision} from "./prevision";

export class TemplateAF {
  reperes?: string;
  statut_domicile?: string;
  references_familiales?: string;
  prenom_nom_conjointe?: string;
  numero_telephone_conjointe?: string;

  credit?: Credit[];
  fonds_propre?: number;

  prevision?: Prevision;
  solvabilite?: string;
  apport_personnel?: number;
  depenses_previsionnelles?: number;
  investissement?: number;
  besoin_reel?: number;
  revenus_personnels?: string;
  benefices_previsionnelles?: number;
  depensense_personnelles?: number;
  remboursement_mensuel?: number;
  marge?: number;
  atouts?: string;
  competences?: string;
  formation_financiere?: string;
  marche_concurrence?: string;
  marche_reglementation?: string;
  estimation?: string;
  hypotheses?: string;
  risques?: string;
  preconisation?: string;
  recommandations?: string;
  situationMatrimoniale?:string;
  capacite_manageriale?: string;
  regime_matrimonial?: string;
  patrimoine_personnel?: string;
  patrimoine_commun?: string;
  moyens_utilises?: string;
  organisation?: string;
  commentaire?: string;
  impact_social?: string;
  but_demande?: string;

  identification_activite?: string;

  detailProjet?: string;

   etat_financier?: string;

   demande?: Demande;
}



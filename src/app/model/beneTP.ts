import {Beneficiaire} from "./beneficiaire";

export interface BeneTP {
  id: number;
  statut: string;
  code: string;
  beneficiaire : Beneficiaire;
}

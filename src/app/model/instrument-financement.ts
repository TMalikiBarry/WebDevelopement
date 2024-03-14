import {Session} from "./session";

export class InstrumentFinancement {
  supprime?: boolean;
  dateCreation?: string;
  dateModification?: string;
  session?:	Session;
  nature?:	string
  code?:	string
  description?:	string
  tauxTRI?:	number;
  tauxInteretAnnuel?:	number;
  dureeMax?:	string;
  dureeMin?:	string;
}

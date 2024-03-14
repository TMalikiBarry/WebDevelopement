import {Session} from "./session";

export class Garantie {
  supprime?: boolean;
  dateCreation?: string;
  dateModification?: string;
  session?:	Session;
  id?: number;
  nature?:	string;
  libelle?:	string;
  niveau?: string;
}

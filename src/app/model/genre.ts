import {Session} from "./session";

export class Genre {
  supprime?: boolean;
  dateCreation?: string;
  dateModification?: string;
  session?:	Session;
  code?: string;
  libelle?: string;
}

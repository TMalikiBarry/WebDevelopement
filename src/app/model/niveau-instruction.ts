import {Session} from "./session";

export class NiveauInstruction {
  supprime?: boolean;
  dateCreation?: string;
  dateModification?: string;
  session?:	Session;
  code?: string;
  libelle?: string;
}

import {Session} from "./session";
import {Profil} from "./profil";

export class Acces {
  supprime?: boolean;
  dateCreation?: string;
  dateModification?: string;
  session?:	Session;
  id?: number;
  login?:	string;
  password?:	string;
  oldPassword?: string;
  status?:	string;
  dateLastPwdUpdate?:	string;
  hasAlreadyConnected?:	boolean;
  profil?: Profil

  auth_statut?: AUTHLICYCLEStatus;
  secretKey?: string;
}

export enum AUTHLICYCLEStatus {
  GENERATED = "GENERATED",
  REGISTERED = "REGISTERED",
  VALIDATED = "VALIDATED",
}

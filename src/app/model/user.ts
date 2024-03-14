import {Login} from "./login";
import { Personne } from "./personne";
import {EnumValue} from "@angular/compiler-cli/src/ngtsc/partial_evaluator";

export class User extends Login{
  roles: string[] | undefined;
  status: boolean | undefined;
  token: string | undefined;
  id : number = -1 ;
  idParent : number = -1 ;
  type : string = '';
  personne : Personne = new Personne();
  username : String = '';

}

export enum Role{
  SUPERVISEUR_BE = "SUPERVISEUR_BE",
  SUPERVISEUR_PMO = "SUPERVISEUR_PMO",
  AGENT_PMO = "AGENT_PMO",
  AGENT_INITIATEUR= "AGENT_INITIATEUR",
  AGENT_VALIDATEUR="AGENT_VALIDATEUR",
  ANALYSTE_FINANCIER="ANALYSTE_FINANCIER",
}

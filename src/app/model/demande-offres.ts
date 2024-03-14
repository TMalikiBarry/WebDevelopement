import {Demande} from "./demande";
import {Offre} from "./offre";

export class ApiResponseDemandeOffres {
  id  : number =0 ;
  demande  : Demande = new Demande();
  offres : Offre[] = []
}

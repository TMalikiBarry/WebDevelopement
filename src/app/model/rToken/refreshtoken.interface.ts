import {Acces} from "../acces";

export interface RefreshtokenInterface {
  id: number;
  user: Acces;
  token: string;
  expiryDate: Date;
}

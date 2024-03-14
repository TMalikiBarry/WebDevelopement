import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class CheckFileSize {


  constructor() {

  }

  // max size of file
  limitSelfie = 10 * 1024 * 1024;
  limitFile = 2 * 1024 * 1024;

  checkSize(size: number, fileType: "selfieIdentity" | "notSelfie" = 'selfieIdentity'): boolean {
    if (fileType === 'selfieIdentity') {
      return size <= this.limitSelfie;
    } else if (fileType === 'notSelfie') {
      return size <= this.limitFile;
    } else {
      throw new Error('Le type de fichier spécifié n\'est pas pris en compte');
    }
  }


}

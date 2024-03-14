import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiResponse} from 'src/app/model/api-response';
import {environment} from 'src/environments/environment';
import {AbstractControl} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd/modal";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private host = environment.host;

  tableauCNI: string[] = ['\'image/jpeg\'', 'pdf', 'png', 'jpg', 'jpeg'];
  tableau: string[] = [...this.tableauCNI, 'doc', 'docx', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  checkFile: boolean = false;
  checkCNIFileSize: boolean = true;
  // max size of file
  limitSelfie = 10 * 1024 * 1024;
  limitFile = 2 * 1024 * 1024;

  constructor(private http: HttpClient, private modalService: NzModalService) {
  }

  checkSize(size: number, fileType: "selfieIdentity" | "notSelfie" = 'selfieIdentity'): boolean {
    if (fileType === 'selfieIdentity') {
      return size <= this.limitSelfie;
    } else if (fileType === 'notSelfie') {
      return size <= this.limitFile;
    } else {
      throw new Error('Le type de fichier spécifié n\'est pas pris en compte');
    }
  }

  checkTypeFile(tableau: string[], extension: string) {
    return tableau?.indexOf(extension) !== -1;
  }

  save(fichier: FormData, type: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.host + "/files/" + type, fichier)
  }

  importFile(typeF: "cni" | "RCCM" | "NINEA" | "complementInfo" | "bussinessPlan" | "ETATFINANCIER",
             formControl: AbstractControl, fileType: "singleFile" | "multipleFile", isCNI: boolean = false,
             fileName: any, event: Event, multiFile?: any[]) {

    const target = event?.target as HTMLInputElement;
    switch (fileType) {
      case "singleFile":
        // @ts-ignore
        let checkFile = isCNI ? this.checkTypeFile(this.tableauCNI, target.files[0].name.split('.').pop()) : this.checkTypeFile(this.tableau, target.files[0].name.split('.').pop());
        if (target.files && target.files.length) {
          console.log('1__ Test if');
          if (checkFile) {
            console.log('2__ Test if');
            // @ts-ignore
            const [file] = target.files;
            if (this.checkSize(file.size, 'notSelfie')) {
              console.log('3__ Test if');
              let formData = new FormData();
              formData.append('file', file);
              this.save(formData, typeF).subscribe(
                (response) => {
                  console.log('__ Test save Next Response __');
                  fileName = response.reponse;
                  formControl.setValue(response.reponse);
                },
                (error) => {
                  console.log(error.textSatus);
                  formControl.setValue('');
                  this.modalService.error({
                    nzTitle: 'Problème de chargement de fichier',
                    nzContent: 'Veuillez revoir votre connexion'
                  });
                },
                () => {
                  console.log('__ Test save Complete __');
                })
            } else {
              console.log('1__ Test else');
              console.log("Fichier trop lourd !!!!!");
              this.modalService.error({
                nzTitle: 'Problème de chargement de fichier',
                nzContent: 'Votre fichier est trop lourd, veillez à ce que la taille ' +
                  '<strong><em>ne dépasse pas 2 Mo</em></strong> !!!'
              });
              formControl.setValue('');
            }
          } else {
            console.log('2__ Test else');
            this.modalService.error({
              nzTitle: 'Problème de chargement de fichier',
              nzContent: 'Le type du fichier choisi est invalide, ' +
                '<strong><em>Veuillez choisir un format de fichier autorisé</em></strong> !!!'
            });
          }
        } else {
          console.log('3__ Test else');
        }
        break;
      case "multipleFile":
        // @ts-ignore
        for (let index = 0; index < target.files.length; index++) {
          const element = target.files![index];
          // @ts-ignore
          if (this.checkTypeFile(this.tableau, element.name.split('.').pop())) {
            if (this.checkSize(element.size, 'notSelfie')) {
              let formData = new FormData();
              formData.append('file', element);
              // console.log(element);
              // set the name form the database
              this.save(formData, typeF).subscribe(
                response => {
                  fileName = response.reponse;
                  // console.log(this.complementInfoNom);
                  multiFile!.push(response.reponse || '');
                },
                error => {
                  console.log(error);
                  formControl.setValue('');
                  this.modalService.error({
                    nzTitle: 'Problème de chargement de fichier',
                    nzContent: 'Veuillez revoir votre connexion'
                  });
                })

            } else {
              console.log("Fichier trop lourd !!!!!");
              this.modalService.error({
                nzTitle: 'Problème de chargement de fichier',
                nzContent: 'Votre fichier est trop lourd, veillez à ce que la taille ' +
                  '<strong><em>ne dépasse pas 2 Mo</em></strong> !!!'
              });
              formControl.setValue('');
            }
          } else {
            this.modalService.error({
              nzTitle: 'Problème de chargement de fichier',
              nzContent: 'Le type du fichier choisi est invalide, ' +
                '<strong><em>Veuillez choisir un format de fichier autorisé</em></strong> !!!'
            });
          }
        }
        break;

      default:
        throw new Error("Cette valeur de fileType n'est pas pris en compte");
    }
  }

  removeFile(formControl: AbstractControl, fileType: "singleFile" | "multipleFile", value: string, fileName?: string, filesList?: string[]) {
    if (fileType == 'singleFile') {
      console.log(value);
      this.modalService.confirm({
        nzTitle: 'Confirmer le retrait',
        nzOkText: 'Retirer',
        nzContent: `Etes vous sûr de vouloir retirer le document <strong><em>${value.slice(value.lastIndexOf('_') + 1)}</em></strong>`,
        nzOnOk: () => {
          fileName = '';
          formControl.setValue('');
        }
      });
    } else if (fileType == 'multipleFile') {
      console.log(value);
      const element = filesList!.find((val) => {
        return val == value;
      });
      this.modalService.confirm({
        nzTitle: 'Confirmer le retrait',
        nzOkText: 'Retirer',
        nzContent: `Etes vous sûr de vouloir retirer le document ${element!.slice(element!.lastIndexOf('_') + 1)}`,
        nzOnOk: () => {
          filesList!.splice(filesList!.indexOf(element!), 1);//remove element from array
          formControl.setValue('');
        }
      });
    } else {
      throw new Error("Cette valeur de fileType n'est pas pris en compte");
    }
  }


}

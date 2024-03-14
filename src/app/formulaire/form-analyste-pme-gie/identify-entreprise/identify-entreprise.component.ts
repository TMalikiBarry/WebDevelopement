import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {Demande} from "../../../model/demande";
import {TemplateAF} from "../../../model/templateAF";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {FormAnalystePmeGieComponent} from "../form-analyste-pme-gie.component";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";
import {NzModalService} from "ng-zorro-antd/modal";
import {FileService} from "../../../services/file/file.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-identify-entreprise',
  templateUrl: './identify-entreprise.component.html',
  styleUrls: ['./identify-entreprise.component.scss']
})
export class IdentifyEntrepriseComponent implements OnInit {

  @Input() demande !: Demande;
  @Input() templateAf !: TemplateAF;
  @Input() identifyEntreprise : any;
  @Output() identifyEntrepriseChange = new EventEmitter<any>();

  checkProjetFileSizeMB: boolean = true;
  checkEtatFileSizeMB: boolean = true;
  checkIdentifFileSizeMB: boolean = true;

  checkFileProjet: boolean = false;
  checkFileEtat: boolean = false;
  checkFileIdentif: boolean = false;

  ProjetNom:any;
  EtatNom: any;
  IdentifNom: any;

  baseUrlFile = environment.baseUrlFile;

  entrepriseForm = this.fb.group({
    nom: ['', Validators.required],
    adresse: ['', Validators.required],
    formeJuridique: ['', Validators.required],
    capital: [''],
    dirigeants: ['luiMeme', Validators.required],
    fullName: ['', Validators.required],
    moyensUtilises: [''],
    organisation: [''],
    commentaires: [''],

    identification_activite: [''],
    detailProjet: [''],
    etat_financier: [''],
  })
  fileProjet : any;
  fileEtat : any;

  imageProjet : any ;
  imageEtat : any ;

  detailProjetDoc : any;
  etat_financierDoc : any;

  fileListdetailProjet: NzUploadFile[] = [];
  fileListetat_financier: NzUploadFile[] = [];

  beforeUploadProjet = (file: NzUploadFile): boolean => {
    this.fileProjet = file ;
    //console.log(file.originFileObj);
    //console.log(file)
    if (!this.checkFileSize.checkSize(file.size!, 'selfieIdentity')) {
      this.modalService.error({
        nzTitle: 'Erreur sur la taille ',
        nzContent: 'Merci de recharger un fichier de taille inferieure à 10MB'
      });

      return false;
    }
    this.getBase64(this.fileProjet)
      .then(
        (value)=>{
          //console.log(value)
          this.imageProjet = value ;
        }
      )


    this.documentProjetLoad(file);

    return false;
  };

  beforeUploadEtat = (file: NzUploadFile): boolean => {
    this.fileEtat = file ;
    //console.log(file.originFileObj);
    //console.log(file)
    if (!this.checkFileSize.checkSize(file.size!, 'selfieIdentity')) {
      this.modalService.error({
        nzTitle: 'Erreur sur la taille ',
        nzContent: 'Merci de recharger un fichier de taille inferieure à 10MB'
      });

      return false;
    }
    this.getBase64(this.fileEtat)
      .then(
        (value)=>{
          //console.log(value)
          this.imageEtat = value ;
        }
      )

    this.documentEtatLoad(file)
    return false;
  };

  constructor(private fb: UntypedFormBuilder,
              private fileService : FileService ,
              private checkFileSize : CheckFileSize,
              private modalService : NzModalService,
              private tp: FormAnalystePmeGieComponent,
              private notifService: NzNotificationService) { }

  ngOnInit(): void {
    if (this.identifyEntreprise) {
      console.log(this.identifyEntreprise)
      this.entrepriseForm.patchValue({
          ...this.identifyEntreprise,
        detailProjet : this.detailProjetDoc,
        etat_financier : this.etat_financierDoc,
        imageProjet : this.imageProjet,
        imageEtat : this.imageEtat
        }
      );
    }
  }

  toFirstForm() {

  }

  validatePME_GIETemplate() {
    if (this.entrepriseForm.invalid) {
      this.notifService.error('Attention', "Il y a des champs qui ne sont pas valides, veuillez revoir votre formulaire",
        {
          nzDuration: 4000,
        });
      return;
    }else {
      this.identifyEntrepriseChange.emit({
        ...this.entrepriseForm.getRawValue()
      })
    }

    //console.log("template" + JSON.stringify(this.templateAf))
    this.tp.next();
  }

  documentProjetLoad(event:any){

    let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.checkFileProjet = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if(event.target.files && event.target.files.length) {
        const [file] = event.target.files;

        console.log(file.size);

        this.checkProjetFileSizeMB = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkProjetFileSizeMB) {
          let formData = new FormData();

          formData.append('file', file);
          //console.log(file)


          // set the name form the database
          this.fileService.save(formData, 'DETAIL_PROJET').subscribe(
            response => {

              this.ProjetNom = response.reponse ;
              console.log(this.ProjetNom);
            }
            ,error=>{
              //console.log(error);
            }
          )
        } else {
          console.log("Fichier trop lourd !!!!!");
          this.identifyEntreprise.controls.detailProjet.setValue('');
        }


      }
      this.checkFileProjet = false;
    }else{
      this.checkFileProjet = true;
      //console.log('On y est',this.descriptionForm.controls.bussimessPlan)
      this.identifyEntreprise.controls.detailProjet.setValue('');
    }
  }

  documentEtatLoad(event:any){

    let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.checkFileEtat = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if(event.target.files && event.target.files.length) {
        const [file] = event.target.files;

        console.log(file.size);

        this.checkEtatFileSizeMB = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkEtatFileSizeMB) {
          let formData = new FormData();

          formData.append('file', file);
          //console.log(file)


          // set the name form the database
          this.fileService.save(formData, 'ETAT_FINANCIER').subscribe(
            response => {

              this.EtatNom = response.reponse ;
              console.log(this.EtatNom);
            }
            ,error=>{
              //console.log(error);
            }
          )
        } else {
          console.log("Fichier trop lourd !!!!!");
          this.identifyEntreprise.controls.etat_financier.setValue('');
        }


      }
      this.checkFileEtat = false;
    }else{
      this.checkFileEtat = true;
      //console.log('On y est',this.descriptionForm.controls.bussimessPlan)
      this.identifyEntreprise.controls.etat_financier.setValue('');
    }
  }

  documentIdentifLoad(event:any){

    let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.checkFileIdentif = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if(event.target.files && event.target.files.length) {
        const [file] = event.target.files;

        console.log(file.size);

        this.checkIdentifFileSizeMB = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkIdentifFileSizeMB) {
          let formData = new FormData();

          formData.append('file', file);
          //console.log(file)


          // set the name form the database
          this.fileService.save(formData, 'IDENTIF_ACTIVITE').subscribe(
            response => {

              this.IdentifNom = response.reponse ;
              console.log(this.IdentifNom);
            }
            ,error=>{
              //console.log(error);
            }
          )
        } else {
          console.log("Fichier trop lourd !!!!!");
          this.identifyEntreprise.controls.identification_activite.setValue('');
        }


      }
      this.checkFileIdentif = false;
    }else{
      this.checkFileIdentif = true;
      //console.log('On y est',this.descriptionForm.controls.bussimessPlan)
      this.identifyEntreprise.controls.identification_activite.setValue('');
    }
  }


  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  checkTypeFile(tableau: string[],extension: string ){
    return tableau?.indexOf(extension) !== -1;
  }

  deleteIdentif(value: string) {
    console.log(value);
    this.modalService.confirm({
      nzTitle: 'Confirmer le retrait',
      nzOkText: 'Retirer',
      nzContent: `Etes vous sûr de vouloir retirer le document ${value.slice(value.lastIndexOf('_') + 1)}`,
      nzOnOk: () => {
        this.IdentifNom = '';
        this.identifyEntreprise.controls.identification_activite.setValue('');
      }
    });
  }
  deleteEtat(value: string) {
    console.log(value);
    this.modalService.confirm({
      nzTitle: 'Confirmer le retrait',
      nzOkText: 'Retirer',
      nzContent: `Etes vous sûr de vouloir retirer le document ${value.slice(value.lastIndexOf('_') + 1)}`,
      nzOnOk: () => {
        this.EtatNom = '';
        this.identifyEntreprise.controls.etat_financier.setValue('');
      }
    });
  }
  deleteProjet(value: string) {
    console.log(value);
    this.modalService.confirm({
      nzTitle: 'Confirmer le retrait',
      nzOkText: 'Retirer',
      nzContent: `Etes vous sûr de vouloir retirer le document ${value.slice(value.lastIndexOf('_') + 1)}`,
      nzOnOk: () => {
        this.ProjetNom = '';
        this.identifyEntreprise.controls.detailProjet.setValue('');
      }
    });
  }
}

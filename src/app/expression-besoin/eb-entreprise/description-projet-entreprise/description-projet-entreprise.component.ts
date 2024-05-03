import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EbEntrepriseComponent} from "../eb-entreprise.component";
import {TranchePersonneService} from "../../../services/configuration/tranche-personne/tranche-personne.service";
import {TrancheNombrePersonne} from "../../../model/tranche-nombre-personne";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {FileService} from "../../../services/file/file.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Demande} from "../../../model/demande";
import {Projet} from "../../../model/projet";
import {Beneficiaire} from "../../../model/beneficiaire";
import {environment} from 'src/environments/environment';
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";
import {NzModalService} from "ng-zorro-antd/modal";
import {StorageService} from "../../../services/Storage/storage.service";

@Component({
  selector: 'app-description-projet-entreprise',
  templateUrl: './description-projet-entreprise.component.html',
  styleUrls: ['./description-projet-entreprise.component.scss']
})
export class DescriptionProjetEntrepriseComponent implements OnInit {

  constructor(private modalService: NzModalService,
              private storage: StorageService,
              private eb: EbEntrepriseComponent,
              private tranchepersonneService: TranchePersonneService,
              private fb: UntypedFormBuilder,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private notificationService: NzNotificationService) {
  }

  @Input() description: any;
  @Output() descriptionChange = new EventEmitter<any>();
  submitted: boolean = false;
  checkBPlanFileSizeMB: boolean = true;
  checkCpmtInfoFileSizeMB: boolean = true;
  bussinessPlanNom: any;
  complementInfoNom: any;
  complementInfoNomList: any [] = [];
  submitted2: boolean = false;
  submitted3: boolean = false;
  key1 = true;
  key2 = false;
  key3 = false;
  baseUrlFile = environment.baseUrlFile;
  nombreEntree: number = 0;
  nombrecollapes = 3;
  nouveaux?: Projet[];
  nombreTotalFemmePermanent: boolean = false;
  nombreTotalJeunePermanent: boolean = false;
  nombreTotalFemmeNonPermanent: boolean = false;
  nombreTotalJeuneNonPermanent: boolean = false;
  checkFilePlan: boolean = false;
  checkFileInfo: boolean = false;

  descriptionForm = this.fb.group({

    descriptionProjet: ['', Validators.required],
    //coutProjet: ['', [Validators.required,Validators.pattern('^[0-9\\s]*$')]],
    bussimessPlan: [''],
    complementInfo: [''],
    employesPermanents: [''],
    nombreEmploiAdditionnelPermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    nombreFemmesPrevuPermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    pourcentageFemmePermanent: [''],
    nombreJeunesPermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    pourcentageJeunesPermanent: [''],
    employesNonPermanents: [''],
    NombreEmploisAdditionnelsNonPermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    NombreFemmesPrevuNonPermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    PourentageFemmesNonPermanent: [''],
    NombreJeunesNonPermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    PourcentageJeunesNonPermanent: ['']

  })
  lotEtape1: string[] = ["descriptionProjet", "bussimessPlan", "complementInfo"];
  lotEtape2: string[] = ["employesPermanents", "nombreEmploiAdditionnelPermanent", "nombreFemmesPrevuPermanent", "pourcentageFemmePermanent", "nombreJeunesPermanent", "pourcentageJeunesPermanent"];
  lotEtape3: string[] = ["employesNonPermanents", "NombreEmploisAdditionnelsNonPermanent", "NombreFemmesPrevuNonPermanent", "PourentageFemmesNonPermanent", "NombreJeunesNonPermanent", "PourcentageJeunesNonPermanent"];

  personne?: TrancheNombrePersonne;
  personnes?: TrancheNombrePersonne[];

  ngOnInit(): void {
    this.onGetTranchePersonnes()
    if (this.storage.getItem('demandeCourante')) {
      let beneficiaire = new Beneficiaire();
      let demandeRecuperee: Demande;


      demandeRecuperee = JSON.parse(<string>this.storage.getItem('demandeCourante'));
      const currentUser = JSON.parse(this.storage.getItem('currentUser') || '');
      beneficiaire.id = currentUser.idParent;
      ////console.log(demandeRecuperee);
      // console.log(demandeRecuperee);
      //console.log(demandeRecuperee.beneficiaire?.id);
      //console.log(demandeRecuperee.beneficiaire?.id == beneficiaire.id);
      if (demandeRecuperee.beneficiaire?.id == beneficiaire.id) {

        let nouveau: Projet;
        this.nouveaux = demandeRecuperee.projets;
        // @ts-ignore
        //console.log(demandeRecuperee.projets[0]);
// @ts-ignore
        nouveau = demandeRecuperee.projets[0];

        this.complementInfoNomList = nouveau.complementInformations || [];
        this.descriptionForm.patchValue({

          descriptionProjet: nouveau.description,
          coutProjet: nouveau.cout,
          bussimessPlan: nouveau.businessPlan,
          complementInfo: nouveau.complementInformations,
          employesPermanents: nouveau.nombreEmploisPermanent,
          nombreEmploiAdditionnelPermanent: nouveau.nombreEmploisAdditionnelPermanent,
          nombreFemmesPrevuPermanent: nouveau.nombreFemmePrevuePermanent,
          pourcentageFemmePermanent: nouveau.pourcentageFemmePermanent + '%',
          nombreJeunesPermanent: nouveau.nombreJeunePermanent,
          pourcentageJeunesPermanent: nouveau.pourcentageJeunePermanent + '%',
          employesNonPermanents: nouveau.nombreEmploisNonPermanent,
          NombreEmploisAdditionnelsNonPermanent: nouveau.nombreEmploisAdditionnelNonPermanent,
          NombreFemmesPrevuNonPermanent: nouveau.nombreFemmePrevueNonPermanent,
          PourentageFemmesNonPermanent: nouveau.pourcentageFemmeNonPermanent + '%',
          NombreJeunesNonPermanent: nouveau.nombreJeuneNonPermanent,
          PourcentageJeunesNonPermanent: nouveau.pourcentageJeuneNonPermanent + '%',

        });
      }

    } else {
      if (this.description) {
        this.descriptionForm.patchValue({
            ...this.description
          }
        );
        this.bussinessPlanNom = this.description?.bussinessPlanNom;
        this.complementInfoNom = this.description?.complementInfoNom;
        this.complementInfoNomList = this.description?.complementInfoNom;
      }
    }

    this.descriptionForm.controls.nombreFemmesPrevuPermanent.disable();
    this.descriptionForm.controls.nombreJeunesPermanent.disable();
    this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.disable();
    this.descriptionForm.controls.NombreJeunesNonPermanent.disable();
    this.descriptionForm.controls.pourcentageFemmePermanent.disable();
    this.descriptionForm.controls.pourcentageJeunesPermanent.disable();
    this.descriptionForm.controls.PourcentageJeunesNonPermanent.disable();
    this.descriptionForm.controls.PourentageFemmesNonPermanent.disable();
    this.checkBPlanFileSizeMB = true;
    this.checkCpmtInfoFileSizeMB = true;
  }

  currentStepPosition: number = this.eb.currentStepPosition;


  onGetTranchePersonnes() {
    this.tranchepersonneService.getAll().subscribe((response) => {
      this.personnes = response;
    });
  }

  pre() {
    this.eb.pre()
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    this.submitted3 = false;

    this.submitted = true;
    if (this.descriptionForm.valid && this.nombreEntree === this.nombrecollapes - 1) {
      //console.log(this.descriptionForm);
      this.descriptionChange.emit({
        bussinessPlanNom: this.bussinessPlanNom,
        complementInfoNom: this.complementInfoNomList, ...this.descriptionForm.getRawValue()
      })

      let descriptionCourante = "";
      let demande = new Demande();
      let projet = new Projet();

      projet.description = this.descriptionForm.controls.descriptionProjet.value;
     // projet.cout = this.descriptionForm.controls.coutProjet.value;
      projet.businessPlan = this.descriptionForm.controls.bussimessPlan.value;
      projet.complementInformations = this.descriptionForm.controls.complementInfo.value;
      projet.complementInformations = this.complementInfoNomList;
      projet.nombreEmploisPermanent = this.descriptionForm.controls.employesPermanents.value;
      projet.nombreEmploisAdditionnelPermanent = this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.value;
      projet.nombreFemmePrevuePermanent = this.descriptionForm.controls.nombreFemmesPrevuPermanent.value;
      projet.pourcentageFemmePermanent = this.descriptionForm.controls.pourcentageFemmePermanent.value?.replace('%', '');
      projet.nombreJeunePermanent = this.descriptionForm.controls.nombreJeunesPermanent.value;
      projet.pourcentageJeunePermanent = this.descriptionForm.controls.pourcentageJeunesPermanent.value?.replace('%', '');
      projet.nombreEmploisNonPermanent = this.descriptionForm.controls.employesNonPermanents.value;
      projet.nombreEmploisAdditionnelNonPermanent = this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value;
      projet.nombreFemmePrevueNonPermanent = this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.value;
      projet.pourcentageFemmeNonPermanent = this.descriptionForm.controls.PourentageFemmesNonPermanent.value?.replace('%', '');
      projet.nombreJeuneNonPermanent = this.descriptionForm.controls.NombreJeunesNonPermanent.value;
      projet.pourcentageJeuneNonPermanent = this.descriptionForm.controls.PourcentageJeunesNonPermanent.value?.replace('%', '');
      let projects: Projet[] = [];
      projects.push(projet);
      demande.projets = projects;
      console.log(demande);

      let beneficiaire = new Beneficiaire();
      if (localStorage.getItem('currentUser') != null) {
        const currentUser = JSON.parse(this.storage.getItem('currentUser') || '');
        beneficiaire.id = currentUser.idParent;
        demande.beneficiaire = beneficiaire;
      }
      descriptionCourante = JSON.stringify(demande);
      this.storage.setItem("demandeCourante", descriptionCourante)

      this.eb.next()
    } else {
      if (this.nombreEntree === this.nombrecollapes - 3) {
        for (let control of this.lotEtape1) {
          if (this.descriptionForm.controls[control].invalid) {
            this.submitted = true;
            this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
            return;

          }

        }
        this.key1 = false;
        this.key2 = true;
        this.key3 = false

      }

      if (this.nombreEntree === this.nombrecollapes - 2) {
        for (let control of this.lotEtape2) {
          if (this.descriptionForm.controls[control].invalid) {
            this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
            this.submitted2 = true;
            return;

          }

        }
        this.key1 = false;
        this.key2 = false;
        this.key3 = true

      }
      if (this.nombreEntree === this.nombrecollapes - 1) {

        for (let control of this.lotEtape3) {
          if (this.descriptionForm.controls[control].invalid) {

            this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
            this.submitted3 = true;
            return;
          }
        }

      }

    }
    this.checkBPlanFileSizeMB = true;
    this.checkCpmtInfoFileSizeMB = true;
    this.nombreEntree++;

  }

  done() {
    this.eb.done()
  }

  // calculpourcentage de femmes  permanent
  calculPourcentageFemmesPermanent() {
    if (this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.valid && this.descriptionForm.controls.nombreFemmesPrevuPermanent.valid) {
      let result = ((this.descriptionForm.controls.nombreFemmesPrevuPermanent.value * 100) / this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.value);
      this.descriptionForm.controls.pourcentageFemmePermanent.setValue(result.toFixed(2) + "%");
    } else {
      this.descriptionForm.controls.pourcentageFemmePermanent.setValue('');
    }
  }


  // calcul pourcentage de jeunes  permanents
  calculPourcentageJeunesPermanent() {
    if (this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.valid && this.descriptionForm.controls.nombreJeunesPermanent.valid) {
      let result = ((this.descriptionForm.controls.nombreJeunesPermanent.value * 100) / this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.value);
      this.descriptionForm.controls.pourcentageJeunesPermanent.setValue(result.toFixed(2) + "%");
    } else {
      this.descriptionForm.controls.pourcentageJeunesPermanent.setValue('');
    }
  }

  deleteBusinessPlan(value: string) {
    console.log(value);
    this.modalService.confirm({
      nzTitle: 'Confirmer le retrait',
      nzOkText: 'Retirer',
      nzContent: `Etes vous sûr de vouloir retirer le document ${value.slice(value.lastIndexOf('_') + 1)}`,
      nzOnOk: () => {
        this.bussinessPlanNom = '';
        this.descriptionForm.controls.bussimessPlan.setValue('');
      }
    });

  }

  deleteComplement(value: string) {
    console.log(value);
    // let index = this.complementInfoNomList.findIndex((e)=> {e === value}); //find index in your array
    console.log(this.complementInfoNomList.length);
    for (let index = 0; index < this.complementInfoNomList.length; index++) {
      const element = this.complementInfoNomList[index];
      console.log(element);
      if (element == value) {
        this.modalService.confirm({
          nzTitle: 'Confirmer le retrait',
          nzOkText: 'Retirer',
          nzContent: `Etes vous sûr de vouloir retirer le document ${element.slice(element.lastIndexOf('_') + 1)}`,
          nzOnOk: () => {
            this.complementInfoNomList.splice(index, 1);//remove element from array
            this.descriptionForm.controls.complementInfo.setValue('');
          }
        });
        break;
      }
    }
    console.log(this.complementInfoNomList.length);
  }

  // -------------------- Pourcentage non peramnent------------------------------
  // calcul pourcentage de femmes non permanent
  calculPourcentageFemmesNonPermanent() {
    if (this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.valid && this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.valid) {
      let result = ((this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.value * 100) / this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value);
      this.descriptionForm.controls.PourentageFemmesNonPermanent.setValue(result.toFixed(2) + "%");
    } else {
      this.descriptionForm.controls.PourentageFemmesNonPermanent.setValue('');
    }
  }


  // calcul pourcentage de jeunes nom permanents
  calculPourcentageJeunesNonPermanent() {
    if (this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.valid && this.descriptionForm.controls.NombreJeunesNonPermanent.valid) {
      let result = ((this.descriptionForm.controls.NombreJeunesNonPermanent.value * 100) / this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value);
      this.descriptionForm.controls.PourcentageJeunesNonPermanent.setValue(result.toFixed(2) + "%");
    } else {
      this.descriptionForm.controls.PourcentageJeunesNonPermanent.setValue('');
    }
  }


  convertObject(value: any) {
    return JSON.stringify(value);
  }

  bussinessPlanLoad(event: any) {

    // let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    let tableau: string[] = ['pdf', 'doc', 'docx', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'jpg', 'jpeg', 'png'];
    this.checkFilePlan = false;
    if (this.checkTypeFile(tableau, event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        console.log(file.size);
        console.log(`Event target files : ${
            event.target.files.value
          }`
        );
        console.log(`Event target files Lenght: ${
            event.target.files.length
          }`
        );

        this.checkBPlanFileSizeMB = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkBPlanFileSizeMB) {
          let formData = new FormData();

          formData.append('file', file);
          //console.log(file)


          // set the name form the database
          this.fileService.save(formData, 'bussinessPlan').subscribe(
            response => {

              this.bussinessPlanNom = response.reponse;
              console.log(this.bussinessPlanNom);
            }
            , () => {

              this.descriptionForm.controls.bussimessPlan.setValue('');

            }
          )
        } else {
          console.log("Fichier trop lourd !!!!!");
          this.descriptionForm.controls.bussimessPlan.setValue('');
        }

      }
      this.checkFilePlan = false;
    } else {
      this.checkFilePlan = true;
      this.descriptionForm.controls.bussimessPlan.setValue('');
    }
  }

  complementInfoLoad(event: any) {

    // let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    let tableau: string[] = ['pdf', 'doc', 'docx', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'jpg', 'jpeg', 'png'];
    this.checkFileInfo = false;
    // console.log(event.target.files);
    for (let index = 0; index < event.target.files.length; index++) {
      const element = event.target.files[index];
      console.log(`Event target files : ${
          event.target.files
        }`
      );
      console.log(`Event target files Lenght: ${
          event.target.files.length
        }`
      );
      if (this.checkTypeFile(tableau, element.name.split('.').pop())) {
        // check if file exist
        if (event.target.files && event.target.files.length) {
          console.log(element.size);
          this.checkCpmtInfoFileSizeMB = this.checkFileSize.checkSize(element.size, 'notSelfie');
          if (this.checkCpmtInfoFileSizeMB) {
            // const [file] = event.target.files;
            let formData = new FormData();

            formData.append('file', element);
            // console.log(element);


            // set the name form the database
            this.fileService.save(formData, 'complementInfo').subscribe(
              response => {

                this.complementInfoNom = response.reponse;
                // console.log(this.complementInfoNom);
                this.complementInfoNomList.push(response.reponse || '');
              }
              , error => {
                console.log(error);
                this.descriptionForm.controls.bussimessPlan.setValue('');

              }
            )
          } else {
            console.log("Fichier trop lourd !!!!!");
            this.descriptionForm.controls.complementInfo.setValue('');
          }

        }
        this.checkFileInfo = false;
      } else {
        this.checkFileInfo = true;
        this.descriptionForm.controls.complementInfo.setValue('');
        break;
      }
    }
  }

  chooseFile() {
    let fileElem = document.getElementById("fileElem");
    fileElem?.click();
  }

  checkNombreTotalJeunePermanent() {
    if (this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.value.length === 0) {
      this.nombreTotalJeunePermanent = true;

    } else {
      this.nombreTotalFemmePermanent = false;
    }
  }

  checkNombreTotalFemmePermanent() {
    if (this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.value.length === 0) {
      this.nombreTotalFemmePermanent = true;
    } else {
      this.nombreTotalJeunePermanent = false;
    }
  }

  checkNombreTotalFemmeNonPermanent() {
    this.nombreTotalFemmeNonPermanent = this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value.length === 0;
  }

  checkNombreTotalJeuneNonPermanent() {
    this.nombreTotalJeuneNonPermanent = this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value.length === 0;
  }

  checkLimitInputsPermanent() {
    this.nombreTotalFemmePermanent = false;
    this.nombreTotalJeunePermanent = false;
    this.descriptionForm.controls.nombreJeunesPermanent.clearValidators();
    this.descriptionForm.controls.nombreFemmesPrevuPermanent.clearValidators();
    this.descriptionForm.controls.nombreJeunesPermanent.addValidators([Validators.max(this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.nombreJeunesPermanent.updateValueAndValidity();
    this.descriptionForm.controls.nombreFemmesPrevuPermanent.addValidators([Validators.max(this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.nombreFemmesPrevuPermanent.updateValueAndValidity();

    if (this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.value && this.descriptionForm.controls.nombreEmploiAdditionnelPermanent.value > 0) {
      if (this.descriptionForm.controls.nombreFemmesPrevuPermanent.disabled) {
        this.descriptionForm.controls.nombreFemmesPrevuPermanent.enable();
      }
      if (this.descriptionForm.controls.nombreJeunesPermanent.disabled) {
        this.descriptionForm.controls.nombreJeunesPermanent.enable();
      }
    } else {
      this.descriptionForm.controls.nombreFemmesPrevuPermanent.disable();
      this.descriptionForm.controls.nombreJeunesPermanent.disable();
    }
  }

  checkLimitInputsNonPermanent() {
    this.nombreTotalFemmeNonPermanent = false;
    this.nombreTotalJeuneNonPermanent = false;
    this.descriptionForm.controls.NombreJeunesNonPermanent.clearValidators();
    this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.clearValidators();
    this.descriptionForm.controls.NombreJeunesNonPermanent.addValidators([Validators.max(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.NombreJeunesNonPermanent.updateValueAndValidity();
    this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.addValidators([Validators.max(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.updateValueAndValidity();

    if (this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value && this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value > 0) {
      if (this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.disabled) {
        this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.enable();
      }
      if (this.descriptionForm.controls.NombreJeunesNonPermanent.disabled) {
        this.descriptionForm.controls.NombreJeunesNonPermanent.enable();
      }
    } else {
      this.descriptionForm.controls.NombreFemmesPrevuNonPermanent.disable();
      this.descriptionForm.controls.NombreJeunesNonPermanent.disable();
    }
  }

  checkTypeFile(tableau: string[], extension: string) {
    return tableau?.indexOf(extension) !== -1;
  }

}


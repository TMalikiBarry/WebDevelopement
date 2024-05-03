import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EbGieComponent} from "../eb-gie.component";
import {TranchePersonneService} from "../../../services/configuration/tranche-personne/tranche-personne.service";
import {TrancheNombrePersonne} from "../../../model/tranche-nombre-personne";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {MessageService} from "../../../services/message/message-service.service";
import {ToastrService} from "ngx-toastr";
import {FileService} from "../../../services/file/file.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Projet} from "../../../model/projet";
import {Beneficiaire} from "../../../model/beneficiaire";
import {Demande} from "../../../model/demande";
import {environment} from 'src/environments/environment';
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";
import {NzModalService} from "ng-zorro-antd/modal";
import {StorageService} from "../../../services/Storage/storage.service";

@Component({
  selector: 'app-description-projet-gie',
  templateUrl: './description-projet-gie.component.html',
  styleUrls: ['./description-projet-gie.component.scss']
})
export class DescriptionProjetGieComponent implements OnInit {

  constructor(private modalService: NzModalService,
              private eb: EbGieComponent,
              private tranchepersonneService: TranchePersonneService,
              private fb: UntypedFormBuilder,
              private storage: StorageService,
              private changeDetector: ChangeDetectorRef,
              private messageService: MessageService,
              private toast: ToastrService,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private notificationService: NzNotificationService) {
  }

  @Input() description : any ;
  @Output() descriptionChange = new EventEmitter<any>();
  personne?: TrancheNombrePersonne;
  personnes?: TrancheNombrePersonne[];
  submitted: boolean = false;
  checkBPlanFileSizeMB: boolean = true;
  checkCpmtInfoFileSizeMB: boolean = true;
  bussinessPlanNom:any;
  complementInfoNom: any;
  baseUrlFile = environment.baseUrlFile;
  complementInfoNomList : any [] = [];
  nouveaux?: Projet[];
  submitted2: boolean = false;
  submitted3: boolean = false;
  key1= true;
  key2= false;
  key3= false;
  nombreEntree: number = 0;
  nombrecollapes =3;
  nombreTotalFemmePermanent: boolean = false;
  nombreTotalJeunePermanent: boolean = false;
  nombreTotalFemmeNonPermanent: boolean = false;
  nombreTotalJeuneNonPermanent: boolean = false;
  checkFilePlan: boolean = false;
  checkFileInfo: boolean = false;


  descriptionForm = this.fb.group({
    descriptionProjet: ['', Validators.required],
    //coutProjet: ['', [Validators.required, Validators.pattern('^[0-9\\s]*$')]],
    bussimessPlan: [''],
    complementInfo: [''],
    employesPermanents: [''],
    nombreEmploiAdditionnel: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    nombreFemmesPrevu: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    pourcentageFemme: [''],
    nombreJeunes: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    pourcentageJeunes: [''],
    employesNonPermanents: [''],
    NombreEmploisAdditionnelsNonPermanents: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    NombreFemmesPrevuNonPermanents: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    PourentageFemmesNonPermanents: [''],
    NombreJeunesNonPermanents: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    PourcentageJeunesNonPermanents: ['']
  })
  lotEtape1: string[] = ["descriptionProjet","bussimessPlan","complementInfo"];
  lotEtape2: string[] = ["employesPermanents","nombreEmploiAdditionnel","nombreFemmesPrevu","pourcentageFemme","nombreJeunes","pourcentageJeunes"];
  lotEtape3: string[] = ["employesNonPermanents","NombreEmploisAdditionnelsNonPermanents","NombreFemmesPrevuNonPermanents","PourentageFemmesNonPermanents","NombreJeunesNonPermanents","PourcentageJeunesNonPermanents"];


  ngOnInit(): void {
    this.onGetTranchePersonnes()
    if (this.storage.getItem('demandeCourante')) {
      let beneficiaire = new Beneficiaire();
      let demandeRecuperee: Demande;


      demandeRecuperee = JSON.parse(<string>this.storage.getItem('demandeCourante'));
      const currentUser = JSON.parse(this.storage.getItem('currentUser') || '');
      beneficiaire.id = currentUser.idParent;
      //console.log(demandeRecuperee);
      //console.log(beneficiaire.id);
      //console.log(demandeRecuperee.beneficiaire?.id);
      //console.log(demandeRecuperee.beneficiaire?.id == beneficiaire.id);
      if (demandeRecuperee.beneficiaire?.id == beneficiaire.id) {

        let nouveau: Projet;
        this.nouveaux = demandeRecuperee.projets;
        // @ts-ignore
        //console.log(demandeRecuperee.projets[0]);
        nouveau = demandeRecuperee.projets[0];
        this.complementInfoNomList = nouveau.complementInformations || [];
        this.descriptionForm.patchValue({

          descriptionProjet: nouveau.description,
         // coutProjet: nouveau.cout,
          bussimessPlan: nouveau.businessPlan,
          complementInfo:nouveau.complementInformations,
          employesPermanents: nouveau.nombreEmploisPermanent,
          nombreEmploiAdditionnel: nouveau.nombreEmploisAdditionnelPermanent,
          nombreFemmesPrevu: nouveau.nombreFemmePrevuePermanent,
          pourcentageFemme: nouveau.pourcentageFemmePermanent+'%',
          nombreJeunes: nouveau.nombreJeunePermanent,
          pourcentageJeunes: nouveau.pourcentageJeunePermanent+'%',
          employesNonPermanents: nouveau.nombreEmploisNonPermanent,
          NombreEmploisAdditionnelsNonPermanents: nouveau.nombreEmploisAdditionnelNonPermanent,
          NombreFemmesPrevuNonPermanents: nouveau.nombreFemmePrevueNonPermanent,
          PourentageFemmesNonPermanents: nouveau.pourcentageFemmeNonPermanent+'%',
          NombreJeunesNonPermanents: nouveau.nombreJeuneNonPermanent,
          PourcentageJeunesNonPermanents: nouveau.pourcentageJeuneNonPermanent+'%',

        });
      }

    } else {

    if(this.description) {
      this.descriptionForm.patchValue({
          ...this.description
        }
      );
      this.complementInfoNomList = this.description?.complementInfoNom;
    }

    }
    this.bussinessPlanNom = this.description?.bussinessPlanNom;
    this.complementInfoNom = this.description?.complementInfoNom;
    this.descriptionForm.controls.nombreFemmesPrevu.disable();
    this.descriptionForm.controls.nombreJeunes.disable();
    this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.disable();
    this.descriptionForm.controls.NombreJeunesNonPermanents.disable();
    this.descriptionForm.controls.pourcentageFemme.disable();
    this.descriptionForm.controls.pourcentageJeunes.disable();
    this.descriptionForm.controls.PourentageFemmesNonPermanents.disable();
    this.descriptionForm.controls.PourcentageJeunesNonPermanents.disable();
    this.checkBPlanFileSizeMB = true;
    this.checkCpmtInfoFileSizeMB = true;
  }
  currentStepPosition: number = this.eb.currentStepPosition;

  onGetTranchePersonnes(){
    this.tranchepersonneService.getAll().subscribe((response) =>{
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
    if(this.descriptionForm.valid &&this.nombreEntree === this.nombrecollapes -1){
      this.descriptionChange.emit({bussinessPlanNom :this.bussinessPlanNom ,complementInfoNom : this.complementInfoNomList, ...this.descriptionForm.getRawValue()})

      let  descriptionCourante ="";
      let demande = new Demande();
      let projet = new Projet();

      projet.description = this.descriptionForm.controls.descriptionProjet.value;
     // projet.cout = this.descriptionForm.controls.coutProjet.value;
      projet.businessPlan = this.descriptionForm.controls.bussimessPlan.value;
      projet.complementInformations = this.descriptionForm.controls.complementInfo.value;
      projet.complementInformations = this.complementInfoNomList;
      projet.nombreEmploisPermanent = this.descriptionForm.controls.employesPermanents.value;
      projet.nombreEmploisAdditionnelPermanent = this.descriptionForm.controls.nombreEmploiAdditionnel.value;
      projet.nombreFemmePrevuePermanent = this.descriptionForm.controls.nombreFemmesPrevu.value;
      projet.pourcentageFemmePermanent = this.descriptionForm.controls.pourcentageFemme.value?.replace('%','');
      projet.nombreJeunePermanent = this.descriptionForm.controls.nombreJeunes.value;
      projet.pourcentageJeunePermanent = this.descriptionForm.controls.pourcentageJeunes.value?.replace('%','');
      projet.nombreEmploisNonPermanent = this.descriptionForm.controls.employesNonPermanents.value;
      projet.nombreEmploisAdditionnelNonPermanent = this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.value;
      projet.nombreFemmePrevueNonPermanent = this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.value;
      projet.pourcentageFemmeNonPermanent = this.descriptionForm.controls.PourentageFemmesNonPermanents.value?.replace('%','');
      projet.nombreJeuneNonPermanent = this.descriptionForm.controls.NombreJeunesNonPermanents.value;
      projet.pourcentageJeuneNonPermanent = this.descriptionForm.controls.PourcentageJeunesNonPermanents.value?.replace('%','');
      let projects: Projet[] =[];
      projects.push(projet);
      demande.projets = projects;
      //console.log(demande);

      let beneficiaire = new Beneficiaire();
      if(localStorage.getItem('currentUser') != null) {
        const currentUser = JSON.parse(this.storage.getItem('currentUser') || '');
        beneficiaire.id = currentUser.idParent;
        demande.beneficiaire = beneficiaire;
      }
      descriptionCourante = JSON.stringify(demande);


      this.storage.setItem("demandeCourante", descriptionCourante)
      this.eb.next()
    }else {
      if (this.nombreEntree === this.nombrecollapes - 3){
        for (let control of this.lotEtape1) {
          if (this.descriptionForm.controls[control].invalid) {
            this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
            return;

          }

        }
        this.key1 = false;
        this.key2 = true;
        this.key3 = false;
      }
      if (this.nombreEntree === this.nombrecollapes -2) {

        for (let control of this.lotEtape2) {
          if (this.descriptionForm.controls[control].invalid) {
            this.submitted2 = true;
            this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");

            return;
          }
        }
        this.key1 = false;
        this.key2 = false;
        this.key3 = true;
      }
      if (this.nombreEntree === this.nombrecollapes -1) {

        for (let control of this.lotEtape3) {
          if (this.descriptionForm.controls[control].invalid) {
            this.submitted3 = true;
            this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");

            return;
          }
        }

      }
    }
    this.checkBPlanFileSizeMB = true;
    this.checkCpmtInfoFileSizeMB = true;
    this.nombreEntree ++;
  }

  done() {
    this.eb.done()
  }
  calculPourcentageFemmesPermanent(){
    if(this.descriptionForm.controls.nombreEmploiAdditionnel.valid && this.descriptionForm.controls.nombreFemmesPrevu.valid ){
      let result =( (this.descriptionForm.controls.nombreFemmesPrevu.value * 100 ) /this.descriptionForm.controls.nombreEmploiAdditionnel.value);
      this.descriptionForm.controls.pourcentageFemme.setValue(result.toFixed(2)+"%");
    }
    else{
      this.descriptionForm.controls.pourcentageFemme.setValue('');
    }
  }


  // calcul pourcentage de jeunes  permanents
  calculPourcentageJeunesPermanent(){
    if(this.descriptionForm.controls.nombreEmploiAdditionnel.valid && this.descriptionForm.controls.nombreJeunes.valid ){
      let result =( (this.descriptionForm.controls.nombreJeunes.value * 100 ) /this.descriptionForm.controls.nombreEmploiAdditionnel.value);
      this.descriptionForm.controls.pourcentageJeunes.setValue(result.toFixed(2)+"%");
    }
    else{
      this.descriptionForm.controls.pourcentageJeunes.setValue('');
    }
  }

  // -------------------- Pourcentage non peramnent------------------------------
  // calcul pourcentage de femmes non permanent
  calculPourcentageFemmesNonPermanent(){
    if(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.valid && this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.valid ){
      let result =( (this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.value * 100 ) /this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.value);
      this.descriptionForm.controls.PourentageFemmesNonPermanents.setValue(result.toFixed(2)+"%");
    }
    else{
      this.descriptionForm.controls.PourentageFemmesNonPermanents.setValue('');
    }
  }


  // calcul pourcentage de jeunes nom permanents
  calculPourcentageJeunesNonPermanent(){
    if(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.valid && this.descriptionForm.controls.NombreJeunesNonPermanents.valid ){
      let result =( (this.descriptionForm.controls.NombreJeunesNonPermanents.value * 100 ) /this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.value);
      this.descriptionForm.controls.PourcentageJeunesNonPermanents.setValue(result.toFixed(2)+"%");
    }
    else{
      this.descriptionForm.controls.PourcentageJeunesNonPermanents.setValue('');
    }
  }

  chooseFile() {
    // var fileSelect = document.getElementById("fileSelect"),
    let fileElem = document.getElementById("fileElem");
    // console.log('babs');
    fileElem?.click();
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

  convertObject(value: any) {
    return JSON.stringify(value);
  }

  bussinessPlanLoad(event:any){
    let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.checkFilePlan = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
    //console.log(this.descriptionForm.controls.bussimessPlan.value)
    // check if file exist
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      console.log(file.size);

      this.checkBPlanFileSizeMB = this.checkFileSize.checkSize(file.size, 'notSelfie');
      if (this.checkBPlanFileSizeMB) {
        let formData = new FormData();

        formData.append('file', file);
        //console.log(file)


        // set the name form the database
        this.fileService.save(formData, 'bussinessPlan').subscribe(
          response => {

            this.bussinessPlanNom = response.reponse ;
            console.log(this.bussinessPlanNom);
          }
          ,error=>{
            //console.log(error);
          }
        )
      } else {
        console.log("Fichier trop lourd !!!!!");
        this.descriptionForm.controls.bussimessPlan.setValue('');
      }

    }this.checkFilePlan = false;
    }else{
      this.checkFilePlan = true;
      this.descriptionForm.controls.bussimessPlan.setValue('');
    }
  }

  complementInfoLoad(event: any) {

    // let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','jpg','jpeg', 'png'];
    this.checkFileInfo = false;
    // console.log(event.target.files);
    for (let index = 0; index < event.target.files.length; index++) {
      const element = event.target.files[index];
      if(this.checkTypeFile(tableau,element.name.split('.').pop())) {
        // check if file exist
        if(event.target.files && event.target.files.length) {
          this.checkCpmtInfoFileSizeMB = this.checkFileSize.checkSize(element.size, 'notSelfie');
          if (this.checkCpmtInfoFileSizeMB) {
            // const [file] = event.target.files;
            let formData = new FormData();

            formData.append('file', element);
            // console.log(element);


            // set the name form the database
            this.fileService.save(formData, 'complementInfo').subscribe(
              response => {

                this.complementInfoNom = response.reponse ;
                // console.log(this.complementInfoNom);
                this.complementInfoNomList.push(response.reponse || '');
              }
              ,error=>{
                console.log(error);
              }
            )
          } else {
            console.log("Fichier trop lourd !!!!!");
            this.descriptionForm.controls.complementInfo.setValue('');
          }

        }     this.checkFileInfo = false;
      }else{
        this.checkFileInfo = true;
        this.descriptionForm.controls.complementInfo.setValue('');
        break;
      }
    }
  }


  checkNombreTotalJeunePermanent() {
    if(this.descriptionForm.controls.nombreEmploiAdditionnel.value.length ===0){
      this.nombreTotalJeunePermanent = true;

    }else{
      this.nombreTotalFemmePermanent = false;
    }
  }
  checkNombreTotalFemmePermanent() {
    if(this.descriptionForm.controls.nombreEmploiAdditionnel.value.length ===0){
      this.nombreTotalFemmePermanent = true;
    }else{
      this.nombreTotalJeunePermanent = false;
    }
  }

  checkNombreTotalFemmeNonPermanent() {
    this.nombreTotalFemmeNonPermanent = this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.value.length === 0;
  }
  checkNombreTotalJeuneNonPermanent() {
    this.nombreTotalJeuneNonPermanent = this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.value.length === 0;
  }

  checkLimitInputsPermanent() {
    this.nombreTotalFemmePermanent = false;
    this.nombreTotalJeunePermanent = false;
    this.descriptionForm.controls.nombreJeunes.clearValidators();
    this.descriptionForm.controls.nombreFemmesPrevu.clearValidators();
    this.descriptionForm.controls.nombreJeunes.addValidators([Validators.max(this.descriptionForm.controls.nombreEmploiAdditionnel.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.nombreJeunes.updateValueAndValidity();
    this.descriptionForm.controls.nombreFemmesPrevu.addValidators([Validators.max(this.descriptionForm.controls.nombreEmploiAdditionnel.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.nombreFemmesPrevu.updateValueAndValidity();

    if (this.descriptionForm.controls.nombreEmploiAdditionnel.value && this.descriptionForm.controls.nombreEmploiAdditionnel.value > 0) {
      if (this.descriptionForm.controls.nombreFemmesPrevu.disabled) {
        this.descriptionForm.controls.nombreFemmesPrevu.enable();
      }
      if (this.descriptionForm.controls.nombreJeunes.disabled) {
        this.descriptionForm.controls.nombreJeunes.enable();
      }
    } else {
      this.descriptionForm.controls.nombreFemmesPrevu.disable();
      this.descriptionForm.controls.nombreJeunes.disable();
    }
  }

  checkLimitInputsNonPermanent() {
    this.nombreTotalFemmeNonPermanent = false;
    this.nombreTotalJeuneNonPermanent = false;
    this.descriptionForm.controls.NombreJeunesNonPermanents.clearValidators();
    this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.clearValidators();
    this.descriptionForm.controls.NombreJeunesNonPermanents.addValidators([Validators.max(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.NombreJeunesNonPermanents.updateValueAndValidity();
    this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.addValidators([Validators.max(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.updateValueAndValidity();

    if (this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.value && this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanents.value > 0) {
      if (this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.disabled) {
        this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.enable();
      }
      if (this.descriptionForm.controls.NombreJeunesNonPermanents.disabled) {
        this.descriptionForm.controls.NombreJeunesNonPermanents.enable();
      }
    } else {
      this.descriptionForm.controls.NombreFemmesPrevuNonPermanents.disable();
      this.descriptionForm.controls.NombreJeunesNonPermanents.disable();
    }
  }

  checkTypeFile(tableau: string[],extension: string ){
    return tableau?.indexOf(extension) !== -1;
  }
}

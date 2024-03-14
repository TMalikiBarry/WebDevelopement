import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormDemandeComponent} from "../form-demande.component";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {FileService} from "../../../services/file/file.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Demande} from "../../../model/demande";
import {Projet} from "../../../model/projet";
import {Beneficiaire} from "../../../model/beneficiaire";
import {environment} from 'src/environments/environment';
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";
import {NzModalService} from "ng-zorro-antd/modal";
import {AuthService} from "../../../services/security/auth/auth.service";


@Component({
  selector: 'app-description-projet',
  templateUrl: './description-projet.component.html',
  styleUrls: ['./description-projet.component.scss']
})
export class DescriptionProjetComponent implements OnInit {

  @Input() description: any;

  constructor(private modalService: NzModalService,
              private eb: FormDemandeComponent,
              private fb: UntypedFormBuilder,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private auth: AuthService,
              private notificationService: NzNotificationService,
  ) {
  }

  @Output() descriptionChange = new EventEmitter<any>();
  submitted: boolean = false;
  checkBPlanFileSizeMB: boolean = true;
  checkCpmtInfoFileSizeMB: boolean = true;
  bussinessPlanNom:any;
  complementInfoNom: any;
  complementInfoNomList : any [] = [];
  nouveaux?: Projet[];
  submitted2: boolean = false;
  checkFilePlan: boolean = false;
  checkFileInfo: boolean = false;
  submitted3: boolean = false;
  key1= true;
  key2= false;
  key3= false;
  nombreEntree: number = 0;
  baseUrlFile = environment.baseUrlFile;
  nombrecollapes =3;
  nombreTotalFemmePermanent: boolean = false;
  nombreTotalJeunePermanent: boolean = false;
  nombreTotalFemmeNonPermanent: boolean = false;
  nombreTotalJeuneNonPermanent: boolean = false;

  descriptionForm = this.fb.group({
    descriptionProjet: ['', Validators.required],
    bussimessPlan: [''],
    complementInfo: [''],
    employesPermanents: ['',Validators.pattern('[0-9]+')],
    nombreEmploiAdditionnelsPermanent: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    nombreFemmesPrevuPermanent: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    pourcentageFemmePermanent: [''],
    nombreJeunesPermanent: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    pourcentageJeunesPermanent: [''],
    employesNonPermanents: ['',Validators.pattern('[0-9]+')],
    NombreEmploisAdditionnelsNonPermanent: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    NombreFemmesPrevusNonPermanent: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    PourentageFemmessNonPermanent: [''],
    NombreJeunessNonPermanent: ['', [Validators.required,Validators.pattern('[0-9]+')]],
    PourcentageJeunessNonPermanent: ['']

  })
  lotEtape1: string[] = ["descriptionProjet", "bussimessPlan", "complementInfo"];
  lotEtape2: string[] = ["employesPermanents", "nombreEmploiAdditionnelsPermanent", "nombreFemmesPrevuPermanent", "pourcentageFemmePermanent", "nombreJeunesPermanent", "pourcentageJeunesPermanent"];
  lotEtape3: string[] = ["employesNonPermanents","NombreEmploisAdditionnelsNonPermanent","NombreFemmesPrevusNonPermanent","PourentageFemmessNonPermanent","NombreJeunessNonPermanent","PourcentageJeunessNonPermanent"];

  ngOnInit(): void {
    console.log(this.description)
    this.descriptionForm.controls.PourentageFemmessNonPermanent.disable()
    this.descriptionForm.controls.pourcentageFemmePermanent.disable()
    this.descriptionForm.controls.PourcentageJeunessNonPermanent.disable()
    this.descriptionForm.controls.pourcentageJeunesPermanent.disable()

    if (localStorage.getItem('demandeCourante')) {
      let beneficiaire = new Beneficiaire();
      let demandeRecuperee: Demande;


      demandeRecuperee = JSON.parse(<string>localStorage.getItem('demandeCourante'));
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
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
                      //  complementInfo:nouveau.complementInformations,
                       employesPermanents: nouveau.nombreEmploisPermanentMe,
                       nombreEmploiAdditionnelsPermanent: nouveau.nombreEmploisAdditionnelPermanent,
                       nombreFemmesPrevuPermanent: nouveau.nombreFemmePrevuePermanent,
                       pourcentageFemmePermanent: nouveau.pourcentageFemmePermanent+'%',
                       nombreJeunesPermanent: nouveau.nombreJeunePermanent,
                       pourcentageJeunesPermanent: nouveau.pourcentageJeunePermanent+'%',
                       employesNonPermanents: nouveau.nombreEmploisNonPermanentMe,
                       NombreEmploisAdditionnelsNonPermanent: nouveau.nombreEmploisAdditionnelNonPermanent,
                       NombreFemmesPrevusNonPermanent: nouveau.nombreFemmePrevueNonPermanent,
                       PourentageFemmessNonPermanent: nouveau.pourcentageFemmeNonPermanent+'%',
                       NombreJeunessNonPermanent: nouveau.nombreJeuneNonPermanent,
                       PourcentageJeunessNonPermanent: nouveau.pourcentageJeuneNonPermanent+'%',

          });
        }


    } else {
      if (this.description) {
        console.log(this.description)
        this.descriptionForm.patchValue({
            ...this.description
          }
        );
        this.complementInfoNomList = this.description?.complementInfoNom;
      }
    }

    //   console.log(this.description)
    // this.bussinessPlanNom = this.description?.bussinessPlanNom;
    // this.complementInfoNom = this.description?.complementInfoNom;
    // this.descriptionForm.controls.nombreFemmesPrevuPermanent.disable();
    // this.descriptionForm.controls.nombreJeunesPermanent.disable();
    // this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.disable();
    // this.descriptionForm.controls.NombreJeunessNonPermanent.disable();
    // this.descriptionForm.controls.pourcentageFemmePermanent.disable();
    // this.descriptionForm.controls.pourcentageJeunesPermanent.disable();
    // this.descriptionForm.controls.PourentageFemmessNonPermanent.disable();
    // this.descriptionForm.controls.PourcentageJeunessNonPermanent.disable();
    // this.checkBPlanFileSizeMB = true;
    // this.checkCpmtInfoFileSizeMB = true;

  }

  currentStepPosition: number = this.eb.currentStepPosition;

  pre() {
    this.eb.pre()
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    this.submitted3 = false;
    this.submitted = true;
    if (this.descriptionForm.valid && this.nombreEntree === this.nombrecollapes - 1) {
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
      projet.nombreEmploisPermanentMe = this.descriptionForm.controls.employesPermanents.value;
      projet.nombreEmploisAdditionnelPermanent = this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.value;
      projet.nombreFemmePrevuePermanent = this.descriptionForm.controls.nombreFemmesPrevuPermanent.value;
      projet.pourcentageFemmePermanent = this.descriptionForm.controls.pourcentageFemmePermanent.value.replace('%', '');
      projet.nombreJeunePermanent = this.descriptionForm.controls.nombreJeunesPermanent.value;
      projet.pourcentageJeunePermanent = this.descriptionForm.controls.pourcentageJeunesPermanent.value.replace('%', '');
      projet.nombreEmploisNonPermanentMe = this.descriptionForm.controls.employesNonPermanents.value;
      projet.nombreEmploisAdditionnelNonPermanent = this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value;
      projet.nombreFemmePrevueNonPermanent = this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.value;
      projet.pourcentageFemmeNonPermanent = this.descriptionForm.controls.PourentageFemmessNonPermanent.value.replace('%', '');
      projet.nombreJeuneNonPermanent = this.descriptionForm.controls.NombreJeunessNonPermanent.value;
      projet.pourcentageJeuneNonPermanent = this.descriptionForm.controls.PourcentageJeunessNonPermanent.value.replace('%', '');
      let projects: Projet[] = [];
      projects.push(projet);
      demande.projets = projects;
      //console.log(demande);

      let beneficiaire = new Beneficiaire();
      if (localStorage.getItem('currentUser') != null) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
        beneficiaire.id = currentUser.idParent;
        demande.beneficiaire = beneficiaire;
      }
      descriptionCourante = JSON.stringify(demande);


      localStorage.setItem("demandeCourante", descriptionCourante)
      this.eb.next()
    } else {
      if (this.nombreEntree === this.nombrecollapes - 3) {
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
      if (this.nombreEntree === this.nombrecollapes - 2) {

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
      if (this.nombreEntree === this.nombrecollapes - 1) {

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
    this.nombreEntree++;
  }

  done() {
    this.eb.done()
  }

  // calculpourcentage de femmes  permanent
  calculPourcentageFemmesPermanent(){
    if(this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.valid && this.descriptionForm.controls.nombreFemmesPrevuPermanent.valid ){
      let result =( (this.descriptionForm.controls.nombreFemmesPrevuPermanent.value * 100 ) /this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.value);
      this.descriptionForm.controls.pourcentageFemmePermanent.setValue(result.toFixed(2)+"%");
    }
    else{
      this.descriptionForm.controls.pourcentageFemmePermanent.setValue('');
    }
  }


  // calcul pourcentage de jeunes  permanents
  calculPourcentageJeunesPermanent(){
    if(this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.valid && this.descriptionForm.controls.nombreJeunesPermanent.valid ){
      let result =( (this.descriptionForm.controls.nombreJeunesPermanent.value * 100 ) /this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.value);
      this.descriptionForm.controls.pourcentageJeunesPermanent.setValue(result.toFixed(2)+"%");
    }
    else{
      this.descriptionForm.controls.pourcentageJeunesPermanent.setValue('');
    }
  }

  // -------------------- Pourcentage non peramnent------------------------------
  // calcul pourcentage de femmes non permanent
  calculPourcentageFemmesNonPermanent(){

    if(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.valid && this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.valid ){
      let result =( (this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.value * 100 ) /this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value);
      this.descriptionForm.controls.PourentageFemmessNonPermanent.setValue(result.toFixed(2)+"%");
    }
    else{
      this.descriptionForm.controls.PourentageFemmessNonPermanent.setValue('');
    }
  }


  // calcul pourcentage de jeunes nom permanents
  calculPourcentageJeunesNonPermanent(){
    if(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.valid && this.descriptionForm.controls.NombreJeunessNonPermanent.valid ){
      let result =( (this.descriptionForm.controls.NombreJeunessNonPermanent.value * 100 ) /this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value);
      this.descriptionForm.controls.PourcentageJeunessNonPermanent.setValue(result.toFixed(2)+"%");
    }
    else{
      this.descriptionForm.controls.PourcentageJeunessNonPermanent.setValue('');
    }
  }

  bussinessPlanLoad(event:any){

    let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.checkFilePlan = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
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


    }
    this.checkFilePlan = false;
    }else{
      this.checkFilePlan = true;
      //console.log('On y est',this.descriptionForm.controls.bussimessPlan)
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

  /*private setState(param: { openPanel: number }) {

  }*/

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

  checkNombreTotalJeunePermanent() {
   if(this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.value.length ===0){
     this.nombreTotalJeunePermanent = true;

   }else{
     this.nombreTotalFemmePermanent = false;
   }
  }

  checkNombreTotalFemmePermanent() {
    if(this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.value.length ===0){
      this.nombreTotalFemmePermanent = true;
    }else{
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
    this.descriptionForm.controls.nombreJeunesPermanent.addValidators([Validators.max(this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.nombreJeunesPermanent.updateValueAndValidity();
    this.descriptionForm.controls.nombreFemmesPrevuPermanent.addValidators([Validators.max(this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.nombreFemmesPrevuPermanent.updateValueAndValidity();

    if (this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.value && this.descriptionForm.controls.nombreEmploiAdditionnelsPermanent.value > 0) {
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
    this.descriptionForm.controls.NombreJeunessNonPermanent.clearValidators();
    this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.clearValidators();
    this.descriptionForm.controls.NombreJeunessNonPermanent.addValidators([Validators.max(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.NombreJeunessNonPermanent.updateValueAndValidity();
    this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.addValidators([Validators.max(this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.updateValueAndValidity();

    if (this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value && this.descriptionForm.controls.NombreEmploisAdditionnelsNonPermanent.value > 0) {
      if (this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.disabled) {
        this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.enable();
      }
      if (this.descriptionForm.controls.NombreJeunessNonPermanent.disabled) {
        this.descriptionForm.controls.NombreJeunessNonPermanent.enable();
      }
    } else {
      this.descriptionForm.controls.NombreFemmesPrevusNonPermanent.disable();
      this.descriptionForm.controls.NombreJeunessNonPermanent.disable();
    }
  }

  checkTypeFile(tableau: string[],extension: string ){
    return tableau?.indexOf(extension) !== -1;
  }

}

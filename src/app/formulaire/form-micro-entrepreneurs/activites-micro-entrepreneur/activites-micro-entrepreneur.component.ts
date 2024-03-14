import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormMicroEntrepreneursComponent} from "../form-micro-entrepreneurs.component";
import {ZoneGeographiqueService} from "../../../services/configuration/zone-geographique/zone-geographique.service";
import {SecteurActivite} from "../../../model/secteur-activite";
import {SecteurActiviteService} from "../../../services/configuration/secteur-activite/secteur-activite.service";
import {
  TranchAnneeActivitesService
} from "../../../services/configuration/secteur-activite/tranch-annee-activites.service";
import {TranchAnneeActivite} from "../../../model/tranch-annee-activite";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {ZoneGeographique} from "../../../model/zone-geographique";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-activites-micro-entrepreneur',
  templateUrl: './activites-micro-entrepreneur.component.html',
  styleUrls: ['./activites-micro-entrepreneur.component.scss']
})
export class ActivitesMicroEntrepreneurComponent implements OnInit, OnChanges {
  currentStepPosition: number = this.formMicroEntrepreneur.currentStepPosition;
  departements: ZoneGeographique[] = [];
  regions: ZoneGeographique[] = [];
  secteurActivites?: SecteurActivite[];
  tranchAnneeActivites?: TranchAnneeActivite[];
  listeZoneGographique: any [] = [];
  region: string ="";
  submitted: boolean = false;
  submitted2: boolean = false;
  key1= true;
  key2= false;
  nombreEntree: number = 0;
  beneficiaireId: number = 0;


  @Input() descriptionActivite: any;
  @Output() descriptionActiviteChange = new EventEmitter;

  // intialize the FormGroup

  activiteForm = this.fb.group({
    //occupation : ['' , [Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    departement : ['' , Validators.required],
    centreUrbain : ['' , Validators.required],
    chiffreAffaireHorsTaxeAnMois1 : [''],
    chiffreAffaireHorsTaxeAnMois2 : [''],
    secteurActivites : ['', Validators.required ],
    secteurActivites2 : ['',Validators.pattern('[a-zA-Z ]*')],
    nombreEmplois : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    nombreAnneeActivite : [''],
  })

  lotEtape1: string[] = ["departement","centreUrbain","chiffreAffaireHorsTaxeAnMois1","chiffreAffaireHorsTaxeAnMois2"];
  lotEtape2: string[] = ["secteurActivites","secteurActivites2","nombreEmplois","nombreAnneeActivite"];

  constructor(private formMicroEntrepreneur: FormMicroEntrepreneursComponent,
              private zoneGeographique: ZoneGeographiqueService,
              private secteurActiviteService: SecteurActiviteService,
              private tranchAnneeActivitesService: TranchAnneeActivitesService,
              private fb: UntypedFormBuilder,
              private changeDetector : ChangeDetectorRef,
              private notification: NzNotificationService,
              private changeDetectorRef : ChangeDetectorRef,
              private activatedRoute: ActivatedRoute,
              private notificationService : NzNotificationService ,
  ) {
    this.beneficiaireId = activatedRoute.snapshot.params.beneficiaire }


  ngOnInit(): void {
    this.onGetZoneGeographique();
    this.onGetSecteurActivite();
    this.onGetTranchAnneeActivite();

    if(this.descriptionActivite){

      console.log('activite ', this.descriptionActivite);
      if(this.descriptionActivite.departement === 'null')
        this.descriptionActivite.departement = null
      this.region = this.descriptionActivite.region ;
      this.activiteForm.patchValue(
        {
          ...this.descriptionActivite,

        }
      );

      if (this.descriptionActivite.region) {
        this.chargeDepartements(this.descriptionActivite.region);
      }
      // if (this.descriptionActivite.departement) {
      //   console.log(this.chargerRegion(this.descriptionActivite.departement))
      //   this.activiteForm.controls.region.setValue(this.chargerRegion(this.entreprise.departement));
      // }

      this.region = this.descriptionActivite.region ;

    }
    /*   else{
         if( localStorage.getItem('ME_ACTIVITE') != null ){

           let formObject : any  = localStorage.getItem('ME_ACTIVITE')  ;

           this.activiteForm.patchValue({

             ... JSON.parse(formObject)
           });

           this.region = this.descriptionActivite.region ;
         }
       }*/
    this.activiteForm.controls.secteurActivites2.disable();


  }

  ngOnChanges(changes: SimpleChanges) {
    this.controlLabelInstitution;
    if(this.descriptionActivite){
      this.region = this.descriptionActivite.region ;
      this.activiteForm.patchValue(
        {
          ...this.descriptionActivite,

        }
      );
    }
  }

  pre() {
    this.formMicroEntrepreneur.pre()
  }


  next() {
    this.submitted = true;
    this.submitted2 = false;
    if (this.activiteForm.valid && this.nombreEntree !==0){
      this.descriptionActiviteChange.emit({region : this.region , ...this.activiteForm.getRawValue()});

      // LocalStorage

      localStorage.setItem('ME_ACTIVITE', JSON.stringify({ region : this.region ,
        ...this.activiteForm.getRawValue()}));

      // LocalStorage


      // if (this.beneficiaireId === undefined){
      //   this.formMicroEntrepreneur.next();
      // }else {
      //   console.log("=== MAJ ===")
      //   this.formMicroEntrepreneur.sendMeInfoUpdate();
      //   this.notificationService.success('Succés' , 'Vos informations personnelles ont été mis à jour avec succés')
      // }

        this.formMicroEntrepreneur.next();


    }else {
      for (let control of this.lotEtape1) {
        if (this.activiteForm.controls[control].invalid) {
          this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;

        }

      }
      this.key1 = false;
      this.key2 = true;
      if (this.nombreEntree !== 0) {

        for (let control of this.lotEtape2) {
          if (this.activiteForm.controls[control].invalid) {
            this.submitted2 = true;
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");

            return;
          }
        }
      }
    }
    this.nombreEntree ++;


  }

  done() {
    this.formMicroEntrepreneur.done()
  }

  validator() : boolean{
    if(this.activiteForm.valid){
      this.descriptionActiviteChange.emit(this.activiteForm.getRawValue());
      return true ;
    }

    return false ;
  }

  onGetZoneGeographique(){
    this.zoneGeographique.getAll().subscribe(
      (response) => {
        this.listeZoneGographique = response;
        response.forEach(value => {
          if (value.typeZone != null) {
            switch (value.typeZone){
              case 'DEPARTEMENT':
                //  this.departements.push(value);
                break;
              case 'REGION':this.regions.push(value);
                break
            }
          }
        })


        if(this.descriptionActivite){
          // get region matching to the departement
          console.log(this.descriptionActivite.departement);
          if(this.descriptionActivite.departement != null){
            this.region = JSON.stringify(this.listeZoneGographique.filter(
             element =>
                     element.id == JSON.parse(this.descriptionActivite.departement).idParent )[0]);
            this.chargeDepartements(this.region ) ;
          }
        }
      }
    );
  }

  onGetTranchAnneeActivite(){
    this.tranchAnneeActivitesService.getAll().subscribe((response) => {
      this.tranchAnneeActivites = response;
      this.changeDetectorRef.markForCheck();
    })
  }

  onGetSecteurActivite(){
    this.secteurActiviteService.getAll().subscribe((response) => {
      this.secteurActivites = response;
      this.changeDetectorRef.markForCheck();
    })

  }

  convertObject(value: any){
    return JSON.stringify(value)
  }

  chargeDepartements($event:any){

    let reg = JSON.parse($event);
    this.departements = this.listeZoneGographique.filter( it => it.idParent == reg.id && it.typeZone =='DEPARTEMENT');

  }


  // TODO a revoir la region ne s'affiche pas
  chargerRegion(value : any) : any{
    console.log(value)
    let dep = JSON.parse(value)
    if(dep)
      return  this.listeZoneGographique.filter(reg => reg.id == dep.idParent && reg.typeZone == 'REGION' )
    else
      return null
  }


  gestionInstitution() {
    if(JSON.parse(this.activiteForm.controls.secteurActivites.value).libelle == 'Autres : à préciser champ libre') {
      this.activiteForm.controls.secteurActivites2.addValidators(Validators.required);
      this.activiteForm.controls.secteurActivites2.updateValueAndValidity();
      this.activiteForm.controls.secteurActivites.addValidators(Validators.required);
      this.activiteForm.controls.secteurActivites.updateValueAndValidity();

    }
    else{
      this.activiteForm.controls.secteurActivites2.removeValidators(Validators.required);
      this.activiteForm.controls.secteurActivites2.updateValueAndValidity();
    }

    if(JSON.parse(this.activiteForm.controls.secteurActivites.value).libelle == 'Autres : à préciser champ libre') {
      this.activiteForm.controls.secteurActivites2.addValidators(Validators.required);
      this.activiteForm.controls.secteurActivites2.updateValueAndValidity();
      this.activiteForm.controls.secteurActivites2.enable();

    }
    else {
      this.activiteForm.controls.secteurActivites2.disable();
      this.activiteForm.controls.secteurActivites2.setValue('');
    }

  }

  controlLabelInstitution(){
    let etat: boolean = false;

    if(this.activiteForm.controls.secteurActivites.value) {
      if (JSON.parse(this.activiteForm.controls.secteurActivites.value).libelle == 'Autres : à préciser champ libre') {
        etat = true;

      }
    }
    return etat;
  }
}

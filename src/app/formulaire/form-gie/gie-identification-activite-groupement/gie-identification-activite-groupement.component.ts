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
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {FormGieComponent} from "../form-gie.component";
import {SecteurActiviteService} from "../../../services/configuration/secteur-activite/secteur-activite.service";
import {SecteurActivite} from "../../../model/secteur-activite";
import {
  TrancheAnneeActiviteService
} from "../../../services/configuration/tranche-annee-activite/tranche-annee-activite.service";
import {TrancheNombreAnneeActivite} from "../../../model/tranche-nombre-annee-activite";
import {TranchePersonneService} from "../../../services/configuration/tranche-personne/tranche-personne.service";
import {TrancheNombrePersonne} from "../../../model/tranche-nombre-personne";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {CurrencyPipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-gie-identification-activite-groupement',
  templateUrl: './gie-identification-activite-groupement.component.html',
  styleUrls: ['./gie-identification-activite-groupement.component.scss']
})
export class GieIdentificationActiviteGroupementComponent implements OnInit, OnChanges {
  currentStepPosition: number = this.formGieComponent.currentStepPosition;

  @Input() activiteInfo : any ;
  @Output() activiteInfoChange = new EventEmitter<any>();

  secteurActivites?: SecteurActivite[];
  secteurActivite?: SecteurActivite;
  tranchAnneeActivites?: TrancheNombreAnneeActivite[];
  tranchAnneeActivite?: TrancheNombreAnneeActivite;
  trancheNombrePersonnes?: TrancheNombrePersonne[];
  trancheNombrePersonne?: TrancheNombrePersonne;
  pattern: string | RegExp | undefined
  pourcentageFemmeNonPermanent: any;
  pourcentageFemmePermanent: any;
  pourcentageJeunePermanent: any;
  pourcentageJeuneNonPermanent: any;
  fieldrenseigne: boolean = false;
  submitted: boolean = false;
  submitted2: boolean = false;
  submitted3: boolean = false;
  nombreTotalFemmePermanent: boolean = false;
  nombreTotalJeunePermanent: boolean = false;
  nombreTotalFemmeNonPermanent: boolean = false;
  nombreTotalJeuneNonPermanent: boolean = false;

  key1= true;
  key2= false;
  key3= false;
  nombreEntree: number = 0;
  nombrecollapes =3;
  beneficiaireId: number = 0;

  constructor(private formGieComponent: FormGieComponent,
              private fb : UntypedFormBuilder,
              private changeDetector : ChangeDetectorRef,
              private secteurActiviteService: SecteurActiviteService,
              private tranchAnneeActivitesService: TrancheAnneeActiviteService,
              private tranchePersonneService: TranchePersonneService,
              private notification: NzNotificationService,
              private currencyPipe: CurrencyPipe,
              private activatedRoute: ActivatedRoute,
              private changeDetectorRef : ChangeDetectorRef) {
    this.beneficiaireId = activatedRoute.snapshot.params.beneficiaire
  }

  activiteForm = this.fb.group({
    secteurActivite : ['' , Validators.required],
    secteurActiviteAutre : [''],
    nombreAnneeActivite : ['' , Validators.required],
    revenuTotalGroupement2019 : [''],
    revenuTotalGroupement2020 : ['' , Validators.required],
    membreIndividuelGroupement : [''],
    nombreExactADate : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    nombreFemmePermanent : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    pourcentageFemmePermanent : [''],
    nombreJeunePermanent : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    pourcentageJeunesPermanent : [''],
    membreNonPermanent : [''],
    nombreExactADateNonPermanent  : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    nombreFemmeNonPermanent  : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    pourcentageFemmeNonPermanent  : [''],
    nombreJeuneNonPermanent : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    pourcentageJeunesNonPermanent  : [''],
    revenuMembreBasGroupement  : ['' , [Validators.required, Validators.pattern('^[0-9\\s]*$')]],
    revenuMoyenGroupement  : ['' , [Validators.required, Validators.pattern('^[0-9\\s]*$')]],
    nombrePersonneChargeMoyenneParMembre : ['' , Validators.required]
  })
  lotEtape1: string[] = ["secteurActivite","secteurActiviteAutre","nombreAnneeActivite","revenuTotalGroupement2019","revenuTotalGroupement2020"];
  lotEtape2: string[] = ["membreIndividuelGroupement","nombreExactADate","nombreFemmePermanent","pourcentageFemmePermanent","nombreJeunePermanent","pourcentageJeunesPermanent"];
  lotEtape3: string[] = ["membreNonPermanent","nombreExactADateNonPermanent","nombreFemmeNonPermanent","pourcentageFemmeNonPermanent","nombreJeuneNonPermanent","pourcentageJeunesNonPermanent","revenuMembreBasGroupement","revenuMoyenGroupement","nombrePersonneChargeMoyenneParMembre"];

  ngOnInit(): void {
    this.onGetSecteurActivite();
    this.onGetTranchAnneeActivite();
    this.onGetTrancheNombrePersonne();
    console.log('thiak thiak organique ', this.activiteInfo)
    if (this.activiteInfo){
      this.activiteForm.patchValue({...this.activiteInfo})
      this.activiteForm.controls.nombrePersonneChargeMoyenneParMembre.setValue(JSON.stringify(this.activiteInfo.nombrePersonneChargeMoyenneParMembre));
      this.formatNumber();
    }

    this.activiteForm.updateValueAndValidity();

    this.changeDetector.markForCheck();

    this.activiteForm.controls.pourcentageFemmePermanent.disable()
    this.activiteForm.controls.pourcentageJeunesNonPermanent.disable()
    this.activiteForm.controls.pourcentageFemmeNonPermanent.disable()
    this.activiteForm.controls.pourcentageJeunesPermanent.disable()
    this.activiteForm.controls.secteurActiviteAutre.disable();

  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('thiak thiak organique ', this.activiteInfo)
    // if (this.activiteInfo){
    //   this.activiteForm.patchValue({...this.activiteInfo})
    // }
  }

  pre() {
    this.formGieComponent.pre();
  }


  next() {
    this.submitted = true;
    this.submitted2 = false;
    this.submitted3 = false;
    if (this.activiteForm.valid && this.nombreEntree === this.nombrecollapes - 1 ){
      this.activiteInfoChange.emit(this.activiteForm.getRawValue())
      this.formGieComponent.next();
      /*if (this.beneficiaireId === undefined){
        this.formGieComponent.next();
      }else {
        console.log("=== MAJ ===")
        this.formGieComponent.sendGieInfoUpdate();
      }*/

    }else {
      if (this.nombreEntree === this.nombrecollapes -3) {
        for (let control of this.lotEtape1) {
          if (this.activiteForm.controls[control].invalid) {
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
            return;
          }
        }
        this.key1 = false;
        this.key2 = true;
        this.key3 = false;
      }
      if (this.nombreEntree === this.nombrecollapes -2) {
        for (let control of this.lotEtape2) {
          if (this.activiteForm.controls[control].invalid) {
            this.submitted2 = true;
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
            return;
          }
        }
        this.key1 = false;
        this.key2 = false;
        this.key3 = true;
      }
      if (this.nombreEntree === this.nombrecollapes -1) {
        for (let control of this.lotEtape3) {
          if (this.activiteForm.controls[control].invalid) {
            this.submitted3 = true;
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
            return;
          }
        }
      }
    }
    this.nombreEntree ++;
  }

  done() {
    this.formGieComponent.done()
  }

  convertToString(value : any ){
    return JSON.stringify(value);
  }

  onGetSecteurActivite(){
    this.secteurActiviteService.getAll().subscribe((response) => {
      this.secteurActivites = response;
      this.changeDetectorRef.markForCheck();
    })
  }

  onGetTranchAnneeActivite(){
    this.tranchAnneeActivitesService.getAll().subscribe((response) => {
      this.tranchAnneeActivites = response;
      this.changeDetectorRef.markForCheck();
    })
  }

  onGetTrancheNombrePersonne(){
    this.tranchePersonneService.getAll().subscribe((response) =>{
      this.trancheNombrePersonnes = response;
      this.changeDetectorRef.markForCheck();
    })
  }

  calculPourcentageFemmePermanent() {
    if(this.activiteForm.controls.nombreFemmePermanent.valid && this.activiteForm.controls.nombreExactADate.valid ) {
      let result = ((this.activiteForm.controls.nombreFemmePermanent.value * 100) / this.activiteForm.controls.nombreExactADate.value).toFixed(2)
      this.activiteForm.controls.pourcentageFemmePermanent.setValue(result);
    }else {
      this.activiteForm.controls.pourcentageFemmePermanent.setValue('');
    }
  }

  calculPourcentageFemmeNonPermanent() {
    if(this.activiteForm.controls.nombreFemmeNonPermanent.valid && this.activiteForm.controls.nombreExactADateNonPermanent.valid ) {
      let result = ((this.activiteForm.controls.nombreFemmeNonPermanent.value * 100) / this.activiteForm.controls.nombreExactADateNonPermanent.value).toFixed(2)
      this.activiteForm.controls.pourcentageFemmeNonPermanent.setValue(result)
    }else {
      this.activiteForm.controls.pourcentageFemmeNonPermanent.setValue('');
    }
  }

  calculPourcentageJeunePermanent() {
    if(this.activiteForm.controls.nombreJeunePermanent.valid && this.activiteForm.controls.nombreExactADate.valid ) {
      let result = ((this.activiteForm.controls.nombreJeunePermanent.value * 100) / this.activiteForm.controls.nombreExactADate.value).toFixed(2)
      this.activiteForm.controls.pourcentageJeunesPermanent.setValue(result);
    }else {
      this.activiteForm.controls.pourcentageJeunesPermanent.setValue('');
    }
  }

  calculPourcentageJeuneNonPermanent() {
    if (this.activiteForm.controls.nombreJeuneNonPermanent.valid && this.activiteForm.controls.nombreExactADateNonPermanent.valid) {
      let result = ((this.activiteForm.controls.nombreJeuneNonPermanent.value * 100) / this.activiteForm.controls.nombreExactADateNonPermanent.value).toFixed(2)
      this.activiteForm.controls.pourcentageJeunesNonPermanent.setValue(result);
    } else {
      this.activiteForm.controls.pourcentageJeunesNonPermanent.setValue('');
    }
  }

  checkNombreTotalJeunePermanent() {
    this.nombreTotalJeunePermanent = this.activiteForm.controls.nombreExactADate.value.length === 0;
  }
  checkNombreTotalFemmePermanent() {
    this.nombreTotalFemmePermanent = this.activiteForm.controls.nombreExactADate.value.length === 0;
  }

  checkNombreTotalFemmeNonPermanent() {
    this.nombreTotalFemmeNonPermanent = this.activiteForm.controls.nombreExactADateNonPermanent.value.length === 0;
  }
  checkNombreTotalJeuneNonPermanent() {
    this.nombreTotalJeuneNonPermanent = this.activiteForm.controls.nombreExactADateNonPermanent.value.length === 0;
  }

  checkLimitInputsPermanent() {
    this.nombreTotalFemmePermanent =false;
    this.nombreTotalJeunePermanent =false;
    this.activiteForm.controls.nombreJeunePermanent.clearValidators();
    this.activiteForm.controls.nombreFemmePermanent.clearValidators();
    this.activiteForm.controls.nombreJeunePermanent.addValidators([Validators.min(0), Validators.max(this.activiteForm.controls.nombreExactADate.value), Validators.required]);
    this.activiteForm.controls.nombreJeunePermanent.updateValueAndValidity();
    this.activiteForm.controls.nombreFemmePermanent.addValidators([Validators.min(0), Validators.max(this.activiteForm.controls.nombreExactADate.value), Validators.required]);
    this.activiteForm.controls.nombreFemmePermanent.updateValueAndValidity();


  }

  checkLimitInputsNonPermanent() {
    this.nombreTotalFemmeNonPermanent =false;
    this.nombreTotalJeuneNonPermanent =false;
    this.activiteForm.controls.nombreJeuneNonPermanent.clearValidators();
    this.activiteForm.controls.nombreFemmeNonPermanent.clearValidators();
    this.activiteForm.controls.nombreJeuneNonPermanent.addValidators([Validators.min(0), Validators.max(this.activiteForm.controls.nombreExactADateNonPermanent.value), Validators.required]);
    this.activiteForm.controls.nombreJeuneNonPermanent.updateValueAndValidity();
    this.activiteForm.controls.nombreFemmeNonPermanent.addValidators([Validators.min(0), Validators.max(this.activiteForm.controls.nombreExactADateNonPermanent.value), Validators.required]);
    this.activiteForm.controls.nombreFemmeNonPermanent.updateValueAndValidity();

  }
  controlLabelInstitution(){
    let etat: boolean = false;
    if(this.activiteForm.controls.secteurActivite.value) {
      if (JSON.parse(this.activiteForm.controls.secteurActivite.value).libelle == 'Autres : à préciser champ libre') {
        etat = true;
      }
    }
    return etat;
  }
  gestionInstitution() {

    if(JSON.parse(this.activiteForm.controls.secteurActivite.value).libelle== 'Autres : à préciser champ libre') {
      this.activiteForm.controls.secteurActiviteAutre.addValidators(Validators.required);
      this.activiteForm.controls.secteurActiviteAutre.updateValueAndValidity();
      this.activiteForm.controls.secteurActiviteAutre.enable();
    }else {
      this.activiteForm.controls.secteurActiviteAutre.setValidators([]);
      this.activiteForm.controls.secteurActiviteAutre.updateValueAndValidity();
      this.activiteForm.controls.secteurActiviteAutre.disable();
      this.activiteForm.controls.secteurActiviteAutre.setValue('');
    }

  }

  formatNumber() {
    let amount = this.currencyPipe.transform((this.activiteForm.controls.revenuMembreBasGroupement.value)?.toString().replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.activiteForm.controls.revenuMembreBasGroupement.setValue(amount)

    let amount1 = this.currencyPipe.transform((this.activiteForm.controls.revenuMoyenGroupement.value)?.toString().replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.activiteForm.controls.revenuMoyenGroupement.setValue(amount1)
  }

  controlLabelChiffreAffaire() {
    let etat: boolean = true;
    if (this.activiteForm.controls.nombreAnneeActivite.value){
      let annee = JSON.parse(this.activiteForm.controls.nombreAnneeActivite.value).libelle
      etat = annee != 'Moins d\'un an';
    }
    return etat;
  }

  controlChiffreAffaire() {
    if (this.activiteForm.controls.nombreAnneeActivite.value){
      let annee = JSON.parse(this.activiteForm.controls.nombreAnneeActivite.value).libelle
      if (annee ==='Moins d\'un an'){
        this.activiteForm.controls.revenuTotalGroupement2020.removeValidators(Validators.required)
        this.activiteForm.controls.revenuTotalGroupement2020.updateValueAndValidity()
      }else{
        this.activiteForm.controls.revenuTotalGroupement2020.addValidators(Validators.required)
        this.activiteForm.controls.revenuTotalGroupement2020.updateValueAndValidity()
      }
    }
  }
}

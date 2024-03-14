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
import {FormEntrepriseComponent} from "../form-entreprise.component";
import {SecteurActiviteService} from "../../../services/configuration/secteur-activite/secteur-activite.service";
import {SecteurActivite} from "../../../model/secteur-activite";
import {ZoneGeographiqueService} from "../../../services/configuration/zone-geographique/zone-geographique.service";
import {TranchAnneeActivite} from "../../../model/tranch-annee-activite";
import {
  TranchAnneeActivitesService
} from "../../../services/configuration/secteur-activite/tranch-annee-activites.service";
import {TrancheNombrePersonne} from "../../../model/tranche-nombre-personne";
import {TranchePersonneService} from "../../../services/configuration/tranche-personne/tranche-personne.service";
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {FileService} from 'src/app/services/file/file.service';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {CurrencyPipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment.dev";
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";
import {NzModalService} from "ng-zorro-antd/modal";
import {ZoneGeographique} from "../../../model/zone-geographique";

@Component({
  selector: 'app-description-activite-entreprise',
  templateUrl: './description-activite-entreprise.component.html',
  styleUrls: ['./description-activite-entreprise.component.scss']
})
export class DescriptionActiviteEntrepriseComponent implements OnInit, OnChanges {
  currentStepPosition: number = this.formEntrepriseComponent.currentStepPosition;
  secteurActivites?: SecteurActivite[];
  departements: any[] = [];
  regions: ZoneGeographique[] = [];
  region: string = "";
  listeZoneGographique: any [] = [];
  tranchAnneeActivites?: TranchAnneeActivite[];
  trancheNombrePersonnes?: TrancheNombrePersonne[];
  disabled = true;
  submitted2: boolean = false;
  submitted3: boolean = false;
  key1 = true;
  key2 = false;
  key3 = false;
  checkEtatFinSize19: boolean = true;
  checkEtatFinSize20: boolean = true;
  nombreEntree: number = 0;
  nombrecollapes = 3;
  nombreTotalFemmePermanent: boolean = false;
  nombreTotalJeunePermanent: boolean = false;
  nombreTotalFemmeNonPermanent: boolean = false;
  nombreTotalJeuneNonPermanent: boolean = false;
  checkFileActuel = false;
  checkFilePrecedent = false;

  @Input() activite: any;
  @Output() activiteChange = new EventEmitter<any>();


  activiteForm = this.fb.group({
    secteurActivite: ['', Validators.required],
    departement: [''],
    region: [''],
    centreUrbain: ['', Validators.required],
    secteurActiviteAutre: [''],
    nombreAnneeActivite: ['', Validators.required],
    revenuTotalGroupement2019: [''],
    revenuTotalGroupement2020: ['', [Validators.pattern('^[0-9\\s]*$')]],
    etatFinancier2019: [''],
    etatFinancier2020: [''],
    employePermanent: [''],
    nombreExactADate: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    nombreFemmePermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    pourcentageFemmePermanent: [''],
    nombreJeunePermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    pourcentageJeunesPermanent: [''],
    membreNonPermanent: [''],
    nombreExactADateNonPermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    nombreFemmeNonPermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    pourcentageFemmeNonPermanent: [''],
    nombreJeuneNonPermanent: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    pourcentageJeunesNonPermanent: [''],
    revenuMembreBasGroupement: ['', [Validators.required, Validators.pattern('^[0-9\\s]*$')]],
    revenuMoyenGroupement: ['', [Validators.required, Validators.pattern('^[0-9\\s]*$')]],
    // nombrePersonneChargeMoyenneParMembre : ['' , Validators.required]
  });
  lotEtape1: string[] = ["secteurActivite", "departement", "region", "centreUrbain", "secteurActiviteAutre", "nombreAnneeActivite", "revenuTotalGroupement2019", "revenuTotalGroupement2020"];
  lotEtape2: string[] = ["etatFinancier2019", "etatFinancier2020", "employePermanent", "nombreExactADate", "nombreFemmePermanent", "pourcentageFemmePermanent", "nombreJeunePermanent", "pourcentageJeunesPermanent"];
  lotEtape3: string[] = ["membreNonPermanent", "nombreExactADateNonPermanent", "nombreFemmeNonPermanent", "pourcentageFemmeNonPermanent", "nombreJeuneNonPermanent", "pourcentageJeunesNonPermanent", "revenuMembreBasGroupement", "revenuMoyenGroupement"];

  etatFinancier2019Nom: any;
  etatFinancier2020Nom: any;


  submitted: boolean = false;
  beneficiaireId: any;

  constructor(private formEntrepriseComponent: FormEntrepriseComponent,
              private secteurActiviteService: SecteurActiviteService,
              private zoneGeographique: ZoneGeographiqueService,
              private tranchAnneeActivitesService: TranchAnneeActivitesService,
              private tranchePersonneService: TranchePersonneService,
              private fb: UntypedFormBuilder,
              private modalService: NzModalService,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private changeDetector: ChangeDetectorRef,
              private notificationService: NzNotificationService,
              private notification: NzNotificationService,
              private currencyPipe: CurrencyPipe,
              private activatedRoute: ActivatedRoute) {
    this.beneficiaireId = this.activatedRoute.snapshot.params.beneficiaire
  }

  ngOnInit(): void {
    this.onGetAllSecteurActivite()
    this.onGetZoneGeographique()
    this.onGetTranchAnneeActivite();
    this.onGetTrancheNombrePersonne();
    this.activiteForm.controls.secteurActiviteAutre.disable();
    this.activiteForm.controls.revenuTotalGroupement2019.disable();

    if (this.activite) {

      if(this.activite.departement === 'null')
        this.activite.departement = null
      this.region = this.activite.region
      this.activiteForm.patchValue({
          ...this.activite
        }
      );

      if (this.activite.region) {
        this.chargeDepartements(this.activite.region);
      }
      this.etatFinancier2019Nom = this.activite.etatFinancier2019Nom;
      this.etatFinancier2020Nom = this.activite.etatFinancier2020Nom;

      this.region = this.activite.region ;
      // case of update
      if (this.beneficiaireId) {

        this.etatFinancier2019Nom = this.activite.etatFinancier2019;
        this.etatFinancier2020Nom = this.activite.etatFinancier2020;


      }


      // this.activiteForm.controls.region.setValue(this.activite.region);
      // this.activiteForm.controls.region.updateValueAndValidity({
      //   onlySelf: false,
      //   emitEvent: true
      // });

      this.changeDetector.markForCheck();

      // if (this.activite.region) {
      //   this.chargeDepartements(this.activite.region);
      // }

      //console.log(this.departements);


      // this.activiteForm.controls.departement.setValue(this.activite.departement)
      // this.activiteForm.controls.departement.updateValueAndValidity({
      //   onlySelf: true,
      //   emitEvent: true
      // });
      this.formatNumberetatFinancier();
      this.formatSalaireBas();
      this.formatSalaireMoyen();
      console.log(this.activiteForm)
    }


    // disable some form controls
    this.activiteForm.controls.pourcentageFemmePermanent.disable();
    this.activiteForm.controls.pourcentageJeunesPermanent.disable();


    this.activiteForm.controls.pourcentageFemmeNonPermanent.disable();
    this.activiteForm.controls.pourcentageJeunesNonPermanent.disable();

    // disable some form controls

    this.checkEtatFinSize19 = true;
    this.checkEtatFinSize20 = true;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.activite) {
      this.region = this.activite.region ;
      this.activiteForm.patchValue({
          ...this.activite
        }
      );

      //this.formatNumber();

      this.etatFinancier2019Nom = this.activite.etatFinancier2019Nom;
      this.etatFinancier2020Nom = this.activite.etatFinancier2020Nom;

      // this.activiteForm.controls.region.setValue(this.activite.region);
      // this.activiteForm.controls.region.updateValueAndValidity({
      //   onlySelf: false,
      //   emitEvent: true
      // });

      this.changeDetector.markForCheck();

      // if (this.activite.region) {
      //   this.chargeDepartements(this.activite.region);
      // }

      // console.log(this.departements);


      // this.activiteForm.controls.departement.setValue(this.activite.departement)
      // this.activiteForm.controls.departement.updateValueAndValidity({
      //   onlySelf: true,
      //   emitEvent: true
      // });

    }


    // disable some form controls
    this.activiteForm.controls.pourcentageFemmePermanent.disable();
    this.activiteForm.controls.pourcentageJeunesPermanent.disable();


    this.activiteForm.controls.pourcentageFemmeNonPermanent.disable();
    this.activiteForm.controls.pourcentageJeunesNonPermanent.disable();

    this.controlChiffreAffaire()
  }

  /*compareRegion(item1: ZoneGeographique, item2: ZoneGeographique ): boolean{
    return item1 && item2? item1.idParent == item2.idParent: item1 == item2
  }

  compareDepartement(item1: ZoneGeographique, item2: ZoneGeographique ): boolean{
    return item1 && item2? item1.id == item2.id: item1 == item2
  }*/

  pre() {
    this.formEntrepriseComponent.pre();
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    this.submitted3 = false;
    if (this.activiteForm.valid && (this.nombreEntree === this.nombrecollapes - 1)) {
      this.activiteChange.emit({region : this.region,
        etatFinancier2019Nom: this.etatFinancier2019Nom, etatFinancier2020Nom: this.etatFinancier2020Nom,
        ...this.activiteForm.getRawValue()
      });
      //this.formEntrepriseComponent.next();

      localStorage.setItem('PME_ACTIVITE', JSON.stringify({ region : this.region ,
        ...this.activiteForm.getRawValue()}));

      this.formEntrepriseComponent.next();


    } else {
      if (this.nombreEntree === this.nombrecollapes - 3) {
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
      if (this.nombreEntree === this.nombrecollapes - 2) {

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
      if (this.nombreEntree === this.nombrecollapes - 1) {

        for (let control of this.lotEtape3) {
          if (this.activiteForm.controls[control].invalid) {
            this.submitted3 = true;
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");

            return;
          }
        }

      }
    }
    this.nombreEntree++;
  }

  done() {
    this.formEntrepriseComponent.done()
  }

  onGetAllSecteurActivite() {
    this.secteurActiviteService.getAll().subscribe((response) => {
      this.secteurActivites = response;
      this.changeDetector.markForCheck();
    })
  }

  onGetZoneGeographique() {
    this.zoneGeographique.getAll().subscribe(
      (response) => {
        this.listeZoneGographique = response;
        response.forEach(value => {
          if (value.typeZone != null) {
            switch (value.typeZone) {
              case 'DEPARTEMENT':
                  //this.departements.push(value);
                break;
              case 'REGION':
                this.regions.push(value);
                break
            }
          }
        })

        // Si le client clique sur precedent
        // on charge les departements automatiquement pour mettre
        // la valeur qui existait
        if(this.activite){
          // get region matching to the departement
          console.log(this.activite.departement);
          if(this.activite.departement != null){
            this.region = JSON.stringify(this.listeZoneGographique.filter(
              element =>
                element.id == JSON.parse(this.activite.departement).idParent )[0]);



            this.chargeDepartements(this.region ) ;
          }
        }

      }
    );
    this.changeDetector.markForCheck();
  }

  onGetTranchAnneeActivite() {
    this.tranchAnneeActivitesService.getAll().subscribe((response) => {
      this.tranchAnneeActivites = response;
      this.changeDetector.markForCheck();
    })
  }

  onGetTrancheNombrePersonne() {
    this.tranchePersonneService.getAll().subscribe((response) => {
      this.trancheNombrePersonnes = response;
      this.changeDetector.markForCheck();
    })
  }

  removeFichier(value: string, type: '19' | '20') {
    console.log(value);
    this.modalService.confirm({
      nzTitle: 'Confirmer le retrait',
      nzOkText: 'Retirer',
      nzContent: `Etes vous sûr de vouloir retirer le document ${value.slice(value.lastIndexOf('_') + 1)}`,
      nzOnOk: () => {
        if (type === '19') {
          this.etatFinancier2019Nom = '';
          this.activiteForm.controls.etatFinancier2019.setValue('');
        } else if (type === '20') {
          this.etatFinancier2020Nom = '';
          this.activiteForm.controls.etatFinancier2020.setValue('');

        } else {
          throw new Error('Veuillez revoir les paramètres de la fonction');
        }

      }
    });

  }

  loadetatFinancier2019(event: any) {

    let tableau: string[] = ['pdf', 'doc', 'docx', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'jpg', 'jpeg'];
    this.checkFilePrecedent = false;
    if (this.checkTypeFile(tableau, event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;

        this.checkEtatFinSize19 = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkEtatFinSize19) {
          const formData = new FormData();
          formData.append('file', file);
          this.fileService.save(formData, 'ETATFINANCIER').subscribe(
            response => {
              this.etatFinancier2019Nom = response.reponse;
              this.activiteForm.patchValue({
                etatFinancier2019: this.etatFinancier2019Nom
              })
            },
            () => {
              this.activiteForm.controls.etatFinancier2019.setValue('');
              this.modalService.error({
                nzTitle: 'Erreur de chargement',
                nzContent: 'Veuillez revoir votre connexion'
              });
            }
          )
        } else {
          console.log("Fichier trop lourd !!!!!");
          this.activiteForm.controls.etatFinancier2019.setValue('');
        }


      }
      this.checkFilePrecedent = false;
    } else {
      this.checkFilePrecedent = true;
      this.activiteForm.controls.etatFinancier2019.setValue('');
    }
  }

  convertToString(value: any) {
    return JSON.stringify(value);
  }


  loadetatFinancier2020(event: any) {

    let tableau: string[] = ['pdf', 'doc', 'docx', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'jpg', 'jpeg', 'png'];
    this.checkFileActuel = false;
    if (this.checkTypeFile(tableau, event.target.files[0].name.split('.').pop())) {
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;

        this.checkEtatFinSize20 = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkEtatFinSize20) {
          const formData = new FormData();
          formData.append('file', file);
          this.fileService.save(formData, 'ETATFINANCIER').subscribe(
            response => {
              this.etatFinancier2020Nom = response.reponse;
              this.activiteForm.patchValue({
                etatFinancier2020: this.etatFinancier2020Nom
              })
            },
            () => {
              this.activiteForm.controls.etatFinancier2020.setValue('');
              this.modalService.error({
                nzTitle: 'Erreur de chargement',
                nzContent: 'Veuillez revoir votre connexion'
              });
            }
          )
        } else {
          console.log("Fichier trop lourd !!!!!");
          this.activiteForm.controls.etatFinancier2020.setValue('');
        }

      }
      this.checkFileActuel = false;
    } else {
      this.checkFileActuel = true;
      this.activiteForm.controls.etatFinancier2020.setValue('');
    }
  }

  chargeDepartements($event?: any) {
    if ($event) {
      let reg = JSON.parse($event);
      this.departements = this.listeZoneGographique.filter(it => it.idParent == reg.id && it.typeZone == 'DEPARTEMENT');
    }

  }


  // calculpourcentage de femmes  permanent
  calculPourcentageFemmePermanent() {
    if (this.activiteForm.controls.nombreExactADate.valid && this.activiteForm.controls.nombreFemmePermanent.valid) {
      let result = ((this.activiteForm.controls.nombreFemmePermanent.value * 100) / this.activiteForm.controls.nombreExactADate.value);
      this.activiteForm.controls.pourcentageFemmePermanent.setValue(result.toFixed(2));
    } else {
      this.activiteForm.controls.pourcentageFemmePermanent.setValue('');
    }
  }


  // calcul pourcentage de jeunes  permanents
  calculPourcentageJeunesPermanent() {
    if (this.activiteForm.controls.nombreExactADate.valid && this.activiteForm.controls.nombreJeunePermanent.valid) {
      let result = ((this.activiteForm.controls.nombreJeunePermanent.value * 100) / this.activiteForm.controls.nombreExactADate.value);
      this.activiteForm.controls.pourcentageJeunesPermanent.setValue(result.toFixed(2));
    } else {
      this.activiteForm.controls.pourcentageJeunesPermanent.setValue('');
    }
  }

  // -------------------- Pourcentage non peramnent------------------------------
  // calcul pourcentage de femmes non permanent
  calculPourcentageFemmeNonPermanent() {
    if (this.activiteForm.controls.nombreExactADateNonPermanent.valid && this.activiteForm.controls.nombreFemmeNonPermanent.valid) {
      let result = ((this.activiteForm.controls.nombreFemmeNonPermanent.value * 100) / this.activiteForm.controls.nombreExactADateNonPermanent.value);
      this.activiteForm.controls.pourcentageFemmeNonPermanent.setValue(result.toFixed(2));
    } else {
      this.activiteForm.controls.pourcentageFemmeNonPermanent.setValue('');
    }
  }


  // calcul pourcentage de jeunes nom permanents
  baseUrlFile = environment.baseUrlFile;

  calculPourcentageJeunesNonPermanent() {
    if (this.activiteForm.controls.nombreExactADateNonPermanent.valid && this.activiteForm.controls.nombreJeuneNonPermanent.valid) {
      let result = ((this.activiteForm.controls.nombreJeuneNonPermanent.value * 100) / this.activiteForm.controls.nombreExactADateNonPermanent.value);
      this.activiteForm.controls.pourcentageJeunesNonPermanent.setValue(result.toFixed(2));
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
    this.nombreTotalFemmePermanent = false;
    this.nombreTotalJeunePermanent = false;
    this.activiteForm.controls.nombreJeunePermanent.clearValidators();
    this.activiteForm.controls.nombreFemmePermanent.clearValidators();
    this.activiteForm.controls.nombreJeunePermanent.addValidators([Validators.min(0), Validators.max(this.activiteForm.controls.nombreExactADate.value), Validators.required]);
    this.activiteForm.controls.nombreJeunePermanent.updateValueAndValidity();
    this.activiteForm.controls.nombreFemmePermanent.addValidators([Validators.min(0), Validators.max(this.activiteForm.controls.nombreExactADate.value), Validators.required]);
    this.activiteForm.controls.nombreFemmePermanent.updateValueAndValidity();


  }

  checkLimitInputsNonPermanent() {
    this.nombreTotalFemmeNonPermanent = false;
    this.nombreTotalJeuneNonPermanent = false;
    this.activiteForm.controls.nombreJeuneNonPermanent.clearValidators();
    this.activiteForm.controls.nombreFemmeNonPermanent.clearValidators();
    this.activiteForm.controls.nombreJeuneNonPermanent.addValidators([Validators.min(0), Validators.max(this.activiteForm.controls.nombreExactADateNonPermanent.value), Validators.required]);
    this.activiteForm.controls.nombreJeuneNonPermanent.updateValueAndValidity();
    this.activiteForm.controls.nombreFemmeNonPermanent.addValidators([Validators.min(0), Validators.max(this.activiteForm.controls.nombreExactADateNonPermanent.value), Validators.required]);
    this.activiteForm.controls.nombreFemmeNonPermanent.updateValueAndValidity();

  }

  controlLabelInstitution() {
    let etat: boolean = false;
    if (this.activiteForm.controls.secteurActivite.value) {
      //     if(this.activiteForm.controls.secteurActivite.value.length < 1) {
      if (JSON.parse(this.activiteForm.controls.secteurActivite.value).libelle == 'Autres : à préciser champ libre') {
        etat = true;
      }
      //     }
    }
    return etat;
  }

  gestionInstitution() {
    if (this.activiteForm.controls.secteurActivite.value) {
      if (JSON.parse(this.activiteForm.controls.secteurActivite.value).libelle == 'Autres : à préciser champ libre') {
        this.activiteForm.controls.secteurActiviteAutre.addValidators(Validators.required);
        this.activiteForm.controls.secteurActiviteAutre.updateValueAndValidity();
      } else {
        this.activiteForm.controls.secteurActiviteAutre.removeValidators(Validators.required);
        this.activiteForm.controls.secteurActiviteAutre.updateValueAndValidity();
      }
    }

    if (JSON.parse(this.activiteForm.controls.secteurActivite.value).libelle == 'Autres : à préciser champ libre') {
      this.activiteForm.controls.secteurActiviteAutre.addValidators(Validators.required);
      this.activiteForm.controls.secteurActiviteAutre.updateValueAndValidity();
      this.activiteForm.controls.secteurActiviteAutre.enable();

    } else {
      this.activiteForm.controls.secteurActiviteAutre.disable();
      this.activiteForm.controls.secteurActiviteAutre.setValue('');
    }
  }


  checkTypeFile(tableau: string[], extension: string) {
    return tableau?.indexOf(extension) !== -1;
  }

  formatSalaireBas() {
    let amounte = this.currencyPipe.transform((this.activiteForm.controls.revenuMembreBasGroupement.value).toString()?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')?.trim()
    if (amounte)
    this.activiteForm.controls.revenuMembreBasGroupement.setValue(amounte.toString())
    console.log(amounte)
  }

  formatSalaireMoyen() {
    let amount1 = this.currencyPipe.transform((this.activiteForm.controls.revenuMoyenGroupement.value).toString()?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    if (amount1)
    this.activiteForm.controls.revenuMoyenGroupement.setValue(amount1.toString())
    console.log(amount1)
  }

  formatNumberetatFinancier() {
    let amount = this.currencyPipe.transform((this.activiteForm.controls.revenuTotalGroupement2020.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.activiteForm.controls.revenuTotalGroupement2020.setValue(amount)
    console.log(amount)
  }

  /*controlLabelChiffreAffaire() {
    let etat: boolean = true;
    if (this.activiteForm.controls.nombreAnneeActivite.value){
      let annee = JSON.parse(this.activiteForm.controls.nombreAnneeActivite.value).libelle
      etat = annee != 'Moins d\'un an';
    }
    return etat;
  }*/

  controlChiffreAffaire() {
    if (this.activiteForm.controls.nombreAnneeActivite.value) {
      let annee = JSON.parse(this.activiteForm.controls.nombreAnneeActivite.value).libelle
      if (annee != 'Moins d\'un an') {
        this.activiteForm.controls.revenuTotalGroupement2020.removeValidators(Validators.required)
        this.activiteForm.controls.revenuTotalGroupement2020.updateValueAndValidity()
        this.activiteForm.controls.revenuTotalGroupement2019.enable()
      } else {
        this.activiteForm.controls.revenuTotalGroupement2020.addValidators(Validators.required)
        this.activiteForm.controls.revenuTotalGroupement2020.updateValueAndValidity()
        this.activiteForm.controls.revenuTotalGroupement2019.disable()
      }
    }
  }
}

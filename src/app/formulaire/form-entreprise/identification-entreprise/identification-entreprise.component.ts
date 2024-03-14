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
import {ZoneGeographiqueService} from "../../../services/configuration/zone-geographique/zone-geographique.service";
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {pasteDateValidator} from 'src/app/core/customValidators/past-date-validator';
import {FileService} from 'src/app/services/file/file.service';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {VerifyValidateService} from 'src/app/services/face-rekognition/verify-validate/verify-validate.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from "../../../../environments/environment";
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";
import {NzModalService} from "ng-zorro-antd/modal";
import {ZoneGeographique} from "../../../model/zone-geographique";

@Component({
  selector: 'app-identification-entreprise',
  templateUrl: './identification-entreprise.component.html',
  styleUrls: ['./identification-entreprise.component.scss']
})

export class IdentificationEntrepriseComponent implements OnInit, OnChanges {
  currentStepPosition: number = this.formEntrepriseComponent.currentStepPosition;
  departements: ZoneGeographique[] = [];
  regions: ZoneGeographique[] = [];
  listeZoneGographique: any [] = [];
  region: string = "";
  submitted: boolean = false;
  submitted2: boolean = false;
  key1 = true;
  key2 = false;
  checkNINEAFileSize: boolean = true;
  checkRCCMFileSize: boolean = true;
  nombreEntree: number = 0;
  nombrecollapse = 2;
  dateMaxCreation = new Date();
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth() + 1) + '-' + (this.dateMaxCreation.getDate() >= 10 ? this.dateMaxCreation.getDate() : '0' + this.dateMaxCreation.getDate());
  checkFileCons: boolean = false;
  checkFileRccm: boolean = false;
  checkFileNinea: boolean = false;


  @Input() entreprise: any;
  @Output() entrepriseChange = new EventEmitter<any>();

  // intialize the FormGroup
  entrepriseForm = this.fb.group({
    denominationSociale: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]],
    numeroRccm: ['', Validators.pattern('[a-z-A-Z_0-9 /.]*')],
    documentRccm: [''],
    ninea: [''],
    documentNinea: [''],
    statutJuridique: ['', Validators.required],
    documentConstitution: [''],
    dateCreation: ['', [Validators.required, pasteDateValidator]],
    adressePhysique: ['', [Validators.required, Validators.pattern('^(?![0-9]*$)[a-zA-Z0-9 \\/]*')]],
    departement: ['', Validators.required],
    //region: ['', Validators.required],
    centreUrbain: ['', Validators.required]

    //  niveauInstruction : ['' , Validators.required]
  });
  lotEtape1: string[] = ["denominationSociale", "numeroRccm", "documentRccm", "ninea", "documentNinea", "statutJuridique"];
  lotEtape2: string[] = ["documentConstitution", "dateCreation", "adressePhysique", "departement", "region", "centreUrbain"];

  documentRCCMNom: any;
  documentNineaNom: any;
  documentConstitutionNom: any;
  beneficiaireId: any;
  baseUrlFile = environment.baseUrlFile;

  constructor(private formEntrepriseComponent: FormEntrepriseComponent,
              private zoneGeographiqueService: ZoneGeographiqueService,
              private fb: UntypedFormBuilder,
              private changeDetector: ChangeDetectorRef,
              private fileService: FileService,
              private modalService: NzModalService,
              private checkFileSize: CheckFileSize,
              private notification: NzNotificationService,
              private verifyValidate: VerifyValidateService,
              private activatedRoute: ActivatedRoute) {
    this.beneficiaireId = this.activatedRoute.snapshot.params.beneficiaire;

  }


  ngOnInit(): void {
    //console.log(new Date().getMonth());
    //console.log(this.dateMaxCreationString);
    this.onGetZoneGeographique()

    if (this.entreprise) {
      if(this.entreprise.departement === 'null')
        this.entreprise.departement = null
      this.region = this.entreprise.region
      this.entrepriseForm.patchValue({
        ...this.entreprise
      })
      // just safety check
      if (this.entreprise.region) {
        this.chargeDepartements(this.entreprise.region);
      }

      this.region = this.entreprise.region;
      // if (this.entreprise.departement) {
      //   console.log(this.chargerRegion(this.entreprise.departement))
      //   this.entrepriseForm.controls.region.setValue(this.chargerRegion(this.entreprise.departement));
      // }

      // this.entrepriseForm.controls.region.setValue(this.entreprise.region);
      // this.entrepriseForm.controls.region.updateValueAndValidity({
      //   onlySelf: false,
      //   emitEvent: true
      // });

      this.changeDetector.markForCheck();



      //console.log(this.departements);


      // this.entrepriseForm.controls.departement.setValue(this.entreprise.departement)
      // this.entrepriseForm.controls.departement.updateValueAndValidity({
      //   onlySelf: true,
      //   emitEvent: true
      // });

      /*this.documentRCCMNom = this.documentRCCMNom;
      this.documentNineaNom = this.documentNineaNom;
      this.documentConstitutionNom = this.documentConstitutionNom;*/

      if (this.beneficiaireId) {

        this.entrepriseForm.patchValue({
          documentNinea: this.entreprise.documentNinea,
          documentConstitution: this.entreprise.documentConstitution,
          documentRccm: this.entreprise.documentRccm

        });

        this.documentNineaNom = this.entreprise.documentNinea,
          this.documentConstitutionNom = this.entreprise.documentConstitution,
          this.documentRCCMNom = this.entreprise.documentRccm
        // test

      }


    }

    this.checkRCCMFileSize = true;
    this.checkNINEAFileSize = true;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.entreprise) {
      console.log(this.entreprise);
      this.region = this.entreprise.region
      this.entrepriseForm.patchValue({
        ...this.entreprise
      })

      // if (this.entreprise.region) {
      //   this.chargeDepartements(this.entreprise.region);
      // }
      this.documentNineaNom = this.entreprise.documentNineaNom,
        this.documentConstitutionNom = this.entreprise.documentConstitutionNom,
        this.documentRCCMNom = this.entreprise.documentRCCMNom

      //this.region = this.entreprise.region
      //this.departements.filter(d => d.libelle === this.entreprise.zoneGeographique.libelle);
      // this.entrepriseForm.patchValue({
      //   documentNinea: this.documentNineaNom,
      //   documentConstitution: this.documentConstitutionNom,
      //   documentRccm: this.documentRCCMNom
      //
      // });
      //
      // if (this.beneficiaireId) {
      //
      //   this.entrepriseForm.patchValue({
      //     documentNinea: this.entreprise.documentNinea,
      //     documentConstitution: this.entreprise.documentConstitution,
      //     documentRccm: this.entreprise.documentRccm,
      //   });
      // }
    }
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
    if (this.entrepriseForm.valid && this.nombreEntree === this.nombrecollapse - 1) {
      this.entrepriseChange.emit({
        documentRCCMNom: this.documentRCCMNom,
        documentConstitutionNom: this.documentConstitutionNom,
        documentNineaNom: this.documentNineaNom,
        ...this.entrepriseForm.getRawValue()
      });

      this.formEntrepriseComponent.next();

    } else {
      for (let control of this.lotEtape1) {
        if (this.entrepriseForm.controls[control].invalid) {
          this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;

        }

      }
      this.key1 = false;
      this.key2 = true;
      if (this.nombreEntree === this.nombrecollapse - 1) {

        for (let control of this.lotEtape2) {
          if (this.entrepriseForm.controls[control].invalid) {
            this.submitted2 = true;
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

  convertToString(value: any) {
    return JSON.stringify(value);
  }

  convertToJSON(value: any) {
    return JSON.parse(value);
  }

  onGetZoneGeographique() {
    this.zoneGeographiqueService.getAll().subscribe(
      (response) => {

        this.listeZoneGographique = response;
        response.forEach(value => {
          if (value.typeZone != null) {
            switch (value.typeZone) {
              case 'DEPARTEMENT':
                  this.departements.push(value);
                break;
              case 'REGION':
                this.regions.push(value);
                break
            }
          }
        })

          // update case of pme
          if (this.entreprise.departement != null) {
            // get region matching to the departement
            console.log(this.entreprise.departement);
            this.region = JSON.stringify(this.listeZoneGographique.filter(
              element =>
                element.id == JSON.parse(this.entreprise.departement).idParent )[0]);
            this.chargeDepartements(this.region ) ;
          }

        }
    );
    this.changeDetector.markForCheck();
  }

  removeFichier(value: string, type: 'NINEA' | 'RCCM') {
    console.log(value);
    this.modalService.confirm({
      nzTitle: 'Confirmer le retrait',
      nzOkText: 'Retirer',
      nzContent: `Etes vous sûr de vouloir retirer le document ${value.slice(value.lastIndexOf('_') + 1)}`,
      nzOnOk: () => {
        if (type === 'NINEA') {
          this.documentNineaNom = '';
          this.entrepriseForm.controls.documentNinea.setValue('');
        } else if (type === 'RCCM') {
          this.documentRCCMNom = '';
          this.entrepriseForm.controls.documentRccm.setValue('');
        } else {
          throw new Error('Veuillez revoir les paramètres de la fonction');
        }

      }
    });

  }

  loaddocumentRccm(event: any) {

    let tableau: string[] = ['\'image/jpeg\'', 'pdf', 'png', 'docx', 'doc', 'docx', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'jpg', 'jpeg'];
    this.checkFileRccm = false;
    if (this.checkTypeFile(tableau, event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        this.checkRCCMFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkRCCMFileSize) {
          const formData = new FormData();
          formData.append('file', file);
          this.fileService.save(formData, 'RCCM').subscribe(
            response => {
              this.documentRCCMNom = response.reponse
              /*this.entrepriseForm.patchValue({
                documentRccm: this.documentRCCMNom
              })*/
            },
            () => {
              this.entrepriseForm.controls.documentRccm.setValue('');
              this.modalService.error({
                nzTitle: 'Erreur de chargement',
                nzContent: 'Veuillez revoir votre connexion'
              });
            }
          )
        } else {
          console.log("Fichier trop lourd !!!!!");
          this.entrepriseForm.controls.documentRccm.setValue('');
        }

      }
      this.checkFileRccm = false;
    } else {
      this.checkFileRccm = true;
      this.entrepriseForm.controls.documentRccm.setValue('');
    }
  }

  loaddocumentNinea(event: any) {
    let tableau: string[] = ['\'image/jpeg\'', 'pdf', 'png', 'docx', 'doc', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'jpg', 'jpeg'];
    this.checkFileNinea = false;
    if (this.checkTypeFile(tableau, event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        //console.log(file);
        this.checkNINEAFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkNINEAFileSize) {
          const formData = new FormData();
          formData.append('file', file);

          this.fileService.save(formData, 'NINEA').subscribe(
            response => {
              console.log('je suis une reponse ' + response);
              this.documentNineaNom = response.reponse
              /*this.entrepriseForm.patchValue({
                documentNinea: this.documentNineaNom
              })*/
            },
            () => {
              this.entrepriseForm.controls.documentNinea.setValue('');
              this.modalService.error({
                nzTitle: 'Erreur de chargement',
                nzContent: 'Veuillez revoir votre connexion'
              });

            }
          )
        } else {
          console.log("Fichier trop lourd !!!!!");
          this.entrepriseForm.controls.documentNinea.setValue('');
        }

      }
      this.checkFileNinea = false;
    } else {
      this.checkFileNinea = true;
      this.entrepriseForm.controls.documentNinea.setValue('');
    }
  }

  /*loaddocumentConstitution(event: any) {
    let tableau: string[] = ['\'image/jpeg\'','pdf','png','docx','doc','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','jpg','jpeg'];
    this.checkFileCons = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
    // check if file exist
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      const formData = new FormData();
      formData.append('file' , file );
      this.fileService.save(formData , 'CONSTITUTION').subscribe(
        response => {
          //console.log(response);
          this.documentConstitutionNom = response.reponse
          this.entrepriseForm.patchValue({
            documentConstitution: this.documentConstitutionNom
          })
        },
        error => {
          //console.log(error)
        }
      )
    }
      this.checkFileCons = false;
    }else{
      this.checkFileCons = true;
      this.entrepriseForm.controls.documentConstitution.setValue('');
    }
  }*/


  chargeDepartements($event: any) {
    console.log("Charger le departement de la region" + JSON.parse($event) )
    let reg = JSON.parse($event);
    if(reg)
    this.departements = this.listeZoneGographique.filter(it => it.idParent == reg.id && it.typeZone == 'DEPARTEMENT');
    console.log("reg " + reg)
    console.log(this.departements)
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

  checkTypeFile(tableau: string[], extension: string) {
    return tableau?.indexOf(extension) !== -1;
  }
}

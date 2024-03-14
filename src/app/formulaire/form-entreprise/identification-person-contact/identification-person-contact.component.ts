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
import {FileService} from 'src/app/services/file/file.service';
import {FormEntrepriseComponent} from "../form-entreprise.component";
import {PMO} from "../../../model/pmo";
import {PmoService} from "../../../services/pmo/pmo.service";
import {IndicatifPaysService} from "../../../services/configuration/indicatif-pays/indicatif-pays.service";
import {UniqueLoginValidator} from "../../../core/customValidators/asyncValidators/UniqueLoginValidator";
import {ActivatedRoute} from '@angular/router';
import {environment} from "../../../../environments/environment";
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";
import {NzModalService} from "ng-zorro-antd/modal";
import {BeneTP} from "../../../model/beneTP";
import {AuthService} from "../../../services/security/auth/auth.service";
import {Beneficiaire} from "../../../model/beneficiaire";

@Component({
  selector: 'app-identification-person-contact',
  templateUrl: './identification-person-contact.component.html',
  styleUrls: ['./identification-person-contact.component.scss']
})
export class IdentificationPersonContactComponent implements OnInit, OnChanges {

  currentStepPosition: number = this.formEntrepriseComponent.currentStepPosition;

  @Input() beneficiairetp !: Beneficiaire;
  @Input() personContact: any;
  @Input() showPmoReferant: any;
  @Output() personContactChange = new EventEmitter<any>();

  radioValue: string = 'oui';
  radioValueCode: string = 'non';
  countries: any[] | null = null;
  beneficiaireId: any;

  typePieces: string = '';

  // intialize the FormGroup
  personContactForm = this.fb.group({
    prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    nom: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    numeroMobile: ['', [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
    email: ['', Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')],
    adressePhysique: ['', Validators.required],
    numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
    documentCNI: [''],
    pmoRefere: [''],
    codeClient: [''],
    countryIndicatif: [''],
    id: [''],
    //  niveauInstruction : ['' , Validators.required]
  });

  constructor(private formEntrepriseComponent: FormEntrepriseComponent,
              private fb: UntypedFormBuilder,
              private changeDetector: ChangeDetectorRef,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private modalService: NzModalService,
              private pmoService: PmoService,
              private countriesService: IndicatifPaysService,
              private loginChecker: UniqueLoginValidator,
              public auth: AuthService,
              private activatedRoute: ActivatedRoute) {
    this.beneficiaireId = activatedRoute.snapshot.params.beneficiaire
  }

  documentCNINom?: any;
  est_referer: string = 'false';
  est_uimcec: string = 'false';
  show_refererant: boolean = false;
  pmos?: PMO[];
  checkFile: boolean = false;
  showCodeClient: boolean = false;
  showUIMCEC: boolean = false;
  submitted: boolean = false;
  baseUrlFile = environment.baseUrlFile;
  showInscriptionProprietaire: boolean = false


  ngOnInit(): void {

    if(this.auth.getRole() === "AGENT_INITIATEUR"){
      console.log("INITIATEUR Check CNI False")
      this.personContactForm = this.fb.group({
        prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        nom: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
        numeroMobile: ['', [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
        email: ['', Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')],
        adressePhysique: ['', Validators.required],
        numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
        documentCNI: [''],
        pmoRefere: [''],
        codeClient: [''],
        countryIndicatif: [''],
        id: [''],
        //  niveauInstruction : ['' , Validators.required]
      });
    }

    if ((this.auth.getRole() == 'AGENT_INITIATEUR')) {
      this.showInscriptionProprietaire = false
    } else {
      this.showInscriptionProprietaire = true
    }

    // if (this.beneTP.personnes?.[0]) {
    //   this.personContactForm.controls['id'].setValue(this.beneTP.personnes?.[0].id)
    //   this.personContactForm.controls['prenom'].setValue(this.beneTP.personnes?.[0].prenom)
    //   this.personContactForm.controls['nom'].setValue(this.beneTP.personnes?.[0].nom)
    //   this.personContactForm.controls['numeroMobile'].setValue(this.beneTP.personnes?.[0].numeroMobile)
    //   this.personContactForm.controls['numeroCNI'].setValue(this.beneTP.personnes?.[0].numeroCNI)
    // }

    this.onGetAllPmoReferer();
    this.OnGetCountries();
    console.log('valeur de personne ', this.personContact)
    localStorage.setItem('typeBenef', 'pme');
    // check if data from parent exist
    if (this.personContact) {

      this.personContactForm.patchValue(
        {...this.personContact}
      );
      this.documentCNINom = this.personContact.documentCNINom;

      this.typePieces = 'cni'
      this.personContactForm.patchValue({

        documentCNI: this.personContact.documentCNINom

      })

      this.radioValue = this.personContact.radioValue;
      if (localStorage.getItem('radioValue') == 'oui')
        this.radioValue = 'oui'
      if (localStorage.getItem('est_referer') == 'true') {
        this.est_referer = 'true'
      }
      if (localStorage.getItem('est_uimcec') == 'true') {
        this.est_uimcec = 'true'
      }
      if (localStorage.getItem('show_refererant') == 'true')
        this.show_refererant = true
      //console.log(this.personContactForm)

      if (this.beneficiaireId) {
        this.radioValue = this.personContact.personAgentSame ? 'oui' : "non";
        this.est_referer = this.personContact.estRefere ? 'true' : 'false';
        this.est_uimcec = this.personContact.estRefere ? 'true' : 'false';
        this.show_refererant = this.personContact.estRefere;
      }
    }

    if (!this.showPmoReferant) {
      console.log('here');
      this.show_refererant = false;
      return;
    }
    this.personContactForm.controls["numeroCNI"].disable();
  }

  onClikTypePieces($event: any) {
    console.log("type de piece choisi : " + $event)
    this.personContactForm.controls["numeroCNI"].enable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.personContact) {

      this.personContactForm.patchValue(
        {...this.personContact}
      );
      this.documentCNINom = this.personContact.documentCNINom;
      this.personContactForm.patchValue({

        documentCNI: this.personContact.documentCNINom

      })
      if (this.beneficiaireId) {
        this.radioValue = this.personContact.personAgentSame ? 'oui' : "non";
        this.est_referer = this.personContact.estRefere ? 'true' : 'false';
        this.show_refererant = this.personContact.estRefere;

      }
    }
  }

  pre() {
    this.formEntrepriseComponent.pre();
  }

  next() {

    this.submitted = true
    /*if(this.beneficiaireId){
      this.personContactForm.controls.numeroCNI.updateValueAndValidity();
    }*/

    if (this.personContactForm.valid && this.typePieces != '') {

      this.personContactChange.emit({
        radioValue: this.radioValue,
        documentCNINom: this.documentCNINom, ...this.personContactForm.getRawValue()
      });

      localStorage.setItem('personContact', JSON.stringify(this.personContactForm.getRawValue()))
      if (this.radioValue == 'non') {
        localStorage.setItem('radioValue', this.radioValue)
        this.formEntrepriseComponent.next();
      } else {
        localStorage.setItem('radioValue', this.radioValue)
        this.personContactChange.emit({
          radioValue: this.radioValue,
          documentCNINom: this.documentCNINom, ...this.personContactForm.getRawValue()
        });
        this.formEntrepriseComponent.nextWithoutAgent();
      }
      if (this.est_referer == 'true') {
        localStorage.setItem('est_referer', this.est_referer);
      } else {
        localStorage.setItem('est_referer', this.est_referer);
      }
      if (this.show_refererant) {
        localStorage.setItem('show_refererant', String(this.show_refererant));
      } else {
        localStorage.setItem('show_refererant', String(this.show_refererant));
      }
      if (this.est_uimcec == 'true') {
        localStorage.setItem('est_uimcec', this.est_uimcec);
      } else {
        localStorage.setItem('est_uimcec', this.est_uimcec);
      }

    }
  }

  done() {
    this.formEntrepriseComponent.done()
  }

  convertToString(value: any) {
    return JSON.stringify(value);
  }

  /*
    documentCniLoad(event:any){
    // @ts-ignore
      let tableau: string[] = ['\'image/jpeg\'','pdf','png','jpg','jpeg'];
      this.checkFile = false;
      if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {

        // check if file exist
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;

          if (!this.checkFileSize.checkSize(file.size!, 'selfieIdentity')) {
            this.modalService.error({
              nzTitle: 'Erreur sur la taille ',
              nzContent: 'Merci de recharger un fichier de taille inferieure à 10MB'
            });

            return;
          }
          let formData = new FormData();

          formData.append('file', file);
          //console.log(file)

          // set the name form the database
          this.fileService.save(formData, 'cni').subscribe(
            response => {

              this.documentCNINom = response.reponse;
              console.log(this.documentCNINom);
              this.personContactForm.patchValue({
                documentCNI: this.documentCNINom
              })
            }
            , error => {
              this.personContactForm.controls.documentCNI.setValue('');
              //console.log(error);
            }
          )

        }
        this.checkFile = false;
      }else{
        this.checkFile = true;
        this.personContactForm.controls.documentCNI.setValue('');
      }
    }
  */

  choose(event: any) {
    //console.log($event);
    console.log('choose if person = agent ', event);

    // update the current value of radio Value for the agent part
    localStorage.setItem('radioValue', event);
  }

  onGetAllPmoReferer() {
    this.pmoService.getAllReferer().subscribe(response => {
      this.pmos = response
      this.changeDetector.markForCheck()
      if (this.beneficiaireId) {

        // CHECK IF PMO REFERE EXIST IN DATA FROM BACK

        if (this.personContact.pmoRefere) {

          let result = this.pmos.filter(el => {
            return el.id == JSON.parse(this.personContact.pmoRefere).id;
          });

          this.personContactForm.controls.pmoRefere.setValue(JSON.stringify(result[0]));
          this.personContactForm.updateValueAndValidity();
        }

      }


    })
  }

  validateRequiredPmo() {
    if (this.est_referer == 'true') {
      this.personContactForm.controls.pmoRefere.addValidators(Validators.required)
      this.personContactForm.controls.pmoRefere.updateValueAndValidity()
    } else {
      this.personContactForm.controls.pmoRefere.removeValidators(Validators.required)
      this.personContactForm.controls.pmoRefere.updateValueAndValidity()
    }
  }

  validateRequiredCodeClientUIMCEC() {
    console.log(this.est_uimcec);
    if (this.est_uimcec == 'true') {
      this.personContactForm.controls.codeClient.addValidators(Validators.required)
      this.personContactForm.controls.codeClient.addAsyncValidators(this.loginChecker.checkCodeClientExist());
      this.personContactForm.controls.codeClient.updateValueAndValidity()
    } else {
      this.personContactForm.controls.codeClient.removeValidators(Validators.required)
      this.personContactForm.controls.codeClient.updateValueAndValidity()
    }
  }

  showHidePmo($event: any) {
    if ($event == 'true') {
      this.est_referer = String(true);
      this.show_refererant = true;
      this.validateRequiredPmo()
    } else {
      this.personContactForm.controls.pmoRefere.setValue(null);
      this.est_referer = String(false)
      this.show_refererant = false;
      this.est_uimcec = String(false)
      this.showUIMCEC = false;
      this.showCodeClient = false;
      this.validateRequiredPmo()
    }
  }

  showHideUIMCEC($event: any) {
    // console.log(JSON.parse($event));
    const obj = JSON.parse($event);
    if (obj?.sigle == 'UIMCEC') {
      this.est_uimcec = String(true);
      this.showUIMCEC = true;
      // this.validateRequiredPmo()
    } else {
      // this.personContactForm.controls.pmoRefere.setValue(null);
      this.est_uimcec = String(false)
      this.showUIMCEC = false;
      // this.validateRequiredPmo()
    }
  }

  showHideCodeClientUIMCEC($event: any) {
    // console.log($event);
    if ($event == 'oui') {
      this.est_uimcec = String(true);
      this.showCodeClient = true;
      this.validateRequiredCodeClientUIMCEC()
    } else {
      this.personContactForm.controls.codeClient.setValue(null);
      this.est_uimcec = String(false)
      this.showCodeClient = false;
      this.validateRequiredCodeClientUIMCEC()
    }
  }

  checkTypeFile(tableau: string[], extension: string) {
    return tableau?.indexOf(extension) !== -1;
  }

  OnGetCountries() {
    this.countriesService.getCountries().subscribe((response) => {
      this.countries = response.countryPrefix;
      this.changeDetector.markForCheck()
    })
  }
}

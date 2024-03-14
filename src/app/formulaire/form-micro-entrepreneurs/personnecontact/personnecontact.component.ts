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
import {Genre} from "../../../model/genre";
import {GenreService} from "../../../services/configuration/genre/genre.service";
import {NiveauInstruction} from "../../../model/niveau-instruction";
import {NiveauInstructionService} from "../../../services/configuration/niveau-instruction.service";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {TrancheNombrePersonne} from "../../../model/tranche-nombre-personne";
import {TranchePersonneService} from "../../../services/configuration/tranche-personne/tranche-personne.service";
import {TrancheAgeService} from "../../../services/configuration/tranche-age/tranche-age.service";
import {TrancheAge} from "../../../model/tranche-age";
import {FileService} from 'src/app/services/file/file.service';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {PmoService} from "../../../services/pmo/pmo.service";
import {PMO} from "../../../model/pmo";
import {IndicatifPaysService} from "../../../services/configuration/indicatif-pays/indicatif-pays.service";
import {UniqueLoginValidator} from "../../../core/customValidators/asyncValidators/UniqueLoginValidator";
import {ActivatedRoute} from '@angular/router';
import {environment} from "../../../../environments/environment";
import {BeneTP} from "../../../model/beneTP";
import {Beneficiaire} from "../../../model/beneficiaire";
import {AuthService} from "../../../services/security/auth/auth.service";

@Component({
  selector: 'app-personnecontact',
  templateUrl: './personnecontact.component.html',
  styleUrls: ['./personnecontact.component.scss']
})
export class PersonnecontactComponent implements OnInit, OnChanges {
  radioValue: string = 'oui';
  radioValueCode: string = 'non';
  currentStepPosition: number = this.formMicroEntrepreneur.currentStepPosition;
  genres?: Genre[];
  genre?: Genre;
  niveauInstructions?: NiveauInstruction[];
  trancheNombrePersonnes?: TrancheNombrePersonne[];
  ages?: TrancheAge[];
  age?: TrancheAge;
  submitted: boolean = false;
  submitted2: boolean = false;
  key1 = true;
  key2 = false;
  nombreEntree: number = 0;
  checkFile: boolean = false;
  showCodeClient: boolean = false;
  showUIMCEC: boolean = false;
  typePieces: string = '';
  showInscriptionProprietaire: boolean = false;

  @Input() personContact: any;
  //@Input() beneTP !: Beneficiaire;
  @Input() beneficiairetp !: Beneficiaire
  @Input() showPmoReferant: any;
  @Output() personContactChange = new EventEmitter<any>();


  // intialize the FormGroup
  personContactForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      nom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      genre: ['', Validators.required],
      numeroMobile: ['', [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
      email: ['', Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')],
      adressePhysique: ['', Validators.required],
      age: ['', Validators.required],
      numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
      documentCNI: [''],
      niveauInstruction: ['', Validators.required],
      nombrePersonCharge: ['', Validators.required],
      pmoRefere: [''],
      codeClient: [''],
      countryIndicatif: [''],
      id: [''],
    }

  );

  lotEtape1: string[] = ["age", "prenom", "nom", "genre", "numeroMobile", "email", "adressePhysique"];
  lotEtape2: string[] = ["numeroCNI", "documentCNI", "niveauInstruction", "nombrePersonCharge", 'pmoRefere'];


  documentCNINom: any;
  est_referer: string = 'false';
  est_uimcec: string = 'false';
  show_refererant: boolean = false;
  pmos?: PMO[];
  countries: any[] | null = null;
  beneficiaireId: any;
  idPmo: any;
  baseUrlFile = environment.baseUrlFile;

  constructor(private formMicroEntrepreneur: FormMicroEntrepreneursComponent,
              private genreService: GenreService,
              private niveauInstructionService: NiveauInstructionService,
              private fb: UntypedFormBuilder,
              private changeDetector: ChangeDetectorRef,
              private tranchePersonneService: TranchePersonneService,
              private trancheAgeService: TrancheAgeService,
              private fileService: FileService,
              private notification: NzNotificationService,
              private pmoService: PmoService,
              private countriesService: IndicatifPaysService,
              private changeDetectorRef: ChangeDetectorRef,
              private loginChecker: UniqueLoginValidator,
              private activatedRoute: ActivatedRoute,
              public auth :AuthService,

  ) {
    this.beneficiaireId = activatedRoute.snapshot.params.beneficiaire
    // this.idPmo = activatedRoute.snapshot.params.pmo;
  }


  ngOnInit(): void {

    if(this.auth.getRole() === "AGENT_INITIATEUR"){
      console.log("INITIATEUR Check CNI False")
      this.personContactForm = this.fb.group({
        prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        nom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        genre: ['', Validators.required],
        numeroMobile: ['', [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
        email: ['', Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')],
        adressePhysique: ['', Validators.required],
        age: ['', Validators.required],
        numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
        documentCNI: [''],
        niveauInstruction: ['', Validators.required],
        nombrePersonCharge: ['', Validators.required],
        pmoRefere: [''],
        codeClient: [''],
        countryIndicatif: [''],
        id: [''],
      })
    }

    this.showInscriptionProprietaire = (this.auth.getRole() != 'AGENT_INITIATEUR');

    // if (this.beneTP && this.beneTP.personnes){
    //   this.personContactForm.controls['id'].setValue(this.beneTP.personnes[0].id)
    //   this.personContactForm.controls['prenom'].setValue(this.beneTP.personnes[0].prenom)
    //   this.personContactForm.controls['nom'].setValue(this.beneTP.personnes[0].nom)
    //   this.personContactForm.controls['numeroMobile'].setValue(this.beneTP.personnes[0].numeroMobile)
    //   this.personContactForm.controls['numeroCNI'].setValue(this.beneTP.personnes[0].numeroCNI)
    // }

    this.onGetGenre();
    this.onGetNiveauInstruction();
    this.onGetTrancheNombrePersonne();
    this.onGetTrancheAge();
    this.onGetAllPmoReferer();
    this.OnGetCountries();


    // console.log('show '+this.showPmoReferant);
    localStorage.setItem('typeBenef', 'me');
    if (this.personContact) {

      console.log(this.personContact);

      this.personContactForm.patchValue({
        ...this.personContact
      });
      this.documentCNINom = this.personContact.documentCNINom;

      // case update
      // set decision maded by client at subscription
      if (this.beneficiaireId) {
        this.radioValue = this.personContact.personAgentSame ? 'oui' : 'non';
        this.est_referer = this.personContact.estRefere ? 'true' : 'false';
        this.est_uimcec = this.personContact.estRefere ? 'true' : 'false';
      }

    }

    if (!this.showPmoReferant) {
      console.log('here');
      this.show_refererant = false;
      return;
    }

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
    this.personContactForm.controls["numeroCNI"].disable();
  }


  onClikTypePieces($event: any) {
    console.log("type de piece choisi : " + $event)
    this.personContactForm.controls["numeroCNI"].enable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.personContact) {

      this.personContactForm.patchValue({
        ...this.personContact
      });
      this.personContactForm.updateValueAndValidity();

      this.documentCNINom = this.personContact.documentCNINom;
    }
  }

  pre() {
    this.formMicroEntrepreneur.pre()
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    if (this.personContactForm.valid && this.nombreEntree !== 0 && this.typePieces != '') {
      this.personContactChange.emit({
        documentCNINom: this.documentCNINom,
        ...this.personContactForm.getRawValue(), radioValue: this.radioValue
      });

      if (this.radioValue == 'non') {
        localStorage.setItem('radioValue', this.radioValue)
        this.formMicroEntrepreneur.next();
      } else {
        localStorage.setItem('radioValue', this.radioValue)
        this.formMicroEntrepreneur.nextWithoutAgent();
      }
      if (this.est_referer == 'true') {
        localStorage.setItem('est_referer', this.est_referer);
      } else {
        localStorage.setItem('est_referer', this.est_referer);
      }
      if (this.est_uimcec == 'true') {
        localStorage.setItem('est_uimcec', this.est_uimcec);
      } else {
        localStorage.setItem('est_uimcec', this.est_uimcec);
      }
      if (this.show_refererant) {
        localStorage.setItem('show_refererant', String(this.show_refererant));
      } else {
        localStorage.setItem('show_refererant', String(this.show_refererant));
      }

    } else {
      for (let control of this.lotEtape1) {
        if (this.personContactForm.controls[control].invalid) {
          this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;
        }
      }

      this.key1 = false;
      this.key2 = true;
      if (this.nombreEntree !== 0) {
        for (let control of this.lotEtape2) {
          if (this.personContactForm.controls[control].invalid) {
            this.submitted2 = true;
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");

            return;
          }
        }
      }
    }
    this.nombreEntree++;
  }

  documentCniLoad(event: any) {
    let tableau: string[] = ['\'image/jpeg\'', 'pdf', 'png', 'jpg', 'jpeg'];
    this.checkFile = false;
    if (this.checkTypeFile(tableau, event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        const formData = new FormData();
        formData.append('file', file);

        this.fileService.save(formData, 'CNI').subscribe(
          response => {
            //console.log(response);
            this.documentCNINom = response.reponse;
            this.personContactForm.patchValue({
              documentCNI: this.documentCNINom
            })
          }
          ,
          () => {
            //console.log(error);
          }
        )
      }
      this.checkFile = false;
    } else {
      this.checkFile = true;
      this.personContactForm.controls.documentCNI.setValue('');
    }
  }

  done() {
    this.formMicroEntrepreneur.done()
  }

  validator(): boolean {

    if (this.personContactForm.valid) {
      this.personContactChange.emit(this.personContactForm.getRawValue());
      return true;
    }

    return false;
  }

  onGetGenre() {
    this.genreService.getAll().subscribe(
      (response) => {
        this.genres = response;
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  onGetNiveauInstruction() {
    this.niveauInstructionService.getAll().subscribe((response) => {
      this.niveauInstructions = response;
      this.changeDetectorRef.markForCheck();
    })
  }

  onGetTrancheNombrePersonne() {
    this.tranchePersonneService.getAll().subscribe((response) => {
      this.trancheNombrePersonnes = response;
      this.changeDetectorRef.markForCheck();
    })
  }

  onGetTrancheAge() {
    this.trancheAgeService.getAll().subscribe((response) => {
      this.ages = response;
      this.changeDetectorRef.markForCheck();
    })
  }

  convertObject(value: any) {
    return JSON.stringify(value)
  }

  choose(event: any) {
    //console.log($event);
    console.log('choose if person = agent ', event);

    // update the current value of radio Value for the agent part
    localStorage.setItem('radioValue', event);
  }

  onGetAllPmoReferer() {
    this.pmoService.getAllReferer().subscribe(response => {
      this.pmos = response
      if (this.beneficiaireId) {
        this.personContactForm.controls.pmoRefere.setValue(this.personContact.pmoRefere);
        this.pmos.forEach(el => {
          if (el.id == JSON.parse(this.personContact.pmoRefere).id) {
            this.personContactForm.controls.pmoRefere.setValue(JSON.stringify(el));
          }
        })
      }

      this.changeDetectorRef.markForCheck();
    })
  }

  convertToString(value: any) {
    return JSON.stringify(value)
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
      this.changeDetectorRef.markForCheck();
    })
  }
}

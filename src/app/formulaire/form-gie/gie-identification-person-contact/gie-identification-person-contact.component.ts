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
import {NiveauInstructionService} from "../../../services/configuration/niveau-instruction.service";
import {NiveauInstruction} from "../../../model/niveau-instruction";
import {TrancheAgeService} from "../../../services/configuration/tranche-age/tranche-age.service";
import {TrancheAge} from "../../../model/tranche-age";
import {ToastrService} from "ngx-toastr";
import {FileService} from "../../../services/file/file.service";
import {IndicatifPaysService} from "../../../services/configuration/indicatif-pays/indicatif-pays.service";
import {PmoService} from "../../../services/pmo/pmo.service";
import {PMO} from "../../../model/pmo";
import {ActivatedRoute} from "@angular/router";
import {UniqueLoginValidator} from "../../../core/customValidators/asyncValidators/UniqueLoginValidator";
import {environment} from "../../../../environments/environment";
import {BeneTP} from "../../../model/beneTP";
import {Beneficiaire} from "../../../model/beneficiaire";
import {AuthService} from "../../../services/security/auth/auth.service";


@Component({
  selector: 'app-gie-identification-person-contact',
  templateUrl: './gie-identification-person-contact.component.html',
  styleUrls: ['./gie-identification-person-contact.component.scss']
})
export class GieIdentificationPersonContactComponent implements OnInit, OnChanges {
  currentStepPosition: number = this.formGieComponent.currentStepPosition;
  niveauInstructions?: NiveauInstruction[];
  niveauInstruction?: NiveauInstruction;
  trancheAges?: TrancheAge[];
  trancheAge?: TrancheAge;
  radioValue: string = 'oui';
  radioValueCode: string='non' ;
  checkFile: boolean = false;
  showCodeClient: boolean = false;
  showUIMCEC: boolean = false;
  typePieces: string='';
  showInscriptionProprietaire: boolean= false

  @Input() beneficiairetp !: Beneficiaire
  //@Input() beneTP !: Beneficiaire
  @Input() personContact: any;
  @Input() showPmoReferant: any;
  @Output() personContactChange = new EventEmitter<any>();

  // intialize the FormGroup
  personContactForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      nom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      numeroMobile: ['', [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
      email: ['', Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')],
      adressePhysique: ['', Validators.required],
      age: ['', Validators.required],
      numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
      documentCNI: [''],
      niveauInstruction: ['', Validators.required],
      pmoRefere: [''],
      codeClient: [''],
      countryIndicatif: [''],
      id: [''],

    }
  );
  submitted: boolean = false;
  documentCNINom: any;
  est_referer: string = 'false';
  est_uimcec: string = 'false';
  show_refererant?: boolean;
  pmos?: PMO[];
  countries?: any[];
  value: any;
  beneficiaireId: number = 0;

  constructor(private formGieComponent: FormGieComponent,
              private fb: UntypedFormBuilder,
              private changeDetector: ChangeDetectorRef,
              private niveauInstructionService: NiveauInstructionService,
              private trancheAgeService: TrancheAgeService,
              private toast: ToastrService,
              private fileService: FileService,
              private indicatifPaysService: IndicatifPaysService,
              private pmoService: PmoService,
              private countriesService: IndicatifPaysService,
              private activateRoute: ActivatedRoute,
              private changeDetectorRef : ChangeDetectorRef,
              private loginChecker: UniqueLoginValidator,
              public auth :AuthService,) {
    this.beneficiaireId = this.activateRoute.snapshot.params.beneficiaire;
  }

  ngOnInit(): void {


    if(this.auth.getRole() === "AGENT_INITIATEUR"){
      console.log("INITIATEUR Check CNI False")
      this.personContactForm = this.fb.group({
          prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
          nom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
          numeroMobile: ['', [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
          email: ['', Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')],
          adressePhysique: ['', Validators.required],
          age: ['', Validators.required],
          numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
          documentCNI: [''],
          niveauInstruction: ['', Validators.required],
          pmoRefere: [''],
          codeClient: [''],
          countryIndicatif: [''],
          id: [''],

        }
      );
    }

    this.showInscriptionProprietaire = (this.auth.getRole() != 'AGENT_INITIATEUR');

    if (this.beneficiairetp && this.beneficiairetp.id){
      this.beneficiaireId = this.beneficiairetp.id
      console.log(this.beneficiaireId)
    }

    // if (this.beneTP){
    //   this.personContactForm.controls['id'].setValue(this.beneTP.personnes?.[0].id)
    //   this.personContactForm.controls['prenom'].setValue(this.beneTP.personnes?.[0].prenom)
    //   this.personContactForm.controls['nom'].setValue(this.beneTP.personnes?.[0].nom)
    //   this.personContactForm.controls['numeroMobile'].setValue(this.beneTP.personnes?.[0].numeroMobile)
    //   this.personContactForm.controls['numeroCNI'].setValue(this.beneTP.personnes?.[0].numeroCNI)
    // }


    this.onGetNiveauInstruction();
    this.onGetTrancheAge();
    //this.onGetAllPmoReferer();
    this.OnGetCountries();
    localStorage.setItem('typeBenef', 'gie');
    if (this.personContact){
      this.personContactForm.patchValue({...this.personContact})
      this.documentCNINom = this.personContact.documentCNINom;
      this.personContactForm.patchValue({

        documentCNI: this.personContact.documentCNINom

      })
    }

    if(!this.showPmoReferant){
      console.log('here');
      this.show_refererant = false;
      return;
    }

    if (localStorage.getItem('radioValue') == 'oui')
      this.radioValue = 'oui'
    if (localStorage.getItem('est_referer') == 'true'){
      this.est_referer = 'true'
    }
    if (localStorage.getItem('est_uimcec') == 'true'){
      this.est_uimcec = 'true'
    }
    if (localStorage.getItem('show_refererant') == 'true')
      this.show_refererant = true

    if(this.beneficiaireId){
      this.radioValue = this.personContact?.personAgentSame ? 'oui' : "non"  ;
      this.est_referer = this.personContact?.estRefere ? 'true' : 'false';
      this.est_uimcec = this.personContact?.estRefere ? 'true' : 'false';
      this.show_refererant = this.personContact?.estRefere;
    }
    this.personContactForm.controls["numeroCNI"].disable();
  }

  onClikTypePieces($event: any){
    console.log("type de piece choisi : " + $event)
    this.personContactForm.controls["numeroCNI"].enable();
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log(this.personContact)
    if (this.personContact){
      this.personContactForm.patchValue({...this.personContact})
      //this.personContactForm.updateValueAndValidity();
      this.documentCNINom = this.personContact.documentCNINom;
      this.personContactForm.patchValue({

        documentCNI: this.personContact.documentCNINom

      })
      if(this.beneficiaireId){
        this.radioValue = this.personContact?.personAgentSame ? 'oui' : "non"  ;
        this.est_referer = this.personContact?.estRefere ? 'true' : 'false' ;
        this.show_refererant = this.personContact?.estRefere ;

      }
    }
  }

  pre() {
    this.formGieComponent.pre();
  }

  next() {
    this.submitted = true;
   // if(this.beneficiaireId){this.personContactForm.controls.numeroCNI.updateValueAndValidity();}
    if (this.personContactForm.valid && this.typePieces!='') {
      if (this.radioValue == 'non') {
        localStorage.setItem('radioValue', this.radioValue)
        this.formGieComponent.next();
      } else {
        localStorage.setItem('radioValue', this.radioValue)
        this.formGieComponent.nextWithoutAgent();
      }
      if (this.est_referer == 'true') {
        localStorage.setItem('est_referer', this.est_referer);
      }else {
        localStorage.setItem('est_referer', this.est_referer);
      }
      if (this.show_refererant == true) {
        localStorage.setItem('show_refererant', String(this.show_refererant));
      }else {
        localStorage.setItem('show_refererant', String(this.show_refererant));
      }
      if (this.est_uimcec == 'true') {
        localStorage.setItem('est_uimcec', this.est_uimcec);
      }else {
        localStorage.setItem('est_uimcec', this.est_uimcec);
      }

      this.personContactChange.emit({...this.personContactForm.getRawValue(), documentCNINom: this.documentCNINom, radioValue: this.radioValue});
    }

  }

  done() {
    this.formGieComponent.done()
  }

  validator(): boolean {

    if (this.personContactForm.valid) {
      this.personContactChange.emit(this.personContactForm.getRawValue());
      return true;
    }

    return false;
  }

  convertToString(value: any) {
    return JSON.stringify(value);
  }

  documentCniLoad(event: any) {
    let tableau: string[] = ['\'image/jpeg\'','pdf','png','jpg','jpeg'];
    this.checkFile = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
    // check if file exist
    const [file] = event.target.files;
    if (event.target.files && event.target.files.length) {
      this.personContactForm.patchValue({
        documentCNINom : file,
      })
      // need to run CD since file load runs outside of zone
      this.changeDetector.markForCheck();
      const formData = new FormData();
      formData.append('file', file);
      this.fileService.save(formData, 'CNI').subscribe(
        response => {
          //console.log(response);
          this.documentCNINom = response.reponse
          this.personContactForm.patchValue({
            documentCNI: this.documentCNINom
          })
        },
        error => {
          //console.log(error)
        }
      )
    }this.checkFile = false;
    }else{
      this.checkFile = true;
      this.personContactForm.controls.documentCNI.setValue('');
    }
  }

  onGetNiveauInstruction(){
    this.niveauInstructionService.getAll().subscribe((response) => {
      this.niveauInstructions = response;
      this.changeDetectorRef.markForCheck()
    })
  }

  onGetTrancheAge(){
    this.trancheAgeService.getAll().subscribe((response) =>{
      this.trancheAges = response;
      this.changeDetectorRef.markForCheck()
    })
  }

  onGetAllPmoReferer(){
    this.pmoService.getAllReferer().subscribe(response => {
      this.pmos = response
      this.changeDetectorRef.markForCheck()
      if(this.beneficiaireId){
        if(this.personContact.pmoRefere){
          let result = this.pmos.filter(el => {
            return el.id == JSON.parse(this.personContact.pmoRefere).id;
          });
          this.personContactForm.controls.pmoRefere.setValue(JSON.stringify(result[0]));
          this.personContactForm.updateValueAndValidity();
        }
      }
    })
  }

  choose(event: any) {
    //console.log($event);
    console.log('choose if person = agent ' , event );

    // update the current value of radio Value for the agent part
    localStorage.setItem('radioValue', event);

  }

  validateRequiredPmo (){
    if (this.est_referer == 'true'){
      this.personContactForm.controls.pmoRefere.addValidators(Validators.required)
      this.personContactForm.controls.pmoRefere.updateValueAndValidity()
    }else {
      this.personContactForm.controls.pmoRefere.removeValidators(Validators.required)
      this.personContactForm.controls.pmoRefere.updateValueAndValidity()
    }
  }

  validateRequiredCodeClientUIMCEC (){
    console.log(this.est_uimcec);
    if (this.est_uimcec == 'true'){
      this.personContactForm.controls.codeClient.addValidators(Validators.required)
      this.personContactForm.controls.codeClient.addAsyncValidators(this.loginChecker.checkCodeClientExist());
      this.personContactForm.controls.codeClient.updateValueAndValidity()
    }else {
      this.personContactForm.controls.codeClient.removeValidators(Validators.required)
      this.personContactForm.controls.codeClient.updateValueAndValidity()
    }
  }

  showHidePmo($event: any) {
    if ($event == 'true'){
      this.est_referer = String(true);
      this.show_refererant = true;
      this.validateRequiredPmo()
    }else {
      this.personContactForm.controls.pmoRefere.setValue(null);
      this.est_referer = String(false)
      this.est_uimcec = String(false)
      this.show_refererant = false;
      this.showUIMCEC = false;
      this.showCodeClient = false;
      this.validateRequiredPmo()
    }
  }

  showHideUIMCEC($event: any) {
    // console.log(JSON.parse($event));
    const obj = JSON.parse($event);
    if (obj?.sigle == 'UIMCEC'){
      this.est_uimcec = String(true);
      this.showUIMCEC = true;
      // this.validateRequiredPmo()
    }else {
      // this.personContactForm.controls.pmoRefere.setValue(null);
      this.est_uimcec = String(false)
      this.showUIMCEC = false;
      // this.validateRequiredPmo()
    }
  }

  showHideCodeClientUIMCEC($event: any) {
    // console.log($event);
    if ($event == 'oui'){
      this.est_uimcec = String(true);
      this.showCodeClient = true;
      this.validateRequiredCodeClientUIMCEC()
    }else {
      this.personContactForm.controls.codeClient.setValue(null);
      this.est_uimcec = String(false)
      this.showCodeClient = false;
      this.validateRequiredCodeClientUIMCEC()
    }
  }

  checkTypeFile(tableau: string[],extension: string ){
    let verity = false;
    if(tableau?.indexOf(extension)!== -1){
      verity= true;

    }else{
      verity= false;
    }
    //console.log(verity);
    return verity;
  }

  lispays?: string[] = [];
  baseUrlFile = environment.baseUrlFile;

  OnGetCountries(){
    this.countriesService.getCountries().subscribe((response) =>{
      this.countries = response.countryPrefix;
      this.countries?.forEach((value: any) => {
        this.lispays?.push(value.pays)
      })
    })
  }
}

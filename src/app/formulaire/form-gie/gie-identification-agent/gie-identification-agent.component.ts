import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {FormGieComponent} from "../form-gie.component";
import {NiveauInstructionService} from "../../../services/configuration/niveau-instruction.service";
import {NiveauInstruction} from "../../../model/niveau-instruction";
import {TrancheAge} from "../../../model/tranche-age";
import {TrancheAgeService} from "../../../services/configuration/tranche-age/tranche-age.service";
import {FileService} from "../../../services/file/file.service";
import {IndicatifPaysService} from "../../../services/configuration/indicatif-pays/indicatif-pays.service";
import {environment} from "../../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";

@Component({
  selector: 'app-gie-identification-agent',
  templateUrl: './gie-identification-agent.component.html',
  styleUrls: ['./gie-identification-agent.component.scss']
})
export class GieIdentificationAgentComponent implements OnInit {
  currentStepPosition: number = this.formGieComponent.currentStepPosition;
  niveauInstructions?: NiveauInstruction[];
  niveauInstruction?: NiveauInstruction;
  trancheAges?: TrancheAge[];
  checkFile: boolean = false;

  @Input() agentInfo : any ;
  @Output() agentInfoChange = new EventEmitter<any>();
  documentCNINom: any;
  countries: any[] | null = null;
  baseUrlFile = environment.baseUrlFile;
  beneficiaireId: any;

  ValidatorsFront = Validators ;

  typePieces: string = '';
  checkCNIFileSize: boolean = true;


  constructor(private formGieComponent: FormGieComponent,
              private fb: UntypedFormBuilder,
              private changeDetector: ChangeDetectorRef,
              private niveauInstructionService: NiveauInstructionService,
              private trancheAgeService: TrancheAgeService,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private countriesService: IndicatifPaysService,
              private activateRoute: ActivatedRoute) {
    this.beneficiaireId = this.activateRoute.snapshot.params.beneficiaire;
  }

  agentForm = this.fb.group(
    {
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      numeroMobile: ['', [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
      email: ['', Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')],
      adressePhysique: ['', Validators.required],
      age: [''],
      numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
      documentCNI: ['', Validators.required],
      niveauInstruction: ['', Validators.required],
      countryIndicatif: [''],
    }
  );
  submitted: boolean = false;


  ngOnInit(): void {
    if (this.agentInfo){
      this.agentForm.patchValue({...this.agentInfo})
      // this.documentCNINom = this.documentCNINom;
    }
    this.onGetNiveauInstruction();
    this.onGetTrancheAge();
    this.OnGetCountries();


    // manage the requirement
    if( (localStorage.getItem("radioValue") &&  localStorage.getItem("radioValue") =="non")
    ||
    (this.agentInfo && this.agentInfo.personAgentSame && this.agentInfo.personAgentSame == false ) ){

  console.log('Obligatoire Agent' , localStorage.getItem('radioValue'));
  this.agentForm.controls.prenom.addValidators(Validators.required);
  this.agentForm.controls.prenom.updateValueAndValidity();

  this.agentForm.controls.nom.addValidators(Validators.required);
  this.agentForm.controls.nom.updateValueAndValidity();

  // this.agentForm.controls.genre.addValidators(Validators.required);
  // this.agentForm.controls.genre.updateValueAndValidity();

      this.agentForm.controls.numeroMobile.addValidators([Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]);
      this.agentForm.controls.numeroMobile.updateValueAndValidity();

 // this.agentForm.controls.email.addValidators(Validators.required);
  this.agentForm.controls.adressePhysique.addValidators(Validators.required);
  this.agentForm.controls.adressePhysique.updateValueAndValidity();

  this.agentForm.controls.age.addValidators(Validators.required);
  this.agentForm.controls.age.updateValueAndValidity();

  this.agentForm.controls.numeroCNI.addValidators(Validators.required);
  this.agentForm.controls.numeroCNI.updateValueAndValidity();

  this.agentForm.controls.niveauInstruction.addValidators(Validators.required);
  this.agentForm.controls.niveauInstruction.updateValueAndValidity();

  // this.agentForm.controls.nombrePersonCharge.addValidators(Validators.required);
  // this.agentForm.controls.nombrePersonCharge.updateValueAndValidity();

  this.agentForm.controls.documentCNI.addValidators(Validators.required);
  this.agentForm.controls.documentCNI.updateValueAndValidity();

  this.agentForm.updateValueAndValidity();

  console.log('agent form after update ' , this.agentForm);
}
    this.agentForm.controls["numeroCNI"].disable();
    this.checkCNIFileSize = true;
  }


  onClikTypePieces($event: any){
    console.log("type de piece choisi : " + $event)
    this.agentForm.controls["numeroCNI"].enable();
  }

  pre() {
    this.formGieComponent.pre();
  }

  next() {
    this.submitted = true
    if (this.agentForm.valid && this.typePieces != '') {
      this.agentInfoChange.emit({...this.agentForm.getRawValue(), documentCNINom: this.documentCNINom});
      this.formGieComponent.next();
    }

  }

  done() {
    this.formGieComponent.done()
  }

  validator() {
    return this.agentForm.valid;

  }

  convertToString(value : any ){
    return JSON.stringify(value);
  }

  loadDocumentCNI(event:any){
    let tableau: string[] = ['\'image/jpeg\'','pdf','png','jpg','jpeg'];
    this.checkFile = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
    // check if file exist
    const [file] = event.target.files;
    if (event.target.files && event.target.files.length) {

      this.checkCNIFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');
      if (this.checkCNIFileSize) {
        this.agentForm.patchValue({
          documentCNINom: file,
        })
        // need to run CD since file load runs outside of zone
        this.changeDetector.markForCheck();
        const formData = new FormData();
        formData.append('file', file);
        this.fileService.save(formData, 'CNI').subscribe(
          response => {
            //console.log(response);
            this.documentCNINom = response.reponse
          },
          () => {
            //console.log(error)
          }
        )

      } else {
        console.log("Fichier trop lourd !!!!!");
        this.agentForm.controls.documentCNI.setValue('');
      }


    }this.checkFile = false;
    }else{
      this.checkFile = true;
      this.agentForm.controls.documentCNI.setValue('');
    }
  }

  onGetNiveauInstruction(){
    this.niveauInstructionService.getAll().subscribe((response) => {
      this.niveauInstructions = response;
    })

  }

  onGetTrancheAge(){
    this.trancheAgeService.getAll().subscribe((response) =>{
      this.trancheAges = response;
    })
  }
  checkTypeFile(tableau: string[],extension: string ){
    return tableau?.indexOf(extension) !== -1;
  }

  OnGetCountries(){
    this.countriesService.getCountries().subscribe((response) =>{
      this.countries = response.countryPrefix;
    })
  }

}

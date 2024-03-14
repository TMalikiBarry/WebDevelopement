import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {FormAnalysteMeComponent} from "../form-analyste-me.component";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TranchAnneeActivite} from "../../../model/tranch-annee-activite";
import {
  TranchAnneeActivitesService
} from "../../../services/configuration/secteur-activite/tranch-annee-activites.service";
import {TypeFinancementService} from "../../../services/configuration/type-financement/type-financement.service";
import {TypeFinancement} from "../../../model/type-financement";

@Component({
  selector: 'app-activite',
  templateUrl: './activite.component.html',
  styleUrls: ['./activite.component.scss']
})
export class ActiviteComponent implements OnInit {

  @Input() activite: any;
  @Output() activiteChange = new EventEmitter<any>();

  currentStepPosition: number = this.formAnalysteMeComponent.currentStepPosition;
  submitted: boolean = false;
  submitted2: boolean = false;
  nombreEntree: number = 0;
  nombrecollapes = 2;
  tranchAnneeActivites?: TranchAnneeActivite[];
  key1 = true;
  key2 = false;
  typefinancements?: TypeFinancement[];
  lotEtape1: string[] = ["nombreannee","fond","solvabilite","revenus","benefice","periodicite","revenusprevisionnels","beneficePrevisionnel","periodiciteprojet"];
  lotEtape2: string[] = ["apport","depenses","investissement","besoinreel","montantdemande","duree","nombreecheances", "typecredit"];
  activiteForm = this.fb.group({
    nombreannee: [''],
    fond: ['', [Validators.pattern('[0-9]+')]],
    solvabilite: [''],
    revenus: ['', [Validators.pattern('[0-9]+')]],
    benefice: ['',[Validators.pattern('[0-9]+')]],
    periodicite: [''],
    revenusprevisionnels: ['', [Validators.pattern('[0-9]+')]],
    beneficePrevisionnel: ['', Validators.pattern('[0-9]+')],
    periodiciteprojet: [''],
    apport: ['',[Validators.pattern('[0-9]+')]],
    depenses: ['', [Validators.pattern('[0-9]+')]],
    investissement: ['', Validators.pattern('[0-9]+')],
    besoinreel: ['', [Validators.pattern('[0-9]+'), Validators.min(0)]],
    montantdemande: ['', [Validators.pattern('[0-9]+')]],
    datecredit: [''],
    montantcredit: ['', [Validators.pattern('[0-9]+')]],
    duree: ['', [Validators.pattern('[0-9]+')]],
    nombreecheances: ['', Validators.pattern('[0-9]+')],
    typecredit  : ['']

  });

  constructor(private fb: UntypedFormBuilder, private formAnalysteMeComponent: FormAnalysteMeComponent, private notification: NzNotificationService,
              private tranchAnneeActivitesService: TranchAnneeActivitesService,  private changeDetector: ChangeDetectorRef,  private typefinancementservice: TypeFinancementService) { }

  ngOnInit(): void {
    this.onGetTypeFinancement();
    this.onGetTranchAnneeActivite()
    this.activiteForm.controls.besoinreel.disable();
  }

  pre() {
    this.formAnalysteMeComponent.pre();
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    if (this.activiteForm.valid && this.nombreEntree !== 0) {
      this.activiteChange.emit({

        ...this.activiteForm.getRawValue()
      });

      this.formAnalysteMeComponent.next();


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
    this.formAnalysteMeComponent.done()
  }
  onGetTranchAnneeActivite(){
    this.tranchAnneeActivitesService.getAll().subscribe((response) => {
      this.tranchAnneeActivites = response;
      this.changeDetector.markForCheck();
    })
  }
  convertToString(value : any){
    return JSON.stringify(value);
  }
  onGetTypeFinancement(){
    this.typefinancementservice.getAll().subscribe((response) =>{
      this.typefinancements = response.filter(item => item.typeBeneficiaires?.indexOf("ME")!== -1);

    });
  }

  calculbesoinreel() {
    if(this.activiteForm.controls.apport.valid && this.activiteForm.controls.depenses.valid  && this.activiteForm.controls.investissement.valid ){
      let result =( this.activiteForm.controls.apport.value  -(this.activiteForm.controls.depenses.value +this.activiteForm.controls.investissement.value));
      this.activiteForm.controls.besoinreel.setValue(result.toFixed(2));
    }
    else{
      this.activiteForm.controls.besoinreel.setValue('');
    }
  }
}

import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {FormAnalysteMeComponent} from "../form-analyste-me.component";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Garantie} from "../../../model/garantie";
import {GarantieService} from "../../../services/configuration/garanties/garantie.service";

@Component({
  selector: 'app-capacite-remboursement',
  templateUrl: './capacite-remboursement.component.html',
  styleUrls: ['./capacite-remboursement.component.scss']
})
export class CapaciteRemboursementComponent implements OnInit {



  @Input() capacite: any;
  @Output() capaciteChange= new EventEmitter<any>();

  @Input() stepname: any;
  @Input() showModel: any;
  currentStepPosition: number = this.formAnalysteMeComponent.currentStepPosition;
  submitted: boolean = false;
  submitted2: boolean = false;
  nombreEntree: number = 0;
  nombrecollapes = 2;
  key1 = true;
  key2 = false;
  garanties?: Garantie[];
  lotEtape1: string[] = ["revenusperso","beneficeprevisionnel","depensesperso","remboursementmensuel","marge","typegaranties"];
  lotEtape2: string[] = ["atouts","competence","formation","concurrence","reglementation","estimationatoutrisque","hypotheses", "risquesinherents","besoinformation","avis"];
  capaciteForm = this.fb.group({
    revenusperso: ['', [Validators.pattern('[0-9]+')]],
    beneficeprevisionnel: ['', [Validators.pattern('[0-9]+')]],
    depensesperso: ['', [Validators.pattern('[0-9]+')]],
    remboursementmensuel: ['', [Validators.pattern('[0-9]+')]],
    marge: [],
    typegaranties: [''],
    atouts: [''],
    competence: [''],
    formation: [''],
    concurrence: [''],
    reglementation: [''],
    estimationatoutrisque: [''],
    hypotheses: [''],
    risquesinherents: [''],
    besoinformation: [''],
    avis: ['']

  });

  constructor(private fb: UntypedFormBuilder, private formAnalysteMeComponent: FormAnalysteMeComponent, private notification: NzNotificationService,
              private garantiService: GarantieService) { }
  ngOnInit(): void {
    this.showModel = false;
    this.onGetGaranties();
    this.capaciteForm.controls.marge.disable();
  }

  pre() {
    this.formAnalysteMeComponent.pre();
  }

  next() {
    console.log("Entrer dans la focntion suivante")
    this.submitted = true;
    this.submitted2 = false;
    if (this.capaciteForm.valid && this.nombreEntree !== 0) {
      this.capaciteChange.emit({

        ...this.capaciteForm.getRawValue()

      });

      this.formAnalysteMeComponent.next();

    }else {
      for (let control of this.lotEtape1) {
        if (this.capaciteForm.controls[control].invalid) {
          this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;
        }
      }

      this.key1 = false;
      this.key2 = true;
      if (this.nombreEntree !== 0) {
        for (let control of this.lotEtape2) {
          if (this.capaciteForm.controls[control].invalid) {
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
    this.formAnalysteMeComponent.done();
  }
  handleOkStep(): void {
    if (this.stepname === "l'identifcation") {
      this.formAnalysteMeComponent.currentStepPosition = 0;

    } else if (this.stepname === "l'activité") {
      this.formAnalysteMeComponent.currentStepPosition = 1;

    } else if (this.stepname === "la capacité") {
      this.formAnalysteMeComponent.currentStepPosition = 2;

    }
    this.showModel = false;
  }
  handleCancelStep(): void {
    this.showModel = false;
  }
  onGetGaranties(){
    this.garantiService.getAll().subscribe((response) =>{
      this.garanties = response;
    });
  }
  convertObject(value: any) {
    return JSON.stringify(value);
  }

  calculMarge() {
    if(this.capaciteForm.controls.revenusperso.valid && this.capaciteForm.controls.beneficeprevisionnel.valid && this.capaciteForm.controls.depensesperso.valid && this.capaciteForm.controls.remboursementmensuel.valid ){
      let result = (this.capaciteForm.controls.revenusperso.value +this.capaciteForm.controls.beneficeprevisionnel.value) -(this.capaciteForm.controls.depensesperso.value +this.capaciteForm.controls.remboursementmensuel.value);
      this.capaciteForm.controls.marge.setValue(result);
    }
    else{
      this.capaciteForm.controls.marge.setValue(0);
    }
  }
}

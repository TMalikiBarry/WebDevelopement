import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {FormAjoutUserPMOComponent} from "../form-ajout-user.component";
import {Subscription} from "rxjs";
import {NzModalService} from "ng-zorro-antd/modal";
import {UniqueLoginValidator} from 'src/app/core/customValidators/asyncValidators/UniqueLoginValidator';
import {DataService} from 'src/app/services/data_service/data_service';
import {GestionUsersComponent} from '../../gestion-user/gestion-user.component';
import {PmoService} from "../../../../services/pmo/pmo.service";
import {StorageService} from "../../../../services/Storage/storage.service";

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription;
  currentStepPosition: number = this.formAjoutUserPMOComponent.currentStepPosition;

  @Input() apiResponse: any;

  @Input() stepname : any;
  @Input() showModel: any;

  @Input() showCodeOtpForm: any;
  showSuccess = false ;
  submitted: boolean = false;
  isVisible = false;
  passwordVisible = false ;
  confirmPasswordVisible = false ;
  isSpinningRegister: boolean =false;


  @Input()   nombreSecond: any;
  @Input() renvoiCode: any;

  @Input() connexionInfo : any ;
  @Output() connexionInfoChange = new EventEmitter<any>();

  connexionForm = this.fb.group({
    username :  [ '' , [ Validators.required ,
      Validators.pattern('(^(?![0-9]*$)[a-zA-Z0-9\\._-]{4,}$)|(^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$)|(((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7})')
    , ]],
    password : [ '' ,  [Validators.required ,Validators.pattern('(.{8,})') ] ],
    passwordConfirmation : [ '' ,  [Validators.required ,Validators.pattern('(.{8,})') ]  ],
    role : [ '' ,  [Validators.required] ]
  });

  roles: any[] = [
    {
      libelle: 'Superviseur',
      value: 'SUPERVISEUR_PMO',

    },
    {
      libelle: 'Agent',
      value: 'AGENT_PMO',

    },
    {
      libelle: 'Itinérant',
      value: 'ITINERANT',

    }
  ];
  rolesTouch : any[] = [
    {
      libelle: 'Agent Initiateur',
      value: 'AGENT_INITIATEUR',

    },
    {
      libelle: 'Agent Validateur',
      value: 'AGENT_VALIDATEUR',

    },
    {
      libelle: 'Analyste Financier',
      value: 'ANALYSTE_FINANCIER',

    },
  ]

  otpForm = this.fb.group({
    code : ['' , Validators.required]
  });
  cguChecked: boolean = false;


  constructor(private fb: UntypedFormBuilder,
              private formAjoutUserPMOComponent: FormAjoutUserPMOComponent,
              private notification : NzNotificationService,
              private gestionUsersComponent: GestionUsersComponent,
              private data: DataService,
              private modal: NzModalService,
              private pmo : PmoService,
              private storage: StorageService,
              private loginValidator : UniqueLoginValidator) {}

  ngOnInit( ):void {
    let user = JSON.parse(this.storage.getItem('currentUser') || '{}');
    this.pmo.getById(user.idParent).subscribe(data => {
      console.log("user pmo : "+ data.sigle)
      if(data.sigle === 'INTOUCH'){
        this.rolesTouch.forEach(role => {
          this.roles.push(role)
        })
        console.log(this.roles)
      }
    })
    this.subscription=this.data.apiResponse.subscribe((data: any) => {
      console.log(data);
      if(data?.trim()=='ok'){
        this.showSuccess = true;
        this.gestionUsersComponent.onGetAllUsersPMO();
      }
      // this.showModel = false;
    });

  }

  closeModal(){

  }

  pre() {
    this.formAjoutUserPMOComponent.pre()
  }

  next() {
    this.submitted = true
    this.isVisible = true;
  }

  done() {
    this.formAjoutUserPMOComponent.done()
  }

  validator(){
    console.log('page de connexion valide ');
  }

  errorOtp(): void {
    this.modal.error({
      nzTitle: 'Erreur Code de Validation',
      nzContent: 'Veuillez saisir le bon Code de validation'
    });
  }

  convertObject(value: any){
    return JSON.stringify(value)
  }

  handleStepOk(): void {
    if(this.stepname === "la personne contact"){
      this.formAjoutUserPMOComponent.currentStepPosition =0;
    }
    this.showModel = false;
  }

  handleStepCancel(): void {
    this.showModel = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  valider() {
    console.log(this.connexionForm)
    if(this.connexionForm.valid){
      if(this.connexionForm.controls.password.value == this.connexionForm.controls.passwordConfirmation.value){
        console.log(this.connexionForm.getRawValue());
        this.connexionInfoChange.emit(this.connexionForm.getRawValue());
        this.formAjoutUserPMOComponent.next();
        this.connexionForm.reset();
      }
      else{
        this.notification.error('Attention','Les mots de passe ne sont pas identiques')
      }
      this.isVisible = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}


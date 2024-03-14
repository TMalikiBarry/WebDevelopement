import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EbEntrepriseComponent} from "../eb-entreprise.component";
import {TypeFinancementService} from "../../../../../services/configuration/type-financement/type-financement.service";
import {GarantieService} from "../../../../../services/configuration/garanties/garantie.service";
import {StatutService} from "../../../../../services/configuration/statut-financement/statut.service";
import {InstitutionService} from "../../../../../services/configuration/institution-financiere/institution.service";
import {CreditService} from "../../../../../services/configuration/type-credit/credit.service";
import {TypeFinancement} from "../../../../../model/type-financement";
import {Garantie} from "../../../../../model/garantie";
import {Statut} from "../../../../../model/Statut";
import {Institution} from "../../../../../model/Institution";
import {TypeCredit} from "../../../../../model/TypeCredit";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {maxValidator, minValidator, pasteDateValidator} from "../../../../../core/customValidators/past-date-validator";
import {FileService} from "../../../../../services/file/file.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {CurrencyPipe} from "@angular/common";
import {environment} from 'src/environments/environment';
import {Subscription} from 'rxjs';
import {DataService} from 'src/app/services/data_service/data_service';
import {CheckFileSize} from "../../../../../core/utils/checker/checkFileSize";

@Component({
  selector: 'app-demande-financement',
  templateUrl: './demande-financement.component.html',
  styleUrls: ['./demande-financement.component.scss']
})
export class DemandeFinancementComponent implements OnInit, OnDestroy {
  date: any;
  @Input() financementInfo: any;
  @Input() demande: any;
  @Output() financementInfoChange = new EventEmitter<any>();
  @Input() showSucces : boolean = false;
  @Input() demandeFin : boolean = true;
  @Input() stepname : any;
  @Input() showModel: any;
  submitted2: boolean = false;
  submitted: boolean = false;
  radioValue: string='non' ;
  isRequired: boolean = false;
  checkFinFileSize: boolean = true;
  tableauFinancementNom: any;
  financementTemp: any;
  listefinancements : any[] = [];
  currentIdFinancement = 0;
  financementValidity = false ;
  show: boolean = false;
  baseUrlFile = environment.baseUrlFile;
  duree: number = 0;
  key1 = true;
  key2 = false;
  nombreEntree: number = 0;
  libelleDuree: string = 'Durée souhaitée en nombre de mois';
  // libelleMontant: string = 'Montant demandé en Francs CFA';
  libelleMontant: string = 'Montant demandé en Francs CFA [Minimum: 500 000 - Maximum: 50 000 000]';
  checkFile: boolean = false;
  dateMaxCreation = new Date();
  subscription: Subscription = new Subscription;
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth() + 1) + '-' + (this.dateMaxCreation.getDate() >= 10 ? this.dateMaxCreation.getDate() : '0' + this.dateMaxCreation.getDate());
  demandeFinancementForm = this.fb.group({
    typefinancement: ['', Validators.required],
    // montantdemande  : ['' , [Validators.required,Validators.pattern('^[0-9\\s]*$')]],
    montantdemande: ['', [Validators.required, Validators.pattern('^[0-9\\s]*$'), minValidator("500 000"), maxValidator("50 000 000")]],
    coutProjet: ['', [Validators.required, Validators.pattern('^[0-9\\s]*$'), minValidator("3000")]],
    //apport  : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    //garantie  : ['' , Validators.required],
    //valeurGarantie  : ['' , [Validators.required,Validators.pattern('^[0-9\\s]*$')]],
    tauxInteret: ['', [Validators.required, Validators.pattern('[0-9]*.[0-9]*')]],
    duree: ['', [Validators.required, Validators.pattern('[0-9]+')]],

  })

  constructor(private eb: EbEntrepriseComponent,
              private typefinancementservice: TypeFinancementService,
              private garantiService: GarantieService,
              private statutservice: StatutService,
              private institutionService: InstitutionService,
              private fb: UntypedFormBuilder,
              private data: DataService,
              private changeDetector: ChangeDetectorRef,
              private typeCreditService: CreditService,
              private checkFileSize: CheckFileSize,
              private router: Router,
              private fileService: FileService,
              private notificationService: NzNotificationService,
              private currencyPipe: CurrencyPipe) { }
  financementForm = this.fb.group({
    institutionFinanciere  : ['' ],
    autreInstitution  : ['' ],
    typeCredit  : ['' ],
    montant  : ['',Validators.pattern('^[0-9\\s]*$')],
    tauxInteretHt  : ['',Validators.pattern('[0-9]*.[0-9]*') ],
    dateMepFinancement  : ['',pasteDateValidator ],
    statutFinancement  : [''],
    tableauxFinancement  : ['' ],
    dateRemboursement  : ['' ,pasteDateValidator ]
  })

  typefinancement?: TypeFinancement;
  typefinancements?: TypeFinancement[];
  garantie?: Garantie;
  garanties?: Garantie[];
  statut?: Statut;
  statuts?: Statut[];
  institution?: Institution;
  institutions?: Institution[];
  typeCredit?: TypeCredit;
  typeCredits?: TypeCredit[];

  ngOnInit(): void {
    this.subscription=this.data.message.subscribe((data: string) => {
      // console.log('Babs message',data);
      let message: string = data;
      if(message.trim().length!=0){
        this.stepname = data;
        this.showModel = true;
      }
      this.financementForm.controls.autreInstitution.disable();
    });

    console.log(this.demande);
    //let garantie = JSON.stringify(this.demande.garantie);
    //let valeurGarantie = JSON.stringify(this.demande.valeurGarantie);
    this.demandeFinancementForm.controls.typefinancement.setValue(this.demande.typeDemande);

    // this.demandeFinancementForm.controls.montantdemande.setValue(''+this.demande.montant);
    //this.demandeFinancementForm.controls.apport.setValue(this.demande.apport);
    //this.demandeFinancementForm.controls.garantie.setValue(garantie);
    //this.demandeFinancementForm.controls.valeurGarantie.setValue(valeurGarantie);
    this.demandeFinancementForm.controls.tauxInteret.setValue(this.demande.tauxInteretAnnuelleSouhaite);
    this.demandeFinancementForm.controls.duree.setValue(this.demande.duree);
    this.demandeFinancementForm.controls.montantdemande.setValue(''+this.demande.montant);
    this.demandeFinancementForm.controls.coutProjet.setValue(this.demande.projets[0]?.cout);
    // this.demandeFinancementForm.controls.duree.setValue(this.demande.duree);

    // this.gestionDuree();
    // this.gestionGrilleMontant();
    // this.demandeFinancementForm.updateValueAndValidity();
    // this.changeDetectorRef.markForCheck();

    // this.listefinancements = this.demande.financementObtenus;
    for (let i = 0; i < this.demande.financementObtenus.length; i++) {
      const financement = this.demande.financementObtenus[i];
      let obj = {autreInstitution:financement.autreInstitutionFinanciere, dateMepFinancement:financement.dateFinancement, dateRemboursement:financement.dateRemboursement,
                 institutionFinanciere:financement.institutionFinanciere, montant:financement.montant, statutFinancement:financement.statusFinancement,
                 tableauFinancementNom:financement.tableauAmortissement, tauxInteretHt:financement.tauxInteretAnnuelHT, typeCredit:financement.typeCredit};

      this.listefinancements.push(obj);
    }

    if(this.demande?.financementObtenus?.length>0){
      this.radioValue = "oui"
      this.show = true;
      this.currentIdFinancement = this.demande?.financementObtenus?.length;
      // this.nombreEntree ++;
    }
    else{
      this.show = false;
      this.radioValue = "non"
    }

    // this.gestionDuree();
    // this.gestionGrilleMontant();
    this.demandeFinancementForm.updateValueAndValidity();
    this.changeDetector.markForCheck();

    this.onGetTypeFinancement()
    this.onGetGaranties()
    if(this.financementInfo){
      this.demandeFinancementForm.patchValue({
          ...this.financementInfo
        }
      );
      this.tableauFinancementNom = this.financementInfo.tableauFinancementNom;

    }
    this.showModel = false;
    this.formatNumber();
    this.checkFinFileSize = true;
  }
  controlLabel(){
    let etatlabel: boolean = false;
    if(this.radioValue == "oui"){
      etatlabel = true;
    }
    return etatlabel;

  }

  onChange($event: any) {

  }
  currentStepPosition: number = this.eb.currentStepPosition;


  pre() {
    this.eb.pre()
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    let listefinancementsTmp = this.listefinancements;
    console.log(this.demandeFinancementForm.valid);
    console.log(this.nombreEntree);
    // return;
    if (this.demandeFinancementForm.valid &&  this.nombreEntree !==0){
      if((this.listefinancements.length === 0 && this.radioValue == "non") ||  (this.listefinancements.length !== 0 && this.radioValue == "oui" )) {
        this.financementInfoChange.emit({listeFinancement:this.listefinancements ,...this.demandeFinancementForm.getRawValue()})
        this.eb.next();
      }else if (this.radioValue == "oui"){
        this.notificationService.error('Attention', " Veuillez ajouter au moins un financement");
        return;
      }
      else if(this.listefinancements.length > 0 && this.radioValue == "non") {
        // console.log(this.listefinancements.length);
        // console.log(this.radioValue);
        listefinancementsTmp = [];
        this.financementInfoChange.emit({listeFinancement:listefinancementsTmp ,...this.demandeFinancementForm.getRawValue()})
        this.eb.next();
      }
    }else {
      if(this.nombreEntree ===0) {
        if (this.demandeFinancementForm.invalid) {
          this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;
        }else {
          if (this.radioValue == "non") {
            listefinancementsTmp = [];
            this.financementInfoChange.emit({listeFinancement:listefinancementsTmp ,...this.demandeFinancementForm.getRawValue()})
            this.eb.next();
          }
        }
        if(this.radioValue == "oui") {
          this.key1 = false;
          this.key2 = true;
        }
      }
    }
    this.nombreEntree ++;
  }

  done() {
    this.eb.done()
  }

  onGetTypeFinancement(){
    this.typefinancementservice.getAll().subscribe((response) =>{
      this.typefinancements = response.filter(item => item.typeBeneficiaires?.indexOf("PME")!== -1);
      this.changeDetector.markForCheck();
    });


  }

  onGetGaranties(){
    this.garantiService.getAll().subscribe((response) =>{
      this.garanties = response;
      this.changeDetector.markForCheck();
    });
  }

  convertObject(value: any) {
    return JSON.stringify(value);
  }

  redirectionAcceuil() {
    this.router.navigate(["/beneficiaire"])
  }


  choose() {
    if(this.radioValue == "oui"){
      this.isRequired = true;
      this.financementForm.controls.institutionFinanciere.addValidators(Validators.required);
      this.financementForm.controls.institutionFinanciere.updateValueAndValidity()
      this.financementForm.controls.montant.addValidators([Validators.required,Validators.pattern('^[0-9\\s]*$')]);
      this.financementForm.controls.montant.updateValueAndValidity()
      this.financementForm.controls.statutFinancement.addValidators(Validators.required);
      this.financementForm.controls.statutFinancement.updateValueAndValidity()
      console.log(this.financementForm);
      this.show= true;

    }else{
      this.show = false;
    }
  }

  tableauFinancementLoad(event: any) {
    let tableau: string[] = ['pdf','docx','doc','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.checkFile = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if(event.target.files && event.target.files.length) {
        const [file] = event.target.files;

        this.checkFinFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');

        if (this.checkFinFileSize) {
          let formData = new FormData();

          formData.append('file', file);
          console.log(file)


          // set the name form the database
          this.fileService.save(formData, 'tableauFinancement').subscribe(
            response => {

              this.tableauFinancementNom = response.reponse;
              console.log(this.tableauFinancementNom);
              this.financementForm.patchValue({
                tableauxFinancement: this.tableauFinancementNom
              })
            }
            , error => {
              console.log(error);
            }
          )
        } else {
          this.financementForm.controls.tableauxFinancement.setValue('');
        }


      }this.checkFile = false;
    }else{
      this.checkFile = true;
      this.financementForm.controls.tableauxFinancement.setValue('');
    }

  }

  modifierFinancement(id : number){
    let financement = this.listefinancements.find(s => s.id == id );
    this.financementTemp = financement;
    console.log(financement)
    // this.financementForm.patchValue({...financement});
    let dateRemboursement;
    let dateFinancement;

    dateRemboursement = new Date(financement.dateRemboursement);
    dateFinancement = new Date(financement.dateMepFinancement);

    let dateFinancementMonth = '';
    let dateFinancementDay = '';
    if(dateFinancement.getMonth()<9){
      dateFinancementMonth = '0'+(dateFinancement.getMonth()+1);
    }
    else{
      dateFinancementMonth = (dateFinancement.getMonth()+1)+'';
    }

    if(dateFinancement.getDate()<10){
      dateFinancementDay = '0'+dateFinancement.getDate();
    }
    else{
      dateFinancementDay = dateFinancement.getDate()+'';
    }

    let dateRemboursementMonth = '';
    let dateRemboursementDay = '';
    if(dateRemboursement.getMonth()<9){
      dateRemboursementMonth = '0'+(dateRemboursement.getMonth()+1);
    }
    else{
      dateRemboursementMonth = (dateRemboursement.getMonth()+1)+'';
    }

    if(dateRemboursement.getDate()<10){
      dateRemboursementDay = '0'+dateRemboursement.getDate();
    }
    else{
      dateRemboursementDay = dateRemboursement.getDate()+'';
    }

    let strDateFinancement = dateFinancement.getFullYear() + '-' +dateFinancementMonth+'-'+dateFinancementDay;
    let strDateRemboursement = dateRemboursement.getFullYear() + '-' +dateRemboursementMonth+'-'+dateRemboursementDay;

    // this.financementForm.patchValue({...financement});
    this.tableauFinancementNom = financement.tableauFinancementNom;
    this.financementForm.controls.institutionFinanciere.setValue(financement.institutionFinanciere);
    this.gestionInstitution();
    this.financementForm.controls.autreInstitution.setValue(financement.autreInstitution);
    this.financementForm.controls.typeCredit.setValue(financement.typeCredit);
    // this.financementForm.controls.tableauxFinancement.setValue(financement.tableauxFinancement);
    this.financementForm.controls.montant.setValue(financement.montant);
    this.financementForm.controls.tauxInteretHt.setValue(financement.tauxInteretHt);
    this.financementForm.controls.dateMepFinancement.setValue(strDateFinancement);
    this.financementForm.controls.statutFinancement.setValue(financement.statutFinancement);
    this.financementForm.controls.dateRemboursement.setValue(strDateRemboursement);

    // this.financementForm.updateValueAndValidity();
    // this.changeDetector.markForCheck();

    this.currentIdFinancement--;
    if(this.currentIdFinancement == 0){
      this.financementValidity = false;
    }
    this.listefinancements = this.listefinancements.filter(s => s.id !== id)
  }

  confirmSuppressionFinancement(id : number ){
    console.log(this.listefinancements);
    this.listefinancements =  this.listefinancements.filter(
      s => {
        console.log(id);
        return  s.id !== id ;
      }
    );
    console.log(this.listefinancements)
  }

  testObject(){
    console.log(this.financementForm.getRawValue());
  }

  ajouterFinancement() {
    console.log("validity",this.financementForm.valid)
    this.submitted2 =  true;
    if(this.financementForm.valid){

      console.log(this.financementForm);
      // this.listefinancements.push({id: this.currentIdFinancement ,tableauFinancementNom :this.tableauFinancementNom, ...this.financementForm.getRawValue()})
      this.listefinancements.push({id: this.currentIdFinancement ,tableauFinancementNom :this.tableauFinancementNom, ...this.financementForm.getRawValue()})
      console.log(this.listefinancements);
      this.currentIdFinancement++;
      this.financementValidity = true;
      this.notificationService.success('Succés','Vous avez bien ajouté une demande de financement antérieure de  ' + this.financementForm.controls.montant.value );

      this.financementForm.reset();
      this.financementTemp = null;
      this.tableauFinancementNom = '';
      this.submitted2 =  false;

    }else{
      this.submitted2 =  true;
      this.notificationService.error('Attention'," Veuillez vérifier si tous les champs obligatoires d'ajout de financement sont remplis ");
    }
  }
  controlLabelInstitution(){
    let etat: boolean = false;
    // console.log(this.financementForm.controls.institutionFinanciere.value);
    if(this.radioValue == "oui" &&  this.financementForm.controls.institutionFinanciere.value == 'Autre institution'){
      etat = true;
    }
    return etat;
  }
  gestionInstitution() {
    console.log(this.financementForm.controls.institutionFinanciere.value);
    if( this.financementForm.controls.institutionFinanciere.value == 'Autre institution') {
      this.financementForm.controls.autreInstitution.enable();
      this.financementForm.controls.autreInstitution.addValidators(Validators.required);
      this.financementForm.controls.autreInstitution.updateValueAndValidity();
    } else {
      this.financementForm.controls.autreInstitution.disable();
      this.financementForm.controls.autreInstitution.setValue('');
    }
  }

  onChangeCoutProjetValidators() {
    this.demandeFinancementForm.controls.coutProjet.clearValidators();
    this.demandeFinancementForm.controls.coutProjet.addValidators([Validators.required, Validators.pattern('^[0-9\\s]*$'), minValidator(this.demandeFinancementForm.controls.montantdemande.value)]);
    this.demandeFinancementForm.controls.coutProjet.updateValueAndValidity();
  }

  gestionGrilleMontant() {

    let limitAmount: any[] = [];
    this.demandeFinancementForm.controls.montantdemande.clearValidators();
    this.demandeFinancementForm.controls.montantdemande.addValidators([Validators.required, Validators.pattern('^[0-9\\s]*$')])
    this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
    if (this.demandeFinancementForm.controls.typefinancement.value == 'Capital-investissement (quasi capital et avances remboursables)') {
      if (this.demandeFinancementForm.controls.duree.value <= 12) {
        limitAmount.push("7 000 000");
        limitAmount.push("50 000 000");
      }else{
        limitAmount.push("3 000 000");
        limitAmount.push("70 000 000");
      }

      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();


    }else if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit court terme, moins à égal à 12 mois'){
      limitAmount.push("1 000 000");
      limitAmount.push("60 000 000");

      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();

    }else if(this.demandeFinancementForm.controls.typefinancement.value =='Crédit moyen terme, supérieur à 12 mois'){
      limitAmount.push("10 000 000");
      limitAmount.push("70 000 000");

      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();

    }else if(this.demandeFinancementForm.controls.typefinancement.value =='Prêt d\'honneur'){
      if( this.demandeFinancementForm.controls.duree.value <= 9) {
        limitAmount.push("2 500 000");
        limitAmount.push("22 500 000");
      }

      else if( this.demandeFinancementForm.controls.duree.value <= 12) {
        limitAmount.push("2 500 000");
        limitAmount.push("11 111 111");
      }else{
        limitAmount.push("3 000 000");
        limitAmount.push("50 000 000");
      }
      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
    }


  }

  gestionDuree(){
    this.duree =0;
    // this.demandeFinancementForm.controls.duree.reset(null);
    // this.demandeFinancementForm.controls.montantdemande.reset(null);
    // this.libelleDuree = 'Durée souhaitée en nombre de mois';
    // this.libelleMontant = 'Montant demandé en Francs CFA ';
    console.log('babs entreprise');
    this.demandeFinancementForm.controls.duree.clearValidators();
    this.demandeFinancementForm.controls.duree.addValidators([Validators.required,Validators.pattern('[0-9]+')])
    // this.demandeFinancementForm.controls.duree.updateValueAndValidity({ onlySelf: true, emitEvent: true });

    if(this.demandeFinancementForm.controls.typefinancement.value == 'Capital-investissement (quasi capital et avances remboursables)'){
      this.duree = 24;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      // this.demandeFinancementForm.controls.duree.setValue(this.demande.duree);
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));
    }else if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit court terme, moins à égal à 12 mois'){
      this.duree = 12;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      // this.demandeFinancementForm.controls.duree.setValue(this.duree);
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));

    }else if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit moyen terme, supérieur à 12 mois'){
      this.duree = 24;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      console.log('ici court '+this.duree);
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));
    }
    else if(this.demandeFinancementForm.controls.typefinancement.value == 'Prêt d\'honneur'){
      this.duree = 24;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));

    }
    // this.changeDetector.markForCheck();
    this.demandeFinancementForm.controls.duree.markAsTouched();
    this.demandeFinancementForm.controls.duree.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    this.demandeFinancementForm.updateValueAndValidity();
    // console.log(this.demandeFinancementForm.valid);
  }

  handleStepOk(): void {
    if (this.stepname === "la description du projet") {
      this.eb.currentStepPosition = 0;

    }
    this.showModel = false;
    this.checkFinFileSize = true;

  }

  handleStepCancel(): void {
    this.showModel = false;
  }
  checkTypeFile(tableau: string[],extension: string ){
    return tableau?.indexOf(extension) !== -1;

  }
  formatNumber() {
    /*if (this.demandeFinancementForm.controls.montantdemande.value == null || this.demandeFinancementForm.controls.valeurGarantie.value == null || this.financementForm.controls.montant.value)
      return;*/
    let amount = this.currencyPipe.transform((this.demandeFinancementForm.controls.montantdemande.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm.controls.montantdemande.setValue(amount)

    /*let amount1 = this.currencyPipe.transform((this.demandeFinancementForm.controls.valeurGarantie.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm.controls.valeurGarantie.setValue(amount1)*/

    let amount2 = this.currencyPipe?.transform((this.financementForm?.controls?.montant?.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.financementForm?.controls?.montant?.setValue(amount2)

    let amount3 = this.currencyPipe.transform((this.demandeFinancementForm?.controls?.coutProjet?.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm?.controls?.coutProjet?.setValue(amount3)

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

function onlySelf(onlySelf: any, arg1: boolean) {
  throw new Error('Function not implemented.');
}


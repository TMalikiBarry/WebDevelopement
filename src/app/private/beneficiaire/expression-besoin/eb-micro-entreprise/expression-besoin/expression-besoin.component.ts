import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EbMicroEntrepriseComponent} from "../eb-micro-entreprise.component";
import {TypeFinancement} from "../../../../../model/type-financement";
import {TypeFinancementService} from "../../../../../services/configuration/type-financement/type-financement.service";
import {GarantieService} from "../../../../../services/configuration/garanties/garantie.service";
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
import {DataService} from 'src/app/services/data_service/data_service';
import {Subscription} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CheckFileSize} from "../../../../../core/utils/checker/checkFileSize";

@Component({
  selector: 'app-expression-besoin',
  templateUrl: './expression-besoin.component.html',
  styleUrls: ['./expression-besoin.component.scss']
})
export class ExpressionBesoinComponent implements OnInit {

  @Input() financementInfo : any ;
  @Input() demande : any;
  @Output() financementInfoChange = new EventEmitter<any>();

  @Input() showSucces : boolean = false;
  @Input() demandeFin : boolean = true;
  duree: number = 0;
  financementTemp: any;
  @Input() stepname : any;
  @Input() showModel: any;

  checkFinFileSize: boolean = true;

  checkFile: boolean = false;
  baseUrlFile = environment.baseUrlFile;
  dateMaxCreation = new Date();
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth()+1)+'-'+(this.dateMaxCreation.getDate()>=10 ? this.dateMaxCreation.getDate() : '0'+this.dateMaxCreation.getDate());



  libelleDuree: string = 'Durée souhaitée en nombre de mois';
  // libelleMontant: string = 'Montant demandé en Francs CFA';
  libelleMontant: string = 'Montant demandé en Francs CFA [Minimum: 50 000 - Maximum: 5 000 000]';
  demandeFinancementForm = this.fb.group({
    typefinancement  : ['', Validators.required],
    montantdemande  : ['' , [Validators.required,Validators.pattern('^[0-9\\s]*$'),minValidator("50 000"),maxValidator("5 000 000")]],
    coutProjet: ['', [Validators.required,Validators.pattern('^[0-9\\s]*$'), minValidator("4 000")]],
    //apport  : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    //garanties  : ['' , Validators.required],
    //valeurGaranties  : ['' , [Validators.required,Validators.pattern('^[0-9\\s]*$')]],
    tauxInteret  : ['' , [Validators.required,Validators.pattern('[0-9]*.[0-9]*')]],
    duree  : ['' , [Validators.required,Validators.pattern('[0-9]+')]],


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
  listefinancements : any[] = [];
  user = null;
  date = null;
  radioValu: string='non' ;
  isRequired: boolean = false;
  submitted: boolean = false;
  submitted2: boolean = false;
  tableauFinancementNom: any;
  currentIdFinancement = 0;
  financementValidity = false ;
  show: boolean = false;
  key1= true;
  key2= false;
  nombreEntree: number = 0;
  subscription: Subscription = new Subscription;

  constructor(private eb: EbMicroEntrepriseComponent,
              private typefinancementservice: TypeFinancementService,
              private garantiService : GarantieService,
              private fb : UntypedFormBuilder,
              private data: DataService,
              private router: Router,
              private changeDetectorRef : ChangeDetectorRef,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private notificationService: NzNotificationService,
              private currencyPipe: CurrencyPipe) { }

  financementForm = this.fb.group({
    institutionFinanciere  : ['' ],
    autreInstitution  : [''],
    typeCredit  : ['' ],
    montant  : ['' ,Validators.pattern('^[0-9\\s]*$')],
    tauxInteretHT  : ['' ,Validators.pattern('[0-9]+')],
    datemepFinancement  : ['' ,pasteDateValidator ],
    statutFinancement  : [''],
    tableauFinancement  : [''],
    dateRemboursement  : ['' ,pasteDateValidator ],
  })

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

    //console.log(this.demande);
    //let garantie = JSON.stringify(this.demande.garantie);
    //let valeurGarantie = JSON.stringify(this.demande.valeurGarantie);
    this.demandeFinancementForm.controls.typefinancement.setValue(this.demande.typeDemande);

    // this.demandeFinancementForm.controls.montantdemande.setValue(''+this.demande.montant);
    //this.demandeFinancementForm.controls.apport.setValue(this.demande.apport);
    //this.demandeFinancementForm.controls.garanties.setValue(garantie);
    //this.demandeFinancementForm.controls.valeurGaranties.setValue(valeurGarantie);
    this.demandeFinancementForm.controls.tauxInteret.setValue(this.demande.tauxInteretAnnuelleSouhaite);
    this.demandeFinancementForm.controls.duree.setValue(this.demande.duree);
    this.demandeFinancementForm.controls.montantdemande.setValue(''+this.demande.montant);
    this.demandeFinancementForm.controls.coutProjet.setValue(this.demande.projets[0]?.cout);

    this.gestionDuree();
    // this.gestionGrilleMontant();
    // this.demandeFinancementForm.updateValueAndValidity();
    // this.changeDetectorRef.markForCheck();

    // this.listefinancements = this.demande.financementObtenus;
    for (let i = 0; i < this.demande.financementObtenus.length; i++) {
      const financement = this.demande.financementObtenus[i];
      let obj = {autreInstitution:financement.autreInstitutionFinanciere, datemepFinancement:financement.dateFinancement, dateRemboursement:financement.dateRemboursement,
                 institutionFinanciere:financement.institutionFinanciere, montant:financement.montant, statutFinancement:financement.statusFinancement,
                 tableauFinancementNom:financement.tableauAmortissement, tauxInteretHT:financement.tauxInteretAnnuelHT, typeCredit:financement.typeCredit};

      this.listefinancements.push(obj);
    }

    if(this.demande?.financementObtenus?.length>0){
      this.radioValu = "oui"
      this.show = true;
      this.currentIdFinancement = this.demande?.financementObtenus?.length;
      // this.nombreEntree ++;
    }
    else{
      this.show = false;
      this.radioValu = "non"
    }

    // this.gestionDuree();
    // this.gestionGrilleMontant();
    this.demandeFinancementForm.updateValueAndValidity();
    this.changeDetectorRef.markForCheck();

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
  log(): void {
    //console.log('click dropdown button');
  }
  onChange(result: Date): void {
    //console.log('onChange: ', result);
  }
  deleteUser(){

  }


  onGetTypeFinancement(){
    this.typefinancementservice.getAll().subscribe((response) =>{
      this.typefinancements = response.filter(item => item.typeBeneficiaires?.indexOf("ME")!== -1);
      this.changeDetectorRef.markForCheck();
    });
  }

  onGetGaranties(){
    this.garantiService.getAll().subscribe((response) =>{
      this.garanties = response;
    });
  }



  currentStepPosition: number = this.eb.currentStepPosition;

  pre() {
    this.eb.pre()
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    //console.log(this.listefinancements);
    let listefinancementsTmp = this.listefinancements;
    if (this.demandeFinancementForm.valid &&  this.nombreEntree !==0){
      //console.log('test1');
      if((this.listefinancements.length === 0 && this.radioValu == "non") ||  (this.listefinancements.length !== 0 && this.radioValu == "oui" )) {
        //console.log('test1 bis');
        //console.log(this.listefinancements);
        this.financementInfoChange.emit({listeFinancement: listefinancementsTmp, ...this.demandeFinancementForm.getRawValue()})
        this.eb.next()
      }
      else if (this.radioValu == "oui"){
        //console.log('test2');
        this.notificationService.error('Attention', " Veuillez ajouter au moins un financement");
        return;
      }
      else if(this.listefinancements.length > 0 && this.radioValu == "non") {
        // console.log(this.listefinancements.length);
        // console.log(this.radioValue);
        listefinancementsTmp = [];
        this.financementInfoChange.emit({listeFinancement: listefinancementsTmp, ...this.demandeFinancementForm.getRawValue()})
        this.eb.next();
      }
    }else {
      if(this.nombreEntree ===0) {
        //console.log('test3');
        if (this.demandeFinancementForm.invalid) {
          //console.log('test4');
          this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;
        }else{
          //console.log('test5');
          if(this.radioValu == "non"){
            listefinancementsTmp = [];
            this.financementInfoChange.emit({listeFinancement: listefinancementsTmp, ...this.demandeFinancementForm.getRawValue()})
            this.eb.next();
          }
        }
        if(this.radioValu == "oui") {
          //console.log('test7');
          this.key1 = false;
          this.key2 = true;
        }
      }else if(this.nombreEntree !==0){
        //console.log('test8');
        if(this.listefinancements.length === 0 && this.radioValu == "oui"){
          this.notificationService.error('Attention', " Veuillez ajouter au moins un financement");
          return;
        }
      }
    }
    this.nombreEntree ++;

  }

  done() {
    this.eb.done()
  }
  convertObject(value: any) {
    return JSON.stringify(value);
  }
  redirectionAcceuil() {
    this.router.navigate(["/beneficiaire"])
  }

  choose() {
    if(this.radioValu == "oui"){
        this.isRequired = true;
      this.financementForm.controls.institutionFinanciere.addValidators(Validators.required);
      this.financementForm.controls.institutionFinanciere.updateValueAndValidity()
      this.financementForm.controls.montant.addValidators([Validators.required,Validators.pattern('^[0-9\\s]*$')]);
      this.financementForm.controls.montant.updateValueAndValidity();
      this.financementForm.controls.statutFinancement.addValidators(Validators.required);
      this.financementForm.controls.statutFinancement.updateValueAndValidity();

      // this.financementForm.controls.institutionFinanciere.setValue(this.demande.institutionFinanciere);
      // this.financementForm.controls.autreInstitution.setValue(this.demande.autreInstitutionFinanciere);
      // this.financementForm.controls.typeCredit.setValue(this.demande.typeCredit);
      // this.financementForm.controls.montant.setValue(this.demande.montant);
      // this.financementForm.controls.tauxInteretHT.setValue(this.demande.tauxInteretAnnuelHT);
      // this.financementForm.controls.datemepFinancement.setValue(this.demande.dateFinancement);
      // this.financementForm.controls.statutFinancement.setValue(this.demande.statusFinancement);
      // // this.financementForm.controls.tableauFinancement.setValue(this.demande.);
      // this.financementForm.controls.dateRemboursement.setValue(this.demande.dateRemboursement);

      //console.log(this.financementForm);
      this.show = true;
    }else{
      this.show = false;
    }
  }

  tableauFinancementLoad(event: any) {
    let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.checkFile = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
    // check if file exist
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      this.checkFinFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');

      if (this.checkFinFileSize) {
        let formData = new FormData();

        formData.append('file', file);
        //console.log(file)



        // set the name form the database
        this.fileService.save(formData , 'tableauFinancement').subscribe(
          response => {

            this.tableauFinancementNom = response.reponse ;
            //console.log(this.tableauFinancementNom);
            this.financementForm.patchValue({
              tableauxFinancement: this.tableauFinancementNom
            })
          }
          ,error=>{
            //console.log(error);
          }
        )
      }else {
        this.financementForm.controls.tableauFinancement.setValue('');
      }

    } this.checkFile = false;
    }else{
      this.checkFile = true;
      this.financementForm.controls.tableauFinancement.setValue('');
    }
  }
  modifierFinancement(id : number){
    let financement = this.listefinancements.find(s => s.id == id );
    //console.log(financement)
    // this.financementForm.patchValue({...financement});
    this.financementTemp = financement;
    console.log(financement)
    let dateRemboursement;
    let dateFinancement;

    dateRemboursement = new Date(financement.dateRemboursement);
    dateFinancement = new Date(financement.datemepFinancement);

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
    this.financementForm.controls.tauxInteretHT.setValue(financement.tauxInteretHt);
    this.financementForm.controls.datemepFinancement.setValue(strDateFinancement);
    this.financementForm.controls.statutFinancement.setValue(financement.statutFinancement);
    this.financementForm.controls.dateRemboursement.setValue(strDateRemboursement);

    this.currentIdFinancement--;
    if(this.currentIdFinancement == 0){
      this.financementValidity = false;
    }
    this.listefinancements = this.listefinancements.filter(s => s.id !== id)

  }

  confirmSuppressionFinancement(id : number ){
    //console.log(this.listefinancements);
    this.listefinancements =  this.listefinancements.filter(
      s => {
        //console.log(id);
        return  s.id !== id ;
      }
    );
    //console.log(this.listefinancements)
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

  controlLabel(){
    let etatlabel: boolean = false;
    if(this.radioValu == "oui"){
      etatlabel = true;
    }
    return etatlabel;

  }
  controlLabelInstitution(){
    let etat: boolean = false;
    // //console.log(this.financementForm.controls.institutionFinanciere.value);
    if(this.radioValu == "oui" &&  this.financementForm.controls.institutionFinanciere.value == 'Autre institution'){
      etat = true;
    }
    return etat;
  }
  gestionInstitution() {
    // //console.log(this.financementForm.controls.institutionFinanciere.value);
    if( this.financementForm.controls.institutionFinanciere.value == 'Autre institution') {
      this.financementForm.controls.autreInstitution.enable();
      this.financementForm.controls.autreInstitution.addValidators(Validators.required);
      this.financementForm.controls.autreInstitution.updateValueAndValidity();
    }
    else {
      this.financementForm.controls.autreInstitution.disable();
      this.financementForm.controls.autreInstitution.setValue('');
    }
  }

  gestionGrilleMontant(){

    var  limitAmount : string[] = [];
    this.demandeFinancementForm.controls.montantdemande.clearValidators();
    this.demandeFinancementForm.controls.montantdemande.addValidators([Validators.required,Validators.pattern('^[0-9\\s]*$')])
    this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
    if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit d\'urgence COVID 19'){
      limitAmount.push("150 000");
      limitAmount.push("400 000");
      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();


    }else if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit court terme, moins à égal à 12 mois'){
      limitAmount.push("100 000");
      limitAmount.push("700 000");
      //console.log(limitAmount);
      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();

    }else if(this.demandeFinancementForm.controls.typefinancement.value =='Crédit moyen terme, supérieur à 12 mois'){
        limitAmount.push("100 000");
        limitAmount.push("650 000");

      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();

    }
    // this.demandeFinancementForm.controls.montantdemande.setValue(''+this.demande.montant);

  }

  gestionDuree(){
    this.duree =0;
    // this.demandeFinancementForm.controls.duree.reset(null);
    // this.demandeFinancementForm.controls.montantdemande.reset(null);
    // this.demandeFinancementForm.controls.duree.setValue(this.demande.duree);
    // this.libelleDuree = 'Durée souhaitée en nombre de mois';
    // this.libelleMontant = 'Montant demandé en Francs CFA ';
    this.demandeFinancementForm.controls.duree.clearValidators();
    this.demandeFinancementForm.controls.duree.addValidators([Validators.required,Validators.pattern('[0-9]+')])

    if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit d\'urgence COVID 19'){
      this.duree = 18;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));
    }else if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit court terme, moins à égal à 12 mois'){
      this.duree = 12;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));

    }else if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit moyen terme, supérieur à 12 mois'){
      this.duree = 24;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));

    }

    this.demandeFinancementForm.controls.duree.markAsTouched();
    this.demandeFinancementForm.controls.duree.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    this.demandeFinancementForm.updateValueAndValidity();

  }


  handleStepOk(): void {
    if(this.stepname === "la description du projet"){
      this.eb.currentStepPosition =0;

    }
    this.showModel = false;
  }

  handleStepCancel(): void {
    this.showModel = false;
  }
  checkTypeFile(tableau: string[],extension: string ){
    return tableau?.indexOf(extension) !== -1;
  }

  onChangeCoutProjetValidators(){
    this.demandeFinancementForm.controls.coutProjet.clearValidators();
    this.demandeFinancementForm.controls.coutProjet.addValidators([Validators.required,Validators.pattern('^[0-9\\s]*$'), minValidator(this.demandeFinancementForm.controls.montantdemande.value)]);
    this.demandeFinancementForm.controls.coutProjet.updateValueAndValidity();

  }

  formatNumber() {
    /*if (this.demandeFinancementForm.controls.montantdemande.value == null || this.demandeFinancementForm.controls.valeurGarantie.value == null || this.financementForm.controls.montant.value)
      return;*/
    let amount = this.currencyPipe.transform((this.demandeFinancementForm.controls.montantdemande.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm.controls.montantdemande.setValue(amount)

    /*let amount1 = this.currencyPipe.transform((this.demandeFinancementForm.controls.valeurGarantie.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm.controls.valeurGarantie.setValue(amount1)*/

    let amount2 = this.currencyPipe.transform((this.financementForm?.controls?.montant?.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.financementForm?.controls?.montant?.setValue(amount2)

    let amount3 = this.currencyPipe.transform((this.demandeFinancementForm?.controls?.coutProjet?.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm?.controls?.coutProjet?.setValue(amount3)

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

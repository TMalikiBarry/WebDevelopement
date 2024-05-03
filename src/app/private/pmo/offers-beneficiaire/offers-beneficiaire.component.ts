import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzIconService} from 'ng-zorro-antd/icon';
import {AuthService} from 'src/app/services/security/auth/auth.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {BeneficiaireService} from 'src/app/services/beneficiaire/beneficiaire.service';
import {Offre} from 'src/app/model/offre';
import {environment} from 'src/environments/environment';
import {DemandeSelection} from 'src/app/model/DemandeSelection';
import {DemandeService} from 'src/app/services/demande/demande.service';
import {ApiResponseDemandeOffres} from "../../../model/demande-offres";
import {Demande} from "../../../model/demande";

// import { User } from 'src/app/model/user';

@Component({
  templateUrl: './offers-beneficiaire.component.html',
  styleUrls: ['./offers-beneficiaire.component.scss']
})
export class OffresBeneficiaireComponent implements OnInit {
  statusApprouveRejete: string = 'Approuvé';
  user: any;
  showDemandeButton: boolean = true;
  showSelectedOffers: boolean = false;
  countSelectedOffers: number = 0;
  idDemande: number = 0;
  msgSelectedOffers : string = '';
  msgConfirmOffer : string = '';
  alreadyConfirmOffers :boolean = true;
  isSpinning = false;
  showDetailsOffre :boolean = false;
  selectedCheckbox: any = {};
  selectedOffres : Offre[] = [];
  idBeneficiaire: number = 0;
  statusFinancementNumber = 1;
  beneficiaire : any;
  map = new Map();
  mapTypeBenef = new Map();
  mapStatus = new Map();
  demandeSelection : DemandeSelection = new DemandeSelection();
  listeDemande : any;
  demande !: Demande;
  listeOffres : any;
  beneficiaireId: any;
  listeSelectedOffres: any;
  infoOffre: Offre = new Offre();
  demandeEnCours : boolean = false;
  @Output() connexionInfoChange = new EventEmitter<any>();
  baseUrlFile = environment.baseUrlFile;

  @Input() offreDemandeEx !: ApiResponseDemandeOffres

  activateButton  : boolean =false ;
  prenomBeneficiaire: any;
  nomBeneficiaire: any;

  constructor(private iconService: NzIconService,
     private  authService: AuthService,
      private modal: NzModalService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public  beneficiaireService: BeneficiaireService,
      private demandeService : DemandeService
       ) { }

  ngOnInit(): void {
    if(this.offreDemandeEx){
      if(this.offreDemandeEx.demande.beneficiaire?.id){
        this.beneficiaireId = this.offreDemandeEx.demande.beneficiaire?.id
      }
      if (this.beneficiaireId) {
        // this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        // console.log('local user', this.user);
        this.idBeneficiaire = this.beneficiaireId;
        this.onGetAllSecteurActivite();
        this.onGetAllOffres();
        this.setStatusMap();
        this.setBeneficiaireType();
        this.onGetBeneficiaire(this.beneficiaireId)

        // CHECK IF THE USER CAN DO DEMANDE
        this.demandeService.checkDemandeValidity(this.beneficiaireId).subscribe(
          response => {
            //       console.log('response de check eb ' , response );
            this.activateButton = response.reponse ;
          }
        )
        // if(Object.keys(this.infoOffre).length!==0){
        //   console.log();
        // }
      }
    }else{
      this.beneficiaireId = this.activatedRoute.snapshot.params.idBeneficiaire;
      if (this.beneficiaireId) {
        // this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        // console.log('local user', this.user);
        this.idBeneficiaire = this.beneficiaireId;
        this.onGetAllSecteurActivite();
        this.onGetAllOffres();
        this.setStatusMap();
        this.setBeneficiaireType();
        this.onGetBeneficiaire(this.beneficiaireId)

        // CHECK IF THE USER CAN DO DEMANDE
        this.demandeService.checkDemandeValidity(this.beneficiaireId).subscribe(
          response => {
     //       console.log('response de check eb ' , response );
             this.activateButton = response.reponse ;
          }
        )
        // if(Object.keys(this.infoOffre).length!==0){
        //   console.log();
        // }
      }
    }
  }

  onGetBeneficiaire(beneficiaireId: any){
    this.beneficiaireService.getAllDemande(beneficiaireId).subscribe(response => {

      let listPersons = response.personnes;
      listPersons?.forEach(element => {
        let per_contact = response.personnes?.filter((item: any) => {
          return item.typePersonnes?.map(function (e: any) {

            return e.code;
          }).indexOf("CONTACT") !== -1
        })
        let contact: any = per_contact
        this.prenomBeneficiaire = contact[0]?.prenom
        this.nomBeneficiaire = contact[0]?.nom
      })
    })
  }

  home(){

  }

  setStatusMap(){
    this.mapStatus.set('INITIE', 'Initié');
    this.mapStatus.set('RECU_TG', 'Reçu par Teranga');
    this.mapStatus.set('INVALIDATED_TG', 'Invalidé par Teranga');
    this.mapStatus.set('TEMPORAIRE_TG', 'Initié TG');
    this.mapStatus.set('RECU', 'Reçu par le PMO');
    this.mapStatus.set('INVALIDATED', 'Invalidé');
    this.mapStatus.set('RECU_AF', 'En cours d\'examination par l\'analyste financier');
    this.mapStatus.set('MATCHE', 'Matching effectué');
    this.mapStatus.set('RECU_AF_MATCHE', 'En cours d\'examination par l\'analyste financier');
    this.mapStatus.set('APPROUVE', 'Approuvé par le PMO');
    this.mapStatus.set('REJETE', 'Rejeté par le PMO');
    this.mapStatus.set('DECAISSE_START', 'Décaissement en cours');
    this.mapStatus.set('DECAISSE_DONE', 'Décaissé');
    this.mapStatus.set('REMBOURSEMENT_START', 'Remboursement en cours');
    this.mapStatus.set('REMBOURSEMENT_DONE', 'Remboursé');
  }

  getStatusLibelle(codeStatus:any){
    return this.mapStatus.get(codeStatus);
  }

  setBeneficiaireType(){
    this.mapTypeBenef.set('ME', 'Micro-entrepreneur');
    this.mapTypeBenef.set('PME', 'Entreprise');
    this.mapTypeBenef.set('GIE', 'Groupement');
  }

  getNomTypeBeneficiaire(type:any){
    return this.mapTypeBenef.get(type);
  }

  showConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Deconnexion',
      nzOkText: 'Oui',
      nzContent: 'Voulez-vous vraiment vous déconnecter ?',
      nzOnOk: () => {
        this.logout();
      }
    });
  }

  showModalError(error:string): void {
    this.modal.confirm({
      nzCancelText: null,
      nzTitle: 'Erreur',
      nzContent: error
    });
  }

  onGetAllSecteurActivite(){
    this.beneficiaireService.getAllDemande(this.idBeneficiaire).subscribe((response) => {
      //console.log(response);
      this.beneficiaire = response ;
      // this.listeDemande = response.demandes;
    })
  }

  onGetAllOffres(){
    // //console.log(this.idBeneficiaire);
    this.isSpinning = true;
    this.beneficiaireService.getAllOffres(this.idBeneficiaire).subscribe((response) => {
      this.isSpinning = false;
      console.log(response);
      if(response.demande!=null && response.offres!=null){
        this.listeOffres = response.offres;
        // //console.log('length', this.listeOffres.length);
        this.idDemande = response.demande?.id || 0;
        this.demande = response.demande
        // //console.log(this.idDemande);
        this.demandeSelection = response ;
        // this.demandeSelection = response ;
        this.demandeEnCours = true;
        if(this.demandeSelection.demande?.statutDossier?.trim() == 'INITIE' || this.demandeSelection.demande?.statutDossier?.trim() == 'RECU_AF' || this.demandeSelection.demande?.statutDossier?.trim() == 'TEMPORAIRE_TG'
          || this.demandeSelection.demande?.statutDossier?.trim() == 'MATCHE' || this.demandeSelection.demande?.statutDossier?.trim() == 'RECU_AF_MATCHE'){
          this.statusFinancementNumber = 1;
        }
        else if(this.demandeSelection.demande?.statutDossier?.trim() == 'RECU' || this.demandeSelection.demande?.statutDossier?.trim() == 'RECU_TG'){
          this.statusFinancementNumber = 2;
        }
        else if(this.demandeSelection.demande?.statutDossier?.trim() == 'APPROUVE' || this.demandeSelection.demande?.statutDossier?.trim() == 'DECAISSE_START'){
          this.statusApprouveRejete = 'Approuvé';
          this.statusFinancementNumber = 3;
        }
        else if(this.demandeSelection.demande?.statutDossier?.trim() == 'REJETE'){
          this.statusApprouveRejete = 'Rejeté';
          this.statusFinancementNumber = 3;
        }
        else if(this.demandeSelection.demande?.statutDossier?.trim() == 'DECAISSE_DONE' || this.demandeSelection.demande?.statutDossier?.trim() == 'REMBOURSEMENT_START'){
          this.statusFinancementNumber = 4;
        }
        else if(this.demandeSelection.demande?.statutDossier?.trim() == 'REMBOURSEMENT_DONE'){
          this.statusFinancementNumber = 5;
        }

        // console.log(this.listeOffres.length);
        // console.log(this.statusFinancementNumber);
        // console.log(this.listeOffres.length);
        if(this.listeOffres.length==0 || this.statusFinancementNumber > 1 ){
          this.alreadyConfirmOffers = true;
        }
        else {
          // console.log('here babs');
          this.alreadyConfirmOffers = false;
        }

        // Gestion du button nouvelle demande
        if (this.statusFinancementNumber == 4) {
          this.showDemandeButton = false;
        }
        else{
          this.showDemandeButton = true;
        }

        if (this.listeOffres.length==1) {
          this.msgConfirmOffer = 'Confirmer l\'offre';
        } else {
          this.msgConfirmOffer = 'Confirmer les offres';
        }

        if(this.statusFinancementNumber >= 2 || this.demandeSelection.demande?.statutDossier?.trim() == 'RECU_AF_MATCHE'){
          this.showSelectedOffers = true;
          this.onGetSelectedOffres(this.idDemande);
        }
        else {
          this.showSelectedOffers = false;
        }
      }

    }, error=>{
      this.isSpinning = false;
      //console.log(error);
    })
  }

  onGetSelectedOffres(idDemande:number){
    // //console.log(this.idBeneficiaire);
    this.isSpinning = true;
    this.beneficiaireService.getOffresSelected(idDemande).subscribe((response) => {
      this.isSpinning = false;
      //console.log(response);
      this.listeSelectedOffres = response?.offres;
      if (this.listeSelectedOffres?.length > 0) {
        this.showSelectedOffers = true;
        if(this.listeSelectedOffres?.length==1 && this.statusFinancementNumber<3){
          this.msgSelectedOffers = 'L\'offre choisie';
        }
        else if(this.listeSelectedOffres?.length==1 && this.statusFinancementNumber>=3 && this.listeSelectedOffres.demande?.statutDossier=='REJETE'){
          this.msgSelectedOffers = 'L\'offre rejetée';
        }
        else if(this.listeSelectedOffres?.length==1 && this.statusFinancementNumber>=3 && this.listeSelectedOffres.demande?.statutDossier!='REJETE'){
          this.msgSelectedOffers = 'L\'offre approuvée';
        }
        else if(this.listeSelectedOffres?.length>1){
          this.msgSelectedOffers = 'Vos offres choisies';
        }

      }
      else{
        this.showSelectedOffers = false;
      }
    }, error=>{
      this.isSpinning = false;
      //console.log(error);
    })
  }

  goExpressionBesoin(){
    let typeBeneficiaire: string = this.beneficiaire.typeBeneficiaire;
    if(typeBeneficiaire.trim().toLowerCase()=='pme'){
      this.router.navigateByUrl('expression-besoin/entreprise');
    }
    else if(typeBeneficiaire.trim().toLowerCase()=='gie'){
      this.router.navigateByUrl('expression-besoin/gie');
    }
    else if(typeBeneficiaire.trim().toLowerCase()=='me'){
      this.router.navigateByUrl('expression-besoin/microentreprise');
    }
  }

  dataChanged(data:any, ){
    // //console.log('data babs', data);
    let count = 0;
    let keys = Object.keys(this.selectedCheckbox);
    for (let j = 0; j < keys.length; j++) {
      if(data.id==keys[j]){
        const value = this.selectedCheckbox[keys[j]];
        // //console.log(value);
        if(value==false){
          this.countSelectedOffers--;
        }

        if(value==true){
          this.countSelectedOffers++;
        }
        break;
      }
      // if(value==true && count>2){

      //   count++;
      // }
    }
    //console.log()
  }

  confirmerOffre(){
    let count = 0;
    let countTrue = 0;
    let countFalse = 0;
    let selectedOffers: Offre[] = [];
    let demandeSelection : DemandeSelection = new DemandeSelection();
    // //console.log(this.selectedCheckbox);
    if(Object.keys(this.selectedCheckbox).length === 0){
      // //console.log('null');
      if(this.listeOffres.length >=2){
        this.showModalError('Choisissez 2 offres pour confirmer');
      }
      else if(this.listeOffres.length ==1){
        this.showModalError('Choisissez l\'offre pour confirmer');
      }
      return;
    }

    for (let i = 0; i < this.listeOffres.length; i++) {
      // //console.log(this.listeOffres[i]);
      this.map.set(this.listeOffres[i].id, this.listeOffres[i]);
    }
    // //console.log(this.map.size);

    let keys = Object.keys(this.selectedCheckbox);
    // //console.log(keys);
    for (let j = 0; j < keys.length; j++) {
      // //console.log(keys[j]);
      const value = this.selectedCheckbox[keys[j]];
      // //console.log(this.map.get(keys[j]));
      if(value==false){
        countFalse++;
      }

      if(value==true){
        countTrue++;
      }
      if(value==true && count<2){
        let offer : Offre = this.map.get(Number(keys[j]));
        // offer.demande?.id = this.demandeSelection.demande?.id;
        selectedOffers.push(this.map.get(Number(keys[j])));
        count++;
      }
    }

    console.log(localStorage.getItem('isPMOSpecial'));
    if (!localStorage.getItem('isPMOSpecial') || this.authService.storage.getItem('isPMOSpecial') === 'false') {
      if(this.listeOffres.length >=2){
        if(count < 2 && count >0){
          // //console.log('choisir 2');
          this.showModalError('Choisissez 2 offres pour confirmer');
          return;
        }
        if(countTrue == 3){
          // //console.log('superieur 2');
          this.showModalError('Choisissez 2 offres pour confirmer');
          return;
        }
        if(selectedOffers.length == 0){
          //console.log('non checked');
          this.showModalError('Choisissez 2 offres pour confirmer');
          return;
        }
      }
      else if(this.listeOffres.length ==1){
        if(selectedOffers.length == 0){
          //console.log('non checked');
          this.showModalError('Choisissez l\'offre pour confirmer');
          return;
        }
      }
    } else if (localStorage.getItem('isPMOSpecial') && this.authService.storage.getItem('isPMOSpecial') === 'true' && this.authService.currentUserValue.idParent != 11) {
      console.log('here6');
      if(this.listeOffres.length >0){
        if(selectedOffers.length == 0){
          //console.log('non checked');
          this.showModalError('Choisissez une offre pour confirmer');
          return;
        }
        else{
          if(count > 1 || countTrue > 1){
            this.showModalError('Choisissez une offre pour confirmer');
            return;
          }
        }
      }
    }

    demandeSelection.demande = this.demandeSelection.demande;
    demandeSelection.offres = selectedOffers;
    //console.log(demandeSelection);
    this.isSpinning = true;
    this.beneficiaireService.confirmerOffres(demandeSelection).subscribe(
      response => {
        this.isSpinning = false;
        //console.log(response);
        this.alreadyConfirmOffers = true;
        this.showDetailsOffre = false;
        this.onGetAllOffres();
        // this.statusFinancementNumber = 2;
        this.onGetSelectedOffres(this.idDemande);
        this.modal.closeAll()
        // if(this.authService.getRole() === 'ANALYSTE_FINANCIER'){
        //   if(this.demande.beneficiaire?.typeBeneficiaire != 'ME'){
        //     this.modal.create({
        //       nzCancelText: null,
        //       nzTitle: 'Template PME & GIE',
        //       nzComponentParams:{
        //         demandeEx: this.demande
        //       },
        //       nzContent: FormAnalystePmeGieComponent,
        //       nzWidth: 1300
        //     });
        //   }else {
        //     this.modal.create({
        //       nzCancelText: null,
        //       nzTitle: 'Template Micro Entrepreneur',
        //       nzComponentParams:{
        //         demandeEx: this.demande
        //       },
        //       nzContent: FormAnalysteMeComponent,
        //       nzWidth: 1300
        //     });
        //   }
        // }
      },
      error=>{
        this.isSpinning = false;
        //console.log(error);
        this.alreadyConfirmOffers = false;
      }
    )
  }

  getMensualite(budgetTotal:number, interet:number, dureeNominale:number) {
    // console.log(budgetTotal);
    // console.log(interet);
    // console.log(dureeNominale);
    let mensualite;
    if(interet==0){
      // console.log('taux zero');
      mensualite = budgetTotal/dureeNominale;
      // console.log('mensualite taux 0', mensualite);
    }
    else if(budgetTotal==0){
      mensualite = 0;
    }
    else{
      // mensualite = (Number(budgetTotal)*(1+Number(interet)))/Number(dureeNominale);
      let interetPer = Math.pow(1+Number(interet), 1/dureeNominale) - 1;
      // console.log(interetPer);
      mensualite = (Number(budgetTotal)*Number(interetPer)*Math.pow((1+Number(interetPer)), dureeNominale))/Math.pow((1+Number(interetPer)), dureeNominale)-1;
      // console.log(mensualite);
      // console.log((Number(budgetTotal)*Number(interet)/100/12));
      // mensualite = (Number(budgetTotal)*Number(interet)/100/12) / (1 - Math.pow((1 + Number(interet/12)), -dureeNominale));
      // console.log(mensualite);
      // console.log('mensualite taux', mensualite);
    }
    return mensualite;
  }

  logout(){
    this.authService.logout();
  }

  infoOffres(data:any){
    this.showDetailsOffre = true;
    this.infoOffre = data;
  }

  param = {value: 'world'};

  editBeneficiaire() {
    let typeBeneficiaire: string = this.beneficiaire.typeBeneficiaire;
    if(typeBeneficiaire.trim().toLowerCase()=='pme'){
      this.router.navigateByUrl('/switch/edit-pme/'+this.beneficiaire.id);
    }
    else if(typeBeneficiaire.trim().toLowerCase()=='gie'){
      this.router.navigateByUrl('/switch/edit-gie/'+this.beneficiaire.id);
    }
    else if(typeBeneficiaire.trim().toLowerCase()=='me'){
      this.router.navigateByUrl('/switch/edit-me/'+this.beneficiaire.id);
    }
  }
}

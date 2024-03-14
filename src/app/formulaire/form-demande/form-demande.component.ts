import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DemandeService} from "../../services/demande/demande.service";
import {MessageService} from "../../services/message/message-service.service";
import {Demande} from "../../model/demande";
import {Projet} from "../../model/projet";
import {ExpressionBesoinComponent} from "./expression-besoin/expression-besoin.component";
import {DescriptionProjetComponent} from "./description-projet/description-projet.component";
import {Beneficiaire} from "../../model/beneficiaire";
import {AuthService} from "../../services/security/auth/auth.service";
import {FinancementObtenu} from "../../model/FinancementObtenu";
import {NzModalService} from "ng-zorro-antd/modal";
import {TypeFinancement} from "../../model/type-financement";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-eb-micro-entreprise',
  templateUrl: './form-demande.component.html',
  styleUrls: ['./form-demande.component.scss']
})
export class FormDemandeComponent implements OnInit {
  @ViewChild(ExpressionBesoinComponent) demandeFinancement! : ExpressionBesoinComponent
  @ViewChild(DescriptionProjetComponent) descriptionProjet! : DescriptionProjetComponent
  @Input() beneficiairetp !: Beneficiaire
  //@Input() beneTp !: Beneficiaire
  @Input() DemandeEx !: Demande

  constructor(private  demandeService: DemandeService,
              private messageService: MessageService,
              private authService: AuthService,
              private modal: NzModalService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }
  currentStepPosition : number = 0 ;

  // step demande
  demande : any ;

  // step descrition
  description : any ;

  // step emploi
  idPmo: any;
  idBeneficiaire: any;
  emploiPermanent : any;
  emploiNonPermanent : any;
  showSuccess : boolean = false;
  demandecache : boolean = true;
  stepname: string =  '';
  showModel:boolean  = false;
  nouveaux?: Projet[];
  isSpinning: boolean = false;

  ngOnInit(): void {
    if (this.beneficiairetp){
      this.idBeneficiaire = this.beneficiairetp.id
      localStorage.setItem("typeBenef", <string>this.beneficiairetp?.typeBeneficiaire)
    }else{
      this.idPmo = this.activatedRoute.snapshot.params.pmo;
      this.idBeneficiaire = this.activatedRoute.snapshot.params.idBenef;
    }
    if(this.beneficiairetp.demandes?.[0]?.id){
      console.log(this.beneficiairetp.demandes?.[0])
      let id = this.beneficiairetp.demandes[0].id
      this.demandeService.getById(id).subscribe((response) => {
        this.DemandeEx = response;
        localStorage.setItem("demandeCourante", JSON.stringify(this.DemandeEx))
        localStorage.setItem("typeBenef", <string>this.DemandeEx.beneficiaire?.typeBeneficiaire)
        // //  console.log('ME', response)
        //
        // // retrive the list of person
        // let listPersons = response.personnes;
        // let personContactFromBack : any ;
        // let agentFromBack : any ;
        // let personAgentSame : boolean = false ;
        //
        // listPersons?.forEach(element =>{
        //   if(element.typePersonnes){
        //
        //     // check type person
        //
        //     let listOfType = element.typePersonnes.map(el => { return el.code });
        //
        //     if(listOfType.indexOf("CONTACT")!==-1 && listOfType.indexOf("AGENT")!==-1 ){
        //       // personcontact = agent
        //       personContactFromBack = element ;
        //       personAgentSame = true;
        //     }
        //     else if( listOfType.length==1 &&listOfType.indexOf("CONTACT")!==-1){
        //       personContactFromBack = element
        //     }
        //     else if(listOfType.length==1 &&listOfType.indexOf("AGENT")!==-1) {
        //       agentFromBack = element
        //     }
        //   }
        // })
        // let per_contact =  response.personnes?.filter((item:any) => {return item.typePersonnes?.map(function(e:any) {
        //
        //   return e.code;
        // }).indexOf("CONTACT")!==-1
        //
        // });
        // let per_agent =  response.personnes?.filter((item:any) => {return item.typePersonnes?.map(function(e:any) {
        //
        //   return e.code;
        // }).indexOf("AGENT")!==-1
        //
        // });
        // let contact: any = per_contact
        // let agent: any = per_agent

        //console.log("contact", agent)

        /* let contact: any = personContactFromBack ;
         let agent: any = agentFromBack ;*/

        // this.personContact = {
        //   nom: contact[0]?.nom,
        //   prenom: contact[0]?.prenom,
        //   numeroMobile: contact[0]?.numeroMobile,
        //   adressePhysique: contact[0]?.adresse,
        //   age: JSON.stringify(contact[0]?.age),
        //   email: contact[0]?.email,
        //   numeroCNI: contact[0]?.numeroCNI,
        //   genre: JSON.stringify(contact[0]?.genre),
        //   niveauInstruction: JSON.stringify(contact[0]?.niveauInstruction),
        //   documentCNINom: contact[0]?.nomDocumentCNI,
        //   documentCNI: contact[0]?.nomDocumentCNI,
        //   nombrePersonCharge: JSON.stringify(contact[0]?.nombrePersonneACharge),
        //   //pmoRefere: response?.pmoRefere
        //   pmoRefere: JSON.stringify(response?.pmoRefere)
        // }
        console.log(this.DemandeEx.projets?.[0])

        let projet = this.DemandeEx.projets?.[0]
        this.description = {
          description: projet?.description,
          bussimessPlan: projet?.businessPlan,
          complementInfo: projet?.complementInformations,
          employesPermanents: projet?.nombreEmploisPermanent,
          nombreEmploiAdditionnelsPermanent: projet?.nombreEmploisAdditionnelPermanent,
          nombreFemmesPrevuPermanent: projet?.nombreFemmePrevuePermanent,
          pourcentageFemmePermanent: projet?.pourcentageFemmePermanent,
          nombreJeunesPermanent: projet?.nombreJeunePermanent,
          pourcentageJeunesPermanent: projet?.pourcentageJeunePermanent,
          employesNonPermanents: projet?.nombreEmploisNonPermanent,
          NombreEmploisAdditionnelsNonPermanent: projet?.nombreEmploisAdditionnelNonPermanent,
          NombreFemmesPrevusNonPermanent: projet?.nombreFemmePrevueNonPermanent,
          PourentageFemmessNonPermanent: projet?.pourcentageFemmeNonPermanent,
          NombreJeunessNonPermanent: projet?.nombreJeuneNonPermanent,
          PourcentageJeunessNonPermanent: projet?.pourcentageJeuneNonPermanent
        }

        console.log(this.description)

        //     //console.log("pmo refere from back ",response.pmoRefere);
        //     // this.agentInfo = {
        //     //   nom: agent[0]?.nom,
        //     //   prenom: agent[0]?.prenom,
        //     //   numeroMobile: agent[0]?.numeroMobile,
        //     //   adressePhysique: agent[0]?.adresse,
        //     //   age: JSON.stringify(agent[0]?.age),
        //     //   email: agent[0]?.email,
        //     //   numeroCNI: agent[0]?.numeroCNI,
        //     //   genre: JSON.stringify(agent[0]?.genre),
        //     //   niveauInstruction: JSON.stringify(agent[0]?.niveauInstruction),
        //     //   documentCNINom: agent[0]?.nomDocumentCNI,
        //     //   documentCNI: agent[0]?.nomDocumentCNI,
        //     //   nombrePersonCharge: JSON.stringify(agent[0]?.nombrePersonneACharge)
        //     // }
        //
        //     this.agentInfo = {
        //       nom: agent[0]?.nom,
        //       prenom: agent[0]?.prenom,
        //       numeroMobile: agent[0]?.numeroMobile,
        //       adressePhysique: agent[0]?.adresse,
        //       age: JSON.stringify(agent[0]?.age),
        //       email: agent[0]?.email,
        //       numeroCNI: agent[0]?.numeroCNI,
        //       genre: JSON.stringify(agent[0]?.genre),
        //       niveauInstruction: JSON.stringify(agent[0]?.niveauInstruction),
        //       documentCNINom: agent[0]?.nomDocumentCNI,
        //       documentCNI: agent[0]?.nomDocumentCNI ? agent[0]?.nomDocumentCNI : undefined ,
        //       nombrePersonCharge: JSON.stringify(agent[0]?.nombrePersonneACharge),
        //       personAgentSame : personAgentSame
        //     }
        //
        //     //let activity = this.beneficiaire.activiteBeneficiaires?.filter(p=>p.id==this.activiteInfo?this.activiteInfo:p)
        //     let activity = response.activiteBeneficiaires?.filter(p=>p.id==this.activiteInfo?this.activiteInfo:p) || []
        //     let secteur = activity[0]?.secteurActivites?.filter(p=>p.code==this.activiteInfo?this.activiteInfo:p) || []
        //
        //     this.activiteInfo = {
        //       occupation: activity[0]?.occupation,
        //       chiffreAffaireHorsTaxeAnMois1: activity[0]?.chiffreAffaireHorsTaxeAnMois1,
        //       chiffreAffaireHorsTaxeAnMois2: activity[0]?.chiffreAffaireHorsTaxeAnMois2,
        //       centreUrbain: this.beneficiaire?.centreUrbain,
        //       nombreAnneeActivite: activity[0]?.nombreAnneeActivite? JSON.stringify(activity[0]?.nombreAnneeActivite): null,
        //       secteurActivites: JSON.stringify(secteur[0]),
        //       revenuTotalGroupement2019: activity[0]?.revenueTotalAnMoins2 ? JSON.stringify( activity[0]?.revenueTotalAnMoins2 ): null,
        //       revenuTotalGroupement2020: activity[0]?.revenueTotalAnMoins1 ? JSON.stringify( activity[0]?.revenueTotalAnMoins1 ): null ,
        //       nombreEmplois: activity[0]?.nombreEmplois,
        //       membreIndividuelGroupement: JSON.stringify(activity[0]?.nombreEmployePermanent),
        //       nombreExactADate: JSON.stringify(activity[0]?.nombreEmployePermanentExactAdate),
        //       nombreFemmePermanent: JSON.stringify(activity[0]?.nombreFemmeEmployePermanent),
        //       pourcentageFemmePermanent: JSON.stringify(activity[0]?.pourcentageFemmeEmployePermanent),
        //       pourcentageJeunesPermanent: JSON.stringify(activity[0]?.pourcentageJeuneEmployePermanent),
        //       membreNonPermanent: JSON.stringify(activity[0]?.nombreEmployeNonPermanent),
        //       nombreExactADateNonPermanent: JSON.stringify(activity[0]?.nombreEmployeNonPermanentExactAdate),
        //       nombreFemmeNonPermanent: JSON.stringify(activity[0]?.nombreFemmeEmployeNonPermanent),
        //       pourcentageFemmeNonPermanent: JSON.stringify(activity[0]?.pourcentageFemmeNonPermanent),
        //       nombreJeuneNonPermanent: JSON.stringify(activity[0]?.nombreJeuneEmployeNonPermanent),
        //       pourcentageJeunesNonPermanent: JSON.stringify(activity[0]?.pourcentageJeuneNonPermanent),
        //       revenuMembreBasGroupement: JSON.stringify(activity[0]?.revenuplusBasParMois),
        //       revenuMoyenGroupement: JSON.stringify(activity[0]?.revenuMoyenneParMois),
        //       nombrePersonneChargeMoyenneParMembre: JSON.stringify(activity[0]?.nombrePersonneAChargeMoyenne),
        //       autreSecteurActivite: activity[0]?.autreSecteurActivite ,
        //       // update with region
        //       departement : JSON.stringify(response.zoneGeographique )
        //
        //     }
        //     //
        //
        //
        //
        //     // retrieve the Value of ScanCNI and selfie
        //
        //     this.selphieInfo = {
        //       nomDocumentCNIRecto : response.scanCNIRecto ,
        //       nomDocumentCNIVerso : response.scanCNIVerso ,
        //       nomDocumentSelphie :  response.selfie   ,
        //       imageRecto : environment.baseUrlFile+response.scanCNIRecto ,
        //       imageVerso : environment.baseUrlFile+response.scanCNIVerso,
        //       imageSelphie : environment.baseUrlFile+response.selfie
        //     }
        //     console.log(typeof contact[0].id)
        //     localStorage.setItem('idPersonneContact', contact[0]?.id)
        //   });
        // }
        // // console.log('idpmo recu', this.idPmo);
        // // console.log('idbenef recu', this.idBeneficiaire);

      })
    }
  }

  pre(){
    this.currentStepPosition-= 1 ;
  }

  next(){
    if(this.currentStepPosition === 1) {
      let benef = new Beneficiaire();
      let demandeRecuperee: Demande = new Demande();
      //a revoir
      if(localStorage.getItem('demandeCourante')) {
        demandeRecuperee = JSON.parse(<string>localStorage.getItem('demandeCourante'));
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
        benef.id = currentUser.idParent;
        if (!(this.description || demandeRecuperee.beneficiaire?.id == benef.id)) {
          this.stepname = "la description du projet";
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }
      }else if(this.authService.getRole() === "AGENT_INITIATEUR" && this.beneficiairetp){
          if(this.beneficiairetp.demandes?.[0]) {
            demandeRecuperee = this.beneficiairetp.demandes[0];
            benef.id = this.beneficiairetp.id
          }
      }else{
        if(!(this.description || demandeRecuperee.beneficiaire?.id == benef.id)){
          this.stepname = "la description du projet";
          this.showModel = true;
          return
        }
      }

      this.sendMicroEntrePreneursInfo();
      return;
    }
    this.currentStepPosition+= 1
  }


  done(){}

  sendMicroEntrePreneursInfo(){

    let demande = new Demande();
    console.log(this.demande)

    demande.typeDemande = this.demande.typefinancement;
    demande.montant = parseInt(this.demande.montantdemande?.replace(/\s/g, "")) ;
    //demande.apport = this.demande.apport ;
    //demande.garantie = this.demande.garanties? JSON.parse(this.demande.garanties):null;
    //demande.valeurGarantie = parseInt(this.demande.valeurGaranties?.replace(/\s/g, ""));
    demande.tauxInteretAnnuelleSouhaite = this.demande.tauxInteret ;
    // demande.tauxInteretAnnuelleApplicable = this.demande.typeFinancement ;
    demande.duree = this.demande.duree ;
    //demande.financementObtenue = this.demande.typeFinancement ;

    // demande.dateSignatureAccord = this.demande.typeFinancement ;
    //demande.categorie = this.demande.typeFinancement ;
   // demande.montantOctroye = this.demande.montant ;
    //demande.garantieDemandes = this.demande.typeFinancement ;
    // demande.dureeCredit = this.demande.typeFinancement ;
   // demande.tauxInteretAnnuelHT = this.demande.tauxInteretHT ;
    // demande.tauxInteretAnnuelTTC = this.demande.typeFinancement ;
    // demande.tauxInteretAnnuelTEG = this.demande.typeFinancement ;
    //demande.statutDossier = this.demande.typeFinancement ;
    //demande.dateLastStatut = this.demande.typeFinancement ;
    //demande.supprime = this.demande.typeFinancement ;
    //demande.dateCreation = this.demande.typeFinancement ;
    //demande.dateModification = this.demande.typeFinancement ;
    //demande.session = this.demande.typeFinancement ;
    // demande.offres = this.demande.typeFinancement ;

    // setting list financements
    let financements: FinancementObtenu[] =[];
    for(let fin of this.demande.listeFinancement){
        let finTemp = new FinancementObtenu()
      finTemp.institutionFinanciere = fin.institutionFinanciere ;
      finTemp.typeCredit = fin.typeCredit ;
      finTemp.dateFinancement = new Date(fin.datemepFinancement) ;
      finTemp.tableauAmortissement = fin.tableauFinancementNom ;
      finTemp.dateRemboursement = new Date(fin.dateRemboursement);
      finTemp.statusFinancement =fin.statutFinancement ;
      finTemp.montant =  parseInt(fin.montant?.replace(/\s/g, "")) ;
      finTemp.autreInstitutionFinanciere = fin.autreInstitution;
      //demande.garantieDemandes = this.demande.typeFinancement ;
      // demande.dureeCredit = this.demande.typeFinancement ;
      finTemp.tauxInteretAnnuelHT = fin.tauxInteretHT ;
     financements.push(finTemp)
    }
    demande.financementObtenus = financements;

    let projet = new Projet();
    if(!this.description) {
      let benef = new Beneficiaire();
      let demandeRecuperee: Demande;

      demandeRecuperee = JSON.parse(<string>localStorage.getItem('demandeCourante'));
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
      benef.id = currentUser.idParent;
      //console.log(demandeRecuperee);
      //console.log(benef.id);
      //console.log(demandeRecuperee.beneficiaire?.id);
      //console.log(demandeRecuperee.beneficiaire?.id == benef.id);
      if (demandeRecuperee.beneficiaire?.id == benef.id) {


        this.nouveaux = demandeRecuperee.projets;
        // @ts-ignore
        //console.log(demandeRecuperee.projets[0]);
        // @ts-ignore
        projet = demandeRecuperee.projets[0];
      }
    }else{
      projet.description = this.description.descriptionProjet;
     // projet.cout = this.description.coutProjet;
      projet.businessPlan = this.description.bussinessPlanNom;

      for(let complementInfo of this.description.complementInfoNom){
        projet.complementInformations?.push(complementInfo);
      }
      //projet.complementInformations?.push(this.description.complementInfoNom);


      projet.nombreEmploisPermanentMe = this.description.employesPermanents;
      projet.nombreEmploisAdditionnelPermanent = this.description.nombreEmploiAdditionnelsPermanent;
      projet.nombreFemmePrevuePermanent = this.description.nombreFemmesPrevuPermanent;
      projet.pourcentageFemmePermanent = this.description.pourcentageFemmePermanent?.replace('%','');
      projet.nombreJeunePermanent = this.description.nombreJeunesPermanent;
      projet.pourcentageJeunePermanent = this.description.pourcentageJeunesPermanent?.replace('%','');

      projet.nombreEmploisNonPermanentMe = this.description.employesNonPermanents;
      projet.nombreEmploisAdditionnelNonPermanent = this.description.NombreEmploisAdditionnelsNonPermanent;
      projet.nombreFemmePrevueNonPermanent = this.description.NombreFemmesPrevusNonPermanent;
      projet.pourcentageFemmeNonPermanent = this.description.PourentageFemmessNonPermanent?.replace('%','');
      projet.nombreJeuneNonPermanent = this.description.NombreJeunessNonPermanent;
      projet.pourcentageJeuneNonPermanent = this.description.PourcentageJeunessNonPermanent?.replace('%','');
      projet.cout = this.demande.coutProjet?.replace(/\s/g, "");
    }


    demande.projets?.push(projet);
    console.log(projet,demande)
    //console.log(demande.projets?.length);

    //insertion beneficiaire
    let beneficiaire = new Beneficiaire();
    if(this.idBeneficiaire){ // Creation issue du PMO
      beneficiaire.id = this.idBeneficiaire;
      demande.beneficiaire = beneficiaire;
    }
    if(this.beneficiairetp.id){
      demande.beneficiaire = this.beneficiairetp
    }
    else{
      if(localStorage.getItem('currentUser') != null) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
        beneficiaire.id = currentUser.idParent;
        demande.beneficiaire = beneficiaire;
      }
    }
      console.log(demande);
    this.isSpinning = true;
    this.demandeService.save(demande).subscribe(

      response =>{
        this.isSpinning = false;
        //console.log(response);
        this.showSuccess = true;
        this.demandecache = false;
        localStorage.removeItem('demandeCourante');
        localStorage.removeItem('typeBenef');

      },(error) => {
        //console.log(error)
        this.isSpinning = false;
      }
    ) ;



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
  logout(){
    this.authService.logout();
  }
  home(){
    this.router.navigateByUrl("/beneficiaire");
  }
  onIndexChange(event: number): void {
    this.currentStepPosition = event;
  }


  }


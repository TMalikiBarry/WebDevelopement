import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivitesMicroEntrepreneurComponent} from "./activites-micro-entrepreneur/activites-micro-entrepreneur.component";
import {AgentComponent} from "./agent/agent.component";
import {PersonnecontactComponent} from "./personnecontact/personnecontact.component";
import {ConnexionComponent} from "./connexion/connexion.component";
import {BeneficiaireMEService} from "../../services/beneficiaire/beneficiaire_me/beneficiaire-me.service";
import {BeneficiaireME} from "../../model/beneficiaire-me";
import {Personne} from "../../model/personne";
import {ActiviteBeneficiaire} from "../../model/activite-beneficiaire";
import {ZoneGeographique} from "../../model/zone-geographique";
import {TypePersonne} from "../../model/type-personne";
import { ApiResponseBenef } from 'src/app/model/api-response-benef';
import { Acces } from 'src/app/model/acces';
import {TrancheAge} from "../../model/tranche-age";
import {NiveauInstruction} from "../../model/niveau-instruction";
import {BeneficiaireService} from "../../services/beneficiaire/beneficiaire.service";
import { environment } from '../../../environments/environment';
import { AgmMarker } from '@agm/core';
import { Beneficiaire } from 'src/app/model/beneficiaire';
import { HttpClient } from '@angular/common/http';
import {NzNotificationService} from "ng-zorro-antd/notification";
import { PmoService } from 'src/app/services/pmo/pmo.service';
import { PMO } from 'src/app/model/pmo';
import {TouchPointService} from "../../services/touch-point/touch-point.service";
import {BeneTP} from "../../model/beneTP";
import {AuthService} from "../../services/security/auth/auth.service";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {FormDemandeComponent} from "../form-demande/form-demande.component";
import { interval } from 'rxjs';
@Component({
  selector: 'app-form-micro-entrepreneurs',
  templateUrl: './form-micro-entrepreneurs.component.html',
  styleUrls: ['./form-micro-entrepreneurs.component.scss']
})
export class FormMicroEntrepreneursComponent implements OnInit {

  benefApiResponse = new ApiResponseBenef();

  //@Input() beneTp !: Beneficiaire

  @Input() beneficiairetp !: Beneficiaire

  // personne contact component instance
  @ViewChild(ActivitesMicroEntrepreneurComponent) activiteMicroEntrepreneurComponent! : ActivitesMicroEntrepreneurComponent;

  @ViewChild(AgentComponent) agentComponent! : AgentComponent;

  @ViewChild(PersonnecontactComponent) personneContactComponent! : PersonnecontactComponent;

  @ViewChild(ConnexionComponent) connexionComponent! : ConnexionComponent;

  // step activiteMicroEntrepreneurInfo
  activiteInfo : any ;

  // step agentInfo info
  agentInfo : any ;

  // set info persone received
  personContact : any ;

  //set zone geographique
  zoneGeographique: any;

  // step info for register
  connexionInfo : any ;

  stepname: string =  '';
  showModel:boolean  = false;
  showPmoReferant:boolean  = true;
  showInscriptionProprietaire:boolean  = true;
  showOtp = false ;
  showSuccessPmo = false ;
  idPmo: number = 0;
  role!: string;

  nombreSecond: number = 0;
  renvoiCode: boolean = true;
  currentStepPosition : number = 0 ;
  numeroTelephone : any ;

  // step info for selphie
  selphieInfo : any ;

  pmoRefere: PMO = new PMO;

  isSpinning: boolean = false;
  beneficiaireId: number = 0;
  beneficiaire?: BeneficiaireME;

  constructor(private router : Router, private beneficiaireMeService: BeneficiaireMEService,
              private activatedRoute: ActivatedRoute,
              private beneficiaireService: BeneficiaireService,
              private pmoService:PmoService,
              private touchPointService: TouchPointService,
              private http :HttpClient,
              public auth :AuthService,
              private modalService : NzModalService,
              private notificationService: NzNotificationService) {
    this.beneficiaireId = activatedRoute.snapshot.params.beneficiaire;
    this.idPmo = activatedRoute.snapshot.params.pmo;
    // console.log('idpmo recu', this.idPmo);
  }

  ngOnInit(): void {
    //console.log("BeneficiaireUpdate : "+JSON.stringify(this.beneficiairetp))
    if ((this.auth.getRole()=='AGENT_INITIATEUR')) {
      if (this.beneficiairetp) {
        if (this.beneficiairetp.id)
          this.beneficiaireId = this.beneficiairetp.id
      }
    }

    if(this.idPmo){
      this.getPMOInfos();
      this.showPmoReferant = false;
    }
    else{
      this.showPmoReferant = true;
    }

    if(this.auth.getRole()=='AGENT_INITIATEUR'){
      this.showPmoReferant = false;
      this.showInscriptionProprietaire = true
    }
    else{
      this.showPmoReferant = false;
      this.showInscriptionProprietaire = true
    }


    if(this.beneficiaireId === undefined){
     // console.log('AKCINA ME')
    }else {
      //console.log('defined')
      //console.log('id benef ngINiti ' , this.beneficiaireId);

      this.beneficiaireService.getBeneficiaireMEById(this.beneficiaireId).subscribe((response) => {
      this.beneficiaire = response ;
      //  console.log('ME', response)

        // retrive the list of person
        let listPersons = response.personnes;
        let personContactFromBack : any ;
        let agentFromBack : any ;
        let personAgentSame : boolean = false ;

        listPersons?.forEach(element =>{
          if(element.typePersonnes){

            // check type person

            let listOfType = element.typePersonnes.map(el => { return el.code });

            if(listOfType.indexOf("CONTACT")!==-1 && listOfType.indexOf("AGENT")!==-1 ){
              // personcontact = agent
              personContactFromBack = element ;
              personAgentSame = true;
            }
            else if( listOfType.length==1 &&listOfType.indexOf("CONTACT")!==-1){
              personContactFromBack = element
            }
            else if(listOfType.length==1 &&listOfType.indexOf("AGENT")!==-1) {
              agentFromBack = element
            }
          }
        })
        let per_contact =  response.personnes?.filter((item:any) => {return item.typePersonnes?.map(function(e:any) {

          return e.code;
        }).indexOf("CONTACT")!==-1

        });
        let per_agent =  response.personnes?.filter((item:any) => {return item.typePersonnes?.map(function(e:any) {

          return e.code;
        }).indexOf("AGENT")!==-1

        });
         let contact: any = per_contact
         let agent: any = per_agent

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


          this.personContact = {
            nom: contact[0]?.nom,
            prenom: contact[0]?.prenom,
            numeroMobile: contact[0]?.numeroMobile,
            adressePhysique: contact[0]?.adresse,
            age: JSON.stringify(contact[0]?.age),
            email: contact[0]?.email,
            numeroCNI: contact[0]?.numeroCNI,
            genre: JSON.stringify(contact[0]?.genre),
            niveauInstruction: JSON.stringify(contact[0]?.niveauInstruction),
            documentCNINom: contact[0]?.nomDocumentCNI,
            documentCNI: contact[0]?.nomDocumentCNI,
            nombrePersonCharge: JSON.stringify(contact[0]?.nombrePersonneACharge),
            //pmoRefere: response?.pmoRefere
            pmoRefere: JSON.stringify(response?.pmoRefere),
            personAgentSame : personAgentSame ,
            estRefere : response?.pmoRefere ? true : false
          }

         //console.log("pmo refere from back ",response.pmoRefere);
        // this.agentInfo = {
        //   nom: agent[0]?.nom,
        //   prenom: agent[0]?.prenom,
        //   numeroMobile: agent[0]?.numeroMobile,
        //   adressePhysique: agent[0]?.adresse,
        //   age: JSON.stringify(agent[0]?.age),
        //   email: agent[0]?.email,
        //   numeroCNI: agent[0]?.numeroCNI,
        //   genre: JSON.stringify(agent[0]?.genre),
        //   niveauInstruction: JSON.stringify(agent[0]?.niveauInstruction),
        //   documentCNINom: agent[0]?.nomDocumentCNI,
        //   documentCNI: agent[0]?.nomDocumentCNI,
        //   nombrePersonCharge: JSON.stringify(agent[0]?.nombrePersonneACharge)
        // }

        this.agentInfo = {
          nom: agent[0]?.nom,
          prenom: agent[0]?.prenom,
          numeroMobile: agent[0]?.numeroMobile,
          adressePhysique: agent[0]?.adresse,
          age: JSON.stringify(agent[0]?.age),
          email: agent[0]?.email,
          numeroCNI: agent[0]?.numeroCNI,
          genre: JSON.stringify(agent[0]?.genre),
          niveauInstruction: JSON.stringify(agent[0]?.niveauInstruction),
          documentCNINom: agent[0]?.nomDocumentCNI,
          documentCNI: agent[0]?.nomDocumentCNI ? agent[0]?.nomDocumentCNI : undefined ,
          nombrePersonCharge: JSON.stringify(agent[0]?.nombrePersonneACharge),
          personAgentSame : personAgentSame
        }

        //let activity = this.beneficiaire.activiteBeneficiaires?.filter(p=>p.id==this.activiteInfo?this.activiteInfo:p)
        let activity = response.activiteBeneficiaires?.filter(p=>p.id==this.activiteInfo?this.activiteInfo:p) || []
        let secteur = activity[0]?.secteurActivites?.filter(p=>p.code==this.activiteInfo?this.activiteInfo:p) || []

          this.activiteInfo = {
            occupation: activity[0]?.occupation,
            chiffreAffaireHorsTaxeAnMois1: activity[0]?.chiffreAffaireHorsTaxeAnMois1,
            chiffreAffaireHorsTaxeAnMois2: activity[0]?.chiffreAffaireHorsTaxeAnMois2,
            centreUrbain: this.beneficiaire?.centreUrbain,
            nombreAnneeActivite: activity[0]?.nombreAnneeActivite? JSON.stringify(activity[0]?.nombreAnneeActivite): null,
            secteurActivites: JSON.stringify(secteur[0]),
            revenuTotalGroupement2019: activity[0]?.revenueTotalAnMoins2 ? JSON.stringify( activity[0]?.revenueTotalAnMoins2 ): null,
            revenuTotalGroupement2020: activity[0]?.revenueTotalAnMoins1 ? JSON.stringify( activity[0]?.revenueTotalAnMoins1 ): null ,
            nombreEmplois: activity[0]?.nombreEmplois,
            membreIndividuelGroupement: JSON.stringify(activity[0]?.nombreEmployePermanent),
            nombreExactADate: JSON.stringify(activity[0]?.nombreEmployePermanentExactAdate),
            nombreFemmePermanent: JSON.stringify(activity[0]?.nombreFemmeEmployePermanent),
            pourcentageFemmePermanent: JSON.stringify(activity[0]?.pourcentageFemmeEmployePermanent),
            pourcentageJeunesPermanent: JSON.stringify(activity[0]?.pourcentageJeuneEmployePermanent),
            membreNonPermanent: JSON.stringify(activity[0]?.nombreEmployeNonPermanent),
            nombreExactADateNonPermanent: JSON.stringify(activity[0]?.nombreEmployeNonPermanentExactAdate),
            nombreFemmeNonPermanent: JSON.stringify(activity[0]?.nombreFemmeEmployeNonPermanent),
            pourcentageFemmeNonPermanent: JSON.stringify(activity[0]?.pourcentageFemmeNonPermanent),
            nombreJeuneNonPermanent: JSON.stringify(activity[0]?.nombreJeuneEmployeNonPermanent),
            pourcentageJeunesNonPermanent: JSON.stringify(activity[0]?.pourcentageJeuneNonPermanent),
            revenuMembreBasGroupement: JSON.stringify(activity[0]?.revenuplusBasParMois),
            revenuMoyenGroupement: JSON.stringify(activity[0]?.revenuMoyenneParMois),
            nombrePersonneChargeMoyenneParMembre: JSON.stringify(activity[0]?.nombrePersonneAChargeMoyenne),
            autreSecteurActivite: activity[0]?.autreSecteurActivite ,
            // update with region
            departement : JSON.stringify(response.zoneGeographique )

          }
          //



        // retrieve the Value of ScanCNI and selfie

        this.selphieInfo = {
          nomDocumentCNIRecto : response.scanCNIRecto ,
          nomDocumentCNIVerso : response.scanCNIVerso ,
          nomDocumentSelphie :  response.selfie   ,
          imageRecto : environment.baseUrlFile+response.scanCNIRecto ,
          imageVerso : environment.baseUrlFile+response.scanCNIVerso,
          imageSelphie : environment.baseUrlFile+response.selfie
        }
        console.log(typeof contact[0].id)
        localStorage.setItem('idPersonneContact', contact[0]?.id)
      });

      // end of subscribe

    }
  }

  getPMOInfos(){
    // this.isSpinning = true;
    this.pmoService.getById(this.idPmo).subscribe((response) => {
      // this.isSpinning = false;
      // console.log(response);
      this.pmoRefere = response;
    },
    (error)=>{
      this.isSpinning = false;
      //console.log(error);
    })
  }

  pre(){
    if (this.currentStepPosition == 2 && this.personContact?.radioValue == 'oui'){
      this.currentStepPosition -= 2;
      return;
    }

    if (this.currentStepPosition == 4 && this.idPmo){
      this.currentStepPosition -= 2;
      return;
    }




    this.currentStepPosition-= 1 ;
  }

  next(){
    this.showModel  = false;

    if((this.auth.getRole()=='AGENT_INITIATEUR')) {
      switch (this.currentStepPosition) {
        case 0:
          console.log(this.personContact);
          break;
        case 1:
          console.log(this.activiteInfo);
          break;
        case 2:
          console.log(this.selphieInfo);

          if (!this.personContact) {
            this.stepname = "la personne contact";
            this.showModel = true;

            return;
          } else {
            this.showModel = false;
          }

          if (!this.activiteInfo) {
            this.stepname = "l'activité de l'entreprise";
            this.showModel = true;
            return;
          } else {
            this.showModel = false;
          }
        this.sendMeInfo();
          return;

      }
    }else {

      switch (this.currentStepPosition) {
        case 0:
          console.log(this.personContact);
          break;
        case 1:
          console.log(this.agentInfo);
          break;
        case 2:
          console.log(this.activiteInfo);
          break;
        case 3:
          console.log(this.selphieInfo);
          break;
        case 4:
          console.log(this.connexionInfo);
          if (!this.personContact) {
            this.stepname = "la personne contact";
            this.showModel = true;

            return;
          } else {
            this.showModel = false;
          }
            if (localStorage.getItem("radioValue") == "non") {
              if (!this.agentInfo) {
                this.stepname = "l'agent";
                this.showModel = true;

                return;
              } else {
                this.showModel = false;
              }
            }


          if (!this.activiteInfo) {
            this.stepname = "l'activité de l'entreprise";
            this.showModel = true;
            return;
          } else {
            this.showModel = false;
          }

          if (!this.idPmo) {
            if (!this.selphieInfo) {
              this.stepname = "la pièce d'identite recto et verso";
              this.showModel = true;
              return;
            } else {
              this.showModel = false;
            }
          }

          this.sendMeInfo();
          return;
      }
    }
    // console.log(this.currentStepPosition);
    if(this.idPmo && this.activiteInfo){
      this.currentStepPosition+= 2 ;
    }
    else{
      this.currentStepPosition+= 1 ;
    }

  }

  done(){
    this.router.navigateByUrl('/beneficiaire')
  }

  sendMeInfo() {
    let microEntrepreneur = new BeneficiaireME();

    // person contact
    let contactPerson = new Personne();
    contactPerson.id= this.personContact.id
    contactPerson.nom = this.personContact.nom ;
    contactPerson.prenom = this.personContact.prenom;
    contactPerson.numeroMobile = this.personContact.numeroMobile;
    contactPerson.adresse = this.personContact.adressePhysique ;
    contactPerson.age =  JSON.parse(this.personContact.age);
    contactPerson.email= this.personContact.email;
    contactPerson.numeroCNI = this.personContact.numeroCNI;
    contactPerson.genre = JSON.parse(this.personContact.genre);
    contactPerson.niveauInstruction = JSON.parse(this.personContact.niveauInstruction);
    contactPerson.nomDocumentCNI = this.personContact.documentCNINom;
    contactPerson.nombrePersonneACharge = this.personContact.nombrePersonCharge;


    let typePers : TypePersonne = new TypePersonne();
    typePers.code = "CONTACT";
    contactPerson.typePersonnes =[]
    contactPerson.typePersonnes.push(typePers);

     let contactAgent = new Personne();
    let typePers2 : TypePersonne = new TypePersonne();
    typePers2.code = "AGENT";

    if (this.agentInfo) {

      contactAgent.nom = this.agentInfo.nom;
      contactAgent.prenom = this.agentInfo.prenom;
      contactAgent.numeroMobile = this.agentInfo.numeroMobile;
      contactAgent.adresse = this.agentInfo.adressePhysique;
      contactAgent.age = this.agentInfo.age?  JSON.parse(this.agentInfo.age): null
      contactAgent.email = this.agentInfo.email;
      contactAgent.numeroCNI = this.agentInfo.numeroCNI;
      contactAgent.genre =this.agentInfo.genre? JSON.parse(this.agentInfo.genre): null;
      contactAgent.nombrePersonneACharge = this.agentInfo.nombrePersonCharge;
      contactAgent.niveauInstruction =this.agentInfo.niveauInstruction?  JSON.parse(this.agentInfo.niveauInstruction): null;
      contactAgent.typePersonnes =[];
      contactAgent.typePersonnes.push(typePers2);

      // Document CNI de l'agent
      contactAgent.nomDocumentCNI = this.agentInfo.documentCNINom;
      microEntrepreneur.personnes = new Array<Personne>();
      microEntrepreneur.personnes.push(contactPerson);
      microEntrepreneur.personnes.push(contactAgent);
      // let access = new Acces();
      // access.login = this.connexionInfo.username;
      // access.password = this.connexionInfo.password;
      // contactPerson.acces = access;
    }else{
      contactPerson.typePersonnes.push(typePers2);
      microEntrepreneur.personnes = new Array<Personne>();
      microEntrepreneur.personnes.push(contactPerson);
      if(!(this.auth.getRole()=='AGENT_INITIATEUR')) {
        let access = new Acces();
        access.login = this.connexionInfo.username;
        access.password = this.connexionInfo.password;
        contactPerson.acces = access;
      }
    }
    // if(!(this.auth.getRole()=='AGENT_INITIATEUR')) {
    //   let access = new Acces();
    //   access.login = this.connexionInfo.username;
    //   access.password = this.connexionInfo.password;
    //   contactPerson.acces = access;
    // }


    // Activite

    let activite = new ActiviteBeneficiaire();

    activite.occupation = this.activiteInfo.occupation;
    activite.chiffreAffaireHorsTaxeAnMois1 = this.activiteInfo.chiffreAffaireHorsTaxeAnMois1;
    activite.chiffreAffaireHorsTaxeAnMois2 = this.activiteInfo.chiffreAffaireHorsTaxeAnMois2;

    if(this.activiteInfo.nombreAnneeActivite){
      activite.nombreAnneeActivite = JSON.parse(this.activiteInfo.nombreAnneeActivite);
    }

    // check secteur activite for the value setted s
    if(this.activiteInfo.secteurActivites){
      activite.secteurActivites?.push(JSON.parse(this.activiteInfo.secteurActivites));
    }
    else {
      activite.autreSecteurActivite = this.activiteInfo.secteurActivites2 ;

    }

    activite.revenueTotalAnMoins1 = this.activiteInfo.revenuTotalGroupement2019;
    activite.revenueTotalAnMoins2 = this.activiteInfo.revenuTotalGroupement2020;
    activite.nombreEmplois = this.activiteInfo.nombreEmplois;
   // activite.nombreAnneeActivite = JSON.parse(this.activiteInfo.nombreAnneeActivite)
    // permanent
    activite.nombreEmployePermanent = this.activiteInfo.membreIndividuelGroupement;
    activite.nombreEmployePermanentExactAdate = this.activiteInfo.nombreExactADate;
    activite.nombreFemmeEmployePermanent = this.activiteInfo.nombreFemmePermanent ;
    activite.pourcentageFemmeEmployePermanent = this.activiteInfo.pourcentageFemmePermanent;
    activite.pourcentageJeuneEmployePermanent = this.activiteInfo.pourcentageJeunesPermanent;
    activite.nombreEmployeNonPermanent = this.activiteInfo.membreNonPermanent
    // non permanent
    activite.nombreEmployeNonPermanentExactAdate = this.activiteInfo.nombreExactADateNonPermanent;
    activite.nombreFemmeEmployeNonPermanent = this.activiteInfo.nombreFemmeNonPermanent;
    activite.pourcentageFemmeNonPermanent = this.activiteInfo.pourcentageFemmeNonPermanent;
    activite.nombreJeuneEmployeNonPermanent = this.activiteInfo.nombreJeuneNonPermanent;
    activite.pourcentageJeuneNonPermanent = this.activiteInfo.pourcentageJeunesNonPermanent;
    // revenu
    activite.revenuplusBasParMois = this.activiteInfo.revenuMembreBasGroupement;
    activite.revenuMoyenneParMois = this.activiteInfo.revenuMoyenGroupement;
    activite.nombrePersonneAChargeMoyenne = this.activiteInfo.nombrePersonneChargeMoyenneParMembre;

    // locality

    let zoneGeographique = new ZoneGeographique()
    zoneGeographique = JSON.parse(this.activiteInfo.departement) as ZoneGeographique;

    microEntrepreneur.zoneGeographique = zoneGeographique;


    if(this.idPmo){
      microEntrepreneur.pmoRefere = this.pmoRefere;
      microEntrepreneur.pmoRattachement = this.pmoRefere;
    }
    else{
      microEntrepreneur.pmoRefere = this.personContact.pmoRefere? JSON.parse(this.personContact.pmoRefere) : null;
    }

    microEntrepreneur.activiteBeneficiaires?.push(activite);

    microEntrepreneur.centreUrbain = this.activiteInfo.centreUrbain;
    microEntrepreneur.prenom = this.personContact.prenom ;
    microEntrepreneur.nom = this.personContact.nom ;
    microEntrepreneur.codeClient = this.personContact.codeClient ;

    console.log(JSON.stringify(microEntrepreneur));
    this.numeroTelephone = this.personContact.numeroMobile ;


    microEntrepreneur.telephone = this.personContact.numeroMobile ;

    // recto verso selphie CNI
    if(!this.idPmo){
      microEntrepreneur.scanCNIRecto = this.selphieInfo.nomDocumentCNIRecto ;
      microEntrepreneur.scanCNIVerso = this.selphieInfo.nomDocumentCNIVerso ;
      microEntrepreneur.selfie = this.selphieInfo.nomDocumentSelphie  ;
    }
    // recto Verson selphie CNI


    //Infos du mricroEntrepreneur
    microEntrepreneur.chiffreAffaireAnMoins1 = this.activiteInfo.chiffreAffaireHorsTaxeAnMois1;
    microEntrepreneur.chiffreAffaireAnMoins2 = this.activiteInfo.chiffreAffaireHorsTaxeAnMois1;
    microEntrepreneur.age =  JSON.parse(this.personContact.age);
    microEntrepreneur.numeroCNI = this.personContact.numeroCNI;
    microEntrepreneur.scanNumeroCNI = this.personContact.documentCNINom;
    microEntrepreneur.niveauInstruction = JSON.parse(this.personContact.niveauInstruction) ;
    microEntrepreneur.nombrePersonneACharge = this.personContact.nombrePersonCharge;
    microEntrepreneur.zoneGeographique = JSON.parse(this.activiteInfo.departement) as ZoneGeographique

    this.isSpinning = true;
    console.log(JSON.stringify(microEntrepreneur));
    this.Save(microEntrepreneur);
  }

  Save(microEntrepreneur : BeneficiaireME){
    this.beneficiaireMeService.save(microEntrepreneur).subscribe(
      response => {

        console.log(response);
        this.benefApiResponse = response ;
        if(!this.idPmo){
          this.showOtp = true;
        }
        else{
          this.showSuccessPmo = true;
        }

        this.renvoiCode = false;
        this.nombreSecond = 60;
        this.getTimer();
        this.isSpinning = false;

        if(this.auth.getRole() == "AGENT_INITIATEUR" && !microEntrepreneur.demandes){
          this.modalService.closeAll()
          this.modalService.create({
            nzTitle: 'Demande de Financement',
            nzContent: FormDemandeComponent,
            nzComponentParams:{
              beneficiairetp: this.beneficiairetp
            },
            nzWidth: 1200,
            nzCancelText: null,
            nzOkText : null
          });

        }

      },
      (error) => {
        this.isSpinning = false;
        console.log(error);
      })
  }
  sendMeInfoUpdate() {
    console.log(this.beneficiaireId)
    this.beneficiaireService.getBeneficiaireMEById(this.beneficiaireId).subscribe((response) => {
        console.log("===> moha", response  )
     let microEntrepreneur: BeneficiaireME = response;
      // retrive the list of person
      let listPersons = response.personnes;
      let personContactFromBack : any ;
      let agentFromBack : any ;
      listPersons?.forEach(element =>{
        if(element.typePersonnes){

          // check type person

          let listOfType = element.typePersonnes.map(el => { return el.code });

          if(listOfType.indexOf("CONTACT")!==-1 && listOfType.indexOf("AGENT")!==-1 ){
            // personcontact = agent
            personContactFromBack = element ;

          }
          else if( listOfType.length==1 &&listOfType.indexOf("CONTACT")!==-1){
            personContactFromBack = element
          }
          else if(listOfType.length==1 &&listOfType.indexOf("AGENT")!==-1) {
            agentFromBack = element
          }
        }
      })


        let per_contact =  response.personnes?.filter(
          (item:any) => {return item.typePersonnes?.
            map(function(e:any) {

          return e.code;
          }
          ).indexOf("CONTACT")!==-1

        });



        let per_agent =  response.personnes?.filter((item:any) => {return item.typePersonnes?.map(function(e:any) {

          return e.code;
        }).indexOf("AGENT")!==-1

        });


         let per: any = per_contact;
         let agent: any = per_agent

      console.log("contact", per)
      console.log("agent", per_agent)
        /*let per: any = personContactFromBack ;
        let agent: any = agentFromBack;*/

  //  // let per = this.beneficiaire.personnes?.filter(p=>p.id==this.personContact?this.personContact:p) || [];
  //   // person contact


    // let contactPerson = {...per[0]};
    // contactPerson.nom = this.personContact.nom ;
    // contactPerson.prenom = this.personContact.prenom;
    // contactPerson.numeroMobile = this.personContact.numeroMobile;
    // contactPerson.adresse = this.personContact.adressePhysique ;
    // contactPerson.age =  JSON.parse(this.personContact.age);
    // contactPerson.email= this.personContact.email;
    // contactPerson.numeroCNI = this.personContact.numeroCNI;
    // contactPerson.genre = JSON.parse(this.personContact.genre);
    // contactPerson.niveauInstruction = JSON.parse(this.personContact.niveauInstruction);
    // contactPerson.nomDocumentCNI = this.personContact.documentCNINom;
    // contactPerson.nombrePersonneACharge = this.personContact.nombrePersonCharge;

    let contactPerson = per[0];
    contactPerson.nom = this.personContact.nom ;
    contactPerson.prenom = this.personContact.prenom;
    contactPerson.numeroMobile = this.personContact.numeroMobile;
    contactPerson.adresse = this.personContact.adressePhysique ;
    contactPerson.age =  JSON.parse(this.personContact.age);
    contactPerson.email= this.personContact.email;
    contactPerson.numeroCNI = this.personContact.numeroCNI;
    contactPerson.genre = JSON.parse(this.personContact.genre);
    contactPerson.niveauInstruction = JSON.parse(this.personContact.niveauInstruction);
    contactPerson.nomDocumentCNI = this.personContact.documentCNINom;
    contactPerson.nombrePersonneACharge = this.personContact.nombrePersonCharge;

    //let typePers : TypePersonne = new TypePersonne();
    //typePers.code = "CONTACT";
    // console.log("sans vider le tableau",contactPerson.typePersonnes)
    // console.log("vider contact person", JSON.stringify(contactPerson.typePersonnes));
    // contactPerson.typePersonnes.push(typePers);
    // console.log(contactPerson);

    let contactAgent =  agent[0];
    // let typePers2 : TypePersonne = new TypePersonne();
    // typePers2.code = "AGENT";

    if (this.agentInfo && this.agentInfo.nom) {
        console.log('here agent info exist ');
      contactAgent.nom = this.agentInfo.nom;
      contactAgent.prenom = this.agentInfo.prenom;
      contactAgent.numeroMobile = this.agentInfo.numeroMobile;
      contactAgent.adresse = this.agentInfo.adressePhysique;
      contactAgent.age = this.agentInfo.age?  JSON.parse(this.agentInfo.age): null
      contactAgent.email = this.agentInfo.email;
      contactAgent.numeroCNI = this.agentInfo.numeroCNI;
      contactAgent.genre =this.agentInfo.genre? JSON.parse(this.agentInfo.genre): null;
      contactAgent.nombrePersonneACharge = this.agentInfo.nombrePersonCharge;
      contactAgent.niveauInstruction =this.agentInfo.niveauInstruction?  JSON.parse(this.agentInfo.niveauInstruction): null;
      contactAgent.typePersonnes =[];
      console.log("vider contact person", contactAgent.typePersonnes);
      //contactAgent.typePersonnes.push(typePers2);

      // Document CNI de l'agent
      contactAgent.nomDocumentCNI = this.agentInfo.documentCNINom;
      // microEntrepreneur.personnes = new Array<Personne>();
      console.log(contactPerson)
      // microEntrepreneur.personnes.push(contactPerson);
      // microEntrepreneur.personnes.push(contactAgent);
    }else{
      // we update just contact
      console.log(contactPerson)
      //contactPerson.typePersonnes.push(typePers2);
      // microEntrepreneur.personnes = new Array<Personne>();
      // microEntrepreneur.personnes.push(contactPerson);
    }

    // Activite

    let activity = response.activiteBeneficiaires?.filter(p=>p.id==this.activiteInfo?this.activiteInfo:p) || []

      let activite;
      if(activity[0]){
        activite = activity[0];
      }else{
        activite = new ActiviteBeneficiaire()
      }
    response.activiteBeneficiaires = [];
    activite.occupation = this.activiteInfo.occupation;
    activite.chiffreAffaireHorsTaxeAnMois1 = this.activiteInfo.chiffreAffaireHorsTaxeAnMois1;
    activite.chiffreAffaireHorsTaxeAnMois2 = this.activiteInfo.chiffreAffaireHorsTaxeAnMois2;

    if(this.activiteInfo.nombreAnneeActivite){
      activite.nombreAnneeActivite = JSON.parse(this.activiteInfo.nombreAnneeActivite);
    }

    // check secteur activite for the value setted s
    if(this.activiteInfo.secteurActivites){
      activite.secteurActivites?.push(JSON.parse(this.activiteInfo.secteurActivites));
    }
    else {
      activite.autreSecteurActivite = this.activiteInfo.secteurActivites2 ;
    }

    activite.revenueTotalAnMoins1 = this.activiteInfo.revenuTotalGroupement2019;
    activite.revenueTotalAnMoins2 = this.activiteInfo.revenuTotalGroupement2020;
    activite.nombreEmplois = this.activiteInfo.nombreEmplois;
    // activite.nombreAnneeActivite = JSON.parse(this.activiteInfo.nombreAnneeActivite)
        // permanent
   // activite.nombreEmployePermanent = this.activiteInfo.membreIndividuelGroupement;
    // activite.nombreEmployePermanentExactAdate = this.activiteInfo.nombreExactADate;
    // activite.nombreFemmeEmployePermanent = this.activiteInfo.nombreFemmePermanent ;
    // activite.pourcentageFemmeEmployePermanent = this.activiteInfo.pourcentageFemmePermanent;
    // activite.pourcentageJeuneEmployePermanent = this.activiteInfo.pourcentageJeunesPermanent;
    // activite.nombreEmployeNonPermanent = this.activiteInfo.membreNonPermanent
    // non permanent
    //activite.nombreEmployeNonPermanentExactAdate = this.activiteInfo.nombreExactADateNonPermanent;
    //activite.nombreFemmeEmployeNonPermanent = this.activiteInfo.nombreFemmeNonPermanent;
    // activite.pourcentageFemmeNonPermanent = this.activiteInfo.pourcentageFemmeNonPermanent;
    // activite.nombreJeuneEmployeNonPermanent = this.activiteInfo.nombreJeuneNonPermanent;
    // activite.pourcentageJeuneNonPermanent = this.activiteInfo.pourcentageJeunesNonPermanent;
    // revenu
    // activite.revenuplusBasParMois = this.activiteInfo.revenuMembreBasGroupement;
    // activite.revenuMoyenneParMois = this.activiteInfo.revenuMoyenGroupement;
    // activite.nombrePersonneAChargeMoyenne = this.activiteInfo.nombrePersonneChargeMoyenneParMembre;
    // locality
    //
    // let zoneGeographique = new ZoneGeographique()
    // zoneGeographique = JSON.parse(this.activiteInfo.departement) as ZoneGeographique;
    microEntrepreneur.zoneGeographique = JSON.parse(this.activiteInfo.departement) as ZoneGeographique;

    microEntrepreneur.pmoRefere = this.personContact.pmoRefere? JSON.parse(this.personContact.pmoRefere) : null;

    console.log(activite)
    microEntrepreneur.activiteBeneficiaires?.push(activite);

    microEntrepreneur.centreUrbain = this.activiteInfo.centreUrbain;
    microEntrepreneur.prenom = this.personContact.prenom ;
    microEntrepreneur.nom = this.personContact.nom ;

    console.log(JSON.stringify(microEntrepreneur));
    console.log(activite);
    console.log("personnes sended " , microEntrepreneur.personnes);
    this.numeroTelephone = this.personContact.numeroMobile ;


    microEntrepreneur.telephone = this.personContact.numeroMobile ;

    //Infos du mricroEntrepreneur
    microEntrepreneur.chiffreAffaireAnMoins1 = this.activiteInfo.chiffreAffaireHorsTaxeAnMois1;
    microEntrepreneur.chiffreAffaireAnMoins2 = this.activiteInfo.chiffreAffaireHorsTaxeAnMois1;
    microEntrepreneur.age =  JSON.parse(this.personContact.age);
    microEntrepreneur.numeroCNI = this.personContact.numeroCNI;
    microEntrepreneur.scanNumeroCNI = this.personContact.documentCNINom;
    microEntrepreneur.niveauInstruction = JSON.parse(this.personContact.niveauInstruction) ;
    microEntrepreneur.nombrePersonneACharge = this.personContact.nombrePersonCharge;
    microEntrepreneur.codeClient = this.personContact.codeClient ;

    // update info visuelle
    microEntrepreneur.scanCNIRecto = this.selphieInfo.nomDocumentCNIRecto ;
    microEntrepreneur.scanCNIVerso = this.selphieInfo.nomDocumentCNIVerso ;


    this.isSpinning = true;
    console.log("form me personne: "+JSON.stringify(microEntrepreneur.personnes));
    if (this.beneficiaireId){
     console.log(microEntrepreneur)
      if(this.auth.getRole() !== 'AGENT_INITIATEUR'){
        this.beneficiaireMeService.update(microEntrepreneur).subscribe(
          response => {
            console.log('update', response)
            this.isSpinning = false;
            this.router.navigateByUrl("/beneficiaire")
            this.notificationService.success('Succés' , 'Information bénéficiaire mis à jour avec succés ')
          }
        )
      }else{
          console.log("update sans demande")
              if(!microEntrepreneur.demandes?.[0]){
                microEntrepreneur.id = this.beneficiaireId
                this.beneficiaireMeService.save(microEntrepreneur).subscribe(
                  response => {
                  console.log('save', response)
                    this.notificationService.success('Succés' , 'bénéficiaire initier avec succés ')
                      this.modalService.closeAll()
                      this.modalService.create({
                        nzTitle: 'Demande de Financement',
                        nzContent: FormDemandeComponent,
                        nzComponentParams:{
                          beneficiairetp: this.beneficiairetp
                        },
                        nzWidth: 1200,
                        nzCancelText: null,
                        nzOkText : null
                      });
                  })
              }else{
                this.beneficiaireMeService.update(microEntrepreneur).subscribe(
                  response => {
                  console.log('update', response)
                    this.isSpinning = false;
                    this.modalService.closeAll()
                    this.notificationService.success('Succés' , 'Information bénéficiaire mis à jour avec succés ')
                  })
              }
      }
    }
    },
      error => {
        console.log(error);
        this.isSpinning = false;
      })
  }
  nextWithoutAgent() {

    switch (this.currentStepPosition){
      case 0: console.log(this.personContact); break;
      case 1: console.log(this.agentInfo); break;
      case 2: console.log(this.activiteInfo); break;
      case 2: console.log(this.selphieInfo); break;
      case 3: console.log(this.connexionInfo);
        this.sendMeInfo();
        return;
    }
if ((this.auth.getRole()=='AGENT_INITIATEUR')){
  this.currentStepPosition+= 1
}else {
  this.currentStepPosition+= 2 ;
}
  }

  onIndexChange(index: number): void {
    // console.log(index);
    this.currentStepPosition = index;
    if(this.idPmo && index==3){
      this.currentStepPosition = index+1;
    }
    else{
      this.currentStepPosition = index;
    }

  }
 private intervalId: any;
 premiere() {
  this.renvoiCode = true;
  // Assign the interval ID when you call setInterval
  this.intervalId = setInterval(() => {
     this.deuxieme();
  }, 1000);
 }


  getTimer() {
      this.premiere();
  }

  deuxieme() {
    if (this.nombreSecond !== 0) {
       this.nombreSecond--;
    } else {
       this.renvoiCode = false;
       // Pass the interval ID to clearInterval
       clearInterval(this.intervalId);
    }
   }
  }





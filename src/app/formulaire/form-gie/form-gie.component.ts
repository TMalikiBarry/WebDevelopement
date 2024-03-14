import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { ActiviteBeneficiaire } from 'src/app/model/activite-beneficiaire';
import { ApiResponseBenef } from 'src/app/model/api-response-benef';
import { BeneficiaireGie } from 'src/app/model/beneficiaire-gie';
import { NiveauInstruction } from 'src/app/model/niveau-instruction';
import { Personne } from 'src/app/model/personne';
import { TypePersonne } from 'src/app/model/type-personne';
import { ZoneGeographique } from 'src/app/model/zone-geographique';
import { BeneficiaireGieService } from 'src/app/services/beneficiaire/beneficiaire-gie/beneficiaire-gie.service';
import { GieIdentificationActiviteGroupementComponent } from './gie-identification-activite-groupement/gie-identification-activite-groupement.component';
import { GieIdentificationAgentComponent } from './gie-identification-agent/gie-identification-agent.component';
import { GieIdentificationGroupementComponent } from './gie-identification-groupement/gie-identification-groupement.component';
import { GieIdentificationPersonContactComponent } from './gie-identification-person-contact/gie-identification-person-contact.component';
import { RegisterFormGieComponent } from './register-form-gie/register-form-gie.component';
import { Acces } from 'src/app/model/acces';
import { getTimeConfig } from 'ng-zorro-antd/date-picker';
import {PMO} from "../../model/pmo";
import {ActivatedRoute, Router} from "@angular/router";
import {PmoService} from "../../services/pmo/pmo.service";
import {environment} from "../../../environments/environment";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {AuthService} from "../../services/security/auth/auth.service";
import {BeneTP} from "../../model/beneTP";
import {Beneficiaire} from "../../model/beneficiaire";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormDemandeComponent} from "../form-demande/form-demande.component";

@Component({
  selector: 'app-form-gie',
  templateUrl: './form-gie.component.html',
  styleUrls: ['./form-gie.component.scss']
})

export class FormGieComponent implements OnInit ,OnChanges {
  @Input() beneficiairetp !: Beneficiaire
  //@Input() beneTp !: Beneficiaire

  benefApiResponse : ApiResponseBenef = new ApiResponseBenef();

  // step information received
  personContact : any ;

  // step information for groupement info
  groupementInfo : any ;

  // set info for activte
  activiteInfo : any ;

  // step info for register
  connexionInfo : any ;

  // agent
  agentInfo : any ;
  pmoRefere: PMO = new PMO;
  selphieInfo : any ;
  showPmoReferant:boolean  = true;
  nombreSecond: number = 0;
  renvoiCode: boolean = true;
  currentStepPosition : number = 0 ;
  numeroTelephone : any ;
  stepname: string =  '';
  idPmo: any;
  showModel:boolean  = false;
  showOtp = false ;
  showSuccessPmo = false ;
  isSpinning: boolean = false;
  beneficiaireId: number = 0;
  beneficiaire?: BeneficiaireGie

  constructor(private benefGieService:BeneficiaireGieService, private activatedRoute: ActivatedRoute, private beneficiaireService: BeneficiaireGieService,
              private router: Router, private pmoService: PmoService,
              private notificationService : NzNotificationService,
              private modalService : NzModalService,
              public auth :AuthService) {
    this.beneficiaireId = this.activatedRoute.snapshot.params.beneficiaire;
    this.idPmo = activatedRoute.snapshot.params.pmo;
    console.log('idpmo recu', this.idPmo);
  }

  ngOnInit(): void {

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

    if (this.beneficiaireId === undefined){
      console.log('AKCINA GIE')
    }else {
      this.beneficiaireService.getById(this.beneficiaireId).subscribe(response => {
        console.log("BENEFICIAIRE",response)
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
       // let contact: any = per_contact
        let per_agent =  response.personnes?.filter((item:any) => {return item.typePersonnes?.map(function(e:any) {

          return e.code;
        }).indexOf("AGENT")!==-1

        });
       // let per = contact

      /*  this.personContact = {
          nom: per[0]?.nom,
          prenom: per[0]?.prenom,
          numeroMobile: per[0]?.numeroMobile,
          adressePhysique: per[0]?.adresse,
          age: JSON.stringify(per[0]?.age),
          email: per[0]?.email,
          numeroCNI: per[0]?.numeroCNI,
          genre: per[0]?.genre,
          niveauInstruction: JSON.stringify(per[0]?.niveauInstruction),
          documentCNINom: per[0]?.nomDocumentCNI,
          nombrePersonCharge: per[0]?.nombrePersonneACharge,
          pmoRefere: response?.pmoRefere
        }
        let agent: any = per_agent

        this.agentInfo = {
          nom: agent[0]?.nom,
          prenom: agent[0]?.prenom,
          numeroMobile: agent[0]?.numeroMobile,
          adressePhysique: agent[0]?.adresse,
          age: JSON.stringify(agent[0]?.age),
          email: agent[0]?.email,
          numeroCNI: agent[0]?.numeroCNI,
          genre: agent[0]?.genre,
          niveauInstruction: JSON.stringify(agent[0]?.niveauInstruction),
          documentCNINom: agent[0]?.nomDocumentCNI,
          nombrePersonCharge: agent[0]?.nombrePersonneACharge
        }*/

        let contact: any = personContactFromBack ;
        let agent: any = agentFromBack ;
        this.personContact = {
          nom: contact?.nom,
          prenom: contact?.prenom,
          numeroMobile: contact?.numeroMobile,
          adressePhysique: contact?.adresse,
          age: JSON.stringify(contact?.age),
          email: contact?.email,
          numeroCNI: contact?.numeroCNI,
          genre: contact?.genre,
          niveauInstruction: JSON.stringify(contact?.niveauInstruction),
          documentCNINom: contact?.nomDocumentCNI,
          nombrePersonCharge: contact?.nombrePersonneACharge,
          pmoRefere: JSON.stringify(response?.pmoRefere),
          personAgentSame : personAgentSame ,
          estRefere : response?.pmoRefere ? true : false
        }

        this.agentInfo = {
          nom: agent?.nom,
          prenom: agent?.prenom,
          numeroMobile: agent?.numeroMobile,
          adressePhysique: agent?.adresse,
          age: JSON.stringify(agent?.age),
          email: agent?.email,
          numeroCNI: agent?.numeroCNI,
          genre: agent?.genre,
          niveauInstruction: JSON.stringify(agent?.niveauInstruction),
          documentCNINom: agent?.nomDocumentCNI,
          nombrePersonCharge: agent?.nombrePersonneACharge,
          personAgentSame : personAgentSame ,
        }

        let activity = response.activiteBeneficiaires?.filter(p=>p.id==this.activiteInfo?this.activiteInfo:p) || []
        let secteur = activity[0]?.secteurActivites?.filter(p=>p.code==this.activiteInfo?this.activiteInfo:p) || []

        this.activiteInfo = {
          nombreAnneeActivite: JSON.stringify(activity[0]?.nombreAnneeActivite),
          secteurActivite: JSON.stringify(secteur[0]),
          autreSecteurActivite: activity[0]?.autreSecteurActivite,
          revenuTotalGroupement2019: activity[0]?.revenueTotalAnMoins1,
          revenuTotalGroupement2020: activity[0]?.revenueTotalAnMoins2,
          membreIndividuelGroupement: activity[0]?.nombreEmployePermanent,
          nombreExactADate: activity[0]?.nombreEmployePermanentExactAdate,
          nombreFemmePermanent: activity[0]?.nombreFemmeEmployePermanent,
          pourcentageFemmePermanent: activity[0]?.pourcentageFemmeEmployePermanent,
          pourcentageJeunesPermanent: activity[0]?.pourcentageJeuneEmployePermanent,
          nombreJeunePermanent: activity[0]?.nombreJeuneEmployePermanent,
          // non permanent
          membreNonPermanent: activity[0]?.nombreEmployeNonPermanent,
          nombreExactADateNonPermanent: activity[0]?.nombreEmployeNonPermanentExactAdate,
          nombreFemmeNonPermanent: activity[0]?.nombreFemmeEmployeNonPermanent,
          pourcentageFemmeNonPermanent: activity[0]?.pourcentageFemmeNonPermanent,
          nombreJeuneNonPermanent: activity[0]?.nombreJeuneEmployeNonPermanent,
          pourcentageJeunesNonPermanent: activity[0]?.pourcentageJeuneNonPermanent,
          // revenu
          revenuMembreBasGroupement: activity[0]?.revenuplusBasParMois,
          revenuMoyenGroupement: activity[0]?.revenuMoyenneParMois,
          nombrePersonneChargeMoyenneParMembre: activity[0]?.nombrePersonneAChargeMoyenne
        }
        this.groupementInfo = {
          nomGroupement: response?.nom,
          adresseEmail: response?.email,
          statusJuridique: response?.statusJuridique,
          dateCreation: String(response?.dateCreation).slice(0,10),
          adresse: response?.adresse,
          documentConstitutionNom: response?.nomDocumentConstitution,
          centreUrbain: response?.centreUrbain,
          departement : JSON.stringify(response.zoneGeographique)
        }

        this.selphieInfo = {
          nomDocumentCNIRecto : response.scanCNIRecto ,
          nomDocumentCNIVerso : response.scanCNIVerso ,
          nomDocumentSelphie :  response.selfie   ,
          imageRecto : environment.baseUrlFile+response.scanCNIRecto ,
          imageVerso : environment.baseUrlFile+response.scanCNIVerso,
          imageSelphie : environment.baseUrlFile+response.selfie
        }
        localStorage.setItem('idPersonneContact', contact.id)
      })
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
      this.currentStepPosition -=2 ;
      return
    }

    if (this.currentStepPosition == 5 && this.idPmo){
      this.currentStepPosition -= 2;
      return;
    }

    this.currentStepPosition-= 1 ;

  }

  next(){
    this.showModel = false;

    if((this.auth.getRole()=='AGENT_INITIATEUR')){
      if(this.currentStepPosition == 3) {
        if (!this.personContact) {
          this.stepname = "la personne contact";
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }
        if (!this.groupementInfo) {
          this.stepname = "groupement";
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

        this.sendGieInfo();
        return;
      }
    }
    else {
    if(this.currentStepPosition == 5) {
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
      if (!this.groupementInfo) {
        this.stepname = "groupement";
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

      if(!this.idPmo){
          if(!this.selphieInfo){
            this.stepname = "la pièce d'identite recto et verso";
            this.showModel = true;
            return;
          }else{
            this.showModel = false;
          }
      }


      this.sendGieInfo();
      return;
    }}

    if(this.idPmo && this.activiteInfo){
      this.currentStepPosition+= 2 ;
    }
    else{
      this.currentStepPosition+= 1 ;
    }
  }

  done(){}

  sendGieInfo(){
    let gie = new BeneficiaireGie();

    // person contact
    let contactPerson = new Personne();
    contactPerson.id= this.personContact.id
    contactPerson.nom = this.personContact.nom ;
    contactPerson.prenom = this.personContact.prenom;
    contactPerson.numeroMobile = this.personContact.numeroMobile;
    contactPerson.adresse = this.personContact.adressePhysique ;
    contactPerson.age = JSON.parse(this.personContact.age);
    contactPerson.email= this.personContact.email;
    contactPerson.numeroCNI = this.personContact.numeroCNI;
    contactPerson.nomDocumentCNI = this.personContact.documentCNINom;
    contactPerson.niveauInstruction = JSON.parse(this.personContact.niveauInstruction) ;
    contactPerson.codeClient = this.personContact.codeClient ;
    // type personne
    let typePers : TypePersonne = new TypePersonne();
    typePers.code = "CONTACT";
    contactPerson.typePersonnes =[]
    contactPerson.nomDocumentCNI = this.personContact.documentCNINom;
    contactPerson.typePersonnes.push(typePers);

    // personne agent
    let contactAgent = new Personne();
    // type personne
    let typePers2 : TypePersonne = new TypePersonne();
    typePers2.code = "AGENT";

    if (this.agentInfo){
      contactAgent.nom = this.agentInfo.nom ;
      contactAgent.prenom = this.agentInfo.prenom;
      contactAgent.numeroMobile = this.agentInfo.numeroMobile;
      contactAgent.adresse = this.agentInfo.adressePhysique ;
      if(this.activiteInfo.age)
      contactAgent.age = JSON.parse(this.agentInfo.age);
      contactAgent.email= this.agentInfo.email;
      contactAgent.numeroCNI = this.agentInfo.numeroCNI;
      //  let niv2 = new NiveauInstruction();
      //   niv2.code = this.agentInfo.niveauInstruction;
      //   contactAgent.niveauInstruction = niv2 ;
      // contactAgent.niveauInstruction = this.agentInfo.niveauInstruction ;
      if(this.activiteInfo.niveauInstruction)
      contactAgent.niveauInstruction = JSON.parse(this.agentInfo.niveauInstruction) ;

    contactAgent.typePersonnes =[];
    contactAgent.nomDocumentCNI = this.agentInfo.documentCNINom
    contactAgent.typePersonnes.push(typePers2);
      gie.personnes = new Array<Personne>();
      gie.personnes.push(contactPerson);
      gie.personnes.push(contactAgent);
      // let access = new Acces();
      // access.login = this.connexionInfo.username;
      // access.password = this.connexionInfo.password;
      // contactPerson.acces = access;

    } else {
      contactPerson.typePersonnes.push(typePers2);
      gie.personnes = new Array<Personne>();
      gie.personnes.push(contactPerson);
      if (!(this.auth.getRole()=='AGENT_INITIATEUR')){
      let access = new Acces();
      access.login = this.connexionInfo.username;
      access.password = this.connexionInfo.password;
      contactPerson.acces = access;
    }}




    // Activite
    let activite = new ActiviteBeneficiaire();

    activite.nombreAnneeActivite = JSON.parse(this.activiteInfo.nombreAnneeActivite);
    activite.secteurActivites?.push(JSON.parse(this.activiteInfo.secteurActivite));
    activite.autreSecteurActivite = this.activiteInfo.autreSecteurActivite;

    activite.revenueTotalAnMoins1 = this.activiteInfo.revenuTotalGroupement2019;
    activite.revenueTotalAnMoins2 = this.activiteInfo.revenuTotalGroupement2020;

    activite.nombreEmployePermanent = this.activiteInfo.membreIndividuelGroupement ? JSON.parse(this.activiteInfo.membreIndividuelGroupement) : null;
    activite.nombreEmployePermanentExactAdate = this.activiteInfo.nombreExactADate;
    activite.nombreFemmeEmployePermanent = this.activiteInfo.nombreFemmePermanent ;
    activite.pourcentageFemmeEmployePermanent = this.activiteInfo.pourcentageFemmePermanent;
    activite.pourcentageJeuneEmployePermanent = this.activiteInfo.pourcentageJeunesPermanent;
    activite.nombreJeuneEmployePermanent = this.activiteInfo.nombreJeunePermanent;
      // non permanent
    activite.nombreEmployeNonPermanent = this.activiteInfo.membreNonPermanent ? JSON.parse(this.activiteInfo.membreNonPermanent) : null;
    activite.nombreEmployeNonPermanentExactAdate = this.activiteInfo.nombreExactADateNonPermanent;
    activite.nombreFemmeEmployeNonPermanent = this.activiteInfo.nombreFemmeNonPermanent;
    activite.pourcentageFemmeNonPermanent = this.activiteInfo.pourcentageFemmeNonPermanent;
    activite.nombreJeuneEmployeNonPermanent = this.activiteInfo.nombreJeuneNonPermanent;
    activite.pourcentageJeuneNonPermanent = this.activiteInfo.pourcentageJeunesNonPermanent;
      // revenu
    activite.revenuplusBasParMois = parseInt(this.activiteInfo.revenuMembreBasGroupement?.replace(/\s/g, ""));
    activite.revenuMoyenneParMois = parseInt(this.activiteInfo.revenuMoyenGroupement?.replace(/\s/g, ""));
    activite.nombrePersonneAChargeMoyenne = this.activiteInfo.nombrePersonneChargeMoyenneParMembre;


    // groupement

    gie.nom = this.groupementInfo.nomGroupement;
    gie.email = this.groupementInfo.adresseEmail;
    gie.statusJuridique = this.groupementInfo.statusJuridique;
    gie.dateCreation = new Date(this.groupementInfo.dateCreation) ;
    gie.adresse = this.groupementInfo.adresse;
    gie.nomDocumentConstitution = this.groupementInfo.documentConstitutionNom;
    gie.codeClient = this.personContact.codeClient ;
    gie.zoneGeographique = JSON.parse(this.groupementInfo.departement) as ZoneGeographique
      // // zone geographique --- Departement
      // let departement = new ZoneGeographique();
      // departement.typeZone = "DEPARTEMENT";
      // departement.libelle = this.groupementInfo.departement;
      // departement.id = 1000 ;
      // // zone geographique --- Region
      // let region = new ZoneGeographique();
      // region.typeZone = "REGION";
      // region.libelle = this.groupementInfo.region;

    gie.centreUrbain= this.groupementInfo.centreUrbain;


    gie.activiteBeneficiaires?.push(activite);

    if(this.idPmo){
      gie.pmoRefere = this.pmoRefere;
      gie.pmoRattachement = this.pmoRefere;
    }
    else{
      gie.pmoRefere = this.personContact.pmoRefere? JSON.parse(this.personContact.pmoRefere) : null;
    }

    //console.log(JSON.stringify(gie));

    gie.telephone = this.personContact.numeroMobile ;

    this.numeroTelephone = this.personContact.numeroMobile;

    // recto verso selphie CNI
    if(!this.idPmo){
      gie.scanCNIRecto = this.selphieInfo.nomDocumentCNIRecto ;
      gie.scanCNIVerso = this.selphieInfo.nomDocumentCNIVerso ;
      gie.selfie = this.selphieInfo.nomDocumentSelphie  ;
    }

    // recto Verson selphie CNI
    this.isSpinning = true;
    console.log(JSON.stringify(gie));
    this.Save(gie);
  }

  Save(gie : BeneficiaireGie){
    this.benefGieService.save(gie).subscribe(
      response => {
        //console.log(response);
        this.benefApiResponse= response ;
        if(!this.idPmo){
          this.showOtp = true;
        }
        else{
          this.showSuccessPmo = true;
        }

        this.renvoiCode = false;
        this.nombreSecond = 60;
        this.getTimer();
        //console.log(this.benefApiResponse);
        this.isSpinning = false;

        if(this.auth.getRole() == "AGENT_INITIATEUR" && !gie.demandes){
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
      }
      ,
      error => {
        //console.log(error)
      }
    )
  }

  sendGieInfoUpdate(){
    this.beneficiaireService.getById(this.beneficiaireId).subscribe(response=>{
     // let gie = response;
      let gie: BeneficiaireGie = response
      console.log(response)
      // retrive the list of person
      let listPersons = response.personnes;
      let personContactFromBack : any ;
      let personAgentSame : boolean = false ;
      let agentFromBack : any ;
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
      /*let per = per_contact || []
      let agent = per_agent || []*/
      let per: any = personContactFromBack ;
      let agent: any = agentFromBack;

      //let per =  response.personnes?.filter(p=>p.id==this.personContact?this.personContact:p) || []
      // person contact
      let contactPerson = {...per } ;
      contactPerson.id= this.personContact.id
      contactPerson.nom = this.personContact.nom ;
      contactPerson.prenom = this.personContact.prenom;
      contactPerson.numeroMobile = this.personContact.numeroMobile;
      contactPerson.adresse = this.personContact.adressePhysique ;
      contactPerson.age = this.personContact.age? JSON.parse(this.personContact.age): null;
      contactPerson.email= this.personContact.email;
      contactPerson.numeroCNI = this.personContact.numeroCNI;
      contactPerson.nomDocumentCNI = this.personContact.documentCNINom;
      contactPerson.niveauInstruction = this.personContact.niveauInstruction? JSON.parse(this.personContact.niveauInstruction): null ;

      // type personne
      // let typePers : TypePersonne = new TypePersonne();
      // typePers.code = "CONTACT";
      // contactPerson.typePersonnes =[]
      // contactPerson.nomDocumentCNI = this.personContact.documentCNINom;
      // contactPerson.typePersonnes.push(typePers);

      // personne agent
      let contactAgent = {...agent };
      // type personne
      // let typePers2 : TypePersonne = new TypePersonne();
      // typePers2.code = "AGENT";

      if (this.agentInfo && this.agentInfo.nom){
        contactAgent.nom = this.agentInfo.nom ;
        contactAgent.prenom = this.agentInfo.prenom;
        contactAgent.numeroMobile = this.agentInfo.numeroMobile;
        contactAgent.adresse = this.agentInfo.adressePhysique ;
        contactAgent.age = this.agentInfo.age? JSON.parse(this.agentInfo.age): null;
        contactAgent.email= this.agentInfo.email;
        contactAgent.numeroCNI = this.agentInfo.numeroCNI;
        contactAgent.niveauInstruction = this.agentInfo.niveauInstruction? JSON.parse(this.agentInfo.niveauInstruction): null ;

        contactAgent.typePersonnes =[];
        contactAgent.nomDocumentCNI = this.agentInfo.documentCNINom
       // contactAgent.typePersonnes.push(typePers2);
        gie.personnes = new Array<Personne>();
        gie.personnes.push(contactPerson);
        gie.personnes.push(contactAgent);

      } else {
        //contactPerson.typePersonnes.push(typePers2);
        gie.personnes = new Array<Personne>();
        gie.personnes.push(contactPerson);
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

      activite.nombreAnneeActivite = JSON.parse(this.activiteInfo.nombreAnneeActivite);
      activite.secteurActivites?.push(JSON.parse(this.activiteInfo.secteurActivite));
      activite.autreSecteurActivite = this.activiteInfo.autreSecteurActivite;

      activite.revenueTotalAnMoins1 = this.activiteInfo.revenuTotalGroupement2019;
      activite.revenueTotalAnMoins2 = this.activiteInfo.revenuTotalGroupement2020;

      activite.nombreEmployePermanent =  this.activiteInfo.membreIndividuelGroupement ? JSON.parse(this.activiteInfo.membreIndividuelGroupement) : null;
      activite.nombreEmployePermanentExactAdate = this.activiteInfo.nombreExactADate;
      activite.nombreFemmeEmployePermanent = this.activiteInfo.nombreFemmePermanent ;
      activite.pourcentageFemmeEmployePermanent = this.activiteInfo.pourcentageFemmePermanent;
      activite.pourcentageJeuneEmployePermanent = this.activiteInfo.pourcentageJeunesPermanent;
      activite.nombreJeuneEmployePermanent = this.activiteInfo.nombreJeunePermanent;
      // non permanent
      activite.nombreEmployeNonPermanent = this.activiteInfo.membreNonPermanent ? JSON.parse(this.activiteInfo.membreNonPermanent) : null;
      activite.nombreEmployeNonPermanentExactAdate = this.activiteInfo.nombreExactADateNonPermanent;
      activite.nombreFemmeEmployeNonPermanent = this.activiteInfo.nombreFemmeNonPermanent;
      activite.pourcentageFemmeNonPermanent = this.activiteInfo.pourcentageFemmeNonPermanent;
      activite.nombreJeuneEmployeNonPermanent = this.activiteInfo.nombreJeuneNonPermanent;
      activite.pourcentageJeuneNonPermanent = this.activiteInfo.pourcentageJeunesNonPermanent;
      // revenu
      activite.revenuplusBasParMois = parseInt(this.activiteInfo.revenuMembreBasGroupement?.replace(/\s/g, ""));
      activite.revenuMoyenneParMois = parseInt(this.activiteInfo.revenuMoyenGroupement?.replace(/\s/g, ""));
      activite.nombrePersonneAChargeMoyenne = this.activiteInfo.nombrePersonneChargeMoyenneParMembre;


      // groupement

      gie.nom = this.groupementInfo.nomGroupement;
      gie.email = this.groupementInfo.adresseEmail;
      gie.statusJuridique = this.groupementInfo.statusJuridique;
      gie.dateCreation = new Date(this.groupementInfo.dateCreation) ;
      gie.adresse = this.groupementInfo.adresse;
      gie.nomDocumentConstitution = this.groupementInfo.documentConstitutionNom

      gie.centreUrbain= this.groupementInfo.centreUrbain;
      gie.codeClient = this.personContact.codeClient ;

      gie.activiteBeneficiaires?.push(activite);

      gie.zoneGeographique = JSON.parse(this.groupementInfo.departement) as ZoneGeographique ;
      gie.pmoRefere = this.personContact.pmoRefere? JSON.parse(this.personContact.pmoRefere) : null;

      // update info visuelle
      gie.scanCNIRecto = this.selphieInfo.nomDocumentCNIRecto ;
      gie.scanCNIVerso = this.selphieInfo.nomDocumentCNIVerso ;

      console.log(gie);

      this.isSpinning = true;
      if(this.beneficiaireId){
        if(this.auth.getRole() !== 'AGENT_INITIATEUR'){
          this.benefGieService.update(gie).subscribe(
            response => {
              console.log(response);
              this.isSpinning = false;
              this.router.navigateByUrl("/beneficiaire")
              this.notificationService.success('Succés' , 'Information bénéficiaire mis à jour avec succés ')
            },
            error => {
              console.log(error)
            }
          )
        }else{
          if (!gie.demandes?.[0]){
            gie.id =this.beneficiaireId
            this.beneficiaireService.save(gie).subscribe(
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
            this.beneficiaireService.update(gie).subscribe(
              response => {
                console.log('update', response)
                this.isSpinning = false;
                this.modalService.closeAll()
                this.notificationService.success('Succés' , 'Information bénéficiaire mis à jour avec succés ')
              })
          }
        }
      }

    })

  }

  nextWithoutAgent() {
      if(this.currentStepPosition == 0){

        //console.log(this.personContact);
      }

      if(this.currentStepPosition == 1){

        //console.log(this.agentInfo)
      }

      if(this.currentStepPosition == 2){

        //console.log(this.groupementInfo)
      }


      if(this.currentStepPosition == 3){

        //console.log(this.activiteInfo)
      }

      if(this.currentStepPosition == 5){

        //console.log(this.connexionInfo)
        this.sendGieInfo();

        return ;
      }
    if ((this.auth.getRole()=='AGENT_INITIATEUR')){
      this.currentStepPosition+= 1
    }else {
      this.currentStepPosition += 2;
    }


  }

  onIndexChange(index: number): void {
    // console.log(index);
    this.currentStepPosition = index;
    if(this.idPmo && index==4){
      this.currentStepPosition = index+1;
    }
    else{
      this.currentStepPosition = index;
    }

  }
  private intervalId: any;


  premiere() {
    this.renvoiCode = true;
    // Assign the interval ID
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
       // Clear the interval using the stored ID
       clearInterval(this.intervalId);
    }
   }

  onGetBeneficiaire(){
    this.beneficiaireService.getById(this.beneficiaireId).subscribe((response) => {
      console.log(response);
      this.beneficiaire = response ;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}

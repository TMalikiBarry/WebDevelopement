import {Component, Input, OnInit} from '@angular/core';
import {ActiviteBeneficiaire} from 'src/app/model/activite-beneficiaire';
import {ApiResponseBenef} from 'src/app/model/api-response-benef';
import {BeneficiairePME} from 'src/app/model/beneficiaire-pme';
import {BeneficiairePmeService} from 'src/app/services/beneficiaire/beneficiaire-pme/beneficiaire-pme.service';

import {Personne} from 'src/app/model/personne';
import {TypePersonne} from 'src/app/model/type-personne';
import {Acces} from 'src/app/model/acces';
import {Titre} from 'src/app/model/titre';
import {ActivatedRoute, Router} from "@angular/router";
import {PmoService} from "../../services/pmo/pmo.service";
import {environment} from 'src/environments/environment';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {PMO} from 'src/app/model/pmo';
import {AuthService} from "../../services/security/auth/auth.service";
import {BeneTP} from "../../model/beneTP";
import {Beneficiaire} from "../../model/beneficiaire";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormDemandeComponent} from "../form-demande/form-demande.component";
import {ZoneGeographique} from "../../model/zone-geographique";

@Component({
  selector: 'app-form-entreprise',
  templateUrl: './form-entreprise.component.html',
  styleUrls: ['./form-entreprise.component.scss']
})
export class FormEntrepriseComponent implements OnInit {

  //@Input() beneTp !: Beneficiaire
  @Input() beneficiairetp !: Beneficiaire

  dirigeants: any;

  personContact: any;

  agent: any;

  entreprise: any;

  activite: any;

  connexionInfo: any;

  selphieInfo: any;

  benefApiResponse = new ApiResponseBenef();

  numeroTelephone = 0;
  stepname: string = '';
  showModel: boolean = false;
  showOtp = false;
  showSuccessPmo = false;
  nombreSecond: number = 0;
  renvoiCode: boolean = true;
  isSpinning: boolean = false;
  beneficiaireId: any;
  showPmoReferant: boolean = true;
  beneficiaire?: BeneficiairePME;
  idPmo: any;
  pmoRefere: PMO = new PMO;

  constructor(private beneficiaireService: BeneficiairePmeService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private pmoService: PmoService,
              public auth: AuthService,
              private modalService : NzModalService,
              private notificationService: NzNotificationService) {
    this.beneficiaireId = this.activatedRoute.snapshot.params.beneficiaire;
    this.idPmo = activatedRoute.snapshot.params.pmo;
  }

  currentStepPosition: number = 0;

  ngOnInit(): void {

    if ((this.auth.getRole()=='AGENT_INITIATEUR')) {
      if (this.beneficiairetp) {
        if (this.beneficiairetp.id)
          this.beneficiaireId = this.beneficiairetp.id
      }
    }

    if (this.idPmo) {
      this.getPMOInfos();
      this.showPmoReferant = false;
    } else {
      this.showPmoReferant = true;
    }

    if (this.beneficiaireId === undefined) {
      console.log('AKCINA PME')
    } else {
      this.beneficiaireService.getById(this.beneficiaireId).subscribe(response => {
        console.log("BENEFICIAIRE", response)

        let listPersons = response.personnes;
        let personContactFromBack: any;
        let agentFromBack: any;
        let personAgentSame: boolean = false;
        listPersons?.forEach(element => {
          if (element.typePersonnes) {

            let listOfType = element.typePersonnes.map(el => {
              return el.code
            });

            if (listOfType.indexOf("CONTACT") !== -1 && listOfType.indexOf("AGENT") !== -1) {
              personContactFromBack = element;
              personAgentSame = true;
            } else if (listOfType.length == 1 && listOfType.indexOf("CONTACT") !== -1) {
              personContactFromBack = element
            } else if (listOfType.length == 1 && listOfType.indexOf("AGENT") !== -1) {
              agentFromBack = element
            }
          }
        });

        let contact: any = {...personContactFromBack};

        this.personContact = {
          nom: contact?.nom,
          prenom: contact?.prenom,
          numeroMobile: contact?.numeroMobile,
          adressePhysique: contact?.adresse,
          email: contact?.email,
          numeroCNI: contact?.numeroCNI,
          pmoRefere: response?.pmoRefere ? JSON.stringify(response?.pmoRefere) : null,

          // add some information for radioValue and est_refere
          personAgentSame: personAgentSame,
          estRefere: !!response?.pmoRefere
        }

        let agent: any = {...agentFromBack};

        this.agent = {
          nom: agent?.nom,
          prenom: agent?.prenom,
          numeroMobile: agent?.numeroMobile,
          adressePhysique: agent?.adresse,
          email: agent?.email,
          numeroCNI: agent?.numeroCNI,
          documentCNINom: agent?.nomDocumentCNI,
          personAgentSame: personAgentSame,
        }

        console.log("agent from back ", this.agent)
        this.entreprise = {
          denominationSociale: response?.denominationSociale,
          numeroRccm: response?.numeroRCCM,
          documentRccm: response.documentRCCM ? response.documentRCCM : '',
          ninea: response?.ninea,
          documentNinea: response.documentNinea ? response.documentNinea : '',
          statutJuridique: response?.statusJuridique,
          dateCreation: String(response?.dateCreation).slice(0, 10),
          adressePhysique: response?.adresse,
          departement: JSON.stringify(response?.zoneGeographique),
          centreUrbain: response?.centreUrbain,

          documentRCCMNom: response.documentRCCM ? response.documentRCCM : '',
          documentConstitutionNom: response.documentConstitution ? response.documentConstitution : '',
          documentNineaNom: response.documentNinea ? response.documentNinea : '',
        }

        let dirigeant = response.personnes?.filter((item: any) => {
          return item.typePersonnes?.map(function (e: any) {

            return e.code;
          }).indexOf("DIRIGEANT") !== -1

        });
        console.log("DIRIGEANT ", dirigeant)

        let associe = response.personnes?.filter((item: any) => {
          return item.typePersonnes?.map(function (e: any) {

            return e.code;
          }).indexOf("ASSOCIE") !== -1

        });

        let dir: any = dirigeant
        this.dirigeants = {dirigeants: dir, associes: associe};

        let activity = response.activiteBeneficiaires?.filter(p => p.id == this.activite ? this.activite : p) || []
        let secteur = activity[0]?.secteurActivites?.filter(p => p.code == this.activite ? this.activite : p) || []

        this.activite = {
          secteurActivite: JSON.stringify(secteur[0]),
          departement: response?.zoneGeographique ? JSON.stringify(response?.zoneGeographique) : null,
          secteurActiviteAutre: activity[0]?.autreSecteurActivite,
          nombreAnneeActivite: JSON.stringify(activity[0]?.nombreAnneeActivite),
          revenuTotalGroupement2019: activity[0]?.revenueTotalAnMoins1,
          revenuTotalGroupement2020: activity[0]?.revenueTotalAnMoins2,
          etatFinancier2019: activity[0]?.etatFinancierAnMois2 ? activity[0]?.etatFinancierAnMois2 : '',
          etatFinancier2020: activity[0]?.etatFinancierAnMois1 ? activity[0]?.etatFinancierAnMois1 : '',
          employePermanent: activity[0]?.nombreEmployePermanent ? JSON.stringify(activity[0]?.nombreEmployePermanent) : null,
          nombreExactADate: activity[0]?.nombreEmployePermanentExactAdate,
          nombreFemmePermanent: activity[0]?.nombreFemmeEmployePermanent,
          pourcentageFemmePermanent: activity[0]?.pourcentageFemmeEmployePermanent,
          nombreJeunePermanent: activity[0]?.nombreJeuneEmployePermanent,
          pourcentageJeunesPermanent: activity[0]?.pourcentageJeuneEmployePermanent,
          membreNonPermanent: JSON.stringify(activity[0]?.nombreEmployeNonPermanent),
          nombreExactADateNonPermanent: activity[0]?.nombreEmployeNonPermanentExactAdate,
          nombreFemmeNonPermanent: activity[0]?.nombreFemmeEmployeNonPermanent,
          pourcentageFemmeNonPermanent: activity[0]?.pourcentageFemmeNonPermanent,
          nombreJeuneNonPermanent: activity[0]?.nombreJeuneEmployeNonPermanent,
          pourcentageJeunesNonPermanent: activity[0]?.pourcentageJeuneNonPermanent,
          revenuMembreBasGroupement: activity[0]?.revenuplusBasParMois,
          revenuMoyenGroupement: activity[0]?.revenuMoyenneParMois,
          centreUrbain: response?.centreUrbain,

          etatFinancier2019Nom: activity[0]?.etatFinancierAnMois2 ? activity[0]?.etatFinancierAnMois2 : '',
          etatFinancier2020Nom: activity[0]?.etatFinancierAnMois1 ? activity[0]?.etatFinancierAnMois1 : '',
        }

        // retrieve selphie information

        this.selphieInfo = {
          nomDocumentCNIRecto: response.scanCNIRecto,
          nomDocumentCNIVerso: response.scanCNIVerso,
          nomDocumentSelphie: response.selfie,
          imageRecto: environment.baseUrlFile + response.scanCNIRecto,
          imageVerso: environment.baseUrlFile + response.scanCNIVerso,
          imageSelphie: environment.baseUrlFile + response.selfie
        }
        localStorage.setItem('idPersonneContact', contact.id)
      })
    }
  }

  getPMOInfos() {
    this.pmoService.getById(this.idPmo).subscribe((response) => {

        this.pmoRefere = response;
      },
      () => {
        this.isSpinning = false;
      })
  }

  pre() {
    if (this.currentStepPosition == 2 && this.personContact?.radioValue == 'oui') {
      this.currentStepPosition -= 2;
      return;
    }

    if (this.currentStepPosition == 6 && this.idPmo) {
      this.currentStepPosition -= 2;
      return;
    }
    this.currentStepPosition -= 1;
  }

  next() {

    this.showModel = false;

    if ((this.auth.getRole() == 'AGENT_INITIATEUR')) {

      if (this.currentStepPosition == 4) {
        if (!this.personContact) {
          this.stepname = "la personne contact";
          this.showModel = true;

          return;
        } else {
          this.showModel = false;
        }
        if (!this.entreprise) {
          this.stepname = "l'entreprise";
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }
        if (!this.dirigeants) {
          this.stepname = "dirigeants et assoscies";
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }


        if (!this.activite) {
          this.stepname = "l'activité de l'entreprise";
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }
        console.log("INFOselfie", this.selphieInfo)
        this.sendEntreprise()
        return;
      }

    } else {

      if (this.currentStepPosition == 6) {
        if (!this.personContact) {
          this.stepname = "la personne contact";
          this.showModel = true;

          return;
        } else {
          this.showModel = false;
        }
        if (localStorage.getItem("radioValue") == "non") {
          if (!this.agent) {
            this.stepname = "l'agent";
            this.showModel = true;

            return;
          } else {
            this.showModel = false;
          }
        }
        if (!this.entreprise) {
          this.stepname = "l'entreprise";
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }
        if (!this.dirigeants) {
          this.stepname = "dirigeants et assoscies";
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }


        if (!this.activite) {
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
        this.sendEntreprise()
        return;
      }
    }
    console.log("Personne contact ", this.personContact);
    console.log("Agent contact ", this.agent);
    console.log("Entreprise ", this.entreprise);
    console.log("Dirigeant ", this.dirigeants);
    console.log("Activite ", this.activite);


    if (this.idPmo && this.activite) {
      this.currentStepPosition += 2;
    } else {
      this.currentStepPosition += 1;
    }
  }

  done() {
  }


  sendEntreprise() {

    let beneficiaire: BeneficiairePME = new BeneficiairePME();

    // person contact
    let contactPerson = new Personne();
    contactPerson.id = this.personContact.id;
    contactPerson.nom = this.personContact.nom;
    contactPerson.prenom = this.personContact.prenom;
    contactPerson.numeroMobile = this.personContact.numeroMobile;
    contactPerson.adresse = this.personContact.adressePhysique;
    contactPerson.email = this.personContact.email;
    contactPerson.numeroCNI = this.personContact.numeroCNI;

    //type personne
    let typePers: TypePersonne = new TypePersonne();
    typePers.code = "CONTACT";
    contactPerson.typePersonnes = []
    contactPerson.typePersonnes.push(typePers);

    // personne agent

    // type personne
    let contactAgent = new Personne();
    let typePers2: TypePersonne = new TypePersonne();
    typePers2.code = "AGENT";

    if (this.agent) {
      console.log('Agent existe ' + this.agent)

      contactAgent.nom = this.agent.nom;
      contactAgent.prenom = this.agent.prenom;
      contactAgent.numeroMobile = this.agent.numeroMobile;
      contactAgent.adresse = this.agent.adressePhysique;
      contactAgent.email = this.agent.email;
      contactAgent.numeroCNI = this.agent.numeroCNI;
      contactAgent.nomDocumentCNI = this.agent.nomDocumentCNI;

      // contactAgent.typePersonnes = [];
      // contactAgent.typePersonnes.push(typePers2);

      beneficiaire.personnes = new Array<Personne>();
      beneficiaire.personnes.push(contactPerson);
      beneficiaire.personnes.push(contactAgent);
      // let access = new Acces();
      // access.login = this.connexionInfo.username;
      // access.password = this.connexionInfo.password;
      // contactPerson.acces = access;

    } else {
      contactPerson.typePersonnes.push(typePers2);
      beneficiaire.personnes = new Array<Personne>();
      beneficiaire.personnes.push(contactPerson);
      if (!(this.auth.getRole() == 'AGENT_INITIATEUR')) {
        let access = new Acces();
        access.login = this.connexionInfo.username;
        access.password = this.connexionInfo.password;
        contactPerson.acces = access;
      }
    }
    // if (!(this.auth.getRole() == 'AGENT_INITIATEUR')) {
    //   let access = new Acces();
    //   access.login = this.connexionInfo.username;
    //   access.password = this.connexionInfo.password;
    //   contactPerson.acces = access;
    // }

    // Remplissage dirigeants et associes ;
    let listdirigeants: any[] = this.dirigeants.dirigeants;

    // Remplissage des dirigeants
    for (let dirig of listdirigeants) {

      let personDirig = new Personne();
      personDirig.nom = dirig.nom;
      personDirig.prenom = dirig.prenom;
      personDirig.age = JSON.parse(dirig.age);
      personDirig.genre = JSON.parse(dirig.genre);
      personDirig.numeroCNI = dirig.numeroCNIPasseport;
      personDirig.niveauInstruction = JSON.parse(dirig.niveauInstruction);
      personDirig.nombrePersonneACharge = dirig.nombrePersonneACharge;
      personDirig.pourcentageDetenueCapital = dirig.pourcentageDetenueCapital;
      personDirig.titre = dirig.titre ? JSON.parse(dirig.titre) : null

      let typedirig = new TypePersonne()

      typedirig.code = "DIRIGEANT";
      typedirig.libelle = "Dirigeant";
      personDirig.typePersonnes = [];
      personDirig.typePersonnes?.push(typedirig);

      beneficiaire.personnes.push(personDirig);
    }

    // Remplissage des associes

    let listAssocies = this.dirigeants.associes;

    for (let assoc of listAssocies) {
      let personAssoc = new Personne();
      personAssoc.nom = assoc.nom;
      personAssoc.prenom = assoc.prenom;
      personAssoc.age = JSON.parse(assoc.age_associe);
      personAssoc.genre = JSON.parse(assoc.genre_associe);
      personAssoc.numeroCNI = assoc.numeroCNI;
      personAssoc.pourcentageDetenueCapital = assoc.pourcentageDetention;

      let titre = new Titre();
      titre.code = "ASSOCIE";
      titre.libelle = "Associe";
      personAssoc.titre = titre;

      let typeassoc = new TypePersonne()
      typeassoc.code = "ASSOCIE";
      typeassoc.libelle = "Associe";
      personAssoc.typePersonnes = [];
      personAssoc.typePersonnes?.push(typeassoc);

      beneficiaire.personnes.push(personAssoc);
    }


    let activiteToSend = new ActiviteBeneficiaire();
    activiteToSend.dateCreation = new Date(this.entreprise.dateCreation).toISOString();
    activiteToSend.nombreAnneeActivite = JSON.parse(this.activite.nombreAnneeActivite);

    if (this.activite.secteurActivite) {
      activiteToSend.secteurActivites?.push(JSON.parse(this.activite.secteurActivite));
    } else {
      console.log('autres secteurs')
    }

    // jeune permanent
    if (this.activite.employePermanent) {
      activiteToSend.nombreEmployePermanent = JSON.parse(this.activite.employePermanent)
    }

    activiteToSend.nombreEmployePermanentExactAdate = this.activite.nombreExactADate;
    activiteToSend.nombreFemmeEmployePermanent = this.activite.nombreFemmePermanent;
    activiteToSend.pourcentageFemmeEmployePermanent = this.activite.pourcentageFemmePermanent;
    activiteToSend.nombreJeuneEmployePermanent = this.activite.nombreJeunePermanent;
    activiteToSend.pourcentageJeuneEmployePermanent = this.activite.pourcentageJeunesPermanent;

    // employe no permanent
    if (this.activite.membreNonPermanent) {
      activiteToSend.nombreEmployeNonPermanent = JSON.parse(this.activite.membreNonPermanent);
    }
    activiteToSend.nombreEmployeNonPermanentExactAdate = this.activite.nombreExactADateNonPermanent;
    activiteToSend.nombreFemmeEmployeNonPermanent = this.activite.nombreFemmeNonPermanent;
    activiteToSend.pourcentageFemmeNonPermanent = this.activite.pourcentageFemmeNonPermanent;
    activiteToSend.nombreJeuneEmployeNonPermanent = this.activite.nombreJeuneNonPermanent;
    activiteToSend.pourcentageJeuneNonPermanent = this.activite.pourcentageJeunesNonPermanent;

    // revene par mois
    activiteToSend.revenuplusBasParMois = parseInt(this.activite.revenuMembreBasGroupement?.replace(/\s/g, ""));
    activiteToSend.revenuMoyenneParMois = parseInt(this.activite.revenuMoyenGroupement?.replace(/\s/g, ""));

    // // etat financier
    // revenu par annee
    activiteToSend.revenueTotalAnMoins1 = this.activite.revenuTotalGroupement2019;
    activiteToSend.revenueTotalAnMoins2 = parseInt(this.activite.revenuTotalGroupement2020?.replace(/\s/g, ""));

    // Document Activite les etats financiers
    activiteToSend.etatFinancierAnMois1 = this.activite.etatFinancier2019Nom;
    activiteToSend.etatFinancierAnMois2 = this.activite.etatFinancier2020Nom;

    // FIN ACTIVITE


    // // localisation

    beneficiaire.centreUrbain = this.activite.centreUrbain;

    // Informations de activites
    beneficiaire.activiteBeneficiaires?.push(activiteToSend);
    //

    // informations sur l'entreprise
    beneficiaire.denominationSociale = this.entreprise.denominationSociale;
    beneficiaire.numeroRCCM = this.entreprise.numeroRccm;
    beneficiaire.ninea = this.entreprise.ninea;
    beneficiaire.statusJuridique = this.entreprise.statutJuridique;
    beneficiaire.adresse = this.entreprise.adressePhysique;
    // document entreprise
    beneficiaire.documentConstitution = this.entreprise.documentConstitutionNom;
    beneficiaire.documentNinea = this.entreprise.documentNineaNom;
    beneficiaire.documentRCCM = this.entreprise.documentRCCMNom;
    beneficiaire.codeClient = this.personContact.codeClient;
    beneficiaire.zoneGeographique = JSON.parse(this.entreprise.departement) as ZoneGeographique
    console.log(beneficiaire.zoneGeographique?.idParent)
    beneficiaire.centreUrbain = this.entreprise.centreUrbain;
    beneficiaire.telephone = this.personContact.numeroMobile;
    if(this.beneficiairetp)
      beneficiaire.id = this.beneficiairetp.id

    if (this.idPmo) {
      beneficiaire.pmoRefere = this.pmoRefere;
      beneficiaire.pmoRattachement = this.pmoRefere;
    } else {
      beneficiaire.pmoRefere = this.personContact.pmoRefere ? JSON.parse(this.personContact.pmoRefere) : null;
    }

    console.log('sent object to', beneficiaire);

    // informations sur les personnes

    this.numeroTelephone = this.personContact.numeroMobile;

    // recto verso selphie CNI
    if (!this.idPmo) {
      beneficiaire.scanCNIRecto = this.selphieInfo.nomDocumentCNIRecto;
      beneficiaire.scanCNIVerso = this.selphieInfo.nomDocumentCNIVerso;
      beneficiaire.selfie = this.selphieInfo.nomDocumentSelphie;
    }

    console.log(beneficiaire);
    // recto Verson selphie CNI
    this.isSpinning = true;
    console.log(JSON.stringify(beneficiaire));
    this.Save(beneficiaire);
  }

  Save(beneficiaire : BeneficiairePME){
    localStorage.setItem("typebeneficiaire", <string>beneficiaire.typeBeneficiaire)
    this.beneficiaireService.save(beneficiaire).subscribe(
      response => {
        console.log(response);
        this.isSpinning = false;
        if (!this.idPmo) {
          this.showOtp = true;
        } else {
          this.showSuccessPmo = true;
        }
        this.renvoiCode = false;
        this.nombreSecond = 60;
        this.getTimer();
        this.benefApiResponse = response;

        if(this.auth.getRole() == "AGENT_INITIATEUR" && !beneficiaire.demandes){
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
        this.isSpinning = false;
        console.log(error);
      }
    )
  }

  sendEntrepriseInfoUpdate() {
    this.beneficiaireService.getById(this.beneficiaireId).subscribe(response => {
      let beneficiaire: BeneficiairePME = response;
      console.log("BENEFICIAIRE", response)

      // retrive the list of person
      let listPersons = response.personnes;
      let personContactFromBack: any;
      let agentFromBack: any;
      let personAgentSame: boolean = false;
      listPersons?.forEach(element => {
        if (element.typePersonnes) {

          // check type person

          let listOfType = element.typePersonnes.map(el => {
            return el.code
          });

          if (listOfType.indexOf("CONTACT") !== -1 && listOfType.indexOf("AGENT") !== -1) {
            // personcontact = agent
            personContactFromBack = element;
            personAgentSame = true;
          } else if (listOfType.length == 1 && listOfType.indexOf("CONTACT") !== -1) {
            personContactFromBack = element
          } else if (listOfType.length == 1 && listOfType.indexOf("AGENT") !== -1) {
            agentFromBack = element
          }
        }
      });
      let contact: any = {...personContactFromBack};

      let agent: any = {...agentFromBack};


      let activity = response.activiteBeneficiaires?.filter(p => p.id == this.activite ? this.activite : p) || []

      // person contact
      let contactPerson = contact;
      contactPerson.nom = this.personContact.nom;
      contactPerson.prenom = this.personContact.prenom;
      contactPerson.numeroMobile = this.personContact.numeroMobile;
      contactPerson.adresse = this.personContact.adressePhysique;
      contactPerson.email = this.personContact.email;
      contactPerson.numeroCNI = this.personContact.numeroCNI;
      contactPerson.nomDocumentCNI = this.personContact.documentCNINom;
      // type personne
      // let typePers: TypePersonne = new TypePersonne();
      // typePers.code = "CONTACT";
      // contactPerson.typePersonnes = []
      // contactPerson.typePersonnes.push(typePers);

      // personne agent

      // type personne
      let contactAgent = agent;
      // let typePers2: TypePersonne = new TypePersonne();
      // typePers2.code = "AGENT";

      if (this.agent && this.agent.nom) {

        contactAgent.nom = this.agent.nom;
        contactAgent.prenom = this.agent.prenom;
        contactAgent.numeroMobile = this.agent.numeroMobile;
        contactAgent.adresse = this.agent.adressePhysique;
        contactAgent.email = this.agent.email;
        contactAgent.numeroCNI = this.agent.numeroCNI;
        contactAgent.nomDocumentCNI = this.agent.nomDocumentCNI;

        contactAgent.typePersonnes = [];
        //contactAgent.typePersonnes.push(typePers2);

        beneficiaire.personnes = new Array<Personne>();
        beneficiaire.personnes.push(contactPerson);
        beneficiaire.personnes.push(contactAgent);

      } else {
        //contactPerson.typePersonnes.push(typePers2);
        beneficiaire.personnes = new Array<Personne>();
        beneficiaire.personnes.push(contactPerson);
      }


      console.log('after update person', contactPerson);
      console.log('update after update agent ', contactAgent);
      // Remplissage dirigeants et associes ;
      let listdirigeants: any[] = this.dirigeants.dirigeants;

      // Remplissage des dirigeants
      console.log('age dirigeant', listdirigeants)
      for (let dirig of listdirigeants) {
        if(dirig) {
          let personDirig = dirig;
          personDirig.nom = dirig.nom;
          personDirig.prenom = dirig.prenom;

          try {
            personDirig.age = dirig.age ? JSON.parse(dirig.age) : null;
            personDirig.genre = dirig.genre ? JSON.parse(dirig.genre) : null;
            personDirig.niveauInstruction = dirig.niveauInstruction ? JSON.parse(dirig.niveauInstruction) : null;
            personDirig.titre = dirig.titre ? JSON.parse(dirig.titre) : null
          } catch (e) {
            console.log('exception', e)
          }
          personDirig.numeroCNI = dirig.numeroCNIPasseport;
          personDirig.nombrePersonneACharge = dirig.nombrePersonneACharge;

          personDirig.pourcentageDetenueCapital = dirig.pourcentageDetenueCapital;

          let typedirig = new TypePersonne()

          typedirig.code = "DIRIGEANT"
          typedirig.libelle = "Dirigeant";
          personDirig.typePersonnes = [];
          personDirig.typePersonnes?.push(typedirig);
          console.log(personDirig)

          beneficiaire.personnes.push(personDirig);
        }
      }


      // Remplissage des associes

      let listAssocies: any[] = this.dirigeants.associes;
      for (let assoc of listAssocies) {
        let personAssoc = assoc;
        personAssoc.nom = assoc.nom;
        personAssoc.prenom = assoc.prenom;
        try {
          personAssoc.age = assoc.age_associe ? JSON.parse(assoc.age_associe) : null;
          personAssoc.genre = assoc.genre_associe ? JSON.parse(assoc.genre_associe) : null;
        } catch (e) {
          console.log('exception', e)
        }
        personAssoc.numeroCNI = assoc.numeroCNI;

        personAssoc.pourcentageDetenueCapital = assoc.pourcentageDetention;

        let titre = new Titre();
        titre.code = "ASSOCIE";
        titre.libelle = "Associe";
        personAssoc.titre = titre;

        let typeassoc = new TypePersonne()
        typeassoc.code = "ASSOCIE";
        typeassoc.libelle = "Associe";
        personAssoc.typePersonnes = [];
        personAssoc.typePersonnes?.push(typeassoc);

        beneficiaire.personnes.push(personAssoc);
      }


      let  activiteToSend;
      if(activity[0])
        activiteToSend = activity[0];
      else
        activiteToSend = new ActiviteBeneficiaire()
      response.activiteBeneficiaires = [];
      activiteToSend.dateCreation = new Date(this.entreprise.dateCreation).toISOString();
      activiteToSend.nombreAnneeActivite = JSON.parse(this.activite.nombreAnneeActivite);

      if (this.activite.secteurActivite) {
        activiteToSend.secteurActivites?.push(JSON.parse(this.activite.secteurActivite));
      }

      activiteToSend.zoneGeographique = JSON.parse(this.activite?.departement);

      // jeune permanent
      if (this.activite.employePermanent) {
        activiteToSend.nombreEmployePermanent = JSON.parse(this.activite.employePermanent)
      }

      activiteToSend.nombreEmployePermanentExactAdate = this.activite.nombreExactADate;
      activiteToSend.nombreFemmeEmployePermanent = this.activite.nombreFemmePermanent;
      activiteToSend.pourcentageFemmeEmployePermanent = this.activite.pourcentageFemmePermanent;
      activiteToSend.nombreJeuneEmployePermanent = this.activite.nombreJeunePermanent;
      activiteToSend.pourcentageJeuneEmployePermanent = this.activite.pourcentageJeunesPermanent;

      // employe no permanent
      if (this.activite.membreNonPermanent) {
        activiteToSend.nombreEmployeNonPermanent = JSON.parse(this.activite.membreNonPermanent);
      }
      activiteToSend.nombreEmployeNonPermanentExactAdate = this.activite.nombreExactADateNonPermanent;
      activiteToSend.nombreFemmeEmployeNonPermanent = this.activite.nombreFemmeNonPermanent;
      activiteToSend.pourcentageFemmeNonPermanent = this.activite.pourcentageFemmeNonPermanent;
      activiteToSend.nombreJeuneEmployeNonPermanent = this.activite.nombreJeuneNonPermanent;
      activiteToSend.pourcentageJeuneNonPermanent = this.activite.pourcentageJeunesNonPermanent;

      // revene par mois
      activiteToSend.revenuplusBasParMois = parseInt(this.activite.revenuMembreBasGroupement.replace(/\s/g, ""));
      activiteToSend.revenuMoyenneParMois = parseInt(this.activite.revenuMoyenGroupement.replace(/\s/g, ""));
      console.log("R-B" + activiteToSend.revenuplusBasParMois)
      console.log("R-M" + activiteToSend.revenuMoyenneParMois)

      // // etat financier

      // revenu par annee
      activiteToSend.revenueTotalAnMoins1 = this.activite.revenuTotalGroupement2019;
      activiteToSend.revenueTotalAnMoins2 = parseInt(this.activite.revenuTotalGroupement2020?.replace(/\s/g, ""));

      // Document Activite les etats financiers

      activiteToSend.etatFinancierAnMois1 = this.activite.etatFinancier2019Nom;
      activiteToSend.etatFinancierAnMois2 = this.activite.etatFinancier2020Nom;

      // FIN ACTIVITE


      beneficiaire.centreUrbain = this.activite.centreUrbain;

      // Informations de activites
      beneficiaire.activiteBeneficiaires?.push(activiteToSend);
      //

      // informations sur l'entreprise
      beneficiaire.denominationSociale = this.entreprise.denominationSociale;
      beneficiaire.numeroRCCM = this.entreprise.numeroRccm;
      beneficiaire.ninea = this.entreprise.ninea;
      beneficiaire.statusJuridique = this.entreprise.statutJuridique;
      beneficiaire.adresse = this.entreprise.adressePhysique;
      beneficiaire.pmoRefere = this.personContact.pmoRefere ? JSON.parse(this.personContact.pmoRefere) : null;
      // document entreprise
      beneficiaire.documentConstitution = this.entreprise.documentConstitutionNom;
      beneficiaire.documentNinea = this.entreprise.documentNineaNom;
      beneficiaire.documentRCCM = this.entreprise.documentRCCMNom;

      beneficiaire.scanCNIRecto = this.selphieInfo.nomDocumentCNIRecto;
      beneficiaire.scanCNIVerso = this.selphieInfo.nomDocumentCNIVerso;
      beneficiaire.selfie = this.selphieInfo.nomDocumentSelphie;
      beneficiaire.codeClient = this.personContact.codeClient;
      beneficiaire.zoneGeographique = JSON.parse(this.entreprise.departement) as ZoneGeographique
      console.log(this.entreprise.departement)

      // informations sur les personnes


      this.numeroTelephone = this.personContact.numeroMobile;
      beneficiaire.telephone = this.personContact.numeroMobile;

      this.isSpinning = true;
      if(this.auth.getRole() !== 'AGENT_INITIATEUR'){
        this.beneficiaireService.update(beneficiaire).subscribe(
          () => {
            this.isSpinning = false;
            this.router.navigateByUrl("/beneficiaire")
            this.notificationService.success('Succés', 'Information bénéficiaire mis à jour avec succés ')
          }
          ,
          error => {
            console.log(error);
          }
        )
      }else {
        if(!beneficiaire.demandes?.[0]){
          beneficiaire.id = this.beneficiaireId
          console.log("save : "+ JSON.stringify(beneficiaire))
          this.beneficiaireService.save(beneficiaire).subscribe(
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
          console.log("update : "+JSON.stringify(beneficiaire))
          this.beneficiaireService.update(beneficiaire).subscribe(
            response => {
              console.log('update', response)
              this.isSpinning = false;
              this.modalService.closeAll()
              this.notificationService.success('Succés' , 'Information bénéficiaire mis à jour avec succés ')
            }
          )
        }
      }
    })
  }

  nextWithoutAgent() {

    if (this.currentStepPosition == 6) {
      this.sendEntreprise()

      return
    }
    if ((this.auth.getRole() == 'AGENT_INITIATEUR')) {
      this.currentStepPosition += 1
    } else {
      this.currentStepPosition += 2;
    }
  }

  onIndexChange(index: number): void {
    console.log(index);
    this.currentStepPosition = index;
    if (this.idPmo && index == 5) {
      this.currentStepPosition = index + 1;
    } else {
      this.currentStepPosition = index;
    }

  }
  private intervalId: any;
  premiere() {
    this.renvoiCode = true;
    // Assign the return value of setInterval to the intervalId variable
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
       // Pass the intervalId to clearTimeout to stop the interval
       clearInterval(this.intervalId);
    }
   }
}


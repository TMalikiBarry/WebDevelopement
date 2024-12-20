import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {ApiResponseBenef} from 'src/app/model/api-response-benef';
import {OtpService} from 'src/app/services/security/otp/otp.service';
import {FormMicroEntrepreneursComponent} from "../form-micro-entrepreneurs.component";
import {ActivatedRoute, Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UniqueLoginValidator} from 'src/app/core/customValidators/asyncValidators/UniqueLoginValidator';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit, OnChanges {

  currentStepPosition: number = this.formMicroEntrepreneur.currentStepPosition;

  @Input() numeroTelephone : any ;

  @Input() benefApiResponse = new ApiResponseBenef();

  @Input() stepname : any;
  @Input() showModel: any;

  @Input() showCodeOtpForm: any;
  @Input() showSuccessPmo: any;
  showSuccess = false ;
  submitted: boolean = false;
  isVisible = false;
  isVisiblePMO = false;
  isVisiblePhone = false;
  passwordVisible = false ;
  confirmPasswordVisible = false ;
  isSpinningRegister: boolean =false;
  idPmo: any;

  @Input()   nombreSecond: any;
  @Input() renvoiCode: any;

  @Input() connexionInfo : any ;
  @Output() connexionInfoChange = new EventEmitter<any>();

  connexionForm = this.fb.group({
    username :  [ '' , [ Validators.required ,
      Validators.pattern('(^(?![0-9]*$)[a-zA-Z0-9\\._-]{4,}$)|(^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$)|(((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7})')
    , ] , this.loginValidator.checkLoginExist()],
    password : [ '' ,  [Validators.required ,Validators.pattern('(.{8,})') ] ],
    passwordConfirmation : [ '' ,  [Validators.required ,Validators.pattern('(.{8,})') ]  ],
  });


  otpForm = this.fb.group({
    code : ['' , Validators.compose([Validators.minLength(6) ,Validators.required, Validators.maxLength(6)])]
  });
  cguChecked: boolean = false;

  demandeForm = this.fb.group({
    telephone : ['', Validators.required]
  });

  constructor(private fb: UntypedFormBuilder,
              private formMicroEntrepreneur: FormMicroEntrepreneursComponent,
              private otpService :OtpService,
              private notification : NzNotificationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modal: NzModalService,
              private loginValidator : UniqueLoginValidator) {}

  ngOnInit( ):void {
    this.showModel = false;
    this.idPmo = this.activatedRoute.snapshot.params.pmo;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.idPmo && this.showSuccessPmo){
      this.router.navigate(['/expression-besoin/expression-me/'+this.idPmo+'/'+this.benefApiResponse?.reponse?.idBeneficiaire]);
    }
  }

  pre() {
    this.formMicroEntrepreneur.pre()
  }

  next() {
    this.submitted = true
    if(!this.idPmo){
      this.isVisible = true;
    }
    else{
      this.isVisiblePMO = true;
    }
  }

  done() {
    this.formMicroEntrepreneur.done()
  }


  errorOtp(): void {
    this.modal.error({
      nzTitle: 'Erreur Code de Validation',
      nzContent: 'Veuillez saisir le bon Code de validation'
    });
  }

  changeTelephone(){
    this.isVisiblePhone = true;
  }

  handleOkModal(): void {
    // //console.log('Button ok clicked!');
    this.isVisiblePhone = false;
    let newTelephone = this.demandeForm?.controls?.telephone?.value;
    this.isSpinningRegister = true;
    this.otpService.sendCodeNewNumero(newTelephone , this.benefApiResponse.reponse?.idPersonne ).subscribe(
    // this.otpService.sendCodeNewNumero(newTelephone , 8002 ).subscribe(
      response => {
        this.isSpinningRegister = false;
        //console.log(response );
        this.notification.success('Notification','La code a été bien renvoyé ')
        this.numeroTelephone = newTelephone;
      },
      error => {
        this.isSpinningRegister = false;
        console.log(error);
        // this.demandeForm.reset();
        if(error?.error?.errorMessage){
          this.notification.error('Attention', error?.error?.errorMessage);
        }
        else{
          this.notification.error('Attention','Une erreur est survenue, renvoyer le code ')
        }
      }
    )
  }

  handleCancelModal(): void {
    //console.log('Button cancel clicked!');
    this.isVisiblePhone = false;
    this.demandeForm.reset();
  }

  validerCode(){
    this.isSpinningRegister = true;
    if(this.otpForm.valid){
      this.otpService.sendCode(this.otpForm.controls['code'].value , this.benefApiResponse.reponse?.idPersonne).subscribe(
        response => {

          //console.log(response);
          this.isSpinningRegister = false;
          this.showSuccess =true;
          this.showCodeOtpForm=false ;
        },
        error =>{
          this.isSpinningRegister = false;
          this.errorOtp();

        }
      )
    }

  }

  renvoyerCode(){
    //console.log('regenerate code');
    this.otpService.regenerateCode(this.numeroTelephone , this.benefApiResponse.reponse?.idPersonne ).subscribe(
      response => {
        //console.log(response );
        this.notification.success('Notification','La code a été bien renvoyé ')

      },
      error => {
        this.notification.error('Attention','Une erreur est survenue, renvoyer le code ')
      }
    )
  }

  handleStepOk(): void {
    if(this.stepname === "la personne contact"){
      this.formMicroEntrepreneur.currentStepPosition =0;

    }else if(this.stepname === "l'agent"){
      this.formMicroEntrepreneur.currentStepPosition =1;

    }else if(this.stepname === "l'activité de l'entreprise"){
      this.formMicroEntrepreneur.currentStepPosition =2;

    }else if(this.stepname === "la pièce d'identite recto et verso"){
      this.formMicroEntrepreneur.currentStepPosition =3;

    }
    this.showModel = false;
  }

  handleStepCancel(): void {
    this.showModel = false;
  }
  handleCancel(): void {
    this.isVisible = false;
    this.isVisiblePMO = false;
  }

  handleOk() {
    //console.log(this.connexionForm)
    if(this.connexionForm.valid){
      if(this.connexionForm.controls.password.value == this.connexionForm.controls.passwordConfirmation.value){
        //console.log(this.connexionForm.getRawValue());
        this.connexionInfoChange.emit(this.connexionForm.getRawValue());
        this.showCodeOtpForm= true ;
        this.isVisible =  false;
        this.formMicroEntrepreneur.next();
      }
      else{
        this.notification.error('Attention','Les mots de passe ne sont pas identiques')
      }
      this.isVisible = false;
    }
  }

  handleOkPMO() {
    //console.log(this.connexionForm)
    if(this.connexionForm.valid){
      if(this.connexionForm.controls.password.value == this.connexionForm.controls.passwordConfirmation.value){
        //console.log(this.connexionForm.getRawValue());
        this.connexionInfoChange.emit(this.connexionForm.getRawValue());
        this.isVisiblePMO =  false;
        this.formMicroEntrepreneur.next();
      }
      else{
        this.notification.error('Attention','Les mots de passe ne sont pas identiques')
      }
      this.isVisiblePMO = false;
    }
  }

  openCgu(): void {
    this.modal.info({
      nzTitle: "Condition générale d'utilisation",
      nzContent: '<div xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">' +
        '<hr></hr>' +
        '<p>Les présentes Conditions Générales d’Utilisation du site https://dev-www.gutouch.net sont conclues entre :\n' +
        '\n' +
        'INTOUCH SA, société anonyme de droit sénégalais au capital de 10.000.000 de F. CFA, immatriculée au Registre du Commerce et du Crédit Mobilier sous le numéro SN DKR 2014 B 407 et titulaire du NINEA numéro 004962579 dont le siège social est situé à l’immeuble Sophie Ndiaye Justin, Mermoz VDN Lot 14 - Dakar, dûment représentée par Monsieur Omar CISSE, agissant en sa qualité de d’Administrateur Général.\n' +
        '\n' +
        'Ci-après « InTouch »\n' +
        '\n' +
        'ET\n' +
        '\n' +
        'Toute personne physique ou morale souhaitant accéder au site et à ses services.\n' +
        '\n' +
        'Ci-après dénommé « l’Utilisateur »</p>' +
        '<hr></hr>' +
        '<h5>INFORMATIONS DU SITE</h5>' +
        '<p>EDITEUR</br> INTOUCH SA' +
        ' Immeuble Sophie Ndiaye JUSTIN, VDN-Mermoz lot n14</br>' +
        ' RCCM : SN DKR 2014 B 407 </br>' +
        ' NINEA :004962579 T : 0022 33 860 64 44 </br>' +
        ' Administrateur Général : Omar CISSE</br>' +
        ' HEBERGEMENT Worldline FRANCE (ATOS)</br>' +
        ' Siège : Paris (Bezons) River Ouest 80 Quai Voltaire 95870 Bezons </br>' +
        ' T: +33 (0)1 73 26 00 00</p>' +
        '<h5>A PROPOS DU SITE</h5>' +
        '<p>TouchFinance est une plateforme digitale conçue pour favoriser l\'inclusion financière. Elle est destinée à tous les micro-entrepreneurs, et micros, petites et moyennes entreprises des 14 régions du Sénégal dans le but de faciliter leur accès au financement.</p>'+
        '<p>Pour apporter de la valeur à nos utilisateurs, il nous tient à cœur de leur donner la possibilité de profiter en toute fiabilité et sécurité de l’écosystème que nous créons.</p>'+
        '<p>Les présents Conditions Générales d’Utilisation (CGU) ont pour objet l’encadrement juridique de l’utilisation du site Web TouchFinance et régissent le recours et l’utilisation des produits et services proposés via la plateforme Web. Le site internet « https://dev-www.gutouch.net» vous permet de : :</br>' +
        ' - Vous inscrire gratuitement et présenter de votre activité</br>' +
        ' - Soumettre une demande de financement afin qu’on vous oriente vers nos partenaires de mise en œuvre</br>' +
        ' - Bénéficier d’un financement auprès d’un partenaire de mise en œuvre sous réserve que votre demande soit approuvée:</br>' +
        '</p>'+
        '<p>Les informations du site sont les suivantes :</br>' +
        ' - Adresse URL du site est : <a routerLink="https://dev-www.gutouch.net">https://dev-www.gutouch.net</a></br>' +
        ' - Email : contact@intouchgroup.net</br>' +
        ' - Numéro de téléphone est : +221 76 624 04 60 '+
        '</p>' +
        '<p>Les Conditions Générales d’utilisation doivent être acceptées par tous les Utilisateurs et l’accès au site par ces derniers vaut acceptation de ces conditions.</p>'+
        '<h6>ARTICLE 1 – DEFINITIONS</h6>' +
        '<p><strong>Conditions Générales d’Utilisation</strong> : désignent les présentes Conditions Générales d’Utilisation.<br></br> - <strong>Candidat</strong> : Désigne toute personne utilisant les services de TouchFinance pour s’inscrire en vue d’obtenir un financement de ses activités via la plateforme https://dev-www.gutouch.net/</p>' +
        '<p><strong>Données personnelles</strong> : désigne toute information se rapportant à une personne physique ou morale identifiée ou identifiable. Une personne peut être identifiée directement (exemple : nom, prénom) ou indirectement (exemple : par un identifiant (n° client), un numéro (de téléphone), une donnée biométrique, plusieurs éléments spécifiques propres à son identité physique, physiologique, génétique, psychique, économique, culturelle ou sociale, mais aussi la voix ou l’image).</p>' +
        '<p>L’identification d’une personne physique peut être réalisée à partir d’une seule donnée (exemple : numéro de sécurité sociale, ADN) ou à partir du croisement d’un ensemble de données (exemple : une femme vivant à telle adresse, née tel jour, abonnée à tel magazine et militant dans telle association)</p>' +
        '<p><strong>RGPD</strong> : désigne le Règlement (UE) 2016/679 Du Parlement Européen du Conseil du 27 Avril 2016 relatif à la protection des personnes physiques à l\'égard du traitement des données à caractère personnel et à la libre circulation de ces données.</p>' +
        '<p><strong>Traitement des données personnelles</strong> : désigne une opération, ou ensemble d\'opérations, portant sur des données personnelles, quel que soit le procédé utilisé (collecte, enregistrement, organisation, conservation, adaptation, modification, extraction, consultation, utilisation, communication par transmission diffusion ou toute autre forme de mise à disposition, rapprochement).</p>' +
        '<h6>ARTICLE 2 - DUREE DES CONDITIONS GENERALES D’UTILISATION</h6>' +
        '<p>Les présentes Conditions Générales d’Utilisation sont conclues pour une durée indéterminée et produisent des effets à l’égard des Utilisateurs à compter de leur adhésion en vue de l’utilisation des services proposés. Le site https://dev-www.gutouch.net/ se réserve le droit de modifier unilatéralement les clauses des présentes Conditions Générales d’Utilisation à tout moment et sans justification. Ces modifications s’appliqueront ipso facto à leur date de publication sur le site.</p>' +
        '<h6>ARTICLE 3 – ACCES AU SITE</h6>' +
        '<p>Tout Utilisateur ayant accès à internet peut accéder gratuitement au site web peu importe le lieu où il se situe. Les frais supportés par les Utilisateurs (connexion internet, matériel informatique par exemple) ne sont pas à la charge du Gestionnaire de site.</p>' +
        '<p>Le site et ses différents services peuvent être interrompus ou suspendus par Intouch, notamment à l’occasion d’une mise à jour ou d’une maintenance sans obligation de préavis ou de justification.</p>' +
        '<h6>ARTICLE 4 – OBLIGATIONS DES UTILISATEURS</h6>' +
        '<p>L’Utilisateur devra : </br>' +
        '- Lors de son inscription sur le site TouchFinance , ' +
        'fournir des informations exactes et toutes les pièces utiles à son identification conformément à la règlementation en vigueur. En tout état de cause l’Utilisateur devra créer : </br>' +
        '° un nom d’utilisateur et un mot de passe ; </br>' +
        '° fournir une copie recto/verso d’une pièce d’identité en cours de validité (Passeport, CNI), </br>' +
        '° une photo et un autoportrait photographique (selfie) ;</br>' +
        '° son nom, prénom, adresse, genre ; </br>' +
        '° son téléphone,adresse email </br>' +
        '° etc. </br>' +
        '- Procéder à une seule inscription et ne pas créer plus d’un compte. Dans le cas ou son compte aura subi une intrusion par un tiers et dans le cas où un tiers a connaissance et/ou accès aux contenus et aux informations de connexion de son compte, l’Utilisateur pourra, sous réserve d’en en avoir préalablement informé <strong>InTouch</strong> et d’avoir procédé au blocage de l’ancien, ouvrir un nouveau compte. </br>' +
        '- Eviter toute utilisation de la plateforme à des fins illicites </br>' +
        '- Respecter les normes nationales et internationales sur la protection des données à caractère personnel.</p>' +
        '<h6>ARTICLE 5 - RESPONSABILITES</h6>' +
        '<p>La responsabilité de <strong>InTouch</strong> ne peut être engagée en cas d’interruption de fonctionnement empêchant l’accès au site ou à une de ses fonctionnalités due à une maintenance ou à un souci de connexion et plus généralement due par tout fait qui ne saurait être imputable InTouch. Le matériel de connexion au site utilisé est sous l’entière responsabilité de l’Utilisateur qui doit prendre toutes les mesures appropriées pour protéger le matériel et les données notamment d’attaques virales par internet. L’Utilisateur est par ailleurs le seul responsable des sites et données qu\'il consulte.</p>' +
        '<p><strong>InTouch</strong> ne pourra être tenu responsable en cas de poursuites judiciaires à l\'encontre de l\'Utilisateur : ' +
        '- du fait de l\'usage du site ou de tout service accessible via Internet ; ' +
        '- du fait du non-respect par l\'Utilisateur des présentes CGU.</p>' +
        '<p><strong>InTouch</strong> n\'est pas responsable des dommages causés à l\'Utilisateur, à des tiers et/ou à l\'équipement de l\'Utilisateur du fait de sa connexion ou de son utilisation du site et l\'Utilisateur renonce à toute action contre InTouch de ce fait. Plus précisément <strong>InTouch</strong> décline toute responsabilité dans les cas suivants :</p>'+
        '<p>Dans la limite des lois applicables, <strong>InTouch</strong> n’est pas responsable du comportement d’un Utilisateur , de la mauvaise exécution ou de l’inexécution des obligations Utilisateurs. L’Utilisateur s’engage à garder confidentiel ces informations d\'accès à l\'application à l’égard des tiers et s’engage également à mettre à jour, sans délai, les informations sur le site qui ne sont plus pertinentes en raison de modifications de ses données (en particulier celles fournies au moment de son inscription).</p>' +
        '<p>Si <strong>InTouch</strong> venait à faire l\'objet d\'une procédure amiable ou judiciaire en raison de l\'utilisation du site par l\'Utilisateur, il pourra se retourner contre lui pour obtenir indemnisation de tous les préjudices, sommes, condamnations et frais qui pourraient découler de cette procédure.</p>' +
        '<p>Des liens hypertextes peuvent être présents sur le site. L’utilisateur est informé qu’en cliquant sur ces liens, il sortira du site. Ces liens hypertextes mis en place dans le cadre du présent site TouchFinance en direction d’autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité d’<strong>InTouch</strong>.</p>' +
        '<h6>ARTICLE 6 – PROPRIETE INTELLECTUELLE</h6>' +
        '<p>Tous les documents techniques, produits, photographies, textes, logos, dessins, vidéos, copyright etc., sont soumis à des droits d\'auteur et sont protégés par les lois en vigueur sur la propriété intellectuelle. Lorsqu\'ils\n' +
        '\n' +
        'sont remis aux Clients ou Utilisateurs, ils demeurent la propriété exclusive du seul titulaire des droits de propriété intellectuelle sur ces documents, qui doivent lui être rendus à sa demande</p>' +
        '<p>L’Utilisateur reconnaît que l’utilisation qu’il fait du site et l’adhésion aux présentes CGU ne lui concèdent aucun droit ni aucun titre de propriété quel qu’il soit sur la plateforme et ne tentera aucune action qui mettrait en péril les droits d’<strong>InTouch</strong>.</p>' +
        '<p>Aucune disposition des CGU ne confère ou ne sera considérée comme conférant à l’Utilisateur le droit ou la licence pour l’utilisation de la propriété intellectuelle du site. A cet effet, l’Utilisateur n’est pas autorisé à utiliser les marques et logos de TouchFinance ou des groupes de sociétés auxquels celle-ci appartient sans l’accord préalable exprès de celle-ci.</p>' +
        '<h6>ARTICLE 7 – PROTECTION DES DONNEES PERSONNELLES</h6>' +
        '<p><strong>InTouch</strong> en sa qualité » de Responsable de traitement dispose d’autorisations de la Commission de Protection des Données Personnelles ayant fait l’objet des' +
        ' <strong>délibérations n°2017-00259/ CDP du 10 Février 2017 et n°2019-00418/ CDP du 02 Octobre 2019</strong>' +
        ' portant autorisation de traitement de données à caractère personnel afin de procéder en toute sécurité à la collecte et au traitement des données personnelles. La protection des données personnelles de vos données est ainsi garantie par <strong>InTouch</strong>' +
        'et leur utilisation strictement encadrée par la <strong>loi n° 2008-12 sur la protection des données à caractère personnel</strong>' +
        ' Les données à caractère personnel qui sont collectées sur ce site sont les suivantes : </br> </p>' +
        '<strong>7.1. ouverture de compte :</strong> </br>' +
        '<p>. <strong>connexion</strong> :lors de la connexion de l\'Utilisateur au site web, celui-ci enregistre, notamment, ses données de connexion (nom d’utilisateur et un mot de passe),</br>' +
        ' · <strong>création de compte</strong>: l\'\'utilisation des prestations proposées sur le site web permet de renseigner les informations suivantes: numéro de téléphone(identifiant), mot de passe, adresse email, adresse, prénom, nom, numéro de pièce d’identification, lieu de résidence et genre. ;</br>' +
        ' · <strong>cookies</strong> : le site n’utilise que des cookies indispensables à son fonctionnement, sans ces cookies le site ne fonctionnera pas et donc les services que vous avez demandés ne pourront être fournis.</p> </br>' +
        '<strong>7.2 Utilisation des données personnelles</strong>' +
        '<p>Les données personnelles collectées auprès des Utilisateurs ont pour objectif la mise à disposition des services du site web, leurs améliorations et le maintien d\'un environnement sécurisé́. Ces données sont collectées aux fins suivantes : </br>' +
        ' · Accès et utilisation du site web par l’Utilisateur ; </br>' +
        ' · Gestion du fonctionnement et optimisation du site web ; ' +
        ' </br>· Vérification, identification et authentification des données transmises par l’Utilisateur ; </br>' +
        ' · Mise en œuvre d\'une assistance Utilisateurs ; </br>' +
        ' · Constitution d’un dossier de demande de financement et exposition aux partenaires financiers des données nécessaires pour l’étude de dossier.</p>' +
        '<strong>7.3 Partage des données personnelles avec des tiers</strong> </br>' +
        'Les données personnelles peuvent être partagées avec des sociétés tierces, dans les cas suivants : </br>' +
        '· lorsque l\'Utilisateur publie, dans les zones de commentaires libres du site web, des informations accessibles au public ; </br>' +
        ' · lorsque l\'Utilisateur autorise le site web d\'un tiers à accéder à ses données ; </br>' +
        ' · lorsque le site web recourt aux services de prestataires pour fournir l\'assistance utilisateurs, la publicité et les services de paiement.' +
        ' Ces prestataires disposent d\'un accès limité aux données de l\'Utilisateur, dans le cadre de l\'exécution de ces prestations, et ont une obligation' +
        ' contractuelle de les utiliser en conformité́ avec les dispositions de la règlementation applicable en matière protection des données à caractère personnel ; </br>' +
        ' · si la loi l\'exige, le site web peut effectuer la transmission de données pour donner suite aux réclamations présentées contre le site web et ' +
        'se conformer aux procédures administratives et judiciaires ; · si le site web est impliqué́ dans une opération de fusion, acquisition, cession d\'actifs' +
        ' ou procédure de redressement judiciaire, elle pourra être amenée à céder ou partager tout ou partie de ses actifs, y compris les données à caractère personnel. ' +
        'Dans ce cas, les Utilisateurs seraient informés, avant que les données à caractère personnel ne soient transférées à une tierce partie.' +
        '<p><strong>InTouch</strong> s’engage à procéder au partage des données dans le strict respect des droit des Utilisateurs et en conformité avec la règlementation ' +
        'nationale et des normes édictées par le RGPD. Par ailleurs InTouch s’engage à mettre tout en œuvre afin d’obtenir toutes nouvelles autorisations nécessaires au traitement di ce traitement était emmené à évoluer.</p>' +
        '<strong>7.4 Sécurité, Vie privée et Confidentialité</strong>' +
        '<p><strong>InTouch</strong> en sa qualité de Responsable de traitement met en oeuvre les mesures organisationnelles, techniques, logicielles et physiques en matière' +
        ' de sécurité́ du numérique appropriées pour protéger les données à caractère personnel contre la destruction accidentelle ou illicite, la perte accidentelle, l\'altération,' +
        'la diffusion ou l\'accès non autorisé, notamment lorsque le traitement comporte des transmissions de données dans un réseau, ainsi que contre toute autre forme' +
        ' de traitement illicite.</br>' +
        ' InTouch ne vend pas vos informations personnelles à des tiers à des fins de marketing direct. Vous pouvez consulter et modifier les informations ' +
        'que vous nous fournissez à tout moment, ceci via un mail envoyé à </br>' +
        '<strong>dataperso@intouchgroup.net</strong> </br>' +
        'Nous pouvons en outre, divulguer des informations personnelles afin de répondre à des exigences légales, d’appliquer nos règles, de répondre à une réclamation selon laquelle une annonce ou autre contenu enfreint les droits de tiers ou de garantir les droits, la propriété ou la sécurité de tiers.' +
        ' </p>' +
        '<strong>7.5 Mise en oeuvre des droits des Utilisateurs</strong>' +
        '<p>L’Utilisateur déclare consentir, d’une façon claire, incontestable, libre et avertie aux présentes CGU et autoriser <strong>InTouch</strong> à collecter et traiter conformément aux dispositions de la <strong>loi n° 2008-12 sur la protection des données à caractère personnel</strong> les informations personnelles recueillies des Utilisateurs.</p>' +
        '<p>En application de la loi susvisée et des normes RGPD, les Utilisateurs disposent des droits suivants : </br>' +
        '<strong>· le droit d’accès</strong> : Tout Utilisateur a le droit d\'obtenir, à des intervalles raisonnables, gratuitement et sans délais, la confirmation que les données le concernant font l\'objet ou non d\'un traitement. Elle peut également demander les caractéristiques du traitement effectué telles ses finalités, les catégories et l’origine des données utilisées et les destinataires auxquels elles sont transmises. </br>' +
        '<strong>· le droit de rectification</strong> : Tout Utilisateur peut exiger l\'actualisation, la rectification, l\'effacement ou le verrouillage des données personnelles la concernant lorsque ces dernières semblent être inexactes, incomplètes, équivoques ou périmées. <strong>InTouch</strong> est tenu de procéder aux rectifications demandées, gratuitement et dans un délai maximum de quinze (15) jours, auprès de ses services et des tiers à qui il a communiqué les données à rectifier. </br>' +
        '<strong>· le droit de suppression des données</strong> : Tout Utilisateur peut demander la suppression de leurs données à caractère personnel, conformément aux lois applicables en matière de protection des données. </br>' +
        '<strong>· le droit d’opposition</strong> : Toute personne a la possibilité de s\'opposer à tout moment, pour des motifs légitimes et sans frais, au traitement de ses données personnelles sauf si le traitement répond à une obligation légale. </br>' +
        '</p>' +
        '<p>Le site web se réserve le droit d\'apporter toute modification à la présente clause relative à la protection des données à caractère personnel à tout moment. Si une modification est apportée à la présente clause de protection des données à caractère personnel, le site web s\'engage à publier la nouvelle version sur son site. Si l\'Utilisateur n\'est pas d\'accord avec les termes de la nouvelle rédaction de la clause de protection des données à caractère personnel, il a la possibilité de supprimer son compte.</p>' +
        '<p><strong>InTouch</strong> s’engage à ne pas divulguer à des tiers les informations que vous lui communiquez. Celles-ci restent confidentielles. Pour toutes questions relatives à la gestion de vos données personnelles, merci de nous contacter par email : <strong>dataperso@intouchgroup.net</strong></p>' +
        '<p><strong>InTouch</strong> utilisera les données des Utilisateurs de manière proportionnelle pour les fins énoncées dans la déclaration susvisée et tout en respectant les exigences légales en vigueur en matière d’authentification et d’identification.</p>' +
        '<p><strong>7.6 Le Consentement</strong> : les opérations de traitement des données personnelles ne peuvent avoir lieu que l’Utilisateur a exprimé son consentement d’une façon claire, incontestable, libre et avertie. Le consentement des Utilisateurs n’est pas exigé dans les cas suivants : </br> ' +
        '· Le traitement est nécessaire au respect d’une obligation légale à laquelle lui-même ou <strong>InTouch</strong> sont soumis;</br>' +
        ' · Le traitement entre dans le cadre de l’exécution d’un contrat auquel l’Utilisateur ou la personne concernée est partie;</br>' +
        ' · Le traitement permet la réalisation d’un intérêt légitime poursuivi par le responsable du traitement, à condition de ne pas méconnaitre l’intérêt et les droits des personnes concernées;</p>' +
        '<p> <strong>ARTICLE 8 - COOKIES</strong> </br>' +
        'Cette rubrique vous permet d’en savoir plus sur l’origine et l’usage des informations de navigation traitées à l’occasion de votre consultation de notre site et sur vos droits. Seul l’émetteur d’un cookie est susceptible de lire ou de modifier des informations qui y sont contenues. Lorsque vous vous connectez à notre site, nous pouvons être amenés, sous réserve de vos choix, à installer divers cookies dans votre terminal nous permettant de reconnaître le navigateur de votre terminal pendant la durée de validité du cookie concerné. Les cookies que nous émettons sont utilisés aux fins décrites ci-dessous, sous réserve de vos choix, qui résultent des paramètres de votre logiciel de navigation utilisé lors de votre visite de notre site ou des autres moyens mis à votre disposition.' +
        '\n' +
        'Les cookies vous facilitent votre expérience en ligne en enregistrant certaines informations de navigation. Ils vous permettent:</br>' +
        '· de rester connecté </br>' +
        '· de mémoriser vos préférences sur le site </br>' +
        '· d’avoir des contenus adaptés et pertinents en fonction de votre habitude de navigation </br>' +
        '</p>' +
        '<p>' +
        '<strong>ARTICLE 9 -UTILISATION DU COMPTE ET MODE DE PAIEMENT</strong>' +
        '<strong>Compte</strong> </br>' +
        'L\'utilisation du compte est accessible à tout Utilisateur. Pour ce faire, l\'Utilisateur peut cliquer sur le bouton "S’inscrire" afin de procéder à la création qui se fait en trois (05) étapes:' +
        '</p>' +
        '<p><strong>ETAPE 1</strong>: </br>Renseigner « <strong>identification personne contact</strong> » prénom, nom, genre, email, adresse, numéro CNI ou passeport… Ensuite cliquer sur le bouton \'suivant\' pour passer à la 2e étape.</p>' +
        '<p><strong>ETAPE 2</strong> </br> Renseigner « <strong>identification agent</strong> » prénom, nom, genre, email, adresse, numéro CNI ou passeport… Ensuite cliquer sur le bouton \'suivant\' pour passer à la 3e étape.</p>' +
        '<p><strong>ETAPE 3</strong> </br> Renseigner « <strong>description activité</strong> » occupation, localisation des activités, chiffre d’affaires des deux dernières années, nombre d’années d’activité, nombre d’emploi, secteur d’activité Ensuite cliquer sur le bouton \'suivant\' pour passer à la 4e étape.</p>' +
        '<p><strong>ETAPE 4</strong> </br> <strong>Charger les fichiers</strong> : Recto de la pièce d\'identité, Verso de la pièce d\'identité et un Selfie avec sa pièce d\'identité.</p>' +
        '<p><strong>ETAPE 5</strong> </br> Définir ses codes d’accès en précisant son identifiant, mot de passe et ensuite cocher la case "J’ai lu et j’accepte les conditions générales d’utilisations (Voir CGU) notamment la mention relative à la protection des données personnelles » et à la fin cliquer sur \'Valider\'.</p>' +
        '<p>S\'il y a une erreur ou un quelconque problème le site affichera un message d\'erreur correspondant, autrement le compte sera créé et le message affiché sera: "Votre compte a été créé. Consultez votre mail pour l\'activer". </br> A ce niveau, un sms avec un code OTP de validation du compte est envoyé au numéro de téléphone fourni par l’utilisateur, lequel doit saisir ce code pour demander son approbation par l’équipe technique du site qui procèdera aux dernières vérifications avant de valider le compte et permettre à l’utilisateur de pouvoir commencer à l\'utiliser</p>' +
        '<p><strong>ARTICLE 10- FORCE MAJEURE</strong> </br> ' +
        'La responsabilité des parties aux présentes CGU ne saurait être engagée lorsque les faits qui l’ont engendrée sont consécutifs à un cas de force majeure, c’est-à-dire à tout événement imprévisible, irrésistible, et insurmontable ou de faits indépendants de la volonté des parties rendant impossible l’exécution des obligations. La survenance d’un cas de force majeure ou cas fortuit suspendra les obligations du présent contrat dans les limites du degré d’affectation de la partie empêchée par les effets de la Force Majeure. Lorsque l’une des Parties se trouve dans l’impossibilité d’exécuter, ou s’exécute avec un certain retard en raison d’évènements imprévisibles, irrésistibles et indépendants de sa volonté, l’inexécution, l’exécution incomplète ou le retard ne sont pas considérés comme une violation des présentes. La partie invoquant un évènement de force majeure sera tenue de le notifier immédiatement par écrit à l’autre Partie en y précisant\n' +
        '\n' +
        'la nature et l’étendue de l’évènement. Si un cas de force majeure perdure les parties se rapprocheront pour examiner l\'incidence de l\'évènement et convenir des conditions dans lesquelles l\'exécution du contrat sera poursuivie. Si le cas de force majeure a une durée supérieure à trois mois, les présentes conditions générales ne s’appliqueront plus à la partie lésée.</p>' +
        '<p><strong>ARTICLE 11 -LOI APPLICABLE</strong> La présente convention est régie par le droit sénégalais. Les Parties s’engagent à tenter de résoudre à l’amiable et de bonne foi tout différend né à l’occasion de l’exécution, de l’interprétation ou de la résiliation des présentes CGU qui constituent le préalable pour la résolution du différend survenu. </br>' +
        '\n' +
        'A défaut de solution à l’amiable de tout différend, litige ou réclamation qui naîtrait au motif de l\'existence, de la validité, de l\'interprétation, de l\'exécution ou du respect du présent contrat, ou des accords qui en résultent ou qui présentent un lien avec ce dernier, sera soumis aux juridictions sénégalaises compétentes.</p>' +
        '</div>',
      nzCentered: true,
      nzOkText: this.idPmo ? 'Le candidat approuve' : 'J\'approuve',
      nzOnOk: () => {
        this.cguChecked = true;
      },
      nzWidth: 750
    });
  }

}


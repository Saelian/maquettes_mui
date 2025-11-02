/**
 * Types TypeScript pour les factures électroniques conformes à la norme EN16931
 * et aux règles métier françaises (BR-FR) de la norme XP Z12-012
 *
 * Ces types sont basés sur :
 * - Norme européenne EN16931
 * - Schematrons BR-FR pour la France
 * - Formats UBL et CII (Cross Industry Invoice)
 */

// ============================================================================
// TYPES DE BASE
// ============================================================================

/**
 * Format de date : AAAAMMJJ
 * Années autorisées : 2000-2099
 */
export type DateFacture = string;

/**
 * Montant avec 2 décimales maximum
 */
export type Montant = number;

/**
 * Quantité avec 4 décimales maximum
 */
export type Quantite = number;

/**
 * Prix unitaire avec 6 décimales maximum
 */
export type PrixUnitaire = number;

/**
 * Taux (pourcentage) avec 2 décimales maximum
 */
export type Taux = number;

/**
 * Identifiant (max 35 caractères, alphanumériques + symboles autorisés: + - _ /)
 */
export type Identifiant = string;

/**
 * SIREN : 9 chiffres
 */
export type SIREN = string;

/**
 * SIRET : 14 chiffres (doit commencer par le SIREN)
 */
export type SIRET = string;

/**
 * Numéro de TVA intracommunautaire
 */
export type NumeroTVA = string;

// ============================================================================
// ADRESSES
// ============================================================================

export interface AdressePostale {
  /** Ligne 1 de l'adresse (BT-35, BT-50, BT-75) */
  ligne1?: string;
  /** Ligne 2 de l'adresse (BT-36, BT-51, BT-76) */
  ligne2?: string;
  /** Ligne 3 de l'adresse (BT-162, BT-163, BT-164) */
  ligne3?: string;
  /** Ville (BT-37, BT-52, BT-77) */
  ville?: string;
  /** Code postal (BT-38, BT-53, BT-78) */
  codePostal?: string;
  /** Subdivision du pays (région, département) (BT-39, BT-54, BT-79) */
  subdivisionPays?: string;
  /** Code pays ISO 3166-1 alpha-2 (BT-40, BT-55, BT-80) - OBLIGATOIRE */
  codePays: string;
}

// ============================================================================
// PARTIES (VENDEUR, ACHETEUR, etc.)
// ============================================================================

export interface Contact {
  /** Nom du contact (BT-41, BT-56) */
  nom?: string;
  /** Téléphone (BT-42, BT-57) */
  telephone?: string;
  /** Email (BT-43, BT-58) */
  email?: string;
}

export interface AdresseElectronique {
  /** Identifiant de l'adresse électronique (BT-34, BT-49) */
  identifiant: string;
  /** Schéma de l'identifiant - Code EAS (BT-34-1, BT-49-1) */
  schemaIdentifiant: string;
}

export interface OrganisationLegale {
  /** SIREN (BT-30, BT-47) - Identifiant légal avec schemeID='0002' */
  siren?: SIREN;
  /** Nom de l'organisation légale (BT-28, BT-45) */
  nom?: string;
  /** Forme juridique (BT-33, BT-48) */
  formeJuridique?: string;
}

export interface Partie {
  /** Nom de la partie (BT-27, BT-44) - OBLIGATOIRE */
  nom: string;
  /** SIRET - GlobalID avec schemeID='0009' (BT-29, BT-46) */
  siret?: SIRET;
  /** Numéro de TVA (BT-31, BT-48) */
  numeroTVA?: NumeroTVA;
  /** Identifiant commercial (BT-29, BT-46) */
  identifiantCommercial?: string;
  /** Adresse postale (BG-5, BG-8) - OBLIGATOIRE */
  adressePostale: AdressePostale;
  /** Organisation légale (BG-4, BG-7) */
  organisationLegale?: OrganisationLegale;
  /** Contact */
  contact?: Contact;
  /** Adresse électronique (BT-34, BT-49) */
  adresseElectronique?: AdresseElectronique;
}

// ============================================================================
// NOTES ET MENTIONS LÉGALES
// ============================================================================

/**
 * Codes de sujet pour les notes (BT-21)
 */
export type CodeSujetNote =
  | 'PMT' // Indemnité forfaitaire pour frais de recouvrement (OBLIGATOIRE en France)
  | 'PMD' // Pénalités de retard (OBLIGATOIRE en France)
  | 'AAB' // Escompte ou absence d'escompte (OBLIGATOIRE en France)
  | 'TXD' // Mention de taxe
  | 'BAR' // Code de traitement (B2B, B2C, etc.)
  | 'REG'; // Autres notes réglementaires

export interface Note {
  /** Contenu de la note (BT-22) */
  contenu: string;
  /** Code de sujet (BT-21) */
  codeSujet?: CodeSujetNote;
}

/**
 * Codes de traitement pour la note BAR (BR-FR-20)
 */
export type CodeTraitementBAR =
  | 'B2B'          // Business to Business
  | 'B2BINT'       // Business to Business International
  | 'B2C'          // Business to Consumer
  | 'OUTOFSCOPE'   // Hors périmètre
  | 'ARCHIVEONLY'; // Archive uniquement

// ============================================================================
// TVA
// ============================================================================

/**
 * Codes de catégorie TVA (BT-95, BT-102, BT-118, BT-151)
 * Codes autorisés en France (BR-FR-15)
 */
export type CodeCategorieTVA =
  | 'S'   // Taux standard
  | 'E'   // Exonéré
  | 'AE'  // Autoliquidation
  | 'K'   // Intracommunautaire
  | 'G'   // Export hors UE
  | 'O'   // Hors champ
  | 'Z';  // Taux zéro

/**
 * Taux de TVA autorisés en France (BR-FR-16)
 */
export const TAUX_TVA_AUTORISES = [
  0, 0.0, 0.00,
  2.1, 2.10,
  5.5, 5.50,
  7, 7.0, 7.00,
  8.5, 8.50,
  9.2, 9.20,
  9.6, 9.60,
  10, 10.0, 10.00,
  13, 13.0, 13.00,
  19.6, 19.60,
  20, 20.0, 20.00,
  20.6, 20.60,
  0.9, 0.90,
  1.05,
  1.75
] as const;

export interface InformationTVA {
  /** Code de catégorie TVA (BT-95, BT-102, BT-118, BT-151) */
  codeCategorie: CodeCategorieTVA;
  /** Taux de TVA en pourcentage (BT-96, BT-103, BT-119, BT-152) */
  taux?: Taux;
  /** Montant de base (BT-116) */
  montantBase?: Montant;
  /** Montant de TVA (BT-117) */
  montantTVA?: Montant;
  /** Raison d'exonération (BT-120, BT-121) */
  raisonExoneration?: string;
  /** Code de raison d'exonération */
  codeRaisonExoneration?: string;
}

// ============================================================================
// REMISES ET FRAIS
// ============================================================================

export interface RemiseOuFrais {
  /** Montant (BT-92, BT-99) */
  montant: Montant;
  /** Montant de base (BT-93, BT-100) */
  montantBase?: Montant;
  /** Pourcentage (BT-94, BT-101) */
  pourcentage?: Taux;
  /** Raison (BT-97, BT-104) */
  raison?: string;
  /** Code de raison (BT-98, BT-105) */
  codeRaison?: string;
  /** Informations TVA */
  informationTVA: InformationTVA;
}

// ============================================================================
// PIÈCES JOINTES
// ============================================================================

/**
 * Codes autorisés pour qualifier les pièces jointes (BR-FR-17)
 */
export type CodePieceJointe =
  | 'RIB'
  | 'LISIBLE'                     // Un seul document LISIBLE autorisé (BR-FR-18)
  | 'FEUILLE_DE_STYLE'
  | 'PJA'
  | 'BORDEREAU_SUIVI'
  | 'DOCUMENT_ANNEXE'
  | 'BON_LIVRAISON'
  | 'BON_COMMANDE'
  | 'BORDEREAU_SUIVI_VALIDATION'
  | 'ETAT_ACOMPTE'
  | 'FACTURE_PAIEMENT_DIRECT';

export interface PieceJointe {
  /** Référence du document (BT-122) */
  reference: Identifiant;
  /** Description / Nom du document (BT-123) */
  description?: CodePieceJointe;
  /** URI du document externe (BT-124) */
  uri?: string;
  /** Document embarqué en base64 (BT-125) */
  documentEmbarque?: string;
  /** Type MIME (BT-125-1) */
  typeMime?: string;
  /** Nom du fichier (BT-125-2) */
  nomFichier?: string;
}

// ============================================================================
// PAIEMENT
// ============================================================================

/**
 * Codes de moyen de paiement (BT-81)
 */
export type CodeMoyenPaiement =
  | '1'   // Instrument non défini
  | '10'  // En espèces
  | '20'  // Chèque
  | '30'  // Virement
  | '42'  // Paiement à un compte bancaire
  | '48'  // Carte bancaire
  | '49'  // Prélèvement
  | '57'  // Virement SEPA
  | '58'  // Virement SEPA
  | '59'  // Prélèvement SEPA
  | '97'; // Compensation

export interface CompteBancaire {
  /** IBAN (BT-84) */
  iban?: string;
  /** Numéro de compte propriétaire (BT-84) */
  numeroCompte?: string;
  /** Nom de la banque (BT-85) */
  nomBanque?: string;
  /** BIC (BT-86) */
  bic?: string;
}

export interface CartePaiement {
  /** Numéro de carte (BT-87) - Masqué : 6 premiers + 4 derniers chiffres */
  numeroCarte: string;
  /** Titulaire de la carte (BT-88) */
  titulaire?: string;
}

export interface InformationPaiement {
  /** Code de moyen de paiement (BT-81) */
  moyenPaiement: CodeMoyenPaiement;
  /** Texte des conditions de paiement (BT-20) */
  conditionsPaiement?: string;
  /** Date d'échéance (BT-9) */
  dateEcheance?: DateFacture;
  /** Identifiant de mandat de prélèvement (BT-89) */
  identifiantMandat?: string;
  /** Compte bancaire du bénéficiaire (BG-17) */
  compteBancaire?: CompteBancaire;
  /** Informations de carte de paiement (BG-18) */
  cartePaiement?: CartePaiement;
  /** Référence de paiement (BT-83) */
  referencePaiement?: string;
}

// ============================================================================
// LIGNE DE FACTURE
// ============================================================================

export interface Article {
  /** Nom de l'article (BT-153) */
  nom: string;
  /** Description (BT-154) */
  description?: string;
  /** Identifiant du vendeur (BT-155) */
  identifiantVendeur?: string;
  /** Identifiant de l'acheteur (BT-156) */
  identifiantAcheteur?: string;
  /** Identifiant standard (BT-157) */
  identifiantStandard?: string;
  /** Schéma de l'identifiant standard (BT-157-1) */
  schemaIdentifiantStandard?: string;
  /** Code de classification (BT-158) */
  codeClassification?: string;
  /** Pays d'origine (BT-159) */
  paysOrigine?: string;
}

export interface LigneFacture {
  /** Numéro de ligne (BT-126) */
  numeroLigne: number;
  /** Identifiant de ligne (BT-127) */
  identifiantLigne?: Identifiant;
  /** Article (BG-31) */
  article: Article;
  /** Quantité (BT-129) */
  quantite: Quantite;
  /** Unité de mesure (BT-130) - Code UN/ECE Rec 20 */
  uniteMesure: string;
  /** Prix unitaire net (BT-146) */
  prixUnitaireNet: PrixUnitaire;
  /** Prix unitaire brut (BT-148) */
  prixUnitaireBrut?: PrixUnitaire;
  /** Montant net de la ligne (BT-131) */
  montantNet: Montant;
  /** Informations TVA de la ligne */
  informationTVA: InformationTVA;
  /** Remises au niveau de la ligne (BG-27) */
  remises?: RemiseOuFrais[];
  /** Frais au niveau de la ligne (BG-28) */
  frais?: RemiseOuFrais[];
  /** Période de facturation de la ligne (BG-26) */
  periodeDateDebut?: DateFacture;
  periodeDateFin?: DateFacture;
  /** Référence de commande (BT-132) */
  referenceCommande?: string;
  /** Notes de ligne */
  notes?: string;
}

// ============================================================================
// TOTAUX
// ============================================================================

export interface TotauxFacture {
  /** Somme des montants nets des lignes (BT-106) */
  sommeMontsNetsLignes: Montant;
  /** Somme des remises au niveau document (BT-107) */
  sommeRemises?: Montant;
  /** Somme des frais au niveau document (BT-108) */
  sommeFrais?: Montant;
  /** Montant total HT (BT-109) */
  montantTotalHT: Montant;
  /** Montant total de TVA (BT-110) */
  montantTotalTVA: Montant;
  /** Montant total de TVA en devise de comptabilisation (BT-111) */
  montantTotalTVADeviseCompta?: Montant;
  /** Montant total TTC (BT-112) */
  montantTotalTTC: Montant;
  /** Montant déjà payé (BT-113) */
  montantPaye?: Montant;
  /** Montant d'arrondi (BT-114) */
  montantArrondi?: Montant;
  /** Montant dû (BT-115) */
  montantDu: Montant;
  /** Détails TVA par taux (BG-23) */
  detailsTVA: InformationTVA[];
}

// ============================================================================
// TYPES DE DOCUMENTS
// ============================================================================

/**
 * Codes de type de document autorisés (BR-FR-04)
 */
export type CodeTypeDocument =
  | '380'  // Facture
  | '381'  // Avoir
  | '384'  // Facture rectificative
  | '386'  // Facture d'acompte
  | '389'  // Autofacture
  | '393'  // Facture partielle
  | '396'  // Facture récapitulative
  | '261'  // Autofacture pour marchandises
  | '262'  // Autofacture pour services
  | '471'  // Autofacture pour commission
  | '472'  // Autofacture pour location
  | '473'  // Autofacture pour leasing
  | '500'  // Autofacture pour services publics
  | '501'  // Autofacture pour crédit-bail
  | '502'  // Autofacture pour sous-traitance
  | '503'; // Autofacture pour négoce

/**
 * Modes de facturation (BR-FR-08) - Type de facture
 */
export type ModeFacturation =
  | 'B1'  // Facture de base
  | 'S1'  // Facture simplifiée
  | 'M1'  // Facture multiple
  | 'B2'  // Facture de base niveau 2
  | 'S2'  // Facture simplifiée niveau 2
  | 'M2'  // Facture multiple niveau 2
  | 'B4'  // Facture de base niveau 4
  | 'S4'  // Facture simplifiée niveau 4
  | 'M4'  // Facture multiple niveau 4
  | 'S5'  // Facture simplifiée niveau 5
  | 'S6'  // Facture simplifiée niveau 6
  | 'B7'  // Facture de base niveau 7
  | 'S7'; // Facture simplifiée niveau 7

// ============================================================================
// RÉFÉRENCE DE FACTURE PRÉCÉDENTE
// ============================================================================

export interface ReferenceFacturePrecedente {
  /** Numéro de la facture référencée (BT-25) */
  numero: Identifiant;
  /** Date d'émission de la facture référencée (BT-26) */
  dateEmission?: DateFacture;
  /** Type de document référencé */
  typeDocument?: CodeTypeDocument;
}

// ============================================================================
// PÉRIODE
// ============================================================================

export interface Periode {
  /** Date de début (BT-73) */
  dateDebut: DateFacture;
  /** Date de fin (BT-74) */
  dateFin: DateFacture;
}

// ============================================================================
// LIVRAISON
// ============================================================================

export interface InformationLivraison {
  /** Nom du destinataire (BT-70) */
  nomDestinataire?: string;
  /** Adresse de livraison (BG-15) */
  adresseLivraison?: AdressePostale;
  /** SIRET du point de livraison (BT-71) */
  siretPointLivraison?: SIRET;
  /** Date de livraison effective (BT-72) */
  dateLivraison?: DateFacture;
  /** Nom du lieu de livraison (BT-71-1) */
  nomLieuLivraison?: string;
}

// ============================================================================
// FACTURE PRINCIPALE
// ============================================================================

export interface FactureElectronique {
  /** Identifiant de spécification (BT-24) - Ex: 'urn:cen.eu:en16931:2017' */
  identifiantSpecification: string;
  /** Mode de facturation (BT-23) */
  modeFacturation?: ModeFacturation;

  // === INFORMATIONS GÉNÉRALES ===
  /** Numéro de facture (BT-1) - OBLIGATOIRE, max 35 caractères */
  numero: Identifiant;
  /** Date d'émission (BT-2) - OBLIGATOIRE, format AAAAMMJJ */
  dateEmission: DateFacture;
  /** Type de document (BT-3) - OBLIGATOIRE */
  typeDocument: CodeTypeDocument;
  /** Code devise (BT-5) - OBLIGATOIRE, code ISO 4217 */
  codeDevise: string;
  /** Code devise de comptabilisation TVA (BT-6) */
  codeDeviseTVA?: string;
  /** Date de valeur/fait générateur (BT-7) */
  dateFaitGenerateur?: DateFacture;

  // === PÉRIODES ===
  /** Période de facturation (BG-14) */
  periodeFacturation?: Periode;

  // === PARTIES ===
  /** Vendeur (BG-4) - OBLIGATOIRE */
  vendeur: Partie;
  /** Acheteur (BG-7) - OBLIGATOIRE */
  acheteur: Partie;
  /** Bénéficiaire du paiement (BG-10) */
  beneficiairePaiement?: Partie;
  /** Représentant fiscal du vendeur (BG-11) */
  representantFiscal?: Partie;

  // === RÉFÉRENCES ===
  /** Référence de projet (BT-11) */
  referenceProjet?: string;
  /** Référence de contrat (BT-12) */
  referenceContrat?: string;
  /** Référence de commande (BT-13) */
  referenceCommande?: string;
  /** Référence de bon de commande acheteur (BT-14) */
  referenceBonCommande?: string;
  /** Factures précédentes (BG-3) */
  facturesPrecedentes?: ReferenceFacturePrecedente[];

  // === LIVRAISON ===
  /** Informations de livraison (BG-13) */
  informationLivraison?: InformationLivraison;

  // === NOTES ET MENTIONS LÉGALES ===
  /** Notes de la facture (BG-1) */
  notes?: Note[];

  // === PIÈCES JOINTES ===
  /** Documents additionnels (BG-24) */
  piecesJointes?: PieceJointe[];

  // === PAIEMENT ===
  /** Informations de paiement (BG-16) */
  informationPaiement?: InformationPaiement;

  // === REMISES ET FRAIS AU NIVEAU DOCUMENT ===
  /** Remises au niveau document (BG-20) */
  remises?: RemiseOuFrais[];
  /** Frais au niveau document (BG-21) */
  frais?: RemiseOuFrais[];

  // === LIGNES DE FACTURE ===
  /** Lignes de facture (BG-25) - OBLIGATOIRE, au moins 1 ligne */
  lignes: LigneFacture[];

  // === TOTAUX ===
  /** Totaux de la facture (BG-22) - OBLIGATOIRE */
  totaux: TotauxFacture;
}

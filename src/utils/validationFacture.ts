/**
 * Règles de validation métier pour les factures électroniques
 * conformes à la norme EN16931 et aux règles françaises (BR-FR)
 *
 * Basé sur les schematrons :
 * - BR-FR pour les règles métier françaises
 * - EN16931 pour les règles européennes
 */

import type {
  DateFacture,
  SIREN,
  SIRET,
  Taux,
  Montant,
  Quantite,
  PrixUnitaire,
  CodeCategorieTVA,
  CodeTypeDocument,
  CodeTraitementBAR,
  CodePieceJointe,
  ModeFacturation,
} from '../types/factureEN16931';

// ============================================================================
// CONSTANTES DE VALIDATION
// ============================================================================

/**
 * Codes de type de document autorisés en France (BR-FR-04)
 */
export const CODES_TYPE_DOCUMENT: readonly CodeTypeDocument[] = [
  '380', '389', '393', '501', '386', '500', '384',
  '471', '472', '473', '261', '262', '381', '396',
  '502', '503'
] as const;

/**
 * Modes de facturation autorisés (BR-FR-08)
 */
export const MODES_FACTURATION: readonly ModeFacturation[] = [
  'B1', 'S1', 'M1', 'B2', 'S2', 'M2',
  'B4', 'S4', 'M4', 'S5', 'S6', 'B7', 'S7'
] as const;

/**
 * Codes de traitement BAR autorisés (BR-FR-20)
 */
export const CODES_TRAITEMENT_BAR: readonly CodeTraitementBAR[] = [
  'B2B', 'B2BINT', 'B2C', 'OUTOFSCOPE', 'ARCHIVEONLY'
] as const;

/**
 * Codes EAS (Electronic Address Scheme) autorisés (BR-FR-12)
 */
export const CODES_EAS_AUTORISES = [
  'AN', 'AQ', 'AS', 'AU', 'EM',
  '0002', '0007', '0009', '0037', '0060', '0088', '0096', '0097', '0106',
  '0130', '0135', '0142', '0147', '0151', '0154', '0158', '0170', '0177',
  '0183', '0184', '0188', '0190', '0191', '0192', '0193', '0194', '0195',
  '0196', '0198', '0199', '0200', '0201', '0202', '0203', '0204', '0205',
  '0208', '0209', '0210', '0211', '0212', '0213', '0215', '0216', '0217',
  '0218', '0221', '0225', '0230', '0235', '0240',
  '9910', '9913', '9914', '9915', '9918', '9919', '9920', '9922', '9923',
  '9924', '9925', '9926', '9927', '9928', '9929', '9930', '9931', '9932',
  '9933', '9934', '9935', '9936', '9937', '9938', '9939', '9940', '9941',
  '9942', '9943', '9944', '9945', '9946', '9947', '9948', '9949', '9950',
  '9951', '9952', '9953', '9957', '9959'
] as const;

/**
 * Codes de catégorie TVA autorisés en France (BR-FR-15)
 */
export const CODES_CATEGORIE_TVA: readonly CodeCategorieTVA[] = [
  'S', 'E', 'AE', 'K', 'G', 'O', 'Z'
] as const;

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

/**
 * Codes de pièces jointes autorisés (BR-FR-17)
 */
export const CODES_PIECES_JOINTES: readonly CodePieceJointe[] = [
  'RIB', 'LISIBLE', 'FEUILLE_DE_STYLE', 'PJA',
  'BORDEREAU_SUIVI', 'DOCUMENT_ANNEXE', 'BON_LIVRAISON',
  'BON_COMMANDE', 'BORDEREAU_SUIVI_VALIDATION', 'ETAT_ACOMPTE',
  'FACTURE_PAIEMENT_DIRECT'
] as const;

/**
 * Codes de type de document considérés comme autofactures
 * (utilisé pour BR-FR-21 et BR-FR-22)
 */
export const CODES_AUTOFACTURE: readonly CodeTypeDocument[] = [
  '389', '501', '500', '471', '473', '261', '502'
] as const;

// ============================================================================
// RÉSULTATS DE VALIDATION
// ============================================================================

export interface ErreurValidation {
  /** Code de la règle métier (ex: 'BR-FR-01') */
  code: string;
  /** Niveau : 'fatal' ou 'warning' */
  niveau: 'fatal' | 'warning';
  /** Message d'erreur */
  message: string;
  /** Chemin du champ en erreur */
  champ?: string;
  /** Valeur incorrecte */
  valeur?: unknown;
}

export interface ResultatValidation {
  /** Indique si la validation a réussi (aucune erreur fatale) */
  valide: boolean;
  /** Liste des erreurs de validation */
  erreurs: ErreurValidation[];
}

// ============================================================================
// FONCTIONS DE VALIDATION - FORMAT
// ============================================================================

/**
 * BR-FR-01 & BR-FR-02 : Valide le format d'un identifiant
 * Max 35 caractères, alphanumérique + symboles autorisés : + - _ /
 * Pas d'espaces
 */
export function validerFormatIdentifiant(id: string): boolean {
  if (id.length > 35) return false;
  // Autorise lettres, chiffres, +, -, _, / sans espaces
  return /^[A-Za-z0-9+\-_/]+$/.test(id);
}

/**
 * BR-FR-03 : Valide le format d'une date
 * Format : AAAAMMJJ
 * Année : 2000-2099
 * Valide aussi la cohérence de la date (nombre de jours selon le mois, années bissextiles)
 */
export function validerFormatDate(date: DateFacture): boolean {
  // Format de base : AAAAMMJJ
  if (!/^20\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(date)) {
    return false;
  }

  const annee = parseInt(date.substring(0, 4), 10);
  const mois = parseInt(date.substring(4, 6), 10);
  const jour = parseInt(date.substring(6, 8), 10);

  // Vérifier l'année bissextile
  const estBissextile = (annee % 4 === 0 && annee % 100 !== 0) || (annee % 400 === 0);

  // Nombre de jours par mois
  const joursParMois: Record<number, number> = {
    1: 31, 2: estBissextile ? 29 : 28, 3: 31, 4: 30, 5: 31, 6: 30,
    7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
  };

  const maxJours = joursParMois[mois] || 0;
  return jour <= maxJours;
}

/**
 * BR-FR-09 : Vérifie la cohérence SIRET/SIREN
 * Le SIRET doit avoir 14 chiffres et commencer par le SIREN (9 chiffres)
 */
export function validerCoherenceSIRETSIREN(siret: SIRET, siren: SIREN): boolean {
  if (!/^\d{14}$/.test(siret)) return false;
  if (!/^\d{9}$/.test(siren)) return false;
  return siret.substring(0, 9) === siren;
}

/**
 * BR-FR-10 : Valide le format d'un SIREN (9 chiffres)
 */
export function validerFormatSIREN(siren: SIREN): boolean {
  return /^\d{9}$/.test(siren);
}

/**
 * BR-FR-23 & BR-FR-24 : Valide le format d'un schemeID
 * Autorise lettres, chiffres, + - _ / sans espaces
 */
export function validerFormatSchemeID(value: string): boolean {
  return /^[A-Za-z0-9+\-_/]+$/.test(value);
}

// ============================================================================
// FONCTIONS DE VALIDATION - DÉCIMALES
// ============================================================================

/**
 * BR-FR-DEC-01 : Valide un montant
 * 19 positions maximum, 2 décimales maximum
 */
export function validerFormatMontant(montant: Montant): boolean {
  const montantStr = montant.toString();
  // Vérifie le format : maximum 19 chiffres + 2 décimales
  if (!/^-?\d{1,19}(\.\d{1,2})?$/.test(montantStr)) return false;
  // Vérifie la longueur totale (sans le point)
  const sansPoint = montantStr.replace('.', '').replace('-', '');
  return sansPoint.length <= 19;
}

/**
 * BR-FR-DEC-02 : Valide une quantité
 * 19 positions maximum, 4 décimales maximum
 */
export function validerFormatQuantite(quantite: Quantite): boolean {
  const quantiteStr = quantite.toString();
  // Vérifie le format : maximum 19 chiffres + 4 décimales
  if (!/^-?\d{1,19}(\.\d{1,4})?$/.test(quantiteStr)) return false;
  // Vérifie la longueur totale (sans le point)
  const sansPoint = quantiteStr.replace('.', '').replace('-', '');
  return sansPoint.length <= 19;
}

/**
 * BR-FR-DEC-03 : Valide un prix unitaire
 * 19 positions maximum, 6 décimales maximum, positif
 */
export function validerFormatPrixUnitaire(prix: PrixUnitaire): boolean {
  if (prix < 0) return false;
  const prixStr = prix.toString();
  // Vérifie le format : maximum 19 chiffres + 6 décimales
  if (!/^\d{1,19}(\.\d{1,6})?$/.test(prixStr)) return false;
  // Vérifie la longueur totale (sans le point)
  const sansPoint = prixStr.replace('.', '');
  return sansPoint.length <= 19;
}

/**
 * BR-FR-DEC-04 : Valide un taux/pourcentage
 * 4 positions maximum, 2 décimales maximum, positif
 */
export function validerFormatTaux(taux: Taux): boolean {
  if (taux < 0) return false;
  const tauxStr = taux.toString();
  // Vérifie le format : maximum 4 chiffres + 2 décimales
  if (!/^\d{1,4}(\.\d{1,2})?$/.test(tauxStr)) return false;
  // Vérifie la longueur totale (sans le point)
  const sansPoint = tauxStr.replace('.', '');
  return sansPoint.length <= 4;
}

// ============================================================================
// FONCTIONS DE VALIDATION - CODES ET LISTES
// ============================================================================

/**
 * BR-FR-04 : Valide le code type de document
 */
export function estCodeTypeDocumentValide(code: string): code is CodeTypeDocument {
  return CODES_TYPE_DOCUMENT.includes(code as CodeTypeDocument);
}

/**
 * BR-FR-08 : Valide le mode de facturation
 */
export function estModeFacturationValide(mode: string): mode is ModeFacturation {
  return MODES_FACTURATION.includes(mode as ModeFacturation);
}

/**
 * BR-FR-12 : Valide le code EAS
 */
export function estCodeEASValide(code: string): boolean {
  return (CODES_EAS_AUTORISES as readonly string[]).includes(code);
}

/**
 * BR-FR-15 : Valide le code de catégorie TVA
 */
export function estCodeCategorieTVAValide(code: string): code is CodeCategorieTVA {
  return CODES_CATEGORIE_TVA.includes(code as CodeCategorieTVA);
}

/**
 * BR-FR-16 : Valide le taux de TVA
 */
export function estTauxTVAValide(taux: number): boolean {
  return TAUX_TVA_AUTORISES.includes(taux as never);
}

/**
 * BR-FR-17 : Valide le code de pièce jointe
 */
export function estCodePieceJointeValide(code: string): code is CodePieceJointe {
  return CODES_PIECES_JOINTES.includes(code as CodePieceJointe);
}

/**
 * BR-FR-20 : Valide le code de traitement BAR
 */
export function estCodeTraitementBARValide(code: string): code is CodeTraitementBAR {
  return CODES_TRAITEMENT_BAR.includes(code as CodeTraitementBAR);
}

/**
 * Vérifie si un code de type de document est une autofacture
 */
export function estAutofacture(codeTypeDocument: CodeTypeDocument): boolean {
  return CODES_AUTOFACTURE.includes(codeTypeDocument);
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Formate une date au format AAAAMMJJ à partir d'un objet Date JavaScript
 */
export function formaterDateFacture(date: Date): DateFacture {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const jour = String(date.getDate()).padStart(2, '0');
  return `${annee}${mois}${jour}`;
}

/**
 * Parse une date au format AAAAMMJJ vers un objet Date JavaScript
 */
export function parserDateFacture(dateStr: DateFacture): Date | null {
  if (!validerFormatDate(dateStr)) return null;

  const annee = parseInt(dateStr.substring(0, 4), 10);
  const mois = parseInt(dateStr.substring(4, 6), 10) - 1; // Les mois commencent à 0
  const jour = parseInt(dateStr.substring(6, 8), 10);

  return new Date(annee, mois, jour);
}

/**
 * Arrondit un montant à 2 décimales
 */
export function arrondirMontant(montant: number): Montant {
  return Math.round(montant * 100) / 100;
}

/**
 * Arrondit une quantité à 4 décimales
 */
export function arrondirQuantite(quantite: number): Quantite {
  return Math.round(quantite * 10000) / 10000;
}

/**
 * Arrondit un prix unitaire à 6 décimales
 */
export function arrondirPrixUnitaire(prix: number): PrixUnitaire {
  return Math.round(prix * 1000000) / 1000000;
}

/**
 * Arrondit un taux à 2 décimales
 */
export function arrondirTaux(taux: number): Taux {
  return Math.round(taux * 100) / 100;
}

// ============================================================================
// CALCULS DE TOTAUX
// ============================================================================

/**
 * Calcule le montant net d'une ligne de facture
 * Montant net = Quantité × Prix unitaire net
 */
export function calculerMontantNetLigne(quantite: Quantite, prixUnitaire: PrixUnitaire): Montant {
  return arrondirMontant(quantite * prixUnitaire);
}

/**
 * Calcule le montant de TVA
 * Montant TVA = Montant de base × (Taux / 100)
 */
export function calculerMontantTVA(montantBase: Montant, tauxTVA: Taux): Montant {
  return arrondirMontant(montantBase * (tauxTVA / 100));
}

/**
 * Calcule le montant TTC à partir du montant HT et du taux de TVA
 */
export function calculerMontantTTC(montantHT: Montant, tauxTVA: Taux): Montant {
  const montantTVA = calculerMontantTVA(montantHT, tauxTVA);
  return arrondirMontant(montantHT + montantTVA);
}

/**
 * Types pour les flux e-reporting
 */

/**
 * Type de flux e-reporting
 */
export type TypeFlux = '10.1' | '10.2' | '10.3' | '10.4';

/**
 * Type de transmission
 */
export type TypeTransmission = 'IN' | 'CO' | 'MO' | 'RE';

/**
 * Type d'identifiant émetteur
 */
export type TypeIdEmetteur = '0002' | '0238';

/**
 * Code rôle émetteur
 */
export type CodeRoleEmetteur = 'WK' | 'BY' | 'SE' | 'AB' | 'SR';

/**
 * Code rôle déclarant
 */
export type CodeRoleDeclarant = 'BY' | 'SE';

/**
 * Horodatage (format AAAAMMJJHHMMSS)
 */
export interface Horodatage {
  dateHeureChaine: string; // format: AAAAMMJJHHMMSS
}

/**
 * Références de transmission précédente
 */
export interface ReferencesTransmission {
  idTransmissionPrecedente: string;
  typeTransmissionPrecedente: 'IN' | 'CO' | 'MO';
}

/**
 * Adresse électronique
 */
export interface AdresseElectronique {
  uri: string;
}

/**
 * Émetteur du document
 */
export interface EmetteurDocument {
  id: string;
  typeId: TypeIdEmetteur;
  raisonSociale: string;
  codeRole: CodeRoleEmetteur;
  adresseElectronique?: AdresseElectronique;
}

/**
 * Déclarant
 */
export interface Declarant {
  id: string; // SIREN (9 caractères)
  typeId: '0002';
  raisonSociale: string;
  codeRole: CodeRoleDeclarant;
  adresseElectronique?: AdresseElectronique;
}

/**
 * Données communes à tous les flux (racine - TB-1)
 */
export interface DonneesRacineFlux {
  idTransmission: string;
  nomDocument?: string;
  horodatage: Horodatage;
  codeTypeTransmission: TypeTransmission;
  references?: ReferencesTransmission;
  emetteur: EmetteurDocument;
  declarant: Declarant;
}

/**
 * Période de transmission
 */
export interface PeriodeTransmission {
  dateDebut: string; // format: AAAAMMJJ
  dateFin: string; // format: AAAAMMJJ
}

/**
 * Facture (Flux 10.1)
 */
export interface FactureB2B {
  numeroFacture: string;
  dateEmission: string; // format: AAAAMMJJ
  codeTypeFacture: string; // UNTDID 1001
  codeDevise: string; // ISO 4217
}

/**
 * Transmission de transactions (TB-2) - Flux 10.1 / 10.3
 */
export interface TransmissionTransactions {
  periode: PeriodeTransmission;
  factures?: FactureB2B[]; // Présent uniquement pour Flux 10.1
}

/**
 * Répartition par taux (Flux 10.2)
 */
export interface RepartitionParTaux {
  taux: number; // Pourcentage
  codeDevise?: string; // ISO 4217
  montantEncaisse: number;
}

/**
 * Paiement (Flux 10.2)
 */
export interface Paiement {
  datePaiement: string; // format: AAAAMMJJ
  repartitions: RepartitionParTaux[];
}

/**
 * Facture avec paiement (Flux 10.2)
 */
export interface FactureAvecPaiement {
  numeroFacture: string;
  dateFacture: string; // format: AAAAMMJJ
  paiement: Paiement;
}

/**
 * Transmission de paiements (TB-3) - Flux 10.2 / 10.4
 */
export interface TransmissionPaiements {
  periode: PeriodeTransmission;
  factures?: FactureAvecPaiement[]; // Présent uniquement pour Flux 10.2
}

/**
 * Flux e-reporting complet
 */
export interface FluxEReporting {
  typeFlux: TypeFlux;
  donneesRacine: DonneesRacineFlux;
  transmissionTransactions?: TransmissionTransactions; // Pour Flux 10.1 et 10.3
  transmissionPaiements?: TransmissionPaiements; // Pour Flux 10.2 et 10.4
}

/**
 * Libellé descriptif pour chaque type de flux (avec "Données de")
 */
export const LIBELLE_FLUX: Record<TypeFlux, string> = {
  '10.1': 'Données de factures B2B internationales',
  '10.2': 'Données de paiement de facture B2B internationales',
  '10.3': 'Données de transactions B2C',
  '10.4': 'Données de paiement de transactions B2C',
};

/**
 * Libellé court pour chaque type de flux (sans "Données de")
 */
export const LIBELLE_FLUX_COURT: Record<TypeFlux, string> = {
  '10.1': 'Factures B2B internationales',
  '10.2': 'Paiement de facture B2B internationales',
  '10.3': 'Transactions B2C',
  '10.4': 'Paiement de transactions B2C',
};

/**
 * Libellé pour les types de transmission
 */
export const LIBELLE_TYPE_TRANSMISSION: Record<TypeTransmission, string> = {
  IN: 'Initiale',
  CO: 'Complémentaire',
  MO: 'Corrective',
  RE: 'Rectificative',
};

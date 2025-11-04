import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Toolbar,
  Tooltip,
  InputAdornment,
  Divider,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  ViewColumn as ViewColumnIcon,
  RestartAlt as RestartAltIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';
import type { FactureElectronique, Partie, LigneFacture } from '../types/factureEN16931';
import { arrondirMontant } from '../utils/validationFacture';
import { ACHETEUR_EXEMPLE } from '../utils/donneesExemplesFactures';

// Types de statuts de facture d'achat
type StatutTechnique =
  | 'Reçue de la plateforme'
  | 'Mise à disposition'
  | 'Rejetée';

type StatutMetier =
  | 'Prise en charge'
  | 'Approuvée'
  | 'Approuvée partiellement'
  | 'En litige'
  | 'Suspendue'
  | 'Refusée'
  | 'Paiement transmis';

type StatutApplicatif =
  | 'En attente de validation iXParapheur'
  | 'Validée dans iXParapheur';

type StatutFacture = StatutTechnique | StatutMetier | StatutApplicatif;

// Type pour l'origine de la facture
type OrigineFacture = 'PA' | 'Hors PA';

// Type pour la nature de la facture
type NatureFacture = 'Factures_ERP1' | 'Factures_ERP2' | 'Factures_General';

// Interface pour une facture d'achat conforme EN16931 + statuts métiers
interface FactureAchat extends FactureElectronique {
  id: string;
  statut: StatutFacture;
  origine: OrigineFacture; // PA = Plateforme Agréée, Hors PA = Canal tiers
  nature: NatureFacture; // Nature de routage de la facture
  dateReception?: string; // Date de réception par l'acheteur (format YYYYMMDD)
}

// Types d'actions possibles dans l'historique
type TypeAction =
  | 'statut_technique'
  | 'statut_metier'
  | 'statut_application'
  | 'consultation'
  | 'telechargement'
  | 'exportation'
  | 'metadonnee'
  | 'changement_statut_manuel'
  | 'changement_statut_api';

// Interface pour l'historique d'une facture
interface EvenementHistorique {
  dateHeure: string; // Format: YYYY-MM-DD HH:mm:ss
  utilisateur: string; // Nom de l'utilisateur ou "Système"
  adresseIp?: string; // Adresse IP de l'utilisateur (optionnel pour le système)
  typeAction: TypeAction;
  action: string; // L'action ou le statut
  detailAction: string; // Phrase descriptive de l'action
  metadonneeAvant?: string; // Pour les modifications de métadonnées
  metadonneeApres?: string; // Pour les modifications de métadonnées
}

// Interface pour les métadonnées
interface Metadonnee {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select';
  valeur: string;
  options?: string[];
}

// Mapping des codes types de documents
const TYPE_DOCUMENT_LABELS: Record<string, string> = {
  '380': 'Facture commerciale',
  '381': 'Avoir',
  '384': 'Facture rectificative',
  '386': "Facture d'acompte",
};

// Colonnes disponibles pour le tableau - Conformes EN16931
interface Colonne {
  id: 'numero' | 'dateEmission' | 'dateReception' | 'typeDocument' | 'vendeur' | 'montantTTC' | 'montantDu' | 'devise' | 'nombreLignes' | 'statut' | 'origine' | 'nature';
  label: string;
  codeBT: string;
  visible: boolean;
  sortable: boolean;
}

// Fournisseurs d'exemple
const FOURNISSEUR_1: Partie = {
  nom: 'Fournitures Bureau SA',
  siret: '11111111100001',
  numeroTVA: 'FR11111111111',
  adressePostale: {
    ligne1: '10 Rue du Commerce',
    ville: 'Marseille',
    codePostal: '13001',
    codePays: 'FR',
  },
};

const FOURNISSEUR_2: Partie = {
  nom: 'Solutions Informatiques SARL',
  siret: '22222222200002',
  numeroTVA: 'FR22222222222',
  adressePostale: {
    ligne1: '25 Avenue des Technologies',
    ville: 'Toulouse',
    codePostal: '31000',
    codePays: 'FR',
  },
};

const FOURNISSEUR_3: Partie = {
  nom: 'Équipements Pro & Cie',
  siret: '33333333300003',
  adressePostale: {
    ligne1: '5 Boulevard des Industries',
    ville: 'Lille',
    codePostal: '59000',
    codePays: 'FR',
  },
};

const FOURNISSEUR_4: Partie = {
  nom: 'Maintenance Services Plus',
  siret: '44444444400004',
  numeroTVA: 'FR44444444444',
  adressePostale: {
    ligne1: '78 Rue de la Maintenance',
    ville: 'Nantes',
    codePostal: '44000',
    codePays: 'FR',
  },
};

// Fonction helper pour créer des lignes de facture
const creerLigneFacture = (
  numero: number,
  nom: string,
  quantite: number,
  prixUnitaireNet: number,
  tauxTVA: number
): LigneFacture => {
  const montantNet = arrondirMontant(quantite * prixUnitaireNet);
  return {
    numeroLigne: numero,
    article: {
      nom,
    },
    quantite,
    uniteMesure: 'C62', // Code UN/ECE pour "unité"
    prixUnitaireNet,
    montantNet,
    informationTVA: {
      codeCategorie: 'S',
      taux: tauxTVA,
    },
  };
};

// Données fictives de factures d'achat conformes EN16931 - Au minimum une facture par statut
const facturesAchatFictives: FactureAchat[] = [
  {
    id: '1',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-001',
    dateEmission: '20251001',
    dateReception: '20251001',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_1,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Ramettes papier A4 - Lot de 10', 5, 25.0, 20),
      creerLigneFacture(2, 'Cartouches d\'encre - Pack de 4', 10, 45.0, 20),
      creerLigneFacture(3, 'Classeurs à levier', 20, 3.5, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 690.0,
      montantTotalHT: 690.0,
      montantTotalTVA: 138.0,
      montantTotalTTC: 828.0,
      montantDu: 828.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 690.0, montantTVA: 138.0 }],
    },
    statut: 'Mise à disposition',
    origine: 'PA',
    nature: 'Factures_ERP1',
  },
  {
    id: '2',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-002',
    dateEmission: '20251002',
    dateReception: '20251002',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_2,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Licence logicielle annuelle', 1, 1200.0, 20),
      creerLigneFacture(2, 'Support technique premium', 12, 150.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 3000.0,
      montantTotalHT: 3000.0,
      montantTotalTVA: 600.0,
      montantTotalTTC: 3600.0,
      montantDu: 3600.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 3000.0, montantTVA: 600.0 }],
    },
    statut: 'Mise à disposition',
    origine: 'Hors PA',
    nature: 'Factures_ERP2',
  },
  {
    id: '3',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-003',
    dateEmission: '20251003',
    dateReception: '20251003',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_3,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Équipement de sécurité', 5, 120.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 600.0,
      montantTotalHT: 600.0,
      montantTotalTVA: 120.0,
      montantTotalTTC: 720.0,
      montantDu: 720.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 600.0, montantTVA: 120.0 }],
    },
    statut: 'Rejetée',
    origine: 'PA',
    nature: 'Factures_General',
  },
  {
    id: '4',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-004',
    dateEmission: '20251004',
    dateReception: '20251004',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_4,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Intervention maintenance préventive', 8, 85.0, 20),
      creerLigneFacture(2, 'Pièces de rechange', 1, 450.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 1130.0,
      montantTotalHT: 1130.0,
      montantTotalTVA: 226.0,
      montantTotalTTC: 1356.0,
      montantDu: 1356.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 1130.0, montantTVA: 226.0 }],
    },
    statut: 'Prise en charge',
    origine: 'PA',
    nature: 'Factures_ERP1',
  },
  {
    id: '5',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-005',
    dateEmission: '20251005',
    dateReception: '20251005',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_1,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Matériel de bureau divers', 1, 890.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 890.0,
      montantTotalHT: 890.0,
      montantTotalTVA: 178.0,
      montantTotalTTC: 1068.0,
      montantDu: 1068.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 890.0, montantTVA: 178.0 }],
    },
    statut: 'Approuvée',
    origine: 'PA',
    nature: 'Factures_ERP1',
  },
  {
    id: '6',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-006',
    dateEmission: '20251006',
    dateReception: '20251006',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_2,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Formation professionnelle', 2, 650.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 1300.0,
      montantTotalHT: 1300.0,
      montantTotalTVA: 260.0,
      montantTotalTTC: 1560.0,
      montantDu: 1560.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 1300.0, montantTVA: 260.0 }],
    },
    statut: 'Approuvée partiellement',
    origine: 'PA',
    nature: 'Factures_ERP2',
  },
  {
    id: '7',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-007',
    dateEmission: '20251007',
    dateReception: '20251007',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_3,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Prestation de services', 1, 2400.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 2400.0,
      montantTotalHT: 2400.0,
      montantTotalTVA: 480.0,
      montantTotalTTC: 2880.0,
      montantDu: 2880.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 2400.0, montantTVA: 480.0 }],
    },
    statut: 'En litige',
    origine: 'PA',
    nature: 'Factures_General',
  },
  {
    id: '8',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-008',
    dateEmission: '20251008',
    dateReception: '20251008',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_4,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Équipement industriel', 1, 5400.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 5400.0,
      montantTotalHT: 5400.0,
      montantTotalTVA: 1080.0,
      montantTotalTTC: 6480.0,
      montantDu: 6480.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 5400.0, montantTVA: 1080.0 }],
    },
    statut: 'Suspendue',
    origine: 'PA',
    nature: 'Factures_ERP1',
  },
  {
    id: '9',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-009',
    dateEmission: '20251009',
    dateReception: '20251009',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_1,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Consommables divers', 1, 350.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 350.0,
      montantTotalHT: 350.0,
      montantTotalTVA: 70.0,
      montantTotalTTC: 420.0,
      montantDu: 420.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 350.0, montantTVA: 70.0 }],
    },
    statut: 'Refusée',
    origine: 'PA',
    nature: 'Factures_ERP1',
  },
  {
    id: '10',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-010',
    dateEmission: '20251010',
    dateReception: '20251010',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_2,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Abonnement cloud mensuel', 12, 250.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 3000.0,
      montantTotalHT: 3000.0,
      montantTotalTVA: 600.0,
      montantTotalTTC: 3600.0,
      montantDu: 3600.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 3000.0, montantTVA: 600.0 }],
    },
    statut: 'Paiement transmis',
    origine: 'PA',
    nature: 'Factures_ERP2',
  },
  {
    id: '11',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-011',
    dateEmission: '20251011',
    dateReception: '20251011',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_3,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Travaux de rénovation', 1, 8500.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 8500.0,
      montantTotalHT: 8500.0,
      montantTotalTVA: 1700.0,
      montantTotalTTC: 10200.0,
      montantDu: 10200.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 8500.0, montantTVA: 1700.0 }],
    },
    statut: 'En attente de validation iXParapheur',
    origine: 'PA',
    nature: 'Factures_ERP1',
  },
  {
    id: '12',
    identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
    modeFacturation: 'B1',
    numero: 'FA-2025-012',
    dateEmission: '20251012',
    dateReception: '20251012',
    typeDocument: '380',
    codeDevise: 'EUR',
    vendeur: FOURNISSEUR_4,
    acheteur: ACHETEUR_EXEMPLE,
    lignes: [
      creerLigneFacture(1, 'Prestations de conseil', 10, 800.0, 20),
    ],
    totaux: {
      sommeMontsNetsLignes: 8000.0,
      montantTotalHT: 8000.0,
      montantTotalTVA: 1600.0,
      montantTotalTTC: 9600.0,
      montantDu: 9600.0,
      detailsTVA: [{ codeCategorie: 'S', taux: 20, montantBase: 8000.0, montantTVA: 1600.0 }],
    },
    statut: 'Approuvée', // Passée par le parapheur et validée
    origine: 'PA',
    nature: 'Factures_ERP2',
  },
];

// Configuration des colonnes par défaut - Conformes EN16931
const colonnesParDefaut: Colonne[] = [
  { id: 'numero', label: 'Numéro facture', codeBT: 'BT-1', visible: true, sortable: true },
  { id: 'vendeur', label: 'Fournisseur', codeBT: 'BT-27', visible: true, sortable: true },
  { id: 'typeDocument', label: 'Type document', codeBT: 'BT-3', visible: true, sortable: true },
  { id: 'dateEmission', label: 'Date émission', codeBT: 'BT-2', visible: true, sortable: true },
  { id: 'dateReception', label: 'Date réception', codeBT: '-', visible: true, sortable: true },
  { id: 'origine', label: 'Origine', codeBT: '-', visible: true, sortable: true },
  { id: 'nature', label: 'Nature', codeBT: '-', visible: true, sortable: true },
  { id: 'montantTTC', label: 'Montant TTC', codeBT: 'BT-112', visible: true, sortable: true },
  { id: 'statut', label: 'Statut', codeBT: '-', visible: true, sortable: true },
  { id: 'montantDu', label: 'Montant dû', codeBT: 'BT-115', visible: false, sortable: true },
  { id: 'devise', label: 'Devise', codeBT: 'BT-5', visible: false, sortable: true },
  { id: 'nombreLignes', label: 'Nb lignes', codeBT: 'BG-25', visible: false, sortable: true },
];

// Fonction pour générer une phrase descriptive selon le statut ou l'action
const genererDetailAction = (action: string, typeAction: TypeAction, metadonneeAvant?: string, metadonneeApres?: string): string => {
  // Pour les statuts techniques
  if (typeAction === 'statut_technique') {
    switch (action) {
      case 'Reçue de la plateforme':
        return 'La facture est reçue de la plateforme';
      case 'Mise à disposition':
        return 'La facture est mise à disposition';
      case 'Rejetée':
        return 'La facture est rejetée';
      default:
        return `Statut technique : ${action}`;
    }
  }

  // Pour les statuts métiers
  if (typeAction === 'statut_metier' || typeAction === 'changement_statut_manuel' || typeAction === 'changement_statut_api') {
    switch (action) {
      case 'Prise en charge':
        return 'La facture est prise en charge';
      case 'Approuvée':
        return 'La facture est approuvée';
      case 'Approuvée partiellement':
        return 'La facture est approuvée partiellement';
      case 'En litige':
        return 'La facture est mise en litige';
      case 'Suspendue':
        return 'La facture est suspendue';
      case 'Refusée':
        return 'La facture est refusée';
      case 'Paiement transmis':
        return 'Le paiement de la facture est transmis';
      default:
        return `Changement de statut : ${action}`;
    }
  }

  // Pour les statuts applicatifs
  if (typeAction === 'statut_application') {
    switch (action) {
      case 'En attente de validation iXParapheur':
        return 'La facture est envoyée pour validation dans iXParapheur';
      case 'Facture validée dans iXParapheur':
      case 'Validée dans iXParapheur':
        return 'La facture est validée dans iXParapheur';
      default:
        return `Statut applicatif : ${action}`;
    }
  }

  // Pour les consultations
  if (typeAction === 'consultation') {
    return 'Consultation de la facture';
  }

  // Pour les téléchargements
  if (typeAction === 'telechargement') {
    return `Téléchargement de la facture au format ${action}`;
  }

  // Pour les exportations
  if (typeAction === 'exportation') {
    return `Exportation de la facture au format ${action}`;
  }

  // Pour les modifications de métadonnées
  if (typeAction === 'metadonnee') {
    if (metadonneeAvant && metadonneeApres) {
      return `Modification de la métadonnée "${action}" : de "${metadonneeAvant}" vers "${metadonneeApres}"`;
    } else if (metadonneeApres) {
      return `Ajout de la métadonnée "${action}" : "${metadonneeApres}"`;
    }
    return `Modification de la métadonnée "${action}"`;
  }

  return action;
};

// Fonction pour générer un historique cohérent en fonction de la facture
const genererHistoriqueFacture = (facture: FactureAchat): EvenementHistorique[] => {
  const historique: EvenementHistorique[] = [];
  const dateEmission = facture.dateEmission || '20251001';
  const dateBase = `${dateEmission.substring(0, 4)}-${dateEmission.substring(4, 6)}-${dateEmission.substring(6, 8)}`;

  // Toutes les factures commencent par "Reçue de la plateforme"
  historique.push({
    dateHeure: `${dateBase} 09:15:32`,
    utilisateur: 'Système',
    typeAction: 'statut_technique',
    action: 'Reçue de la plateforme',
    detailAction: genererDetailAction('Reçue de la plateforme', 'statut_technique'),
  });

  // Si la facture est rejetée, on s'arrête là
  if (facture.statut === 'Rejetée') {
    historique.push({
      dateHeure: `${dateBase} 09:16:05`,
      utilisateur: 'Système',
      typeAction: 'statut_technique',
      action: 'Rejetée',
      detailAction: genererDetailAction('Rejetée', 'statut_technique'),
    });
    return historique;
  }

  // Sinon, on passe à "Mise à disposition"
  historique.push({
    dateHeure: `${dateBase} 09:16:05`,
    utilisateur: 'Système',
    typeAction: 'statut_technique',
    action: 'Mise à disposition',
    detailAction: genererDetailAction('Mise à disposition', 'statut_technique'),
  });

  // Si le statut actuel est "Mise à disposition", on ajoute juste quelques consultations
  if (facture.statut === 'Mise à disposition') {
    historique.push({
      dateHeure: `${dateBase} 10:23:17`,
      utilisateur: 'Marie Dupont',
      adresseIp: '192.168.1.45',
      typeAction: 'consultation',
      action: 'Consultation',
      detailAction: genererDetailAction('Consultation', 'consultation'),
    });
    return historique;
  }

  // Ajouter une consultation
  historique.push({
    dateHeure: `${dateBase} 10:23:17`,
    utilisateur: 'Marie Dupont',
    adresseIp: '192.168.1.45',
    typeAction: 'consultation',
    action: 'Consultation',
    detailAction: genererDetailAction('Consultation', 'consultation'),
  });

  // Ajouter un téléchargement
  historique.push({
    dateHeure: `${dateBase} 10:25:42`,
    utilisateur: 'Marie Dupont',
    adresseIp: '192.168.1.45',
    typeAction: 'telechargement',
    action: 'PDF',
    detailAction: genererDetailAction('PDF', 'telechargement'),
  });

  // Ajouter des métadonnées
  historique.push({
    dateHeure: `${dateBase} 14:35:22`,
    utilisateur: 'Jean Martin',
    adresseIp: '192.168.1.78',
    typeAction: 'metadonnee',
    action: 'Service payeur',
    detailAction: genererDetailAction('Service payeur', 'metadonnee', undefined, 'DSI'),
    metadonneeApres: 'DSI',
  });

  // Calculer la date du lendemain
  const dateSuivante = new Date(dateBase);
  dateSuivante.setDate(dateSuivante.getDate() + 1);
  const dateJ1 = dateSuivante.toISOString().split('T')[0];

  // Gestion des différents statuts métiers
  switch (facture.statut) {
    case 'En attente de validation iXParapheur':
      historique.push({
        dateHeure: `${dateJ1} 09:12:45`,
        utilisateur: 'Sophie Leclerc',
        adresseIp: '192.168.1.92',
        typeAction: 'changement_statut_manuel',
        action: 'Prise en charge',
        detailAction: genererDetailAction('Prise en charge', 'changement_statut_manuel'),
      });
      historique.push({
        dateHeure: `${dateJ1} 11:48:33`,
        utilisateur: 'Sophie Leclerc',
        adresseIp: '192.168.1.92',
        typeAction: 'statut_application',
        action: 'En attente de validation iXParapheur',
        detailAction: genererDetailAction('En attente de validation iXParapheur', 'statut_application'),
      });
      break;

    case 'Prise en charge':
      historique.push({
        dateHeure: `${dateJ1} 09:12:45`,
        utilisateur: 'Sophie Leclerc',
        adresseIp: '192.168.1.92',
        typeAction: 'changement_statut_manuel',
        action: 'Prise en charge',
        detailAction: genererDetailAction('Prise en charge', 'changement_statut_manuel'),
      });
      break;

    case 'Approuvée': {
      // Cas spécial pour la facture 12 : passée par le parapheur
      if (facture.id === '12') {
        historique.push({
          dateHeure: `${dateJ1} 09:12:45`,
          utilisateur: 'Sophie Leclerc',
          adresseIp: '192.168.1.92',
          typeAction: 'changement_statut_manuel',
          action: 'Prise en charge',
          detailAction: genererDetailAction('Prise en charge', 'changement_statut_manuel'),
        });

        const dateJ2 = new Date(dateSuivante);
        dateJ2.setDate(dateJ2.getDate() + 1);
        const dateJ2Str = dateJ2.toISOString().split('T')[0];

        historique.push({
          dateHeure: `${dateJ1} 11:48:33`,
          utilisateur: 'Sophie Leclerc',
          adresseIp: '192.168.1.92',
          typeAction: 'statut_application',
          action: 'En attente de validation iXParapheur',
          detailAction: genererDetailAction('En attente de validation iXParapheur', 'statut_application'),
        });
        historique.push({
          dateHeure: `${dateJ2Str} 08:22:19`,
          utilisateur: 'Système',
          typeAction: 'statut_application',
          action: 'Facture validée dans iXParapheur',
          detailAction: genererDetailAction('Facture validée dans iXParapheur', 'statut_application'),
        });
        historique.push({
          dateHeure: `${dateJ2Str} 09:08:54`,
          utilisateur: 'Paul Rousseau',
          adresseIp: '192.168.1.103',
          typeAction: 'changement_statut_manuel',
          action: 'Approuvée',
          detailAction: genererDetailAction('Approuvée', 'changement_statut_manuel'),
        });
      } else {
        historique.push({
          dateHeure: `${dateJ1} 09:12:45`,
          utilisateur: 'Sophie Leclerc',
          adresseIp: '192.168.1.92',
          typeAction: 'changement_statut_manuel',
          action: 'Prise en charge',
          detailAction: genererDetailAction('Prise en charge', 'changement_statut_manuel'),
        });
        historique.push({
          dateHeure: `${dateJ1} 14:22:11`,
          utilisateur: 'Paul Rousseau',
          adresseIp: '192.168.1.103',
          typeAction: 'changement_statut_manuel',
          action: 'Approuvée',
          detailAction: genererDetailAction('Approuvée', 'changement_statut_manuel'),
        });
      }
      break;
    }

    case 'Approuvée partiellement':
      historique.push({
        dateHeure: `${dateJ1} 09:12:45`,
        utilisateur: 'Sophie Leclerc',
        adresseIp: '192.168.1.92',
        typeAction: 'changement_statut_manuel',
        action: 'Prise en charge',
        detailAction: genererDetailAction('Prise en charge', 'changement_statut_manuel'),
      });
      historique.push({
        dateHeure: `${dateJ1} 14:30:00`,
        utilisateur: 'Paul Rousseau',
        adresseIp: '192.168.1.103',
        typeAction: 'changement_statut_manuel',
        action: 'Approuvée partiellement',
        detailAction: genererDetailAction('Approuvée partiellement', 'changement_statut_manuel'),
      });
      break;

    case 'En litige':
      historique.push({
        dateHeure: `${dateJ1} 09:12:45`,
        utilisateur: 'Sophie Leclerc',
        adresseIp: '192.168.1.92',
        typeAction: 'changement_statut_manuel',
        action: 'Prise en charge',
        detailAction: genererDetailAction('Prise en charge', 'changement_statut_manuel'),
      });
      historique.push({
        dateHeure: `${dateJ1} 15:45:00`,
        utilisateur: 'Paul Rousseau',
        adresseIp: '192.168.1.103',
        typeAction: 'changement_statut_manuel',
        action: 'En litige',
        detailAction: genererDetailAction('En litige', 'changement_statut_manuel'),
      });
      break;

    case 'Suspendue':
      historique.push({
        dateHeure: `${dateJ1} 09:12:45`,
        utilisateur: 'Sophie Leclerc',
        adresseIp: '192.168.1.92',
        typeAction: 'changement_statut_manuel',
        action: 'Prise en charge',
        detailAction: genererDetailAction('Prise en charge', 'changement_statut_manuel'),
      });
      historique.push({
        dateHeure: `${dateJ1} 16:20:00`,
        utilisateur: 'Paul Rousseau',
        adresseIp: '192.168.1.103',
        typeAction: 'changement_statut_manuel',
        action: 'Suspendue',
        detailAction: genererDetailAction('Suspendue', 'changement_statut_manuel'),
      });
      break;

    case 'Refusée':
      historique.push({
        dateHeure: `${dateJ1} 09:12:45`,
        utilisateur: 'Sophie Leclerc',
        adresseIp: '192.168.1.92',
        typeAction: 'changement_statut_manuel',
        action: 'Prise en charge',
        detailAction: genererDetailAction('Prise en charge', 'changement_statut_manuel'),
      });
      historique.push({
        dateHeure: `${dateJ1} 16:50:00`,
        utilisateur: 'Paul Rousseau',
        adresseIp: '192.168.1.103',
        typeAction: 'changement_statut_manuel',
        action: 'Refusée',
        detailAction: genererDetailAction('Refusée', 'changement_statut_manuel'),
      });
      break;

    case 'Paiement transmis': {
      historique.push({
        dateHeure: `${dateJ1} 09:12:45`,
        utilisateur: 'Sophie Leclerc',
        adresseIp: '192.168.1.92',
        typeAction: 'changement_statut_manuel',
        action: 'Prise en charge',
        detailAction: genererDetailAction('Prise en charge', 'changement_statut_manuel'),
      });
      historique.push({
        dateHeure: `${dateJ1} 14:22:11`,
        utilisateur: 'Paul Rousseau',
        adresseIp: '192.168.1.103',
        typeAction: 'changement_statut_manuel',
        action: 'Approuvée',
        detailAction: genererDetailAction('Approuvée', 'changement_statut_manuel'),
      });

      const dateJ3 = new Date(dateSuivante);
      dateJ3.setDate(dateJ3.getDate() + 3);
      const dateJ3Str = dateJ3.toISOString().split('T')[0];

      historique.push({
        dateHeure: `${dateJ3Str} 10:15:42`,
        utilisateur: 'Système',
        typeAction: 'changement_statut_api',
        action: 'Paiement transmis',
        detailAction: genererDetailAction('Paiement transmis', 'changement_statut_api'),
      });
      break;
    }
  }

  return historique;
};

// Métadonnées fictives - Conformes au paramétrage dans MetadonneesIXFacture
// Pour les Factures Entrantes (FE = Factures d'Achat), seules les métadonnées avec visibiliteFE sont affichées
const metadonneesFictives: Metadonnee[] = [
  {
    id: '1',
    label: 'Commentaire interne',
    type: 'text',
    valeur: 'Facture conforme, validation en cours',
  },
  {
    id: '2',
    label: 'Date de validation',
    type: 'date',
    valeur: '2025-10-15',
  },
  {
    id: '3',
    label: 'Service payeur',
    type: 'text',
    valeur: 'DSI',
  },
];

// Fonction pour obtenir le numéro de règle de routage selon la nature
const obtenirNumeroRegle = (nature: NatureFacture): string => {
  switch (nature) {
    case 'Factures_ERP1':
      return '1';
    case 'Factures_ERP2':
      return '2';
    case 'Factures_General':
      return '3';
    default:
      return '-';
  }
};

// Fonction pour obtenir les statuts métiers disponibles selon le statut actuel
// Les statuts techniques (Reçue de la plateforme, Mise à disposition, Rejetée) ne sont pas dans la liste
// car ils ne peuvent pas être déclenchés par l'utilisateur
const obtenirStatutsDisponibles = (statutActuel: StatutFacture): StatutMetier[] => {
  switch (statutActuel) {
    case 'Reçue de la plateforme':
      // Statut technique, l'utilisateur ne peut rien faire
      return [];

    case 'Mise à disposition':
      // Depuis "Mise à disposition", mêmes règles que "Prise en charge" + possibilité de passer à "Prise en charge"
      return [
        'Prise en charge',
        'Approuvée',
        'Approuvée partiellement',
        'En litige',
        'Suspendue',
        'Refusée',
        'Paiement transmis',
      ];

    case 'Rejetée':
      // Statut technique définitif, l'utilisateur ne peut rien faire
      return [];

    case 'Prise en charge':
      // Depuis "Prise en charge", on peut : Approuver, Approuver partiellement, En litige, Suspendre, Refuser, Paiement transmis
      return [
        'Approuvée',
        'Approuvée partiellement',
        'En litige',
        'Suspendue',
        'Refusée',
        'Paiement transmis',
      ];

    case 'Approuvée':
      // Depuis "Approuvée", on ne peut plus utiliser Approuvée partiellement ou En litige
      // On peut : Paiement transmis, Refuser
      return ['Paiement transmis', 'Refusée'];

    case 'Approuvée partiellement':
      // Depuis "Approuvée partiellement", on peut : Approuver, En litige, Suspendre, Refuser
      return ['Approuvée', 'En litige', 'Suspendue', 'Refusée'];

    case 'En litige':
      // Depuis "En litige", on peut : Approuver, Approuver partiellement, Suspendre, Refuser
      return ['Approuvée', 'Approuvée partiellement', 'Suspendue', 'Refusée'];

    case 'Suspendue':
      // Depuis "Suspendue", on peut : Approuver, Approuver partiellement, En litige, Refuser
      return ['Approuvée', 'Approuvée partiellement', 'En litige', 'Refusée'];

    case 'Refusée':
      // Statut définitif, on ne peut plus rien faire
      return [];

    case 'Paiement transmis':
      // Statut final, on ne peut rien faire après
      return [];

    case 'En attente de validation iXParapheur':
      // En attente de validation dans le parapheur, l'utilisateur ne peut rien faire
      // C'est le parapheur qui va valider ou rejeter
      return [];

    case 'Validée dans iXParapheur':
      // Après validation dans le parapheur, on peut statuer comme depuis "Prise en charge"
      return [
        'Approuvée',
        'Approuvée partiellement',
        'En litige',
        'Suspendue',
        'Refusée',
        'Paiement transmis',
      ];

    default:
      return [];
  }
};

const FacturesAchatiXfacture = () => {
  // États pour les modales
  const [modaleRechercheOuverte, setModaleRechercheOuverte] = useState(false);
  const [modaleColonnesOuverte, setModaleColonnesOuverte] = useState(false);
  const [modaleDetailOuverte, setModaleDetailOuverte] = useState(false);

  // États pour les menus déroulants
  const [anchorStatuer, setAnchorStatuer] = useState<null | HTMLElement>(null);
  const [anchorExporter, setAnchorExporter] = useState<null | HTMLElement>(null);
  const [anchorTelecharger, setAnchorTelecharger] = useState<null | HTMLElement>(null);

  // États pour le tableau
  const [factures, setFactures] = useState<FactureAchat[]>(facturesAchatFictives);
  const [facturesSelectionnees, setFacturesSelectionnees] = useState<string[]>([]);
  const [colonnes, setColonnes] = useState<Colonne[]>(colonnesParDefaut);
  const [ordreTriColonne, setOrdreTriColonne] = useState<Colonne['id']>('numero');
  const [directionTri, setDirectionTri] = useState<'asc' | 'desc'>('asc');

  // États pour la facture sélectionnée
  const [factureSelectionnee, setFactureSelectionnee] = useState<FactureAchat | null>(null);
  const [metadonnees, setMetadonnees] = useState<Metadonnee[]>(metadonneesFictives);

  // États pour la recherche
  const [critereRecherche, setCritereRecherche] = useState({
    numero: '',
    fournisseur: '',
    dateDebut: '',
    dateFin: '',
  });

  // État pour la recherche rapide dans la barre d'actions
  const [rechercheRapide, setRechercheRapide] = useState('');

  // État pour l'onglet actif dans la modale de détail
  const [ongletActif, setOngletActif] = useState(0);

  // Handlers pour les menus déroulants
  const ouvrirMenuStatuer = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorStatuer(event.currentTarget);
  };

  const fermerMenuStatuer = () => {
    setAnchorStatuer(null);
  };

  // Obtenir les statuts communs disponibles pour toutes les factures sélectionnées
  const obtenirStatutsCommunsDisponibles = (): StatutMetier[] => {
    if (facturesSelectionnees.length === 0) {
      return [];
    }

    const facturesSelectionneesList = factures.filter((f) =>
      facturesSelectionnees.includes(f.id)
    );

    if (facturesSelectionneesList.length === 0) {
      return [];
    }

    // Obtenir les statuts disponibles pour la première facture
    const premiereFacture = facturesSelectionneesList[0];
    let statutsCommuns = obtenirStatutsDisponibles(premiereFacture.statut);

    // Trouver l'intersection avec les statuts disponibles des autres factures
    for (let i = 1; i < facturesSelectionneesList.length; i++) {
      const statutsDisponibles = obtenirStatutsDisponibles(
        facturesSelectionneesList[i].statut
      );
      statutsCommuns = statutsCommuns.filter((statut) =>
        statutsDisponibles.includes(statut)
      );
    }

    return statutsCommuns;
  };

  const changerStatut = (nouveauStatut: StatutMetier) => {
    facturesSelectionnees.forEach((id) => {
      setFactures((prev) =>
        prev.map((f) => (f.id === id ? { ...f, statut: nouveauStatut } : f))
      );
    });
    setFacturesSelectionnees([]);
    fermerMenuStatuer();
  };

  const ouvrirMenuExporter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorExporter(event.currentTarget);
  };

  const fermerMenuExporter = () => {
    setAnchorExporter(null);
  };

  const ouvrirMenuTelecharger = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorTelecharger(event.currentTarget);
  };

  const fermerMenuTelecharger = () => {
    setAnchorTelecharger(null);
  };

  // Handlers pour les modales
  const ouvrirModaleRecherche = () => setModaleRechercheOuverte(true);
  const fermerModaleRecherche = () => setModaleRechercheOuverte(false);

  const ouvrirModaleColonnes = () => setModaleColonnesOuverte(true);
  const fermerModaleColonnes = () => setModaleColonnesOuverte(false);

  const ouvrirModaleDetail = (facture: FactureAchat) => {
    setFactureSelectionnee(facture);
    setModaleDetailOuverte(true);
  };

  const fermerModaleDetail = () => {
    setModaleDetailOuverte(false);
    setFactureSelectionnee(null);
    setOngletActif(0); // Réinitialiser l'onglet actif
  };

  // Handler pour sélectionner/désélectionner une facture
  const toggleSelectionFacture = (id: string) => {
    if (facturesSelectionnees.includes(id)) {
      setFacturesSelectionnees(facturesSelectionnees.filter((fid) => fid !== id));
    } else {
      setFacturesSelectionnees([...facturesSelectionnees, id]);
    }
  };

  // Handler pour sélectionner/désélectionner toutes les factures
  const toggleSelectionTout = () => {
    if (facturesSelectionnees.length === factures.length) {
      setFacturesSelectionnees([]);
    } else {
      setFacturesSelectionnees(factures.map((f) => f.id));
    }
  };

  // Handler pour le tri
  const demanderTri = (colonne: Colonne['id']) => {
    const estAsc = ordreTriColonne === colonne && directionTri === 'asc';
    setDirectionTri(estAsc ? 'desc' : 'asc');
    setOrdreTriColonne(colonne);
  };

  // Fonction de tri des factures
  const facturesTriees = [...factures].sort((a, b) => {
    let valeurA: string | number | undefined, valeurB: string | number | undefined;

    switch (ordreTriColonne) {
      case 'vendeur':
        valeurA = a.vendeur?.nom;
        valeurB = b.vendeur?.nom;
        break;
      case 'montantTTC':
        valeurA = a.totaux?.montantTotalTTC;
        valeurB = b.totaux?.montantTotalTTC;
        break;
      case 'montantDu':
        valeurA = a.totaux?.montantDu;
        valeurB = b.totaux?.montantDu;
        break;
      case 'devise':
        valeurA = a.codeDevise;
        valeurB = b.codeDevise;
        break;
      case 'nombreLignes':
        valeurA = a.lignes?.length;
        valeurB = b.lignes?.length;
        break;
      case 'dateEmission':
        valeurA = a.dateEmission;
        valeurB = b.dateEmission;
        break;
      case 'dateReception':
        valeurA = a.dateReception;
        valeurB = b.dateReception;
        break;
      case 'typeDocument':
        valeurA = a.typeDocument;
        valeurB = b.typeDocument;
        break;
      case 'numero':
        valeurA = a.numero;
        valeurB = b.numero;
        break;
      case 'statut':
        valeurA = a.statut;
        valeurB = b.statut;
        break;
      case 'origine':
        valeurA = a.origine;
        valeurB = b.origine;
        break;
      case 'nature':
        valeurA = a.nature;
        valeurB = b.nature;
        break;
      default:
        valeurA = '';
        valeurB = '';
    }

    valeurA = valeurA ?? '';
    valeurB = valeurB ?? '';

    if (typeof valeurA === 'string' && typeof valeurB === 'string') {
      return directionTri === 'asc'
        ? valeurA.localeCompare(valeurB)
        : valeurB.localeCompare(valeurA);
    }

    if (typeof valeurA === 'number' && typeof valeurB === 'number') {
      return directionTri === 'asc'
        ? valeurA - valeurB
        : valeurB - valeurA;
    }

    return 0;
  });

  // Handler pour basculer la visibilité d'une colonne
  const toggleVisibiliteColonne = (colonneId: Colonne['id']) => {
    setColonnes(
      colonnes.map((col) =>
        col.id === colonneId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // Handler pour réinitialiser les filtres et colonnes
  const reinitialiser = () => {
    setColonnes(colonnesParDefaut);
    setFacturesSelectionnees([]);
    setCritereRecherche({
      numero: '',
      fournisseur: '',
      dateDebut: '',
      dateFin: '',
    });
  };

  // Handler pour appliquer la recherche
  const appliquerRecherche = () => {
    let resultats = [...facturesAchatFictives];

    if (critereRecherche.numero) {
      resultats = resultats.filter((f) =>
        f.numero.toLowerCase().includes(critereRecherche.numero.toLowerCase())
      );
    }

    if (critereRecherche.fournisseur) {
      resultats = resultats.filter((f) =>
        f.vendeur?.nom.toLowerCase().includes(critereRecherche.fournisseur.toLowerCase())
      );
    }

    if (critereRecherche.dateDebut) {
      const dateDebut = critereRecherche.dateDebut.replace(/-/g, '');
      resultats = resultats.filter((f) => f.dateReception && f.dateReception >= dateDebut);
    }

    if (critereRecherche.dateFin) {
      const dateFin = critereRecherche.dateFin.replace(/-/g, '');
      resultats = resultats.filter((f) => f.dateReception && f.dateReception <= dateFin);
    }

    setFactures(resultats);
    fermerModaleRecherche();
  };

  // Formater le montant en euros
  const formaterMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(montant);
  };

  // Formater une date YYYYMMDD en DD/MM/YYYY
  const formaterDateAffichage = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}/${dateStr.substring(0, 4)}`;
  };

  // Obtenir la couleur du chip de statut
  const obtenirCouleurStatut = (statut: StatutFacture): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (statut) {
      // Statuts techniques
      case 'Reçue de la plateforme':
        return 'info';
      case 'Mise à disposition':
        return 'primary';
      case 'Rejetée':
        return 'error';

      // Statuts métiers
      case 'Prise en charge':
        return 'info';
      case 'Approuvée':
        return 'success';
      case 'Approuvée partiellement':
        return 'success';
      case 'En litige':
        return 'warning';
      case 'Suspendue':
        return 'warning';
      case 'Refusée':
        return 'error';
      case 'Paiement transmis':
        return 'success';

      // Statuts applicatifs
      case 'En attente de validation iXParapheur':
        return 'secondary';
      case 'Validée dans iXParapheur':
        return 'success';

      default:
        return 'default';
    }
  };

  // Obtenir la couleur d'une action dans l'historique
  const obtenirCouleurAction = (action: string, typeAction: TypeAction): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    // Pour les statuts, utiliser la même couleur que dans le tableau
    if (typeAction === 'statut_technique' || typeAction === 'statut_metier' || typeAction === 'changement_statut_manuel' || typeAction === 'changement_statut_api' || typeAction === 'statut_application') {
      // Vérifier si l'action correspond à un statut connu
      const statutsPossibles: StatutFacture[] = [
        'Reçue de la plateforme',
        'Mise à disposition',
        'Rejetée',
        'Prise en charge',
        'Approuvée',
        'Approuvée partiellement',
        'En litige',
        'Suspendue',
        'Refusée',
        'Paiement transmis',
        'En attente de validation iXParapheur',
        'Validée dans iXParapheur',
      ];

      const statutTrouve = statutsPossibles.find(s => s === action);
      if (statutTrouve) {
        return obtenirCouleurStatut(statutTrouve);
      }
    }

    // Pour les autres actions (consultation, téléchargement, etc.)
    return 'default';
  };

  // Handler pour mettre à jour une métadonnée
  const mettreAJourMetadonnee = (id: string, nouvelleValeur: string) => {
    setMetadonnees((prev) =>
      prev.map((meta) => (meta.id === id ? { ...meta, valeur: nouvelleValeur } : meta))
    );
  };

  const contenu = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Barre d'actions supérieure */}
      <Paper
        elevation={1}
        sx={{
          borderRadius: 0,
          mt: 1,
        }}
      >
        <Toolbar
          sx={{
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Tooltip title="Changer le statut des factures sélectionnées">
            <span>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircleIcon />}
                onClick={ouvrirMenuStatuer}
                disabled={
                  facturesSelectionnees.length === 0 ||
                  obtenirStatutsCommunsDisponibles().length === 0
                }
              >
                Statuer
              </Button>
            </span>
          </Tooltip>
          <Menu
            anchorEl={anchorStatuer}
            open={Boolean(anchorStatuer)}
            onClose={fermerMenuStatuer}
          >
            {obtenirStatutsCommunsDisponibles().length === 0 ? (
              <MenuItem disabled>Aucun statut disponible</MenuItem>
            ) : (
              obtenirStatutsCommunsDisponibles().map((statut) => (
                <MenuItem key={statut} onClick={() => changerStatut(statut)}>
                  {statut}
                </MenuItem>
              ))
            )}
          </Menu>

          <Tooltip title="Rechercher des factures">
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={ouvrirModaleRecherche}
            >
              Rechercher
            </Button>
          </Tooltip>

          <Tooltip title="Exporter les factures">
            <Button
              variant="outlined"
              startIcon={<FileUploadIcon />}
              onClick={ouvrirMenuExporter}
            >
              Exporter
            </Button>
          </Tooltip>
          <Menu
            anchorEl={anchorExporter}
            open={Boolean(anchorExporter)}
            onClose={fermerMenuExporter}
          >
            <MenuItem onClick={fermerMenuExporter}>CSV</MenuItem>
            <MenuItem onClick={fermerMenuExporter}>Excel</MenuItem>
            <MenuItem onClick={fermerMenuExporter}>Mail</MenuItem>
          </Menu>

          <Tooltip title="Télécharger au format">
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={ouvrirMenuTelecharger}
            >
              Télécharger
            </Button>
          </Tooltip>
          <Menu
            anchorEl={anchorTelecharger}
            open={Boolean(anchorTelecharger)}
            onClose={fermerMenuTelecharger}
          >
            <MenuItem onClick={fermerMenuTelecharger}>UBL</MenuItem>
            <MenuItem onClick={fermerMenuTelecharger}>CII</MenuItem>
            <MenuItem onClick={fermerMenuTelecharger}>Factur-X</MenuItem>
            <MenuItem onClick={fermerMenuTelecharger}>PDF</MenuItem>
          </Menu>

          {/* Zone de recherche rapide */}
          <TextField
            placeholder="Rechercher..."
            variant="standard"
            size="small"
            value={rechercheRapide}
            onChange={(e) => setRechercheRapide(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: '200px' }}
          />

          <Tooltip title="Gérer les colonnes">
            <Button
              variant="outlined"
              startIcon={<ViewColumnIcon />}
              onClick={ouvrirModaleColonnes}
            >
              Colonnes
            </Button>
          </Tooltip>

          <Tooltip title="Réinitialiser les filtres et colonnes">
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={reinitialiser}
            >
              Réinitialiser
            </Button>
          </Tooltip>
        </Toolbar>
      </Paper>

      {/* Tableau des factures */}
      <Box sx={{ flexGrow: 1, mt: 1, overflow: 'auto' }}>
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      facturesSelectionnees.length > 0 &&
                      facturesSelectionnees.length < factures.length
                    }
                    checked={
                      factures.length > 0 &&
                      facturesSelectionnees.length === factures.length
                    }
                    onChange={toggleSelectionTout}
                  />
                </TableCell>
                {colonnes
                  .filter((col) => col.visible)
                  .map((col) => (
                    <TableCell key={col.id}>
                      {col.sortable ? (
                        <TableSortLabel
                          active={ordreTriColonne === col.id}
                          direction={ordreTriColonne === col.id ? directionTri : 'asc'}
                          onClick={() => demanderTri(col.id)}
                        >
                          {col.label}
                        </TableSortLabel>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {facturesTriees.map((facture) => (
                <TableRow
                  key={facture.id}
                  hover
                  selected={facturesSelectionnees.includes(facture.id)}
                  onClick={() => ouvrirModaleDetail(facture)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={facturesSelectionnees.includes(facture.id)}
                      onChange={() => toggleSelectionFacture(facture.id)}
                    />
                  </TableCell>
                  {colonnes
                    .filter((col) => col.visible)
                    .map((col) => (
                      <TableCell key={col.id}>
                        {(() => {
                          switch (col.id) {
                            case 'vendeur':
                              return facture.vendeur?.nom;
                            case 'montantTTC':
                              return formaterMontant(facture.totaux?.montantTotalTTC || 0);
                            case 'montantDu':
                              return formaterMontant(facture.totaux?.montantDu || 0);
                            case 'devise':
                              return facture.codeDevise;
                            case 'nombreLignes':
                              return facture.lignes?.length || 0;
                            case 'dateEmission':
                              return formaterDateAffichage(facture.dateEmission);
                            case 'dateReception':
                              return formaterDateAffichage(facture.dateReception);
                            case 'typeDocument':
                              return TYPE_DOCUMENT_LABELS[facture.typeDocument] || facture.typeDocument;
                            case 'statut':
                              return (
                                <Chip
                                  label={facture.statut}
                                  color={obtenirCouleurStatut(facture.statut)}
                                  size="small"
                                />
                              );
                            case 'origine':
                              return facture.origine;
                            case 'nature':
                              return facture.nature;
                            case 'numero':
                              return facture.numero;
                            default:
                              return '';
                          }
                        })()}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modale de détail de facture */}
      <Dialog
        open={modaleDetailOuverte}
        onClose={fermerModaleDetail}
        maxWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            width: '95vw',
            height: '95vh',
            maxWidth: '95vw',
            maxHeight: '95vh',
          },
        }}
      >
        <DialogTitle>
          Détail de la facture {factureSelectionnee?.numero}
          <Chip
            label={factureSelectionnee?.statut}
            color={obtenirCouleurStatut(factureSelectionnee?.statut || 'Reçue de la plateforme')}
            size="small"
            sx={{ ml: 2 }}
          />
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', height: 'calc(95vh - 140px)' }}>
          {/* Partie gauche - 2/3 avec onglets */}
          <Box sx={{ flex: '0 0 66.666%', display: 'flex', flexDirection: 'column', borderRight: 1, borderColor: 'divider' }}>
            <Tabs
              value={ongletActif}
              onChange={(_, newValue) => setOngletActif(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="Vue métier" />
              <Tab label="Vue lisible" />
              <Tab label="Informations" />
            </Tabs>

            {/* Contenu des onglets */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              {/* Onglet Vue métier */}
              {ongletActif === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Informations du fournisseur */}
                  <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Informations du fournisseur
                    </Typography>
                    <Box sx={{ display: 'grid', mb:2, gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Nom (BT-27)</Typography>
                        <Typography variant="body2">{factureSelectionnee?.vendeur?.nom || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">SIRET (BT-29)</Typography>
                        <Typography variant="body2">{factureSelectionnee?.vendeur?.siret || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">N° TVA (BT-31)</Typography>
                        <Typography variant="body2">{factureSelectionnee?.vendeur?.numeroTVA || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Adresse (BT-35)</Typography>
                        <Typography variant="body2">
                          {factureSelectionnee?.vendeur?.adressePostale?.ligne1 || ''}<br />
                          {factureSelectionnee?.vendeur?.adressePostale?.codePostal || ''} {factureSelectionnee?.vendeur?.adressePostale?.ville || ''}
                        </Typography>
                      </Box>
                    </Box>


                  {/* Informations générales de la facture */}

                    <Typography variant="h6" gutterBottom>
                      Informations de la facture
                    </Typography>
                    <Box sx={{ display: 'grid',mb:2, gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Numéro (BT-1)</Typography>
                        <Typography variant="body2">{factureSelectionnee?.numero || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Date émission (BT-2)</Typography>
                        <Typography variant="body2">{formaterDateAffichage(factureSelectionnee?.dateEmission)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Type document (BT-3)</Typography>
                        <Typography variant="body2">
                          {factureSelectionnee?.typeDocument ? TYPE_DOCUMENT_LABELS[factureSelectionnee.typeDocument] : '-'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Devise (BT-5)</Typography>
                        <Typography variant="body2">{factureSelectionnee?.codeDevise || '-'}</Typography>
                      </Box>
                    </Box>


                  {/* Lignes de facturation */}
                  {factureSelectionnee?.lignes && factureSelectionnee.lignes.length > 0 && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Lignes de facturation ({factureSelectionnee.lignes.length})
                      </Typography>
                      
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Description</TableCell>
                              <TableCell align="right">Quantité</TableCell>
                              <TableCell align="right">Prix unit.</TableCell>
                              <TableCell align="right">TVA</TableCell>
                              <TableCell align="right">Montant</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {factureSelectionnee.lignes.map((ligne) => (
                              <TableRow key={ligne.numeroLigne}>
                                <TableCell>{ligne.article.nom}</TableCell>
                                <TableCell align="right">{ligne.quantite}</TableCell>
                                <TableCell align="right">{formaterMontant(ligne.prixUnitaireNet)}</TableCell>
                                <TableCell align="right">{ligne.informationTVA.taux}%</TableCell>
                                <TableCell align="right">{formaterMontant(ligne.montantNet)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      <Box sx={{ display: 'flex', mt: 2, flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>Total HT</Typography>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee.totaux?.montantTotalHT || 0)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography>Total TVA</Typography>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee.totaux?.montantTotalTVA || 0)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">Total TTC</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee.totaux?.montantTotalTTC || 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                  </Paper>
                </Box>
              )}

              {/* Onglet Vue lisible */}
              {ongletActif === 1 && (
                <Box>
                  <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                    {/* En-tête de la facture */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, pb: 3, borderBottom: 2, borderColor: 'primary.main' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                          FACTURE
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {TYPE_DOCUMENT_LABELS[factureSelectionnee?.typeDocument || '380']}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {factureSelectionnee?.numero}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date : {formaterDateAffichage(factureSelectionnee?.dateEmission)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Informations vendeur et acheteur */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mb: 4 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                          Fournisseur
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {factureSelectionnee?.vendeur?.nom}
                        </Typography>
                        <Typography variant="body2">
                          {factureSelectionnee?.vendeur?.adressePostale?.ligne1}
                        </Typography>
                        <Typography variant="body2">
                          {factureSelectionnee?.vendeur?.adressePostale?.codePostal} {factureSelectionnee?.vendeur?.adressePostale?.ville}
                        </Typography>
                        {factureSelectionnee?.vendeur?.siret && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            SIRET : {factureSelectionnee.vendeur.siret}
                          </Typography>
                        )}
                        {factureSelectionnee?.vendeur?.numeroTVA && (
                          <Typography variant="body2">
                            N° TVA : {factureSelectionnee.vendeur.numeroTVA}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                          Client
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {factureSelectionnee?.acheteur?.nom}
                        </Typography>
                        <Typography variant="body2">
                          {factureSelectionnee?.acheteur?.adressePostale?.ligne1}
                        </Typography>
                        <Typography variant="body2">
                          {factureSelectionnee?.acheteur?.adressePostale?.codePostal} {factureSelectionnee?.acheteur?.adressePostale?.ville}
                        </Typography>
                        {factureSelectionnee?.acheteur?.siret && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            SIRET : {factureSelectionnee.acheteur.siret}
                          </Typography>
                        )}
                        {factureSelectionnee?.acheteur?.numeroTVA && (
                          <Typography variant="body2">
                            N° TVA : {factureSelectionnee.acheteur.numeroTVA}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Lignes de la facture */}
                    <TableContainer sx={{ mb: 3 }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Qté</TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Prix unit.</TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>TVA</TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Montant HT</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {factureSelectionnee?.lignes?.map((ligne) => (
                            <TableRow key={ligne.numeroLigne}>
                              <TableCell>{ligne.article.nom}</TableCell>
                              <TableCell align="right">{ligne.quantite}</TableCell>
                              <TableCell align="right">{formaterMontant(ligne.prixUnitaireNet)}</TableCell>
                              <TableCell align="right">{ligne.informationTVA.taux}%</TableCell>
                              <TableCell align="right">{formaterMontant(ligne.montantNet)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Pied de facture avec totaux */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Box sx={{ minWidth: 300 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Total HT :</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee?.totaux?.montantTotalHT || 0)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Total TVA :</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee?.totaux?.montantTotalTVA || 0)}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'primary.light', p: 1, borderRadius: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total TTC :</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee?.totaux?.montantTotalTTC || 0)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Montant dû :</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {formaterMontant(factureSelectionnee?.totaux?.montantDu || 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Note de bas de page */}
                    <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" align="center" display="block">
                        Facture conforme à la norme EN16931 - Identifiant : {factureSelectionnee?.identifiantSpecification}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              )}

              {/* Onglet Informations */}
              {ongletActif === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Origine de la facture */}
                  <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Origine de la facture
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Cette facture provient de :
                      </Typography>
                      <Chip
                        label={factureSelectionnee?.origine === 'PA' ? 'Plateforme Agréée (PA)' : 'Canal tiers (Hors PA)'}
                        color={factureSelectionnee?.origine === 'PA' ? 'primary' : 'default'}
                        size="medium"
                        variant="outlined"
                      />
                    </Box>
                    {factureSelectionnee?.origine === 'Hors PA' && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        Cette facture a été réceptionnée par un canal tiers (courrier papier, mail, API) et non via une plateforme agréée. Elle ne fera donc pas l'objet de mise à jour de statuts sur la plateforme agréée.
                      </Alert>
                    )}
                  </Paper>

                  {/* Nature de la facture */}
                  <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Nature de la facture
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Cette facture a été routée vers la nature :
                      </Typography>
                      <Chip
                        label={factureSelectionnee?.nature}
                        color="secondary"
                        size="medium"
                      />
                    </Box>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Le routage vers cette nature a été effectué automatiquement par la Règle #{factureSelectionnee?.nature ? obtenirNumeroRegle(factureSelectionnee.nature) : '-'}, configurée par un administrateur.
                    </Alert>
                  </Paper>

                  {/* Historique de la facture */}
                  <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Historique de la facture
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date et heure</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Utilisateur</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Détail de l'action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {factureSelectionnee && genererHistoriqueFacture(factureSelectionnee).map((evenement, index) => (
                            <TableRow key={index} hover>
                              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                {evenement.dateHeure}
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {evenement.utilisateur}
                                  </Typography>
                                  {evenement.adresseIp && (
                                    <Typography variant="caption" color="text.secondary">
                                      IP : {evenement.adresseIp}
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={evenement.action}
                                  size="small"
                                  color={obtenirCouleurAction(evenement.action, evenement.typeAction)}
                                  variant={
                                    evenement.typeAction === 'consultation' ||
                                    evenement.typeAction === 'telechargement' ||
                                    evenement.typeAction === 'exportation' ||
                                    evenement.typeAction === 'metadonnee' ? 'outlined' : 'filled'
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {evenement.detailAction}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>
              )}
            </Box>
          </Box>

          {/* Partie droite - 1/3 */}
          <Box sx={{ flex: '0 0 33.333%', display: 'flex', flexDirection: 'column', overflow: 'auto', p: 3, gap: 3 }}>
            {/* Pièces jointes */}
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pièces jointes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                Pas de pièces jointes
              </Typography>
            </Paper>

            {/* Métadonnées */}
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Métadonnées supplémentaires
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {metadonnees.map((meta) => (
                  <Box key={meta.id}>
                    {meta.type === 'select' ? (
                      <TextField
                        select
                        label={meta.label}
                        value={meta.valeur}
                        onChange={(e) => mettreAJourMetadonnee(meta.id, e.target.value)}
                        fullWidth
                        size="small"
                      >
                        {meta.options?.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : meta.label === 'Commentaire interne' ? (
                      <TextField
                        label={meta.label}
                        type={meta.type}
                        value={meta.valeur}
                        onChange={(e) => mettreAJourMetadonnee(meta.id, e.target.value)}
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        InputLabelProps={meta.type === 'date' ? { shrink: true } : undefined}
                      />
                    ) : (
                      <TextField
                        label={meta.label}
                        type={meta.type}
                        value={meta.valeur}
                        onChange={(e) => mettreAJourMetadonnee(meta.id, e.target.value)}
                        fullWidth
                        size="small"
                        InputLabelProps={meta.type === 'date' ? { shrink: true } : undefined}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fermerModaleDetail}>Fermer</Button>
          <Button variant="contained" onClick={fermerModaleDetail}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modale de recherche */}
      <Dialog
        open={modaleRechercheOuverte}
        onClose={fermerModaleRecherche}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rechercher des factures</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Numéro de facture"
              value={critereRecherche.numero}
              onChange={(e) =>
                setCritereRecherche({ ...critereRecherche, numero: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Fournisseur"
              value={critereRecherche.fournisseur}
              onChange={(e) =>
                setCritereRecherche({ ...critereRecherche, fournisseur: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Date de début"
              type="date"
              value={critereRecherche.dateDebut}
              onChange={(e) =>
                setCritereRecherche({ ...critereRecherche, dateDebut: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Date de fin"
              type="date"
              value={critereRecherche.dateFin}
              onChange={(e) =>
                setCritereRecherche({ ...critereRecherche, dateFin: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Button
              startIcon={<ClearIcon />}
              onClick={() =>
                setCritereRecherche({
                  numero: '',
                  fournisseur: '',
                  dateDebut: '',
                  dateFin: '',
                })
              }
            >
              Effacer les critères
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fermerModaleRecherche}>Annuler</Button>
          <Button onClick={appliquerRecherche} variant="contained">
            Rechercher
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modale de gestion des colonnes */}
      <Dialog
        open={modaleColonnesOuverte}
        onClose={fermerModaleColonnes}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Gérer les colonnes</DialogTitle>
        <DialogContent>
          <FormGroup>
            {colonnes.map((col) => (
              <FormControlLabel
                key={col.id}
                control={
                  <Checkbox
                    checked={col.visible}
                    onChange={() => toggleVisibiliteColonne(col.id)}
                  />
                }
                label={col.label}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={fermerModaleColonnes}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return (
    <UtilisateurIxBus
      titre="Factures d'achat iXFacture"
      sousTitre="Validation et gestion des factures fournisseurs"
    >
      {contenu}
    </UtilisateurIxBus>
  );
};

export default FacturesAchatiXfacture;

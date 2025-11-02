/**
 * Données d'exemple réalistes pour les factures électroniques
 * conformes à la norme EN16931 et aux règles françaises
 */

import type {
  FactureElectronique,
  Partie,
  LigneFacture,
  Note,
} from '../types/factureEN16931';
import { formaterDateFacture } from './validationFacture';

// ============================================================================
// PARTIES PRÉDÉFINIES
// ============================================================================

/**
 * Exemple de vendeur (entreprise française)
 */
export const VENDEUR_EXEMPLE: Partie = {
  nom: 'SARL TECH SOLUTIONS',
  siret: '12345678901234',
  numeroTVA: 'FR12345678901',
  adressePostale: {
    ligne1: '123 Avenue de la République',
    ligne2: 'Bâtiment A',
    ville: 'Lyon',
    codePostal: '69003',
    subdivisionPays: 'Rhône',
    codePays: 'FR'
  },
  organisationLegale: {
    siren: '123456789',
    nom: 'SARL TECH SOLUTIONS',
    formeJuridique: 'SARL'
  },
  contact: {
    nom: 'Service Facturation',
    telephone: '+33 4 78 12 34 56',
    email: 'facturation@tech-solutions.fr'
  },
  adresseElectronique: {
    identifiant: '123456789:FACTURE',
    schemaIdentifiant: '0225' // Identifiant de routage français
  }
};

/**
 * Exemple d'acheteur (entreprise française)
 */
export const ACHETEUR_EXEMPLE: Partie = {
  nom: 'ACME SERVICES SAS',
  siret: '98765432109876',
  numeroTVA: 'FR98987654321',
  adressePostale: {
    ligne1: '456 Rue du Commerce',
    ville: 'Paris',
    codePostal: '75008',
    subdivisionPays: 'Paris',
    codePays: 'FR'
  },
  organisationLegale: {
    siren: '987654321',
    nom: 'ACME SERVICES SAS',
    formeJuridique: 'SAS'
  },
  contact: {
    nom: 'Comptabilité Fournisseurs',
    telephone: '+33 1 42 12 34 56',
    email: 'compta@acme-services.fr'
  },
  adresseElectronique: {
    identifiant: '987654321:RECEPTION',
    schemaIdentifiant: '0225'
  }
};

/**
 * Exemple d'acheteur particulier (B2C)
 */
export const PARTICULIER_EXEMPLE: Partie = {
  nom: 'Martin Dupont',
  adressePostale: {
    ligne1: '12 Rue des Fleurs',
    ville: 'Toulouse',
    codePostal: '31000',
    codePays: 'FR'
  },
  contact: {
    email: 'martin.dupont@example.com',
    telephone: '+33 6 12 34 56 78'
  }
};

// ============================================================================
// NOTES LÉGALES OBLIGATOIRES EN FRANCE
// ============================================================================

/**
 * Mentions légales obligatoires pour une facture française (BR-FR-05)
 */
export const NOTES_LEGALES_FRANCE: Note[] = [
  {
    codeSujet: 'PMT',
    contenu: 'Indemnité forfaitaire pour frais de recouvrement en cas de retard de paiement : 40 EUR (Article L441-6 du Code de commerce).'
  },
  {
    codeSujet: 'PMD',
    contenu: 'Pénalité de retard applicable : trois fois le taux d\'intérêt légal. Taux de pénalité : 9,27 % par an (Article L441-6 du Code de commerce).'
  },
  {
    codeSujet: 'AAB',
    contenu: 'Pas d\'escompte en cas de paiement anticipé.'
  }
];

/**
 * Note de traitement B2B
 */
export const NOTE_TRAITEMENT_B2B: Note = {
  codeSujet: 'BAR',
  contenu: 'B2B' // Facture entre entreprises
};

/**
 * Note de traitement B2C
 */
export const NOTE_TRAITEMENT_B2C: Note = {
  codeSujet: 'BAR',
  contenu: 'B2C' // Facture vers particulier
};

// ============================================================================
// LIGNES DE FACTURE TYPES
// ============================================================================

/**
 * Ligne de facture : Prestation de service
 */
export const LIGNE_PRESTATION_SERVICE: LigneFacture = {
  numeroLigne: 1,
  article: {
    nom: 'Développement application web',
    description: 'Développement d\'une application web sur mesure, incluant l\'analyse des besoins, la conception, le développement et les tests.',
    identifiantVendeur: 'DEV-WEB-001'
  },
  quantite: 40,
  uniteMesure: 'HUR', // Heures
  prixUnitaireNet: 85.00,
  prixUnitaireBrut: 85.00,
  montantNet: 3400.00,
  informationTVA: {
    codeCategorie: 'S',
    taux: 20.00
  },
  referenceCommande: 'CMD-2024-001'
};

/**
 * Ligne de facture : Produit matériel
 */
export const LIGNE_PRODUIT_MATERIEL: LigneFacture = {
  numeroLigne: 2,
  article: {
    nom: 'Ordinateur portable professionnel',
    description: 'HP EliteBook 840 G9, Intel Core i7, 16 Go RAM, 512 Go SSD',
    identifiantVendeur: 'MAT-PC-HP840',
    identifiantStandard: '0192018761892',
    schemaIdentifiantStandard: 'GTIN' // Code-barres EAN
  },
  quantite: 2,
  uniteMesure: 'C62', // Unité (pièce)
  prixUnitaireNet: 1200.00,
  prixUnitaireBrut: 1350.00,
  montantNet: 2400.00,
  informationTVA: {
    codeCategorie: 'S',
    taux: 20.00
  },
  remises: [
    {
      montant: 300.00,
      pourcentage: 11.11,
      raison: 'Remise volume (achat de 2 unités)',
      informationTVA: {
        codeCategorie: 'S',
        taux: 20.00
      }
    }
  ]
};

/**
 * Ligne de facture : Licence logicielle (TVA réduite)
 */
export const LIGNE_LICENCE_LOGICIELLE: LigneFacture = {
  numeroLigne: 3,
  article: {
    nom: 'Licence logicielle annuelle',
    description: 'Suite bureautique professionnelle - Licence 1 an',
    identifiantVendeur: 'LIC-OFFICE-PRO'
  },
  quantite: 10,
  uniteMesure: 'C62',
  prixUnitaireNet: 89.90,
  prixUnitaireBrut: 99.00,
  montantNet: 899.00,
  informationTVA: {
    codeCategorie: 'S',
    taux: 20.00
  },
  periodeDateDebut: formaterDateFacture(new Date(2025, 0, 1)), // 1er janvier 2025
  periodeDateFin: formaterDateFacture(new Date(2025, 11, 31))  // 31 décembre 2025
};

/**
 * Ligne de facture : Formation (TVA exonérée)
 */
export const LIGNE_FORMATION: LigneFacture = {
  numeroLigne: 4,
  article: {
    nom: 'Formation développement web',
    description: 'Formation professionnelle : Développement web moderne avec React et TypeScript - 3 jours',
    identifiantVendeur: 'FORM-DEV-WEB'
  },
  quantite: 3,
  uniteMesure: 'DAY', // Jours
  prixUnitaireNet: 650.00,
  prixUnitaireBrut: 650.00,
  montantNet: 1950.00,
  informationTVA: {
    codeCategorie: 'E',
    raisonExoneration: 'Formation professionnelle exonérée de TVA (Article 261.4.4° du CGI)',
    codeRaisonExoneration: 'VATEX-FR-FORMATION'
  },
  periodeDateDebut: formaterDateFacture(new Date(2025, 2, 10)), // 10 mars 2025
  periodeDateFin: formaterDateFacture(new Date(2025, 2, 12))    // 12 mars 2025
};

/**
 * Ligne de facture : Livre (TVA réduite 5,5%)
 */
export const LIGNE_LIVRE: LigneFacture = {
  numeroLigne: 5,
  article: {
    nom: 'Manuel technique JavaScript',
    description: 'JavaScript : Le guide complet - Édition 2025',
    identifiantVendeur: 'LIV-JS-2025',
    identifiantStandard: '9782123456789',
    schemaIdentifiantStandard: 'ISBN'
  },
  quantite: 5,
  uniteMesure: 'C62',
  prixUnitaireNet: 45.00,
  prixUnitaireBrut: 45.00,
  montantNet: 225.00,
  informationTVA: {
    codeCategorie: 'S',
    taux: 5.5 // TVA réduite pour les livres
  }
};

// ============================================================================
// FACTURES COMPLÈTES D'EXEMPLE
// ============================================================================

/**
 * Facture B2B standard avec plusieurs lignes
 */
export const FACTURE_B2B_STANDARD: FactureElectronique = {
  identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  modeFacturation: 'B1',

  numero: 'FACT-2025-0042',
  dateEmission: formaterDateFacture(new Date(2025, 0, 15)), // 15 janvier 2025
  typeDocument: '380', // Facture commerciale
  codeDevise: 'EUR',
  dateFaitGenerateur: formaterDateFacture(new Date(2025, 0, 15)),

  vendeur: VENDEUR_EXEMPLE,
  acheteur: ACHETEUR_EXEMPLE,

  referenceCommande: 'CMD-2024-001',
  referenceProjet: 'PROJET-DIGITAL-2025',

  notes: [
    ...NOTES_LEGALES_FRANCE,
    NOTE_TRAITEMENT_B2B,
    {
      contenu: 'Merci de nous faire parvenir le paiement dans les 30 jours suivant la date de facturation.'
    }
  ],

  informationPaiement: {
    moyenPaiement: '30', // Virement
    conditionsPaiement: 'Paiement à 30 jours fin de mois',
    dateEcheance: formaterDateFacture(new Date(2025, 1, 28)), // 28 février 2025
    compteBancaire: {
      iban: 'FR76 1234 5678 9012 3456 7890 123',
      bic: 'BANKFRPPXXX',
      nomBanque: 'Banque Exemple France',
      numeroCompte: 'FR76123456789012345678901 23'
    },
    referencePaiement: 'FACT-2025-0042'
  },

  lignes: [
    LIGNE_PRESTATION_SERVICE,
    LIGNE_PRODUIT_MATERIEL,
    LIGNE_LICENCE_LOGICIELLE
  ],

  totaux: {
    sommeMontsNetsLignes: 6699.00, // 3400 + 2400 + 899
    montantTotalHT: 6699.00,
    montantTotalTVA: 1339.80, // 6699 * 0.20
    montantTotalTTC: 8038.80,
    montantDu: 8038.80,
    detailsTVA: [
      {
        codeCategorie: 'S',
        taux: 20.00,
        montantBase: 6699.00,
        montantTVA: 1339.80
      }
    ]
  }
};

/**
 * Facture avec TVA mixte (plusieurs taux)
 */
export const FACTURE_TVA_MIXTE: FactureElectronique = {
  identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  modeFacturation: 'B1',

  numero: 'FACT-2025-0043',
  dateEmission: formaterDateFacture(new Date(2025, 0, 20)),
  typeDocument: '380',
  codeDevise: 'EUR',

  vendeur: VENDEUR_EXEMPLE,
  acheteur: ACHETEUR_EXEMPLE,

  notes: [
    ...NOTES_LEGALES_FRANCE,
    NOTE_TRAITEMENT_B2B
  ],

  informationPaiement: {
    moyenPaiement: '30',
    conditionsPaiement: 'Paiement à réception',
    dateEcheance: formaterDateFacture(new Date(2025, 0, 30)),
    compteBancaire: {
      iban: 'FR76 1234 5678 9012 3456 7890 123',
      bic: 'BANKFRPPXXX',
      nomBanque: 'Banque Exemple France'
    }
  },

  lignes: [
    LIGNE_PRODUIT_MATERIEL,    // TVA 20%
    LIGNE_FORMATION,           // Exonéré
    LIGNE_LIVRE                // TVA 5,5%
  ],

  totaux: {
    sommeMontsNetsLignes: 4575.00, // 2400 + 1950 + 225
    montantTotalHT: 4575.00,
    montantTotalTVA: 492.38, // (2400 * 0.20) + (225 * 0.055) = 480 + 12.38
    montantTotalTTC: 5067.38,
    montantDu: 5067.38,
    detailsTVA: [
      {
        codeCategorie: 'S',
        taux: 20.00,
        montantBase: 2400.00,
        montantTVA: 480.00
      },
      {
        codeCategorie: 'E',
        montantBase: 1950.00,
        montantTVA: 0.00,
        raisonExoneration: 'Formation professionnelle exonérée de TVA (Article 261.4.4° du CGI)'
      },
      {
        codeCategorie: 'S',
        taux: 5.5,
        montantBase: 225.00,
        montantTVA: 12.38
      }
    ]
  }
};

/**
 * Facture d'acompte
 */
export const FACTURE_ACOMPTE: FactureElectronique = {
  identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  modeFacturation: 'B1',

  numero: 'FACT-ACOMPTE-2025-0001',
  dateEmission: formaterDateFacture(new Date(2025, 0, 10)),
  typeDocument: '386', // Facture d'acompte
  codeDevise: 'EUR',

  vendeur: VENDEUR_EXEMPLE,
  acheteur: ACHETEUR_EXEMPLE,

  referenceCommande: 'CMD-2025-010',
  referenceProjet: 'PROJET-DIGITAL-2025',

  notes: [
    ...NOTES_LEGALES_FRANCE,
    NOTE_TRAITEMENT_B2B,
    {
      contenu: 'Acompte de 30% sur le projet de développement - Total projet : 15 000 € HT'
    }
  ],

  informationPaiement: {
    moyenPaiement: '30',
    conditionsPaiement: 'Acompte à la commande',
    dateEcheance: formaterDateFacture(new Date(2025, 0, 20)),
    compteBancaire: {
      iban: 'FR76 1234 5678 9012 3456 7890 123',
      bic: 'BANKFRPPXXX',
      nomBanque: 'Banque Exemple France'
    }
  },

  lignes: [
    {
      numeroLigne: 1,
      article: {
        nom: 'Acompte sur développement application',
        description: 'Acompte de 30% sur projet de développement d\'application web personnalisée',
        identifiantVendeur: 'ACOMPTE-PROJET-2025'
      },
      quantite: 1,
      uniteMesure: 'C62',
      prixUnitaireNet: 4500.00,
      prixUnitaireBrut: 4500.00,
      montantNet: 4500.00,
      informationTVA: {
        codeCategorie: 'S',
        taux: 20.00
      }
    }
  ],

  totaux: {
    sommeMontsNetsLignes: 4500.00,
    montantTotalHT: 4500.00,
    montantTotalTVA: 900.00,
    montantTotalTTC: 5400.00,
    montantDu: 5400.00,
    detailsTVA: [
      {
        codeCategorie: 'S',
        taux: 20.00,
        montantBase: 4500.00,
        montantTVA: 900.00
      }
    ]
  }
};

/**
 * Avoir (facture de crédit)
 */
export const AVOIR_EXEMPLE: FactureElectronique = {
  identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  modeFacturation: 'B1',

  numero: 'AV-2025-0005',
  dateEmission: formaterDateFacture(new Date(2025, 0, 25)),
  typeDocument: '381', // Avoir
  codeDevise: 'EUR',

  vendeur: VENDEUR_EXEMPLE,
  acheteur: ACHETEUR_EXEMPLE,

  facturesPrecedentes: [
    {
      numero: 'FACT-2025-0042',
      dateEmission: formaterDateFacture(new Date(2025, 0, 15)),
      typeDocument: '380'
    }
  ],

  notes: [
    ...NOTES_LEGALES_FRANCE,
    NOTE_TRAITEMENT_B2B,
    {
      contenu: 'Avoir pour retour produit défectueux - Facture originale : FACT-2025-0042'
    }
  ],

  informationPaiement: {
    moyenPaiement: '30',
    conditionsPaiement: 'Avoir compensé sur prochaine facture'
  },

  lignes: [
    {
      ...LIGNE_PRODUIT_MATERIEL,
      quantite: 1, // Retour d'une seule unité
      montantNet: 1200.00
    }
  ],

  totaux: {
    sommeMontsNetsLignes: -1200.00, // Montant négatif pour un avoir
    montantTotalHT: -1200.00,
    montantTotalTVA: -240.00,
    montantTotalTTC: -1440.00,
    montantDu: -1440.00,
    detailsTVA: [
      {
        codeCategorie: 'S',
        taux: 20.00,
        montantBase: -1200.00,
        montantTVA: -240.00
      }
    ]
  }
};

/**
 * Facture B2C (vers un particulier)
 */
export const FACTURE_B2C_EXEMPLE: FactureElectronique = {
  identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
  modeFacturation: 'S1', // Facture simplifiée

  numero: 'FACT-B2C-2025-0120',
  dateEmission: formaterDateFacture(new Date(2025, 1, 5)),
  typeDocument: '380',
  codeDevise: 'EUR',

  vendeur: VENDEUR_EXEMPLE,
  acheteur: PARTICULIER_EXEMPLE,

  notes: [
    {
      codeSujet: 'PMT',
      contenu: 'Indemnité forfaitaire pour frais de recouvrement : 40 EUR.'
    },
    {
      codeSujet: 'PMD',
      contenu: 'Pénalité de retard : 9,27 % par an.'
    },
    {
      codeSujet: 'AAB',
      contenu: 'Pas d\'escompte.'
    },
    NOTE_TRAITEMENT_B2C
  ],

  informationPaiement: {
    moyenPaiement: '48', // Carte bancaire
    conditionsPaiement: 'Payée à la commande',
    cartePaiement: {
      numeroCarte: '5123**********56', // Masqué
      titulaire: 'MARTIN DUPONT'
    }
  },

  lignes: [
    {
      numeroLigne: 1,
      article: {
        nom: 'Réparation ordinateur',
        description: 'Diagnostic et réparation : remplacement disque dur défectueux + main d\'œuvre',
        identifiantVendeur: 'REP-PC-001'
      },
      quantite: 1,
      uniteMesure: 'C62',
      prixUnitaireNet: 180.00,
      prixUnitaireBrut: 180.00,
      montantNet: 180.00,
      informationTVA: {
        codeCategorie: 'S',
        taux: 20.00
      }
    }
  ],

  totaux: {
    sommeMontsNetsLignes: 180.00,
    montantTotalHT: 180.00,
    montantTotalTVA: 36.00,
    montantTotalTTC: 216.00,
    montantPaye: 216.00, // Déjà payé
    montantDu: 0.00,
    detailsTVA: [
      {
        codeCategorie: 'S',
        taux: 20.00,
        montantBase: 180.00,
        montantTVA: 36.00
      }
    ]
  }
};

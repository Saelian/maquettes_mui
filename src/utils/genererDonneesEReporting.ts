/**
 * Générateur de données fictives pour l'e-reporting
 */

import type {
  FluxEReporting,
  TypeFlux,
  DonneesRacineFlux,
  TransmissionTransactions,
  TransmissionPaiements,
  FactureB2B,
  FactureAvecPaiement,
  Paiement,
  RepartitionParTaux,
  MontantsTotaux,
  TransactionsB2C,
  TransactionsAvecPaiement,
} from '../types/ereporting';

/**
 * Génère une date au format AAAAMMJJ
 */
function genererDateAAJJ(date: Date): string {
  const annee = date.getFullYear().toString();
  const mois = (date.getMonth() + 1).toString().padStart(2, '0');
  const jour = date.getDate().toString().padStart(2, '0');
  return `${annee}${mois}${jour}`;
}

/**
 * Génère un horodatage au format AAAAMMJJHHMMSS
 */
function genererHorodatage(date: Date): string {
  const dateStr = genererDateAAJJ(date);
  const heures = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const secondes = date.getSeconds().toString().padStart(2, '0');
  return `${dateStr}${heures}${minutes}${secondes}`;
}

/**
 * Génère un SIREN fictif
 */
function genererSiren(): string {
  return "123456789";
}

/**
 * Génère des données racine communes à tous les flux
 */
function genererDonneesRacine(
  typeFlux: TypeFlux,
  index: number,
  date: Date,
  estDeclarationNonInitiale: boolean = false
): DonneesRacineFlux {
  // Majoritairement des déclarations initiales (IN)
  // Seulement 2 déclarations rectificatives/correctives sur tout le jeu de données
  const typeTransmission = estDeclarationNonInitiale
    ? (['CO', 'RE'][Math.floor(Math.random() * 2)] as 'CO' | 'RE')
    : 'IN';

  // Même SIREN pour émetteur et déclarant
  const siren = genererSiren();

  return {
    idTransmission: `TRANS-${typeFlux.replace('.', '')}-${date.getFullYear()}-${(index + 1).toString().padStart(5, '0')}`,
    nomDocument: `Flux ${typeFlux} - ACME Corporation France`,
    horodatage: {
      dateHeureChaine: genererHorodatage(date),
    },
    codeTypeTransmission: typeTransmission,
    references:
      typeTransmission === 'CO' || typeTransmission === 'RE'
        ? {
            idTransmissionPrecedente: `TRANS-${typeFlux.replace('.', '')}-${date.getFullYear() - 1}-${(index + 1).toString().padStart(5, '0')}`,
            typeTransmissionPrecedente: 'IN',
          }
        : undefined,
    emetteur: {
      id: siren,
      typeId: '0002',
      raisonSociale: 'ACME Corporation France',
      codeRole: 'SE',
      adresseElectronique: {
        uri: '0002:123456789',
      },
    },
    declarant: {
      id: siren,
      typeId: '0002',
      raisonSociale: 'ACME Corporation France',
      codeRole: 'SE',
      adresseElectronique: {
        uri: '0002:123456789',
      },
    },
  };
}

/**
 * Génère une facture B2B fictive (Flux 10.1)
 */
function genererFactureB2B(numeroFacture: string, dateBase: Date): FactureB2B {
  const dateEmission = new Date(dateBase);
  dateEmission.setDate(dateEmission.getDate() - Math.floor(Math.random() * 30));

  const typesFacture = ['380', '381', '384']; // Facture commerciale, Avoir, Facture rectificative

  // Génération des montants
  const montantHT = Math.floor(Math.random() * 50000) + 5000;
  const montantTVA = Math.floor(montantHT * 0.2); // TVA à 20%

  const montantsTotaux: MontantsTotaux = {
    montantHT,
    montantTVA,
    deviseMontantTVA: 'EUR',
  };

  return {
    numeroFacture,
    dateEmission: genererDateAAJJ(dateEmission),
    codeTypeFacture: typesFacture[Math.floor(Math.random() * typesFacture.length)],
    codeDevise: 'EUR',
    montantsTotaux,
  };
}

/**
 * Génère des répartitions par taux fictives
 */
function genererRepartitionsParTaux(): RepartitionParTaux[] {
  const tauxTVA = [20.0, 10.0, 5.5, 2.1];
  const nombreRepartitions = Math.floor(Math.random() * 3) + 1;

  return Array.from({ length: nombreRepartitions }, (_, i) => ({
    taux: tauxTVA[i % tauxTVA.length],
    codeDevise: 'EUR',
    montantEncaisse: Math.floor(Math.random() * 50000) + 1000,
  }));
}

/**
 * Génère une facture avec paiement (Flux 10.2)
 */
function genererFactureAvecPaiement(
  numeroFacture: string,
  dateBase: Date
): FactureAvecPaiement {
  const dateFacture = new Date(dateBase);
  dateFacture.setDate(dateFacture.getDate() - Math.floor(Math.random() * 60));

  const datePaiement = new Date(dateFacture);
  datePaiement.setDate(datePaiement.getDate() + Math.floor(Math.random() * 30) + 1);

  const paiement: Paiement = {
    datePaiement: genererDateAAJJ(datePaiement),
    repartitions: genererRepartitionsParTaux(),
  };

  return {
    numeroFacture,
    dateFacture: genererDateAAJJ(dateFacture),
    paiement,
  };
}

/**
 * Génère une transmission de transactions (Flux 10.1 ou 10.3)
 */
function genererTransmissionTransactions(
  typeFlux: TypeFlux,
  dateBase: Date
): TransmissionTransactions {
  const dateDebut = new Date(dateBase);
  dateDebut.setDate(1); // Premier jour du mois

  const dateFin = new Date(dateDebut);
  dateFin.setMonth(dateFin.getMonth() + 1);
  dateFin.setDate(0); // Dernier jour du mois

  const transmission: TransmissionTransactions = {
    periode: {
      dateDebut: genererDateAAJJ(dateDebut),
      dateFin: genererDateAAJJ(dateFin),
    },
  };

  // Flux 10.1 contient des factures B2B
  if (typeFlux === '10.1') {
    const nombreFactures = Math.floor(Math.random() * 10) + 5;
    transmission.factures = Array.from({ length: nombreFactures }, (_, i) =>
      genererFactureB2B(
        `FAC-B2B-${dateDebut.getFullYear()}-${(i + 1).toString().padStart(4, '0')}`,
        dateDebut
      )
    );
  }

  // Flux 10.3 contient des transactions B2C agrégées
  if (typeFlux === '10.3') {
    const nombreTransactions = Math.floor(Math.random() * 500) + 100;
    const montantTotalHT = Math.floor(Math.random() * 500000) + 50000;
    const montantTotalTVA = Math.floor(montantTotalHT * 0.2); // TVA à 20%

    const transactionsB2C: TransactionsB2C = {
      montantTotalHT,
      montantTotalTVA,
      nombreTransactions,
    };

    transmission.transactionsB2C = transactionsB2C;
  }

  return transmission;
}

/**
 * Génère une transmission de paiements (Flux 10.2 ou 10.4)
 */
function genererTransmissionPaiements(
  typeFlux: TypeFlux,
  dateBase: Date
): TransmissionPaiements {
  const dateDebut = new Date(dateBase);
  dateDebut.setDate(1); // Premier jour du mois

  const dateFin = new Date(dateDebut);
  dateFin.setMonth(dateFin.getMonth() + 1);
  dateFin.setDate(0); // Dernier jour du mois

  const transmission: TransmissionPaiements = {
    periode: {
      dateDebut: genererDateAAJJ(dateDebut),
      dateFin: genererDateAAJJ(dateFin),
    },
  };

  // Flux 10.2 contient des factures avec paiements
  if (typeFlux === '10.2') {
    const nombreFactures = Math.floor(Math.random() * 8) + 3;
    transmission.factures = Array.from({ length: nombreFactures }, (_, i) =>
      genererFactureAvecPaiement(
        `FAC-B2B-${dateDebut.getFullYear()}-${(i + 1).toString().padStart(4, '0')}`,
        dateDebut
      )
    );
  }

  // Flux 10.4 contient des transactions B2C avec paiement
  if (typeFlux === '10.4') {
    const datePaiement = new Date(dateDebut);
    datePaiement.setDate(datePaiement.getDate() + Math.floor(Math.random() * 20) + 5);

    const paiement: Paiement = {
      datePaiement: genererDateAAJJ(datePaiement),
      repartitions: genererRepartitionsParTaux(),
    };

    const transactionsAvecPaiement: TransactionsAvecPaiement = {
      paiement,
    };

    transmission.transactionsB2C = transactionsAvecPaiement;
  }

  return transmission;
}

/**
 * Génère un flux e-reporting complet
 */
function genererFlux(
  typeFlux: TypeFlux,
  index: number,
  date: Date,
  estDeclarationNonInitiale: boolean = false
): FluxEReporting {
  const donneesRacine = genererDonneesRacine(typeFlux, index, date, estDeclarationNonInitiale);

  const flux: FluxEReporting = {
    typeFlux,
    donneesRacine,
  };

  // Flux 10.1 et 10.3 : transmission de transactions
  if (typeFlux === '10.1' || typeFlux === '10.3') {
    flux.transmissionTransactions = genererTransmissionTransactions(typeFlux, date);
  }

  // Flux 10.2 et 10.4 : transmission de paiements
  if (typeFlux === '10.2' || typeFlux === '10.4') {
    flux.transmissionPaiements = genererTransmissionPaiements(typeFlux, date);
  }

  return flux;
}

/**
 * Génère un ensemble de flux e-reporting fictifs
 */
export function genererFluxEReporting(nombreParType: number = 5): FluxEReporting[] {
  const fluxGeneres: FluxEReporting[] = [];
  const typesFlux: TypeFlux[] = ['10.1', '10.2', '10.3', '10.4'];
  const maintenant = new Date();

  // Calcul du nombre total de flux qui seront générés
  const nombreTotalFlux = typesFlux.length * nombreParType;

  // On choisit 2 indices aléatoires pour les déclarations non-initiales
  const indicesNonInitiaux = new Set<number>();
  while (indicesNonInitiaux.size < 2 && indicesNonInitiaux.size < nombreTotalFlux) {
    indicesNonInitiaux.add(Math.floor(Math.random() * nombreTotalFlux));
  }

  let indexGlobal = 0;
  typesFlux.forEach((typeFlux) => {
    for (let i = 0; i < nombreParType; i++) {
      // Génère des flux avec des dates décalées dans le passé
      const dateFlux = new Date(maintenant);
      dateFlux.setMonth(dateFlux.getMonth() - i);

      // Détermine si ce flux doit être une déclaration non-initiale
      const estDeclarationNonInitiale = indicesNonInitiaux.has(indexGlobal);

      fluxGeneres.push(genererFlux(typeFlux, i, dateFlux, estDeclarationNonInitiale));
      indexGlobal++;
    }
  });

  // Mélange les flux pour avoir un ordre plus réaliste
  return fluxGeneres.sort(
    (a, b) =>
      b.donneesRacine.horodatage.dateHeureChaine.localeCompare(
        a.donneesRacine.horodatage.dateHeureChaine
      )
  );
}

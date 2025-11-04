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
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

/**
 * Liste de raisons sociales fictives
 */
const raisonsSociales = [
  'ACME Corporation France',
  'TechnoSolutions SAS',
  'Industries Modernes SARL',
  'Commerce International SA',
  'Services Numériques France',
  'Distribution Europe',
  'Logistique Transport Plus',
  'Énergie Verte France',
];

/**
 * Génère des données racine communes à tous les flux
 */
function genererDonneesRacine(
  typeFlux: TypeFlux,
  index: number,
  date: Date
): DonneesRacineFlux {
  const typeTransmission = ['IN', 'CO', 'MO', 'RE'][
    Math.floor(Math.random() * 4)
  ] as 'IN' | 'CO' | 'MO' | 'RE';

  const sirenEmetteur = genererSiren();
  const sirenDeclarant = genererSiren();

  return {
    idTransmission: `TRANS-${typeFlux.replace('.', '')}-${date.getFullYear()}-${(index + 1).toString().padStart(5, '0')}`,
    nomDocument: `Flux ${typeFlux} - ${raisonsSociales[index % raisonsSociales.length]}`,
    horodatage: {
      dateHeureChaine: genererHorodatage(date),
    },
    codeTypeTransmission: typeTransmission,
    references:
      typeTransmission === 'MO' || typeTransmission === 'RE'
        ? {
            idTransmissionPrecedente: `TRANS-${typeFlux.replace('.', '')}-${date.getFullYear() - 1}-${(index + 1).toString().padStart(5, '0')}`,
            typeTransmissionPrecedente: 'CO',
          }
        : undefined,
    emetteur: {
      id: sirenEmetteur,
      typeId: '0002',
      raisonSociale: raisonsSociales[index % raisonsSociales.length],
      codeRole: 'SE',
      adresseElectronique: {
        uri: `emetteur.${sirenEmetteur}@cef-france.fr`,
      },
    },
    declarant: {
      id: sirenDeclarant,
      typeId: '0002',
      raisonSociale:
        raisonsSociales[(index + 2) % raisonsSociales.length],
      codeRole: 'BY',
      adresseElectronique: {
        uri: `declarant.${sirenDeclarant}@cef-france.fr`,
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

  const codesDevise = ['EUR', 'USD', 'GBP', 'CHF'];
  const typesFacture = ['380', '381', '384']; // Facture commerciale, Avoir, Facture rectificative

  return {
    numeroFacture,
    dateEmission: genererDateAAJJ(dateEmission),
    codeTypeFacture: typesFacture[Math.floor(Math.random() * typesFacture.length)],
    codeDevise: codesDevise[Math.floor(Math.random() * codesDevise.length)],
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

  return transmission;
}

/**
 * Génère un flux e-reporting complet
 */
function genererFlux(typeFlux: TypeFlux, index: number, date: Date): FluxEReporting {
  const donneesRacine = genererDonneesRacine(typeFlux, index, date);

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

  typesFlux.forEach((typeFlux) => {
    for (let i = 0; i < nombreParType; i++) {
      // Génère des flux avec des dates décalées dans le passé
      const dateFlux = new Date(maintenant);
      dateFlux.setMonth(dateFlux.getMonth() - i);

      fluxGeneres.push(genererFlux(typeFlux, i, dateFlux));
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

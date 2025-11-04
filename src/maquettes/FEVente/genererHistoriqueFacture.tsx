import { FactureVente, EvenementHistorique } from '../FacturesVenteIxfacture';
import { genererDetailAction } from './genererDetailAction';

// Fonction pour générer un historique cohérent en fonction de la facture
export const genererHistoriqueFacture = (facture: FactureVente): EvenementHistorique[] => {
  const historique: EvenementHistorique[] = [];
  const dateEmission = facture.dateEmission || '2025-10-01';
  const dateBase = `${dateEmission.substring(0, 4)}-${dateEmission.substring(5, 7)}-${dateEmission.substring(8, 10)}`;

  // Fonction utilitaire pour ajouter des jours à une date
  const ajouterJours = (dateStr: string, jours: number): string => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + jours);
    return date.toISOString().split('T')[0];
  };

  // Toutes les factures commencent par "Déposée" (statut technique, Système)
  historique.push({
    dateHeure: `${dateBase} 08:30:15`,
    utilisateur: 'Système',
    typeAction: 'statut_technique',
    action: 'Déposée',
    detailAction: genererDetailAction('Déposée', 'statut_technique'),
  });

  // Si la facture est rejetée, on s'arrête là
  if (facture.statut === 'Rejetée') {
    historique.push({
      dateHeure: `${dateBase} 08:31:22`,
      utilisateur: 'Système',
      typeAction: 'statut_technique',
      action: 'Rejetée',
      detailAction: genererDetailAction('Rejetée', 'statut_technique'),
    });
    return historique;
  }

  // Si le statut actuel est "Déposée", on s'arrête après le dépôt
  if (facture.statut === 'Déposée') {
    return historique;
  }

  // Sinon, on passe à "Emise par la plateforme" (statut métier, Système)
  historique.push({
    dateHeure: `${dateBase} 08:32:45`,
    utilisateur: 'Système',
    typeAction: 'statut_metier',
    action: 'Emise par la plateforme',
    detailAction: genererDetailAction('Emise par la plateforme', 'statut_metier'),
  });

  // Si le statut actuel est "Emise par la plateforme", on ajoute quelques actions
  if (facture.statut === 'Emise par la plateforme') {
    historique.push({
      dateHeure: `${dateBase} 10:15:32`,
      utilisateur: 'Marie Dubois',
      adresseIp: '192.168.1.55',
      typeAction: 'consultation',
      action: 'Consultation',
      detailAction: genererDetailAction('Consultation', 'consultation'),
    });

    historique.push({
      dateHeure: `${dateBase} 14:22:18`,
      utilisateur: 'Pierre Martin',
      adresseIp: '192.168.1.78',
      typeAction: 'metadonnee',
      action: 'Code projet',
      detailAction: genererDetailAction('Code projet', 'metadonnee', undefined, 'Projet A'),
      metadonneeApres: 'Projet A',
    });
    return historique;
  }

  // Pour tous les autres statuts, ajouter des consultations et téléchargements
  const dateJ1 = ajouterJours(dateBase, 1);
  const dateJ2 = ajouterJours(dateBase, 2);
  const dateJ3 = ajouterJours(dateBase, 3);
  const dateJ5 = ajouterJours(dateBase, 5);
  const dateJ7 = ajouterJours(dateBase, 7);
  const dateJ10 = ajouterJours(dateBase, 10);
  const dateJ20 = ajouterJours(dateBase, 20);
  const dateJ25 = ajouterJours(dateBase, 25);

  // Consultation initiale
  historique.push({
    dateHeure: `${dateBase} 10:15:32`,
    utilisateur: 'Marie Dubois',
    adresseIp: '192.168.1.55',
    typeAction: 'consultation',
    action: 'Consultation',
    detailAction: genererDetailAction('Consultation', 'consultation'),
  });

  // Téléchargement PDF
  historique.push({
    dateHeure: `${dateBase} 10:18:45`,
    utilisateur: 'Marie Dubois',
    adresseIp: '192.168.1.55',
    typeAction: 'telechargement',
    action: 'PDF',
    detailAction: genererDetailAction('PDF', 'telechargement'),
  });

  // Gestion des statuts PA émission
  if (facture.statut === 'Complétée') {
    // Parcours : Emise → Suspendue (de la PA réception) → Complétée
    historique.push({
      dateHeure: `${dateJ1} 09:30:00`,
      utilisateur: 'Système (PA réception)',
      typeAction: 'statut_technique',
      action: 'Reçue de la plateforme',
      detailAction: genererDetailAction('Reçue de la plateforme', 'statut_technique'),
    });

    historique.push({
      dateHeure: `${dateJ1} 09:32:15`,
      utilisateur: 'Système (PA réception)',
      typeAction: 'statut_technique',
      action: 'Mise à disposition',
      detailAction: genererDetailAction('Mise à disposition', 'statut_technique'),
    });

    historique.push({
      dateHeure: `${dateJ2} 14:20:30`,
      utilisateur: 'Système (PA réception)',
      typeAction: 'statut_metier',
      action: 'Prise en charge',
      detailAction: genererDetailAction('Prise en charge', 'statut_metier'),
    });

    historique.push({
      dateHeure: `${dateJ5} 11:45:12`,
      utilisateur: 'Système (PA réception)',
      typeAction: 'statut_metier',
      action: 'Suspendue',
      detailAction: genererDetailAction('Suspendue', 'statut_metier'),
    });

    // Consultation après suspension
    historique.push({
      dateHeure: `${dateJ5} 15:30:00`,
      utilisateur: 'Pierre Martin',
      adresseIp: '192.168.1.78',
      typeAction: 'consultation',
      action: 'Consultation',
      detailAction: genererDetailAction('Consultation', 'consultation'),
    });

    // Ajout de métadonnée pour compléter
    historique.push({
      dateHeure: `${dateJ7} 09:15:00`,
      utilisateur: 'Pierre Martin',
      adresseIp: '192.168.1.78',
      typeAction: 'metadonnee',
      action: 'Code projet',
      detailAction: genererDetailAction('Code projet', 'metadonnee', undefined, 'Projet B'),
      metadonneeApres: 'Projet B',
    });

    // Complétée (statut métier, Système)
    historique.push({
      dateHeure: `${dateJ7} 09:45:12`,
      utilisateur: 'Système',
      typeAction: 'statut_metier',
      action: 'Complétée',
      detailAction: genererDetailAction('Complétée', 'statut_metier'),
    });

    return historique;
  }

  if (facture.statut === 'Encaissée') {
    // Parcours complet : Emise → Reçue → Mise à disposition → Prise en charge → Approuvée → Paiement transmis → Encaissée
    historique.push({
      dateHeure: `${dateJ1} 09:30:00`,
      utilisateur: 'Système (PA réception)',
      typeAction: 'statut_technique',
      action: 'Reçue de la plateforme',
      detailAction: genererDetailAction('Reçue de la plateforme', 'statut_technique'),
    });

    historique.push({
      dateHeure: `${dateJ1} 09:32:15`,
      utilisateur: 'Système (PA réception)',
      typeAction: 'statut_technique',
      action: 'Mise à disposition',
      detailAction: genererDetailAction('Mise à disposition', 'statut_technique'),
    });

    historique.push({
      dateHeure: `${dateJ2} 14:20:30`,
      utilisateur: 'Système (PA réception)',
      typeAction: 'statut_metier',
      action: 'Prise en charge',
      detailAction: genererDetailAction('Prise en charge', 'statut_metier'),
    });

    // Consultation intermédiaire
    historique.push({
      dateHeure: `${dateJ3} 10:30:00`,
      utilisateur: 'Marie Dubois',
      adresseIp: '192.168.1.55',
      typeAction: 'consultation',
      action: 'Consultation',
      detailAction: genererDetailAction('Consultation', 'consultation'),
    });

    historique.push({
      dateHeure: `${dateJ5} 11:45:12`,
      utilisateur: 'Système (PA réception)',
      typeAction: 'statut_metier',
      action: 'Approuvée',
      detailAction: genererDetailAction('Approuvée', 'statut_metier'),
    });

    historique.push({
      dateHeure: `${dateJ20} 16:30:00`,
      utilisateur: 'Système (PA réception)',
      typeAction: 'statut_metier',
      action: 'Paiement transmis',
      detailAction: genererDetailAction('Paiement transmis', 'statut_metier'),
    });

    historique.push({
      dateHeure: `${dateJ25} 14:32:08`,
      utilisateur: 'Système',
      typeAction: 'statut_metier',
      action: 'Encaissée',
      detailAction: genererDetailAction('Encaissée', 'statut_metier'),
    });

    return historique;
  }

  // Gestion des statuts PA réception (reçus du système)
  // Tous ces statuts viennent après "Reçue de la plateforme" et "Mise à disposition"
  historique.push({
    dateHeure: `${dateJ1} 09:30:00`,
    utilisateur: 'Système (PA réception)',
    typeAction: 'statut_technique',
    action: 'Reçue de la plateforme',
    detailAction: genererDetailAction('Reçue de la plateforme', 'statut_technique'),
  });

  if (facture.statut === 'Reçue de la plateforme') {
    return historique;
  }

  historique.push({
    dateHeure: `${dateJ1} 09:32:15`,
    utilisateur: 'Système (PA réception)',
    typeAction: 'statut_technique',
    action: 'Mise à disposition',
    detailAction: genererDetailAction('Mise à disposition', 'statut_technique'),
  });

  if (facture.statut === 'Mise à disposition') {
    // Ajouter une consultation
    historique.push({
      dateHeure: `${dateJ1} 15:20:00`,
      utilisateur: 'Pierre Martin',
      adresseIp: '192.168.1.78',
      typeAction: 'consultation',
      action: 'Consultation',
      detailAction: genererDetailAction('Consultation', 'consultation'),
    });
    return historique;
  }

  // Prise en charge (statut métier PA réception)
  historique.push({
    dateHeure: `${dateJ2} 14:20:30`,
    utilisateur: 'Système (PA réception)',
    typeAction: 'statut_metier',
    action: 'Prise en charge',
    detailAction: genererDetailAction('Prise en charge', 'statut_metier'),
  });

  if (facture.statut === 'Prise en charge') {
    // Ajouter consultation et téléchargement
    historique.push({
      dateHeure: `${dateJ2} 16:45:00`,
      utilisateur: 'Marie Dubois',
      adresseIp: '192.168.1.55',
      typeAction: 'consultation',
      action: 'Consultation',
      detailAction: genererDetailAction('Consultation', 'consultation'),
    });

    historique.push({
      dateHeure: `${dateJ3} 09:30:00`,
      utilisateur: 'Pierre Martin',
      adresseIp: '192.168.1.78',
      typeAction: 'telechargement',
      action: 'UBL',
      detailAction: genererDetailAction('UBL', 'telechargement'),
    });
    return historique;
  }

  // Consultation intermédiaire
  historique.push({
    dateHeure: `${dateJ3} 10:30:00`,
    utilisateur: 'Marie Dubois',
    adresseIp: '192.168.1.55',
    typeAction: 'consultation',
    action: 'Consultation',
    detailAction: genererDetailAction('Consultation', 'consultation'),
  });

  // Branches selon le statut final
  switch (facture.statut) {
    case 'Approuvée':
      historique.push({
        dateHeure: `${dateJ5} 11:45:12`,
        utilisateur: 'Système (PA réception)',
        typeAction: 'statut_metier',
        action: 'Approuvée',
        detailAction: genererDetailAction('Approuvée', 'statut_metier'),
      });

      historique.push({
        dateHeure: `${dateJ7} 14:20:00`,
        utilisateur: 'Pierre Martin',
        adresseIp: '192.168.1.78',
        typeAction: 'consultation',
        action: 'Consultation',
        detailAction: genererDetailAction('Consultation', 'consultation'),
      });
      break;

    case 'Approuvée partiellement':
      historique.push({
        dateHeure: `${dateJ5} 11:45:12`,
        utilisateur: 'Système (PA réception)',
        typeAction: 'statut_metier',
        action: 'Approuvée partiellement',
        detailAction: genererDetailAction('Approuvée partiellement', 'statut_metier'),
      });

      historique.push({
        dateHeure: `${dateJ5} 15:30:00`,
        utilisateur: 'Marie Dubois',
        adresseIp: '192.168.1.55',
        typeAction: 'consultation',
        action: 'Consultation',
        detailAction: genererDetailAction('Consultation', 'consultation'),
      });

      historique.push({
        dateHeure: `${dateJ7} 09:15:00`,
        utilisateur: 'Pierre Martin',
        adresseIp: '192.168.1.78',
        typeAction: 'metadonnee',
        action: 'Commentaire interne',
        detailAction: genererDetailAction('Commentaire interne', 'metadonnee', undefined, 'Facture approuvée partiellement - montant contesté'),
        metadonneeApres: 'Facture approuvée partiellement - montant contesté',
      });
      break;

    case 'En litige':
      historique.push({
        dateHeure: `${dateJ5} 11:45:12`,
        utilisateur: 'Système (PA réception)',
        typeAction: 'statut_metier',
        action: 'En litige',
        detailAction: genererDetailAction('En litige', 'statut_metier'),
      });

      historique.push({
        dateHeure: `${dateJ5} 14:00:00`,
        utilisateur: 'Marie Dubois',
        adresseIp: '192.168.1.55',
        typeAction: 'consultation',
        action: 'Consultation',
        detailAction: genererDetailAction('Consultation', 'consultation'),
      });

      historique.push({
        dateHeure: `${dateJ7} 10:30:00`,
        utilisateur: 'Pierre Martin',
        adresseIp: '192.168.1.78',
        typeAction: 'metadonnee',
        action: 'Commentaire interne',
        detailAction: genererDetailAction('Commentaire interne', 'metadonnee', undefined, 'Contacter le client pour résoudre le litige'),
        metadonneeApres: 'Contacter le client pour résoudre le litige',
      });

      historique.push({
        dateHeure: `${dateJ10} 11:45:00`,
        utilisateur: 'Marie Dubois',
        adresseIp: '192.168.1.55',
        typeAction: 'telechargement',
        action: 'PDF',
        detailAction: genererDetailAction('PDF', 'telechargement'),
      });
      break;

    case 'Suspendue':
      historique.push({
        dateHeure: `${dateJ5} 11:45:12`,
        utilisateur: 'Système (PA réception)',
        typeAction: 'statut_metier',
        action: 'Suspendue',
        detailAction: genererDetailAction('Suspendue', 'statut_metier'),
      });

      historique.push({
        dateHeure: `${dateJ5} 15:30:00`,
        utilisateur: 'Pierre Martin',
        adresseIp: '192.168.1.78',
        typeAction: 'consultation',
        action: 'Consultation',
        detailAction: genererDetailAction('Consultation', 'consultation'),
      });

      historique.push({
        dateHeure: `${dateJ7} 09:15:00`,
        utilisateur: 'Pierre Martin',
        adresseIp: '192.168.1.78',
        typeAction: 'metadonnee',
        action: 'Commentaire interne',
        detailAction: genererDetailAction('Commentaire interne', 'metadonnee', undefined, 'En attente de documents complémentaires du client'),
        metadonneeApres: 'En attente de documents complémentaires du client',
      });
      break;

    case 'Refusée':
      historique.push({
        dateHeure: `${dateJ5} 11:45:12`,
        utilisateur: 'Système (PA réception)',
        typeAction: 'statut_metier',
        action: 'Refusée',
        detailAction: genererDetailAction('Refusée', 'statut_metier'),
      });

      historique.push({
        dateHeure: `${dateJ5} 13:00:00`,
        utilisateur: 'Marie Dubois',
        adresseIp: '192.168.1.55',
        typeAction: 'consultation',
        action: 'Consultation',
        detailAction: genererDetailAction('Consultation', 'consultation'),
      });

      historique.push({
        dateHeure: `${dateJ5} 13:30:00`,
        utilisateur: 'Marie Dubois',
        adresseIp: '192.168.1.55',
        typeAction: 'telechargement',
        action: 'PDF',
        detailAction: genererDetailAction('PDF', 'telechargement'),
      });

      historique.push({
        dateHeure: `${dateJ7} 09:00:00`,
        utilisateur: 'Pierre Martin',
        adresseIp: '192.168.1.78',
        typeAction: 'metadonnee',
        action: 'Commentaire interne',
        detailAction: genererDetailAction('Commentaire interne', 'metadonnee', undefined, 'Facture refusée par le client - vérifier les conditions'),
        metadonneeApres: 'Facture refusée par le client - vérifier les conditions',
      });
      break;

    case 'Paiement transmis':
      historique.push({
        dateHeure: `${dateJ5} 11:45:12`,
        utilisateur: 'Système (PA réception)',
        typeAction: 'statut_metier',
        action: 'Approuvée',
        detailAction: genererDetailAction('Approuvée', 'statut_metier'),
      });

      historique.push({
        dateHeure: `${dateJ7} 14:20:00`,
        utilisateur: 'Pierre Martin',
        adresseIp: '192.168.1.78',
        typeAction: 'consultation',
        action: 'Consultation',
        detailAction: genererDetailAction('Consultation', 'consultation'),
      });

      historique.push({
        dateHeure: `${dateJ20} 16:30:00`,
        utilisateur: 'Système (PA réception)',
        typeAction: 'statut_metier',
        action: 'Paiement transmis',
        detailAction: genererDetailAction('Paiement transmis', 'statut_metier'),
      });

      historique.push({
        dateHeure: `${dateJ20} 17:00:00`,
        utilisateur: 'Marie Dubois',
        adresseIp: '192.168.1.55',
        typeAction: 'consultation',
        action: 'Consultation',
        detailAction: genererDetailAction('Consultation', 'consultation'),
      });
      break;
  }

  return historique;
};

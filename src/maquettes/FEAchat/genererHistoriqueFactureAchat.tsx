import { FactureAchat, EvenementHistorique, genererDetailAction } from '../FacturesAchatiXfacture';

// Fonction pour générer un historique cohérent en fonction de la facture
export const genererHistoriqueFactureAchat = (facture: FactureAchat): EvenementHistorique[] => {
  const historique: EvenementHistorique[] = [];
  const dateEmission = facture.dateEmission || '20251001';
  const dateBase = `${dateEmission.substring(0, 4)}-${dateEmission.substring(4, 6)}-${dateEmission.substring(6, 8)}`;

  // Premier événement selon l'origine de la facture
  if (facture.origine === 'PA') {
    // Facture reçue de la plateforme agréée
    historique.push({
      dateHeure: `${dateBase} 09:15:32`,
      utilisateur: 'Système',
      typeAction: 'statut_technique',
      action: 'Reçue de la plateforme',
      detailAction: genererDetailAction('Reçue de la plateforme', 'statut_technique'),
    });
  } else if (facture.origine === 'Saisie manuelle') {
    // Facture saisie manuellement
    historique.push({
      dateHeure: `${dateBase} 09:10:15`,
      utilisateur: 'Marie Dupont',
      adresseIp: '192.168.1.45',
      typeAction: 'statut_technique',
      action: 'Saisie manuelle',
      detailAction: 'La facture a été saisie manuellement dans le système',
    });
  } else if (facture.origine === 'Import manuel') {
    // Facture importée manuellement
    historique.push({
      dateHeure: `${dateBase} 09:12:28`,
      utilisateur: 'Jean Martin',
      adresseIp: '192.168.1.78',
      typeAction: 'statut_technique',
      action: 'Import manuel',
      detailAction: 'La facture a été importée manuellement via un fichier',
    });
  } else if (facture.origine === 'API') {
    // Facture reçue via API
    historique.push({
      dateHeure: `${dateBase} 09:14:42`,
      utilisateur: 'Système',
      typeAction: 'statut_technique',
      action: 'Réception via API',
      detailAction: 'La facture a été réceptionnée via une API tierce',
    });
  }

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

  // Après la soumission, la facture passe obligatoirement à "Mise à disposition"
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

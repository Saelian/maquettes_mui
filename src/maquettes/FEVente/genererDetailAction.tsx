import { TypeAction } from '../../types/TypeAction';

// Fonction pour générer une phrase descriptive selon le statut ou l'action

export const genererDetailAction = (action: string, typeAction: TypeAction, metadonneeAvant?: string, metadonneeApres?: string): string => {
  // Pour les statuts techniques
  if (typeAction === 'statut_technique') {
    switch (action) {
      // Statuts PA émission
      case 'Rejetée':
        return 'La facture est rejetée par la plateforme (non conforme)';
      case 'Déposée':
        return 'La facture est prise en charge par la plateforme d\'émission';
      // Statuts PA réception (reçus du système)
      case 'Reçue de la plateforme':
        return 'La facture est reçue par la plateforme de réception';
      case 'Mise à disposition':
        return 'La facture est mise à disposition par la plateforme de réception';
      default:
        return `Statut technique : ${action}`;
    }
  }

  // Pour les statuts métiers
  if (typeAction === 'statut_metier' || typeAction === 'changement_statut_manuel' || typeAction === 'changement_statut_api') {
    switch (action) {
      // Statuts PA émission
      case 'Emise par la plateforme':
        return 'La facture est envoyée à la plateforme de réception';
      case 'Complétée':
        return 'La facture est complétée suite à une suspension';
      case 'Encaissée':
        return 'Le paiement de la facture a été réceptionné';
      // Statuts PA réception (reçus du système)
      case 'Prise en charge':
        return 'L\'acheteur a pris en charge la facture';
      case 'Approuvée':
        return 'L\'acheteur a approuvé la facture';
      case 'Approuvée partiellement':
        return 'L\'acheteur a approuvé partiellement la facture';
      case 'En litige':
        return 'L\'acheteur a mis la facture en litige';
      case 'Suspendue':
        return 'L\'acheteur a suspendu la facture';
      case 'Refusée':
        return 'L\'acheteur a refusé la facture';
      case 'Paiement transmis':
        return 'L\'acheteur a transmis le paiement de la facture';
      default:
        return `Changement de statut : ${action}`;
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

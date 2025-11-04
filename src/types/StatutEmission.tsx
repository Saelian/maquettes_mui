// Types de statuts de facture de vente
// Inclut les statuts de la PA d'émission ET les statuts reçus de la PA de réception
export type StatutEmission = 'Rejetée' // Statut technique PA émission
  |
  'Déposée' // Statut technique PA émission
  |
  'Emise par la plateforme' // Statut métier PA émission
  |
  'Complétée' // Statut métier PA émission
  |
  'Encaissée'; // Statut métier PA émission


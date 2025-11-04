import { Colonne } from '../FacturesAchatiXfacture';

// Fournisseurs d'exemple
// Configuration des colonnes par défaut - Conformes EN16931
export const colonnesParDefautAchat: Colonne[] = [
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

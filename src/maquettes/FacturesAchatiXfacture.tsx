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
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';
import type { FactureElectronique} from '../types/factureEN16931';
import { genererHistoriqueFactureAchat } from './FEAchat/genererHistoriqueFactureAchat';
import { facturesAchatFictivesAchat } from './FEAchat/facturesAchatFictivesAchat';
import { StatutTechnique } from '../types/StatutTechnique';
import { StatutMetier } from '../types/StatutMetier';
import { StatutApplicatif } from '../types/StatutApplicatif';
import { TypeAction } from '../types/TypeAction';
import { colonnesParDefautAchat } from './FEAchat/colonnesParDefautAchat';

type StatutFacture = StatutTechnique | StatutMetier | StatutApplicatif;

// Type pour l'origine de la facture
type OrigineFacture = 'PA' | 'Saisie manuelle' | 'Import manuel' | 'API';

// Type pour la nature de la facture
type NatureFacture = 'Factures_ERP1' | 'Factures_ERP2' | 'Factures_General';

// Interface pour une facture d'achat conforme EN16931 + statuts métiers
export interface FactureAchat extends FactureElectronique {
  id: string;
  statut: StatutFacture;
  origine: OrigineFacture; // PA = Plateforme Agréée, Hors PA = Canal tiers
  nature: NatureFacture; // Nature de routage de la facture
  dateReception?: string; // Date de réception par l'acheteur (format YYYYMMDD)
}

// Interface pour l'historique d'une facture
export interface EvenementHistorique {
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

// Codes de types de documents filtrés (380 à 386)
const CODES_TYPE_DOCUMENT_FILTRES = ['380', '381', '384', '386'] as const;

// Colonnes disponibles pour le tableau - Conformes EN16931
export interface Colonne {
  id: 'numero' | 'dateEmission' | 'dateReception' | 'typeDocument' | 'vendeur' | 'montantTTC' | 'montantDu' | 'devise' | 'nombreLignes' | 'statut' | 'origine' | 'nature';
  label: string;
  codeBT: string;
  visible: boolean;
  sortable: boolean;
}

// Fonction pour générer une phrase descriptive selon le statut ou l'action
export const genererDetailAction = (action: string, typeAction: TypeAction, metadonneeAvant?: string, metadonneeApres?: string): string => {
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
  const [factures, setFactures] = useState<FactureAchat[]>(facturesAchatFictivesAchat);
  const [facturesSelectionnees, setFacturesSelectionnees] = useState<string[]>([]);
  const [colonnes, setColonnes] = useState<Colonne[]>(colonnesParDefautAchat);
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
    typesDocument: [] as string[],
    montantMin: '',
    montantMax: '',
    devise: 'TOUS',
    origine: 'TOUS' as 'TOUS' | 'PA' | 'Saisie manuelle' | 'Import manuel' | 'API',
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

  // Handler pour réinitialiser uniquement les colonnes
  const reinitialiserColonnes = () => setColonnes(colonnesParDefautAchat);

  // Handler pour appliquer la recherche
  const appliquerRecherche = () => {
    let resultats = [...facturesAchatFictivesAchat];

    // Filtre par numéro de facture
    if (critereRecherche.numero) {
      resultats = resultats.filter((f) =>
        f.numero.toLowerCase().includes(critereRecherche.numero.toLowerCase())
      );
    }

    // Filtre par fournisseur
    if (critereRecherche.fournisseur) {
      resultats = resultats.filter((f) =>
        f.vendeur?.nom.toLowerCase().includes(critereRecherche.fournisseur.toLowerCase())
      );
    }

    // Filtre par type de document
    if (critereRecherche.typesDocument.length > 0) {
      resultats = resultats.filter((f) => critereRecherche.typesDocument.includes(f.typeDocument));
    }

    // Filtre par dates de réception
    if (critereRecherche.dateDebut) {
      const dateDebut = critereRecherche.dateDebut.replace(/-/g, '');
      resultats = resultats.filter((f) => f.dateReception && f.dateReception >= dateDebut);
    }

    if (critereRecherche.dateFin) {
      const dateFin = critereRecherche.dateFin.replace(/-/g, '');
      resultats = resultats.filter((f) => f.dateReception && f.dateReception <= dateFin);
    }

    // Filtre par montant TTC
    if (critereRecherche.montantMin) {
      const montantMin = parseFloat(critereRecherche.montantMin);
      resultats = resultats.filter((f) => (f.totaux?.montantTotalTTC || 0) >= montantMin);
    }

    if (critereRecherche.montantMax) {
      const montantMax = parseFloat(critereRecherche.montantMax);
      resultats = resultats.filter((f) => (f.totaux?.montantTotalTTC || 0) <= montantMax);
    }

    // Filtre par origine
    if (critereRecherche.origine !== 'TOUS') {
      resultats = resultats.filter((f) => f.origine === critereRecherche.origine);
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
    // Pour les actions de création/soumission
    if (action === 'Saisie manuelle' || action === 'Import manuel' || action === 'Réception via API') {
      return 'info';
    }

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
                    <Typography color="primary" variant="h6" gutterBottom>
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

                    <Typography color="primary" variant="h6" gutterBottom>
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
                      <Typography color="primary" variant="h6" gutterBottom>
                        Lignes de facturation ({factureSelectionnee.lignes.length})
                      </Typography>
                      
                      <TableContainer>
                        <Table>
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
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
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
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
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
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
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
                          <TableRow >
                            <TableCell sx={{  fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Qté</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Prix unit.</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>TVA</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Montant HT</TableCell>
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderRadius: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total TTC :</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee?.totaux?.montantTotalTTC || 0)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Montant dû :</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
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
                    <Typography color="primary" variant="h6" gutterBottom>
                      Origine de la facture
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Cette facture provient de :
                      </Typography>
                      <Chip
                        label={factureSelectionnee?.origine === 'PA' ? 'Plateforme Agréée (PA)' : factureSelectionnee?.origine}
                        color={factureSelectionnee?.origine === 'PA' ? 'primary' : 'default'}
                        size="medium"
                        variant="outlined"
                      />
                    </Box>
                    {factureSelectionnee?.origine !== 'PA' && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        {factureSelectionnee?.origine === 'Saisie manuelle' && (
                          <>Cette facture a été saisie manuellement dans le système. Elle ne fera donc pas l'objet de mise à jour de statuts sur la plateforme agréée.</>
                        )}
                        {factureSelectionnee?.origine === 'Import manuel' && (
                          <>Cette facture a été importée manuellement via un fichier. Elle ne fera donc pas l'objet de mise à jour de statuts sur la plateforme agréée.</>
                        )}
                        {factureSelectionnee?.origine === 'API' && (
                          <>Cette facture a été réceptionnée via une API tierce. Elle ne fera donc pas l'objet de mise à jour de statuts sur la plateforme agréée.</>
                        )}
                      </Alert>
                    )}
                  </Paper>

                  {/* Nature de la facture */}
                  <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography color="primary" variant="h6" gutterBottom>
                      Nature de la facture
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Cette facture a été routée vers la nature :
                      </Typography>
                      <Chip
                        label={factureSelectionnee?.nature}
                        variant="outlined"
                        color="default"
                        size="medium"
                      />
                    </Box>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Le routage vers cette nature a été effectué automatiquement par la Règle #{factureSelectionnee?.nature ? obtenirNumeroRegle(factureSelectionnee.nature) : '-'}, configurée par un administrateur.
                    </Alert>
                  </Paper>

                  {/* Historique de la facture */}
                  <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography color="primary" variant="h6" gutterBottom>
                      Historique de la facture
                    </Typography>
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell >Date et heure</TableCell>
                            <TableCell >Utilisateur</TableCell>
                            <TableCell >Action</TableCell>
                            <TableCell >Détail de l'action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {factureSelectionnee && genererHistoriqueFactureAchat(factureSelectionnee).map((evenement, index) => (
                            <TableRow key={index} hover>
                              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                {evenement.dateHeure}
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" >
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
              <Typography color="primary" variant="h6" gutterBottom>
                Pièces jointes
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                Pas de pièces jointes
              </Typography>
            </Paper>

            {/* Métadonnées */}
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography color="primary" variant="h6" gutterBottom>
                Métadonnées supplémentaires
              </Typography>
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Recherche avancée de factures d'achat</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Section 1: Identification */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Identification</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Numéro de facture"
                  value={critereRecherche.numero}
                  onChange={(e) => setCritereRecherche({ ...critereRecherche, numero: e.target.value })}
                  fullWidth
                  size="small"
                  placeholder="Ex: FA-2025-0001"
                />
                <TextField
                  label="Type de document"
                  select
                  value={critereRecherche.typesDocument.length === 0 ? 'TOUS' : critereRecherche.typesDocument[0]}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCritereRecherche({
                      ...critereRecherche,
                      typesDocument: val === 'TOUS' ? [] : [val]
                    });
                  }}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="TOUS">Tous les types</MenuItem>
                  {CODES_TYPE_DOCUMENT_FILTRES.map((code) => (
                    <MenuItem key={code} value={code}>{`${code} - ${TYPE_DOCUMENT_LABELS[code]}`}</MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <Divider />

            {/* Section 2: Fournisseur */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Fournisseur</Typography>
              <TextField
                label="Nom du fournisseur"
                value={critereRecherche.fournisseur}
                onChange={(e) => setCritereRecherche({ ...critereRecherche, fournisseur: e.target.value })}
                fullWidth
                size="small"
                placeholder="Nom du fournisseur"
              />
            </Box>

            <Divider />

            {/* Section 3: Dates */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Période de réception</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Date de début"
                  type="date"
                  value={critereRecherche.dateDebut}
                  onChange={(e) => setCritereRecherche({ ...critereRecherche, dateDebut: e.target.value })}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Date de fin"
                  type="date"
                  value={critereRecherche.dateFin}
                  onChange={(e) => setCritereRecherche({ ...critereRecherche, dateFin: e.target.value })}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>

            <Divider />

            {/* Section 4: Montants */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Montants (TTC)</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Montant minimum"
                  type="number"
                  value={critereRecherche.montantMin}
                  onChange={(e) => setCritereRecherche({ ...critereRecherche, montantMin: e.target.value })}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">€</InputAdornment>
                  }}
                  placeholder="0.00"
                />
                <TextField
                  label="Montant maximum"
                  type="number"
                  value={critereRecherche.montantMax}
                  onChange={(e) => setCritereRecherche({ ...critereRecherche, montantMax: e.target.value })}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">€</InputAdornment>
                  }}
                  placeholder="0.00"
                />
              </Box>
            </Box>

            <Divider />

            {/* Section 5: Origine */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Origine</Typography>
              <TextField
                label="Origine de la facture"
                select
                value={critereRecherche.origine}
                onChange={(e) => setCritereRecherche({ ...critereRecherche, origine: e.target.value as typeof critereRecherche.origine })}
                fullWidth
                size="small"
              >
                <MenuItem value="TOUS">Toutes les origines</MenuItem>
                <MenuItem value="PA">Plateforme Agréée (PA)</MenuItem>
                <MenuItem value="Saisie manuelle">Saisie manuelle</MenuItem>
                <MenuItem value="Import manuel">Import manuel</MenuItem>
                <MenuItem value="API">API</MenuItem>
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setCritereRecherche({
                numero: '',
                fournisseur: '',
                dateDebut: '',
                dateFin: '',
                typesDocument: [],
                montantMin: '',
                montantMax: '',
                devise: 'TOUS',
                origine: 'TOUS',
              });
            }}
            startIcon={<RestartAltIcon />}
          >
            Réinitialiser
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={fermerModaleRecherche}>Annuler</Button>
          <Button onClick={appliquerRecherche} variant="contained" startIcon={<SearchIcon />}>Rechercher</Button>
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
          <Button onClick={reinitialiserColonnes} startIcon={<RestartAltIcon />}>
            Réinitialiser
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={fermerModaleColonnes}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return (
    <UtilisateurIxBus
      titre="Factures d'achats"
      pageCourante="factures-achat-ixfacture"
    >
      {contenu}
    </UtilisateurIxBus>
  );
};

export default FacturesAchatiXfacture;

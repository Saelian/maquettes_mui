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
} from '@mui/icons-material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

// Types de statuts de facture de vente (PA d'émission)
type StatutTechnique = 'Rejetée' | 'Déposée';

type StatutMetier = 'Emise par la plateforme' | 'Complétée' | 'Encaissée';

type StatutFacture = StatutTechnique | StatutMetier;

// Type pour l'origine de la facture
type OrigineFacture = 'PA' | 'Hors PA';

// Type pour la nature de la facture
type NatureFacture = 'Factures_ERP1' | 'Factures_ERP2' | 'Factures_General';

// Interface pour une facture de vente
interface FactureVente {
  id: string;
  numero: string;
  client: string;
  type: 'Entreprise privée' | 'Entité publique';
  dateEmission: string;
  dateEcheance: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  statut: StatutFacture;
  reference: string;
  origine: OrigineFacture; // PA = Plateforme Agréée, Hors PA = Canal tiers
  nature: NatureFacture; // Nature de routage de la facture
}

// Types d'actions possibles dans l'historique
type TypeAction =
  | 'statut_technique'
  | 'statut_metier'
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

// Colonnes disponibles pour le tableau
interface Colonne {
  id: keyof FactureVente;
  label: string;
  visible: boolean;
  sortable: boolean;
}

// Données fictives de factures de vente - Au minimum une facture par statut
const facturesVenteFictives: FactureVente[] = [
  {
    id: '1',
    numero: 'FV-2025-001',
    client: 'Acheteur Matériaux Pro',
    type: 'Entreprise privée',
    dateEmission: '2025-10-01',
    dateEcheance: '2025-10-31',
    montantHT: 5400.00,
    montantTVA: 1080.00,
    montantTTC: 6480.00,
    statut: 'Déposée',
    reference: 'CMD-VTE-145',
    origine: 'PA',
    nature: 'Factures_ERP1',
  },
  {
    id: '2',
    numero: 'FV-2025-002',
    client: 'Services Techniques Publics',
    type: 'Entité publique',
    dateEmission: '2025-10-02',
    dateEcheance: '2025-11-02',
    montantHT: 12300.00,
    montantTVA: 2460.00,
    montantTTC: 14760.00,
    statut: 'Emise par la plateforme',
    reference: 'CMD-VTE-146',
    origine: 'PA',
    nature: 'Factures_ERP2',
  },
  {
    id: '3',
    numero: 'FV-2025-003',
    client: 'Distribution Logistique SA',
    type: 'Entreprise privée',
    dateEmission: '2025-10-03',
    dateEcheance: '2025-11-03',
    montantHT: 7650.75,
    montantTVA: 1530.15,
    montantTTC: 9180.90,
    statut: 'Rejetée',
    reference: 'CMD-VTE-147',
    origine: 'PA',
    nature: 'Factures_General',
  },
  {
    id: '4',
    numero: 'FV-2025-004',
    client: 'Fournitures Industrielles Plus',
    type: 'Entité publique',
    dateEmission: '2025-10-04',
    dateEcheance: '2025-11-04',
    montantHT: 18900.00,
    montantTVA: 3780.00,
    montantTTC: 22680.00,
    statut: 'Complétée',
    reference: 'CMD-VTE-148',
    origine: 'PA',
    nature: 'Factures_ERP1',
  },
  {
    id: '5',
    numero: 'FV-2025-005',
    client: 'Équipements Bureau Express',
    type: 'Entreprise privée',
    dateEmission: '2025-10-05',
    dateEcheance: '2025-11-05',
    montantHT: 4280.50,
    montantTVA: 856.10,
    montantTTC: 5136.60,
    statut: 'Encaissée',
    reference: 'CMD-VTE-149',
    origine: 'PA',
    nature: 'Factures_ERP2',
  },
  {
    id: '6',
    numero: 'FV-2025-006',
    client: 'Négoce Industrie & Co',
    type: 'Entreprise privée',
    dateEmission: '2025-10-06',
    dateEcheance: '2025-11-06',
    montantHT: 8900.00,
    montantTVA: 1780.00,
    montantTTC: 10680.00,
    statut: 'Emise par la plateforme',
    reference: 'CMD-VTE-150',
    origine: 'Hors PA',
    nature: 'Factures_General',
  },
];

// Configuration des colonnes par défaut
const colonnesParDefaut: Colonne[] = [
  { id: 'numero', label: 'N° Facture', visible: true, sortable: true },
  { id: 'client', label: 'Client', visible: true, sortable: true },
  { id: 'type', label: 'Type', visible: true, sortable: true },
  { id: 'dateEmission', label: 'Date émission', visible: true, sortable: true },
  { id: 'dateEcheance', label: 'Date échéance', visible: true, sortable: true },
  { id: 'origine', label: 'Origine', visible: true, sortable: true },
  { id: 'nature', label: 'Nature', visible: true, sortable: true },
  { id: 'montantHT', label: 'Montant HT', visible: true, sortable: true },
  { id: 'montantTVA', label: 'TVA', visible: false, sortable: true },
  { id: 'montantTTC', label: 'Montant TTC', visible: true, sortable: true },
  { id: 'statut', label: 'Statut', visible: true, sortable: true },
  { id: 'reference', label: 'Référence', visible: true, sortable: true },
];

// Fonction pour générer une phrase descriptive selon le statut ou l'action
const genererDetailAction = (action: string, typeAction: TypeAction, metadonneeAvant?: string, metadonneeApres?: string): string => {
  // Pour les statuts techniques
  if (typeAction === 'statut_technique') {
    switch (action) {
      case 'Rejetée':
        return 'La facture est rejetée par la plateforme (non conforme)';
      case 'Déposée':
        return 'La facture est prise en charge par la plateforme d\'émission';
      default:
        return `Statut technique : ${action}`;
    }
  }

  // Pour les statuts métiers
  if (typeAction === 'statut_metier' || typeAction === 'changement_statut_manuel' || typeAction === 'changement_statut_api') {
    switch (action) {
      case 'Emise par la plateforme':
        return 'La facture est envoyée à la plateforme de réception';
      case 'Complétée':
        return 'La facture est complétée suite à une suspension';
      case 'Encaissée':
        return 'Le paiement de la facture a été réceptionné';
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

// Fonction pour générer un historique cohérent en fonction de la facture
const genererHistoriqueFacture = (facture: FactureVente): EvenementHistorique[] => {
  const historique: EvenementHistorique[] = [];
  const dateEmission = facture.dateEmission || '2025-10-01';
  const dateBase = `${dateEmission.substring(0, 4)}-${dateEmission.substring(5, 7)}-${dateEmission.substring(8, 10)}`;

  // Toutes les factures commencent par "Déposée"
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

  // Sinon, on passe à "Emise par la plateforme"
  historique.push({
    dateHeure: `${dateBase} 08:32:45`,
    utilisateur: 'Système',
    typeAction: 'statut_metier',
    action: 'Emise par la plateforme',
    detailAction: genererDetailAction('Emise par la plateforme', 'statut_metier'),
  });

  // Si le statut actuel est "Déposée", on a juste la déposition
  if (facture.statut === 'Déposée') {
    return historique;
  }

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

  // Ajouter une consultation pour les autres statuts
  historique.push({
    dateHeure: `${dateBase} 10:15:32`,
    utilisateur: 'Marie Dubois',
    adresseIp: '192.168.1.55',
    typeAction: 'consultation',
    action: 'Consultation',
    detailAction: genererDetailAction('Consultation', 'consultation'),
  });

  // Calculer la date du lendemain
  const dateSuivante = new Date(dateBase);
  dateSuivante.setDate(dateSuivante.getDate() + 1);
  const dateJ1 = dateSuivante.toISOString().split('T')[0];

  // Gestion des différents statuts métiers
  switch (facture.statut) {
    case 'Complétée':
      historique.push({
        dateHeure: `${dateJ1} 09:45:12`,
        utilisateur: 'Système',
        typeAction: 'changement_statut_manuel',
        action: 'Complétée',
        detailAction: genererDetailAction('Complétée', 'changement_statut_manuel'),
      });
      break;

    case 'Encaissée': {
      const dateJ3 = new Date(dateSuivante);
      dateJ3.setDate(dateJ3.getDate() + 25);
      const dateJ3Str = dateJ3.toISOString().split('T')[0];

      historique.push({
        dateHeure: `${dateJ3Str} 14:32:08`,
        utilisateur: 'Système',
        typeAction: 'changement_statut_api',
        action: 'Encaissée',
        detailAction: genererDetailAction('Encaissée', 'changement_statut_api'),
      });
      break;
    }
  }

  return historique;
};

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

// Métadonnées fictives - Conformes au paramétrage dans MetadonneesIXFacture
// Pour les Factures Sortantes (FS = Factures de Vente), seules les métadonnées avec visibiliteFS sont affichées
const metadonneesFictives: Metadonnee[] = [
  {
    id: '1',
    label: 'Code projet',
    type: 'select',
    valeur: 'Projet A',
    options: ['Projet A', 'Projet B', 'Projet C'],
  },
  {
    id: '2',
    label: 'Commentaire interne',
    type: 'text',
    valeur: 'Facture émise et envoyée au client',
  },
];

const FacturesVenteIxfacture = () => {
  // États pour les modales
  const [modaleRechercheOuverte, setModaleRechercheOuverte] = useState(false);
  const [modaleColonnesOuverte, setModaleColonnesOuverte] = useState(false);
  const [modaleDetailOuverte, setModaleDetailOuverte] = useState(false);

  // État pour l'onglet actif dans la modale de détail
  const [ongletActif, setOngletActif] = useState(0);

  // États pour les menus déroulants
  const [anchorExporter, setAnchorExporter] = useState<null | HTMLElement>(null);
  const [anchorTelecharger, setAnchorTelecharger] = useState<null | HTMLElement>(null);

  // États pour le tableau
  const [factures, setFactures] = useState<FactureVente[]>(facturesVenteFictives);
  const [facturesSelectionnees, setFacturesSelectionnees] = useState<string[]>([]);
  const [colonnes, setColonnes] = useState<Colonne[]>(colonnesParDefaut);
  const [ordreTriColonne, setOrdreTriColonne] = useState<keyof FactureVente>('numero');
  const [directionTri, setDirectionTri] = useState<'asc' | 'desc'>('asc');

  // États pour la facture sélectionnée
  const [factureSelectionnee, setFactureSelectionnee] = useState<FactureVente | null>(null);
  const [metadonnees, setMetadonnees] = useState<Metadonnee[]>(metadonneesFictives);

  // États pour la recherche
  const [critereRecherche, setCritereRecherche] = useState({
    numero: '',
    client: '',
    dateDebut: '',
    dateFin: '',
  });

  // État pour la recherche rapide dans la barre d'actions
  const [rechercheRapide, setRechercheRapide] = useState('');

  // Handlers pour les menus déroulants
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

  const ouvrirModaleDetail = (facture: FactureVente) => {
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
  const demanderTri = (colonne: keyof FactureVente) => {
    const estAsc = ordreTriColonne === colonne && directionTri === 'asc';
    setDirectionTri(estAsc ? 'desc' : 'asc');
    setOrdreTriColonne(colonne);
  };

  // Fonction de tri des factures
  const facturesTriees = [...factures].sort((a, b) => {
    const valeurA = a[ordreTriColonne];
    const valeurB = b[ordreTriColonne];

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
  const toggleVisibiliteColonne = (colonneId: keyof FactureVente) => {
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
      client: '',
      dateDebut: '',
      dateFin: '',
    });
  };

  // Handler pour appliquer la recherche
  const appliquerRecherche = () => {
    let resultats = [...facturesVenteFictives];

    if (critereRecherche.numero) {
      resultats = resultats.filter((f) =>
        f.numero.toLowerCase().includes(critereRecherche.numero.toLowerCase())
      );
    }

    if (critereRecherche.client) {
      resultats = resultats.filter((f) =>
        f.client.toLowerCase().includes(critereRecherche.client.toLowerCase())
      );
    }

    if (critereRecherche.dateDebut) {
      resultats = resultats.filter((f) => f.dateEmission >= critereRecherche.dateDebut);
    }

    if (critereRecherche.dateFin) {
      resultats = resultats.filter((f) => f.dateEmission <= critereRecherche.dateFin);
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

  // Formater une date YYYY-MM-DD en DD/MM/YYYY
  const formaterDateAffichage = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    // Format d'entrée : YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Obtenir la couleur du chip de statut
  const obtenirCouleurStatut = (statut: StatutFacture): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (statut) {
      // Statuts techniques
      case 'Rejetée':
        return 'error';
      case 'Déposée':
        return 'info';

      // Statuts métiers
      case 'Emise par la plateforme':
        return 'primary';
      case 'Complétée':
        return 'success';
      case 'Encaissée':
        return 'success';

      default:
        return 'default';
    }
  };

  // Obtenir la couleur d'une action dans l'historique
  const obtenirCouleurAction = (action: string, typeAction: TypeAction): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    // Pour les statuts, utiliser la même couleur que dans le tableau
    if (typeAction === 'statut_technique' || typeAction === 'statut_metier' || typeAction === 'changement_statut_manuel' || typeAction === 'changement_statut_api') {
      // Vérifier si l'action correspond à un statut connu
      const statutsPossibles: StatutFacture[] = [
        'Rejetée',
        'Déposée',
        'Emise par la plateforme',
        'Complétée',
        'Encaissée',
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
                        {col.id === 'montantHT' ||
                        col.id === 'montantTVA' ||
                        col.id === 'montantTTC' ? (
                          formaterMontant(facture[col.id] as number)
                        ) : col.id === 'statut' ? (
                          <Chip
                            label={facture.statut}
                            color={obtenirCouleurStatut(facture.statut)}
                            size="small"
                          />
                        ) : (
                          facture[col.id]
                        )}
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
            color={obtenirCouleurStatut(factureSelectionnee?.statut || 'Déposée')}
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
                  <Paper elevation={0} sx={{ p: 2 }}>
                    {/* Informations du client */}
                    <Typography variant="h6" gutterBottom>
                      Informations du client
                    </Typography>
                    <Box sx={{ display: 'grid', mb: 2, gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Nom du client</Typography>
                        <Typography variant="body2">{factureSelectionnee?.client || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Type de client</Typography>
                        <Typography variant="body2">{factureSelectionnee?.type || '-'}</Typography>
                      </Box>
                    </Box>

                    {/* Informations générales de la facture */}
                    <Typography variant="h6" gutterBottom>
                      Informations de la facture
                    </Typography>
                    <Box sx={{ display: 'grid', mb: 2, gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Numéro</Typography>
                        <Typography variant="body2">{factureSelectionnee?.numero || '-'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Date émission</Typography>
                        <Typography variant="body2">{formaterDateAffichage(factureSelectionnee?.dateEmission)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Date échéance</Typography>
                        <Typography variant="body2">{formaterDateAffichage(factureSelectionnee?.dateEcheance)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Référence</Typography>
                        <Typography variant="body2">{factureSelectionnee?.reference || '-'}</Typography>
                      </Box>
                    </Box>

                    {/* Montants */}
                    <Typography variant="h6" gutterBottom>
                      Montants
                    </Typography>
                    <Box sx={{ display: 'flex', mt: 2, flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>Total HT</Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {formaterMontant(factureSelectionnee?.montantHT || 0)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>Total TVA</Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {formaterMontant(factureSelectionnee?.montantTVA || 0)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total TTC</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {formaterMontant(factureSelectionnee?.montantTTC || 0)}
                        </Typography>
                      </Box>
                    </Box>
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
                          Facture de vente
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {factureSelectionnee?.numero}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date : {formaterDateAffichage(factureSelectionnee?.dateEmission)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Échéance : {formaterDateAffichage(factureSelectionnee?.dateEcheance)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Informations vendeur et client */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mb: 4 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                          De : Votre Entreprise
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Entreprise iXbus
                        </Typography>
                        <Typography variant="body2">
                          123 Avenue des Technologies
                        </Typography>
                        <Typography variant="body2">
                          75001 Paris
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          SIRET : 123 456 789 00012
                        </Typography>
                        <Typography variant="body2">
                          N° TVA : FR12345678901
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                          À : Client
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {factureSelectionnee?.client}
                        </Typography>
                        <Typography variant="body2">
                          Adresse client
                        </Typography>
                        <Typography variant="body2">
                          Code postal Ville
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Type : {factureSelectionnee?.type}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Lignes de la facture - Exemple fictif */}
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
                          <TableRow>
                            <TableCell>Prestation de service</TableCell>
                            <TableCell align="right">1</TableCell>
                            <TableCell align="right">{formaterMontant((factureSelectionnee?.montantHT || 0))}</TableCell>
                            <TableCell align="right">20%</TableCell>
                            <TableCell align="right">{formaterMontant(factureSelectionnee?.montantHT || 0)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Pied de facture avec totaux */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Box sx={{ minWidth: 300 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Total HT :</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee?.montantHT || 0)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Total TVA :</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee?.montantTVA || 0)}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: 'primary.light', p: 1, borderRadius: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total TTC :</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {formaterMontant(factureSelectionnee?.montantTTC || 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Note de bas de page */}
                    <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" align="center" display="block">
                        Facture conforme - Référence : {factureSelectionnee?.reference}
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
                        Cette facture a été émise par un canal tiers (courrier papier, mail, API) et non via une plateforme agréée. Elle ne fera donc pas l'objet de mise à jour de statuts sur la plateforme agréée.
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
              label="Client"
              value={critereRecherche.client}
              onChange={(e) =>
                setCritereRecherche({ ...critereRecherche, client: e.target.value })
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
                  client: '',
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
      titre="Factures de vente iXFacture"
      sousTitre="Consultation et suivi des factures clients"
    >
      {contenu}
    </UtilisateurIxBus>
  );
};

export default FacturesVenteIxfacture;

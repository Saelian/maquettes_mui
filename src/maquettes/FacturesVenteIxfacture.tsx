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
import { genererHistoriqueFacture } from './FEVente/genererHistoriqueFacture';
import { facturesVenteFictives } from './FEVente/facturesVenteFictives';
import { LigneFactureVente } from './FEVente/facturesVenteFictives';
import { StatutEmission } from '../types/StatutEmission';
import { StatutReception } from '../types/StatutReception';
import { TypeAction } from '../types/TypeAction';
import ModaleImportFactureCorrective from '../composants/ModaleImportFactureCorrective';

type StatutFacture = StatutEmission | StatutReception;

// Type pour l'origine de la facture (comment la facture a été créée)
type OrigineFacture = 'Saisie manuelle' | 'Import manuel' | 'API';

// Type pour la destination de la facture (où elle est envoyée)
type DestinationFacture = 'PA' | 'CPP' | 'Mail';

// Type pour la nature de la facture
type NatureFacture = 'Factures_ERP1' | 'Factures_ERP2' | 'Factures_General';


// Interface pour une facture de vente
export interface FactureVente {
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
  origine: OrigineFacture; // Comment la facture a été créée (Saisie manuelle, Import manuel, API)
  destination: DestinationFacture; // Où la facture est envoyée (PA = Plateforme Agréée, CPP = Chorus Pro Portal, Mail = Envoi par mail)
  nature: NatureFacture; // Nature de routage de la facture
  lignes: LigneFactureVente[]; // Lignes de facturation
  emailsDestinatairesMail?: string[]; // Adresses email des destinataires (uniquement si destination = 'Mail')
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

// Colonnes disponibles pour le tableau
interface Colonne {
  id: keyof FactureVente;
  label: string;
  visible: boolean;
  sortable: boolean;
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

// Configuration des colonnes par défaut
const colonnesParDefaut: Colonne[] = [
  { id: 'numero', label: 'N° Facture', visible: true, sortable: true },
  { id: 'client', label: 'Client', visible: true, sortable: true },
  { id: 'type', label: 'Type', visible: false, sortable: true },
  { id: 'dateEmission', label: 'Date émission', visible: false, sortable: true },
  { id: 'dateEcheance', label: 'Date échéance', visible: true, sortable: true },
  { id: 'origine', label: 'Origine', visible: true, sortable: true },
  { id: 'destination', label: 'Destination', visible: true, sortable: true },
  { id: 'nature', label: 'Nature', visible: true, sortable: true },
  { id: 'montantHT', label: 'Montant HT', visible: true, sortable: true },
  { id: 'montantTVA', label: 'TVA', visible: false, sortable: true },
  { id: 'montantTTC', label: 'Montant TTC', visible: true, sortable: true },
  { id: 'reference', label: 'Référence', visible: true, sortable: true },
  { id: 'statut', label: 'Statut', visible: true, sortable: true },

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
  const [modaleImportCorrectiveOuverte, setModaleImportCorrectiveOuverte] = useState(false);

  // État pour l'onglet actif dans la modale de détail
  const [ongletActif, setOngletActif] = useState(0);

  // États pour les menus déroulants
  const [anchorStatuer, setAnchorStatuer] = useState<null | HTMLElement>(null);
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
    typesDocument: [] as string[],
    montantMin: '',
    montantMax: '',
    devise: 'TOUS',
    modeFacturation: 'TOUS',
    origine: 'TOUS' as 'TOUS' | 'Saisie manuelle' | 'Import manuel' | 'API',
    destination: 'TOUS' as 'TOUS' | 'PA' | 'CPP',
  });

  // État pour la recherche rapide dans la barre d'actions
  const [rechercheRapide, setRechercheRapide] = useState('');

  // Handlers pour les menus déroulants
  const ouvrirMenuStatuer = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorStatuer(event.currentTarget);
  };

  const fermerMenuStatuer = () => {
    setAnchorStatuer(null);
  };

  // Fonction pour passer au statut "Encaissée"
  const changerStatutEncaissee = () => {
    facturesSelectionnees.forEach((id) => {
      setFactures((prev) =>
        prev.map((f) => (f.id === id ? { ...f, statut: 'Encaissée' } : f))
      );
    });
    setFacturesSelectionnees([]);
    fermerMenuStatuer();
  };

  // Vérifier si au moins une facture peut être passée à "Encaissée"
  // Les factures avec les statuts suivants peuvent passer à "Encaissée" :
  // Complétée, Mise à disposition, Prise en charge, Approuvée, Approuvée partiellement, Paiement transmis
  const peutPasserEncaissee = (): boolean => {
    if (facturesSelectionnees.length === 0) return false;

    const facturesSelectionneesList = factures.filter((f) =>
      facturesSelectionnees.includes(f.id)
    );

    const statutsAutorises: StatutFacture[] = [
      'Complétée',
      'Mise à disposition',
      'Prise en charge',
      'Approuvée',
      'Approuvée partiellement',
      'Paiement transmis'
    ];

    return facturesSelectionneesList.some((f) => statutsAutorises.includes(f.statut));
  };

  // Vérifier si au moins une facture peut être passée à "Complétée"
  // Seules les factures avec statut "Suspendue" peuvent passer à "Complétée"
  const peutPasserCompletee = (): boolean => {
    if (facturesSelectionnees.length === 0) return false;

    const facturesSelectionneesList = factures.filter((f) =>
      facturesSelectionnees.includes(f.id)
    );

    return facturesSelectionneesList.some((f) => f.statut === 'Suspendue');
  };

  // Vérifier si le bouton "Statuer" doit être activé
  const peutStatuer = (): boolean => {
    return peutPasserEncaissee() || peutPasserCompletee();
  };

  // Fonction pour ouvrir la modale d'import de facture corrective
  const ouvrirModaleImportCorrective = () => {
    fermerMenuStatuer();
    setModaleImportCorrectiveOuverte(true);
  };

  const fermerModaleImportCorrective = () => {
    setModaleImportCorrectiveOuverte(false);
  };

  // Fonction pour gérer l'import d'une facture corrective et passer au statut "Complétée"
  const handleImporterFactureCorrective = (fichier: File) => {
    console.log('Import de la facture corrective:', fichier.name);

    // Passer les factures sélectionnées au statut "Complétée"
    facturesSelectionnees.forEach((id) => {
      setFactures((prev) =>
        prev.map((f) => (f.id === id && f.statut === 'Suspendue' ? { ...f, statut: 'Complétée' } : f))
      );
    });

    setFacturesSelectionnees([]);
    fermerModaleImportCorrective();
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

  // Handler pour réinitialiser uniquement les colonnes
  const reinitialiserColonnes = () => setColonnes(colonnesParDefaut);

  // Handler pour appliquer la recherche
  const appliquerRecherche = () => {
    let resultats = [...facturesVenteFictives];

    // Filtre par numéro de facture
    if (critereRecherche.numero) {
      resultats = resultats.filter((f) =>
        f.numero.toLowerCase().includes(critereRecherche.numero.toLowerCase())
      );
    }

    // Filtre par client
    if (critereRecherche.client) {
      resultats = resultats.filter((f) =>
        f.client.toLowerCase().includes(critereRecherche.client.toLowerCase())
      );
    }

    // Filtre par dates
    if (critereRecherche.dateDebut) {
      resultats = resultats.filter((f) => f.dateEmission >= critereRecherche.dateDebut);
    }

    if (critereRecherche.dateFin) {
      resultats = resultats.filter((f) => f.dateEmission <= critereRecherche.dateFin);
    }

    // Filtre par montant TTC
    if (critereRecherche.montantMin) {
      const montantMin = parseFloat(critereRecherche.montantMin);
      resultats = resultats.filter((f) => f.montantTTC >= montantMin);
    }

    if (critereRecherche.montantMax) {
      const montantMax = parseFloat(critereRecherche.montantMax);
      resultats = resultats.filter((f) => f.montantTTC <= montantMax);
    }

    // Filtre par origine
    if (critereRecherche.origine !== 'TOUS') {
      resultats = resultats.filter((f) => f.origine === critereRecherche.origine);
    }

    // Filtre par destination
    if (critereRecherche.destination !== 'TOUS') {
      resultats = resultats.filter((f) => f.destination === critereRecherche.destination);
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
      // Statuts techniques PA émission
      case 'Rejetée':
        return 'error';
      case 'Déposée':
        return 'info';

      // Statuts métiers PA émission
      case 'Emise par la plateforme':
        return 'primary';
      case 'Complétée':
        return 'success';
      case 'Encaissée':
        return 'success';
      case 'Envoyé par mail':
        return 'default';

      // Statuts techniques PA réception (reçus du système)
      case 'Reçue de la plateforme':
        return 'info';
      case 'Mise à disposition':
        return 'info';

      // Statuts métiers PA réception (reçus du système)
      case 'Prise en charge':
        return 'primary';
      case 'Approuvée':
        return 'success';
      case 'Approuvée partiellement':
        return 'warning';
      case 'En litige':
        return 'warning';
      case 'Suspendue':
        return 'warning';
      case 'Refusée':
        return 'error';
      case 'Paiement transmis':
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
        // Statuts PA émission
        'Rejetée',
        'Déposée',
        'Emise par la plateforme',
        'Complétée',
        'Encaissée',
        'Envoyé par mail',
        // Statuts PA réception
        'Reçue de la plateforme',
        'Mise à disposition',
        'Prise en charge',
        'Approuvée',
        'Approuvée partiellement',
        'En litige',
        'Suspendue',
        'Refusée',
        'Paiement transmis',
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
                disabled={!peutStatuer()}
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
            {peutPasserEncaissee() && (
              <MenuItem onClick={changerStatutEncaissee}>
                Encaissée
              </MenuItem>
            )}
            {peutPasserCompletee() && (
              <MenuItem onClick={ouvrirModaleImportCorrective}>
                Complétée
              </MenuItem>
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
                        ) : col.id === 'lignes' ? (
                          `${facture.lignes.length} ligne${facture.lignes.length > 1 ? 's' : ''}`
                        ) : (
                          String(facture[col.id])
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
                    <Typography color="primary" variant="h6" gutterBottom>
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
                    <Typography color="primary" variant="h6" gutterBottom>
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

                    {/* Lignes de facturation */}
                    {factureSelectionnee?.lignes && factureSelectionnee.lignes.length > 0 && (
                      <>
                        <Typography color="primary" variant="h6" gutterBottom>
                          Lignes de facturation ({factureSelectionnee.lignes.length})
                        </Typography>

                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Quantité</TableCell>
                                <TableCell align="right">Unité</TableCell>
                                <TableCell align="right">Prix unit. HT</TableCell>
                                <TableCell align="right">TVA</TableCell>
                                <TableCell align="right">Montant HT</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {factureSelectionnee.lignes.map((ligne) => (
                                <TableRow key={ligne.numeroLigne}>
                                  <TableCell>{ligne.designation}</TableCell>
                                  <TableCell align="right">{ligne.quantite}</TableCell>
                                  <TableCell align="right">{ligne.unite}</TableCell>
                                  <TableCell align="right">{formaterMontant(ligne.prixUnitaireHT)}</TableCell>
                                  <TableCell align="right">{ligne.tauxTVA}%</TableCell>
                                  <TableCell align="right">{formaterMontant(ligne.montantHT)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}

                    {/* Montants */}

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
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
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
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1,  }}>
                          Vendeur
                        </Typography>
                        <Typography variant="body2" >
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
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1,  }}>
                          Acheteur
                        </Typography>
                        <Typography variant="body2" >
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

                    {/* Lignes de la facture */}
                    <TableContainer sx={{ mb: 3 }}>
                      <Table>
                        <TableHead>
                          <TableRow >
                            <TableCell >Description</TableCell>
                            <TableCell align="right" >Qté</TableCell>
                            <TableCell align="right" >Unité</TableCell>
                            <TableCell align="right" >Prix unit.</TableCell>
                            <TableCell align="right" >TVA</TableCell>
                            <TableCell align="right" >Montant HT</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {factureSelectionnee?.lignes.map((ligne) => (
                            <TableRow key={ligne.numeroLigne}>
                              <TableCell>{ligne.designation}</TableCell>
                              <TableCell align="right">{ligne.quantite}</TableCell>
                              <TableCell align="right">{ligne.unite}</TableCell>
                              <TableCell align="right">{formaterMontant(ligne.prixUnitaireHT)}</TableCell>
                              <TableCell align="right">{ligne.tauxTVA}%</TableCell>
                              <TableCell align="right">{formaterMontant(ligne.montantHT)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Pied de facture avec totaux */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, borderColor: 'divider' }}>
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
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderRadius: 1 }}>
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
                    <Typography color="primary" variant="h6" gutterBottom>
                      Origine de la facture
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Cette facture a été créée par :
                      </Typography>
                      <Chip
                        label={factureSelectionnee?.origine}
                        color={factureSelectionnee?.origine === 'API' ? 'primary' : 'default'}
                        size="medium"
                        variant="outlined"
                      />
                    </Box>

                  </Paper>

                  {/* Destination de la facture */}
                  <Paper elevation={0} sx={{ p: 2 }}>
                    <Typography color="primary" variant="h6" gutterBottom>
                      Destination de la facture
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Cette facture est envoyée vers :
                      </Typography>
                      <Chip
                        label={
                          factureSelectionnee?.destination === 'PA'
                            ? 'Plateforme Agréée (PA)'
                            : factureSelectionnee?.destination === 'CPP'
                            ? 'Chorus Pro Portal (CPP)'
                            : 'Envoi par mail'
                        }
                        color={
                          factureSelectionnee?.destination === 'PA'
                            ? 'primary'
                            : factureSelectionnee?.destination === 'CPP'
                            ? 'secondary'
                            : 'default'
                        }
                        size="medium"
                      />
                    </Box>

                    {factureSelectionnee?.destination === 'Mail' && factureSelectionnee?.emailsDestinatairesMail && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Destinataires de la facture :
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {factureSelectionnee.emailsDestinatairesMail.map((email, index) => (
                            <Chip
                              key={index}
                              label={email}
                              variant="outlined"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
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
                        color="default"
                        variant="outlined"
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
                          {factureSelectionnee && genererHistoriqueFacture(factureSelectionnee).map((evenement, index) => (
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
        <DialogTitle>Recherche avancée de factures de vente</DialogTitle>
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
                  placeholder="Ex: FV-2025-0001"
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

            {/* Section 2: Client */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Client</Typography>
              <TextField
                label="Nom du client"
                value={critereRecherche.client}
                onChange={(e) => setCritereRecherche({ ...critereRecherche, client: e.target.value })}
                fullWidth
                size="small"
                placeholder="Nom du client"
              />
            </Box>

            <Divider />

            {/* Section 3: Dates */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Période d'émission</Typography>
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

            {/* Section 5: Origine et Destination */}
            <Box>
              <Typography sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Origine et Destination</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Origine"
                  select
                  value={critereRecherche.origine}
                  onChange={(e) => setCritereRecherche({ ...critereRecherche, origine: e.target.value as typeof critereRecherche.origine })}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="TOUS">Toutes les origines</MenuItem>
                  <MenuItem value="Saisie manuelle">Saisie manuelle</MenuItem>
                  <MenuItem value="Import manuel">Import manuel</MenuItem>
                  <MenuItem value="API">API</MenuItem>
                </TextField>
                <TextField
                  label="Destination"
                  select
                  value={critereRecherche.destination}
                  onChange={(e) => setCritereRecherche({ ...critereRecherche, destination: e.target.value as typeof critereRecherche.destination })}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="TOUS">Toutes les destinations</MenuItem>
                  <MenuItem value="PA">Plateforme Agréée (PA)</MenuItem>
                  <MenuItem value="CPP">Chorus Pro Portal (CPP)</MenuItem>
                </TextField>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setCritereRecherche({
                numero: '',
                client: '',
                dateDebut: '',
                dateFin: '',
                typesDocument: [],
                montantMin: '',
                montantMax: '',
                devise: 'TOUS',
                modeFacturation: 'TOUS',
                origine: 'TOUS',
                destination: 'TOUS',
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

      {/* Modale d'import de facture corrective */}
      <ModaleImportFactureCorrective
        ouvert={modaleImportCorrectiveOuverte}
        onFermer={fermerModaleImportCorrective}
        onImporter={handleImporterFactureCorrective}
        numeroFacture={
          factures.find((f) => facturesSelectionnees.includes(f.id) && f.statut === 'Suspendue')?.numero || ''
        }
      />
    </Box>
  );

  return (
    <UtilisateurIxBus titre="Factures de ventes ">
      {contenu}
    </UtilisateurIxBus>
  );
};

export default FacturesVenteIxfacture;

import { useState } from 'react';
import {
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
} from '@mui/material';
import {
  Add as AddIcon,
  Upload as UploadIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  ViewColumn as ViewColumnIcon,
  RestartAlt as RestartAltIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

// Interface pour une facture
interface Facture {
  id: string;
  numero: string;
  destinataire: string;
  dateEmission: string;
  dateEcheance: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  reference: string;
}

// Colonnes disponibles pour le tableau
interface Colonne {
  id: keyof Facture;
  label: string;
  visible: boolean;
  sortable: boolean;
}

// Données fictives de factures
const facturesFictives: Facture[] = [
  {
    id: '1',
    numero: 'FAC-2025-001',
    destinataire: 'Entreprise Martin SA',
    dateEmission: '2025-10-01',
    dateEcheance: '2025-10-31',
    montantHT: 1250.00,
    montantTVA: 250.00,
    montantTTC: 1500.00,
    reference: 'CMD-2025-045',
  },
  {
    id: '2',
    numero: 'FAC-2025-002',
    destinataire: 'Société Durand SARL',
    dateEmission: '2025-10-02',
    dateEcheance: '2025-11-02',
    montantHT: 3400.00,
    montantTVA: 680.00,
    montantTTC: 4080.00,
    reference: 'CMD-2025-046',
  },
  {
    id: '3',
    numero: 'FAC-2025-003',
    destinataire: 'Établissements Petit & Fils',
    dateEmission: '2025-10-03',
    dateEcheance: '2025-11-03',
    montantHT: 890.50,
    montantTVA: 178.10,
    montantTTC: 1068.60,
    reference: 'CMD-2025-047',
  },
  {
    id: '4',
    numero: 'FAC-2025-004',
    destinataire: 'Groupe Bernard Industries',
    dateEmission: '2025-10-04',
    dateEcheance: '2025-11-04',
    montantHT: 5670.00,
    montantTVA: 1134.00,
    montantTTC: 6804.00,
    reference: 'CMD-2025-048',
  },
  {
    id: '5',
    numero: 'FAC-2025-005',
    destinataire: 'Thomas Distribution',
    dateEmission: '2025-10-05',
    dateEcheance: '2025-11-05',
    montantHT: 2340.75,
    montantTVA: 468.15,
    montantTTC: 2808.90,
    reference: 'CMD-2025-049',
  },
  {
    id: '6',
    numero: 'FAC-2025-006',
    destinataire: 'Richard Consulting',
    dateEmission: '2025-10-06',
    dateEcheance: '2025-11-06',
    montantHT: 1890.00,
    montantTVA: 378.00,
    montantTTC: 2268.00,
    reference: 'CMD-2025-050',
  },
];

// Configuration des colonnes par défaut
const colonnesParDefaut: Colonne[] = [
  { id: 'numero', label: 'N° Facture', visible: true, sortable: true },
  { id: 'destinataire', label: 'Destinataire', visible: true, sortable: true },
  { id: 'dateEmission', label: 'Date émission', visible: true, sortable: true },
  { id: 'dateEcheance', label: 'Date échéance', visible: true, sortable: true },
  { id: 'montantHT', label: 'Montant HT', visible: true, sortable: true },
  { id: 'montantTVA', label: 'TVA', visible: false, sortable: true },
  { id: 'montantTTC', label: 'Montant TTC', visible: true, sortable: true },
  { id: 'reference', label: 'Référence', visible: true, sortable: true },
];

const PrepareriXFacture = () => {
  // États pour les modales
  const [modaleCreationOuverte, setModaleCreationOuverte] = useState(false);
  const [modaleImportOuverte, setModaleImportOuverte] = useState(false);
  const [modaleRechercheOuverte, setModaleRechercheOuverte] = useState(false);
  const [modaleColonnesOuverte, setModaleColonnesOuverte] = useState(false);

  // États pour les menus déroulants
  const [anchorExporter, setAnchorExporter] = useState<null | HTMLElement>(null);
  const [anchorTelecharger, setAnchorTelecharger] = useState<null | HTMLElement>(null);

  // États pour le tableau
  const [factures, setFactures] = useState<Facture[]>(facturesFictives);
  const [facturesSelectionnees, setFacturesSelectionnees] = useState<string[]>([]);
  const [colonnes, setColonnes] = useState<Colonne[]>(colonnesParDefaut);
  const [ordreTriColonne, setOrdreTriColonne] = useState<keyof Facture>('numero');
  const [directionTri, setDirectionTri] = useState<'asc' | 'desc'>('asc');

  // États pour le formulaire de création
  const [nouvelleFacture, setNouvelleFacture] = useState<Partial<Facture>>({
    numero: '',
    destinataire: '',
    dateEmission: '',
    dateEcheance: '',
    montantHT: 0,
    montantTVA: 0,
    montantTTC: 0,
    reference: '',
  });

  // États pour la recherche
  const [critereRecherche, setCritereRecherche] = useState({
    numero: '',
    destinataire: '',
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
  const ouvrirModaleCreation = () => setModaleCreationOuverte(true);
  const fermerModaleCreation = () => {
    setModaleCreationOuverte(false);
    setNouvelleFacture({
      numero: '',
      destinataire: '',
      dateEmission: '',
      dateEcheance: '',
      montantHT: 0,
      montantTVA: 0,
      montantTTC: 0,
      reference: '',
    });
  };

  const ouvrirModaleImport = () => setModaleImportOuverte(true);
  const fermerModaleImport = () => setModaleImportOuverte(false);

  const ouvrirModaleRecherche = () => setModaleRechercheOuverte(true);
  const fermerModaleRecherche = () => setModaleRechercheOuverte(false);

  const ouvrirModaleColonnes = () => setModaleColonnesOuverte(true);
  const fermerModaleColonnes = () => setModaleColonnesOuverte(false);

  // Handler pour créer une facture
  const creerFacture = () => {
    const factureComplete: Facture = {
      id: Date.now().toString(),
      numero: nouvelleFacture.numero || '',
      destinataire: nouvelleFacture.destinataire || '',
      dateEmission: nouvelleFacture.dateEmission || '',
      dateEcheance: nouvelleFacture.dateEcheance || '',
      montantHT: nouvelleFacture.montantHT || 0,
      montantTVA: nouvelleFacture.montantTVA || 0,
      montantTTC: nouvelleFacture.montantTTC || 0,
      reference: nouvelleFacture.reference || '',
    };
    setFactures([...factures, factureComplete]);
    fermerModaleCreation();
  };

  // Handler pour supprimer les factures sélectionnées
  const supprimerFactures = () => {
    setFactures(factures.filter((f) => !facturesSelectionnees.includes(f.id)));
    setFacturesSelectionnees([]);
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
  const demanderTri = (colonne: keyof Facture) => {
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
  const toggleVisibiliteColonne = (colonneId: keyof Facture) => {
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
      destinataire: '',
      dateDebut: '',
      dateFin: '',
    });
  };

  // Handler pour appliquer la recherche
  const appliquerRecherche = () => {
    let resultats = [...facturesFictives];

    if (critereRecherche.numero) {
      resultats = resultats.filter((f) =>
        f.numero.toLowerCase().includes(critereRecherche.numero.toLowerCase())
      );
    }

    if (critereRecherche.destinataire) {
      resultats = resultats.filter((f) =>
        f.destinataire.toLowerCase().includes(critereRecherche.destinataire.toLowerCase())
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

  const contenu = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Barre d'actions supérieure */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          mt: 2,
        }}
      >
        <Toolbar
          sx={{
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Tooltip title="Créer une nouvelle facture">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={ouvrirModaleCreation}
            >
              Créer
            </Button>
          </Tooltip>

          <Tooltip title="Importer un fichier UBL/CII/Factur-X">
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={ouvrirModaleImport}
            >
              Importer
            </Button>
          </Tooltip>

          <Tooltip title="Transmettre les factures sélectionnées">
            <span>
              <Button
                variant="outlined"
                startIcon={<SendIcon />}
                disabled={facturesSelectionnees.length === 0}
              >
                Transmettre
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Supprimer les factures sélectionnées">
            <span>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={supprimerFactures}
                disabled={facturesSelectionnees.length === 0}
              >
                Supprimer
              </Button>
            </span>
          </Tooltip>

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
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
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
                >
                  <TableCell padding="checkbox">
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

      {/* Modale de création de facture */}
      <Dialog
        open={modaleCreationOuverte}
        onClose={fermerModaleCreation}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Créer une nouvelle facture</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Numéro de facture"
              variant='standard'
              value={nouvelleFacture.numero}
              onChange={(e) =>
                setNouvelleFacture({ ...nouvelleFacture, numero: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Destinataire"
              variant='standard'
              value={nouvelleFacture.destinataire}
              onChange={(e) =>
                setNouvelleFacture({ ...nouvelleFacture, destinataire: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Date d'émission"
              variant='standard'
              type="date"
              value={nouvelleFacture.dateEmission}
              onChange={(e) =>
                setNouvelleFacture({ ...nouvelleFacture, dateEmission: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Date d'échéance"
              variant='standard'
              type="date"
              value={nouvelleFacture.dateEcheance}
              onChange={(e) =>
                setNouvelleFacture({ ...nouvelleFacture, dateEcheance: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Montant HT"
              variant='standard'
              type="number"
              value={nouvelleFacture.montantHT}
              onChange={(e) => {
                const montantHT = parseFloat(e.target.value) || 0;
                const montantTVA = montantHT * 0.2;
                const montantTTC = montantHT + montantTVA;
                setNouvelleFacture({
                  ...nouvelleFacture,
                  montantHT,
                  montantTVA,
                  montantTTC,
                });
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              fullWidth
              required
            />
            <TextField
              label="Montant TVA (20%)"
              variant='standard'
              type="number"
              value={nouvelleFacture.montantTVA}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                readOnly: true,
              }}
              fullWidth
            />
            <TextField
              label="Montant TTC"
              variant='standard'
              type="number"
              value={nouvelleFacture.montantTTC}
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                readOnly: true,
              }}
              fullWidth
            />
            <TextField
              label="Référence"
              variant='standard'
              value={nouvelleFacture.reference}
              onChange={(e) =>
                setNouvelleFacture({ ...nouvelleFacture, reference: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fermerModaleCreation}>Annuler</Button>
          <Button onClick={creerFacture} variant="contained">
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modale d'import de fichier */}
      <Dialog open={modaleImportOuverte} onClose={fermerModaleImport} maxWidth="sm" fullWidth>
        <DialogTitle>Importer une facture</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Formats acceptés : UBL, CII, Factur-X (conformes à la réforme de la
              facturation électronique 2026)
            </Typography>
            <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
              Sélectionner un fichier
              <input type="file" hidden accept=".xml,.pdf" />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fermerModaleImport}>Annuler</Button>
          <Button onClick={fermerModaleImport} variant="contained">
            Importer
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
              label="Destinataire"
              value={critereRecherche.destinataire}
              onChange={(e) =>
                setCritereRecherche({ ...critereRecherche, destinataire: e.target.value })
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
                  destinataire: '',
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
      titre="Préparer iXFacture"
      sousTitre="Gestion et préparation des factures de vente"
    >
      {contenu}
    </UtilisateurIxBus>
  );
};

export default PrepareriXFacture;

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
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  ViewColumn as ViewColumnIcon,
  RestartAlt as RestartAltIcon,
  Clear as ClearIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

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
  statut: 'Émise' | 'Reçue par acheteur' | 'Validée' | 'Refusée' | 'Payée';
  reference: string;
}

// Interface pour l'historique d'une facture
interface EvenementHistorique {
  date: string;
  statut: string;
  utilisateur: string;
  commentaire?: string;
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

// Données fictives de factures de vente
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
    statut: 'Émise',
    reference: 'CMD-VTE-145',
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
    statut: 'Reçue par acheteur',
    reference: 'CMD-VTE-146',
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
    statut: 'Validée',
    reference: 'CMD-VTE-147',
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
    statut: 'Validée',
    reference: 'CMD-VTE-148',
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
    statut: 'Refusée',
    reference: 'CMD-VTE-149',
  },
];

// Configuration des colonnes par défaut
const colonnesParDefaut: Colonne[] = [
  { id: 'numero', label: 'N° Facture', visible: true, sortable: true },
  { id: 'client', label: 'Client', visible: true, sortable: true },
  { id: 'type', label: 'Type', visible: true, sortable: true },
  { id: 'dateEmission', label: 'Date émission', visible: true, sortable: true },
  { id: 'dateEcheance', label: 'Date échéance', visible: true, sortable: true },
  { id: 'montantHT', label: 'Montant HT', visible: true, sortable: true },
  { id: 'montantTVA', label: 'TVA', visible: false, sortable: true },
  { id: 'montantTTC', label: 'Montant TTC', visible: true, sortable: true },
  { id: 'statut', label: 'Statut', visible: true, sortable: true },
  { id: 'reference', label: 'Référence', visible: true, sortable: true },
];

// Historique fictif pour une facture
const historiqueFactureFictif: EvenementHistorique[] = [
  {
    date: '2025-10-01 09:15:00',
    statut: 'Émise',
    utilisateur: 'Système',
    commentaire: 'Facture générée et envoyée au client',
  },
  {
    date: '2025-10-02 11:20:00',
    statut: 'Reçue par acheteur',
    utilisateur: 'Portail client',
    commentaire: 'Facture téléchargée par le client',
  },
  {
    date: '2025-10-03 15:45:00',
    statut: 'Validée',
    utilisateur: 'Client - Jean Dupont',
    commentaire: 'Facture validée par le service comptabilité client',
  },
];

// Métadonnées fictives
const metadonneesFictives: Metadonnee[] = [
  {
    id: '1',
    label: 'Centre de profit',
    type: 'select',
    valeur: 'CP-001',
    options: ['CP-001', 'CP-002', 'CP-003', 'CP-004'],
  },
  {
    id: '2',
    label: 'Projet',
    type: 'select',
    valeur: 'PRJ-2025-15',
    options: ['PRJ-2025-15', 'PRJ-2025-16', 'PRJ-2025-17'],
  },
  {
    id: '3',
    label: 'Commercial responsable',
    type: 'text',
    valeur: 'Sophie Durand',
  },
  {
    id: '4',
    label: 'Date de paiement attendue',
    type: 'date',
    valeur: '2025-10-30',
  },
  {
    id: '5',
    label: 'Montant HT initial',
    type: 'number',
    valeur: '15000',
  },
  {
    id: '6',
    label: 'Type de vente',
    type: 'select',
    valeur: 'Prestation de service',
    options: ['Prestation de service', 'Vente de biens', 'Location', 'Maintenance'],
  },
];

const FacturesVenteIxfacture = () => {
  // États pour les modales
  const [modaleRechercheOuverte, setModaleRechercheOuverte] = useState(false);
  const [modaleColonnesOuverte, setModaleColonnesOuverte] = useState(false);
  const [modaleDetailOuverte, setModaleDetailOuverte] = useState(false);

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

  // Obtenir la couleur du chip de statut
  const obtenirCouleurStatut = (statut: FactureVente['statut']) => {
    switch (statut) {
      case 'Émise':
        return 'info';
      case 'Reçue par acheteur':
        return 'default';
      case 'Validée':
        return 'success';
      case 'Refusée':
        return 'error';
      case 'Payée':
        return 'success';
      default:
        return 'default';
    }
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
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Détail de la facture {factureSelectionnee?.numero}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 3, mt: 1, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            {/* Colonne gauche - Aperçu PDF */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Paper
                elevation={3}
                sx={{
                  height: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  p: 2,
                }}
              >
                <PictureAsPdfIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Aperçu de la facture PDF
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Facture {factureSelectionnee?.numero}
                  <br />
                  {factureSelectionnee?.client}
                  <br />
                  {formaterMontant(factureSelectionnee?.montantTTC || 0)}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  sx={{ mt: 3 }}
                >
                  Télécharger le PDF
                </Button>
              </Paper>
            </Box>

            {/* Colonne droite - Historique et Métadonnées */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Historique */}
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Historique de la facture
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    {historiqueFactureFictif.map((evenement, index) => (
                      <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip
                                label={evenement.statut}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary">
                                {evenement.date}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                                {evenement.utilisateur}
                              </Typography>
                              {evenement.commentaire && (
                                <Typography variant="body2" component="span" sx={{ display: 'block', mt: 0.5 }}>
                                  {evenement.commentaire}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>

                {/* Métadonnées */}
                <Paper elevation={2} sx={{ p: 2 }}>
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
            </Box>
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

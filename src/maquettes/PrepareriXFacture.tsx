import { useState, useMemo } from 'react';
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
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  ListItemIcon,
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
  TableChart as TableChartIcon,
  GridOn as GridOnIcon,
  Email as EmailIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';
import { ChampFactureAvecCode } from '../composants/factures/ChampFactureAvecCode';
import { GestionLignesFacture } from '../composants/factures/GestionLignesFacture';
import type {
  FactureElectronique,
  CodeTypeDocument,
  ModeFacturation,
  LigneFacture,
  TotauxFacture,
  Partie,
  CodeCategorieTVA,
} from '../types/factureEN16931';
import {
  formaterDateFacture,
  validerFormatIdentifiant,
  calculerMontantTVA,
  arrondirMontant,
  MODES_FACTURATION,
} from '../utils/validationFacture';
import {
  FACTURE_B2B_STANDARD,
  FACTURE_TVA_MIXTE,
  FACTURE_ACOMPTE,
  AVOIR_EXEMPLE,
  FACTURE_B2C_EXEMPLE,
  ACHETEUR_EXEMPLE,
  VENDEUR_EXEMPLE,
  NOTES_LEGALES_FRANCE,
  NOTE_TRAITEMENT_B2B,
} from '../utils/donneesExemplesFactures';

// Type pour distinguer facture d'achat et de vente
type TypeFacture = 'ACHAT' | 'VENTE';

// Type pour la destination des factures de vente
type DestinationFactureVente = 'PA' | 'Mail';

// Ajout d'un ID et d'un type Achat/Vente aux exemples de factures complets
const facturesExemplesCompletes: (FactureElectronique & { id: string; typeFacture: TypeFacture; destination?: DestinationFactureVente; emailsDestinatairesMail?: string[] })[] = [
  { ...FACTURE_B2B_STANDARD, id: '1', typeFacture: 'VENTE', destination: 'PA' },
  { ...FACTURE_TVA_MIXTE, id: '2', typeFacture: 'VENTE', destination: 'PA' },
  { ...FACTURE_ACOMPTE, id: '3', typeFacture: 'VENTE', destination: 'PA' },
  { ...AVOIR_EXEMPLE, id: '4', typeFacture: 'VENTE', destination: 'PA' },
  { ...FACTURE_B2C_EXEMPLE, id: '5', typeFacture: 'VENTE', destination: 'PA' },
  {
    ...FACTURE_B2B_STANDARD,
    id: '6',
    numero: 'ACH-2025-001',
    vendeur: ACHETEUR_EXEMPLE, // On inverse vendeur/acheteur pour simuler un achat
    acheteur: VENDEUR_EXEMPLE,
    typeFacture: 'ACHAT',
  },
  {
    ...FACTURE_B2B_STANDARD,
    id: '7',
    numero: 'VMAIL-2025-001',
    typeFacture: 'VENTE',
    destination: 'Mail',
    emailsDestinatairesMail: ['client@entreprise.fr', 'comptabilite@entreprise.fr'],
  },
  {
    ...FACTURE_TVA_MIXTE,
    id: '8',
    numero: 'VMAIL-2025-002',
    typeFacture: 'VENTE',
    destination: 'Mail',
    emailsDestinatairesMail: ['facturation@client.com'],
  },
];

// Mapping des codes types de documents
const TYPE_DOCUMENT_LABELS: Record<string, string> = {
  '380': 'Facture commerciale',
  '381': 'Avoir',
  '384': 'Facture rectificative',
  '386': "Facture d'acompte",
};

// Codes de types de documents filtrés (380 à 386)
const CODES_TYPE_DOCUMENT_FILTRES = ['380', '381', '384', '386'] as const;

// Mapping des modes de facturation avec descriptions
const MODE_FACTURATION_LABELS: Record<string, string> = {
  'B1': "B1 : Dépôt d'une facture de bien",
  'S1': "S1 : Dépôt d'une facture de prestation de service",
  'M1': "M1 : Dépôt d'une facture double",
  'B2': "B2 : Dépôt d'une facture de bien déjà payée",
  'S2': "S2 : Dépôt d'une facture de prestation de service déjà payée",
  'M2': "M2 : Dépôt d'une facture double déjà payée",
  'B4': "B4 : Dépôt d'une facture définitive (après acompte) de bien",
  'S4': "S4 : Dépôt d'une facture définitive (après acompte) de service",
  'M4': "M4 : Dépôt d'une facture définitive (après acompte) double",
  'S5': "S5 : Dépôt par un sous-traitant d'une facture de prestation de service",
  'S6': "S6 : Dépôt par un cotraitant d'une facture de prestation de service",
  'B7': "B7 : Dépôt d'une facture de bien ayant fait l'objet d'un e-reporting",
  'S7': "S7 : Dépôt d'une facture de service ayant fait l'objet d'un e-reporting",
};

// Colonnes disponibles pour le tableau
interface Colonne {
  id: 'numero' | 'dateEmission' | 'typeDocument' | 'vendeur' | 'acheteur' | 'montantTTC' | 'montantDu' | 'devise' | 'nombreLignes' | 'typeFacture' | 'destination';
  label: string;
  codeBT: string;
  visible: boolean;
  sortable: boolean;
}

// Configuration des colonnes conformes EN16931
const colonnesParDefaut: Colonne[] = [
  { id: 'numero', label: 'Numéro facture', codeBT: 'BT-1', visible: true, sortable: true },
  { id: 'dateEmission', label: 'Date émission', codeBT: 'BT-2', visible: true, sortable: true },
  { id: 'typeDocument', label: 'Type document', codeBT: 'BT-3', visible: true, sortable: true },
  { id: 'vendeur', label: 'Vendeur', codeBT: 'BT-27', visible: true, sortable: true },
  { id: 'acheteur', label: 'Acheteur', codeBT: 'BT-44', visible: true, sortable: true },
  { id: 'montantTTC', label: 'Montant TTC', codeBT: 'BT-112', visible: true, sortable: true },
  { id: 'montantDu', label: 'Montant dû', codeBT: 'BT-115', visible: true, sortable: true },
  { id: 'devise', label: 'Devise', codeBT: 'BT-5', visible: false, sortable: true },
  { id: 'nombreLignes', label: 'Nb lignes', codeBT: 'BG-25', visible: true, sortable: true },
  { id: 'typeFacture', label: 'Type (Achat/Vente)', codeBT: '-', visible: true, sortable: true },
  { id: 'destination', label: 'Destination', codeBT: '-', visible: true, sortable: true },
];

const PrepareriXFacture = () => {
  // --- STATES ---
  const [modaleFactureOuverte, setModaleFactureOuverte] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [modePreparation, setModePreparation] = useState<'manuel' | 'import'>('manuel');
  const [modaleRechercheOuverte, setModaleRechercheOuverte] = useState(false);
  const [modaleColonnesOuverte, setModaleColonnesOuverte] = useState(false);
  const [anchorPreparer, setAnchorPreparer] = useState<null | HTMLElement>(null);
  const [anchorExporter, setAnchorExporter] = useState<null | HTMLElement>(null);
  const [anchorTelecharger, setAnchorTelecharger] = useState<null | HTMLElement>(null);
  const [factures, setFactures] = useState(facturesExemplesCompletes);
  const [factureActive, setFactureActive] = useState<Partial<FactureElectronique> & { typeFacture?: TypeFacture; id?: string; destination?: DestinationFactureVente; emailsDestinatairesMail?: string[]; }>({});
  const [facturesSelectionnees, setFacturesSelectionnees] = useState<string[]>([]);
  const [colonnes, setColonnes] = useState<Colonne[]>(colonnesParDefaut);
  const [ordreTriColonne, setOrdreTriColonne] = useState<Colonne['id']>('numero');
  const [directionTri, setDirectionTri] = useState<'asc' | 'desc'>('asc');
  const [critereRecherche, setCritereRecherche] = useState({
    numero: '',
    vendeur: '',
    acheteur: '',
    dateDebut: '',
    dateFin: '',
    typeFacture: 'TOUS' as 'TOUS' | TypeFacture,
    typesDocument: [] as string[],
    montantMin: '',
    montantMax: '',
    devise: 'TOUS',
    modeFacturation: 'TOUS'
  });
  const [rechercheRapide, setRechercheRapide] = useState('');

  // --- HANDLERS & LOGIC ---

  const recalculerTotaux = (lignes: LigneFacture[]): TotauxFacture => {
    const sommeMontsNetsLignes = lignes.reduce((acc, ligne) => acc + ligne.montantNet, 0);
    const detailsTVAMap = new Map<number, { montantBase: number; montantTVA: number; codeCategorie: CodeCategorieTVA }>();
    lignes.forEach((ligne) => {
      const taux = ligne.informationTVA.taux || 0;
      const montantBase = ligne.montantNet;
      const montantTVA = calculerMontantTVA(montantBase, taux);
      if (detailsTVAMap.has(taux)) {
        const detail = detailsTVAMap.get(taux)!;
        detail.montantBase += montantBase;
        detail.montantTVA += montantTVA;
      } else {
        detailsTVAMap.set(taux, { montantBase, montantTVA, codeCategorie: ligne.informationTVA.codeCategorie });
      }
    });
    const detailsTVA = Array.from(detailsTVAMap.entries()).map(([taux, detail]) => ({ codeCategorie: detail.codeCategorie, taux, montantBase: arrondirMontant(detail.montantBase), montantTVA: arrondirMontant(detail.montantTVA) }));
    const montantTotalHT = arrondirMontant(sommeMontsNetsLignes);
    const montantTotalTVA = arrondirMontant(detailsTVA.reduce((acc, d) => acc + d.montantTVA, 0));
    const montantTotalTTC = arrondirMontant(montantTotalHT + montantTotalTVA);
    return { sommeMontsNetsLignes: montantTotalHT, montantTotalHT, montantTotalTVA, montantTotalTTC, montantDu: montantTotalTTC, detailsTVA };
  };

  useMemo(() => {
    if (factureActive.lignes) {
      setFactureActive((prev) => ({ ...prev, totaux: recalculerTotaux(prev.lignes || []) }));
    }
    }, [factureActive.lignes]);

  const facturesTriees = useMemo(() => {
    return [...factures]
      .filter((f) => {
        // Filtre par type de facture (Achat/Vente/Tous)
        if (critereRecherche.typeFacture !== 'TOUS' && f.typeFacture !== critereRecherche.typeFacture) return false;

        // Filtre par numéro de facture
        if (critereRecherche.numero && !f.numero.toLowerCase().includes(critereRecherche.numero.toLowerCase())) return false;

        // Filtre par type de document
        if (critereRecherche.typesDocument.length > 0 && !critereRecherche.typesDocument.includes(f.typeDocument)) return false;

        // Filtre par vendeur
        if (critereRecherche.vendeur && !f.vendeur?.nom.toLowerCase().includes(critereRecherche.vendeur.toLowerCase())) return false;

        // Filtre par acheteur
        if (critereRecherche.acheteur && !f.acheteur?.nom.toLowerCase().includes(critereRecherche.acheteur.toLowerCase())) return false;

        // Filtre par dates
        if (critereRecherche.dateDebut) {
          const dateDebut = critereRecherche.dateDebut.replace(/-/g, '');
          if (f.dateEmission < dateDebut) return false;
        }
        if (critereRecherche.dateFin) {
          const dateFin = critereRecherche.dateFin.replace(/-/g, '');
          if (f.dateEmission > dateFin) return false;
        }

        // Filtre par montant TTC
        if (critereRecherche.montantMin) {
          const montantMin = parseFloat(critereRecherche.montantMin);
          if ((f.totaux?.montantTotalTTC || 0) < montantMin) return false;
        }
        if (critereRecherche.montantMax) {
          const montantMax = parseFloat(critereRecherche.montantMax);
          if ((f.totaux?.montantTotalTTC || 0) > montantMax) return false;
        }

        // Filtre par devise
        if (critereRecherche.devise !== 'TOUS' && f.codeDevise !== critereRecherche.devise) return false;

        // Filtre par mode de facturation
        if (critereRecherche.modeFacturation !== 'TOUS' && f.modeFacturation !== critereRecherche.modeFacturation) return false;

        // Recherche rapide (barre de recherche)
        if (rechercheRapide) {
          const terms = rechercheRapide.toLowerCase().split(' ');
          const searchableContent = [f.numero, f.vendeur?.nom, f.acheteur?.nom, f.totaux?.montantTotalTTC?.toString()].join(' ').toLowerCase();
          return terms.every(term => searchableContent.includes(term));
        }

        return true;
      })
      .sort((a, b) => {
        let valeurA: string | number | undefined, valeurB: string | number | undefined;
        switch (ordreTriColonne) {
          case 'vendeur': valeurA = a.vendeur?.nom; valeurB = b.vendeur?.nom; break;
          case 'acheteur': valeurA = a.acheteur?.nom; valeurB = b.acheteur?.nom; break;
          case 'montantTTC': valeurA = a.totaux?.montantTotalTTC; valeurB = b.totaux?.montantTotalTTC; break;
          case 'montantDu': valeurA = a.totaux?.montantDu; valeurB = b.totaux?.montantDu; break;
          case 'devise': valeurA = a.codeDevise; valeurB = b.codeDevise; break;
          case 'nombreLignes': valeurA = a.lignes?.length; valeurB = b.lignes?.length; break;
          default: valeurA = a[ordreTriColonne as keyof FactureElectronique] as string; valeurB = b[ordreTriColonne as keyof FactureElectronique] as string;
        }
        valeurA = valeurA ?? ''; valeurB = valeurB ?? '';
        if (typeof valeurA === 'string' && typeof valeurB === 'string') return directionTri === 'asc' ? valeurA.localeCompare(valeurB) : valeurB.localeCompare(valeurA);
        if (typeof valeurA === 'number' && typeof valeurB === 'number') return directionTri === 'asc' ? valeurA - valeurB : valeurB - valeurA;
        return 0;
      });
  }, [factures, ordreTriColonne, directionTri, critereRecherche, rechercheRapide]);

  const ouvrirMenuPreparer = (event: React.MouseEvent<HTMLElement>) => setAnchorPreparer(event.currentTarget);
  const fermerMenuPreparer = () => setAnchorPreparer(null);

  const handleOuvrirModaleCreation = (mode: 'manuel' | 'import') => {
    setModePreparation(mode);
    setModeEdition(false);
    setFactureActive({
      id: Date.now().toString(),
      identifiantSpecification: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
      modeFacturation: 'B1',
      numero: `FACT-${new Date().getFullYear()}-${String(factures.length + 1).padStart(4, '0')}`,
      dateEmission: formaterDateFacture(new Date()),
      typeDocument: '380',
      codeDevise: 'EUR',
      typeFacture: 'VENTE',
      vendeur: VENDEUR_EXEMPLE,
      acheteur: ACHETEUR_EXEMPLE,
      notes: NOTES_LEGALES_FRANCE.concat([NOTE_TRAITEMENT_B2B]),
      lignes: [],
      destination: 'PA',
      emailsDestinatairesMail: [],
    });
    fermerMenuPreparer();
    setModaleFactureOuverte(true);
  };

  const handleOuvrirModaleEdition = (facture: FactureElectronique & { id: string; typeFacture: TypeFacture }) => {
    setModeEdition(true);
    setFactureActive({ ...facture });
    setModaleFactureOuverte(true);
  };

  const handleFermerModale = () => setModaleFactureOuverte(false);

  const handleSauvegarderFacture = () => {
    if (!factureActive.numero || !factureActive.lignes || factureActive.lignes.length === 0) return;
    if (modeEdition) {
      setFactures(factures.map((f) => (f.id === factureActive.id ? (factureActive as FactureElectronique & { id: string; typeFacture: TypeFacture }) : f)));
    } else {
      setFactures([...factures, factureActive as FactureElectronique & { id: string; typeFacture: TypeFacture }]);
    }
    handleFermerModale();
  };

  const handleLignesChange = (lignes: LigneFacture[]) => setFactureActive((prev) => ({ ...prev, lignes }));
  const ouvrirMenuExporter = (event: React.MouseEvent<HTMLElement>) => setAnchorExporter(event.currentTarget);
  const fermerMenuExporter = () => setAnchorExporter(null);
  const ouvrirMenuTelecharger = (event: React.MouseEvent<HTMLElement>) => setAnchorTelecharger(event.currentTarget);
  const fermerMenuTelecharger = () => setAnchorTelecharger(null);
  const ouvrirModaleRecherche = () => setModaleRechercheOuverte(true);
  const fermerModaleRecherche = () => setModaleRechercheOuverte(false);
  const appliquerRecherche = () => fermerModaleRecherche();
  const ouvrirModaleColonnes = () => setModaleColonnesOuverte(true);
  const fermerModaleColonnes = () => setModaleColonnesOuverte(false);
  const toggleVisibiliteColonne = (colonneId: Colonne['id']) => setColonnes(colonnes.map((col) => (col.id === colonneId ? { ...col, visible: !col.visible } : col)));
  const toggleSelectionFacture = (id: string) => setFacturesSelectionnees(facturesSelectionnees.includes(id) ? facturesSelectionnees.filter((fid) => fid !== id) : [...facturesSelectionnees, id]);
  const toggleSelectionTout = () => setFacturesSelectionnees(facturesSelectionnees.length === factures.length ? [] : factures.map((f) => f.id));
  const supprimerFactures = () => { setFactures(factures.filter((f) => !facturesSelectionnees.includes(f.id))); setFacturesSelectionnees([]); };
  const reinitialiserColonnes = () => setColonnes(colonnesParDefaut);
  const formaterMontant = (montant: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
  const formaterDateAffichage = (dateStr: string) => dateStr ? `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}/${dateStr.substring(0, 4)}` : '';

  const handlePartieChange = (partie: 'vendeur' | 'acheteur', champ: keyof Partie, valeur: string) => {
    setFactureActive(prev => ({ ...prev, [partie]: { ...prev[partie], [champ]: valeur } }));
  };

  const handleAdresseChange = (partie: 'vendeur' | 'acheteur', champ: string, valeur: string) => {
    setFactureActive(prev => ({ ...prev, [partie]: { ...prev[partie], adressePostale: { ...prev[partie]?.adressePostale, [champ]: valeur } } }));
  };

  const demanderTri = (colonneId: Colonne['id']) => {
    const isAsc = ordreTriColonne === colonneId && directionTri === 'asc';
    setDirectionTri(isAsc ? 'desc' : 'asc');
    setOrdreTriColonne(colonneId);
  };

  return (
    <UtilisateurIxBus titre="Préparer" sousTitre="" pageCourante="preparer-ixfacture">
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={1} sx={{ borderRadius: 0, mt: 1 }}>
          <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Préparer une nouvelle facture"><Button variant="contained" startIcon={<AddIcon />} onClick={ouvrirMenuPreparer}>Préparer</Button></Tooltip>
            <Menu anchorEl={anchorPreparer} open={Boolean(anchorPreparer)} onClose={fermerMenuPreparer}>
              <MenuItem onClick={() => handleOuvrirModaleCreation('manuel')}>Création manuelle</MenuItem>
              <MenuItem onClick={() => handleOuvrirModaleCreation('import')}>Importer un fichier</MenuItem>
            </Menu>
            <Tooltip title="Transmettre les factures sélectionnées"><span><Button variant="outlined" startIcon={<SendIcon />} disabled={facturesSelectionnees.length === 0}>Transmettre</Button></span></Tooltip>
            <Tooltip title="Supprimer les factures sélectionnées"><span><Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={supprimerFactures} disabled={facturesSelectionnees.length === 0}>Supprimer</Button></span></Tooltip>
            <Tooltip title="Rechercher des factures"><Button variant="outlined" startIcon={<SearchIcon />} onClick={ouvrirModaleRecherche}>Rechercher</Button></Tooltip>
            <Tooltip title="Exporter les factures"><Button variant="outlined" startIcon={<FileUploadIcon />} onClick={ouvrirMenuExporter}>Exporter</Button></Tooltip>
            <Menu anchorEl={anchorExporter} open={Boolean(anchorExporter)} onClose={fermerMenuExporter}>
              <MenuItem onClick={fermerMenuExporter}>
                <ListItemIcon>
                  <TableChartIcon fontSize="small" />
                </ListItemIcon>
                CSV
              </MenuItem>
              <MenuItem onClick={fermerMenuExporter}>
                <ListItemIcon>
                  <GridOnIcon fontSize="small" />
                </ListItemIcon>
                Excel
              </MenuItem>
              <MenuItem onClick={fermerMenuExporter}>
                <ListItemIcon>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                Mail
              </MenuItem>
            </Menu>
            <Tooltip title="Télécharger au format"><Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={ouvrirMenuTelecharger}>Télécharger</Button></Tooltip>
            <Menu anchorEl={anchorTelecharger} open={Boolean(anchorTelecharger)} onClose={fermerMenuTelecharger}>
              <MenuItem onClick={fermerMenuTelecharger}>
                <ListItemIcon>
                  <CodeIcon fontSize="small" />
                </ListItemIcon>
                UBL
              </MenuItem>
              <MenuItem onClick={fermerMenuTelecharger}>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                CII
              </MenuItem>
              <MenuItem onClick={fermerMenuTelecharger}>
                <ListItemIcon>
                  <PictureAsPdfIcon fontSize="small" />
                </ListItemIcon>
                Factur-X
              </MenuItem>
            </Menu>
            <TextField placeholder="Rechercher..." variant="standard" size="small" value={rechercheRapide} onChange={(e) => setRechercheRapide(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }} sx={{ flexGrow: 1, minWidth: '200px' }} />
            <Tooltip title="Gérer les colonnes"><Button variant="outlined" startIcon={<ViewColumnIcon />} onClick={ouvrirModaleColonnes}>Colonnes</Button></Tooltip>
          </Toolbar>
        </Paper>

        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 1 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}><Table stickyHeader>
            <TableHead><TableRow>
              <TableCell padding="checkbox"><Checkbox indeterminate={facturesSelectionnees.length > 0 && facturesSelectionnees.length < facturesTriees.length} checked={facturesTriees.length > 0 && facturesSelectionnees.length === facturesTriees.length} onChange={toggleSelectionTout} /></TableCell>
              {colonnes.filter((col) => col.visible).map((col) => (
                <TableCell key={col.id}>
                  <TableSortLabel active={ordreTriColonne === col.id} direction={ordreTriColonne === col.id ? directionTri : 'asc'} onClick={() => demanderTri(col.id)}>{col.label}</TableSortLabel>
                </TableCell>
              ))}
            </TableRow></TableHead>
            <TableBody>
              {facturesTriees.map((facture) => (
                <TableRow key={facture.id} hover onClick={() => handleOuvrirModaleEdition(facture)} selected={facturesSelectionnees.includes(facture.id)} sx={{ cursor: 'pointer' }}>
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}><Checkbox checked={facturesSelectionnees.includes(facture.id)} onChange={() => toggleSelectionFacture(facture.id)} /></TableCell>
                  {colonnes.filter((col) => col.visible).map((col) => (
                    <TableCell key={col.id}>{
                      (() => {
                        switch (col.id) {
                          case 'vendeur': return facture.vendeur?.nom;
                          case 'acheteur': return facture.acheteur?.nom;
                          case 'montantTTC': return formaterMontant(facture.totaux?.montantTotalTTC || 0);
                          case 'montantDu': return formaterMontant(facture.totaux?.montantDu || 0);
                          case 'devise': return facture.codeDevise;
                          case 'nombreLignes': return facture.lignes?.length || 0;
                          case 'dateEmission': return formaterDateAffichage(facture.dateEmission);
                          case 'typeDocument': return TYPE_DOCUMENT_LABELS[facture.typeDocument] || facture.typeDocument;
                          case 'typeFacture': return <Chip label={facture.typeFacture} size="small" color={facture.typeFacture === 'VENTE' ? 'primary' : 'secondary'} />;
                          case 'destination': return facture.typeFacture === 'VENTE' ? ('destination' in facture ? (facture as typeof factureActive).destination || 'PA' : 'PA') : '-';
                          default: return facture[col.id as keyof FactureElectronique] as string;
                        }
                      })()
                    }</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table></TableContainer>
        </Box>

        <Dialog open={modaleFactureOuverte} onClose={handleFermerModale} maxWidth={false} PaperProps={{ sx: { width: '90vw', height: '90vh' } }}>
          <DialogTitle>{modeEdition ? 'Modifier la facture' : 'Préparer une facture'}</DialogTitle>
          <DialogContent sx={{ overflow: 'auto' }}>
            {modePreparation === 'manuel' ? (
              <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {!modeEdition && (
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Type de facture</FormLabel>
                    <RadioGroup
                      row
                      value={factureActive.typeFacture || 'VENTE'}
                      onChange={(e) => {
                        const newType = e.target.value as TypeFacture;
                        setFactureActive({
                          ...factureActive,
                          typeFacture: newType,
                          vendeur: newType === 'VENTE' ? VENDEUR_EXEMPLE : ACHETEUR_EXEMPLE,
                          acheteur: newType === 'ACHAT' ? VENDEUR_EXEMPLE : ACHETEUR_EXEMPLE,
                          destination: newType === 'VENTE' ? 'PA' : undefined,
                          emailsDestinatairesMail: newType === 'VENTE' ? [] : undefined
                        });
                      }}
                    >
                      <FormControlLabel value="VENTE" control={<Radio />} label="Facture de vente" />
                      <FormControlLabel value="ACHAT" control={<Radio />} label="Facture d'achat" />
                    </RadioGroup>
                  </FormControl>
                )}
                {!modeEdition && factureActive.typeFacture === 'VENTE' && (
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Destination de la facture</FormLabel>
                    <RadioGroup
                      row
                      value={factureActive.destination || 'PA'}
                      onChange={(e) => {
                        const newDestination = e.target.value as DestinationFactureVente;
                        setFactureActive({
                          ...factureActive,
                          destination: newDestination,
                          emailsDestinatairesMail: newDestination === 'Mail' ? [] : undefined
                        });
                      }}
                    >
                      <FormControlLabel value="PA" control={<Radio />} label="Plateforme Agréée (PA)" />
                      <FormControlLabel value="Mail" control={<Radio />} label="Envoi par mail" />
                    </RadioGroup>
                    {factureActive.destination === 'Mail' && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          label="Adresses email des destinataires"
                          fullWidth
                          multiline
                          rows={3}
                          value={(factureActive.emailsDestinatairesMail || []).join(', ')}
                          onChange={(e) => {
                            const emails = e.target.value.split(',').map(email => email.trim()).filter(email => email);
                            setFactureActive({ ...factureActive, emailsDestinatairesMail: emails });
                          }}
                          placeholder="exemple1@email.com, exemple2@email.com"
                          helperText="Séparez les adresses email par des virgules"
                        />
                      </Box>
                    )}
                  </FormControl>
                )}
                <Box>
                  <Typography variant="h6" color='primary' sx={{  mb: 2 }}>{factureActive.typeFacture === 'VENTE' ? 'Informations du client (Acheteur)' : 'Informations du fournisseur (Vendeur)'}</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <ChampFactureAvecCode codeBT={factureActive.typeFacture === 'VENTE' ? 'BT-44' : 'BT-27'} label="Nom" obligatoire textFieldProps={{ value: (factureActive.typeFacture === 'VENTE' ? factureActive.acheteur?.nom : factureActive.vendeur?.nom) || '', onChange: (e) => handlePartieChange(factureActive.typeFacture === 'VENTE' ? 'acheteur' : 'vendeur', 'nom', e.target.value) }} />
                    <ChampFactureAvecCode codeBT={factureActive.typeFacture === 'VENTE' ? 'BT-46' : 'BT-29'} label="SIRET" textFieldProps={{ value: (factureActive.typeFacture === 'VENTE' ? factureActive.acheteur?.siret : factureActive.vendeur?.siret) || '', onChange: (e) => handlePartieChange(factureActive.typeFacture === 'VENTE' ? 'acheteur' : 'vendeur', 'siret', e.target.value) }} />
                    <ChampFactureAvecCode codeBT="BT-50" label="Adresse" textFieldProps={{ value: (factureActive.typeFacture === 'VENTE' ? factureActive.acheteur?.adressePostale?.ligne1 : factureActive.vendeur?.adressePostale?.ligne1) || '', onChange: (e) => handleAdresseChange(factureActive.typeFacture === 'VENTE' ? 'acheteur' : 'vendeur', 'ligne1', e.target.value) }} />
                    <ChampFactureAvecCode codeBT="BT-53" label="Code Postal" textFieldProps={{ value: (factureActive.typeFacture === 'VENTE' ? factureActive.acheteur?.adressePostale?.codePostal : factureActive.vendeur?.adressePostale?.codePostal) || '', onChange: (e) => handleAdresseChange(factureActive.typeFacture === 'VENTE' ? 'acheteur' : 'vendeur', 'codePostal', e.target.value) }} />
                    <ChampFactureAvecCode codeBT="BT-52" label="Ville" textFieldProps={{ value: (factureActive.typeFacture === 'VENTE' ? factureActive.acheteur?.adressePostale?.ville : factureActive.vendeur?.adressePostale?.ville) || '', onChange: (e) => handleAdresseChange(factureActive.typeFacture === 'VENTE' ? 'acheteur' : 'vendeur', 'ville', e.target.value) }} />
                    <ChampFactureAvecCode codeBT="BT-55" label="Pays" obligatoire textFieldProps={{ value: (factureActive.typeFacture === 'VENTE' ? factureActive.acheteur?.adressePostale?.codePays : factureActive.vendeur?.adressePostale?.codePays) || 'FR', onChange: (e) => handleAdresseChange(factureActive.typeFacture === 'VENTE' ? 'acheteur' : 'vendeur', 'codePays', e.target.value) }} />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h6" color='primary' sx={{  mb: 2 }}>Informations générales de la facture</Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <ChampFactureAvecCode codeBT="BT-1" label="Numéro de facture" obligatoire textFieldProps={{ value: factureActive.numero || '', onChange: (e) => setFactureActive({ ...factureActive, numero: e.target.value }), error: !validerFormatIdentifiant(factureActive.numero || ''), helperText: factureActive.numero && !validerFormatIdentifiant(factureActive.numero) ? 'Format invalide' : '' }} />
                    <ChampFactureAvecCode codeBT="BT-2" label="Date d'émission" obligatoire textFieldProps={{ type: 'date', value: factureActive.dateEmission ? `${factureActive.dateEmission.substring(0, 4)}-${factureActive.dateEmission.substring(4, 6)}-${factureActive.dateEmission.substring(6, 8)}` : '', onChange: (e) => { const [y, m, d] = e.target.value.split('-'); setFactureActive({ ...factureActive, dateEmission: `${y}${m}${d}` }); }, InputLabelProps: { shrink: true } }} />
                    <ChampFactureAvecCode codeBT="BT-3" label="Type de document" obligatoire textFieldProps={{ select: true, value: factureActive.typeDocument || '380', onChange: (e) => setFactureActive({ ...factureActive, typeDocument: e.target.value as CodeTypeDocument }), children: CODES_TYPE_DOCUMENT_FILTRES.map((code) => (<MenuItem key={code} value={code}>{`${code} - ${TYPE_DOCUMENT_LABELS[code]}`}</MenuItem>)) }} />
                    <ChampFactureAvecCode codeBT="BT-23" label="Mode de facturation" textFieldProps={{ select: true, value: factureActive.modeFacturation || 'B1', onChange: (e) => setFactureActive({ ...factureActive, modeFacturation: e.target.value as ModeFacturation }), children: MODES_FACTURATION.map((mode) => (<MenuItem key={mode} value={mode}>{MODE_FACTURATION_LABELS[mode]}</MenuItem>)) }} />
                    <ChampFactureAvecCode codeBT="BT-5" label="Devise" obligatoire textFieldProps={{ select: true, value: factureActive.codeDevise || 'EUR', onChange: (e) => setFactureActive({ ...factureActive, codeDevise: e.target.value }), children: [<MenuItem key="EUR" value="EUR">EUR</MenuItem>, <MenuItem key="USD" value="USD">USD</MenuItem>] }} />
                  </Box>
                </Box>
                <GestionLignesFacture lignes={factureActive.lignes || []} onChange={handleLignesChange} />
                <Box>
                  <Typography variant="h6" color='primary' sx={{  mb: 2 }}>Récapitulatif</Typography>

                  
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Total HT</Typography><Typography sx={{ fontWeight: 'bold' }}>{formaterMontant(factureActive.totaux?.montantTotalHT || 0)}</Typography></Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Total TVA</Typography><Typography sx={{ fontWeight: 'bold' }}>{formaterMontant(factureActive.totaux?.montantTotalTVA || 0)}</Typography></Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6">Total TTC</Typography><Typography variant="h6" sx={{ fontWeight: 'bold' }}>{formaterMontant(factureActive.totaux?.montantTotalTTC || 0)}</Typography></Box>
                  
                </Box>
              </Box>
            ) : (
              <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <Typography variant="h6" gutterBottom>Importer une facture existante</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: '600px', mb: 3 }}>
                  Formats acceptés : UBL, CII, Factur-X, PDF.
                  <br />
                  Si le fichier n'est pas une facture structurée (ex: PDF image), une reconnaissance optique de caractères (OCR) sera effectuée pour en extraire les données.
                </Typography>
                <Button variant="contained" component="label" startIcon={<UploadIcon />} size="large">
                  Sélectionner un fichier
                  <input type="file" hidden accept=".xml,.pdf" />
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleFermerModale}>Annuler</Button>
            <Button variant="contained" onClick={modePreparation === 'manuel' ? handleSauvegarderFacture : handleFermerModale} disabled={modePreparation === 'manuel' && (!factureActive.numero || !factureActive.lignes || factureActive.lignes.length === 0)}>{modeEdition ? 'Enregistrer' : (modePreparation === 'manuel' ? 'Créer' : 'Importer')}</Button>
          </DialogActions>
        </Dialog>

        {/* Modale Rechercher */}
        <Dialog open={modaleRechercheOuverte} onClose={fermerModaleRecherche} maxWidth="md" fullWidth>
          <DialogTitle>Recherche avancée de factures</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              {/* Section 1: Type de facture */}
              <Box>
                <Typography  sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Type de facture</Typography>
                <TextField
                  label="Type"
                  select
                  value={critereRecherche.typeFacture}
                  onChange={(e) => setCritereRecherche({ ...critereRecherche, typeFacture: e.target.value as 'TOUS' | TypeFacture })}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="TOUS">Tous (Achat et Vente)</MenuItem>
                  <MenuItem value="VENTE">Factures de vente uniquement</MenuItem>
                  <MenuItem value="ACHAT">Factures d'achat uniquement</MenuItem>
                </TextField>
              </Box>

              <Divider />

              {/* Section 2: Identification */}
              <Box>
                <Typography  sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Identification</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    label="Numéro de facture"
                    value={critereRecherche.numero}
                    onChange={(e) => setCritereRecherche({ ...critereRecherche, numero: e.target.value })}
                    fullWidth
                    size="small"
                    placeholder="Ex: FACT-2025-0001"
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

              {/* Section 3: Parties */}
              <Box>
                <Typography  sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Parties (Vendeur / Acheteur)</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    label="Vendeur"
                    value={critereRecherche.vendeur}
                    onChange={(e) => setCritereRecherche({ ...critereRecherche, vendeur: e.target.value })}
                    fullWidth
                    size="small"
                    placeholder="Nom du vendeur"
                  />
                  <TextField
                    label="Acheteur"
                    value={critereRecherche.acheteur}
                    onChange={(e) => setCritereRecherche({ ...critereRecherche, acheteur: e.target.value })}
                    fullWidth
                    size="small"
                    placeholder="Nom de l'acheteur"
                  />
                </Box>
              </Box>

              <Divider />

              {/* Section 4: Dates */}
              <Box>
                <Typography  sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Période d'émission</Typography>
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

              {/* Section 5: Montants */}
              <Box>
                <Typography  sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Montants (TTC)</Typography>
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

              {/* Section 6: Devise et Mode */}
              <Box>
                <Typography  sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>Devise et Mode de facturation</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    label="Devise"
                    select
                    value={critereRecherche.devise}
                    onChange={(e) => setCritereRecherche({ ...critereRecherche, devise: e.target.value })}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="TOUS">Toutes les devises</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                    <MenuItem value="USD">USD - Dollar américain</MenuItem>
                  </TextField>
                  <TextField
                    label="Mode de facturation"
                    select
                    value={critereRecherche.modeFacturation}
                    onChange={(e) => setCritereRecherche({ ...critereRecherche, modeFacturation: e.target.value })}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="TOUS">Tous les modes</MenuItem>
                    {MODES_FACTURATION.slice(0, 5).map((mode) => (
                      <MenuItem key={mode} value={mode}>{MODE_FACTURATION_LABELS[mode]}</MenuItem>
                    ))}
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
                  vendeur: '',
                  acheteur: '',
                  dateDebut: '',
                  dateFin: '',
                  typeFacture: 'TOUS',
                  typesDocument: [],
                  montantMin: '',
                  montantMax: '',
                  devise: 'TOUS',
                  modeFacturation: 'TOUS'
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

        <Dialog open={modaleColonnesOuverte} onClose={fermerModaleColonnes} maxWidth="xs" fullWidth>
          <DialogTitle>Gérer les colonnes</DialogTitle>
          <DialogContent><FormGroup>
            {colonnes.map((col) => <FormControlLabel key={col.id} control={<Checkbox checked={col.visible} onChange={() => toggleVisibiliteColonne(col.id)} />} label={col.label} />)}
          </FormGroup></DialogContent>
          <DialogActions>
            <Button onClick={reinitialiserColonnes} startIcon={<RestartAltIcon />}>Réinitialiser</Button>
            <Box sx={{ flex: 1 }} />
            <Button onClick={fermerModaleColonnes}>Fermer</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </UtilisateurIxBus>
  );
};

export default PrepareriXFacture;
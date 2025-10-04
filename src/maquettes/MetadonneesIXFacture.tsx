import { useState } from 'react';
import AdminIxBus from '../templates/AdminIxBus';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  Tooltip,
  Toolbar,
  InputAdornment,
  TableSortLabel,
  Tabs,
  Tab,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface Metadonnee {
  id: number;
  nomChamp: string;
  codeTechnique: string;
  typeDonnee: 'texte' | 'texte-long' | 'nombre' | 'date' | 'booleen' | 'liste';
  obligatoire: boolean;
  visibiliteFE: boolean; // Factures Entrantes
  visibiliteFS: boolean; // Factures Sortantes
  ordre: number;
  valeursPossibles?: string[];
}

interface Condition {
  id: number;
  sourceType: 'metadonnee' | 'donneeFacture';
  sourceChamp: string;
  operateur: '=' | '!=' | 'contient' | '>' | '<' | '>=' | '<=';
  valeur: string;
  lienLogique?: 'ET' | 'OU';
}

interface Action {
  id: number;
  champCible: string;
  typeValeur: 'fixe' | 'copie';
  valeur: string;
  sourceCopie?: string;
}

interface RegleCalcul {
  id: number;
  nom: string;
  conditions: Condition[];
  actions: Action[];
  ordre: number;
  active: boolean;
  gestionConflits: 'priorite' | 'derniere' | 'rien';
}

/**
 * Maquette MetadonneesIXFacture
 *
 * Écran de paramétrage des métadonnées personnalisées
 * pour la gestion des factures (entrantes ou sortantes).
 * Inclut également la gestion des règles de calcul automatique.
 */
export default function MetadonneesIXFacture() {
  const [ongletActif, setOngletActif] = useState(0);
  const [recherche, setRecherche] = useState('');
  const [dialogOuvert, setDialogOuvert] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [metadonneeSelectionnee, setMetadonneeSelectionnee] = useState<Metadonnee | null>(null);
  const [previewOuvert, setPreviewOuvert] = useState(false);
  const [metadonneesSelectionnees, setMetadonneesSelectionnees] = useState<number[]>([]);
  const [ordreTriColonne, setOrdreTriColonne] = useState<keyof Metadonnee>('ordre');
  const [directionTri, setDirectionTri] = useState<'asc' | 'desc'>('asc');

  // États pour les règles de calcul
  const [dialogRegleOuvert, setDialogRegleOuvert] = useState(false);
  const [modeEditionRegle, setModeEditionRegle] = useState(false);
  const [regleSelectionnee, setRegleSelectionnee] = useState<RegleCalcul | null>(null);
  const [reglesSelectionnees, setReglesSelectionnees] = useState<number[]>([]);

  // Données de démonstration - Métadonnées
  const [metadonnees, setMetadonnees] = useState<Metadonnee[]>([
    {
      id: 1,
      nomChamp: 'Code projet',
      codeTechnique: 'code_projet',
      typeDonnee: 'liste',
      obligatoire: true,
      visibiliteFE: false,
      visibiliteFS: true,
      ordre: 1,
      valeursPossibles: ['Projet A', 'Projet B', 'Projet C'],
    },
    {
      id: 2,
      nomChamp: 'Commentaire interne',
      codeTechnique: 'commentaire_interne',
      typeDonnee: 'texte-long',
      obligatoire: false,
      visibiliteFE: true,
      visibiliteFS: true,
      ordre: 2,
    },
    {
      id: 3,
      nomChamp: 'Date de validation',
      codeTechnique: 'date_validation',
      typeDonnee: 'date',
      obligatoire: true,
      visibiliteFE: true,
      visibiliteFS: false,
      ordre: 3,
    },
    {
      id: 4,
      nomChamp: 'Service payeur',
      codeTechnique: 'service_payeur',
      typeDonnee: 'texte',
      obligatoire: false,
      visibiliteFE: true,
      visibiliteFS: false,
      ordre: 4,
    },
  ]);

  // Données de démonstration - Règles de calcul
  const [regles, setRegles] = useState<RegleCalcul[]>([
    {
      id: 1,
      nom: 'Affectation service DSI',
      conditions: [
        {
          id: 1,
          sourceType: 'metadonnee',
          sourceChamp: 'code_projet',
          operateur: '=',
          valeur: 'Projet A',
          lienLogique: 'ET',
        },
        {
          id: 2,
          sourceType: 'donneeFacture',
          sourceChamp: 'montant',
          operateur: '>',
          valeur: '1000',
        },
      ],
      actions: [
        {
          id: 1,
          champCible: 'service_payeur',
          typeValeur: 'fixe',
          valeur: 'DSI',
        },
      ],
      ordre: 1,
      active: true,
      gestionConflits: 'priorite',
    },
    {
      id: 2,
      nom: 'Validation automatique petits montants',
      conditions: [
        {
          id: 1,
          sourceType: 'donneeFacture',
          sourceChamp: 'montant',
          operateur: '<',
          valeur: '500',
        },
      ],
      actions: [
        {
          id: 1,
          champCible: 'date_validation',
          typeValeur: 'copie',
          valeur: '',
          sourceCopie: 'date_emission',
        },
      ],
      ordre: 2,
      active: true,
      gestionConflits: 'derniere',
    },
  ]);

  // État du formulaire de règle
  const [formulaireRegle, setFormulaireRegle] = useState({
    nom: '',
    conditions: [] as Condition[],
    actions: [] as Action[],
    ordre: regles.length + 1,
    active: true,
    gestionConflits: 'priorite' as RegleCalcul['gestionConflits'],
  });

  // État du formulaire d'ajout/édition de métadonnée
  const [formulaire, setFormulaire] = useState({
    nomChamp: '',
    codeTechnique: '',
    typeDonnee: 'texte' as Metadonnee['typeDonnee'],
    obligatoire: false,
    visibiliteFE: false,
    visibiliteFS: false,
    ordre: metadonnees.length + 1,
    valeursPossibles: [] as string[],
  });

  const [nouvelleValeur, setNouvelleValeur] = useState('');

  // Données de facture disponibles pour les conditions
  const donneesFacture = [
    { code: 'idfac', label: 'ID Facture' },
    { code: 'numero', label: 'Numéro facture' },
    { code: 'fournisseur', label: 'Fournisseur' },
    { code: 'montant', label: 'Montant TTC' },
    { code: 'montant_ht', label: 'Montant HT' },
    { code: 'date_emission', label: 'Date d\'émission' },
    { code: 'date_echeance', label: 'Date d\'échéance' },
  ];

  const getLibelleType = (type: Metadonnee['typeDonnee']) => {
    const types = {
      texte: 'Texte',
      'texte-long': 'Texte long',
      nombre: 'Nombre',
      date: 'Date',
      booleen: 'Booléen',
      liste: 'Liste déroulante',
    };
    return types[type];
  };

  const getVisibiliteChips = (meta: Metadonnee) => {
    const chips = [];
    if (meta.visibiliteFE) chips.push(<Chip key="fe" label="FE" size="small" color="primary" sx={{ mr: 0.5 }} />);
    if (meta.visibiliteFS) chips.push(<Chip key="fs" label="FS" size="small" color="secondary" />);
    return chips;
  };

  const ouvrirDialogAjout = () => {
    setModeEdition(false);
    setMetadonneeSelectionnee(null);
    setFormulaire({
      nomChamp: '',
      codeTechnique: '',
      typeDonnee: 'texte',
      obligatoire: false,
      visibiliteFE: false,
      visibiliteFS: false,
      ordre: metadonnees.length + 1,
      valeursPossibles: [],
    });
    setDialogOuvert(true);
  };

  const ouvrirDialogEdition = () => {
    if (metadonneesSelectionnees.length === 1) {
      const meta = metadonnees.find((m) => m.id === metadonneesSelectionnees[0]);
      if (meta) {
        setModeEdition(true);
        setMetadonneeSelectionnee(meta);
        setFormulaire({
          nomChamp: meta.nomChamp,
          codeTechnique: meta.codeTechnique,
          typeDonnee: meta.typeDonnee,
          obligatoire: meta.obligatoire,
          visibiliteFE: meta.visibiliteFE,
          visibiliteFS: meta.visibiliteFS,
          ordre: meta.ordre,
          valeursPossibles: meta.valeursPossibles || [],
        });
        setDialogOuvert(true);
      }
    }
  };

  const fermerDialog = () => {
    setDialogOuvert(false);
    setNouvelleValeur('');
  };

  const sauvegarderMetadonnee = () => {
    if (modeEdition && metadonneeSelectionnee) {
      setMetadonnees(
        metadonnees.map((m) =>
          m.id === metadonneeSelectionnee.id
            ? { ...m, ...formulaire, valeursPossibles: formulaire.valeursPossibles }
            : m
        )
      );
    } else {
      const nouvelleMetadonnee: Metadonnee = {
        id: Math.max(...metadonnees.map((m) => m.id), 0) + 1,
        ...formulaire,
      };
      setMetadonnees([...metadonnees, nouvelleMetadonnee]);
    }
    fermerDialog();
    setMetadonneesSelectionnees([]);
  };

  const supprimerMetadonnees = () => {
    if (metadonneesSelectionnees.length > 0) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${metadonneesSelectionnees.length} métadonnée(s) ?`)) {
        setMetadonnees(metadonnees.filter((m) => !metadonneesSelectionnees.includes(m.id)));
        setMetadonneesSelectionnees([]);
      }
    }
  };

  const ajouterValeurListe = () => {
    if (nouvelleValeur.trim()) {
      setFormulaire({
        ...formulaire,
        valeursPossibles: [...formulaire.valeursPossibles, nouvelleValeur.trim()],
      });
      setNouvelleValeur('');
    }
  };

  const supprimerValeurListe = (index: number) => {
    setFormulaire({
      ...formulaire,
      valeursPossibles: formulaire.valeursPossibles.filter((_, i) => i !== index),
    });
  };

  const toggleSelectionMetadonnee = (id: number) => {
    if (metadonneesSelectionnees.includes(id)) {
      setMetadonneesSelectionnees(metadonneesSelectionnees.filter((mid) => mid !== id));
    } else {
      setMetadonneesSelectionnees([...metadonneesSelectionnees, id]);
    }
  };

  const toggleSelectionTout = () => {
    if (metadonneesSelectionnees.length === metadonneesFiltrees.length) {
      setMetadonneesSelectionnees([]);
    } else {
      setMetadonneesSelectionnees(metadonneesFiltrees.map((m) => m.id));
    }
  };

  const demanderTri = (colonne: keyof Metadonnee) => {
    const estAsc = ordreTriColonne === colonne && directionTri === 'asc';
    setDirectionTri(estAsc ? 'desc' : 'asc');
    setOrdreTriColonne(colonne);
  };

  const metadonneesFiltrees = metadonnees.filter(
    (m) =>
      m.nomChamp.toLowerCase().includes(recherche.toLowerCase()) ||
      m.codeTechnique.toLowerCase().includes(recherche.toLowerCase()) ||
      getLibelleType(m.typeDonnee).toLowerCase().includes(recherche.toLowerCase())
  );

  const metadonneesTriees = [...metadonneesFiltrees].sort((a, b) => {
    const valeurA = a[ordreTriColonne];
    const valeurB = b[ordreTriColonne];

    if (typeof valeurA === 'string' && typeof valeurB === 'string') {
      return directionTri === 'asc' ? valeurA.localeCompare(valeurB) : valeurB.localeCompare(valeurA);
    }

    if (typeof valeurA === 'number' && typeof valeurB === 'number') {
      return directionTri === 'asc' ? valeurA - valeurB : valeurB - valeurA;
    }

    if (typeof valeurA === 'boolean' && typeof valeurB === 'boolean') {
      return directionTri === 'asc' ? (valeurA === valeurB ? 0 : valeurA ? -1 : 1) : valeurB === valeurA ? 0 : valeurB ? -1 : 1;
    }

    return 0;
  });

  // Fonctions pour les règles de calcul
  const ouvrirDialogRegleAjout = () => {
    setModeEditionRegle(false);
    setRegleSelectionnee(null);
    setFormulaireRegle({
      nom: '',
      conditions: [],
      actions: [],
      ordre: regles.length + 1,
      active: true,
      gestionConflits: 'priorite',
    });
    setDialogRegleOuvert(true);
  };

  const ouvrirDialogRegleEdition = () => {
    if (reglesSelectionnees.length === 1) {
      const regle = regles.find((r) => r.id === reglesSelectionnees[0]);
      if (regle) {
        setModeEditionRegle(true);
        setRegleSelectionnee(regle);
        setFormulaireRegle({
          nom: regle.nom,
          conditions: [...regle.conditions],
          actions: [...regle.actions],
          ordre: regle.ordre,
          active: regle.active,
          gestionConflits: regle.gestionConflits,
        });
        setDialogRegleOuvert(true);
      }
    }
  };

  const fermerDialogRegle = () => {
    setDialogRegleOuvert(false);
  };

  const sauvegarderRegle = () => {
    if (modeEditionRegle && regleSelectionnee) {
      setRegles(
        regles.map((r) =>
          r.id === regleSelectionnee.id
            ? { ...r, ...formulaireRegle }
            : r
        )
      );
    } else {
      const nouvelleRegle: RegleCalcul = {
        id: Math.max(...regles.map((r) => r.id), 0) + 1,
        ...formulaireRegle,
      };
      setRegles([...regles, nouvelleRegle]);
    }
    fermerDialogRegle();
    setReglesSelectionnees([]);
  };

  const supprimerRegles = () => {
    if (reglesSelectionnees.length > 0) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${reglesSelectionnees.length} règle(s) ?`)) {
        setRegles(regles.filter((r) => !reglesSelectionnees.includes(r.id)));
        setReglesSelectionnees([]);
      }
    }
  };

  const toggleSelectionRegle = (id: number) => {
    if (reglesSelectionnees.includes(id)) {
      setReglesSelectionnees(reglesSelectionnees.filter((rid) => rid !== id));
    } else {
      setReglesSelectionnees([...reglesSelectionnees, id]);
    }
  };

  const toggleSelectionToutRegles = () => {
    if (reglesSelectionnees.length === regles.length) {
      setReglesSelectionnees([]);
    } else {
      setReglesSelectionnees(regles.map((r) => r.id));
    }
  };

  const ajouterCondition = () => {
    const nouvelleCondition: Condition = {
      id: Math.max(...formulaireRegle.conditions.map((c) => c.id), 0) + 1,
      sourceType: 'metadonnee',
      sourceChamp: '',
      operateur: '=',
      valeur: '',
      lienLogique: formulaireRegle.conditions.length > 0 ? 'ET' : undefined,
    };
    setFormulaireRegle({
      ...formulaireRegle,
      conditions: [...formulaireRegle.conditions, nouvelleCondition],
    });
  };

  const supprimerCondition = (id: number) => {
    const nouvellesConditions = formulaireRegle.conditions.filter((c) => c.id !== id);
    // Retirer le lien logique de la première condition s'il y en a une
    if (nouvellesConditions.length > 0) {
      nouvellesConditions[0].lienLogique = undefined;
    }
    setFormulaireRegle({
      ...formulaireRegle,
      conditions: nouvellesConditions,
    });
  };

  const modifierCondition = (id: number, champ: keyof Condition, valeur: unknown) => {
    setFormulaireRegle({
      ...formulaireRegle,
      conditions: formulaireRegle.conditions.map((c) =>
        c.id === id ? { ...c, [champ]: valeur } : c
      ),
    });
  };

  const ajouterAction = () => {
    const nouvelleAction: Action = {
      id: Math.max(...formulaireRegle.actions.map((a) => a.id), 0) + 1,
      champCible: '',
      typeValeur: 'fixe',
      valeur: '',
    };
    setFormulaireRegle({
      ...formulaireRegle,
      actions: [...formulaireRegle.actions, nouvelleAction],
    });
  };

  const supprimerAction = (id: number) => {
    setFormulaireRegle({
      ...formulaireRegle,
      actions: formulaireRegle.actions.filter((a) => a.id !== id),
    });
  };

  const modifierAction = (id: number, champ: keyof Action, valeur: unknown) => {
    setFormulaireRegle({
      ...formulaireRegle,
      actions: formulaireRegle.actions.map((a) =>
        a.id === id ? { ...a, [champ]: valeur } : a
      ),
    });
  };

  const getLibelleCondition = (cond: Condition) => {
    const sourceLabel = cond.sourceType === 'metadonnee'
      ? metadonnees.find((m) => m.codeTechnique === cond.sourceChamp)?.nomChamp || cond.sourceChamp
      : donneesFacture.find((d) => d.code === cond.sourceChamp)?.label || cond.sourceChamp;

    return `${sourceLabel} ${cond.operateur} "${cond.valeur}"`;
  };

  const getLibelleAction = (action: Action) => {
    const champLabel = metadonnees.find((m) => m.codeTechnique === action.champCible)?.nomChamp || action.champCible;
    if (action.typeValeur === 'fixe') {
      return `${champLabel} = "${action.valeur}"`;
    } else {
      const sourceLabel = donneesFacture.find((d) => d.code === action.sourceCopie)?.label || action.sourceCopie;
      return `${champLabel} = ${sourceLabel}`;
    }
  };

  return (
    <AdminIxBus
      titre="Paramétrage des métadonnées factures"
      sousTitre="Définissez ici les champs personnalisés et les règles de calcul automatique."
      moduleParDefaut="iXFacture"
      sousSectionSelectionnee="Metadonnées"
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Onglets */}
        <Box sx={{ mt: 2, backgroundColor: 'white' }}>
          <Tabs value={ongletActif} onChange={(_e, nouvelOnglet) => setOngletActif(nouvelOnglet)}>
            <Tab label="Métadonnées" />
            <Tab label="Règles de calcul" />
          </Tabs>
        </Box>

        {/* Onglet Métadonnées */}
        {ongletActif === 0 && (
          <>
            {/* Barre d'actions */}
            <Paper elevation={0} sx={{ borderRadius: 0 }}>
              <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
                <Tooltip title="Ajouter une métadonnée">
                  <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={ouvrirDialogAjout}>
                    Ajouter
                  </Button>
                </Tooltip>

                <Tooltip title="Modifier la métadonnée sélectionnée">
                  <span>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={ouvrirDialogEdition}
                      disabled={metadonneesSelectionnees.length !== 1}
                    >
                      Modifier
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip title="Supprimer les métadonnées sélectionnées">
                  <span>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={supprimerMetadonnees}
                      disabled={metadonneesSelectionnees.length === 0}
                    >
                      Supprimer
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip title="Voir comme utilisateur">
                  <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={() => setPreviewOuvert(true)}>
                    Prévisualiser
                  </Button>
                </Tooltip>

                <TextField
                  placeholder="Rechercher..."
                  variant="standard"
                  size="small"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flexGrow: 1, minWidth: '200px' }}
                />
              </Toolbar>
            </Paper>

            {/* Tableau des métadonnées */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            metadonneesSelectionnees.length > 0 &&
                            metadonneesSelectionnees.length < metadonneesFiltrees.length
                          }
                          checked={
                            metadonneesFiltrees.length > 0 &&
                            metadonneesSelectionnees.length === metadonneesFiltrees.length
                          }
                          onChange={toggleSelectionTout}
                        />
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={ordreTriColonne === 'nomChamp'}
                          direction={ordreTriColonne === 'nomChamp' ? directionTri : 'asc'}
                          onClick={() => demanderTri('nomChamp')}
                        >
                          Nom du champ
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={ordreTriColonne === 'codeTechnique'}
                          direction={ordreTriColonne === 'codeTechnique' ? directionTri : 'asc'}
                          onClick={() => demanderTri('codeTechnique')}
                        >
                          Code technique
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={ordreTriColonne === 'typeDonnee'}
                          direction={ordreTriColonne === 'typeDonnee' ? directionTri : 'asc'}
                          onClick={() => demanderTri('typeDonnee')}
                        >
                          Type de donnée
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="center">
                        <TableSortLabel
                          active={ordreTriColonne === 'obligatoire'}
                          direction={ordreTriColonne === 'obligatoire' ? directionTri : 'asc'}
                          onClick={() => demanderTri('obligatoire')}
                        >
                          Obligatoire
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Visibilité</TableCell>
                      <TableCell align="center">
                        <TableSortLabel
                          active={ordreTriColonne === 'ordre'}
                          direction={ordreTriColonne === 'ordre' ? directionTri : 'asc'}
                          onClick={() => demanderTri('ordre')}
                        >
                          Ordre
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metadonneesTriees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucune métadonnée trouvée
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      metadonneesTriees.map((meta) => (
                        <TableRow
                          key={meta.id}
                          hover
                          selected={metadonneesSelectionnees.includes(meta.id)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={metadonneesSelectionnees.includes(meta.id)}
                              onChange={() => toggleSelectionMetadonnee(meta.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {meta.nomChamp}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                              {meta.codeTechnique}
                            </Typography>
                          </TableCell>
                          <TableCell>{getLibelleType(meta.typeDonnee)}</TableCell>
                          <TableCell align="center">
                            {meta.obligatoire ? (
                              <Chip label="Oui" size="small" color="error" />
                            ) : (
                              <Chip label="Non" size="small" variant="outlined" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>{getVisibiliteChips(meta)}</Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">{meta.ordre}</Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}

        {/* Onglet Règles de calcul */}
        {ongletActif === 1 && (
          <>
            {/* Barre d'actions règles */}
            <Paper elevation={0} sx={{ borderRadius: 0 }}>
              <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
                <Tooltip title="Ajouter une règle">
                  <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={ouvrirDialogRegleAjout}>
                    Ajouter une règle
                  </Button>
                </Tooltip>

                <Tooltip title="Modifier la règle sélectionnée">
                  <span>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={ouvrirDialogRegleEdition}
                      disabled={reglesSelectionnees.length !== 1}
                    >
                      Modifier
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip title="Supprimer les règles sélectionnées">
                  <span>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={supprimerRegles}
                      disabled={reglesSelectionnees.length === 0}
                    >
                      Supprimer
                    </Button>
                  </span>
                </Tooltip>
              </Toolbar>
            </Paper>

            {/* Tableau des règles */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={reglesSelectionnees.length > 0 && reglesSelectionnees.length < regles.length}
                          checked={regles.length > 0 && reglesSelectionnees.length === regles.length}
                          onChange={toggleSelectionToutRegles}
                        />
                      </TableCell>
                      <TableCell>Nom de la règle</TableCell>
                      <TableCell>Conditions</TableCell>
                      <TableCell>Actions</TableCell>
                      <TableCell align="center">Ordre</TableCell>
                      <TableCell align="center">État</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucune règle configurée
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      regles
                        .sort((a, b) => a.ordre - b.ordre)
                        .map((regle) => (
                          <TableRow key={regle.id} hover selected={reglesSelectionnees.includes(regle.id)}>
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={reglesSelectionnees.includes(regle.id)}
                                onChange={() => toggleSelectionRegle(regle.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {regle.nom}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {regle.conditions.map((cond, idx) => (
                                  <Box key={cond.id}>
                                    {idx > 0 && cond.lienLogique && (
                                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                        {cond.lienLogique}
                                      </Typography>
                                    )}
                                    <Typography variant="body2">{getLibelleCondition(cond)}</Typography>
                                  </Box>
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {regle.actions.map((action) => (
                                  <Typography key={action.id} variant="body2">
                                    {getLibelleAction(action)}
                                  </Typography>
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">{regle.ordre}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={regle.active ? 'Activée' : 'Désactivée'}
                                size="small"
                                color={regle.active ? 'success' : 'default'}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </Box>

      {/* Dialog Ajout/Édition Métadonnée (inchangé) */}
      <Dialog open={dialogOuvert} onClose={fermerDialog} maxWidth="md" fullWidth>
        <DialogTitle>{modeEdition ? 'Modifier une métadonnée' : 'Ajouter une métadonnée'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nom du champ"
              required
              fullWidth
              value={formulaire.nomChamp}
              onChange={(e) => setFormulaire({ ...formulaire, nomChamp: e.target.value })}
              helperText="Libellé visible par les utilisateurs"
            />

            <TextField
              label="Code technique"
              fullWidth
              value={formulaire.codeTechnique}
              onChange={(e) => setFormulaire({ ...formulaire, codeTechnique: e.target.value })}
              helperText="Identifiant unique en base (optionnel)"
            />

            <FormControl fullWidth required>
              <InputLabel>Type de donnée</InputLabel>
              <Select
                label="Type de donnée"
                value={formulaire.typeDonnee}
                onChange={(e) =>
                  setFormulaire({ ...formulaire, typeDonnee: e.target.value as Metadonnee['typeDonnee'] })
                }
              >
                <MenuItem value="texte">Texte (saisie libre courte)</MenuItem>
                <MenuItem value="texte-long">Texte long (textarea)</MenuItem>
                <MenuItem value="nombre">Nombre (entier ou décimal)</MenuItem>
                <MenuItem value="date">Date (calendrier)</MenuItem>
                <MenuItem value="booleen">Booléen (case à cocher)</MenuItem>
                <MenuItem value="liste">Liste déroulante</MenuItem>
              </Select>
            </FormControl>

            {formulaire.typeDonnee === 'liste' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Valeurs possibles
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Nouvelle valeur"
                    value={nouvelleValeur}
                    onChange={(e) => setNouvelleValeur(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        ajouterValeurListe();
                      }
                    }}
                  />
                  <Button variant="outlined" onClick={ajouterValeurListe}>
                    Ajouter
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formulaire.valeursPossibles.map((valeur, index) => (
                    <Chip
                      key={index}
                      label={valeur}
                      onDelete={() => supprimerValeurListe(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={formulaire.obligatoire}
                  onChange={(e) => setFormulaire({ ...formulaire, obligatoire: e.target.checked })}
                />
              }
              label="Champ obligatoire"
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Visible sur
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formulaire.visibiliteFE}
                      onChange={(e) => setFormulaire({ ...formulaire, visibiliteFE: e.target.checked })}
                    />
                  }
                  label="Factures entrantes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formulaire.visibiliteFS}
                      onChange={(e) => setFormulaire({ ...formulaire, visibiliteFS: e.target.checked })}
                    />
                  }
                  label="Factures sortantes"
                />
              </FormGroup>
            </Box>

            <TextField
              label="Ordre d'affichage"
              type="number"
              fullWidth
              value={formulaire.ordre}
              onChange={(e) => setFormulaire({ ...formulaire, ordre: parseInt(e.target.value) || 0 })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fermerDialog}>Annuler</Button>
          <Button
            variant="contained"
            onClick={sauvegarderMetadonnee}
            disabled={!formulaire.nomChamp || (!formulaire.visibiliteFE && !formulaire.visibiliteFS)}
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Ajout/Édition Règle */}
      <Dialog open={dialogRegleOuvert} onClose={fermerDialogRegle} maxWidth="lg" fullWidth>
        <DialogTitle>{modeEditionRegle ? 'Modifier une règle' : 'Ajouter une règle'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Nom de la règle */}
            <TextField
              label="Nom de la règle"
              required
              fullWidth
              value={formulaireRegle.nom}
              onChange={(e) => setFormulaireRegle({ ...formulaireRegle, nom: e.target.value })}
              helperText="Ex: Affectation service DSI"
            />

            <Divider />

            {/* Section Conditions */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Conditions (SI)</Typography>
                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={ajouterCondition}>
                  Ajouter une condition
                </Button>
              </Box>

              {formulaireRegle.conditions.length === 0 ? (
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune condition définie. Cliquez sur "Ajouter une condition" pour commencer.
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {formulaireRegle.conditions.map((cond, idx) => (
                    <Card key={cond.id} variant="outlined">
                      <CardContent>
                        {idx > 0 && (
                          <FormControl size="small" sx={{ mb: 2, minWidth: 100 }}>
                            <Select
                              value={cond.lienLogique || 'ET'}
                              onChange={(e) => modifierCondition(cond.id, 'lienLogique', e.target.value)}
                            >
                              <MenuItem value="ET">ET</MenuItem>
                              <MenuItem value="OU">OU</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                          <FormControl size="small" sx={{ flex: 1 }}>
                            <InputLabel>Source</InputLabel>
                            <Select
                              label="Source"
                              value={cond.sourceType}
                              onChange={(e) => {
                                modifierCondition(cond.id, 'sourceType', e.target.value);
                                modifierCondition(cond.id, 'sourceChamp', '');
                              }}
                            >
                              <MenuItem value="metadonnee">Métadonnée</MenuItem>
                              <MenuItem value="donneeFacture">Donnée facture</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl size="small" sx={{ flex: 2 }}>
                            <InputLabel>Champ</InputLabel>
                            <Select
                              label="Champ"
                              value={cond.sourceChamp}
                              onChange={(e) => modifierCondition(cond.id, 'sourceChamp', e.target.value)}
                            >
                              {cond.sourceType === 'metadonnee'
                                ? metadonnees.map((m) => (
                                    <MenuItem key={m.id} value={m.codeTechnique}>
                                      {m.nomChamp}
                                    </MenuItem>
                                  ))
                                : donneesFacture.map((d) => (
                                    <MenuItem key={d.code} value={d.code}>
                                      {d.label}
                                    </MenuItem>
                                  ))}
                            </Select>
                          </FormControl>

                          <FormControl size="small" sx={{ flex: 1 }}>
                            <InputLabel>Opérateur</InputLabel>
                            <Select
                              label="Opérateur"
                              value={cond.operateur}
                              onChange={(e) => modifierCondition(cond.id, 'operateur', e.target.value)}
                            >
                              <MenuItem value="=">=</MenuItem>
                              <MenuItem value="!=">≠</MenuItem>
                              <MenuItem value="contient">contient</MenuItem>
                              <MenuItem value=">">&gt;</MenuItem>
                              <MenuItem value="<">&lt;</MenuItem>
                              <MenuItem value=">=">&gt;=</MenuItem>
                              <MenuItem value="<=">&lt;=</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField
                            size="small"
                            label="Valeur"
                            sx={{ flex: 2 }}
                            value={cond.valeur}
                            onChange={(e) => modifierCondition(cond.id, 'valeur', e.target.value)}
                          />

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => supprimerCondition(cond.id)}
                            sx={{ mt: 0.5 }}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>

            <Divider />

            {/* Section Actions */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Actions (ALORS)</Typography>
                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={ajouterAction}>
                  Ajouter une action
                </Button>
              </Box>

              {formulaireRegle.actions.length === 0 ? (
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune action définie. Cliquez sur "Ajouter une action" pour commencer.
                  </Typography>
                </Card>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {formulaireRegle.actions.map((action) => (
                    <Card key={action.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                          <FormControl size="small" sx={{ flex: 2 }}>
                            <InputLabel>Métadonnée cible</InputLabel>
                            <Select
                              label="Métadonnée cible"
                              value={action.champCible}
                              onChange={(e) => modifierAction(action.id, 'champCible', e.target.value)}
                            >
                              {metadonnees.map((m) => (
                                <MenuItem key={m.id} value={m.codeTechnique}>
                                  {m.nomChamp}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl size="small" sx={{ flex: 1 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                              label="Type"
                              value={action.typeValeur}
                              onChange={(e) => {
                                modifierAction(action.id, 'typeValeur', e.target.value);
                                modifierAction(action.id, 'valeur', '');
                              }}
                            >
                              <MenuItem value="fixe">Valeur fixe</MenuItem>
                              <MenuItem value="copie">Copier depuis</MenuItem>
                            </Select>
                          </FormControl>

                          {action.typeValeur === 'fixe' ? (
                            <TextField
                              size="small"
                              label="Valeur"
                              sx={{ flex: 2 }}
                              value={action.valeur}
                              onChange={(e) => modifierAction(action.id, 'valeur', e.target.value)}
                            />
                          ) : (
                            <FormControl size="small" sx={{ flex: 2 }}>
                              <InputLabel>Source</InputLabel>
                              <Select
                                label="Source"
                                value={action.sourceCopie}
                                onChange={(e) => modifierAction(action.id, 'sourceCopie', e.target.value)}
                              >
                                {donneesFacture.map((d) => (
                                  <MenuItem key={d.code} value={d.code}>
                                    {d.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => supprimerAction(action.id)}
                            sx={{ mt: 0.5 }}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>

            <Divider />

            {/* Options avancées */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Options avancées
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Ordre d'exécution"
                  type="number"
                  size="small"
                  value={formulaireRegle.ordre}
                  onChange={(e) =>
                    setFormulaireRegle({ ...formulaireRegle, ordre: parseInt(e.target.value) || 0 })
                  }
                  sx={{ flex: 1 }}
                />

                <FormControl size="small" sx={{ flex: 2 }}>
                  <InputLabel>Gestion des conflits</InputLabel>
                  <Select
                    label="Gestion des conflits"
                    value={formulaireRegle.gestionConflits}
                    onChange={(e) =>
                      setFormulaireRegle({
                        ...formulaireRegle,
                        gestionConflits: e.target.value as RegleCalcul['gestionConflits'],
                      })
                    }
                  >
                    <MenuItem value="priorite">Priorité à la règle la plus haute</MenuItem>
                    <MenuItem value="derniere">Dernière règle appliquée gagne</MenuItem>
                    <MenuItem value="rien">Ne rien faire en cas de conflit</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formulaireRegle.active}
                      onChange={(e) => setFormulaireRegle({ ...formulaireRegle, active: e.target.checked })}
                    />
                  }
                  label="Règle active"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fermerDialogRegle}>Annuler</Button>
          <Button
            variant="contained"
            onClick={sauvegarderRegle}
            disabled={
              !formulaireRegle.nom ||
              formulaireRegle.conditions.length === 0 ||
              formulaireRegle.actions.length === 0
            }
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Preview (inchangé) */}
      <Dialog open={previewOuvert} onClose={() => setPreviewOuvert(false)} maxWidth="md" fullWidth>
        <DialogTitle>Prévisualisation - Vue utilisateur</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Voici comment les métadonnées apparaîtront dans le formulaire de saisie d'une facture
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {metadonnees
              .filter((m) => m.visibiliteFE || m.visibiliteFS)
              .sort((a, b) => a.ordre - b.ordre)
              .map((meta) => (
                <Box key={meta.id}>
                  {meta.typeDonnee === 'texte' && (
                    <TextField
                      label={meta.nomChamp}
                      required={meta.obligatoire}
                      fullWidth
                      size="small"
                      disabled
                      placeholder="Exemple de texte"
                    />
                  )}
                  {meta.typeDonnee === 'texte-long' && (
                    <TextField
                      label={meta.nomChamp}
                      required={meta.obligatoire}
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      disabled
                      placeholder="Exemple de texte long"
                    />
                  )}
                  {meta.typeDonnee === 'nombre' && (
                    <TextField
                      label={meta.nomChamp}
                      required={meta.obligatoire}
                      fullWidth
                      size="small"
                      type="number"
                      disabled
                      placeholder="0"
                    />
                  )}
                  {meta.typeDonnee === 'date' && (
                    <TextField
                      label={meta.nomChamp}
                      required={meta.obligatoire}
                      fullWidth
                      size="small"
                      type="date"
                      disabled
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  {meta.typeDonnee === 'booleen' && (
                    <FormControlLabel
                      control={<Checkbox disabled />}
                      label={meta.nomChamp + (meta.obligatoire ? ' *' : '')}
                    />
                  )}
                  {meta.typeDonnee === 'liste' && (
                    <FormControl fullWidth size="small" disabled>
                      <InputLabel>{meta.nomChamp}</InputLabel>
                      <Select label={meta.nomChamp} value="">
                        {meta.valeursPossibles?.map((valeur, idx) => (
                          <MenuItem key={idx} value={valeur}>
                            {valeur}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOuvert(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </AdminIxBus>
  );
}

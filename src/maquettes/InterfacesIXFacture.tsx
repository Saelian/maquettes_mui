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
  Divider,
  Tooltip,
  Toolbar,
  Checkbox,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DrawIcon from '@mui/icons-material/Draw';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import IXParapheurLogo from '../assets/img_modules/ico_iXParapheur_couleur.svg';

interface Condition {
  id: number;
  sourceType: 'metadonnee' | 'donneeFacture';
  sourceChamp: string;
  operateur: '=' | '!=' | 'contient' | '>' | '<' | '>=' | '<=';
  valeur: string;
  lienLogique?: 'ET' | 'OU';
}

interface RegleParapheur {
  id: number;
  nom: string;
  conditions: Condition[];
  natureDocument: string;
  circuitValidation: string;
  ordre: number;
  active: boolean;
  gestionConflits: 'premiere' | 'derniere' | 'alerte';
}


export default function InterfacesIXFacture() {
  const [ongletActif, setOngletActif] = useState(0);
  const [dialogRegleOuvert, setDialogRegleOuvert] = useState(false);
  const [modeEditionRegle, setModeEditionRegle] = useState(false);
  const [regleSelectionnee, setRegleSelectionnee] = useState<RegleParapheur | null>(null);
  const [reglesSelectionnees, setReglesSelectionnees] = useState<number[]>([]);

  // Règles mode dynamique
  const [regles, setRegles] = useState<RegleParapheur[]>([
    {
      id: 1,
      nom: 'Factures DSI',
      conditions: [
        {
          id: 1,
          sourceType: 'metadonnee',
          sourceChamp: 'code_service',
          operateur: '=',
          valeur: 'DSI',
        },
      ],
      natureDocument: 'Documents informatiques',
      circuitValidation: 'Signature des factures de la DSI',
      ordre: 1,
      active: true,
      gestionConflits: 'premiere',
    },
    {
      id: 2,
      nom: 'Factures URBANISME',
      conditions: [
        {
          id: 1,
          sourceType: 'metadonnee',
          sourceChamp: 'code_service',
          operateur: '=',
          valeur: 'URBANISME',
        },
      ],
      natureDocument: 'Documents d\'urbanisme',
      circuitValidation: 'Visa directeur urbanisme',
      ordre: 2,
      active: true,
      gestionConflits: 'premiere',
    },
  ]);

  // État du formulaire de règle
  const [formulaireRegle, setFormulaireRegle] = useState({
    nom: '',
    conditions: [] as Condition[],
    natureDocument: '',
    circuitValidation: '',
    ordre: regles.length + 1,
    active: true,
    gestionConflits: 'premiere' as RegleParapheur['gestionConflits'],
  });

  // Données API simulées - Natures de documents
  const naturesDocuments = [
    'Factures fournisseurs',
    'Documents informatiques',
    'Documents d\'urbanisme',
    'Documents administratifs',
    'Marchés publics',
  ];

  // Données API simulées - Circuits de validation
  const circuitsValidation = [
    'Validation comptable',
    'Signature des factures de la DSI',
    'Visa directeur urbanisme',
    'Validation direction générale',
    'Circuit simplifié',
  ];

  // Métadonnées disponibles (exemple)
  const metadonnees = [
    { code: 'code_service', label: 'Code service' },
    { code: 'code_projet', label: 'Code projet' },
    { code: 'commentaire_interne', label: 'Commentaire interne' },
  ];

  // Données de facture disponibles
  const donneesFacture = [
    { code: 'idfac', label: 'ID Facture' },
    { code: 'numero', label: 'Numéro facture' },
    { code: 'fournisseur', label: 'Fournisseur' },
    { code: 'montant', label: 'Montant TTC' },
    { code: 'montant_ht', label: 'Montant HT' },
    { code: 'date_emission', label: 'Date d\'émission' },
    { code: 'date_echeance', label: 'Date d\'échéance' },
  ];

  // Fonctions pour les règles
  const ouvrirDialogRegleAjout = () => {
    setModeEditionRegle(false);
    setRegleSelectionnee(null);
    setFormulaireRegle({
      nom: '',
      conditions: [],
      natureDocument: '',
      circuitValidation: '',
      ordre: regles.length + 1,
      active: true,
      gestionConflits: 'premiere',
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
          natureDocument: regle.natureDocument,
          circuitValidation: regle.circuitValidation,
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
      const nouvelleRegle: RegleParapheur = {
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

  const getLibelleCondition = (cond: Condition) => {
    const sourceLabel = cond.sourceType === 'metadonnee'
      ? metadonnees.find((m) => m.code === cond.sourceChamp)?.label || cond.sourceChamp
      : donneesFacture.find((d) => d.code === cond.sourceChamp)?.label || cond.sourceChamp;

    return `${sourceLabel} ${cond.operateur} "${cond.valeur}"`;
  };


  return (
    <AdminIxBus
      titre="Paramétrage des interfaces"
      sousTitre="Définissez les règles métiers pour l'export des factures vers iXParapheur."
      moduleParDefaut="iXFacture"
      sousSectionSelectionnee="Interfaces"
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Onglets des interfaces */}
        <Box sx={{ mt: 2, backgroundColor: 'white' }}>
          <Tabs value={ongletActif} onChange={(_e, nouvelOnglet) => setOngletActif(nouvelOnglet)}>
            <Tab
              label="iXParapheur"
              icon={<img src={IXParapheurLogo} alt="iXParapheur" style={{ height: 24 }} />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Contenu onglet iXParapheur */}
        {ongletActif === 0 && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Barre d'actions règles */}
            <Paper elevation={0} sx={{ borderRadius: 0 }}>
              <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
                <Tooltip title="Ajouter une règle iXParapheur">
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
                      <TableCell>Nature du document (iXParapheur)</TableCell>
                      <TableCell>Circuit de validation (iXParapheur)</TableCell>
                      <TableCell align="center">Ordre</TableCell>
                      <TableCell align="center">État</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
                              <Typography variant="body2">{regle.natureDocument}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{regle.circuitValidation}</Typography>
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
          </Box>
        )}
      </Box>

      {/* Dialog Ajout/Édition Règle */}
      <Dialog open={dialogRegleOuvert} onClose={fermerDialogRegle} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DrawIcon />
          {modeEditionRegle ? 'Modifier une règle iXParapheur' : 'Ajouter une règle iXParapheur'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Nom de la règle */}
            <TextField
              label="Nom de la règle"
              required
              fullWidth
              value={formulaireRegle.nom}
              onChange={(e) => setFormulaireRegle({ ...formulaireRegle, nom: e.target.value })}
              helperText="Ex: Factures DSI"
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
                                    <MenuItem key={m.code} value={m.code}>
                                      {m.label}
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

            {/* Section Actions (ALORS) */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DrawIcon />
                Actions (ALORS) - Paramètres iXParapheur
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Définissez la nature du document et le circuit de validation à appliquer dans iXParapheur
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Nature du document (iXParapheur)</InputLabel>
                  <Select
                    label="Nature du document (iXParapheur)"
                    value={formulaireRegle.natureDocument}
                    onChange={(e) =>
                      setFormulaireRegle({ ...formulaireRegle, natureDocument: e.target.value })
                    }
                  >
                    {naturesDocuments.map((nature) => (
                      <MenuItem key={nature} value={nature}>
                        {nature}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required size="small">
                  <InputLabel>Circuit de validation (iXParapheur)</InputLabel>
                  <Select
                    label="Circuit de validation (iXParapheur)"
                    value={formulaireRegle.circuitValidation}
                    onChange={(e) =>
                      setFormulaireRegle({ ...formulaireRegle, circuitValidation: e.target.value })
                    }
                  >
                    {circuitsValidation.map((circuit) => (
                      <MenuItem key={circuit} value={circuit}>
                        {circuit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Divider />

            {/* Options avancées */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Options avancées
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                        gestionConflits: e.target.value as RegleParapheur['gestionConflits'],
                      })
                    }
                  >
                    <MenuItem value="premiere">Prendre la première règle applicable</MenuItem>
                    <MenuItem value="derniere">Prendre la dernière règle applicable</MenuItem>
                    <MenuItem value="alerte">Lever une alerte</MenuItem>
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
              !formulaireRegle.natureDocument ||
              !formulaireRegle.circuitValidation
            }
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </AdminIxBus>
  );
}

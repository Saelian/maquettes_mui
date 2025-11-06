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
  Divider,
  Tooltip,
  Toolbar,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoIcon from '@mui/icons-material/Info';

interface Condition {
  id: number;
  champSource: string;
  operateur: '=' | '!=' | 'contient' | '>' | '<' | '>=' | '<=';
  valeur: string;
  lienLogique?: 'ET' | 'OU';
}

interface RegleRoutage {
  id: number;
  conditions: Condition[];
  ordre: number;
}

interface Nature {
  id: number;
  nom: string;
  description: string;
  typeNature: 'normale' | 'parDefaut';
  regleRoutage: RegleRoutage | null;
  ordre: number;
}

export default function NaturesIXFacture() {
  const [dialogNatureOuvert, setDialogNatureOuvert] = useState(false);
  const [dialogConfirmationOuvert, setDialogConfirmationOuvert] = useState(false);
  const [modeEditionNature, setModeEditionNature] = useState(false);
  const [natureSelectionnee, setNatureSelectionnee] = useState<Nature | null>(null);
  const [naturesSelectionnees, setNaturesSelectionnees] = useState<number[]>([]);

  // Données de démonstration - Natures
  const [natures, setNatures] = useState<Nature[]>([
    {
      id: 1,
      nom: 'Factures_ERP1',
      description: 'Factures destinées à l\'ERP1 (DSI)',
      typeNature: 'normale',
      regleRoutage: {
        id: 1,
        conditions: [
          {
            id: 1,
            champSource: 'Code_Routage',
            operateur: '=',
            valeur: '123456789_DSI',
          },
        ],
        ordre: 1,
      },
      ordre: 1,
    },
    {
      id: 2,
      nom: 'Factures_ERP2',
      description: 'Factures destinées à l\'ERP2 (Urbanisme)',
      typeNature: 'normale',
      regleRoutage: {
        id: 2,
        conditions: [
          {
            id: 1,
            champSource: 'Code_Routage',
            operateur: '=',
            valeur: '123456789_URB',
          },
        ],
        ordre: 1,
      },
      ordre: 2,
    },
    {
      id: 3,
      nom: 'Factures_General',
      description: 'Nature par défaut appliquée si aucune règle ne correspond',
      typeNature: 'parDefaut',
      regleRoutage: null,
      ordre: 999,
    },
  ]);

  // Champs de données métiers disponibles pour les règles
  const champsDisponibles = [
    { code: 'Code_Routage', label: 'Code de routage' },
    { code: 'Type_Document', label: 'Type de document' },
    { code: 'Montant_TTC', label: 'Montant TTC' },
    { code: 'Fournisseur', label: 'Fournisseur' },
    { code: 'Service_Demandeur', label: 'Service demandeur' },
    { code: 'Numero_Facture', label: 'Numéro de facture' },
  ];

  // État du formulaire de nature
  const [formulaireNature, setFormulaireNature] = useState({
    nom: '',
    description: '',
    typeNature: 'normale' as Nature['typeNature'],
    conditions: [] as Condition[],
    ordre: natures.length + 1,
  });

  // Fonctions pour les natures
  const ouvrirDialogNatureAjout = () => {
    setModeEditionNature(false);
    setNatureSelectionnee(null);
    setFormulaireNature({
      nom: '',
      description: '',
      typeNature: 'normale',
      conditions: [],
      ordre: natures.filter((n) => n.typeNature !== 'parDefaut').length + 1,
    });
    setDialogNatureOuvert(true);
  };

  const ouvrirDialogNatureEdition = () => {
    if (naturesSelectionnees.length === 1) {
      const nature = natures.find((n) => n.id === naturesSelectionnees[0]);
      if (nature) {
        setModeEditionNature(true);
        setNatureSelectionnee(nature);
        setFormulaireNature({
          nom: nature.nom,
          description: nature.description,
          typeNature: nature.typeNature,
          conditions: nature.regleRoutage?.conditions ? [...nature.regleRoutage.conditions] : [],
          ordre: nature.ordre,
        });
        setDialogNatureOuvert(true);
      }
    }
  };

  const fermerDialogNature = () => {
    setDialogNatureOuvert(false);
  };

  const sauvegarderNature = () => {
    // Vérifier qu'il n'y ait qu'une seule nature par défaut
    if (formulaireNature.typeNature === 'parDefaut') {
      const autreNatureParDefaut = natures.find(
        (n) => n.typeNature === 'parDefaut' && n.id !== natureSelectionnee?.id
      );
      if (autreNatureParDefaut) {
        alert('Il ne peut y avoir qu\'une seule nature par défaut. Veuillez d\'abord modifier ou supprimer la nature par défaut existante.');
        return;
      }
    }

    if (modeEditionNature && natureSelectionnee) {
      setNatures(
        natures.map((n) =>
          n.id === natureSelectionnee.id
            ? {
                ...n,
                nom: formulaireNature.nom,
                description: formulaireNature.description,
                typeNature: formulaireNature.typeNature,
                regleRoutage:
                  formulaireNature.typeNature === 'parDefaut'
                    ? null
                    : {
                        id: n.regleRoutage?.id || Math.max(...natures.map((nat) => nat.regleRoutage?.id || 0), 0) + 1,
                        conditions: formulaireNature.conditions,
                        ordre: 1,
                      },
                ordre: formulaireNature.typeNature === 'parDefaut' ? 999 : formulaireNature.ordre,
              }
            : n
        )
      );
    } else {
      const nouvelleNature: Nature = {
        id: Math.max(...natures.map((n) => n.id), 0) + 1,
        nom: formulaireNature.nom,
        description: formulaireNature.description,
        typeNature: formulaireNature.typeNature,
        regleRoutage:
          formulaireNature.typeNature === 'parDefaut'
            ? null
            : {
                id: Math.max(...natures.map((n) => n.regleRoutage?.id || 0), 0) + 1,
                conditions: formulaireNature.conditions,
                ordre: 1,
              },
        ordre: formulaireNature.typeNature === 'parDefaut' ? 999 : formulaireNature.ordre,
      };
      setNatures([...natures, nouvelleNature]);
    }
    fermerDialogNature();
    setNaturesSelectionnees([]);
  };

  const ouvrirDialogConfirmationSuppression = () => {
    if (naturesSelectionnees.length > 0) {
      setDialogConfirmationOuvert(true);
    }
  };

  const confirmerSuppression = () => {
    setNatures(natures.filter((n) => !naturesSelectionnees.includes(n.id)));
    setNaturesSelectionnees([]);
    setDialogConfirmationOuvert(false);
  };

  const annulerSuppression = () => {
    setDialogConfirmationOuvert(false);
  };

  const toggleSelectionNature = (id: number) => {
    if (naturesSelectionnees.includes(id)) {
      setNaturesSelectionnees(naturesSelectionnees.filter((nid) => nid !== id));
    } else {
      setNaturesSelectionnees([...naturesSelectionnees, id]);
    }
  };

  const toggleSelectionToutNatures = () => {
    if (naturesSelectionnees.length === natures.length) {
      setNaturesSelectionnees([]);
    } else {
      setNaturesSelectionnees(natures.map((n) => n.id));
    }
  };

  const ajouterCondition = () => {
    const nouvelleCondition: Condition = {
      id: Math.max(...formulaireNature.conditions.map((c) => c.id), 0) + 1,
      champSource: '',
      operateur: '=',
      valeur: '',
      lienLogique: formulaireNature.conditions.length > 0 ? 'ET' : undefined,
    };
    setFormulaireNature({
      ...formulaireNature,
      conditions: [...formulaireNature.conditions, nouvelleCondition],
    });
  };

  const supprimerCondition = (id: number) => {
    const nouvellesConditions = formulaireNature.conditions.filter((c) => c.id !== id);
    if (nouvellesConditions.length > 0) {
      nouvellesConditions[0].lienLogique = undefined;
    }
    setFormulaireNature({
      ...formulaireNature,
      conditions: nouvellesConditions,
    });
  };

  const modifierCondition = (id: number, champ: keyof Condition, valeur: unknown) => {
    setFormulaireNature({
      ...formulaireNature,
      conditions: formulaireNature.conditions.map((c) =>
        c.id === id ? { ...c, [champ]: valeur } : c
      ),
    });
  };

  const getLibelleCondition = (cond: Condition) => {
    const champLabel = champsDisponibles.find((ch) => ch.code === cond.champSource)?.label || cond.champSource;
    return `${champLabel} ${cond.operateur} "${cond.valeur}"`;
  };

  return (
    <AdminIxBus
      titre="Natures"
      moduleParDefaut="iXFacture"
      sousSectionSelectionnee="Natures"
      pageCourante="natures-ixfacture"
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Barre d'actions */}
        <Paper elevation={1} sx={{ borderRadius: 0, mt: 1, mb: 1 }}>
          <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Ajouter une nature">
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={ouvrirDialogNatureAjout}>
                Ajouter une nature
              </Button>
            </Tooltip>

            <Tooltip title="Modifier la nature sélectionnée">
              <span>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={ouvrirDialogNatureEdition}
                  disabled={naturesSelectionnees.length !== 1}
                >
                  Modifier
                </Button>
              </span>
            </Tooltip>

            <Tooltip title="Supprimer les natures sélectionnées">
              <span>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={ouvrirDialogConfirmationSuppression}
                  disabled={naturesSelectionnees.length === 0}
                >
                  Supprimer
                </Button>
              </span>
            </Tooltip>
          </Toolbar>
        </Paper>

        {/* Alerte si aucune nature par défaut */}
        {!natures.some((n) => n.typeNature === 'parDefaut') && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Aucune nature par défaut n'est configurée. Toutes les factures tomberont en erreur si aucune règle adaptée n'est trouvée.
          </Alert>
        )}

        {/* Tableau des natures */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={naturesSelectionnees.length > 0 && naturesSelectionnees.length < natures.length}
                      checked={natures.length > 0 && naturesSelectionnees.length === natures.length}
                      onChange={toggleSelectionToutNatures}
                    />
                  </TableCell>
                  <TableCell>Nom de la nature</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Règles de routage</TableCell>
                  <TableCell align="center">Ordre d'évaluation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {natures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Aucune nature configurée
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  natures
                    .sort((a, b) => a.ordre - b.ordre)
                    .map((nature) => (
                      <TableRow key={nature.id} hover selected={naturesSelectionnees.includes(nature.id)}>
                        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={naturesSelectionnees.includes(nature.id)}
                            onChange={() => toggleSelectionNature(nature.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {nature.nom}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{nature.description}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={nature.typeNature === 'parDefaut' ? 'Par défaut' : 'Normale'}
                            size="small"
                            color={nature.typeNature === 'parDefaut' ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {nature.typeNature === 'parDefaut' ? (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                              Aucune règle (s'applique par défaut)
                            </Typography>
                          ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {nature.regleRoutage?.conditions.map((cond, idx) => (
                                <Box key={cond.id}>
                                  {idx > 0 && cond.lienLogique && (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                      {cond.lienLogique}
                                    </Typography>
                                  )}
                                  <Typography variant="body2">{getLibelleCondition(cond)}</Typography>
                                </Box>
                              ))}
                              {!nature.regleRoutage?.conditions.length && (
                                <Typography variant="body2" color="error">
                                  Aucune condition définie
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{nature.ordre}</Typography>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Dialog Ajout/Édition Nature */}
      <Dialog open={dialogNatureOuvert} onClose={fermerDialogNature} maxWidth="lg" fullWidth>
        <DialogTitle>
          {modeEditionNature ? 'Modifier une nature' : 'Ajouter une nature'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Nom de la nature */}
            <TextField
              label="Nom de la nature"
              required
              fullWidth
              value={formulaireNature.nom}
              onChange={(e) => setFormulaireNature({ ...formulaireNature, nom: e.target.value })}
              helperText="Ex: Factures_ERP1, Factures_DSI"
            />

            {/* Description */}
            <TextField
              label="Description"
              required
              fullWidth
              multiline
              rows={2}
              value={formulaireNature.description}
              onChange={(e) => setFormulaireNature({ ...formulaireNature, description: e.target.value })}
              helperText="Description de la nature et son utilisation"
            />

            {/* Type de nature */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                Type de nature *
              </Typography>
              <ToggleButtonGroup
                value={formulaireNature.typeNature}
                exclusive
                onChange={(_e, nouvelleValeur) => {
                  if (nouvelleValeur !== null) {
                    setFormulaireNature({
                      ...formulaireNature,
                      typeNature: nouvelleValeur as Nature['typeNature'],
                      conditions: nouvelleValeur === 'parDefaut' ? [] : formulaireNature.conditions,
                    });
                  }
                }}
                color="primary"
                fullWidth
              >
                <ToggleButton value="normale" sx={{ flex: 1 }}>
                  Normale (avec règles de routage)
                </ToggleButton>
                <Tooltip
                  title={
                    natures.some((n) => n.typeNature === 'parDefaut' && n.id !== natureSelectionnee?.id)
                      ? 'Une nature par défaut existe déjà. Veuillez d\'abord la supprimer pour en créer une nouvelle.'
                      : ''
                  }
                  arrow
                >
                  <span style={{ flex: 1, display: 'flex' }}>
                    <ToggleButton
                      value="parDefaut"
                      disabled={natures.some((n) => n.typeNature === 'parDefaut' && n.id !== natureSelectionnee?.id)}
                      sx={{ width: '100%' }}
                    >
                      Par défaut (sans règles)
                    </ToggleButton>
                  </span>
                </Tooltip>
              </ToggleButtonGroup>
            </Box>

            {formulaireNature.typeNature === 'parDefaut' && (
              <Alert severity="warning" icon={<InfoIcon />}>
                Une nature par défaut s'applique automatiquement si aucune autre règle ne correspond. Elle ne nécessite
                pas de règles de routage.
              </Alert>
            )}

            <Divider />

            {/* Section Règles de routage */}
            {formulaireNature.typeNature === 'normale' && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Règles de routage (SI)</Typography>
                  <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={ajouterCondition}>
                    Ajouter une condition
                  </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Définissez les conditions qui doivent être remplies pour qu'une facture soit affectée à cette nature.
                  Dès qu'une règle correspond, la facture est affectée et les autres règles ne sont pas évaluées.
                </Typography>

                {formulaireNature.conditions.length === 0 ? (
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2" color="text.secondary">
                      Aucune condition définie. Cliquez sur "Ajouter une condition" pour commencer.
                    </Typography>
                  </Card>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {formulaireNature.conditions.map((cond, idx) => (
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
                            <FormControl size="small" sx={{ flex: 2 }}>
                              <InputLabel>Champ source</InputLabel>
                              <Select
                                label="Champ source"
                                value={cond.champSource}
                                onChange={(e) => modifierCondition(cond.id, 'champSource', e.target.value)}
                              >
                                {champsDisponibles.map((champ) => (
                                  <MenuItem key={champ.code} value={champ.code}>
                                    {champ.label}
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
            )}

            <Divider />

            {/* Options */}
            {formulaireNature.typeNature === 'normale' && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Options
                </Typography>
                <TextField
                  label="Ordre d'évaluation"
                  type="number"
                  size="small"
                  value={formulaireNature.ordre}
                  onChange={(e) =>
                    setFormulaireNature({ ...formulaireNature, ordre: parseInt(e.target.value) || 0 })
                  }
                  helperText="Les natures sont évaluées dans l'ordre croissant"
                  fullWidth
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fermerDialogNature}>Annuler</Button>
          <Button
            variant="contained"
            onClick={sauvegarderNature}
            disabled={
              !formulaireNature.nom ||
              !formulaireNature.description ||
              (formulaireNature.typeNature === 'normale' && formulaireNature.conditions.length === 0)
            }
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Confirmation Suppression */}
      <Dialog open={dialogConfirmationOuvert} onClose={annulerSuppression} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer {naturesSelectionnees.length} nature(s) ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={annulerSuppression}>Annuler</Button>
          <Button variant="contained" color="error" onClick={confirmerSuppression}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </AdminIxBus>
  );
}

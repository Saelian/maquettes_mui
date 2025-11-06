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
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import IXParapheurLogo from '../assets/img_modules/ico_iXParapheur_couleur.svg';

// Import des types de statuts
import { StatutTechnique } from '../types/StatutTechnique';
import { StatutMetier } from '../types/StatutMetier';
import { StatutApplicatif } from '../types/StatutApplicatif';
import { StatutEmission } from '../types/StatutEmission';
import { StatutReception } from '../types/StatutReception';

// Type pour tous les statuts possibles (factures d'achat et de vente)
type StatutFacture = StatutTechnique | StatutMetier | StatutApplicatif | StatutEmission | StatutReception;

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
  statutDeclencheur: StatutFacture; // État qui déclenche l'envoi vers iXParapheur (obligatoire)
  conditions: Condition[]; // Conditions complémentaires (facultatif)
  natureDocument: string;
  circuitValidation: string;
  statutFinalAcceptation: StatutFacture; // État appliqué au retour d'iXParapheur si acceptation (obligatoire)
  statutFinalRefus: StatutFacture; // État appliqué au retour d'iXParapheur si refus (obligatoire)
  ordre: number; // Ordre d'évaluation de la règle (obligatoire)
  active: boolean;
}


export default function InterfacesIXFacture() {
  const [ongletActif, setOngletActif] = useState(0);
  const [dialogRegleOuvert, setDialogRegleOuvert] = useState(false);
  const [modeEditionRegle, setModeEditionRegle] = useState(false);
  const [regleSelectionnee, setRegleSelectionnee] = useState<RegleParapheur | null>(null);
  const [reglesSelectionnees, setReglesSelectionnees] = useState<number[]>([]);

  // Liste des statuts déclencheurs disponibles (exclus les statuts techniques et certains statuts métiers)
  const statutsDeclencheurs: StatutFacture[] = [
    // Statuts techniques achat
    'Mise à disposition',
    // Statuts métiers achat/vente
    'Prise en charge',
    'Approuvée',
    'Approuvée partiellement',
    'En litige',
    'Suspendue',
    'Paiement transmis',
  ];

  // Liste des statuts finaux disponibles (exclus les statuts techniques et certains statuts métiers)
  const statutsFinaux: StatutFacture[] = [
    // Statuts techniques achat
    'Mise à disposition',
    // Statuts métiers achat/vente
    'Prise en charge',
    'Approuvée',
    'Approuvée partiellement',
    'En litige',
    'Suspendue',
    'Refusée',
    'Paiement transmis',
  ];

  // Règles mode dynamique
  const [regles, setRegles] = useState<RegleParapheur[]>([
    {
      id: 1,
      nom: 'Factures DSI',
      statutDeclencheur: 'Mise à disposition',
      conditions: [
        {
          id: 1,
          sourceType: 'metadonnee',
          sourceChamp: 'service_payeur',
          operateur: '=',
          valeur: 'DSI',
        },
      ],
      natureDocument: 'Documents informatiques',
      circuitValidation: 'Signature des factures de la DSI',
      statutFinalAcceptation: 'Approuvée',
      statutFinalRefus: 'Refusée',
      ordre: 1,
      active: true,
    },
    {
      id: 2,
      nom: 'Factures URBANISME',
      statutDeclencheur: 'Mise à disposition',
      conditions: [
        {
          id: 1,
          sourceType: 'metadonnee',
          sourceChamp: 'service_payeur',
          operateur: '=',
          valeur: 'URBANISME',
        },
      ],
      natureDocument: 'Documents d\'urbanisme',
      circuitValidation: 'Visa directeur urbanisme',
      statutFinalAcceptation: 'Approuvée',
      statutFinalRefus: 'Refusée',
      ordre: 2,
      active: true,
    },
  ]);

  // État du formulaire de règle
  const [formulaireRegle, setFormulaireRegle] = useState({
    nom: '',
    statutDeclencheur: '' as StatutFacture | '',
    conditions: [] as Condition[],
    natureDocument: '',
    circuitValidation: '',
    statutFinalAcceptation: '' as StatutFacture | '',
    statutFinalRefus: '' as StatutFacture | '',
    ordre: regles.length + 1,
    active: true,
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
    { code: 'service_payeur', label: 'Service payeur' },
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
      statutDeclencheur: '',
      conditions: [],
      natureDocument: '',
      circuitValidation: '',
      statutFinalAcceptation: '',
      statutFinalRefus: '',
      ordre: regles.length + 1,
      active: true,
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
          statutDeclencheur: regle.statutDeclencheur,
          conditions: [...regle.conditions],
          natureDocument: regle.natureDocument,
          circuitValidation: regle.circuitValidation,
          statutFinalAcceptation: regle.statutFinalAcceptation,
          statutFinalRefus: regle.statutFinalRefus,
          ordre: regle.ordre,
          active: regle.active,
        });
        setDialogRegleOuvert(true);
      }
    }
  };

  const fermerDialogRegle = () => {
    setDialogRegleOuvert(false);
  };

  const sauvegarderRegle = () => {
    // Validation : on s'assure que les champs obligatoires sont remplis
    if (
      !formulaireRegle.nom ||
      !formulaireRegle.statutDeclencheur ||
      !formulaireRegle.natureDocument ||
      !formulaireRegle.circuitValidation ||
      !formulaireRegle.statutFinalAcceptation ||
      !formulaireRegle.statutFinalRefus
    ) {
      return;
    }

    const regleAEnregistrer: RegleParapheur = {
      nom: formulaireRegle.nom,
      statutDeclencheur: formulaireRegle.statutDeclencheur as StatutFacture,
      conditions: formulaireRegle.conditions,
      natureDocument: formulaireRegle.natureDocument,
      circuitValidation: formulaireRegle.circuitValidation,
      statutFinalAcceptation: formulaireRegle.statutFinalAcceptation as StatutFacture,
      statutFinalRefus: formulaireRegle.statutFinalRefus as StatutFacture,
      ordre: formulaireRegle.ordre,
      active: formulaireRegle.active,
      id: 0, // Sera remplacé ci-dessous
    };

    if (modeEditionRegle && regleSelectionnee) {
      regleAEnregistrer.id = regleSelectionnee.id;
      setRegles(
        regles.map((r) =>
          r.id === regleSelectionnee.id ? regleAEnregistrer : r
        )
      );
    } else {
      regleAEnregistrer.id = Math.max(...regles.map((r) => r.id), 0) + 1;
      setRegles([...regles, regleAEnregistrer]);
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
      moduleParDefaut="iXFacture"
      sousSectionSelectionnee="Interfaces"
      pageCourante="interfaces-ixfacture"
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
                      <TableCell>Statut déclencheur</TableCell>
                      <TableCell>Conditions complémentaires</TableCell>
                      <TableCell>Nature du document (iXParapheur)</TableCell>
                      <TableCell>Circuit de validation (iXParapheur)</TableCell>
                      <TableCell>Statut final (acceptation)</TableCell>
                      <TableCell>Statut final (refus)</TableCell>
                      <TableCell align="center">Ordre</TableCell>
                      <TableCell align="center">État</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
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
                              <Chip
                                label={regle.statutDeclencheur}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {regle.conditions.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                  Aucune condition complémentaire
                                </Typography>
                              ) : (
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
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{regle.natureDocument}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{regle.circuitValidation}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={regle.statutFinalAcceptation}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={regle.statutFinalRefus}
                                size="small"
                                color="error"
                                variant="outlined"
                              />
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
          {modeEditionRegle ? 'Modifier une règle iXParapheur' : 'Ajouter une règle iXParapheur'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Nom de la règle */}
            <TextField
              label="Nom de la règle"
              required
              fullWidth
              value={formulaireRegle.nom}
              onChange={(e) => setFormulaireRegle({ ...formulaireRegle, nom: e.target.value })}
            />

            {/* Section Statut déclencheur */}
            <Box>
              <Typography color="primary" variant="h6" gutterBottom>
                Statut déclencheur
              </Typography>  
              <FormControl fullWidth required size="small">
                <InputLabel>Statut qui déclenchera le dépôt iXParapheur</InputLabel>
                <Select
                  label="Statut qui déclenchera le dépôt iXParapheur"
                  value={formulaireRegle.statutDeclencheur}
                  onChange={(e) =>
                    setFormulaireRegle({ ...formulaireRegle, statutDeclencheur: e.target.value as StatutFacture })
                  }
                >
                  {statutsDeclencheurs.map((statut) => (
                    <MenuItem key={statut} value={statut}>
                      {statut}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Section Conditions complémentaires */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography color="primary" variant="h6">Conditions complémentaires</Typography>
                </Box>
                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={ajouterCondition}>
                  Ajouter une condition
                </Button>
              </Box>

              {formulaireRegle.conditions.length === 0 ? (
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune condition complémentaire définie.
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

            {/* Section Actions (ALORS) */}
            <Box>
              <Typography color="primary" variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Choix de la nature et du circuit 
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Nature iXParapheur</InputLabel>
                  <Select
                    label="Nature du document"
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
                  <InputLabel>Circuit de validation </InputLabel>
                  <Select
                    label="Circuit de validation"
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

            {/* Section Statuts finaux */}
            <Box>
              <Typography color="primary" variant="h6" gutterBottom>
                Statuts finaux
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Statut final en cas d'acceptation</InputLabel>
                  <Select
                    label="Statut final en cas d'acceptation"
                    value={formulaireRegle.statutFinalAcceptation}
                    onChange={(e) =>
                      setFormulaireRegle({ ...formulaireRegle, statutFinalAcceptation: e.target.value as StatutFacture })
                    }
                  >
                    {statutsFinaux.map((statut) => (
                      <MenuItem key={statut} value={statut}>
                        {statut}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required size="small">
                  <InputLabel>Statut final en cas de refus</InputLabel>
                  <Select
                    label="Statut final en cas de refus"
                    value={formulaireRegle.statutFinalRefus}
                    onChange={(e) =>
                      setFormulaireRegle({ ...formulaireRegle, statutFinalRefus: e.target.value as StatutFacture })
                    }
                  >
                    {statutsFinaux.map((statut) => (
                      <MenuItem key={statut} value={statut}>
                        {statut}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Ordre et activation */}
            <Box>
              <Typography color='primary' variant="h6" gutterBottom>
                Ordre d'évaluation et activation
              </Typography>

              <Box sx={{ display: 'flex', flexDirection:'row', gap: 2 }}>

                <TextField
                  label="Ordre d'exécution"
                  type="number"
                  size="small"
                  fullWidth
                  value={formulaireRegle.ordre}
                  onChange={(e) =>
                    setFormulaireRegle({ ...formulaireRegle, ordre: parseInt(e.target.value) || 0 })
                  }
                  sx={{ width: '50%' }}
                />

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
              
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Les règles sont évaluées dans l'ordre croissant. Si une règle est appliquée, les suivantes sont ignorées.
              </Typography>
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
              !formulaireRegle.statutDeclencheur ||
              !formulaireRegle.natureDocument ||
              !formulaireRegle.circuitValidation ||
              !formulaireRegle.statutFinalAcceptation ||
              !formulaireRegle.statutFinalRefus
            }
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </AdminIxBus>
  );
}

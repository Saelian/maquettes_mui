/**
 * Composant pour gérer les lignes de facture de manière dynamique
 */
import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { LigneFacture, CodeCategorieTVA } from '../../types/factureEN16931';
import {
  calculerMontantNetLigne,
  arrondirMontant,
  arrondirQuantite,
  arrondirPrixUnitaire,
  CODES_CATEGORIE_TVA,
  TAUX_TVA_AUTORISES,
} from '../../utils/validationFacture';

interface GestionLignesFactureProps {
  lignes: LigneFacture[];
  onChange: (lignes: LigneFacture[]) => void;
}

/**
 * Composant pour gérer dynamiquement les lignes de facture
 */
export const GestionLignesFacture = ({
  lignes,
  onChange,
}: GestionLignesFactureProps) => {
  const [ligneEnEdition, setLigneEnEdition] = useState<Partial<LigneFacture> | null>(null);

  // Ajouter une nouvelle ligne vide
  const ajouterLigne = () => {
    setLigneEnEdition({
      numeroLigne: lignes.length + 1,
      article: {
        nom: '',
      },
      quantite: 1,
      uniteMesure: 'C62', // Unité (pièce) par défaut
      prixUnitaireNet: 0,
      montantNet: 0,
      informationTVA: {
        codeCategorie: 'S', // Taux standard par défaut
        taux: 20.0, // 20% par défaut en France
      },
    });
  };

  // Enregistrer la ligne en cours d'édition
  const enregistrerLigne = () => {
    if (!ligneEnEdition) return;

    // Calculer le montant net
    const quantite = ligneEnEdition.quantite || 0;
    const prixUnitaire = ligneEnEdition.prixUnitaireNet || 0;
    const montantNet = calculerMontantNetLigne(quantite, prixUnitaire);

    const nouvelleLigne: LigneFacture = {
      numeroLigne: ligneEnEdition.numeroLigne || lignes.length + 1,
      article: ligneEnEdition.article || { nom: '' },
      quantite: arrondirQuantite(quantite),
      uniteMesure: ligneEnEdition.uniteMesure || 'C62',
      prixUnitaireNet: arrondirPrixUnitaire(prixUnitaire),
      prixUnitaireBrut: ligneEnEdition.prixUnitaireBrut,
      montantNet: arrondirMontant(montantNet),
      informationTVA: ligneEnEdition.informationTVA || {
        codeCategorie: 'S',
        taux: 20.0,
      },
      referenceCommande: ligneEnEdition.referenceCommande,
      notes: ligneEnEdition.notes,
    };

    onChange([...lignes, nouvelleLigne]);
    setLigneEnEdition(null);
  };

  // Supprimer une ligne
  const supprimerLigne = (index: number) => {
    const nouvellesLignes = lignes.filter((_, i) => i !== index);
    // Renuméroter les lignes
    const lignesRenumerotees = nouvellesLignes.map((ligne, i) => ({
      ...ligne,
      numeroLigne: i + 1,
    }));
    onChange(lignesRenumerotees);
  };

  // Calculer le total de la ligne en cours
  const montantLigneEnCours = ligneEnEdition
    ? calculerMontantNetLigne(
        ligneEnEdition.quantite || 0,
        ligneEnEdition.prixUnitaireNet || 0
      )
    : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Lignes de facture ({lignes.length})
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={ajouterLigne}
          disabled={ligneEnEdition !== null}
        >
          Ajouter une ligne
        </Button>
      </Box>

      {/* Tableau des lignes existantes */}
      {lignes.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>N°</TableCell>
                <TableCell>Article</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell>Unité</TableCell>
                <TableCell align="right">Prix unit. HT</TableCell>
                <TableCell align="right">Montant HT</TableCell>
                <TableCell align="right">TVA %</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lignes.map((ligne, index) => (
                <TableRow key={index}>
                  <TableCell>{ligne.numeroLigne}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {ligne.article.nom}
                    </Typography>
                    {ligne.article.description && (
                      <Typography variant="caption" color="text.secondary">
                        {ligne.article.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">{ligne.quantite}</TableCell>
                  <TableCell>{ligne.uniteMesure}</TableCell>
                  <TableCell align="right">
                    {ligne.prixUnitaireNet.toFixed(2)} €
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {ligne.montantNet.toFixed(2)} €
                  </TableCell>
                  <TableCell align="right">
                    {ligne.informationTVA.taux?.toFixed(2) || '0.00'} %
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => supprimerLigne(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Formulaire d'ajout de ligne */}
      {ligneEnEdition && (
        <Paper sx={{ p: 2, borderRadius: 0 }}>
          <Typography variant="subtitle1" gutterBottom>
            Nouvelle ligne n° {ligneEnEdition.numeroLigne}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {/* Article */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                label="Nom de l'article"
                variant="standard"
                fullWidth
                required
                value={ligneEnEdition.article?.nom || ''}
                onChange={(e) =>
                  setLigneEnEdition({
                    ...ligneEnEdition,
                    article: {
                      ...ligneEnEdition.article,
                      nom: e.target.value,
                    },
                  })
                }
              />
            </Box>

            {/* Description */}
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                label="Description de l'article"
                variant="standard"
                fullWidth
                multiline
                rows={2}
                value={ligneEnEdition.article?.description || ''}
                onChange={(e) =>
                  setLigneEnEdition({
                    ...ligneEnEdition,
                    article: {
                      ...ligneEnEdition.article,
                      nom: ligneEnEdition.article?.nom || '',
                      description: e.target.value,
                    },
                  })
                }
              />
            </Box>

            {/* Quantité */}
            <Box>
              <TextField
                label="Quantité"
                variant="standard"
                type="number"
                required
                fullWidth
                value={ligneEnEdition.quantite || 1}
                onChange={(e) => {
                  const quantite = parseFloat(e.target.value) || 0;
                  setLigneEnEdition({
                    ...ligneEnEdition,
                    quantite: arrondirQuantite(quantite),
                  });
                }}
                inputProps={{ step: 0.0001, min: 0 }}
              />
            </Box>

            {/* Unité de mesure */}
            <Box>
              <TextField
                label="Unité de mesure"
                variant="standard"
                select
                required
                fullWidth
                value={ligneEnEdition.uniteMesure || 'C62'}
                onChange={(e) =>
                  setLigneEnEdition({
                    ...ligneEnEdition,
                    uniteMesure: e.target.value,
                  })
                }
              >
                <MenuItem value="C62">Unité (pièce)</MenuItem>
                <MenuItem value="HUR">Heure</MenuItem>
                <MenuItem value="DAY">Jour</MenuItem>
                <MenuItem value="MTR">Mètre</MenuItem>
                <MenuItem value="KGM">Kilogramme</MenuItem>
                <MenuItem value="LTR">Litre</MenuItem>
                <MenuItem value="MTK">Mètre carré</MenuItem>
                <MenuItem value="MTQ">Mètre cube</MenuItem>
              </TextField>
            </Box>

            {/* Prix unitaire */}
            <Box>
              <TextField
                label="Prix unitaire net HT"
                variant="standard"
                type="number"
                required
                fullWidth
                value={ligneEnEdition.prixUnitaireNet || 0}
                onChange={(e) => {
                  const prix = parseFloat(e.target.value) || 0;
                  setLigneEnEdition({
                    ...ligneEnEdition,
                    prixUnitaireNet: arrondirPrixUnitaire(prix),
                  });
                }}
                inputProps={{ step: 0.000001, min: 0 }}
                InputProps={{
                  endAdornment: '€',
                }}
              />
            </Box>

            {/* Montant net calculé */}
            <Box>
              <TextField
                label="Montant net HT"
                variant="standard"
                type="number"
                fullWidth
                value={montantLigneEnCours.toFixed(2)}
                InputProps={{
                  readOnly: true,
                  endAdornment: '€',
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>

            {/* Catégorie TVA */}
            <Box>
              <TextField
                label="Catégorie TVA"
                variant="standard"
                select
                required
                fullWidth
                value={ligneEnEdition.informationTVA?.codeCategorie || 'S'}
                onChange={(e) =>
                  setLigneEnEdition({
                    ...ligneEnEdition,
                    informationTVA: {
                      ...ligneEnEdition.informationTVA,
                      codeCategorie: e.target.value as CodeCategorieTVA,
                    },
                  })
                }
              >
                {CODES_CATEGORIE_TVA.map((code) => (
                  <MenuItem key={code} value={code}>
                    {code} - {
                      code === 'S' ? 'Taux standard' :
                      code === 'E' ? 'Exonéré' :
                      code === 'AE' ? 'Autoliquidation' :
                      code === 'K' ? 'Intracommunautaire' :
                      code === 'G' ? 'Export hors UE' :
                      code === 'O' ? 'Hors champ' :
                      'Taux zéro'
                    }
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Taux TVA */}
            <Box>
              <TextField
                label="Taux de TVA"
                variant="standard"
                select
                fullWidth
                value={ligneEnEdition.informationTVA?.taux || 20.0}
                onChange={(e) =>
                  setLigneEnEdition({
                    ...ligneEnEdition,
                    informationTVA: {
                      ...ligneEnEdition.informationTVA,
                      codeCategorie: ligneEnEdition.informationTVA?.codeCategorie || 'S',
                      taux: parseFloat(e.target.value),
                    },
                  })
                }
                disabled={ligneEnEdition.informationTVA?.codeCategorie !== 'S'}
              >
                {TAUX_TVA_AUTORISES.map((taux) => (
                  <MenuItem key={taux} value={taux}>
                    {taux.toFixed(2)} %
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Référence commande */}
            <Box>
              <TextField
                label="Référence de commande"
                variant="standard"
                fullWidth
                value={ligneEnEdition.referenceCommande || ''}
                onChange={(e) =>
                  setLigneEnEdition({
                    ...ligneEnEdition,
                    referenceCommande: e.target.value,
                  })
                }
              />
            </Box>
          </Box>

          {/* Boutons d'action */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={() => setLigneEnEdition(null)}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={enregistrerLigne}
              disabled={!ligneEnEdition.article?.nom || (ligneEnEdition.quantite || 0) <= 0}
            >
              Enregistrer la ligne
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

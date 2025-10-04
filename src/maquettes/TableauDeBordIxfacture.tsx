import { useState } from 'react';
import {
  Box,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Badge,
} from '@mui/material';
import {
  HelpOutline,
  Description,
} from '@mui/icons-material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

/**
 * Maquette Tableau de bord iXfacture
 *
 * Basée sur le template UtilisateurIxBus (menu Utilisateur)
 * Affiche un tableau de bord avec zone de recherche et grilles de factures
 */
export default function TableauDeBordIxfacture() {
  const [configRecherche, setConfigRecherche] = useState('Dynamique');
  const [temporalite, setTemporalite] = useState('Jours');
  const [duree, setDuree] = useState('7');

  return (
    <UtilisateurIxBus>
      {/* Zone de recherche */}
      <Box sx={{ bgcolor: 'white', p: 2, boxShadow: 1, mt: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Configuration de la recherche
            </Typography>
            <Select
              value={configRecherche}
              variant="standard"
              onChange={(e) => setConfigRecherche(e.target.value)}
              fullWidth
              size="small"
              sx={{ mt: 0.5 }}
            >
              <MenuItem value="Dynamique">Dynamique</MenuItem>
              <MenuItem value="Statique">Statique</MenuItem>
            </Select>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Temporalité
            </Typography>
            <Select
              value={temporalite}
              variant="standard"
              onChange={(e) => setTemporalite(e.target.value)}
              fullWidth
              size="small"
              sx={{ mt: 0.5 }}
            >
              <MenuItem value="Jours">Jours</MenuItem>
              <MenuItem value="Semaines">Semaines</MenuItem>
              <MenuItem value="Mois">Mois</MenuItem>
            </Select>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Durée : Recherche sur les 7 derniers jours
            </Typography>
            <TextField
              value={duree}
              variant="standard"
              onChange={(e) => setDuree(e.target.value)}
              fullWidth
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<HelpOutline />}
            sx={{ height: 40, bgcolor: '#008577', '&:hover': { bgcolor: '#006d62' } }}
          >
            Rechercher
          </Button>
        </Box>
      </Box>

      {/* Disposition en deux colonnes */}
      <Box sx={{ display: 'flex', gap: 3, pt: 2, flex: 1 }}>
        
        {/* Colonne gauche - Factures d'achat */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, mb: 2, borderRadius: 0 }}>
            <Typography variant="h6">Factures d'achat</Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 2, borderRadius: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Total achats du mois</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="h4" sx={{ color: '#008577', fontWeight: 'bold' }}>
                    87 340 €
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 2, borderRadius: 0 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Répartition par statut
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Factures reçues</Typography>
                <Badge badgeContent="94" sx={{ '& .MuiBadge-badge': { bgcolor: '#008577', color: 'white', position: 'static', transform: 'none' } }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Factures validées</Typography>
                <Badge badgeContent="81" sx={{ '& .MuiBadge-badge': { bgcolor: '#4caf50', color: 'white', position: 'static', transform: 'none' } }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Factures en attente</Typography>
                <Badge badgeContent="13" sx={{ '& .MuiBadge-badge': { bgcolor: '#ff9800', color: 'white', position: 'static', transform: 'none' } }} />
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, flex: 1, borderRadius: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Description sx={{ color: '#008577' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Dernières factures reçues
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FOUR-2025-045</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>2 150 €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FOUR-2025-046</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>5 420 €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FOUR-2025-047</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>1 890 €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FOUR-2025-049</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>1 990 €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FOUR-2025-050</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>990 €</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>


        {/* Colonne droite - Factures de vente */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Paper sx={{ p: 2, mb: 2, borderRadius: 0 }}>
            <Typography variant="h6">Factures de vente</Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 2, borderRadius: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Total ventes du mois</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="h4" sx={{ color: '#008577', fontWeight: 'bold' }}>
                    124 580 €
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 2, borderRadius: 0 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Répartition par statut
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Factures envoyées</Typography>
                <Badge badgeContent="148" sx={{ '& .MuiBadge-badge': { bgcolor: '#008577', color: 'white', position: 'static', transform: 'none' } }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Factures acceptées</Typography>
                <Badge badgeContent="132" sx={{ '& .MuiBadge-badge': { bgcolor: '#4caf50', color: 'white', position: 'static', transform: 'none' } }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Factures retournées</Typography>
                <Badge badgeContent="16" sx={{ '& .MuiBadge-badge': { bgcolor: '#f44336', color: 'white', position: 'static', transform: 'none' } }} />
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, flex: 1, borderRadius: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Description sx={{ color: '#008577' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Dernières factures émises
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FAC-2025-001</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>1 245 €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FAC-2025-002</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>3 890 €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FAC-2025-003</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>875 €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FAC-2025-004</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>855 €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body2">FAC-2025-005</Typography>
                <Typography variant="body2" sx={{ color: '#008577', fontWeight: 'bold' }}>1 875 €</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </UtilisateurIxBus>
  );
}

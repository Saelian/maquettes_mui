import { useState } from 'react';
import {
  Box,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  IconButton,
  Badge,
} from '@mui/material';
import {
  HelpOutline,
  Dashboard,
  Settings,
  BarChart,
} from '@mui/icons-material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

/**
 * Maquette Base iXBus Utilisateur
 *
 * Basée sur le template UtilisateurIxBus (menu Utilisateur)
 * Affiche un tableau de bord avec zone de recherche et grilles de factures
 */
export default function BaseIxbus() {
  const [configRecherche, setConfigRecherche] = useState('Dynamique');
  const [temporalite, setTemporalite] = useState('Jours');
  const [duree, setDuree] = useState('7');

  return (
    <UtilisateurIxBus>
      {/* Zone de recherche */}
      <Box sx={{ bgcolor: 'white', p: 2, boxShadow: 1, mt: 2 }}>
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

      {/* Bouton Envoi */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Button
          variant="outlined"
          startIcon={<BarChart />}
          sx={{ borderColor: '#008577', color: '#008577' }}
        >
          Envoi
        </Button>
      </Box>

      {/* Grille de factures - Section Envoi */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper sx={{ flex: 1, p: 2, minHeight: 250 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Dashboard sx={{ color: '#008577' }} />
              <Typography variant="h6" sx={{ flex: 1 }}>
                Factures récentes
              </Typography>
              <IconButton size="small">
                <Settings sx={{ color: '#008577' }} />
              </IconButton>
            </Box>
          </Paper>

          <Paper sx={{ flex: 1, p: 2, minHeight: 250 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Dashboard sx={{ color: '#008577' }} />
              <Typography variant="h6" sx={{ flex: 1 }}>
                Factures retournées
              </Typography>
              <IconButton size="small">
                <Settings sx={{ color: '#008577' }} />
              </IconButton>
            </Box>
          </Paper>

          <Paper sx={{ flex: 1, p: 2, minHeight: 250 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Dashboard sx={{ color: '#008577' }} />
              <Typography variant="h6" sx={{ flex: 1 }}>
                Factures acceptées
              </Typography>
              <IconButton size="small">
                <Settings sx={{ color: '#008577' }} />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Bouton Réception */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Button
          variant="outlined"
          startIcon={<BarChart />}
          sx={{ borderColor: '#008577', color: '#008577' }}
        >
          Réception
        </Button>
      </Box>

      {/* Grille de factures - Section Réception */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper sx={{ flex: 1, p: 2, minHeight: 250 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Dashboard sx={{ color: '#008577' }} />
              <Typography variant="h6" sx={{ flex: 1 }}>
                Factures retournées
              </Typography>
              <IconButton size="small">
                <Settings sx={{ color: '#008577' }} />
              </IconButton>
            </Box>
          </Paper>

          <Paper sx={{ flex: 1, p: 2, minHeight: 250 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Dashboard sx={{ color: '#008577' }} />
              <Typography variant="h6" sx={{ flex: 1 }}>
                Factures acceptées
              </Typography>
              <IconButton size="small">
                <Settings sx={{ color: '#008577' }} />
              </IconButton>
            </Box>
          </Paper>

          <Paper sx={{ flex: 1, p: 2, minHeight: 250 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Dashboard sx={{ color: '#008577' }} />
              <Typography variant="h6" sx={{ flex: 1 }}>
                Factures récentes
              </Typography>
              <IconButton size="small">
                <Settings sx={{ color: '#008577' }} />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Factures mises à disposition
              </Typography>
              <Badge badgeContent={2} sx={{ '& .MuiBadge-badge': { bgcolor: '#008577', color: 'white' } }}>
                <Box sx={{ width: 30, height: 30 }} />
              </Badge>
            </Box>
          </Paper>
        </Box>
      </Box>
    </UtilisateurIxBus>
  );
}

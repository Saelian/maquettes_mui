import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

interface Tache {
  id: number;
  titre: string;
  terminee: boolean;
  priorite: 'basse' | 'moyenne' | 'haute';
  dateCreation: Date;
}

/**
 * Maquette TodoList
 *
 * Maquette d'application de gestion de tâches (todo list) avec :
 * - Ajout de nouvelles tâches avec niveau de priorité
 * - Marquage des tâches comme terminées/non terminées
 * - Suppression de tâches
 * - Filtrage des tâches (toutes, actives, terminées)
 * - Compteurs de tâches
 */
export default function TodoList() {
  const [taches, setTaches] = useState<Tache[]>([
    { id: 1, titre: 'Valider les factures du mois', terminee: false, priorite: 'haute', dateCreation: new Date() },
    { id: 2, titre: 'Mettre à jour la documentation', terminee: false, priorite: 'moyenne', dateCreation: new Date() },
    { id: 3, titre: 'Archiver les anciens documents', terminee: true, priorite: 'basse', dateCreation: new Date() }
  ]);
  const [nouvelleTache, setNouvelleTache] = useState('');
  const [prioriteSelectionnee, setPrioriteSelectionnee] = useState<'basse' | 'moyenne' | 'haute'>('moyenne');
  const [filtre, setFiltre] = useState<'toutes' | 'actives' | 'terminees'>('toutes');

  const ajouterTache = () => {
    if (nouvelleTache.trim() === '') return;

    const tache: Tache = {
      id: Date.now(),
      titre: nouvelleTache,
      terminee: false,
      priorite: prioriteSelectionnee,
      dateCreation: new Date()
    };

    setTaches([...taches, tache]);
    setNouvelleTache('');
    setPrioriteSelectionnee('moyenne');
  };

  const supprimerTache = (id: number) => {
    setTaches(taches.filter(t => t.id !== id));
  };

  const basculerTerminee = (id: number) => {
    setTaches(taches.map(t =>
      t.id === id ? { ...t, terminee: !t.terminee } : t
    ));
  };

  const obtenirCouleurPriorite = (priorite: string) => {
    switch (priorite) {
      case 'haute': return 'error';
      case 'moyenne': return 'warning';
      case 'basse': return 'success';
      default: return 'default';
    }
  };

  const tachesFiltrees = taches.filter(tache => {
    if (filtre === 'actives') return !tache.terminee;
    if (filtre === 'terminees') return tache.terminee;
    return true;
  });

  const nombreTachesActives = taches.filter(t => !t.terminee).length;
  const nombreTachesTerminees = taches.filter(t => t.terminee).length;

  return (
    <UtilisateurIxBus titre="Gestion des tâches" sousTitre="Todo List">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
          {/* En-tête avec statistiques */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Mes tâches
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                label={`${taches.length} tâche${taches.length > 1 ? 's' : ''} au total`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`${nombreTachesActives} active${nombreTachesActives > 1 ? 's' : ''}`}
                color="info"
                variant="outlined"
              />
              <Chip
                label={`${nombreTachesTerminees} terminée${nombreTachesTerminees > 1 ? 's' : ''}`}
                color="success"
                variant="outlined"
              />
            </Stack>
          </Box>

          {/* Formulaire d'ajout de tâche */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#fafafa' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
              Ajouter une nouvelle tâche
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Titre de la tâche"
                value={nouvelleTache}
                onChange={(e) => setNouvelleTache(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    ajouterTache();
                  }
                }}
                size="small"
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Priorité</InputLabel>
                <Select
                  value={prioriteSelectionnee}
                  label="Priorité"
                  onChange={(e: SelectChangeEvent<'basse' | 'moyenne' | 'haute'>) =>
                    setPrioriteSelectionnee(e.target.value as 'basse' | 'moyenne' | 'haute')
                  }
                >
                  <MenuItem value="basse">Basse</MenuItem>
                  <MenuItem value="moyenne">Moyenne</MenuItem>
                  <MenuItem value="haute">Haute</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={ajouterTache}
                disabled={nouvelleTache.trim() === ''}
              >
                Ajouter
              </Button>
            </Stack>
          </Paper>

          {/* Filtres */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant={filtre === 'toutes' ? 'contained' : 'outlined'}
                onClick={() => setFiltre('toutes')}
                size="small"
              >
                Toutes
              </Button>
              <Button
                variant={filtre === 'actives' ? 'contained' : 'outlined'}
                onClick={() => setFiltre('actives')}
                size="small"
              >
                Actives
              </Button>
              <Button
                variant={filtre === 'terminees' ? 'contained' : 'outlined'}
                onClick={() => setFiltre('terminees')}
                size="small"
              >
                Terminées
              </Button>
            </Stack>
          </Box>

          {/* Liste des tâches */}
          {tachesFiltrees.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Aucune tâche à afficher
              </Typography>
            </Box>
          ) : (
            <List>
              {tachesFiltrees.map((tache) => (
                <ListItem
                  key={tache.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: tache.terminee ? '#f5f5f5' : 'background.paper'
                  }}
                >
                  <Checkbox
                    checked={tache.terminee}
                    onChange={() => basculerTerminee(tache.id)}
                    edge="start"
                  />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          sx={{
                            textDecoration: tache.terminee ? 'line-through' : 'none',
                            color: tache.terminee ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {tache.titre}
                        </Typography>
                        <Chip
                          label={tache.priorite.charAt(0).toUpperCase() + tache.priorite.slice(1)}
                          color={obtenirCouleurPriorite(tache.priorite)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      tache.terminee
                        ? 'Tâche terminée'
                        : 'En cours'
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="supprimer"
                      onClick={() => supprimerTache(tache.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </UtilisateurIxBus>
  );
}

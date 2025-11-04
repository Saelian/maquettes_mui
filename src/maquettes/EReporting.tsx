import { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Paper,
  Stack,
} from '@mui/material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';
import TableauFluxEReporting from '../composants/ereporting/TableauFluxEReporting';
import DetailFlux from '../composants/ereporting/DetailFlux';
import { genererFluxEReporting } from '../utils/genererDonneesEReporting';
import type { FluxEReporting, TypeFlux } from '../types/ereporting';
import { LIBELLE_FLUX } from '../types/ereporting';

export default function EReporting() {
  // Génération des données fictives
  const fluxGeneres = useMemo(() => genererFluxEReporting(5), []);

  // État local
  const [fluxSelectionne, setFluxSelectionne] = useState<FluxEReporting | null>(null);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [filtreTypeFlux, setFiltreTypeFlux] = useState<TypeFlux | 'tous'>('tous');
  const [rechercheTexte, setRechercheTexte] = useState('');

  // Filtrage des flux
  const fluxFiltres = useMemo(() => {
    let resultat = [...fluxGeneres];

    // Filtre par type de flux
    if (filtreTypeFlux !== 'tous') {
      resultat = resultat.filter((flux) => flux.typeFlux === filtreTypeFlux);
    }

    // Recherche textuelle
    if (rechercheTexte.trim() !== '') {
      const texteRecherche = rechercheTexte.toLowerCase();
      resultat = resultat.filter(
        (flux) =>
          flux.donneesRacine.idTransmission.toLowerCase().includes(texteRecherche) ||
          flux.donneesRacine.emetteur.raisonSociale.toLowerCase().includes(texteRecherche) ||
          flux.donneesRacine.declarant.raisonSociale.toLowerCase().includes(texteRecherche) ||
          flux.donneesRacine.emetteur.id.includes(texteRecherche) ||
          flux.donneesRacine.declarant.id.includes(texteRecherche)
      );
    }

    return resultat;
  }, [fluxGeneres, filtreTypeFlux, rechercheTexte]);

  // Gestionnaires d'événements
  const handleVoirDetail = (flux: FluxEReporting) => {
    setFluxSelectionne(flux);
    setModalOuverte(true);
  };

  const handleFermerModal = () => {
    setModalOuverte(false);
    // On garde le flux sélectionné pour éviter un flash pendant la fermeture
    setTimeout(() => setFluxSelectionne(null), 300);
  };

  const handleChangeFiltreTypeFlux = (event: SelectChangeEvent) => {
    setFiltreTypeFlux(event.target.value as TypeFlux | 'tous');
  };

  const contenu = (
    <Box sx={{ mt: 1, mb: 4 }}>

      {/* Filtres et recherche */}
      <Paper sx={{ p: 2, mb: 1, borderRadius: 0 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Rechercher"
            size="small"
            variant="standard"
            fullWidth
            value={rechercheTexte}
            onChange={(e) => setRechercheTexte(e.target.value)}
            placeholder="ID transmission, SIREN, raison sociale..."
          />
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel id="filtre-type-flux-label">Type de flux</InputLabel>
            <Select
              labelId="filtre-type-flux-label"
              id="filtre-type-flux"
              value={filtreTypeFlux}
              label="Type de flux"
              onChange={handleChangeFiltreTypeFlux}
            >
              <MenuItem value="tous">Tous les flux</MenuItem>
              <MenuItem value="10.1">Flux 10.1 - {LIBELLE_FLUX['10.1']}</MenuItem>
              <MenuItem value="10.2">Flux 10.2 - {LIBELLE_FLUX['10.2']}</MenuItem>
              <MenuItem value="10.3">Flux 10.3 - {LIBELLE_FLUX['10.3']}</MenuItem>
              <MenuItem value="10.4">Flux 10.4 - {LIBELLE_FLUX['10.4']}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Tableau des flux */}
      <TableauFluxEReporting flux={fluxFiltres} onVoirDetail={handleVoirDetail} />

      {/* Modal de détail */}
      <DetailFlux flux={fluxSelectionne} ouvert={modalOuverte} onFermer={handleFermerModal} />
    </Box>
  );

  return <UtilisateurIxBus titre="E-reporting">
      {contenu}
    </UtilisateurIxBus>;
}

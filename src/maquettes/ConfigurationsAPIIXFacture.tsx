import { useState } from 'react';
import AdminIxBus from '../templates/AdminIxBus';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';

import { Save, WifiTetheringError, Token } from '@mui/icons-material';

/**
 * Maquette InterfacesIXFacture
 *
 * Permet de paramétrer les credentials pour la connexion aux API
 * nécessaires pour la réforme de la facturation électronique 2026 :
 * - API vers Chorus Portail Pro via PISTE (OAuth2)
 * - API vers la Plateforme Agréée (OAuth2)
 */
export default function ConfigurationsAPIIXFacture() {
  const [ongletActif, setOngletActif] = useState(0);

  const handleChangeOnglet = (_event: React.SyntheticEvent, nouvelOnglet: number) => {
    setOngletActif(nouvelOnglet);
  };

  return (
    <AdminIxBus
      titre="Configuration API CPP/PA"
      moduleParDefaut="iXFacture"
      pageCourante="configurations-api-ixfacture"
    >
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Onglets */}
        <Box sx={{ backgroundColor: 'white' }}>
          <Tabs value={ongletActif} onChange={handleChangeOnglet}>
            <Tab label="PISTE / Chorus Pro" />
            <Tab label="Plateforme Agréée" />
            {/* <Tab label="IXFacture API" /> */}
          </Tabs>
        </Box>

        {/* Onglet PISTE / Chorus Pro */}
        {ongletActif === 0 && (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configuration de la connexion à Chorus Portail Pro via PISTE
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Environnement</InputLabel>
                    <Select label="Environnement" defaultValue="production">
                      <MenuItem value="qualification">Qualification</MenuItem>
                      <MenuItem value="production">Production</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client ID"
                    defaultValue="chorus-client-a7b3c9d2e5f1"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client Secret"
                    type="password"
                    defaultValue="8k9L2mN5pQ7rS1tU3vW6xY0zA4bC8dE"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Nom Utilisateur Technique"
                    defaultValue="TECH_1234@cpro.fr"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Mot de passe Utilisateur Technique"
                    type="password"
                    defaultValue="8k9L2mN5pQ7rS1tU3vW6xY0zA4bC8dE"
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button startIcon={<Save />} variant="contained" color="primary">
                  Enregistrer
                </Button>
                <Button startIcon={<WifiTetheringError />} variant="outlined">
                  Tester la connexion
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Onglet Plateforme Agréée */}
        {ongletActif === 1 && (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configuration de la connexion à la Plateforme Agréée
              </Typography>
              <Divider sx={{ mb: 3 }} />


              <Box sx={{ mb: 5 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Environnement</InputLabel>
                    <Select label="Environnement" defaultValue="production">
                      <MenuItem value="qualification">Qualification</MenuItem>
                      <MenuItem value="production">Production</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client ID"
                    defaultValue="user@pa-srci.fr"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client Secret"
                    type="password"
                    defaultValue="4fG8hJ2kL5mN9pQ3rS7tU1vW6xY0zA"
                  />
                </Box>

              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button startIcon={<Save />} variant="contained" color="primary">
                  Enregistrer
                </Button>
                <Button startIcon={<WifiTetheringError />} variant="outlined">
                  Tester la connexion
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Onglet IXFacture API */}
        {ongletActif === 2 && (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Interface IXFacture API (OAuth2)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configuration de la connexion à IXFacture (pour les applications tierces)
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client ID (OAuth2)"
                    defaultValue="mtiptop@srci.fr"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client Secret (OAuth2)"
                    type="password"
                    defaultValue="8k9L2mN5pQ7rS1tU3vW6xY0zA4bC8dE"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Authorization Endpoint URL"
                    placeholder="https://..."
                    defaultValue="https://demodemat.ixbus.net/api/v1/oauth/authorize"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Token Endpoint URL"
                    placeholder="https://..."
                    defaultValue="https://demodemat.ixbus.net/api/v1/oauth/token"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Redirect URI(s)"
                    placeholder="https://..."
                    helperText="Séparés par des virgules si plusieurs"
                    defaultValue="https://demodemat.ixbus.net/api/v1/callback"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Scopes"
                    placeholder="openid profile email"
                    helperText="Séparés par des espaces"
                    defaultValue="api"
                  />
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    fullWidth
                    label="Refresh Token"
                    type="password"
                    multiline
                    rows={2}
                    defaultValue="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNob3J1cyBQcm8gUmVmcmVzaCBUb2tlbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNzE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button startIcon={<Save />} variant="contained" color="primary">
                  Enregistrer
                </Button>
                <Button startIcon={<Token />} variant="outlined">
                  Obtenir le token d'accès
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </AdminIxBus>
  );
}

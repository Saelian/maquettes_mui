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
      titre="Configuration iXFacture"
      sousTitre="Interfaces API - Facturation électronique 2026"
      moduleParDefaut="iXFacture"
    >
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Onglets */}
        <Box sx={{ backgroundColor: 'white' }}>
          <Tabs value={ongletActif} onChange={handleChangeOnglet}>
            <Tab label="PISTE / Chorus Pro" />
            <Tab label="Plateforme Agréée" />
            <Tab label="IXFacture API" />
          </Tabs>
        </Box>

        {/* Onglet PISTE / Chorus Pro */}
        {ongletActif === 0 && (
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Interface PISTE / Chorus Pro (OAuth2)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configuration de la connexion à Chorus Portail Pro via PISTE
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Nom de l'interface"
                    defaultValue="Chorus Pro Production"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Type de plateforme</InputLabel>
                    <Select label="Type de plateforme" defaultValue="chorus-pro">
                      <MenuItem value="chorus-pro">Chorus Pro</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Environnement</InputLabel>
                    <Select label="Environnement" defaultValue="production">
                      <MenuItem value="qualification">Qualification</MenuItem>
                      <MenuItem value="production">Production</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Structure (SIRET)"
                    placeholder="14 chiffres"
                    defaultValue="12345678901234"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Nom de l'application PISTE"
                    defaultValue="iXFacture Chorus Connect"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client ID (OAuth2)"
                    defaultValue="chorus-client-a7b3c9d2e5f1"
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
                    defaultValue="https://sandbox-oauth.piste.gouv.fr/api/oauth/authorize"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Token Endpoint URL"
                    placeholder="https://..."
                    defaultValue="https://sandbox-oauth.piste.gouv.fr/api/oauth/token"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Redirect URI(s)"
                    placeholder="https://..."
                    helperText="Séparés par des virgules si plusieurs"
                    defaultValue="https://app.ixfacture.fr/callback,https://localhost:3000/callback"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Scopes"
                    placeholder="openid profile email"
                    helperText="Séparés par des espaces"
                    defaultValue="openid profile email chorus_portail_api"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Grant type(s)"
                    placeholder="client_credentials, authorization_code"
                    helperText="Séparés par des virgules"
                    defaultValue="authorization_code, refresh_token, client_credentials"
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
              <Typography variant="h5" gutterBottom>
                Interface Plateforme Agréée (OAuth2)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configuration de la connexion à la Plateforme de Dématérialisation Partenaire
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Nom de l'interface"
                    defaultValue="Plateforme Partenaire Production"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Environnement</InputLabel>
                    <Select label="Environnement" defaultValue="production">
                      <MenuItem value="sandbox">Sandbox</MenuItem>
                      <MenuItem value="qualification">Qualification</MenuItem>
                      <MenuItem value="production">Production</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client ID (OAuth2)"
                    defaultValue="pdp-client-x1y2z3a4b5c6"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Client Secret (OAuth2)"
                    type="password"
                    defaultValue="4fG8hJ2kL5mN9pQ3rS7tU1vW6xY0zA"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Authorization Server URL"
                    placeholder="https://..."
                    defaultValue="https://oauth.plateforme-partenaire.fr/oauth2/authorize"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Token Endpoint URL"
                    placeholder="https://..."
                    defaultValue="https://oauth.plateforme-partenaire.fr/oauth2/token"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Redirect URI(s)"
                    placeholder="https://..."
                    helperText="Séparés par des virgules si plusieurs"
                    defaultValue="https://app.ixfacture.fr/pdp-callback"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Scopes API"
                    placeholder="api:read api:write"
                    helperText="Séparés par des espaces"
                    defaultValue="facture:read facture:write facture:send edocument:manage"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Grant type(s)"
                    placeholder="client_credentials, authorization_code, refresh_token"
                    helperText="Séparés par des virgules"
                    defaultValue="client_credentials, authorization_code, refresh_token"
                  />
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <TextField
                    fullWidth
                    label="Refresh Token"
                    type="password"
                    multiline
                    rows={2}
                    defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IlBsYXRlZm9ybWUgUGFydGVuYWlyZSBSZWZyZXNoIFRva2VuIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MTYyMzkwMjJ9.4pC8xwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQvvw9d"
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

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Divider, Card, CardContent, CardActionArea, Chip } from '@mui/material';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { Palette as PaletteIcon, ViewQuilt as ViewQuiltIcon } from '@mui/icons-material';
import TableauDeBordIxfacture from './maquettes/TableauDeBordIxfacture';
import PrepareriXFacture from './maquettes/PrepareriXFacture';
import FacturesAchatiXfacture from './maquettes/FacturesAchatiXfacture';
import FacturesVenteIxfacture from './maquettes/FacturesVenteIxfacture';
import ConfigurationsAPIIXFacture from './maquettes/ConfigurationsAPIIXFacture';
import MetadonneesIXFacture from './maquettes/MetadonneesIXFacture';
import InterfacesIXFacture from './maquettes/InterfacesIXFacture';
import UtilisateurIxBus from './templates/UtilisateurIxBus';
import AdminIxBus from './templates/AdminIxBus';

const maquettes = [
  { nom: 'Tableau de bord iXfacture', chemin: '/tableau-de-bord-ixfacture', composant: <TableauDeBordIxfacture /> },
  { nom: 'Préparer iXFacture', chemin: '/preparer-ixfacture', composant: <PrepareriXFacture /> },
  { nom: 'Factures d\'achat iXfacture', chemin: '/factures-achat-ixfacture', composant: <FacturesAchatiXfacture /> },
  { nom: 'Factures de vente iXfacture', chemin: '/factures-vente-ixfacture', composant: <FacturesVenteIxfacture /> },
  { nom: 'Configurations API IXFacture', chemin: '/config-api-ixfacture', composant: <ConfigurationsAPIIXFacture /> },
  { nom: 'Métadonnées iXFacture', chemin: '/metadonnees-ixfacture', composant: <MetadonneesIXFacture /> },
  { nom: 'Interfaces iXFacture', chemin: '/interfaces-ixfacture', composant: <InterfacesIXFacture /> },
];

const templates = [
  {
    nom: 'UtilisateurIxBus',
    chemin: '/template-utilisateur-ixbus',
    composant: (
      <UtilisateurIxBus>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Template UtilisateurIxBus
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ce template fournit une structure de base avec AppBar, menu Utilisateur (Drawer) et zone de contenu personnalisable.
          </Typography>
        </Box>
      </UtilisateurIxBus>
    )
  },
  {
    nom: 'AdminIxBus',
    chemin: '/template-admin-ixbus',
    composant: (
      <AdminIxBus>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Template AdminIxBus
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ce template fournit une structure de base avec AppBar, menu Administrateur (Drawer) et zone de contenu personnalisable.
          </Typography>
        </Box>
      </AdminIxBus>
    )
  },
];

function Sommaire() {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 6
    }}>
      <Container maxWidth="lg">
        {/* En-tête */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#008577',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Maquettes Material UI
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Collection de templates et maquettes pour divers produits
          </Typography>
          <Chip
            label={`${templates.length} template${templates.length > 1 ? 's' : ''} • ${maquettes.length} maquette${maquettes.length > 1 ? 's' : ''}`}
            sx={{
              bgcolor: '#008577',
              color: 'white',
              fontWeight: 600,
              px: 1
            }}
          />
        </Box>

        {/* Templates */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ViewQuiltIcon sx={{ color: '#008577', mr: 1, fontSize: 32 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: '#333' }}>
              Templates
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {templates.map((template) => (
              <Box key={template.chemin} sx={{ flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,133,119,0.2)',
                    }
                  }}
                >
                  <CardActionArea
                    component={RouterLink}
                    to={template.chemin}
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        pb: 2,
                        borderBottom: '2px solid #008577'
                      }}>
                        <ViewQuiltIcon sx={{ color: '#008577', mr: 1 }} />
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                          {template.nom}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Template réutilisable avec structure de base
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 6, borderColor: 'rgba(0,0,0,0.2)' }} />

        {/* Maquettes */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PaletteIcon sx={{ color: '#008577', mr: 1, fontSize: 32 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: '#333' }}>
              Maquettes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {maquettes.map((maquette) => (
              <Box key={maquette.chemin} sx={{ flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,133,119,0.2)',
                    }
                  }}
                >
                  <CardActionArea
                    component={RouterLink}
                    to={maquette.chemin}
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        pb: 2,
                        borderBottom: '2px solid #008577'
                      }}>
                        <PaletteIcon sx={{ color: '#008577', mr: 1 }} />
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                          {maquette.nom}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Maquette d'interface utilisateur
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sommaire />} />
        {templates.map((template) => (
          <Route key={template.chemin} path={template.chemin} element={template.composant} />
        ))}
        {maquettes.map((maquette) => (
          <Route key={maquette.chemin} path={maquette.chemin} element={maquette.composant} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

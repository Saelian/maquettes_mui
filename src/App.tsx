import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import PremierTest from './maquettes/PremierTest';
import BaseIxbus from './maquettes/BaseIxbus';
import UtilisateurIxBus from './templates/UtilisateurIxBus';

const maquettes = [
  { nom: 'Premier test', chemin: '/premier-test', composant: <PremierTest /> },
  { nom: 'Base iXBus Utilisateur', chemin: '/base-ixbus', composant: <BaseIxbus /> },
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note : Un template AdministrateurIxBus sera créé pour les maquettes avec le menu Administrateur.
          </Typography>
        </Box>
      </UtilisateurIxBus>
    )
  },
];

function Sommaire() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Sommaire des maquettes
        </Typography>

        <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 1 }}>
          Templates
        </Typography>
        <List>
          {templates.map((template) => (
            <ListItem key={template.chemin} disablePadding>
              <ListItemButton component={RouterLink} to={template.chemin}>
                <ListItemText primary={template.nom} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 1 }}>
          Maquettes
        </Typography>
        <List>
          {maquettes.map((maquette) => (
            <ListItem key={maquette.chemin} disablePadding>
              <ListItemButton component={RouterLink} to={maquette.chemin}>
                <ListItemText primary={maquette.nom} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
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

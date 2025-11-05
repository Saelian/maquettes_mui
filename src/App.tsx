import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectionMotDePasse from './composants/ProtectionMotDePasse';
import Accueil from './pages/Accueil';
import TableauDeBordIxfacture from './maquettes/TableauDeBordIxfacture';
import PrepareriXFacture from './maquettes/PrepareriXFacture';
import FacturesAchatiXfacture from './maquettes/FacturesAchatiXfacture';
import FacturesVenteIxfacture from './maquettes/FacturesVenteIxfacture';
import ConfigurationsAPIIXFacture from './maquettes/ConfigurationsAPIIXFacture';
import MetadonneesIXFacture from './maquettes/MetadonneesIXFacture';
import InterfacesIXFacture from './maquettes/InterfacesIXFacture';
import ConsultationAnnuaireIXFacture from './maquettes/ConsultationAnnuaireIXFacture';
import EReporting from './maquettes/EReporting';
import UtilisateurIxBus from './templates/UtilisateurIxBus';
import AdminIxBus from './templates/AdminIxBus';
import NaturesIXFacture from './maquettes/NaturesIXFacture';
import { Box, Typography } from '@mui/material';

const maquettes = [
  { nom: 'Tableau de bord iXfacture', chemin: '/tableau-de-bord-ixfacture', composant: <TableauDeBordIxfacture /> },
  { nom: 'Préparer iXFacture', chemin: '/preparer-ixfacture', composant: <PrepareriXFacture /> },
  { nom: 'Factures d\'achat iXfacture', chemin: '/factures-achat-ixfacture', composant: <FacturesAchatiXfacture /> },
  { nom: 'Factures de vente iXfacture', chemin: '/factures-vente-ixfacture', composant: <FacturesVenteIxfacture /> },
  { nom: 'Consultation annuaire iXFacture', chemin: '/consultation-annuaire-ixfacture', composant: <ConsultationAnnuaireIXFacture /> },
  { nom: 'Configurations API IXFacture', chemin: '/config-api-ixfacture', composant: <ConfigurationsAPIIXFacture /> },
  { nom: 'Natures IXFacture', chemin: '/natures-ixfacture', composant: <NaturesIXFacture /> },
  { nom: 'Métadonnées iXFacture', chemin: '/metadonnees-ixfacture', composant: <MetadonneesIXFacture /> },
  { nom: 'Interfaces iXFacture', chemin: '/interfaces-ixfacture', composant: <InterfacesIXFacture /> },
  { nom: 'E-Reporting', chemin: '/ereporting', composant: <EReporting /> },
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

export default function App() {
  return (
    <BrowserRouter>
      <ProtectionMotDePasse>
        <Routes>
          <Route path="/" element={<Accueil />} />
          {templates.map((template) => (
            <Route key={template.chemin} path={template.chemin} element={template.composant} />
          ))}
          {maquettes.map((maquette) => (
            <Route key={maquette.chemin} path={maquette.chemin} element={maquette.composant} />
          ))}
        </Routes>
      </ProtectionMotDePasse>
    </BrowserRouter>
  );
}

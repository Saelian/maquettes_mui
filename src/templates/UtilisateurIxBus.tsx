import { useState, ReactNode } from 'react';
import { Box } from '@mui/material';
import MenuLateral from '../composants/navigation/MenuLateral';
import BarreApplication from '../composants/navigation/BarreApplication';
import BoutonSommaire from '../composants/navigation/BoutonSommaire';
import { modulesUtilisateurIxBus } from '../types/modulesUtilisateurIxBus';

interface UtilisateurIxBusProps {
  children: ReactNode;
}

/**
 * Template UtilisateurIxBus
 *
 * Template pour les maquettes avec le menu Utilisateur iXBus.
 *
 * Fournit une structure de base avec :
 * - AppBar en haut
 * - Menu latéral Utilisateur (Drawer) rétractable à gauche
 * - Zone de contenu personnalisable
 *
 * Les maquettes basées sur ce template héritent automatiquement des modifications
 * apportées aux composants MenuLateral, BarreApplication et BoutonSommaire.
 *
 * Note : Pour les maquettes avec le menu Administrateur, un template AdministrateurIxBus sera créé.
 */
export default function UtilisateurIxBus({ children }: UtilisateurIxBusProps) {
  const [drawerOuvert, setDrawerOuvert] = useState(true);
  const [moduleOuvert, setModuleOuvert] = useState<string | null>('iXFacture');

  const toggleDrawer = () => {
    setDrawerOuvert(!drawerOuvert);
  };

  const toggleModule = (nomModule: string) => {
    setModuleOuvert(moduleOuvert === nomModule ? null : nomModule);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5', position: 'relative' }}>
      <BoutonSommaire />

      <MenuLateral
        modules={modulesUtilisateurIxBus}
        drawerOuvert={drawerOuvert}
        moduleOuvert={moduleOuvert}
        onToggleModule={toggleModule}
      />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: 2, mr: 2 }}>
        <BarreApplication onToggleDrawer={toggleDrawer} />

        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'white',
            boxShadow: 1,
            mt: 2,
            mb: 2,
            p: 3,
            overflow: 'auto'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

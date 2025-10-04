import { useState, ReactNode } from 'react';
import { Box } from '@mui/material';
import MenuLateral from '../composants/navigation/MenuLateral';
import BarreApplication from '../composants/navigation/BarreApplication';
import BoutonSommaire from '../composants/navigation/BoutonSommaire';
import { modulesAdministrateurIxBus } from '../types/modulesAdministrateurIxBus';

interface AdminIxBusProps {
  children: ReactNode;
  titre?: string;
  sousTitre?: string;
}

/**
 * Template AdminIxBus
 *
 * Template pour les maquettes avec le menu Administrateur iXBus.
 *
 * Fournit une structure de base avec :
 * - AppBar en haut
 * - Menu latéral Administrateur (Drawer) rétractable à gauche
 * - Zone de contenu personnalisable
 *
 * Les maquettes basées sur ce template héritent automatiquement des modifications
 * apportées aux composants MenuLateral, BarreApplication et BoutonSommaire.
 */
export default function AdminIxBus({ children, titre, sousTitre }: AdminIxBusProps) {
  const [drawerOuvert, setDrawerOuvert] = useState(true);
  const [moduleOuvert, setModuleOuvert] = useState<string | null>('Général');

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
        modules={modulesAdministrateurIxBus}
        drawerOuvert={drawerOuvert}
        moduleOuvert={moduleOuvert}
        onToggleModule={toggleModule}
      />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: 2, mr: 2 }}>
        <BarreApplication onToggleDrawer={toggleDrawer} titre={titre} sousTitre={sousTitre} />

        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

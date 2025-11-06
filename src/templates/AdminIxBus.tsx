import { useState, ReactNode } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../composants/navigation/MenuLateral';
import BarreApplication from '../composants/navigation/BarreApplication';
import ModalAide from '../composants/ModalAide';
import { modulesAdministrateurIxBus } from '../types/modulesAdministrateurIxBus';

interface AdminIxBusProps {
  children: ReactNode;
  titre?: string;
  sousTitre?: string;
  moduleParDefaut?: string;
  sousSectionSelectionnee?: string;
  pageCourante?: string;
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
 * apportées aux composants MenuLateral, BarreApplication.
 */
export default function AdminIxBus({ children, titre, sousTitre, moduleParDefaut = 'Général', sousSectionSelectionnee, pageCourante }: AdminIxBusProps) {
  const [drawerOuvert, setDrawerOuvert] = useState(false);
  const [moduleOuvert, setModuleOuvert] = useState<string | null>(moduleParDefaut);
  const [aideOuverte, setAideOuverte] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOuvert(!drawerOuvert);
  };

  const toggleModule = (nomModule: string) => {
    setModuleOuvert(moduleOuvert === nomModule ? null : nomModule);
  };

  const handleNaviguerVersUtilisateur = () => {
    navigate('/tableau-de-bord-ixfacture');
  };

  const handleOuvrirAide = () => {
    setAideOuverte(true);
  };

  const handleFermerAide = () => {
    setAideOuverte(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5', position: 'relative' }}>

      <MenuLateral
        modules={modulesAdministrateurIxBus}
        drawerOuvert={drawerOuvert}
        moduleOuvert={moduleOuvert}
        onToggleModule={toggleModule}
        sousSectionSelectionnee={sousSectionSelectionnee}
      />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: 2, mr: 2 }}>
        <BarreApplication
          onToggleDrawer={toggleDrawer}
          titre={titre}
          sousTitre={sousTitre}
          typeTemplate="admin"
          onNaviguerVersUtilisateur={handleNaviguerVersUtilisateur}
          onOuvrirAide={handleOuvrirAide}
        />

        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto'
          }}
        >
          {children}
        </Box>
      </Box>

      <ModalAide
        ouvert={aideOuverte}
        onFermer={handleFermerAide}
        pageCourante={pageCourante}
      />
    </Box>
  );
}

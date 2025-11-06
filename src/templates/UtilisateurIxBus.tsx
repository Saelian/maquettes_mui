import { useState, ReactNode } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../composants/navigation/MenuLateral';
import BarreApplication from '../composants/navigation/BarreApplication';
import ModalAide from '../composants/ModalAide';
import { modulesUtilisateurIxBus } from '../types/modulesUtilisateurIxBus';

interface UtilisateurIxBusProps {
  children: ReactNode;
  titre?: string;
  sousTitre?: string;
  pageCourante?: string;
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
 * apportées aux composants MenuLateral, BarreApplication.
 *
 * Note : Pour les maquettes avec le menu Administrateur, un template AdministrateurIxBus sera créé.
 */
export default function UtilisateurIxBus({ children, titre, sousTitre, pageCourante }: UtilisateurIxBusProps) {
  const [drawerOuvert, setDrawerOuvert] = useState(false);
  const [moduleOuvert, setModuleOuvert] = useState<string | null>('iXFacture');
  const [aideOuverte, setAideOuverte] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOuvert(!drawerOuvert);
  };

  const toggleModule = (nomModule: string) => {
    setModuleOuvert(moduleOuvert === nomModule ? null : nomModule);
  };

  const handleNaviguerVersAdmin = () => {
    navigate('/natures-ixfacture');
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
        modules={modulesUtilisateurIxBus}
        drawerOuvert={drawerOuvert}
        moduleOuvert={moduleOuvert}
        onToggleModule={toggleModule}
      />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: 2, mr: 2 }}>
        <BarreApplication
          onToggleDrawer={toggleDrawer}
          titre={titre}
          sousTitre={sousTitre}
          typeTemplate="utilisateur"
          onNaviguerVersAdmin={handleNaviguerVersAdmin}
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

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Button,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Visibility,
  Home,
  AdminPanelSettings,
  Help,
  ExitToApp,
} from '@mui/icons-material';

export interface BarreApplicationProps {
  onToggleDrawer: () => void;
  titre?: string;
  sousTitre?: string;
  typeTemplate: 'utilisateur' | 'admin';
  onNaviguerVersAdmin?: () => void;
  onNaviguerVersUtilisateur?: () => void;
  onOuvrirAide?: () => void;
}

/**
 * Barre d'application en haut de page
 * Contient le bouton de menu, les liens d'accessibilité et les infos utilisateur
 */
export default function BarreApplication({
  onToggleDrawer,
  titre,
  sousTitre,
  typeTemplate,
  onNaviguerVersAdmin,
  onNaviguerVersUtilisateur,
  onOuvrirAide,
}: BarreApplicationProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOuvert = Boolean(anchorEl);

  const handleOuvrirMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFermerMenu = () => {
    setAnchorEl(null);
  };

  const handleNaviguerVersAdmin = () => {
    handleFermerMenu();
    onNaviguerVersAdmin?.();
  };

  const handleNaviguerVersUtilisateur = () => {
    handleFermerMenu();
    onNaviguerVersUtilisateur?.();
  };

  const handleOuvrirAide = () => {
    handleFermerMenu();
    onOuvrirAide?.();
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1, mt: 2 }}>
      <Toolbar>
        <IconButton edge="start" sx={{ mr: 2 }} onClick={onToggleDrawer}>
          <MenuIcon />
        </IconButton>

        {titre && (
          <Box sx={{ mr: 'auto' }}>
            <Typography variant="h6" component="div">
              {titre}
            </Typography>
            {sousTitre && (
              <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>
                {sousTitre}
              </Typography>
            )}
          </Box>
        )}

        {!titre && (
          <IconButton sx={{ mr: 'auto' }}>
            {/* Espace pour icône de navigation */}
          </IconButton>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<Visibility />}
            sx={{
              color: 'black',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <Typography variant="body2">Accessibilité</Typography>
          </Button>
          <Button
            startIcon={<Home />}
            sx={{
              color: 'black',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <Typography variant="body2">Col sur Bus</Typography>
          </Button>
          <Box
            onClick={handleOuvrirMenu}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 1,
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <Typography variant="body2">Maryse TIPTOP</Typography>
            <Avatar sx={{ bgcolor: '#FF9500', width: 32, height: 32 }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={menuOuvert}
            onClose={handleFermerMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {typeTemplate === 'utilisateur' ? (
              <MenuItem onClick={handleNaviguerVersAdmin}>
                <AdminPanelSettings sx={{ mr: 1, color: 'grey.700' }} />
                Administration
              </MenuItem>
            ) : (
              <MenuItem onClick={handleNaviguerVersUtilisateur}>
                <ExitToApp sx={{ mr: 1, color: 'grey.700' }} />
                Retour à l'application
              </MenuItem>
            )}
            <MenuItem onClick={handleOuvrirAide}>
              <Help sx={{ mr: 1, color: 'grey.700' }} />
              Aide
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

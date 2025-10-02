import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Button,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Visibility,
  Home,
  HelpOutline,
} from '@mui/icons-material';

interface BarreApplicationProps {
  onToggleDrawer: () => void;
}

/**
 * Barre d'application en haut de page
 * Contient le bouton de menu, les liens d'accessibilité et les infos utilisateur
 */
export default function BarreApplication({ onToggleDrawer }: BarreApplicationProps) {
  return (
    <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1, mt: 2 }}>
      <Toolbar>
        <IconButton edge="start" sx={{ mr: 2 }} onClick={onToggleDrawer}>
          <MenuIcon />
        </IconButton>
        <IconButton sx={{ mr: 'auto' }}>
          {/* Espace pour icône de navigation */}
        </IconButton>

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
          <Button
            startIcon={<HelpOutline />}
            sx={{
              color: 'black',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <Typography variant="body2">DGAR - Equipe Direction</Typography>
          </Button>
          <Typography variant="body2">Maryse TIPTOP</Typography>
          <Avatar sx={{ bgcolor: '#FF9500', width: 32, height: 32 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  ListItemButton,
  Box,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Module } from '../../types/navigation';
import LogoIxBus from './LogoIxBus';

interface MenuLateralProps {
  modules: Module[];
  drawerOuvert: boolean;
  moduleOuvert: string | null;
  onToggleModule: (nomModule: string) => void;
  sousSectionSelectionnee?: string;
}

/**
 * Menu latéral rétractable avec liste de modules et sous-sections
 * Utilisé dans le template Utilisateur_iXBus
 */
export default function MenuLateral({
  modules,
  drawerOuvert,
  moduleOuvert,
  onToggleModule,
  sousSectionSelectionnee,
}: MenuLateralProps) {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerOuvert ? 240 : 90,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerOuvert ? 240 : 90,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          bgcolor: '#ffffff',
          overflowX: 'hidden',
        },
      }}
    >
      <LogoIxBus />
      <Divider />
      <List sx={{ pt: 0 }}>
        {modules.map((module) => (
          <Box key={module.nom}>
            <ListItemButton
              onClick={() => onToggleModule(module.nom)}
              sx={{
                px: drawerOuvert ? 2 : 1,
                py: drawerOuvert ? 0.5 : 1,
                flexDirection: drawerOuvert ? 'row' : 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: drawerOuvert ? 0 : 0.5,
                position: 'relative',
                bgcolor: moduleOuvert === module.nom ? 'action.hover' : 'transparent',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '& .MuiTypography-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: drawerOuvert ? 40 : 'auto',
                  color: module.couleur,
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                {module.icone}
              </ListItemIcon>
              {drawerOuvert ? (
                <>
                  <ListItemText
                    primary={module.nom}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                    }}
                  />
                  {module.sousSections &&
                    (moduleOuvert === module.nom ? <ExpandLess /> : <ExpandMore />)}
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      fontSize: '0.5rem',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      color: 'text.primary',
                    }}
                  >
                    {module.nom}
                  </Typography>
                  {module.sousSections && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 4,
                        transform: 'translateY(-50%)',
                        fontSize: '0.75rem',
                        display: 'flex',
                        color: 'text.secondary',
                      }}
                    >
                      {moduleOuvert === module.nom ? (
                        <ExpandLess sx={{ fontSize: '0.9rem' }} />
                      ) : (
                        <ExpandMore sx={{ fontSize: '0.9rem' }} />
                      )}
                    </Box>
                  )}
                </>
              )}
            </ListItemButton>
            {module.sousSections && (
              <Collapse in={moduleOuvert === module.nom} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {module.sousSections.map((sousSection, index) => {
                    const estActif = sousSectionSelectionnee
                      ? sousSection.texte === sousSectionSelectionnee
                      : sousSection.lien && location.pathname === sousSection.lien;
                    return (
                      <ListItemButton
                        key={index}
                        component={sousSection.lien ? RouterLink : 'div'}
                        to={sousSection.lien || undefined}
                        sx={{
                          pl: drawerOuvert ? 4 : 1,
                          pr: drawerOuvert ? 2 : 1,
                          py: drawerOuvert ? 0.5 : 0.75,
                          flexDirection: drawerOuvert ? 'row' : 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: drawerOuvert ? 0 : 0.3,
                          textDecoration: 'none',
                          color: estActif ? 'white' : 'inherit',
                          bgcolor: estActif ? 'primary.main' : 'transparent',
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            '& .MuiListItemIcon-root': {
                              color: 'white',
                            },
                            '& .MuiTypography-root': {
                              color: 'white',
                            },
                          },
                        }}
                      >
                      <ListItemIcon
                        sx={{
                          minWidth: drawerOuvert ? 40 : 'auto',
                          color: estActif ? 'white' : 'text.secondary',
                          justifyContent: 'center',
                          display: 'flex',
                          fontSize: drawerOuvert ? 'inherit' : '1rem',
                        }}
                      >
                        {sousSection.icone}
                      </ListItemIcon>
                      {drawerOuvert ? (
                        <ListItemText
                          primary={sousSection.texte}
                          primaryTypographyProps={{
                            fontSize: '0.8rem',
                            color: estActif ? 'white' : 'inherit',
                          }}
                        />
                      ) : (
                        <Typography
                          sx={{
                            fontSize: '0.6rem',
                            textAlign: 'center',
                            lineHeight: 1.1,
                            color: estActif ? 'white' : 'text.secondary',
                          }}
                        >
                          {sousSection.texte}
                        </Typography>
                      )}
                    </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Drawer>
  );
}

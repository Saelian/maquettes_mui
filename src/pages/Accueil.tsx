import { Box, Container, Typography, Paper, Alert, Button } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

/**
 * Page d'accueil avec disclaimer sur l'état des maquettes
 */
export default function Accueil() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          {/* Icône */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                bgcolor: '#008577',
                color: 'white',
                borderRadius: '50%',
                width: 100,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ConstructionIcon sx={{ fontSize: 60 }} />
            </Box>
          </Box>

          {/* Titre */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#008577',
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Maquettes en travaux
          </Typography>

          {/* Alerte principale */}
          <Alert
            severity="warning"
            sx={{
              mb: 4,
              textAlign: 'left',
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Avertissement
            </Typography>
            <Typography variant="body2">
              Ce projet présente des maquettes d'interfaces utilisateur qui sont
              actuellement en cours de développement.<br/><br/>
              Les maquettes présentées ne sont <strong>pas définitives</strong> et
              sont susceptibles d'évoluer à tout moment.<br/><br/>
              Certaines fonctionnalités peuvent être <strong>incomplètes</strong> ou
                  en cours d'implémentation.<br/><br/>
                  Les designs et interactions sont des <strong>prototypes</strong> et
                  peuvent différer du produit final.
            </Typography>
          </Alert>

          
          {/* Message final */}
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
            }}
          >
            <Button variant="contained" href="/tableau-de-bord-ixfacture"   >
              Accéder aux maquettes
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

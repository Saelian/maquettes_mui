import { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

interface ProtectionMotDePasseProps {
  children: ReactNode;
}

const CLE_LOCALSTORAGE = 'maquettes_authentifie';

/**
 * Composant de protection par mot de passe pour l'application.
 * Vérifie le mot de passe dans localStorage ou demande à l'utilisateur de le saisir.
 */
export default function ProtectionMotDePasse({ children }: ProtectionMotDePasseProps) {
  const [estAuthentifie, setEstAuthentifie] = useState(false);
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(true);

  // Vérifier au chargement si l'utilisateur est déjà authentifié
  useEffect(() => {
    const authentificationSauvegardee = localStorage.getItem(CLE_LOCALSTORAGE);
    if (authentificationSauvegardee === 'true') {
      setEstAuthentifie(true);
    }
    setChargement(false);
  }, []);

  const validerMotDePasse = (e: React.FormEvent) => {
    e.preventDefault();
    setErreur('');

    const motDePasseAttendu = import.meta.env.VITE_APP_PASSWORD;

    if (!motDePasseAttendu) {
      setErreur('Erreur de configuration : mot de passe non défini');
      return;
    }

    if (motDePasse === motDePasseAttendu) {
      localStorage.setItem(CLE_LOCALSTORAGE, 'true');
      setEstAuthentifie(true);
    } else {
      setErreur('Mot de passe incorrect');
      setMotDePasse('');
    }
  };

  // Affichage pendant le chargement
  if (chargement) {
    return null;
  }

  // Si authentifié, afficher le contenu protégé
  if (estAuthentifie) {
    return <>{children}</>;
  }

  // Sinon, afficher le formulaire de saisie du mot de passe
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #008577 0%, #008577 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
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
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockIcon sx={{ fontSize: 48 }} />
            </Box>
          </Box>

          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Accès protégé
          </Typography>

          <form onSubmit={validerMotDePasse}>
            <TextField
              fullWidth
              type="password"
              label="Mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
              autoFocus
              error={!!erreur}
            />

            {erreur && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {erreur}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                bgcolor: '#008577',
                '&:hover': {
                  bgcolor: '#006e63ff',
                },
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Se connecter
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

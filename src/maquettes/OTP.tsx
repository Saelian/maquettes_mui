import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

/**
 * Maquette OTP
 *
 * Démontre un système de validation par code OTP envoyé par email.
 *
 * Fonctionnalités :
 * - Bouton pour ouvrir la modale de saisie OTP
 * - Modale avec champ de saisie du code à 6 chiffres
 * - Timer de 5 minutes pour la validité du code
 * - Bouton pour renvoyer un nouveau code
 * - Actions : Valider, Annuler
 */
export default function OTP() {
  const [modalOuverte, setModalOuverte] = useState(false);
  const [codeOTP, setCodeOTP] = useState('');
  const [tempsRestant, setTempsRestant] = useState(300); // 5 minutes en secondes
  const [codeEnvoye, setCodeEnvoye] = useState(false);

  // Timer pour le compte à rebours
  useEffect(() => {
    if (modalOuverte && codeEnvoye && tempsRestant > 0) {
      const timer = setInterval(() => {
        setTempsRestant(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [modalOuverte, codeEnvoye, tempsRestant]);

  const ouvrirModale = () => {
    setModalOuverte(true);
    setCodeEnvoye(true);
    setTempsRestant(300);
    setCodeOTP('');
  };

  const fermerModale = () => {
    setModalOuverte(false);
    setCodeOTP('');
  };

  const renvoyerCode = () => {
    setTempsRestant(300);
    setCodeOTP('');
    setCodeEnvoye(true);
    // Ici, on enverrait une nouvelle requête pour générer un nouveau code
  };

  const validerOTP = () => {
    // Ici, on validerait le code OTP avec le backend
    console.log('Code OTP saisi :', codeOTP);
    fermerModale();
  };

  const formatTemps = (secondes: number) => {
    const minutes = Math.floor(secondes / 60);
    const secs = secondes % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChangeCodeOTP = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Accepter uniquement les chiffres
    if (value.length <= 6) {
      setCodeOTP(value);
    }
  };

  return (
    <UtilisateurIxBus titre="Validation OTP" sousTitre="Authentification par code à usage unique">
      <Box sx={{ mt: 2, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Authentification par code OTP
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Pour sécuriser votre connexion, nous utilisons un système de validation par code OTP (One-Time Password).
          Cliquez sur le bouton ci-dessous pour recevoir un code par email.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={ouvrirModale}
          startIcon={<MailOutlineIcon />}
        >
          Demander un code OTP
        </Button>

        {/* Modale de saisie OTP */}
        <Dialog
          open={modalOuverte}
          onClose={fermerModale}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Validation par code OTP
          </DialogTitle>

          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 2 }}>
              {/* Icône centrale */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MailOutlineIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>

              {/* Message d'information */}
              <Alert severity="info" sx={{ width: '100%' }}>
                <Typography variant="body2">
                  Un code de vérification à 6 chiffres a été envoyé par <strong>email</strong>.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Ce code est valable pendant <strong>5 minutes</strong>.
                </Typography>
              </Alert>

              {/* Timer */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Temps restant
                </Typography>
                <Typography
                  variant="h4"
                  color={tempsRestant < 60 ? 'error' : 'primary'}
                  sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                >
                  {formatTemps(tempsRestant)}
                </Typography>
              </Box>

              {/* Champ de saisie OTP */}
              <TextField
                fullWidth
                label="Code OTP"
                value={codeOTP}
                onChange={handleChangeCodeOTP}
                placeholder="000000"
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    letterSpacing: '0.5rem',
                    fontFamily: 'monospace'
                  }
                }}
                helperText="Saisissez le code à 6 chiffres reçu par email"
                disabled={tempsRestant === 0}
              />

              {/* Bouton renvoyer le code */}
              <Button
                variant="text"
                onClick={renvoyerCode}
                disabled={tempsRestant > 270} // Désactivé pendant les 30 premières secondes
              >
                Renvoyer un nouveau code
              </Button>

              {tempsRestant === 0 && (
                <Alert severity="error" sx={{ width: '100%' }}>
                  Le code a expiré. Veuillez demander un nouveau code.
                </Alert>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={fermerModale} color="inherit">
              Annuler
            </Button>
            <Button
              onClick={validerOTP}
              variant="contained"
              disabled={codeOTP.length !== 6 || tempsRestant === 0}
            >
              Valider
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </UtilisateurIxBus>
  );
}

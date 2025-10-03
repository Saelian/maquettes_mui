import { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

/**
 * Maquette PremierTest
 *
 * Affiche un bouton de test qui ouvre une modale.
 * Utilise le template UtilisateurIxBus pour la structure de base.
 */
export default function PremierTest() {
  const [ouvert, setOuvert] = useState(false);

  const ouvrirModale = () => setOuvert(true);
  const fermerModale = () => setOuvert(false);

  return (
    <UtilisateurIxBus>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Button variant="contained" onClick={ouvrirModale}>
          Test
        </Button>
      </Box>

      <Dialog open={ouvert} onClose={fermerModale}>
        <DialogTitle>Résultat</DialogTitle>
        <DialogContent>
          Test réussi !
        </DialogContent>
      </Dialog>
    </UtilisateurIxBus>
  );
}

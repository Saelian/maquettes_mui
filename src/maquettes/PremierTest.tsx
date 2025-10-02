import { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import BoutonSommaire from '../composants/navigation/BoutonSommaire';

/**
 * Maquette PremierTest
 * Affiche un bouton de test qui ouvre une modale
 */
export default function PremierTest() {
  const [ouvert, setOuvert] = useState(false);

  const ouvrirModale = () => setOuvert(true);
  const fermerModale = () => setOuvert(false);

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      <BoutonSommaire />

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
    </Box>
  );
}

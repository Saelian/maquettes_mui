import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Bouton pour retourner au sommaire principal
 * Positionné en bas à gauche de la page
 */
export default function BoutonSommaire() {
  const navigate = useNavigate();
  const retourSommaire = () => navigate('/');

  return (
    <Button
      variant="outlined"
      onClick={retourSommaire}
      sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1300 }}
    >
      Sommaire
    </Button>
  );
}

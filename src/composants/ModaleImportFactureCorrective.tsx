import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

interface ModaleImportFactureCorrectiveProps {
  ouvert: boolean;
  onFermer: () => void;
  onImporter: (fichier: File) => void;
  numeroFacture: string;
}

/**
 * Modale permettant d'importer une facture corrective
 * pour une facture suspendue
 */
const ModaleImportFactureCorrective = ({
  ouvert,
  onFermer,
  onImporter,
  numeroFacture,
}: ModaleImportFactureCorrectiveProps) => {
  const [fichierSelectionne, setFichierSelectionne] = useState<File | null>(null);
  const [enChargement, setEnChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const extensionsAutorisees = ['.xml', '.pdf'];

  const handleSelectionFichier = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fichiers = event.target.files;
    if (!fichiers || fichiers.length === 0) return;

    const fichier = fichiers[0];

    // Vérifier l'extension du fichier
    const extension = fichier.name.substring(fichier.name.lastIndexOf('.')).toLowerCase();
    if (!extensionsAutorisees.includes(extension)) {
      setErreur(`Format de fichier non autorisé. Formats acceptés : ${extensionsAutorisees.join(', ')}`);
      setFichierSelectionne(null);
      return;
    }

    // Vérifier la taille du fichier (max 10MB)
    if (fichier.size > 10 * 1024 * 1024) {
      setErreur('Le fichier est trop volumineux. Taille maximale : 10 MB');
      setFichierSelectionne(null);
      return;
    }

    setFichierSelectionne(fichier);
    setErreur(null);
  };

  const handleImporter = async () => {
    if (!fichierSelectionne) return;

    setEnChargement(true);
    setErreur(null);

    try {
      // Simulation d'un délai d'upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onImporter(fichierSelectionne);
      handleFermer();
    } catch {
      setErreur('Une erreur est survenue lors de l\'import du fichier.');
    } finally {
      setEnChargement(false);
    }
  };

  const handleFermer = () => {
    setFichierSelectionne(null);
    setErreur(null);
    setEnChargement(false);
    onFermer();
  };

  return (
    <Dialog
      open={ouvert}
      onClose={handleFermer}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Importer une facture corrective
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Alert severity="info">
            La facture <strong>{numeroFacture}</strong> a été suspendue par le destinataire.
            Veuillez importer une facture corrective pour passer au statut "Complétée".
          </Alert>

          {/* Liste des formats autorisés */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Formats autorisés :
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="UBL (Universal Business Language)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="CII (Cross Industry Invoice)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DescriptionIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Factur-X"
                />
              </ListItem>
            </List>
          </Box>

          {/* Zone d'upload */}
          <Box
            sx={{
              border: 2,
              borderStyle: 'dashed',
              borderColor: fichierSelectionne ? 'success.main' : 'grey.400',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: fichierSelectionne ? 'success.50' : 'grey.50',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
            onClick={() => document.getElementById('fichier-input')?.click()}
          >
            <input
              id="fichier-input"
              type="file"
              accept=".xml,.pdf"
              onChange={handleSelectionFichier}
              style={{ display: 'none' }}
            />
            {fichierSelectionne ? (
              <Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Fichier sélectionné
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {fichierSelectionne.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(fichierSelectionne.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Cliquez pour sélectionner un fichier
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ou glissez-déposez un fichier ici
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Taille maximale : 10 MB
                </Typography>
              </Box>
            )}
          </Box>

          {/* Barre de progression */}
          {enChargement && (
            <Box>
              <LinearProgress />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Import en cours...
              </Typography>
            </Box>
          )}

          {/* Message d'erreur */}
          {erreur && (
            <Alert severity="error">
              {erreur}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFermer} disabled={enChargement}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleImporter}
          disabled={!fichierSelectionne || enChargement}
          startIcon={<CloudUploadIcon />}
        >
          Importer et passer en "Complétée"
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModaleImportFactureCorrective;

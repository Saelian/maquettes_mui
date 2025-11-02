/**
 * Composant pour afficher un champ de formulaire avec son code EN16931 (BT-X)
 */
import {
  TextField,
  TextFieldProps,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

interface ChampFactureAvecCodeProps {
  /** Code BT de la norme EN16931 (ex: "BT-1") */
  codeBT: string;
  /** Label du champ */
  label: string;
  /** Description ou aide du champ */
  description?: string;
  /** Indique si le champ est obligatoire */
  obligatoire?: boolean;
  /** Props MUI TextField */
  textFieldProps?: Omit<TextFieldProps, 'label'>;
}

/**
 * Champ de formulaire avec affichage du code BT EN16931
 */
export const ChampFactureAvecCode = ({
  codeBT,
  label,
  description,
  obligatoire = false,
  textFieldProps = {},
}: ChampFactureAvecCodeProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {/* En-tête avec code BT et label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        
      {/* Champ de saisie */}
      <TextField
        label={label}
        variant="standard"
        required={obligatoire}
        fullWidth
        {...textFieldProps}
        />
        {description && (
          <Tooltip title={codeBT + " - " + description}>
            <IconButton>
              <InfoIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

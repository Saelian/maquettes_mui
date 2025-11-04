/**
 * Composant tableau affichant les flux e-reporting avec les colonnes communes
 */

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { FluxEReporting } from '../../types/ereporting';
import { LIBELLE_TYPE_TRANSMISSION } from '../../types/ereporting';

interface TableauFluxEReportingProps {
  flux: FluxEReporting[];
  onVoirDetail: (flux: FluxEReporting) => void;
}

/**
 * Formate un horodatage AAAAMMJJHHMMSS en date lisible
 */
function formaterHorodatage(horodatage: string): string {
  if (horodatage.length !== 14) return horodatage;

  const annee = horodatage.substring(0, 4);
  const mois = horodatage.substring(4, 6);
  const jour = horodatage.substring(6, 8);
  const heures = horodatage.substring(8, 10);
  const minutes = horodatage.substring(10, 12);
  const secondes = horodatage.substring(12, 14);

  return `${jour}/${mois}/${annee} ${heures}:${minutes}:${secondes}`;
}

/**
 * Retourne la couleur du chip en fonction du type de flux
 */
function getCouleurChipFlux(typeFlux: string): 'primary' | 'secondary' | 'success' | 'warning' {
  switch (typeFlux) {
    case '10.1':
      return 'primary';
    case '10.2':
      return 'success';
    case '10.3':
      return 'secondary';
    case '10.4':
      return 'warning';
    default:
      return 'primary';
  }
}

/**
 * Retourne la couleur du chip en fonction du type de transmission
 */
function getCouleurChipTransmission(
  typeTransmission: string
): 'default' | 'primary' | 'secondary' | 'error' {
  switch (typeTransmission) {
    case 'IN':
      return 'primary';
    case 'CO':
      return 'default';
    case 'MO':
      return 'secondary';
    case 'RE':
      return 'error';
    default:
      return 'default';
  }
}

export default function TableauFluxEReporting({
  flux,
  onVoirDetail,
}: TableauFluxEReportingProps) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 0, maxHeight: 'calc(100vh - 200px)' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Type de flux</TableCell>
            <TableCell>Identifiant transmission</TableCell>
            <TableCell>Date/Heure</TableCell>
            <TableCell>Type transmission</TableCell>
            <TableCell>Émetteur</TableCell>
            <TableCell>SIREN Émetteur</TableCell>
            <TableCell>Déclarant</TableCell>
            <TableCell>SIREN Déclarant</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flux.map((fluxItem, index) => (
            <TableRow
              key={`${fluxItem.donneesRacine.idTransmission}-${index}`}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onVoirDetail(fluxItem)}
            >
              <TableCell>
                <Chip
                  label={`Flux ${fluxItem.typeFlux}`}
                  color={getCouleurChipFlux(fluxItem.typeFlux)}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {fluxItem.donneesRacine.idTransmission}
              </TableCell>
              <TableCell>
                {formaterHorodatage(fluxItem.donneesRacine.horodatage.dateHeureChaine)}
              </TableCell>
              <TableCell>
                <Chip
                  label={LIBELLE_TYPE_TRANSMISSION[fluxItem.donneesRacine.codeTypeTransmission]}
                  color={getCouleurChipTransmission(
                    fluxItem.donneesRacine.codeTypeTransmission
                  )}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{fluxItem.donneesRacine.emetteur.raisonSociale}</TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>
                {fluxItem.donneesRacine.emetteur.id}
              </TableCell>
              <TableCell>{fluxItem.donneesRacine.declarant.raisonSociale}</TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>
                {fluxItem.donneesRacine.declarant.id}
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Voir le détail">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVoirDetail(fluxItem);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

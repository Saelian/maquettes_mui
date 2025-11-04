/**
 * Composant tableau affichant les flux e-reporting avec les colonnes communes
 */

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TableSortLabel,
} from '@mui/material';
import type { FluxEReporting } from '../../types/ereporting';
import { LIBELLE_TYPE_TRANSMISSION, LIBELLE_FLUX_COURT } from '../../types/ereporting';

interface TableauFluxEReportingProps {
  flux: FluxEReporting[];
  onVoirDetail: (flux: FluxEReporting) => void;
}

/**
 * Type de colonne triable
 */
type ColonneTriable =
  | 'idTransmission'
  | 'dateHeure'
  | 'typeTransmission'
  | 'emetteur'
  | 'sirenEmetteur'
  | 'typeFlux';

/**
 * Ordre de tri
 */
type OrdreTri = 'asc' | 'desc';

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

/**
 * Fonction de comparaison pour le tri
 */
function comparerValeurs(a: FluxEReporting, b: FluxEReporting, colonne: ColonneTriable): number {
  switch (colonne) {
    case 'idTransmission':
      return a.donneesRacine.idTransmission.localeCompare(b.donneesRacine.idTransmission);
    case 'dateHeure':
      return a.donneesRacine.horodatage.dateHeureChaine.localeCompare(
        b.donneesRacine.horodatage.dateHeureChaine
      );
    case 'typeTransmission':
      return a.donneesRacine.codeTypeTransmission.localeCompare(
        b.donneesRacine.codeTypeTransmission
      );
    case 'emetteur':
      return a.donneesRacine.emetteur.raisonSociale.localeCompare(
        b.donneesRacine.emetteur.raisonSociale
      );
    case 'sirenEmetteur':
      return a.donneesRacine.emetteur.id.localeCompare(b.donneesRacine.emetteur.id);
    case 'typeFlux':
      return a.typeFlux.localeCompare(b.typeFlux);
    default:
      return 0;
  }
}

export default function TableauFluxEReporting({
  flux,
  onVoirDetail,
}: TableauFluxEReportingProps) {
  // État du tri
  const [ordreTri, setOrdreTri] = useState<OrdreTri>('desc');
  const [colonneTriee, setColonneTriee] = useState<ColonneTriable>('dateHeure');

  // Gestionnaire de clic sur une en-tête
  const handleDemanderTri = (colonne: ColonneTriable) => {
    const estAsc = colonneTriee === colonne && ordreTri === 'asc';
    setOrdreTri(estAsc ? 'desc' : 'asc');
    setColonneTriee(colonne);
  };

  // Tri des flux
  const fluxTries = useMemo(() => {
    const fluxCopie = [...flux];
    fluxCopie.sort((a, b) => {
      const comparaison = comparerValeurs(a, b, colonneTriee);
      return ordreTri === 'asc' ? comparaison : -comparaison;
    });
    return fluxCopie;
  }, [flux, colonneTriee, ordreTri]);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 0, maxHeight: 'calc(100vh - 200px)' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={colonneTriee === 'idTransmission' ? ordreTri : false}>
              <TableSortLabel
                active={colonneTriee === 'idTransmission'}
                direction={colonneTriee === 'idTransmission' ? ordreTri : 'asc'}
                onClick={() => handleDemanderTri('idTransmission')}
              >
                Identifiant transmission
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={colonneTriee === 'dateHeure' ? ordreTri : false}>
              <TableSortLabel
                active={colonneTriee === 'dateHeure'}
                direction={colonneTriee === 'dateHeure' ? ordreTri : 'asc'}
                onClick={() => handleDemanderTri('dateHeure')}
              >
                Date/Heure
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={colonneTriee === 'typeTransmission' ? ordreTri : false}>
              <TableSortLabel
                active={colonneTriee === 'typeTransmission'}
                direction={colonneTriee === 'typeTransmission' ? ordreTri : 'asc'}
                onClick={() => handleDemanderTri('typeTransmission')}
              >
                Type transmission
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={colonneTriee === 'emetteur' ? ordreTri : false}>
              <TableSortLabel
                active={colonneTriee === 'emetteur'}
                direction={colonneTriee === 'emetteur' ? ordreTri : 'asc'}
                onClick={() => handleDemanderTri('emetteur')}
              >
                Émetteur
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={colonneTriee === 'sirenEmetteur' ? ordreTri : false}>
              <TableSortLabel
                active={colonneTriee === 'sirenEmetteur'}
                direction={colonneTriee === 'sirenEmetteur' ? ordreTri : 'asc'}
                onClick={() => handleDemanderTri('sirenEmetteur')}
              >
                SIREN Émetteur
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={colonneTriee === 'typeFlux' ? ordreTri : false}>
              <TableSortLabel
                active={colonneTriee === 'typeFlux'}
                direction={colonneTriee === 'typeFlux' ? ordreTri : 'asc'}
                onClick={() => handleDemanderTri('typeFlux')}
              >
                Type de flux
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fluxTries.map((fluxItem, index) => (
            <TableRow
              key={`${fluxItem.donneesRacine.idTransmission}-${index}`}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onVoirDetail(fluxItem)}
            >
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
              <TableCell>
                {`${fluxItem.typeFlux} - ${LIBELLE_FLUX_COURT[fluxItem.typeFlux]}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

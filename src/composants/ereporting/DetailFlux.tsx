/**
 * Composant modal affichant le détail d'un flux e-reporting
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import type { FluxEReporting } from '../../types/ereporting';
import { LIBELLE_FLUX, LIBELLE_TYPE_TRANSMISSION } from '../../types/ereporting';

interface DetailFluxProps {
  flux: FluxEReporting | null;
  ouvert: boolean;
  onFermer: () => void;
}

/**
 * Formate une date AAAAMMJJ en format lisible
 */
function formaterDate(date: string): string {
  if (date.length !== 8) return date;

  const annee = date.substring(0, 4);
  const mois = date.substring(4, 6);
  const jour = date.substring(6, 8);

  return `${jour}/${mois}/${annee}`;
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

  return `${jour}/${mois}/${annee} à ${heures}:${minutes}:${secondes}`;
}

/**
 * Composant affichant une section d'informations
 */
function SectionInfo({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {titre}
      </Typography>
      {children}
    </Box>
  );
}

/**
 * Composant affichant un champ d'information
 */
function ChampInfo({ label, valeur }: { label: string; valeur: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2, flex: { xs: '1 1 100%', md: '1 1 45%' } }}>
      <Typography  variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">
        {valeur}
      </Typography>
    </Box>
  );
}

export default function DetailFlux({ flux, ouvert, onFermer }: DetailFluxProps) {
  if (!flux) return null;

  const { typeFlux, donneesRacine, transmissionTransactions, transmissionPaiements } = flux;

  return (
    <Dialog open={ouvert} onClose={onFermer} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" component="span">
            Détail du flux e-reporting
          </Typography>
          <Chip label={`Flux ${typeFlux}`} color="primary" />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {/* Informations générales */}
        <SectionInfo titre="Informations générales">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <ChampInfo label="Type de flux" valeur={LIBELLE_FLUX[typeFlux]} />
            <ChampInfo label="Identifiant transmission" valeur={donneesRacine.idTransmission} />
            <ChampInfo
              label="Date et heure"
              valeur={formaterHorodatage(donneesRacine.horodatage.dateHeureChaine)}
            />
            <ChampInfo
              label="Type de transmission"
              valeur={LIBELLE_TYPE_TRANSMISSION[donneesRacine.codeTypeTransmission]}
            />
            {donneesRacine.nomDocument && (
              <ChampInfo label="Nom du document" valeur={donneesRacine.nomDocument} />
            )}
          </Box>
        </SectionInfo>

        {/* Références (si présentes) */}
        {donneesRacine.references && (
          <SectionInfo titre="Références">
            <Alert severity="info" sx={{ mb: 2 }}>
              Ce flux fait référence à une transmission précédente
            </Alert>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <ChampInfo
                label="ID transmission précédente"
                valeur={donneesRacine.references.idTransmissionPrecedente}
              />
              <ChampInfo
                label="Type transmission précédente"
                valeur={LIBELLE_TYPE_TRANSMISSION[donneesRacine.references.typeTransmissionPrecedente]}
              />
            </Box>
          </SectionInfo>
        )}

        {/* Émetteur */}
        <SectionInfo titre="Émetteur du document">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <ChampInfo label="Raison sociale" valeur={donneesRacine.emetteur.raisonSociale} />
            <ChampInfo label="SIREN" valeur={donneesRacine.emetteur.id} />
            <ChampInfo label="Code rôle" valeur={donneesRacine.emetteur.codeRole} />
            {donneesRacine.emetteur.adresseElectronique && (
              <ChampInfo
                label="Adresse électronique"
                valeur={donneesRacine.emetteur.adresseElectronique.uri}
              />
            )}
          </Box>
        </SectionInfo>

        {/* Déclarant */}
        <SectionInfo titre="Déclarant">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <ChampInfo label="Raison sociale" valeur={donneesRacine.declarant.raisonSociale} />
            <ChampInfo label="SIREN" valeur={donneesRacine.declarant.id} />
            <ChampInfo label="Code rôle" valeur={donneesRacine.declarant.codeRole} />
            {donneesRacine.declarant.adresseElectronique && (
              <ChampInfo
                label="Adresse électronique"
                valeur={donneesRacine.declarant.adresseElectronique.uri}
              />
            )}
          </Box>
        </SectionInfo>

        {/* Transmission de transactions (Flux 10.1 / 10.3) */}
        {transmissionTransactions && (
          <SectionInfo titre="Période de transmission">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <ChampInfo
                label="Date de début"
                valeur={formaterDate(transmissionTransactions.periode.dateDebut)}
              />
              <ChampInfo
                label="Date de fin"
                valeur={formaterDate(transmissionTransactions.periode.dateFin)}
              />
            </Box>

            {/* Factures B2B (Flux 10.1) */}
            {transmissionTransactions.factures && transmissionTransactions.factures.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Factures B2B ({transmissionTransactions.factures.length})
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Numéro facture</TableCell>
                        <TableCell>Date émission</TableCell>
                        <TableCell>Type facture</TableCell>
                        <TableCell>Devise</TableCell>
                        <TableCell align="right">Montant HT</TableCell>
                        <TableCell align="right">Montant TVA</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transmissionTransactions.factures.map((facture, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontFamily: 'monospace' }}>
                            {facture.numeroFacture}
                          </TableCell>
                          <TableCell>{formaterDate(facture.dateEmission)}</TableCell>
                          <TableCell>{facture.codeTypeFacture}</TableCell>
                          <TableCell>
                            <Chip label={facture.codeDevise} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell align="right">
                            {facture.montantsTotaux?.montantHT
                              ? `${facture.montantsTotaux.montantHT.toLocaleString('fr-FR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} €`
                              : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {facture.montantsTotaux
                              ? `${facture.montantsTotaux.montantTVA.toLocaleString('fr-FR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} €`
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Flux 10.3 (transactions B2C agrégées) */}
            {transmissionTransactions.transactionsB2C && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Transactions B2C agrégées
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <ChampInfo
                      label="Nombre de transactions"
                      valeur={transmissionTransactions.transactionsB2C.nombreTransactions.toLocaleString(
                        'fr-FR'
                      )}
                    />
                    <ChampInfo
                      label="Montant total HT"
                      valeur={`${transmissionTransactions.transactionsB2C.montantTotalHT.toLocaleString(
                        'fr-FR',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )} €`}
                    />
                    <ChampInfo
                      label="Montant total TVA"
                      valeur={`${transmissionTransactions.transactionsB2C.montantTotalTVA.toLocaleString(
                        'fr-FR',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )} €`}
                    />
                  </Box>
                </Paper>
              </Box>
            )}
          </SectionInfo>
        )}

        {/* Transmission de paiements (Flux 10.2 / 10.4) */}
        {transmissionPaiements && (
          <SectionInfo titre="Période de transmission">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <ChampInfo
                label="Date de début"
                valeur={formaterDate(transmissionPaiements.periode.dateDebut)}
              />
              <ChampInfo
                label="Date de fin"
                valeur={formaterDate(transmissionPaiements.periode.dateFin)}
              />
            </Box>

            {/* Paiements de factures (Flux 10.2) */}
            {transmissionPaiements.factures && transmissionPaiements.factures.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Paiements de factures ({transmissionPaiements.factures.length})
                </Typography>
                {transmissionPaiements.factures.map((facture, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      <ChampInfo label="Numéro facture" valeur={facture.numeroFacture} />
                      <ChampInfo
                        label="Date facture"
                        valeur={formaterDate(facture.dateFacture)}
                      />
                      <ChampInfo
                        label="Date paiement"
                        valeur={formaterDate(facture.paiement.datePaiement)}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Répartition par taux :
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Taux TVA</TableCell>
                            <TableCell>Devise</TableCell>
                            <TableCell align="right">Montant encaissé</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {facture.paiement.repartitions.map((repartition, rIndex) => (
                            <TableRow key={rIndex}>
                              <TableCell>{repartition.taux.toFixed(2)} %</TableCell>
                              <TableCell>
                                <Chip
                                  label={repartition.codeDevise || 'EUR'}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="right">
                                {repartition.montantEncaisse.toLocaleString('fr-FR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{' '}
                                €
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                ))}
              </Box>
            )}

            {/* Flux 10.4 (paiements transactions B2C) */}
            {transmissionPaiements.transactionsB2C && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Paiements de transactions B2C
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <ChampInfo
                    label="Date paiement"
                    valeur={formaterDate(transmissionPaiements.transactionsB2C.paiement.datePaiement)}
                  />
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    Répartition par taux :
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Taux TVA</TableCell>
                          <TableCell>Devise</TableCell>
                          <TableCell align="right">Montant encaissé</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transmissionPaiements.transactionsB2C.paiement.repartitions.map(
                          (repartition, rIndex) => (
                            <TableRow key={rIndex}>
                              <TableCell>{repartition.taux.toFixed(2)} %</TableCell>
                              <TableCell>
                                <Chip
                                  label={repartition.codeDevise || 'EUR'}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="right">
                                {repartition.montantEncaisse.toLocaleString('fr-FR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{' '}
                                €
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            )}
          </SectionInfo>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onFermer} variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

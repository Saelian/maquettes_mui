import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Toolbar,
  Tooltip,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,

} from '@mui/material';

import {
  Search as SearchIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

// Types pour les annuaires
type TypeAnnuaire = 'francais' | 'international';

// Interface pour les critères de recherche français
interface CriteresFrancais {
  nom: string;
  siren: string;
  siret: string;
  adresse: string;
  ville: string;
  codePostal: string;
}

// Interface pour les critères de recherche international
interface CriteresInternational {
  nom: string;
  siren: string;
  siret: string;
  codeAdresse: string;
  codeRoutage: string;
  pays: string;
}

// Interfaces pour l'annuaire français (format API réel)
interface ResultatAnnuaireFrancais {
  businessEntityId: string;
  name: string;
  type: 'LEGAL_UNIT' | 'OFFICE';
  scope?: 'PRIVATE_TAX_PAYER' | 'PRIMARY' | 'SECONDARY';
  siren: string;
  siret?: string;
  postalAddress?: {
    city: string;
    postalCode: string;
    addressLine1: string;
    addressLine2?: string;
  };
  legalUnit?: {
    businessEntityId: string;
    name: string;
    siren: string;
  };
  identifiers?: Array<{
    businessEntityIdentifierId: string;
    type: string;
    scheme: string;
    value: string;
    networkRegistered?: Array<{
      directoryId: string;
      networkId: string;
      networkIdentifier: string;
    }>;
  }>;
}

// Interfaces pour l'annuaire international (format API réel)
interface ResultatAnnuaireInternational {
  name: string;
  country: string;
  electronicAddress: string;
  entity?: {
    contacts?: Array<{
      name: string;
      phone?: string;
      email?: string;
    }>;
  };
  allowedDocuments?: Array<{
    documentId: string;
    documentScheme: string;
  }>;
}

/**
 * Maquette de consultation de l'annuaire iXFacture
 *
 * Cette maquette permet de rechercher des entreprises dans :
 * - L'annuaire français (via l'API /v1/directory/fr/search)
 * - L'annuaire international Peppol (via l'API /v1/directory/international)
 */
const ConsultationAnnuaireIXFacture = () => {
  // État pour le type d'annuaire sélectionné
  const [typeAnnuaire, setTypeAnnuaire] = useState<TypeAnnuaire>('francais');

  // États pour les critères de recherche français
  const [criteresFrancais, setCriteresFrancais] = useState<CriteresFrancais>({
    nom: '',
    siren: '',
    siret: '',
    adresse: '',
    ville: '',
    codePostal: '',
  });

  // États pour les critères de recherche international
  const [criteresInternational, setCriteresInternational] = useState<CriteresInternational>({
    nom: '',
    siren: '',
    siret: '',
    codeAdresse: '',
    codeRoutage: '',
    pays: '',
  });

  // États pour les résultats
  const [resultatsFrancais, setResultatsFrancais] = useState<ResultatAnnuaireFrancais[]>([]);
  const [resultatsInternational, setResultatsInternational] = useState<
    ResultatAnnuaireInternational[]
  >([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalResultats, setTotalResultats] = useState(0);
  const [rechercheEffectuee, setRechercheEffectuee] = useState(false);

  // États pour la modale de détails
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [elementSelectionne, setElementSelectionne] = useState<
    ResultatAnnuaireFrancais | ResultatAnnuaireInternational | null
  >(null);

  // Gestion du changement de type d'annuaire
  const handleChangeTypeAnnuaire = (
    _event: React.MouseEvent<HTMLElement>,
    nouveauType: TypeAnnuaire | null,
  ) => {
    if (nouveauType !== null) {
      setTypeAnnuaire(nouveauType);
      // Réinitialiser les résultats lors du changement d'annuaire
      setResultatsFrancais([]);
      setResultatsInternational([]);
      setRechercheEffectuee(false);
    }
  };

  // Vérifier si au moins un critère est renseigné
  const auMoinsUnCritere = () => {
    if (typeAnnuaire === 'francais') {
      return Object.values(criteresFrancais).some((val) => val.trim() !== '');
    } else {
      return Object.values(criteresInternational).some((val) => val.trim() !== '');
    }
  };

  // Gestion de la recherche
  const handleRechercher = () => {
    // Simulation d'une recherche (dans la vraie application, il faudrait appeler l'API)
    // Pour la maquette, on génère des résultats d'exemple conformes aux formats réels

    if (typeAnnuaire === 'francais') {
      // Génération de résultats pour l'annuaire français
      const resultatsExempleFR: ResultatAnnuaireFrancais[] = [];
      const nombreResultats = 15;

      for (let i = 1; i <= nombreResultats; i++) {
        const baseSiren = `12735010${i.toString().padStart(1, '0')}`;
        const isOffice = i % 3 !== 0;

        if (isOffice) {
          // Exemple d'établissement (Office)
          resultatsExempleFR.push({
            businessEntityId: `0193acea-5d3b-7665-ada5-${i.toString().padStart(12, '0')}`,
            name: i === 1 ? `Siège Social ${i}` : `Établissement ${i}`,
            type: 'OFFICE',
            scope: i === 1 ? 'PRIMARY' : 'SECONDARY',
            siren: baseSiren,
            siret: `${baseSiren}000${i.toString().padStart(2, '0')}`,
            postalAddress: {
              city: i % 2 === 0 ? 'Paris' : 'Lyon',
              postalCode: i % 2 === 0 ? '75001' : '69001',
              addressLine1: `${i} Rue de la République`,
              addressLine2: i % 3 === 0 ? `Bâtiment ${String.fromCharCode(65 + (i % 5))}` : undefined,
            },
            legalUnit: {
              businessEntityId: `0193acea-5d3a-7665-ada5-${i.toString().padStart(12, '0')}`,
              name: `Entreprise Exemple ${i}`,
              siren: baseSiren,
            },
            identifiers: [
              {
                businessEntityIdentifierId: `0193acea-5d3b-7665-ada5-${i.toString().padStart(12, '1')}`,
                type: 'OFFICE_IDENTIFIER',
                scheme: '0009',
                value: `${baseSiren}000${i.toString().padStart(2, '0')}`,
              },
            ],
          });
        } else {
          // Exemple d'unité légale (Legal Unit)
          resultatsExempleFR.push({
            businessEntityId: `0193acea-5c97-7665-ada2-${i.toString().padStart(12, '0')}`,
            name: `Entreprise Légale ${i}`,
            type: 'LEGAL_UNIT',
            scope: 'PRIVATE_TAX_PAYER',
            siren: baseSiren,
            identifiers: [
              {
                businessEntityIdentifierId: `0193acea-5c97-7665-ada2-${i.toString().padStart(12, '1')}`,
                type: 'LEGAL_IDENTIFIER',
                scheme: '0002',
                value: baseSiren,
              },
            ],
          });
        }
      }

      setResultatsFrancais(resultatsExempleFR);
      setResultatsInternational([]);
      setTotalResultats(nombreResultats);
    } else {
      // Génération de résultats pour l'annuaire international
      const resultatsExempleINT: ResultatAnnuaireInternational[] = [];
      const nombreResultats = 12;
      const pays = ['FR', 'DE', 'BE', 'NL', 'ES', 'IT'];
      const nomsEntreprises = [
        'Global Trading Company',
        'International Services Ltd',
        'European Logistics GmbH',
        'Continental Industries SA',
        'Nordic Solutions AB',
        'Mediterranean Export SRL',
      ];

      for (let i = 1; i <= nombreResultats; i++) {
        const paysIndex = i % pays.length;
        resultatsExempleINT.push({
          name: `${nomsEntreprises[paysIndex]} ${i}`,
          country: pays[paysIndex],
          electronicAddress: `0${190 + paysIndex}:${(123456789 + i).toString()}`,
          entity: {
            contacts: [
              {
                name: `Contact Person ${i}`,
                phone: `+${30 + paysIndex}${i.toString().padStart(9, '0')}`,
                email: `contact${i}@example-${pays[paysIndex].toLowerCase()}.com`,
              },
            ],
          },
          allowedDocuments: [
            {
              documentId:
                'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2::Invoice##urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0::2.1',
              documentScheme: 'busdox-docid-qns',
            },
            {
              documentId:
                'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2::CreditNote##urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0::2.1',
              documentScheme: 'busdox-docid-qns',
            },
          ],
        });
      }

      setResultatsInternational(resultatsExempleINT);
      setResultatsFrancais([]);
      setTotalResultats(nombreResultats);
    }

    setRechercheEffectuee(true);
    setPage(0);
  };

  // Gestion du changement de page
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gestion du changement de nombre de lignes par page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Réinitialisation de la recherche
  const handleReinitialiser = () => {
    setCriteresFrancais({
      nom: '',
      siren: '',
      siret: '',
      adresse: '',
      ville: '',
      codePostal: '',
    });
    setCriteresInternational({
      nom: '',
      siren: '',
      siret: '',
      codeAdresse: '',
      codeRoutage: '',
      pays: '',
    });
    setResultatsFrancais([]);
    setResultatsInternational([]);
    setRechercheEffectuee(false);
  };

  // Gestion de l'ouverture de la modale de détails
  const handleOuvrirDetails = (
    element: ResultatAnnuaireFrancais | ResultatAnnuaireInternational,
  ) => {
    setElementSelectionne(element);
    setModaleOuverte(true);
  };

  // Gestion de la fermeture de la modale
  const handleFermerDetails = () => {
    setModaleOuverte(false);
    setElementSelectionne(null);
  };

  // Vérifier si l'élément sélectionné est de type français
  const estResultatFrancais = (
    element: ResultatAnnuaireFrancais | ResultatAnnuaireInternational,
  ): element is ResultatAnnuaireFrancais => {
    return 'businessEntityId' in element;
  };

  // Obtenir les résultats paginés selon le type d'annuaire
  const resultatsPage =
    typeAnnuaire === 'francais'
      ? resultatsFrancais.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : resultatsInternational.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <UtilisateurIxBus titre="Consultation Annuaire">
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Barre d'actions supérieure */}
        <Paper elevation={1} sx={{ borderRadius: 0, mt: 1 }}>
          <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
            {/* Sélecteur de type d'annuaire */}
            <ToggleButtonGroup
              value={typeAnnuaire}
              exclusive
              onChange={handleChangeTypeAnnuaire}
              aria-label="type d'annuaire"
              size="small"
            >
              <ToggleButton color="primary" value="francais" aria-label="annuaire français">
                <LanguageIcon sx={{ mr: 1 }} />
                Annuaire PPF (France)
              </ToggleButton>
              <ToggleButton
                color="primary"
                value="international"
                aria-label="annuaire international"
              >
                <PublicIcon sx={{ mr: 1 }} />
                Annuaire Peppol (International)
              </ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </Paper>

        {/* Zone de contenu principale */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', pt: 1 }}>
          {/* Critères de recherche */}
          <Paper sx={{ p: 3, mb: 1, borderRadius: 0 }}>
            {typeAnnuaire === 'francais' ? (
              // Formulaire pour l'annuaire français
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                    <TextField
                      fullWidth
                      label="Nom de l'entreprise"
                      value={criteresFrancais.nom}
                      onChange={(e) =>
                        setCriteresFrancais({ ...criteresFrancais, nom: e.target.value })
                      }
                      placeholder="Recherche par nom"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 22%', minWidth: '150px' }}>
                    <TextField
                      fullWidth
                      label="SIREN"
                      value={criteresFrancais.siren}
                      onChange={(e) =>
                        setCriteresFrancais({ ...criteresFrancais, siren: e.target.value })
                      }
                      placeholder="9 chiffres"
                      inputProps={{ maxLength: 9 }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 22%', minWidth: '150px' }}>
                    <TextField
                      fullWidth
                      label="SIRET"
                      value={criteresFrancais.siret}
                      onChange={(e) =>
                        setCriteresFrancais({ ...criteresFrancais, siret: e.target.value })
                      }
                      placeholder="14 chiffres"
                      inputProps={{ maxLength: 14 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                    <TextField
                      fullWidth
                      label="Adresse"
                      value={criteresFrancais.adresse}
                      onChange={(e) =>
                        setCriteresFrancais({ ...criteresFrancais, adresse: e.target.value })
                      }
                      placeholder="Numéro et nom de rue"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                    <TextField
                      fullWidth
                      label="Ville"
                      value={criteresFrancais.ville}
                      onChange={(e) =>
                        setCriteresFrancais({ ...criteresFrancais, ville: e.target.value })
                      }
                      placeholder="Nom de la ville"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 15%', minWidth: '120px' }}>
                    <TextField
                      fullWidth
                      label="Code postal"
                      value={criteresFrancais.codePostal}
                      onChange={(e) =>
                        setCriteresFrancais({ ...criteresFrancais, codePostal: e.target.value })
                      }
                      placeholder="5 chiffres"
                      inputProps={{ maxLength: 5 }}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              // Formulaire pour l'annuaire international
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                    <TextField
                      fullWidth
                      label="Nom de l'entreprise"
                      value={criteresInternational.nom}
                      onChange={(e) =>
                        setCriteresInternational({ ...criteresInternational, nom: e.target.value })
                      }
                      placeholder="Company name"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 22%', minWidth: '150px' }}>
                    <TextField
                      fullWidth
                      label="SIREN"
                      value={criteresInternational.siren}
                      onChange={(e) =>
                        setCriteresInternational({
                          ...criteresInternational,
                          siren: e.target.value,
                        })
                      }
                      placeholder="9 chiffres"
                      inputProps={{ maxLength: 9 }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 22%', minWidth: '150px' }}>
                    <TextField
                      fullWidth
                      label="SIRET"
                      value={criteresInternational.siret}
                      onChange={(e) =>
                        setCriteresInternational({
                          ...criteresInternational,
                          siret: e.target.value,
                        })
                      }
                      placeholder="14 chiffres"
                      inputProps={{ maxLength: 14 }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                    <TextField
                      fullWidth
                      label="Code adresse"
                      value={criteresInternational.codeAdresse}
                      onChange={(e) =>
                        setCriteresInternational({
                          ...criteresInternational,
                          codeAdresse: e.target.value,
                        })
                      }
                      placeholder="Address code"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                    <TextField
                      fullWidth
                      label="Code routage"
                      value={criteresInternational.codeRoutage}
                      onChange={(e) =>
                        setCriteresInternational({
                          ...criteresInternational,
                          codeRoutage: e.target.value,
                        })
                      }
                      placeholder="Routing code"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 30%', minWidth: '200px' }}>
                    <TextField
                      fullWidth
                      label="Pays"
                      value={criteresInternational.pays}
                      onChange={(e) =>
                        setCriteresInternational({ ...criteresInternational, pays: e.target.value })
                      }
                      placeholder="Country"
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {/* Boutons d'action */}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row-reverse', gap: 2 }}>
              <Tooltip title="Lancer la recherche">
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRechercher}
                    startIcon={<SearchIcon />}
                    disabled={!auMoinsUnCritere()}
                  >
                    Rechercher
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Réinitialiser tous les critères">
                <Button
                  variant="outlined"
                  onClick={handleReinitialiser}
                  startIcon={<RestartAltIcon />}
                >
                  Réinitialiser
                </Button>
              </Tooltip>
            </Box>
          </Paper>

          {/* Résultats de recherche */}
          {rechercheEffectuee && (
            <Paper sx={{ p: 0, borderRadius: 0 }}>
              <Box
                sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="h6">Résultats de recherche</Typography>
                <Chip
                  label={`${totalResultats} résultat${totalResultats > 1 ? 's' : ''} trouvé${totalResultats > 1 ? 's' : ''}`}
                  color="primary"
                />
              </Box>

              {resultatsPage.length === 0 ? (
                <Box sx={{ p: 2 }}>
                  <Alert severity="info">Aucun résultat trouvé pour cette recherche.</Alert>
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {typeAnnuaire === 'francais' ? (
                            <>
                              <TableCell>
                                <strong>Nom</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Type</strong>
                              </TableCell>
                              <TableCell>
                                <strong>SIREN</strong>
                              </TableCell>
                              <TableCell>
                                <strong>SIRET</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Adresse</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Ville</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Code postal</strong>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>
                                <strong>Nom</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Pays</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Adresse électronique</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Contact</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Email</strong>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {typeAnnuaire === 'francais'
                          ? (resultatsPage as ResultatAnnuaireFrancais[]).map((resultat) => (
                              <TableRow
                                key={resultat.businessEntityId}
                                hover
                                onClick={() => handleOuvrirDetails(resultat)}
                                sx={{ cursor: 'pointer' }}
                              >
                                <TableCell>{resultat.name}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={
                                      resultat.type === 'LEGAL_UNIT' ? 'Unité légale' : 'Établissement'
                                    }
                                    size="small"
                                    color={resultat.type === 'LEGAL_UNIT' ? 'primary' : 'default'}
                                  />
                                </TableCell>
                                <TableCell>{resultat.siren}</TableCell>
                                <TableCell>{resultat.siret || '-'}</TableCell>
                                <TableCell>
                                  {resultat.postalAddress
                                    ? `${resultat.postalAddress.addressLine1}${resultat.postalAddress.addressLine2 ? ', ' + resultat.postalAddress.addressLine2 : ''}`
                                    : '-'}
                                </TableCell>
                                <TableCell>{resultat.postalAddress?.city || '-'}</TableCell>
                                <TableCell>{resultat.postalAddress?.postalCode || '-'}</TableCell>
                              </TableRow>
                            ))
                          : (resultatsPage as ResultatAnnuaireInternational[]).map(
                              (resultat, index) => (
                                <TableRow
                                  key={`${resultat.electronicAddress}-${index}`}
                                  hover
                                  onClick={() => handleOuvrirDetails(resultat)}
                                  sx={{ cursor: 'pointer' }}
                                >
                                  <TableCell>{resultat.name}</TableCell>
                                  <TableCell>{resultat.country}</TableCell>
                                  <TableCell>
                                    <code style={{ fontSize: '0.85em' }}>
                                      {resultat.electronicAddress}
                                    </code>
                                  </TableCell>
                                  <TableCell>
                                    {resultat.entity?.contacts?.[0]?.name || '-'}
                                  </TableCell>
                                  <TableCell>
                                    {resultat.entity?.contacts?.[0]?.email || '-'}
                                  </TableCell>
                                </TableRow>
                              ),
                            )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={totalResultats}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Lignes par page :"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}–${to} sur ${count !== -1 ? count : `plus de ${to}`}`
                    }
                  />
                </>
              )}
            </Paper>
          )}
        </Box>

        {/* Modale de détails */}
        <Dialog
          open={modaleOuverte}
          onClose={handleFermerDetails}
          maxWidth="md"
          fullWidth
          scroll="paper"
        >
          <DialogTitle>
            Détails de l'entité
            {elementSelectionne && (
              <Typography variant="subtitle2" color="text.secondary">
                {estResultatFrancais(elementSelectionne)
                  ? elementSelectionne.name
                  : elementSelectionne.name}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent dividers>
            {elementSelectionne && (
              <>
                {estResultatFrancais(elementSelectionne) ? (
                  // Affichage pour l'annuaire français
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Informations principales */}
                      <Typography color="primary" variant="h6" gutterBottom>
                        Informations principales
                      </Typography>
                      
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="ID de l'entité"
                            secondary={elementSelectionne.businessEntityId}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Nom" secondary={elementSelectionne.name} />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Type"
                            secondary={
                              <Chip
                                label={
                                  elementSelectionne.type === 'LEGAL_UNIT'
                                    ? 'Unité légale'
                                    : 'Établissement'
                                }
                                size="small"
                                color={
                                  elementSelectionne.type === 'LEGAL_UNIT' ? 'primary' : 'default'
                                }
                              />
                            }
                          />
                        </ListItem>
                        {elementSelectionne.scope && (
                          <ListItem>
                            <ListItemText
                              primary="Portée"
                              secondary={elementSelectionne.scope}
                            />
                          </ListItem>
                        )}
                        <ListItem>
                          <ListItemText primary="SIREN" secondary={elementSelectionne.siren} />
                        </ListItem>
                        {elementSelectionne.siret && (
                          <ListItem>
                            <ListItemText primary="SIRET" secondary={elementSelectionne.siret} />
                          </ListItem>
                        )}
                      </List>

                    {/* Adresse postale */}
                    {elementSelectionne.postalAddress && (
<>
                        <Typography color="primary" variant="h6" gutterBottom>
                          Adresse postale
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Ligne 1"
                              secondary={elementSelectionne.postalAddress.addressLine1}
                            />
                          </ListItem>
                          {elementSelectionne.postalAddress.addressLine2 && (
                            <ListItem>
                              <ListItemText
                                primary="Ligne 2"
                                secondary={elementSelectionne.postalAddress.addressLine2}
                              />
                            </ListItem>
                          )}
                          <ListItem>
                            <ListItemText
                              primary="Ville"
                              secondary={elementSelectionne.postalAddress.city}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Code postal"
                              secondary={elementSelectionne.postalAddress.postalCode}
                            />
                          </ListItem>
                        </List></>
                    )}

                    {/* Unité légale (si établissement) */}
                    {elementSelectionne.legalUnit && (
                      <>
                        <Typography color="primary" variant="h6" gutterBottom>
                          Unité légale rattachée
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="ID"
                              secondary={elementSelectionne.legalUnit.businessEntityId}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Nom"
                              secondary={elementSelectionne.legalUnit.name}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="SIREN"
                              secondary={elementSelectionne.legalUnit.siren}
                            />
                          </ListItem>
                        </List>
                      </>
                    )}

                    {/* Identifiants */}
                    {elementSelectionne.identifiers && elementSelectionne.identifiers.length > 0 && (
                    <>
                          <Typography color="primary" variant="h6">
                            Identifiants ({elementSelectionne.identifiers.length})
                          </Typography>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {elementSelectionne.identifiers.map((identifier, index) => (
                              <Paper key={index} sx={{ p: 2, boxShadow: 0 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Identifiant #{index + 1}
                                </Typography>
                                <List dense>
                                  <ListItem>
                                    <ListItemText
                                      primary="ID"
                                      secondary={identifier.businessEntityIdentifierId}
                                    />
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText primary="Type" secondary={identifier.type} />
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText primary="Schéma" secondary={identifier.scheme} />
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText primary="Valeur" secondary={identifier.value} />
                                  </ListItem>
                                  {identifier.networkRegistered &&
                                    identifier.networkRegistered.length > 0 && (
                                      <ListItem>
                                        <ListItemText
                                          primary="Réseaux enregistrés"
                                          secondary={identifier.networkRegistered
                                            .map((network) => network.networkIdentifier)
                                            .join(', ')}
                                        />
                                      </ListItem>
                                    )}
                                </List>
                              </Paper>
                            ))}
                          </Box>
                      </>
                    )}
                  </Box>
                ) : (
                  // Affichage pour l'annuaire international
                  <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                    {/* Informations principales */}
                    
                      <Typography color="primary" variant="h6" gutterBottom>
                        Informations principales
                      </Typography>

                      <List dense>
                        <ListItem>
                          <ListItemText primary="Nom" secondary={elementSelectionne.name} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Pays" secondary={elementSelectionne.country} />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Adresse électronique"
                            secondary={
                              <code style={{ fontSize: '0.9em' }}>
                                {elementSelectionne.electronicAddress}
                              </code>
                            }
                          />
                        </ListItem>
                      </List>
                    

                    {/* Contacts */}
                    {elementSelectionne.entity?.contacts &&
                      elementSelectionne.entity.contacts.length > 0 && (
                        <>
                            <Typography color="primary" variant="h6">
                              Contacts ({elementSelectionne.entity.contacts.length})
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {elementSelectionne.entity.contacts.map((contact, index) => (
                                <Paper key={index} sx={{ boxShadow:0, p: 2 }}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Contact #{index + 1}
                                  </Typography>
                                  <List dense>
                                    <ListItem>
                                      <ListItemText primary="Nom" secondary={contact.name} />
                                    </ListItem>
                                    {contact.phone && (
                                      <ListItem>
                                        <ListItemText
                                          primary="Téléphone"
                                          secondary={contact.phone}
                                        />
                                      </ListItem>
                                    )}
                                    {contact.email && (
                                      <ListItem>
                                        <ListItemText primary="Email" secondary={contact.email} />
                                      </ListItem>
                                    )}
                                  </List>
                                </Paper>
                              ))}
                            </Box>
                        </>
                      )}

                    {/* Documents autorisés */}
                    {elementSelectionne.allowedDocuments &&
                      elementSelectionne.allowedDocuments.length > 0 && (
<>
                            <Typography color="primary" variant="h6">
                              Documents autorisés ({elementSelectionne.allowedDocuments.length})
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              {elementSelectionne.allowedDocuments.map((doc, index) => (
                                <Paper key={index} sx={{ boxShadow:0, p: 2 }}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Document #{index + 1}
                                  </Typography>
                                  <List dense>
                                    <ListItem>
                                      <ListItemText
                                        primary="ID du document"
                                        secondary={
                                          <code
                                            style={{
                                              fontSize: '0.85em',
                                              wordBreak: 'break-all',
                                            }}
                                          >
                                            {doc.documentId}
                                          </code>
                                        }
                                      />
                                    </ListItem>
                                    <ListItem>
                                      <ListItemText
                                        primary="Schéma"
                                        secondary={doc.documentScheme}
                                      />
                                    </ListItem>
                                  </List>
                                </Paper>
                              ))}
                            </Box>
</>
                      )}
                  </Box>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFermerDetails}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </UtilisateurIxBus>
  );
};

export default ConsultationAnnuaireIXFacture;

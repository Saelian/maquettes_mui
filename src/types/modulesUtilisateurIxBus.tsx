import {
  Dashboard,
  Add,
  Send,
  Receipt,
  History,
  TableChart,
  Description,
  School,
  Visibility as VisibilityIcon,
  CheckCircle,
  AccountBalance,
  FileDownload,
  FileUpload,
  Visibility,
  Campaign
} from '@mui/icons-material';
import { Module } from './navigation';

// Import des icônes SVG des modules
import icoIxActes from '../assets/img_modules/ico_iXActes_couleur.svg';
import icoIxHelios from '../assets/img_modules/ico_iXHelios_couleur.svg';
import icoIxFacture from '../assets/img_modules/ico_iXFacture_couleur.svg';
import icoIxFormulaire from '../assets/img_modules/ico_iXFormulaire_couleur.svg';
import icoIxGed from '../assets/img_modules/ico_iXGed_couleur.svg';
import icoIxSae from '../assets/img_modules/ico_iXSae_couleur.svg';
import icoIxParapheur from '../assets/img_modules/ico_iXParapheur_couleur.svg';

/**
 * Liste des modules iXBus pour le menu Utilisateur
 * Cette constante peut être réutilisée dans toutes les maquettes basées sur le template UtilisateurIxBus
 */
export const modulesUtilisateurIxBus: Module[] = [
  {
    nom: 'iXActes',
    icone: <img src={icoIxActes} alt="iXActes" style={{ width: 24, height: 24 }} />,
    couleur: '#fac021',
    sousSections: [
      { texte: 'Tableau de bord', icone: <Dashboard /> },
      { texte: 'Préparer', icone: <Add /> },
      { texte: 'Éléments envoyés', icone: <Send /> },
      { texte: 'Éléments reçus', icone: <Receipt /> },
      { texte: 'Nomenclature', icone: <TableChart /> },
    ],
  },
  {
    nom: 'iXHelios',
    icone: <img src={icoIxHelios} alt="iXHelios" style={{ width: 24, height: 24 }} />,
    couleur: '#0b9c3a',
    sousSections: [
      { texte: 'Tableau de bord', icone: <Dashboard /> },
      { texte: 'Préparer', icone: <Add /> },
      { texte: 'Éléments envoyés', icone: <Send /> },
      { texte: 'Éléments reçus', icone: <Receipt /> },
    ],
  },
  {
    nom: 'iXFacture',
    icone: <img src={icoIxFacture} alt="iXFacture" style={{ width: 24, height: 24 }} />,
    couleur: '#927DCE',
    sousSections: [
      { texte: 'Tableau de bord', icone: <Dashboard />, lien: '/tableau-de-bord-ixfacture' },
      { texte: 'Préparer', icone: <Add />, lien: '/preparer-ixfacture' },
      { texte: 'Factures d\'achat', icone: <FileDownload />, lien: '/factures-achat-ixfacture' },
      { texte: 'Factures de vente', icone: <FileUpload />, lien: '/factures-vente-ixfacture' },
      { texte: 'Autres factures entrantes', icone: <Description /> },
      { texte: 'Historique', icone: <History /> },
    ],
  },
  {
    nom: 'iXFormulaire',
    icone: <img src={icoIxFormulaire} alt="iXFormulaire" style={{ width: 24, height: 24 }} />,
    couleur: '#00A99D',
    sousSections: [
      { texte: 'Préparer', icone: <Add /> },
      { texte: 'Suivi', icone: <VisibilityIcon /> },
    ],
  },
  {
    nom: 'iXGed',
    icone: <img src={icoIxGed} alt="iXGed" style={{ width: 24, height: 24 }} />,
    couleur: '#193F61',
    sousSections: [{ texte: 'Suivi', icone: <VisibilityIcon /> }],
  },
  {
    nom: 'iXSae',
    icone: <img src={icoIxSae} alt="iXSae" style={{ width: 24, height: 24 }} />,
    couleur: '#47C3E8',
    sousSections: [{ texte: 'Suivi', icone: <VisibilityIcon /> }],
  },
  {
    nom: 'iXParapheur',
    icone: <img src={icoIxParapheur} alt="iXParapheur" style={{ width: 24, height: 24 }} />,
    couleur: '#E566C7',
    sousSections: [
      { texte: 'Tableau de bord', icone: <Dashboard /> },
      { texte: 'Préparer', icone: <Add /> },
      { texte: 'Viser', icone: <VisibilityIcon /> },
      { texte: 'Signer', icone: <CheckCircle /> },
      { texte: 'Suivi', icone: <VisibilityIcon /> },
      { texte: 'Historique', icone: <History /> },
      { texte: 'Mes délégations', icone: <AccountBalance /> },
    ],
  },
  {
    nom: 'Communications',
    icone: <Campaign />,
    couleur: 'rgba(0,0,0,0.6)',
  },
  {
    nom: 'Documentation',
    icone: <School />,
    couleur: 'rgba(0,0,0,0.6)',
  },
  {
    nom: "Déclaration d'accessibilité",
    icone: <Visibility />,
    couleur: 'rgba(0,0,0,0.6)',
  },
];

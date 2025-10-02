import {
  HelpOutline,
  Dashboard,
  Add,
  Send,
  Receipt,
  History,
  TableChart,
  BarChart,
  Description,
  Accessibility,
  Chat,
  Visibility as VisibilityIcon,
  Edit,
  CheckCircle,
  AccountBalance,
} from '@mui/icons-material';
import { Module } from './navigation';

/**
 * Liste des modules iXBus pour le menu Utilisateur
 * Cette constante peut être réutilisée dans toutes les maquettes basées sur le template UtilisateurIxBus
 */
export const modulesUtilisateurIxBus: Module[] = [
  {
    nom: 'iXActes',
    icone: <HelpOutline />,
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
    icone: <HelpOutline />,
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
    icone: <Receipt />,
    couleur: '#927DCE',
    sousSections: [
      { texte: 'Tableau de bord', icone: <Dashboard /> },
      { texte: 'Préparer', icone: <Add /> },
      { texte: 'Suivi', icone: <VisibilityIcon /> },
      { texte: 'Historique', icone: <History /> },
    ],
  },
  {
    nom: 'iXFormulaire',
    icone: <TableChart />,
    couleur: '#00A99D',
    sousSections: [
      { texte: 'Préparer', icone: <Add /> },
      { texte: 'Suivi', icone: <VisibilityIcon /> },
    ],
  },
  {
    nom: 'iXGed',
    icone: <Description />,
    couleur: '#193F61',
    sousSections: [{ texte: 'Suivi', icone: <VisibilityIcon /> }],
  },
  {
    nom: 'iXSae',
    icone: <BarChart />,
    couleur: '#47C3E8',
    sousSections: [{ texte: 'Suivi', icone: <VisibilityIcon /> }],
  },
  {
    nom: 'iXParapheur',
    icone: <Edit />,
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
    icone: <Chat />,
    couleur: '#8E8E93',
  },
  {
    nom: 'Documentation',
    icone: <Description />,
    couleur: '#8E8E93',
  },
  {
    nom: "Déclaration d'accessibilité",
    icone: <Accessibility />,
    couleur: '#8E8E93',
  },
];

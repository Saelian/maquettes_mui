import {
  Home,
  BarChart,
  People,
  Business,
  Category,
  AccountTree,
  Settings,
  SupervisorAccount,
  Email,
  ShowChart,
  Sync,
  Storage,
  AccountTree as WorkflowIcon,
} from '@mui/icons-material';
import { Module } from './navigation';

// Import des icônes SVG des modules
import icoIxParapheur from '../assets/img_modules/ico_iXParapheur_couleur.svg';
import icoIxFacture from '../assets/img_modules/ico_iXFacture_couleur.svg';

/**
 * Liste des modules iXBus pour le menu Administrateur
 * Cette constante peut être réutilisée dans toutes les maquettes basées sur le template AdminIxBus
 */
export const modulesAdministrateurIxBus: Module[] = [
  {
    nom: 'Général',
    icone: <Settings />,
    couleur: '#1976d2',
    sousSections: [
      { texte: 'Revenir à l\'application', icone: <Home /> },
      { texte: 'Statistiques', icone: <BarChart /> },
      { texte: 'Utilisateurs', icone: <People /> },
      { texte: 'Organisation', icone: <Business /> },
    ],
  },
  {
    nom: 'iXParapheur',
    icone: <img src={icoIxParapheur} alt="iXParapheur" style={{ width: 24, height: 24 }} />,
    couleur: '#E566C7',
    sousSections: [
      { texte: 'Natures', icone: <Category /> },
      { texte: 'Circuits', icone: <AccountTree /> },
      { texte: 'Options et Paramètres', icone: <Settings /> },
      { texte: 'Délégations', icone: <SupervisorAccount /> },
      { texte: 'Emails', icone: <Email /> },
      { texte: 'Statistiques', icone: <ShowChart /> },
    ],
  },
  {
    nom: 'iXFacture',
    icone: <img src={icoIxFacture} alt="iXFacture" style={{ width: 24, height: 24 }} />,
    couleur: '#927DCE',
    sousSections: [
      { texte: 'Interfaces', icone: <Sync />, lien: '/interfaces-ixfacture' },
      { texte: 'Metadonnées', icone: <Storage />, lien: '/metadonnees-ixfacture' },
      { texte: 'Workflow', icone: <WorkflowIcon /> },
    ],
  },
];

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Help } from '@mui/icons-material';

export interface ModalAideProps {
  ouvert: boolean;
  onFermer: () => void;
  pageCourante?: string;
}

interface ContenuAide {
  titre: string;
  contenu: string[];
}

const contenuAideParPage: Record<string, ContenuAide> = {
  'factures-vente-ixfacture': {
    titre: 'Factures de vente',
    contenu: [
      "Cet écran vous permet de gérer vos factures de vente émises vers vos clients.",
      "Vous pouvez consulter toutes vos factures, filtrer par statut (brouillon, envoyée, validée, rejetée), rechercher par numéro ou destinataire, et suivre l'état de transmission à la plateforme Chorus Pro.",
      "Les actions disponibles incluent l'envoi de factures par email, la consultation des détails, et la gestion des métadonnées associées à chaque facture.",
      "Les statuts vous informent de l'avancement du traitement : brouillon (en cours de rédaction), envoyée (transmise à Chorus Pro), validée (acceptée par le client), ou rejetée (refusée et nécessitant correction)."
    ]
  },
  'factures-achat-ixfacture': {
    titre: 'Factures d\'achat',
    contenu: [
      "Cet écran centralise la gestion de vos factures d'achat reçues de vos fournisseurs.",
      "Vous pouvez consulter l'ensemble de vos factures entrantes, les filtrer selon leur statut de traitement, rechercher par numéro ou émetteur, et suivre leur workflow de validation.",
      "Les fonctionnalités incluent la visualisation des pièces jointes, la vérification des informations de facturation, et le suivi des échéances de paiement.",
      "Le statut de chaque facture indique où elle se situe dans le processus : reçue, en cours de vérification, validée pour paiement, ou en anomalie nécessitant une action."
    ]
  },
  'preparer-ixfacture': {
    titre: 'Préparer une facture',
    contenu: [
      "Cet écran vous permet de créer et préparer une nouvelle facture avant son envoi officiel.",
      "Vous pouvez saisir toutes les informations nécessaires : coordonnées du destinataire, lignes de facturation avec quantités et prix, conditions de paiement, et pièces jointes.",
      "L'interface vous guide dans la saisie des champs obligatoires et calcule automatiquement les montants HT, TVA et TTC.",
      "Une fois complétée, la facture peut être enregistrée en brouillon pour modification ultérieure ou directement transmise pour traitement et envoi au client."
    ]
  },
  'tableau-de-bord-ixfacture': {
    titre: 'Tableau de bord',
    contenu: [
      "Le tableau de bord offre une vue d'ensemble de votre activité de facturation.",
      "Vous y retrouvez les indicateurs clés : nombre de factures en attente, montants totaux facturés, taux de validation, et alertes sur les factures nécessitant une attention.",
      "Les graphiques et statistiques vous permettent de suivre l'évolution de votre activité sur différentes périodes et d'identifier rapidement les points d'attention.",
      "C'est votre point d'entrée principal pour avoir une vision globale et accéder rapidement aux différentes sections de l'application."
    ]
  },
  'e-reporting': {
    titre: 'E-Reporting',
    contenu: [
      "Cet écran gère la transmission de vos données de facturation aux autorités fiscales dans le cadre de l'obligation d'e-reporting.",
      "Vous pouvez consulter l'historique des transmissions, vérifier les statuts de conformité, et relancer les envois en cas d'échec.",
      "L'interface vous informe des échéances réglementaires et vous assiste dans la préparation des données selon les formats requis par l'administration fiscale.",
      "Les rapports d'erreur détaillés vous aident à corriger rapidement les anomalies bloquant la transmission de vos déclarations."
    ]
  },
  'consultation-annuaire-ixfacture': {
    titre: 'Consultation de l\'annuaire',
    contenu: [
      "Cet écran vous permet de rechercher et consulter les informations des entreprises françaises et internationales dans les annuaires officiels.",
      "Vous pouvez effectuer des recherches par numéro SIRET, SIREN, dénomination sociale ou adresse pour vérifier l'existence et les coordonnées d'une entreprise.",
      "Les informations affichées incluent les données d'identification, l'adresse du siège social, le statut juridique, et les codes d'activité.",
      "Cette fonctionnalité facilite la saisie correcte des informations de vos clients et fournisseurs lors de la création de factures."
    ]
  },
  'interfaces-ixfacture': {
    titre: 'Interfaces iXParapheur',
    contenu: [
      "Cet écran de configuration permet de définir les règles d'envoi de documents vers le système de signature électronique iXParapheur.",
      "Vous pouvez paramétrer les conditions d'aiguillage : quels types de documents, pour quels montants, vers quels signataires, et dans quel circuit de validation.",
      "Les règles configurées déterminent automatiquement le workflow de signature en fonction des caractéristiques de chaque facture (montant, fournisseur, nature...).",
      "Cette automatisation garantit que chaque document suit le circuit d'approbation approprié sans intervention manuelle."
    ]
  },
  'natures-ixfacture': {
    titre: 'Natures de factures',
    contenu: [
      "Cet écran de configuration vous permet de définir les différentes catégories de factures utilisées dans votre organisation.",
      "Chaque nature de facture peut avoir ses propres règles d'aiguillage : destination de transmission, circuit de validation, métadonnées obligatoires.",
      "Vous configurez ici la logique métier qui détermine automatiquement comment traiter chaque facture selon ses caractéristiques (type de prestation, entité, fournisseur...).",
      "Ces paramètres assurent que vos factures suivent les bons processus de validation et sont transmises aux bons systèmes sans erreur."
    ]
  },
  'metadonnees-ixfacture': {
    titre: 'Métadonnées',
    contenu: [
      "Cet écran permet de configurer les champs de métadonnées personnalisés associés à vos factures.",
      "Vous pouvez définir de nouveaux champs pour capturer des informations spécifiques à votre organisation : code projet, centre de coût, référence interne...",
      "Les règles de calcul automatique peuvent être configurées pour remplir certains champs en fonction d'autres informations de la facture.",
      "Ces métadonnées enrichissent vos factures et facilitent leur traitement, recherche et intégration avec vos systèmes comptables et de gestion."
    ]
  },
  'configurations-api-ixfacture': {
    titre: 'Configurations API',
    contenu: [
      "Cet écran gère les paramètres de connexion aux plateformes externes Chorus Pro et Plateforme de Dématérialisation Partenaire.",
      "Vous y configurez les identifiants OAuth2, les URLs d'API, et les paramètres de sécurité nécessaires aux échanges automatisés.",
      "Ces configurations permettent à l'application de transmettre et recevoir automatiquement les factures depuis et vers ces plateformes réglementaires.",
      "Une configuration correcte est essentielle pour assurer le bon fonctionnement de la facturation électronique et la conformité aux obligations légales."
    ]
  },
};

export default function ModalAide({ ouvert, onFermer, pageCourante }: ModalAideProps) {
  const aide = pageCourante ? contenuAideParPage[pageCourante] : null;

  return (
    <Dialog
      open={ouvert}
      onClose={onFermer}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Help color="primary" />
        {aide ? aide.titre : 'Aide'}
      </DialogTitle>
      <DialogContent>
        {aide ? (
          <Box>
            {aide.contenu.map((paragraphe, index) => (
              <Typography key={index} paragraph>
                {paragraphe}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography>
            Aucune aide disponible pour cette page.
          </Typography>
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

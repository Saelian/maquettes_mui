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
      "La colonne Origine indique si la facture a été saisie manuellement (depuis le menu Préparer), importée avec un fichier existant (depuis le menu Préparer également) ou déposée par API (connecteur métier ou transmetteur).",
      "La colonne Destination indique si la facture est émise par la Plateforme Agréée (envoi vers un privé), CPP (envoi vers une entité publique) ou si un envoi par mail est préféré.",
      "La colonne Nature a été déterminée automatiquement par les règles de routage (voir maquette Natures dans l'administration).",
      "La colonne Statut indique l'état d'avancement de la facture.",
      "S'agissant ici de factures de vente, la plupart des statuts sont ceux que la plateforme de réception nous a transmis.",
      "De plus, on ne peut agir que sur les statuts suivants : Suspendue, Complétée et Paiement transmis.",
      "Le statut Suspendue permet de compléter la facture. Les statuts Complétée et Paiement transmis d'acquitter de la bonne réception du paiement (statut Encaissée)."
    ]
  },
  'factures-achat-ixfacture': {
    titre: 'Factures d\'achat',
    contenu: [
      "La colonne Origine indique si la facture provient de la plateforme agréée et bénéficiera donc des échanges de statuts métiers.",
      "Si la facture a été saisie manuellement (depuis le menu Préparer) ou importée avec un fichier existant (depuis le menu Préparer également) ou déposée par API (connecteur métier ou transmetteur) alors la facture ne bénéficiera pas d'échanges de statuts.",
      "Dans ces cas, les statuts modifiés dans l'interface ne sont là qu'à titre indicatif pour le suivi interne.",
       "La colonne Nature a été déterminée automatiquement par les règles de routage (voir maquette Natures dans l'administration).",
    ]
  },
  'preparer-ixfacture': {
    titre: 'Préparer une facture',
    contenu: [
      "Cet écran permet de créer manuellement une facture ou d'en importer une déjà existante.",
      "Lors de la création manuelle : ",
      "- d'une facture de vente : on peut préciser si cette facture devra partir dans la plateforme agréée ou si c'est une facture qui partira par mail directement au client",
      "- d'une facture d'achat : s'agissant d'une facture entrante, cette facture ne bénéficiera pas d'échanges de statuts avec la plateforme agréée. Cette facture sera toutefois disponibles sur les API iXFacture et pourra être traitée par l'ERP comme une facture soumise à la réforme (il n'y aura juste pas d'échanges avec la PA)",
      "Lors d'un import d'une facture existante : ",
      "- si c'est une facture structurée, celle-ci partira selon les mêmes règles que pour une création manuelle",
      "- si c'est une facture non structurée PDF, celle-ci sera envoyée dans le module de reconnaissance pour constituer une facture structurée (PAS DE MAQUETTE SUR CE POINT A CE JOUR)"
    ]
  },
  'tableau-de-bord-ixfacture': {
    titre: 'Tableau de bord',
    contenu: [
      "Le tableau de bord offre une vue d'ensemble de l'activité de facturation.",
    ]
  },
  'e-reporting': {
    titre: 'E-Reporting',
    contenu: [
      "Cet écran gère la transmission des données de facturation aux autorités fiscales dans le cadre de l'obligation d'e-reporting.",
      "La structure des exemples est issuee des spécifications réglementaires et est assez proche de ce qui sera réellement transmis en production.",
    ]
  },
  'consultation-annuaire-ixfacture': {
    titre: 'Consultation de l\'annuaire',
    contenu: [
      "Cet écran vous permet de rechercher et consulter les informations des entreprises françaises et internationales dans les annuaires officiels.",
      "La recherche n'est pas opérationnelle en tant que tel sur cette maquette.",
      "Les informations retournées sont par contre conforme à ce qui sera retourné en production, la maquette ayant été constituée sur la base des spécifications officielles"
    ]
  },
  'interfaces-ixfacture': {
    titre: 'Interfaces iXParapheur',
    contenu: [
      "Cet écran de configuration permet de définir les règles d'envoi des factures vers iXParapheur.",
      "On y définit des conditions d'aiguillage vers iXParapheur, qui sont basées sur deux critères :", 
      "- Quel est le statut qui déclenche le dépôt,",
      "- Quelles sont les règles métiers complémentaires, basées soit sur la facture en elle-même, soit sur ces métadonnées complémentaires",
      "Une fois les conditions remplies, la facture est automatiquement transmise à iXParapheur pour validation ",
      "Lorsque le circuit est terminé ou refusé, on précise également le statut qui doit être déclenché dans iXFacture et transmis à la PA.",
      "Les règles sont évaluées dans l'ordre d'apparition dans la liste : la première règle remplissant les conditions est celle qui est appliquée, les suivantes sont ignorées."
    ]
  },
  'natures-ixfacture': {
    titre: 'Natures de factures',
    contenu: [
      "Cet écran de configuration vous permet de définir les différentes catégories de factures utilisées",
      "Chaque nature dispose de règles d'aiguillage qui peuvent être mises en place sur la base des données de la facture ou de ses métadonnées.",
      "La règle \"Par défaut\" est obligatoire et doit être configurée pour que le système puisse toujours attribuer une nature à chaque facture.",
      "Pourquoi ce système ?",
      "L'affectation à une nature de facture permet de cloisonner les factures. Une fois cloisonnées, les droits utilisateurs sont mis en place pour que certains utilisateurs ne puissent voir que les factures d'une ou plusieurs natures.",
      "Cette restriction s'applique également aux API iXFacture, qui ne retourneront que les factures des natures auxquelles l'utilisateur a accès, permettant ainsi à plusieurs ERP de n'avoir accès qu'aux factures qui les concernent.",
    ]
  },
  'metadonnees-ixfacture': {
    titre: 'Métadonnées',
    contenu: [
      "L'administateur définit ici quelles sont les métadonnées qui sont disponibles pour les utilisateurs finaux.",
      "Ces métadonnées peuvent ensuite être saisies sur la facture",
      "Pour les champs qui ont des valeurs fixes (liste déroulante principalement), le contenu autorisé pourra être défini par API (exemple : plan comptable).",
      "Les règles de calcul sont un moyen de calculer automatiquement la valeur d'une métadonnée en fonction d'autres métadonnées ou données de la facture.",
    ]
  },
  'configurations-api-ixfacture': {
    titre: 'Configurations API',
    contenu: [
      "Ecran qui permet de mettre en place les configurations API pour les connexions vers CPP et la Plateforme Agréée.",
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

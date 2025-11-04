# Mise à jour de l'historique de la facture

Pour l'instant, les informations qui sont dans l'historique d'une facture d'achat ne sont pas cohérentes avec la réalité. Il faut adapter cette partie. On parle ici du bloc Historique qui se trouve dans la modale d'une consultation de facture.

Plusieurs actions sont à prévoir.

## Adapter le contenu

L'historique de la facture doit tracer TOUTES les actions qui ont été portées sur la facture.
Cela inclut les statuts des factures (dont tu trouveras une parties des statuts dans le fichier  Statuts_Factures_Achat.md.)
Mais cela inclut également les actions qui auraient été faites sur les factures : 
- Consultation par un utilisateur
- Téléchargement
- Exportation
- Complétion des métadonnées : il faut la valeur de la métadonnée avant et après
- Changement de statut manuel ou par API

En complément, il existe des statuts métiers propres à l'application. Dans le cadre des maquettes, nous n'en gérerons qu'un seul : En attente de validation iXParapheur : la facture a été envoyée pour validation dans le parapheur. Lorsque la facture est validée dans le parapheur, on a un retour "Facture validée dans iXParapheur".

## Adapter l'affichage

L'affichage doit être présenté sous forme de tableau, avec les colonnes suivantes : 
- Date et heure
- Utilisateur : la personne qui a effectué l'action avec son adresse IP. Si c'est une action du système, indiquer "Système"
- Action : L'action sur la facture. Cette action peut être un statut.
- Détail de l'action : une phrase qui reprend l'état dans une phrase. Exemple : si l'état est "Mise à disposition", la phrase serait "La facture est mise à disposition"

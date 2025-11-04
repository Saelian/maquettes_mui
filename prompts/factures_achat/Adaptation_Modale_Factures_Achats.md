# Changement sur la modale des Factures d'achats

Ces changements concernent la maquette FacturesAchatiXfacture.

## Adapter la modale de consultation d'une facture

La modale de consultation d'une facture pour le menu Factures d'achat doit être amélioré.
Il faut faire en sorte que cette modale prenne 95% de l'espace horizontal et vertical disponible, tout en laissant l'application en arrière plan sur les 5% restant.

Ensuite, elle doit être découpée sous un format deux tiers / un tiers.
La partie gauche (les deux tiers) aura 3 onglets qui sont définis ci-dessous.
La partie droite continuera d'afficher des informations que nous définierons plus tard.

### Les trois onglets de la partie gauche

#### vue métier

Cet onglet présentera les informations sous avec les différents champs de la norme EN16931.
Ces informations sont actuellement présentes directement lorsqu'on ouvre la modale, sur la partie droite. Il s'agit des blocs "Informations du fournisseur", "Informations de la facture" et "Lignes de facturation"
Il faut les déplacer dans cet onglet "Vue Métier".

#### vue lisible

Cet onglet représente la partie lisible de la facture.
En effet, lorsqu'on reçoit une facture dématérialisée, on doit la rematérialiser pour qu'un humain puisse la lire.
Il faut donc faire une affichage fictif d'une facture, présentée comme telle. Je te laisse libre choix de la présentation à mettre en place mais elle doit être identique sur toutes les factures consultées et cela doit ressembler à une facture (entete, lignes, pied de factures)

#### informations

Cet onglet présente diverses informations que nous verrons plus tard.
Pour l'instant, il faut y mettre tout l'historique de la facture, avec tous les états par lesquels la facture est passée. Tu trouveras les règles de gestion des différents statuts métier d'une facture dans le fichier prompts/Statuts_Factures_Achat.md

### Affichage de droite 

L'affichage de droite (le un tiers restant) est consacré à deux sections décrites ci-dessous.

#### Pièces jointes

Si la facture dématérialisée comportait des pièces jointes encapsulées, celles-ci sont visibles dans un bloc dédié ici.
S'il n'y a pas de pièces jointes, on affiche simplement "Pas de pièces jointes".

#### Métadonnées

On affiche en dessous le bloc métadonnées. Conserve l'existant pour l'instant, nous l'enrichierons plus tard.

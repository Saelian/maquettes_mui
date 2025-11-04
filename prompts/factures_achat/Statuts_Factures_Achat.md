# Maquette FacturesAchatiXfacture

Ce document contient des instructions pour la maquette FacturesAchatiXfacture.
Il convient de mettre en places les différents changements énoncés ci-dessous.

## Mise à jour de la fonctionnalité de statuts

### Remplacer les boutons Valider et Refuser par un seul bouton "Statuer"

Actuellement, un bouton Valider et Refuser est en place.
Ce n'est pas adapté au contexte. 
Il faut remplacer ces deux boutons par un bouton "Statuer", qui va déclencher les différents statuts métiers qui sont disponibles plus loin dans ce document.

### Adapter les statuts au métier

Les statuts actuellement mis en place dans cette maquette sont factices et ne reflètent pas la réalité des statuts de la réforme de la facturation.
Il faut les adapter.

Les statuts d'une facture d'achat peuvent être les suivants et sont classés en deux catégories : 

#### Statuts techniques que la plateforme déclenche toute seule : 

Reçue de la plateforme > La PA de réception a reçu la facture et en informe la PA d'émission
Mise à disposition > La facture est disponible pour le client final
Rejetée > La PA de réception rejette technique la facture qui n'est pas structurellement conforme

Ces statuts ne peuvent pas être déclenchés par l'utilisateur.

#### Statuts que l'utilisateur peut mettre à la main via le bouton "Statuer"

Prise en charge > Le client final indique qu'il a pris en charge la facture
Approuvée > Le client final approuve la facture
Approuvée partiellement > Le client final approuve partiellement la facture
En litige > Le client final n'est pas d'accord avec la facture
Suspendue > Le client final met en pause la facture. Ce statut permet au vendeur de déclencher le statut complétée après avoir fourni une facture corrective

Refusée > Le client final refuse la facture
Paiement transmis > Le client final indique avoir transmis le paiement

Les règles métiers sont les suivantes pour ces statuts : 

- Prise en charge, on ne peut plus déclencher ce statut si on a déclenché l'un des autres statuts ci-après. Peut être déclenché depuis la statut "Mise à disposition"
- Approuvée : on ne peut plus utiliser les statuts Approuvée partiellement ou En litige après avoir approuvé. Peut être déclenché depuis Prise en charge, Approuvée partiellement ou En litige
- Suspendue : peut être déclenché depuis Prise en charge, Approuvée partiellement ou En litige
- Refusée : peut être déclenché depuis n'importe quel statut. Est un statut définitif, on ne peut plus délencher aucun statut après avoir refusé une facture
- Paiement transmis : peut être déclenché depuis Mise à disposition, Prise en charge, Approuvée

### Enrichissement des exemples métiers

Mets à jour le jeu de données exemples avec tous ces cas métiers. Il faut au minimum une facture par statut.
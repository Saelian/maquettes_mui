Des modifications à effectuer sur la maquette @Ereporting.tsx

Sur la maquette en elle-même : 
- Retire la colonne Actions du tableau, elle est inutile. Il faut pouvoir continuer à consulter en cliquant sur les lignes juste
- Retire les colonnes Déclarant et SIREN Déclarant dans le tableau (il faut les conserver dans la modale de consultation par contre)
- Il faut préciser que "Données de factures/paiement de factures B2B" est en réalité "Données de factures/paiement de factures B2B internationales"
- Remplace la chip Type de flux par le libellé que l'on peut trouver dans le filtre type de flux mais en retirant le "Données de", sous ce format : 10.x - désignation. Exemple : 10.1 - Factures B2B internationales"
- Met la colonne type de flux en dernier


Il faut adapter le jeu de données fictives de la maquette @EReporting.tsx.

- Il faut majoritairement des déclarations initiales. Ne fait que 2 déclarations rectificatives / correctives / complémentaires
- l'emetteur et le déclarant doit tout le temps être le même : ACME Corporation France
- L'adresse électronique n'est pas une adresse mail, elle doit être tout le temps 0002:123456789
- Le code rôle est tout le temps SE
- Ne mets que des devises en EUR
- Tout le reste peut avoir un niveau d'aléatoire comme maintenant

 
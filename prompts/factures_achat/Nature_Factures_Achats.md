# Changement sur la modale des Factures d'achats

Ces changements concernent la maquette FacturesAchatiXfacture.

## Ajouter la nature dans les colonnes

La notion de nature permet de cloisonner des factures les unes des autres.

Lorsqu'une facture est réceptionnée, plusieurs actions sont mises en oeuvre : 
- Lecture de la facture
- extraction des données métiers
- Mise en place du routage de la facture vers la nature adaptée.

Ce routage est effectué selon des règles qui ont été mises en place par un administrateur. 
Selon les règles, les factures sont affectées à une (et une seule nature).
Voicu un exemple de règle : 
Si Fournisseur fait partie de Orange, Free, SFR, Bouygues alors Nature = Factures Téléphonie

Dès qu'une règle est trouvée valide pour la facture en cours de routage, les autres règles suivantes sont ignorées.

Pour cette maquette, nous utiliserons les natures exemples suivantes : 
- Factures_ERP1
- Factures_ERP2
- Factures_General

La notion de nature doit être mise en place dans les colonnes du tableau de la maquette Factures d'achat.

De plus, en consultant la facture, cette notion est présentée dans l'onglet "Informations".
# Natures

Cette demande concerne la maquette NaturesIXFacture pour laquelle juste le socle a été mis en place pour l'instant.
Cette maquette est une maquette liée au template AdminIxBus.

## Principe des natures

La notion de nature permet de cloisonner des factures les unes des autres.

Lorsqu'une facture est réceptionnée ou envoyée, plusieurs actions sont mises en oeuvre : 
- Lecture de la facture
- extraction des données métiers
- Mise en place du routage de la facture vers la nature adaptée

Ce routage est effectué selon des règles qui ont été mises en place par un administrateur. 
Selon les règles, les factures sont affectées à une (et une seule nature).

Voicu un exemple de règle : 
Si Code_Routage = 123456789_DSI alors Nature = Factures DSI

Dès qu'une règle est trouvée valide pour la facture en cours de routage, les autres règles suivantes sont ignorées.

Pour cette maquette, nous utiliserons les natures exemples suivantes : 
- Factures_ERP1 : Règle qui indique d'affecter cette nature si on trouve Code_Routage = 123456789_DSI
- Factures_ERP2 : Règle qui indique d'affecter cette nature si on trouve Code_Routage = 123456789_URB
- Factures_General : S'applique si aucune des règles ci-dessus s'applique

## Mise en place de la notion dans la maquette

Cette maquette doit permettre à l'administrateur de créer les natures, de les modifier / supprimer et de mettre en place les règles de routage.

Les règles de routage peuvent se baser soit sur les données métiers qui ont été extraites de la facture. 

Note : tu peux lire le contenu des maquettes MetadonnéesIXFacture et InterfacesIXFacture pour comprendre ce principe de règle, qui est un peu similaire à celui souhaité ici.
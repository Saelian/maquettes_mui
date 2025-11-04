# Nouvelle maquette
Nous allons maintenant mettre en place la maquette e-reporting.

## Contenu et but
Cette maquette représente le menu de suivi des flux e-reporting qui seront envoyés à la plateforme agréée.

Un flux e-reporting peut être de quatre types : 
- Données de factures (Flux 10.1)
- Données de paiement de facture (Flux 10.2)
- Données de transaction (Flux 10.3)
- Données de paiement de transaction (Flux 10.4)

## Définition des flux e-reporting

### Données de facture d’opérations internationales (Flux 10.1)
Le bloc de données de facture (10.1) permet de transmettre à l’administration les données des opérations internationales entre entreprises 100 (B2Bi, Bi2B et Bi2Bi) ayant donné lieu à une facture (F8).
Chaque occurrence du bloc de données de facture (10.1) correspond à une unique facture.

### Données de paiement des factures des opérations internationales (Flux 10.2)
Le bloc de données de paiement de facture (10.2) permet de transmettre à l’administration les données de paiement (statut « encaissée » - F6) ’opérations internationales entre entreprises (B2Bi, Bi2B et Bi2Bi) ayant donné lieu à une facture. 
Chaque occurrence du bloc de données de facture (10.2) correspond à l’encaissement d’une unique facture.

### Données des opérations avec des non assujettis
Le bloc de données de transaction (10.3) permet de transmettre à l’administration les données des opérations auprès de non-assujettis (B2C) qu’elles aient fait l’objet d’une facture électronique (de type F9) ou non.
Chaque occurrence du bloc de données de transaction (10.3) correspond à un jour d’activité, une devise et un type de transaction. En effet, le bloc de données de transaction (10.3) permet de transmettre les données agrégées de l’ensemble des transactions quotidiennes réalisées 103, et éventuellement les compléter des données de transaction relevant d’opération auprès de non-assujettis (B2C) ayant fait l’objet de factures (de type F9) émises le même jour.

### Données de paiement des opérations avec des non assujettis
Le bloc de données de paiement de transaction (10.4) permet de transmettre à l’administration les données à l’encaissement des opérations avec des non-assujettis (B2C), qu’elles aient fait l’objet d’une facture (de type F9) ou non. Chaque occurrence du bloc de données de transaction (10.4) correspond à un jour d’activité. En effet, le bloc de données de paiement de transaction (10.4) permet de transmettre l’ensemble des encaissements perçus104 au titre d’une journée.

## Construction de l'écran

L'écran doit permettre de visualiser en mode tableau les différents flux.

Dans le dossier ressources, tu trouveras un fichier ereporting.json qui représente de quoi sont constitués ces 4 types de flux.

Dans ce tableau qui présente les flux, on mettra comme colonnes celles qui sont communes aux 4 types de flux (racine).

Ensuite, on pourra cliquer sur chaque ligne, pour voir le détail des flux.

## Génération de données fictives

Tu devras également générer des données fictives pour chaque type de flux, basé sur la cohérence de la norme (fichier ereporting.json)





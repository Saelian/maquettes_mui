# Factures Électroniques - Documentation

Ce document décrit les nouvelles structures de données pour les factures électroniques conformes à la norme EN16931 et aux règles métier françaises (BR-FR).

## Vue d'ensemble

Le système de facturation électronique a été conçu pour respecter :

- **Norme européenne EN16931** : Standard européen pour les factures électroniques
- **Schematrons BR-FR** : Règles métier spécifiques à la France (norme XP Z12-012)
- **Formats supportés** : UBL 2.1 et CII (Cross Industry Invoice) utilisé par Factur-X
- **Profils** : BASIC WL, EN16931, EXTENDED

## Fichiers créés

### 1. Types TypeScript - `src/types/factureEN16931.ts`

Ce fichier contient tous les types TypeScript pour représenter une facture électronique :

#### Types de base
- `DateFacture` : Format AAAAMMJJ (années 2000-2099)
- `Montant` : Nombres avec 2 décimales maximum
- `Quantite` : Nombres avec 4 décimales maximum
- `PrixUnitaire` : Nombres avec 6 décimales maximum
- `Taux` : Pourcentages avec 2 décimales maximum
- `SIREN` : 9 chiffres
- `SIRET` : 14 chiffres (doit commencer par le SIREN)

#### Structures principales

**`AdressePostale`**
- Ligne 1, 2, 3
- Ville, code postal
- Subdivision du pays (région/département)
- Code pays ISO 3166-1 alpha-2 (OBLIGATOIRE)

**`Partie`** (vendeur, acheteur, etc.)
- Nom (OBLIGATOIRE)
- SIRET, SIREN, numéro de TVA
- Adresse postale (OBLIGATOIRE)
- Organisation légale
- Contact (nom, téléphone, email)
- Adresse électronique (identifiant de routage)

**`LigneFacture`**
- Numéro de ligne
- Article (nom, description, identifiants)
- Quantité et unité de mesure
- Prix unitaires (net et brut)
- Montant net
- Informations TVA
- Remises et frais au niveau ligne
- Période de facturation

**`FactureElectronique`** (structure complète)
- Informations générales (numéro, date, type, devise)
- Parties (vendeur, acheteur, bénéficiaire, représentant fiscal)
- Références (commande, contrat, projet, factures précédentes)
- Livraison
- Notes et mentions légales
- Pièces jointes
- Informations de paiement
- Remises et frais au niveau document
- Lignes de facture
- Totaux

### 2. Validation et règles métier - `src/utils/validationFacture.ts`

Ce fichier contient toutes les constantes, fonctions de validation et règles métier :

#### Constantes de validation

**Codes de type de document** (BR-FR-04)
```typescript
'380' // Facture
'381' // Avoir
'384' // Facture rectificative
'386' // Facture d'acompte
'389' // Autofacture
// ... et autres codes autorisés
```

**Modes de facturation** (BR-FR-08)
```typescript
'B1', 'S1', 'M1', 'B2', 'S2', 'M2',
'B4', 'S4', 'M4', 'S5', 'S6', 'B7', 'S7'
```

**Codes de traitement BAR** (BR-FR-20)
```typescript
'B2B'          // Business to Business
'B2BINT'       // Business to Business International
'B2C'          // Business to Consumer
'OUTOFSCOPE'   // Hors périmètre
'ARCHIVEONLY'  // Archive uniquement
```

**Codes de catégorie TVA** (BR-FR-15)
```typescript
'S'   // Taux standard
'E'   // Exonéré
'AE'  // Autoliquidation
'K'   // Intracommunautaire
'G'   // Export hors UE
'O'   // Hors champ
'Z'   // Taux zéro
```

**Taux de TVA autorisés en France** (BR-FR-16)
```typescript
0, 2.1, 5.5, 7, 8.5, 9.2, 9.6, 10, 13,
19.6, 20, 20.6, 0.9, 1.05, 1.75
```

**Codes de pièces jointes** (BR-FR-17)
```typescript
'RIB', 'LISIBLE', 'FEUILLE_DE_STYLE', 'PJA',
'BORDEREAU_SUIVI', 'DOCUMENT_ANNEXE', 'BON_LIVRAISON',
'BON_COMMANDE', 'BORDEREAU_SUIVI_VALIDATION',
'ETAT_ACOMPTE', 'FACTURE_PAIEMENT_DIRECT'
```

#### Fonctions de validation

**Validation de format**
- `validerFormatIdentifiant(id)` : BR-FR-01 & BR-FR-02 - Max 35 caractères, alphanumérique + - _ /
- `validerFormatDate(date)` : BR-FR-03 - Format AAAAMMJJ, années 2000-2099, validation des jours par mois et années bissextiles
- `validerFormatSIREN(siren)` : BR-FR-10 - 9 chiffres
- `validerCoherenceSIRETSIREN(siret, siren)` : BR-FR-09 - SIRET commence par SIREN

**Validation des décimales**
- `validerFormatMontant(montant)` : BR-FR-DEC-01 - 19 positions, 2 décimales
- `validerFormatQuantite(quantite)` : BR-FR-DEC-02 - 19 positions, 4 décimales
- `validerFormatPrixUnitaire(prix)` : BR-FR-DEC-03 - 19 positions, 6 décimales, positif
- `validerFormatTaux(taux)` : BR-FR-DEC-04 - 4 positions, 2 décimales, positif

**Validation des codes**
- `estCodeTypeDocumentValide(code)` : BR-FR-04
- `estModeFacturationValide(mode)` : BR-FR-08
- `estCodeEASValide(code)` : BR-FR-12
- `estCodeCategorieTVAValide(code)` : BR-FR-15
- `estTauxTVAValide(taux)` : BR-FR-16
- `estCodePieceJointeValide(code)` : BR-FR-17
- `estCodeTraitementBARValide(code)` : BR-FR-20

**Fonctions utilitaires**
- `formaterDateFacture(date)` : Convertit Date → AAAAMMJJ
- `parserDateFacture(dateStr)` : Convertit AAAAMMJJ → Date
- `arrondirMontant(montant)` : Arrondit à 2 décimales
- `arrondirQuantite(quantite)` : Arrondit à 4 décimales
- `arrondirPrixUnitaire(prix)` : Arrondit à 6 décimales
- `arrondirTaux(taux)` : Arrondit à 2 décimales

**Calculs**
- `calculerMontantNetLigne(quantite, prixUnitaire)` : Montant net = Quantité × Prix
- `calculerMontantTVA(montantBase, tauxTVA)` : TVA = Base × (Taux / 100)
- `calculerMontantTTC(montantHT, tauxTVA)` : TTC = HT + TVA

### 3. Données d'exemple - `src/utils/donneesExemplesFactures.ts`

Ce fichier contient des données d'exemple réalistes conformes aux normes :

#### Parties prédéfinies
- `VENDEUR_EXEMPLE` : SARL TECH SOLUTIONS (entreprise française)
- `ACHETEUR_EXEMPLE` : ACME SERVICES SAS (entreprise française)
- `PARTICULIER_EXEMPLE` : Martin Dupont (particulier)

#### Notes légales obligatoires
- `NOTES_LEGALES_FRANCE` : Les 3 mentions obligatoires (PMT, PMD, AAB) - BR-FR-05
  - Indemnité forfaitaire pour frais de recouvrement (40 EUR)
  - Pénalités de retard (9,27 % par an)
  - Escompte ou absence d'escompte
- `NOTE_TRAITEMENT_B2B` : Code BAR pour factures B2B
- `NOTE_TRAITEMENT_B2C` : Code BAR pour factures B2C

#### Lignes de facture types
- `LIGNE_PRESTATION_SERVICE` : 40 heures de développement web à 85 €/h
- `LIGNE_PRODUIT_MATERIEL` : 2 ordinateurs portables HP EliteBook
- `LIGNE_LICENCE_LOGICIELLE` : 10 licences annuelles
- `LIGNE_FORMATION` : Formation de 3 jours (TVA exonérée)
- `LIGNE_LIVRE` : Manuels techniques (TVA réduite 5,5%)

#### Factures complètes d'exemple

**`FACTURE_B2B_STANDARD`**
- Facture commerciale standard B2B
- 3 lignes : prestation, matériel, licences
- Montant total : 8 038,80 € TTC
- Paiement à 30 jours fin de mois

**`FACTURE_TVA_MIXTE`**
- Facture avec plusieurs taux de TVA
- TVA à 20% (matériel), exonérée (formation), et 5,5% (livres)
- Montre la gestion de multiples catégories de TVA

**`FACTURE_ACOMPTE`**
- Facture d'acompte (type 386)
- 30% du montant total du projet
- Référence au projet global

**`AVOIR_EXEMPLE`**
- Avoir pour retour produit
- Montants négatifs
- Référence à la facture originale

**`FACTURE_B2C_EXEMPLE`**
- Facture simplifiée pour particulier
- Paiement par carte bancaire (masquée)
- Montant déjà payé

## Règles métier françaises principales (BR-FR)

### BR-FR-01 & BR-FR-02 : Identifiants
- Maximum 35 caractères
- Caractères autorisés : A-Z, a-z, 0-9, +, -, _, /
- Pas d'espaces

### BR-FR-03 : Dates
- Format : AAAAMMJJ
- Années : 2000-2099
- Validation des jours selon les mois et années bissextiles

### BR-FR-04 : Type de document
- Codes autorisés : 380, 389, 393, 501, 386, 500, 384, 471, 472, 473, 261, 262, 381, 396, 502, 503

### BR-FR-05 : Mentions légales obligatoires
- PMT : Indemnité forfaitaire pour frais de recouvrement
- PMD : Pénalités de retard
- AAB : Escompte ou absence d'escompte

### BR-FR-06 : Unicité des codes sujets
- Chaque code sujet (PMT, PMD, AAB, TXD) ne doit apparaître qu'une seule fois

### BR-FR-08 : Mode de facturation
- Codes autorisés : B1, S1, M1, B2, S2, M2, B4, S4, M4, S5, S6, B7, S7

### BR-FR-09 : Cohérence SIRET/SIREN
- SIRET = 14 chiffres
- SIREN = 9 chiffres
- SIRET doit commencer par le SIREN

### BR-FR-10 : SIREN du vendeur
- Obligatoire
- 9 chiffres exactement

### BR-FR-11 : SIREN de l'acheteur
- Obligatoire si traitement BAR = 'B2B'
- 9 chiffres exactement

### BR-FR-12 & BR-FR-13 : Adresses électroniques
- BT-49 (acheteur) et BT-34 (vendeur) obligatoires
- schemeID doit être un code EAS valide

### BR-FR-15 : Catégories TVA
- Codes autorisés : S, E, AE, K, G, O, Z
- Codes L et M non pertinents en France

### BR-FR-16 : Taux de TVA
- Liste restreinte de taux autorisés en France
- Principaux taux : 0%, 2,1%, 5,5%, 10%, 20%

### BR-FR-17 : Pièces jointes
- Codes de qualification restreints
- Types : RIB, LISIBLE, FEUILLE_DE_STYLE, etc.

### BR-FR-18 : Document LISIBLE unique
- Un seul document avec description 'LISIBLE' autorisé

### BR-FR-20 : Traitement BAR
- Valeurs autorisées : B2B, B2BINT, B2C, OUTOFSCOPE, ARCHIVEONLY

### BR-FR-21 : BT-49 en B2B hors autofacture
- Si BAR = 'B2B' et document non autofacture
- BT-49 doit commencer par le SIREN (BT-47)
- schemeID = '0225'

### BR-FR-22 : BT-34 en B2B autofacture
- Si BAR = 'B2B' et document en autofacture
- BT-34 doit commencer par le SIREN (BT-30)
- schemeID = '0225'

### BR-FR-DEC-01 à DEC-04 : Formats décimaux
- **Montants** : 19 positions max, 2 décimales max
- **Quantités** : 19 positions max, 4 décimales max
- **Prix unitaires** : 19 positions max, 6 décimales max, positifs
- **Taux** : 4 positions max, 2 décimales max, positifs

## Utilisation dans les maquettes

Ces nouvelles structures de données doivent être utilisées dans les maquettes existantes et futures pour :

1. **Remplacement des données factices** : Utiliser les données d'exemple réalistes au lieu de données inventées
2. **Validation des entrées** : Utiliser les fonctions de validation lors de la saisie
3. **Calculs automatiques** : Utiliser les fonctions de calcul pour les totaux
4. **Respect des contraintes** : S'assurer que toutes les règles BR-FR sont respectées

### Exemple d'intégration

```typescript
import { FACTURE_B2B_STANDARD } from '@/utils/donneesExemplesFactures';
import { validerFormatDate, estTauxTVAValide } from '@/utils/validationFacture';

// Utiliser une facture d'exemple dans une maquette
function MaquetteFacture() {
  const [facture, setFacture] = useState(FACTURE_B2B_STANDARD);

  // Valider avant sauvegarde
  const valider = () => {
    if (!validerFormatDate(facture.dateEmission)) {
      alert('Format de date invalide');
      return false;
    }

    for (const tva of facture.totaux.detailsTVA) {
      if (tva.taux && !estTauxTVAValide(tva.taux)) {
        alert(`Taux de TVA invalide : ${tva.taux}%`);
        return false;
      }
    }

    return true;
  };

  // ...
}
```

## Prochaines étapes

1. **Intégration dans les maquettes existantes** : Remplacer les données factices par les nouvelles structures
2. **Création de maquettes spécialisées** :
   - Liste des factures
   - Détail d'une facture
   - Création/édition de facture
   - Validation et aperçu
   - Export XML (UBL et CII)
3. **Implémentation de la validation complète** : Créer un validateur complet qui vérifie toutes les règles BR-FR
4. **Tests visuels** : Créer des tests Playwright pour chaque type de facture

## Ressources

- **Dossier ressources/** : Contient les schematrons et XSD officiels
  - `schematrons/20250731_BR-FR-Flux2-Schematron-CII_V0.1.sch` : Règles BR-FR pour CII
  - `schematrons/20250731_BR-FR-Flux2-Schematron-UBL_V0.1.sch` : Règles BR-FR pour UBL
  - `schematrons/_EN16931_Schematrons_V14_CII_ET_UBL/` : Schematrons EN16931
  - `schematrons/2025_07_31_FNFE_SCHEMATRONS_FR_CTC_V0.1.pdf` : Documentation officielle

- **Normes** :
  - EN16931 : Norme européenne de facturation électronique
  - XP Z12-012 : Norme française (règles BR-FR)
  - UBL 2.1 : Universal Business Language
  - CII D22B : Cross Industry Invoice (UN/CEFACT)

- **Documentation externe** :
  - [FNFE-MPE](https://fnfe-mpe.org/) : Forum National de la Facture Électronique
  - [PEPPOL](https://peppol.eu/) : Réseau européen d'échange de documents
  - [Factur-X](https://fnfe-mpe.org/factur-x/) : Format hybride PDF/XML franco-allemand

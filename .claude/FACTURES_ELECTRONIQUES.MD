# Factures Électroniques - Référence Projet

## Vue d'ensemble

Le projet dispose maintenant de structures de données complètes pour les factures électroniques conformes aux normes européennes et françaises.

## Fichiers créés

### Types et structures
- **`src/types/factureEN16931.ts`** : Tous les types TypeScript pour les factures électroniques
  - Types de base (dates, montants, quantités, prix, SIREN, SIRET)
  - Structures (adresses, parties, lignes de facture, totaux)
  - Type principal : `FactureElectronique`

### Validation et règles métier
- **`src/utils/validationFacture.ts`** : Toutes les constantes et fonctions de validation
  - Constantes : codes autorisés (types de documents, modes de facturation, TVA, etc.)
  - Fonctions de validation de format
  - Fonctions de validation des codes
  - Fonctions utilitaires (formatage dates, arrondis, calculs)

### Données d'exemple
- **`src/utils/donneesExemplesFactures.ts`** : Données réalistes conformes aux normes
  - Parties prédéfinies (vendeur, acheteur, particulier)
  - Notes légales obligatoires en France
  - Lignes de facture types (prestations, produits, formations, etc.)
  - Factures complètes d'exemple (B2B, B2C, acompte, avoir, TVA mixte)

### Documentation
- **`FACTURES_ELECTRONIQUES.md`** : Documentation complète du système de facturation

## Normes respectées

### Norme européenne EN16931
- Standard européen pour les factures électroniques
- Business Terms (BT) numérotés
- Règles de calcul et de cohérence

### Règles métier françaises (BR-FR)
- Norme XP Z12-012
- Schematrons BR-FR pour CII et UBL
- Mentions légales obligatoires (PMT, PMD, AAB)
- Validations spécifiques (SIREN, SIRET, taux TVA français, etc.)

### Formats supportés
- **UBL 2.1** : Universal Business Language
- **CII D22B** : Cross Industry Invoice (utilisé par Factur-X)
- **Profils** : BASIC WL, EN16931, EXTENDED

## Règles importantes à respecter

### Identifiants (BR-FR-01 & BR-FR-02)
- Maximum 35 caractères
- Caractères autorisés : A-Z, a-z, 0-9, +, -, _, /
- Pas d'espaces

### Dates (BR-FR-03)
- Format : AAAAMMJJ
- Années : 2000-2099
- Validation des jours selon les mois et années bissextiles
- **Utiliser** : `formaterDateFacture(date)` et `parserDateFacture(dateStr)`

### SIREN et SIRET (BR-FR-09 & BR-FR-10)
- SIREN : 9 chiffres (obligatoire pour le vendeur)
- SIRET : 14 chiffres (doit commencer par le SIREN)
- **Valider avec** : `validerFormatSIREN()` et `validerCoherenceSIRETSIREN()`

### Mentions légales (BR-FR-05)
**3 notes obligatoires en France** :
1. **PMT** : Indemnité forfaitaire pour frais de recouvrement (40 EUR)
2. **PMD** : Pénalités de retard (taux légal)
3. **AAB** : Escompte ou absence d'escompte

**Utiliser** : `NOTES_LEGALES_FRANCE` du fichier donneesExemplesFactures.ts

### Code de traitement BAR (BR-FR-20)
**Obligatoire** - Définit le type de facture :
- **B2B** : Business to Business (entre entreprises)
- **B2BINT** : Business to Business International
- **B2C** : Business to Consumer (vers particulier)
- **OUTOFSCOPE** : Hors périmètre
- **ARCHIVEONLY** : Archive uniquement

**Utiliser** : `NOTE_TRAITEMENT_B2B` ou `NOTE_TRAITEMENT_B2C`

### TVA (BR-FR-15 & BR-FR-16)
**Catégories autorisées** : S, E, AE, K, G, O, Z (pas L ni M)

**Taux autorisés en France** :
- 0% : Exonéré
- 2,1% : Médicaments remboursables
- 5,5% : Livres, alimentation, etc.
- 10% : Restauration, transport de voyageurs
- 20% : Taux normal

**Valider avec** : `estCodeCategorieTVAValide()` et `estTauxTVAValide()`

### Décimales (BR-FR-DEC-01 à DEC-04)
- **Montants** : 19 positions max, 2 décimales max → `arrondirMontant()`
- **Quantités** : 19 positions max, 4 décimales max → `arrondirQuantite()`
- **Prix unitaires** : 19 positions max, 6 décimales max, positifs → `arrondirPrixUnitaire()`
- **Taux** : 4 positions max, 2 décimales max, positifs → `arrondirTaux()`

### Pièces jointes (BR-FR-17 & BR-FR-18)
- Codes autorisés : RIB, LISIBLE, FEUILLE_DE_STYLE, PJA, etc.
- **Un seul document avec description 'LISIBLE' autorisé**

## Utilisation dans les maquettes

### Import des données d'exemple

```typescript
import {
  FACTURE_B2B_STANDARD,
  FACTURE_TVA_MIXTE,
  FACTURE_ACOMPTE,
  AVOIR_EXEMPLE,
  FACTURE_B2C_EXEMPLE,
  VENDEUR_EXEMPLE,
  ACHETEUR_EXEMPLE,
  LIGNE_PRESTATION_SERVICE,
  NOTES_LEGALES_FRANCE
} from '@/utils/donneesExemplesFactures';
```

### Validation

```typescript
import {
  validerFormatDate,
  validerFormatSIREN,
  validerCoherenceSIRETSIREN,
  estTauxTVAValide,
  estCodeCategorieTVAValide
} from '@/utils/validationFacture';

// Validation d'une date
if (!validerFormatDate('20250115')) {
  console.error('Date invalide');
}

// Validation d'un taux de TVA
if (!estTauxTVAValide(20.0)) {
  console.error('Taux de TVA non autorisé');
}
```

### Calculs

```typescript
import {
  calculerMontantNetLigne,
  calculerMontantTVA,
  calculerMontantTTC,
  arrondirMontant
} from '@/utils/validationFacture';

// Calcul du montant net d'une ligne
const montantNet = calculerMontantNetLigne(10, 25.50); // 255.00

// Calcul de la TVA
const montantTVA = calculerMontantTVA(255.00, 20.0); // 51.00

// Calcul du TTC
const montantTTC = calculerMontantTTC(255.00, 20.0); // 306.00
```

## Maquettes à créer

Les maquettes suivantes devront utiliser ces structures :

1. **Liste des factures**
   - Tableau avec filtres (date, client, montant, statut)
   - Actions (voir détails, exporter, télécharger)

2. **Détail d'une facture**
   - Affichage complet de tous les champs
   - Respect de la mise en page légale
   - Export PDF et XML

3. **Création/édition de facture**
   - Formulaire avec validation en temps réel
   - Calculs automatiques
   - Suggestions de complétion

4. **Validation et aperçu**
   - Vérification de toutes les règles BR-FR
   - Aperçu avant envoi
   - Liste des erreurs/avertissements

5. **Export et transmission**
   - Export XML (UBL et CII/Factur-X)
   - Export PDF avec XML embarqué (Factur-X)
   - Envoi via réseau PEPPOL

## Ressources techniques

### Dossier ressources/
- `schematrons/` : Fichiers de validation officiels
  - `20250731_BR-FR-Flux2-Schematron-CII_V0.1.sch` : Règles BR-FR pour CII
  - `20250731_BR-FR-Flux2-Schematron-UBL_V0.1.sch` : Règles BR-FR pour UBL
  - `_EN16931_Schematrons_V14_CII_ET_UBL/` : Schematrons EN16931
  - `_CII_D22B_XSD/` : Schémas XSD pour CII
  - `_Factur-X_XSD_et_Schematrons_V1.7.3/` : Schematrons Factur-X
  - `2025_07_31_FNFE_SCHEMATRONS_FR_CTC_V0.1.pdf` : Documentation officielle

## Prochaines étapes

1. **Créer les maquettes de gestion de factures** en utilisant les données d'exemple
2. **Implémenter la validation complète** qui vérifie toutes les règles BR-FR
3. **Créer les exportateurs** XML (UBL et CII)
4. **Mettre en place les tests visuels** Playwright pour chaque type de facture
5. **Documenter les composants** réutilisables créés pour les factures

## Points d'attention

- **Toujours utiliser les données d'exemple** plutôt que d'inventer des données
- **Valider systématiquement** avec les fonctions fournies
- **Respecter les formats décimaux** (montants, quantités, prix, taux)
- **Inclure les 3 mentions légales obligatoires** (PMT, PMD, AAB)
- **Spécifier le code de traitement BAR** (B2B ou B2C)
- **Vérifier la cohérence SIREN/SIRET** pour toutes les parties
- **Un seul document LISIBLE** maximum par facture
- **Taux de TVA** uniquement ceux autorisés en France

## Liens utiles

- [FNFE-MPE](https://fnfe-mpe.org/) : Forum National de la Facture Électronique
- [PEPPOL](https://peppol.eu/) : Réseau européen d'échange de documents
- [Factur-X](https://fnfe-mpe.org/factur-x/) : Format hybride PDF/XML franco-allemand
- [EN16931](https://ec.europa.eu/digital-building-blocks/wikis/display/DIGITAL/Obtaining+a+copy+of+the+European+standard+on+eInvoicing) : Norme européenne

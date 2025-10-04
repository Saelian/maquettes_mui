# Projet Maquettes MUI

Projet de création de maquettes (mockups) pour divers produits, utilisant exclusivement **Material UI v7** avec **Vite** et **TypeScript**.

## 📋 Vue d'ensemble

Ce projet permet de créer et organiser des maquettes d'interfaces utilisateur de manière modulaire et maintenable. Il utilise un système de **templates** réutilisables et de **composants partagés** pour faciliter le développement.

### Technologies utilisées

- **React 18** avec TypeScript (mode strict)
- **Material UI v7** (@mui/material) avec Emotion pour le styling
- **Vite** pour le développement et le build
- **React Router** pour la navigation
- **TypeScript** avec options de compilation strictes
- **Playwright** pour les tests visuels

## 🚀 Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation des dépendances

```bash
npm install
```

## 💻 Commandes disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Vérifier les types TypeScript et imports
npm run typecheck

# Vérifier le code complet (TypeScript + ESLint) - RECOMMANDÉ
npm run lint

# Corriger automatiquement les erreurs ESLint
npm run lint:fix

# Builder pour la production (exécute d'abord la vérification TypeScript)
npm run build

# Prévisualiser le build de production
npm run preview

# Tests visuels avec Playwright - OBLIGATOIRE avant livraison
npm run test:visual           # Exécute les tests visuels
npm run test:visual:ui        # Interface de débogage Playwright
npm run test:visual:headed    # Tests avec navigateur visible
```

## 📁 Structure du projet

```
src/
├── composants/              # Composants réutilisables
│   └── navigation/          # Composants de navigation
│       ├── BoutonSommaire.tsx
│       ├── MenuLateral.tsx
│       ├── BarreApplication.tsx
│       └── LogoIxBus.tsx
├── templates/               # Templates de base réutilisables
│   └── UtilisateurIxBus.tsx    # Template avec menu Utilisateur
├── maquettes/               # TOUTES LES MAQUETTES
│   ├── PremierTest.tsx
│   ├── TableauDeBordIxfacture.tsx
│   ├── PrepareriXFacture.tsx
│   └── FacturesAchatiXfacture.tsx
├── types/                   # Types et interfaces partagés
│   ├── navigation.ts
│   └── modulesUtilisateurIxBus.tsx
├── utils/                   # Fonctions utilitaires
├── App.tsx                  # Sommaire principal avec routing
└── main.tsx                 # Point d'entrée de l'application

tests/                       # Tests visuels Playwright
├── *.visual.spec.ts         # Tests pour chaque maquette
└── screenshots/             # Captures d'écran de référence
```

## 🎨 Architecture

### Templates

Les **templates** sont des structures de base réutilisables qui définissent une disposition commune (AppBar, Drawer, zones de contenu).

#### Template UtilisateurIxBus

Fournit une structure avec :
- AppBar en haut de page
- Menu latéral Utilisateur (Drawer) rétractable à gauche
- Zone de contenu centrée avec fond blanc et ombre

**Utilisation dans une maquette :**

```tsx
import UtilisateurIxBus from '../templates/UtilisateurIxBus';

export default function MaMaquette() {
  return (
    <UtilisateurIxBus>
      {/* Votre contenu ici */}
    </UtilisateurIxBus>
  );
}
```

### Composants réutilisables

Les composants partagés sont stockés dans `src/composants/` et peuvent être utilisés dans plusieurs maquettes :

- **BoutonSommaire** : Bouton de retour au sommaire (en bas à gauche)
- **MenuLateral** : Menu latéral rétractable avec modules et sous-sections
- **BarreApplication** : Barre d'application en haut de page
- **LogoIxBus** : Logo affiché dans le menu latéral

### Créer une nouvelle maquette

1. Créer un nouveau fichier dans `src/maquettes/` (ex: `MaNouvelleMaquette.tsx`)
2. Choisir un template adapté ou créer une structure autonome
3. Utiliser le composant `BoutonSommaire` pour le retour au sommaire
4. Ajouter la maquette dans `src/App.tsx` :

```tsx
import MaNouvelleMaquette from './maquettes/MaNouvelleMaquette';

const maquettes = [
  // ...
  { nom: 'Ma Nouvelle Maquette', chemin: '/ma-maquette', composant: <MaNouvelleMaquette /> },
];
```

## ✅ Validation des maquettes

**Lors de la publication de nouvelles maquettes, tu DOIS TOUJOURS :**

### 1. Vérifier le code - OBLIGATOIRE AVANT TOUTE LIVRAISON
- **TOUJOURS exécuter `npm run lint` AVANT de créer un fichier de test**
- **TOUJOURS exécuter `npm run build` pour détecter les erreurs d'imports et de compilation**
- Corriger immédiatement toute erreur détectée
- Ne jamais publier avec des erreurs de linter, typecheck ou build
- ⚠️ **Le lint seul ne détecte pas toujours les imports incorrects - le build est OBLIGATOIRE**

### 2. Créer un test visuel spécifique pour la maquette
- Chaque maquette doit avoir son propre fichier de test : `tests/[nom-maquette].visual.spec.ts`
- Le test doit vérifier l'alignement de tous les éléments majeurs avec l'AppBar
- Prendre des captures d'écran pour référence
- Voir [tests/README.md](tests/README.md) pour la structure type d'un test

### 3. Vérifier visuellement l'alignement et l'apparence
- Exécuter `npm run test:visual` pour lancer les tests Playwright
- Le test doit passer sans erreur avant de livrer la maquette
- Si le test échoue, utiliser `npm run test:visual:ui` pour déboguer
- Les captures d'écran sont dans `tests/screenshots/`

### 4. Points de vérification visuels obligatoires
- ✅ Alignement horizontal de tous les conteneurs avec l'AppBar
- ✅ Espacement entre l'AppBar et le contenu principal (`mt: 2`)
- ✅ Tous les boutons/éléments fonctionnels sont visibles et accessibles
- ✅ Les marges et paddings sont cohérents

**Ordre des commandes OBLIGATOIRE pour valider une maquette :**
1. `npm run lint` - Vérifier TypeScript + ESLint
2. `npm run build` - **OBLIGATOIRE** pour détecter les imports incorrects et erreurs de compilation
3. `npm run test:visual` - Exécuter les tests visuels Playwright

**Autres commandes disponibles :**
- `npm run test:visual:ui` - Ouvre l'interface Playwright pour déboguer les tests
- `npm run test:visual:headed` - Exécute les tests avec navigateur visible
- `npx playwright test tests/[nom-maquette].visual.spec.ts` - Teste une maquette spécifique




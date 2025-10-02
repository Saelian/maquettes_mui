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

# Builder pour la production
npm run build

# Prévisualiser le build de production
npm run preview
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
│   ├── BaseIxbus.tsx
│   └── ...
├── types/                   # Types et interfaces partagés
│   ├── navigation.ts
│   └── modulesUtilisateurIxBus.tsx
├── utils/                   # Fonctions utilitaires
├── App.tsx                  # Sommaire principal avec routing
└── main.tsx                 # Point d'entrée de l'application
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

1. Créer un nouveau fichier dans `src/maquettes/` (ex: `MaNouvelleMAquette.tsx`)
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


## 🔗 Liens utiles

- [Documentation Material UI](https://mui.com/material-ui/)
- [Documentation Vite](https://vite.dev)
- [Documentation React Router](https://reactrouter.com/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)


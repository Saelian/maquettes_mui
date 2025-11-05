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

### Configuration du mot de passe

L'application est protégée par un mot de passe. Pour la configurer :

1. **Copier le fichier d'exemple** :
   ```bash
   cp .env.example .env
   ```

2. **Modifier le mot de passe** (optionnel) :
   ```bash
   # Éditer le fichier .env et changer la valeur
   VITE_APP_PASSWORD=votremotdepasse
   ```

   Par défaut, le mot de passe est : `maquettes2025`

3. **Démarrer l'application** :
   ```bash
   npm run dev
   ```

4. **Premier accès** :
   - Ouvrir l'application dans le navigateur
   - Saisir le mot de passe configuré
   - L'authentification sera enregistrée dans le localStorage
   - Vous n'aurez plus besoin de le saisir par la suite

⚠️ **Note de sécurité** : Ce système de protection est uniquement frontal et n'est pas sécurisé pour un environnement de production. Il est destiné à un usage interne et de démonstration uniquement.

### Réinitialiser l'authentification

Si vous souhaitez être redemandé le mot de passe :
1. Ouvrir les outils de développement du navigateur (F12)
2. Aller dans l'onglet "Application" ou "Stockage"
3. Supprimer la clé `maquettes_authentifie` du localStorage
4. Rafraîchir la page

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
│   ├── ProtectionMotDePasse.tsx  # Composant de protection par mot de passe
│   └── navigation/          # Composants de navigation
│       ├── BoutonSommaire.tsx
│       ├── MenuLateral.tsx
│       ├── BarreApplication.tsx
│       └── LogoIxBus.tsx
├── pages/                   # Pages principales
│   └── Accueil.tsx          # Page d'accueil avec disclaimer
├── templates/               # Templates de base réutilisables
│   ├── UtilisateurIxBus.tsx    # Template avec menu Utilisateur
│   └── AdminIxBus.tsx          # Template avec menu Administrateur
├── maquettes/               # TOUTES LES MAQUETTES
│   ├── TableauDeBordIxfacture.tsx
│   ├── PrepareriXFacture.tsx
│   ├── FacturesAchatiXfacture.tsx
│   └── ...
├── types/                   # Types et interfaces partagés
│   ├── navigation.ts
│   └── modulesUtilisateurIxBus.tsx
├── utils/                   # Fonctions utilitaires
├── App.tsx                  # Application principale avec routing
└── main.tsx                 # Point d'entrée de l'application

tests/                       # Tests visuels Playwright
├── *.visual.spec.ts         # Tests pour chaque maquette
└── screenshots/             # Captures d'écran de référence
```



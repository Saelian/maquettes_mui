# CLAUDE.md

Ce fichier contient les guides pour Claude Code (claude.ai/code) quand il travaille sur ce répertoire.

## IMPORTANT : Guidelines du projet

**TOUJOURS consulter et suivre les guidelines définies dans les fichiers du dossier `.claude/`**

Ces fichiers contiennent des informations cruciales sur l'objectif et l'organisation du projet.

## IMPORTANT : Langue du projet

**Tout le code, les commentaires, les noms de variables, les composants et la documentation de ce projet DOIVENT être en français.**

**Toutes les discussions avec Claude doivent être menées en français.**

## IMPORTANT : Encodage des fichiers

**Tous les fichiers du projet DOIVENT être encodés en UTF-8.**

Lors de la création ou modification de fichiers, toujours utiliser l'encodage UTF-8 pour garantir la compatibilité des caractères français (accents, cédilles, etc.).

## Vue d'ensemble du projet

Ce projet sert à créer des maquettes destinées à divers produits, en utilisant exclusivement Material UI (v7) avec Vite et TypeScript.

**Voir `.claude/PROJET.MD` pour plus de détails sur l'objectif et l'organisation du projet.**

## Technologies clés

- **React** avec TypeScript (mode strict activé)
- **Material UI v7** (@mui/material) avec Emotion pour le styling
- **Vite** pour le développement et le build
- **TypeScript** avec options de compilation strictes

## Commandes de développement

```bash
# Démarrer le serveur de développement
npm run dev

# Builder pour la production (exécute d'abord la vérification TypeScript)
npm run build

# Prévisualiser le build de production
npm run preview

# Vérifier uniquement les types TypeScript et imports
npm run typecheck

# Vérifier le code complet (TypeScript + ESLint) - RECOMMANDÉ
npm run lint

# Corriger automatiquement les erreurs ESLint (ne corrige pas les erreurs TypeScript)
npm run lint:fix
```

## IMPORTANT : Validation des maquettes

**Lors de la publication de nouvelles maquettes, tu DOIS TOUJOURS :**
1. Exécuter `npm run lint` pour vérifier qu'il n'y a aucune erreur TypeScript ou ESLint
   - Cette commande exécute automatiquement `npm run typecheck` puis ESLint
   - Le typecheck vérifie les imports, types et erreurs de compilation TypeScript
   - ESLint vérifie la qualité du code et les règles de style
2. Si des erreurs sont détectées, les corriger immédiatement
3. Ne jamais publier une maquette avec des erreurs de linter ou de typecheck

**Commandes disponibles :**
- `npm run typecheck` - Vérifie uniquement les types TypeScript et les imports
- `npm run lint` - Vérifie types TypeScript + ESLint (recommandé)
- `npm run lint:fix` - Corrige automatiquement les erreurs ESLint

## Architecture

### Point d'entrée
- `src/main.tsx` - Point d'entrée de l'application, rend le composant racine `App` avec React.StrictMode

### Structure des composants
- `src/App.tsx` - **Sommaire principal** listant toutes les maquettes et templates disponibles
- `src/templates/` - **Templates réutilisables** qui définissent des structures de base communes
  - `UtilisateurIxBus.tsx` - Template avec menu Utilisateur
  - `AdministrateurIxBus.tsx` - Template avec menu Administrateur (à créer)
- `src/composants/` - **Composants réutilisables** partagés entre plusieurs maquettes
- `src/maquettes/` - **TOUTES LES MAQUETTES** sont stockées ici (ex: `src/maquettes/MaquetteProduit.tsx`)
- `src/types/` - **Types et interfaces** partagés
  - `navigation.ts` - Interfaces Module, SousSection
  - `modulesUtilisateurIxBus.tsx` - Modules du menu Utilisateur
- Toutes les maquettes et templates doivent être référencés dans le sommaire App.tsx

### Modularisation et maintenabilité

**IMPORTANT : Les maquettes et templates ne sont pas mono-fichiers.**

Lors de la création de maquettes ou templates :
1. **Identifier les composants réutilisables** et les extraire dans `src/composants/`
2. **Découper les composants complexes** en sous-composants plus petits
3. **Créer des fichiers séparés** pour les types, interfaces et constantes si nécessaire
4. **Favoriser la réutilisation** plutôt que la duplication de code
5. **Documenter les composants réutilisables** avec des commentaires clairs

Organisation actuelle du projet :
```
src/
├── composants/
│   ├── navigation/
│   │   ├── BoutonSommaire.tsx
│   │   ├── MenuLateral.tsx
│   │   ├── BarreApplication.tsx
│   │   └── LogoIxBus.tsx
│   └── ...
├── templates/
│   └── UtilisateurIxBus.tsx
├── maquettes/              # TOUTES LES MAQUETTES ici
│   ├── PremierTest.tsx
│   ├── BaseIxbus.tsx
│   └── ...
├── types/
│   ├── navigation.ts
│   └── modulesUtilisateurIxBus.tsx
├── utils/
└── App.tsx
```

### Approche de styling
- Material UI utilise Emotion comme moteur de style par défaut (@emotion/react, @emotion/styled)
- Les composants utilisent la prop `sx` pour le styling inline
- Pas de configuration de thème personnalisé dans cette configuration de base

## Configuration TypeScript

Le projet utilise une configuration TypeScript séparée :
- `tsconfig.json` - Configuration racine référençant les configs app et node
- `tsconfig.app.json` - Configuration du code de l'application avec mode strict, pas de variables/paramètres non utilisés
- `tsconfig.node.json` - Types pour les fichiers de configuration Vite

Le mode bundler est activé pour la résolution de modules moderne.

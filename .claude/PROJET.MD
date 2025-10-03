# Projet Maquettes MUI

## Objectif du projet

Ce projet sert à créer des maquettes (mockups) destinées à divers produits. Toutes les maquettes doivent être réalisées **exclusivement avec Material UI (MUI)**.

## Structure du projet

### Fichier principal : App.tsx

Le fichier `src/App.tsx` sert de **sommaire** et liste toutes les maquettes et templates disponibles dans le projet. Il permet de naviguer entre les différentes maquettes et templates créés.

### Templates de maquettes

Les **templates** sont des structures de base réutilisables qui définissent une disposition commune (AppBar, Drawer, zones de contenu). Ils sont stockés dans le dossier `src/templates/`.

#### Template UtilisateurIxBus

Le template `UtilisateurIxBus` fournit une structure de base avec le **menu Utilisateur** :
- Une **AppBar** en haut de page
- Un **Drawer** (menu latéral Utilisateur rétractable) sur la gauche
- Une **zone de contenu** à droite du Drawer et en dessous de l'AppBar

Ce template est utilisé pour créer rapidement des maquettes ayant cette structure commune.

#### Template AdministrateurIxBus (à créer)

Un template similaire sera créé pour les maquettes avec le **menu Administrateur**.

### Organisation des maquettes

**IMPORTANT : Les maquettes doivent être placées dans le dossier `src/maquettes/`**

Pour chaque nouvelle maquette demandée :

1. **Vérifier s'il existe un template adapté** dans `src/templates/`
2. Si un template convient, **l'utiliser comme base** pour la nouvelle maquette
3. **Créer la maquette dans le dossier `src/maquettes/`** (ex: `src/maquettes/MaquetteProduit.tsx`)
4. **Référencer la maquette dans le sommaire** (`App.tsx`) pour permettre la navigation
5. **Utiliser uniquement les composants MUI** pour la construction de la maquette
6. La couleur Primary pour les composants MUI est le #008577
7. Utiliser le composant **BoutonSommaire** pour permettre le retour au sommaire
8. **IMPORTANT : Toujours utiliser `borderRadius: 0` sur tous les composants Paper, Box avec boxShadow, et autres conteneurs** pour garder des angles pointus cohérents avec l'AppBar et les zones de recherche

### Principes de développement

- Chaque maquette est **autonome** et peut fonctionner indépendamment
- Toutes les maquettes utilisent **Material UI** comme unique bibliothèque de composants
- Lorsque tu utilises des composants de formulaire **Material UI**, ils devront par défaut avoir la variante "standard" si elle existe
- Le code, les commentaires et la documentation sont **en français**
- Les noms de composants, variables et fonctions sont **en français**

### Architecture et modularisation

**IMPORTANT : Les maquettes et templates ne sont pas forcément mono-fichiers.**

#### Composants réutilisables

- **Créer des composants modulaires** qui peuvent être réutilisés dans plusieurs maquettes
- **Stocker les composants partagés** dans un dossier dédié (ex: `src/composants/`)
- **Favoriser la réutilisation** plutôt que la duplication de code

#### Maintenabilité du code

- **Modulariser le code** en séparant les responsabilités
- **Découper les composants complexes** en sous-composants plus petits et spécialisés
- **Créer des fichiers séparés** pour les interfaces, types, constantes, utilitaires
- **Orienter la production de code** pour qu'il soit le plus maintenable possible
- **Documenter les composants réutilisables** pour faciliter leur compréhension

#### Organisation recommandée

```
src/
├── composants/          # Composants réutilisables
│   ├── navigation/      # Composants de navigation (BoutonSommaire, MenuLateral, etc.)
│   ├── formulaires/     # Composants de formulaires
│   └── ...
├── templates/           # Templates de base
│   ├── UtilisateurIxBus.tsx      # Template avec menu Utilisateur
│   └── AdministrateurIxBus.tsx   # Template avec menu Administrateur (à créer)
├── maquettes/           # TOUTES LES MAQUETTES vont ici
│   ├── PremierTest.tsx
│   ├── BaseIxbus.tsx
│   └── ...
├── types/               # Types et interfaces partagés
│   ├── navigation.ts    # Interfaces Module, SousSection
│   └── modulesUtilisateurIxBus.tsx  # Modules du menu Utilisateur
├── utils/               # Fonctions utilitaires
└── App.tsx              # Sommaire principal
```

## Technologies utilisées

- React + TypeScript
- Material UI v7
- Vite (développement et build)
- Emotion (styling)

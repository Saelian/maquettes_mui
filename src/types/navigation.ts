import { ReactElement } from 'react';

/**
 * Types et interfaces pour les composants de navigation
 */

/**
 * Représente une sous-section d'un module dans le menu de navigation
 */
export interface SousSection {
  texte: string;
  icone: ReactElement;
  lien?: string; // Lien optionnel vers une maquette
}

/**
 * Représente un module dans le menu de navigation
 */
export interface Module {
  nom: string;
  icone: ReactElement;
  couleur: string;
  sousSections?: SousSection[];
}

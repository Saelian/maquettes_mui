/**
 * Types et interfaces pour les composants de navigation
 */

/**
 * Représente une sous-section d'un module dans le menu de navigation
 */
export interface SousSection {
  texte: string;
  icone: JSX.Element;
}

/**
 * Représente un module dans le menu de navigation
 */
export interface Module {
  nom: string;
  icone: JSX.Element;
  couleur: string;
  sousSections?: SousSection[];
}

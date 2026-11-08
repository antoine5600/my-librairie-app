/**
 * Ambiances de bibliothèque → couleurs appliquées à la scène 3D.
 * Chaque ambiance définit la palette complète de la pièce.
 */

export interface AmbianceDef {
  id: string
  label: string
  /** Couleur du fond de la pièce (mur) */
  fond: string
  /** Couleur du mur arrière-plan */
  mur: string
  /** Couleur du cadre de la bibliothèque */
  bois: string
  /** Teinte plus foncée pour le dessus */
  boisFonce: string
  /** Couleur des étagères */
  boisEtagere: string
  /** Couleur du fond de scène (CSS + WebGL) */
  sceneBg: string
  /** Teinte de la lumière ambiante */
  lumiere: string
  /** Intensité lumière ambiante */
  lumiereIntensity: number
}

export const AMBIANCES: Record<string, AmbianceDef> = {
  classique: {
    id: 'classique',
    label: 'Classique',
    fond: '#4f5a73',
    mur: '#4f5a73',
    bois: '#b77e68',
    boisFonce: '#8b6048',
    boisEtagere: '#c48f6f',
    sceneBg: '#4f5a73',
    lumiere: '#ffe4c4',
    lumiereIntensity: 0.25,
  },
  sombre: {
    id: 'sombre',
    label: 'Sombre',
    fond: '#37474f',
    mur: '#37474f',
    bois: '#4e342e',
    boisFonce: '#3e2723',
    boisEtagere: '#5d4037',
    sceneBg: '#37474f',
    lumiere: '#ffddbb',
    lumiereIntensity: 0.15,
  },
  clair: {
    id: 'clair',
    label: 'Clair',
    fond: '#ede0cc',
    mur: '#ede0cc',
    bois: '#a1887f',
    boisFonce: '#8d6e63',
    boisEtagere: '#bcaaa4',
    sceneBg: '#ede0cc',
    lumiere: '#ffedd5',
    lumiereIntensity: 0.35,
  },
  rustique: {
    id: 'rustique',
    label: 'Rustique',
    fond: '#6d8a6e',
    mur: '#6d8a6e',
    bois: '#8d6e63',
    boisFonce: '#6d4c41',
    boisEtagere: '#a1887f',
    sceneBg: '#6d8a6e',
    lumiere: '#fef3c7',
    lumiereIntensity: 0.3,
  },
}

export function getAmbiance(id: string): AmbianceDef {
  return AMBIANCES[id] || AMBIANCES.classique
}

export const AMBIANCE_LIST = Object.keys(AMBIANCES)
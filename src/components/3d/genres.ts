/**
 * Catalogue des genres littéraires → couleur de livre (dos visible dans la bibliothèque).
 *
 * Chaque genre a une couleur de base et une teinte alternative (légère variation),
 * pour éviter des dos tous identiques au sein d'un même genre.
 */

export type GenreId =
  | 'polar'
  | 'fantastique'
  | 'sf'
  | 'classique'
  | 'fantasy'
  | 'romance'
  | 'aventure'
  | 'horreur'
  | 'historique'
  | 'philosophie'
  | 'biographie'
  | 'drame'
  | 'jeunesse'
  | 'thriller'

export interface GenreDef {
  id: GenreId
  label: string
  color: string
  altColor: string
}

export const GENRES: Record<GenreId, GenreDef> = {
  polar:      { id: 'polar',      label: 'Polar',      color: '#8e3328', altColor: '#a03a2c' },
  fantastique:{ id: 'fantastique',label: 'Fantastique',color: '#6c5ce7', altColor: '#7c6df0' },
  sf:         { id: 'sf',         label: 'Science-fiction', color: '#1f6feb', altColor: '#2f7ffb' },
  classique:  { id: 'classique',  label: 'Classique',  color: '#8b6048', altColor: '#9c6f4f' },
  fantasy:    { id: 'fantasy',    label: 'Fantasy',    color: '#2e8b57', altColor: '#3fa06a' },
  romance:    { id: 'romance',    label: 'Romance',    color: '#d4638a', altColor: '#e0719b' },
  aventure:   { id: 'aventure',   label: 'Aventure',   color: '#d97706', altColor: '#e0861f' },
  horreur:    { id: 'horreur',    label: 'Horreur',    color: '#7f1d1d', altColor: '#8f2222' },
  historique: { id: 'historique', label: 'Historique', color: '#b8860b', altColor: '#c99617' },
  philosophie:{ id: 'philosophie',label: 'Philosophie',color: '#6b7280', altColor: '#7c8492' },
  biographie: { id: 'biographie', label: 'Biographie', color: '#0e7490', altColor: '#1289ab' },
  drame:      { id: 'drame',      label: 'Drame',      color: '#475569', altColor: '#56657c' },
  jeunesse:   { id: 'jeunesse',   label: 'Jeunesse',   color: '#38bdf8', altColor: '#4ac3fa' },
  thriller:   { id: 'thriller',   label: 'Thriller',   color: '#374151', altColor: '#454f5e' },
}

export const GENRE_LIST = Object.values(GENRES)

/** Retourne la couleur d'un genre, en alternant base/alt pour varier les dos */
export function genreColor(genre: GenreId, variation: number): string {
  const def = GENRES[genre]
  if (!def) return '#6b7280'
  return variation % 2 === 0 ? def.color : def.altColor
}
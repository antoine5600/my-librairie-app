export interface Book3D {
  id: string
  title: string
  author: string
  /** Genre littéraire (polar, fantastique, sf, classique, romance, aventure, horreur, historique, philosophie, biographie, drame) */
  genre: string
  /** Width = épaisseur du livre */
  thickness: number
  /** Height = hauteur du livre */
  height: number
  /** Couleur de la couverture (dérivée du genre, mais peut être personnalisée) */
  coverColor: string
  /** Position sur l'étagère { shelf: index 0-3, order: position sur l'étagère } */
  shelf: number
  order: number
}
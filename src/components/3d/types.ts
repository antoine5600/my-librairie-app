export interface Book3D {
  id: string
  title: string
  author: string
  /** Width = épaisseur du livre */
  thickness: number
  /** Height = hauteur du livre */
  height: number
  /** Couleur de la couverture */
  coverColor: string
  /** Position sur l'étagère { shelf: index 0-3, order: position sur l'étagère } */
  shelf: number
  order: number
}
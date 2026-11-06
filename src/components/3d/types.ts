export interface Book3D {
  id: string
  title: string
  author: string
  /** Genre littéraire */
  genre: string
  /** Width = épaisseur du livre */
  thickness: number
  /** Height = hauteur du livre */
  height: number
  /** Couleur de la couverture (dérivée du genre) */
  coverColor: string
  /** Position sur l'étagère */
  shelf: number
  order: number
  /** Position X libre (réelle, pas un index) */
  positionX?: number
  /** ID de l'association dans livres_bibliotheques (pour suppression/prêt) */
  associationId?: number
  /** Statut : present | prete */
  statut?: string
  /** Nom de l'emprunteur si prêté */
  emprunteur?: string | null
}
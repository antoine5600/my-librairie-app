import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// ---------- Bibliothèques ----------
export const bibliotheques = sqliteTable('bibliotheques', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nom: text('nom').notNull(),
  slug: text('slug').notNull().unique(),
  ambiance: text('ambiance').notNull().default('classique'), // classique, sombre, clair, rustique
  created_at: text('created_at').notNull().default("(datetime('now'))"),
})

// ---------- Livres ----------
export const livres = sqliteTable('livres', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titre: text('titre').notNull(),
  auteur: text('auteur').notNull(),
  genre: text('genre').notNull().default('classique'),
  isbn: text('isbn'),
  couverture_url: text('couverture_url'),
  /** Hauteur du livre en unités 3D */
  hauteur: real('hauteur').notNull().default(2.0),
  /** Épaisseur du livre en unités 3D */
  epaisseur: real('epaisseur').notNull().default(0.6),
  /** Couleur du dos (hex) — dérivée du genre mais personnalisable */
  couleur_dos: text('couleur_dos').notNull().default('#6b7280'),
  created_at: text('created_at').notNull().default("(datetime('now'))"),
})

// ---------- Association livres ↔ bibliothèques ----------
export const livresBibliotheques = sqliteTable('livres_bibliotheques', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  livre_id: integer('livre_id').notNull().references(() => livres.id, { onDelete: 'cascade' }),
  bibliotheque_id: integer('bibliotheque_id').notNull().references(() => bibliotheques.id, { onDelete: 'cascade' }),
  etagere: integer('etagere').notNull().default(0),
  position_x: real('position_x').notNull().default(0),
  position_y: real('position_y').notNull().default(0),
  statut: text('statut').notNull().default('present'),
  emprunteur: text('emprunteur'),
  created_at: text('created_at').notNull().default("(datetime('now'))"),
})

// ---------- Relations ----------
export const bibliothequesRelations = relations(bibliotheques, ({ many }) => ({
  livresBibliotheques: many(livresBibliotheques),
}))

export const livresRelations = relations(livres, ({ many }) => ({
  livresBibliotheques: many(livresBibliotheques),
}))

export const livresBibliothequesRelations = relations(livresBibliotheques, ({ one }) => ({
  livre: one(livres, {
    fields: [livresBibliotheques.livre_id],
    references: [livres.id],
  }),
  bibliotheque: one(bibliotheques, {
    fields: [livresBibliotheques.bibliotheque_id],
    references: [bibliotheques.id],
  }),
}))
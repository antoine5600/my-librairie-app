/**
 * Crée les tables si elles n'existent pas.
 * Utilisable via `npm run db:init`.
 */
import { sql } from 'drizzle-orm'
import { db } from './index'
import path from 'path'
import fs from 'fs'

async function main() {
  // Créer le dossier data/ s'il n'existe pas (nécessaire sur Windows/machine fraîche)
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
    console.log(`📁 Dossier créé : ${dataDir}`)
  }
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS bibliotheques (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nom        TEXT NOT NULL,
      slug       TEXT NOT NULL UNIQUE,
      ambiance   TEXT NOT NULL DEFAULT 'classique',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS livres (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      titre          TEXT NOT NULL,
      auteur         TEXT NOT NULL,
      genre          TEXT NOT NULL DEFAULT 'classique',
      isbn           TEXT,
      couverture_url TEXT,
      hauteur        REAL NOT NULL DEFAULT 2.0,
      epaisseur      REAL NOT NULL DEFAULT 0.6,
      couleur_dos    TEXT NOT NULL DEFAULT '#6b7280',
      created_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS livres_bibliotheques (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      livre_id        INTEGER NOT NULL REFERENCES livres(id) ON DELETE CASCADE,
      bibliotheque_id INTEGER NOT NULL REFERENCES bibliotheques(id) ON DELETE CASCADE,
      etagere         INTEGER NOT NULL DEFAULT 0,
      position_x      REAL NOT NULL DEFAULT 0,
      position_y      REAL NOT NULL DEFAULT 0,
      created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  console.log('✅ Tables créées avec succès.')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erreur :', err)
  process.exit(1)
})
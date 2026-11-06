/**
 * Ajoute les colonnes nécessaires à la fonctionnalité de prêt.
 * Exécuter : npx tsx src/lib/db/migrate-prets.ts
 */
import { db } from './index'

async function main() {
  // SQLite ne supporte pas IF NOT EXISTS pour ALTER TABLE,
  // on ignore l'erreur si la colonne existe déjà.
  for (const col of ['statut', 'emprunteur']) {
    try {
      await db.run(`ALTER TABLE livres_bibliotheques ADD COLUMN ${col} TEXT`)
      console.log(`  ✅ Colonne '${col}' ajoutée`)
    } catch {
      console.log(`  ℹ️  Colonne '${col}' déjà présente`)
    }
  }

  // Valeur par défaut pour les lignes existantes
  await db.run(`UPDATE livres_bibliotheques SET statut = 'present' WHERE statut IS NULL`)

  // Ajouter capacite_max à la table bibliotheques
  try {
    await db.run(`ALTER TABLE bibliotheques ADD COLUMN capacite_max INTEGER NOT NULL DEFAULT 50`)
    console.log('  ✅ Colonne capacite_max ajoutée')
  } catch {
    console.log('  ℹ️  Colonne capacite_max déjà présente')
  }

  console.log('✅ Migration prêts terminée.')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erreur :', err)
  process.exit(1)
})
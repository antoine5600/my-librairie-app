/**
 * Peuple la base avec les 34 livres exemples + une bibliothèque par défaut.
 * Utilisable via `npm run db:seed`.
 */
import { db, schema } from './index'
import { genreColor, GENRES, GENRE_LIST } from '../../components/3d/genres'
import type { GenreId } from '../../components/3d/genres'

type BookSeed = {
  titre: string
  auteur: string
  genre: GenreId
  hauteur: number
  epaisseur: number
  order: number
  shelf: number
}

const BOOKS: BookSeed[] = [
  { titre: 'Le Petit Prince', auteur: 'Antoine de Saint-Exupéry', genre: 'classique', epaisseur: 0.5, hauteur: 1.8, shelf: 0, order: 0 },
  { titre: '1984', auteur: 'George Orwell', genre: 'sf', epaisseur: 0.7, hauteur: 2.0, shelf: 0, order: 1 },
  { titre: 'Dune', auteur: 'Frank Herbert', genre: 'sf', epaisseur: 0.9, hauteur: 2.2, shelf: 0, order: 2 },
  { titre: 'Fondation', auteur: 'Isaac Asimov', genre: 'sf', epaisseur: 0.6, hauteur: 2.0, shelf: 0, order: 3 },
  { titre: 'Le Seigneur des Anneaux', auteur: 'J.R.R. Tolkien', genre: 'fantasy', epaisseur: 1.0, hauteur: 2.4, shelf: 0, order: 4 },
  { titre: 'Harry Potter', auteur: 'J.K. Rowling', genre: 'fantastique', epaisseur: 0.8, hauteur: 2.1, shelf: 0, order: 5 },
  { titre: 'Orgueil et Préjugés', auteur: 'Jane Austen', genre: 'romance', epaisseur: 0.5, hauteur: 1.8, shelf: 0, order: 6 },
  { titre: 'Gatsby le Magnifique', auteur: 'F. Scott Fitzgerald', genre: 'drame', epaisseur: 0.5, hauteur: 1.7, shelf: 0, order: 7 },
  { titre: 'Brave New World', auteur: 'Aldous Huxley', genre: 'sf', epaisseur: 0.6, hauteur: 2.0, shelf: 0, order: 8 },
  { titre: 'The Hobbit', auteur: 'J.R.R. Tolkien', genre: 'aventure', epaisseur: 0.7, hauteur: 2.1, shelf: 1, order: 0 },
  { titre: 'Neuromancien', auteur: 'William Gibson', genre: 'sf', epaisseur: 0.5, hauteur: 1.9, shelf: 1, order: 1 },
  { titre: 'Le Comte de Monte-Cristo', auteur: 'Alexandre Dumas', genre: 'aventure', epaisseur: 1.0, hauteur: 2.3, shelf: 1, order: 2 },
  { titre: 'Les Trois Mousquetaires', auteur: 'Alexandre Dumas', genre: 'aventure', epaisseur: 0.8, hauteur: 2.1, shelf: 1, order: 3 },
  { titre: 'Blade Runner', auteur: 'Philip K. Dick', genre: 'sf', epaisseur: 0.5, hauteur: 1.7, shelf: 1, order: 4 },
  { titre: "L'Étranger", auteur: 'Albert Camus', genre: 'philosophie', epaisseur: 0.4, hauteur: 1.8, shelf: 1, order: 5 },
  { titre: 'La Peste', auteur: 'Albert Camus', genre: 'drame', epaisseur: 0.5, hauteur: 1.9, shelf: 1, order: 6 },
  { titre: 'Les Misérables', auteur: 'Victor Hugo', genre: 'classique', epaisseur: 1.2, hauteur: 2.5, shelf: 1, order: 7 },
  { titre: 'Le Nom de la Rose', auteur: 'Umberto Eco', genre: 'historique', epaisseur: 0.7, hauteur: 2.1, shelf: 2, order: 0 },
  { titre: 'Cent ans de solitude', auteur: 'Gabriel García Márquez', genre: 'classique', epaisseur: 0.6, hauteur: 2.0, shelf: 2, order: 1 },
  { titre: 'La Guerre des Mondes', auteur: 'H.G. Wells', genre: 'sf', epaisseur: 0.5, hauteur: 1.9, shelf: 2, order: 2 },
  { titre: '20 000 lieues sous les mers', auteur: 'Jules Verne', genre: 'aventure', epaisseur: 0.7, hauteur: 2.1, shelf: 2, order: 3 },
  { titre: 'Dracula', auteur: 'Bram Stoker', genre: 'horreur', epaisseur: 0.6, hauteur: 2.0, shelf: 2, order: 4 },
  { titre: 'Frankenstein', auteur: 'Mary Shelley', genre: 'horreur', epaisseur: 0.6, hauteur: 2.0, shelf: 2, order: 5 },
  { titre: 'Jane Eyre', auteur: 'Charlotte Brontë', genre: 'classique', epaisseur: 0.7, hauteur: 2.1, shelf: 2, order: 6 },
  { titre: 'Crime et Châtiment', auteur: 'Fiodor Dostoïevski', genre: 'drame', epaisseur: 0.9, hauteur: 2.3, shelf: 2, order: 7 },
  { titre: 'Moby Dick', auteur: 'Herman Melville', genre: 'aventure', epaisseur: 0.8, hauteur: 2.2, shelf: 2, order: 8 },
  { titre: 'La Ferme des Animaux', auteur: 'George Orwell', genre: 'classique', epaisseur: 0.4, hauteur: 1.6, shelf: 3, order: 0 },
  { titre: 'Sa Majesté des Mouches', auteur: 'William Golding', genre: 'drame', epaisseur: 0.5, hauteur: 1.8, shelf: 3, order: 1 },
  { titre: 'Le Vieil Homme et la Mer', auteur: 'Ernest Hemingway', genre: 'classique', epaisseur: 0.4, hauteur: 1.7, shelf: 3, order: 2 },
  { titre: 'Autant en emporte le vent', auteur: 'Margaret Mitchell', genre: 'romance', epaisseur: 1.0, hauteur: 2.3, shelf: 3, order: 3 },
  { titre: 'Les Hauts de Hurlevent', auteur: 'Emily Brontë', genre: 'classique', epaisseur: 0.6, hauteur: 2.0, shelf: 3, order: 4 },
  { titre: "Tess d'Urberville", auteur: 'Thomas Hardy', genre: 'drame', epaisseur: 0.7, hauteur: 2.1, shelf: 3, order: 5 },
  { titre: 'Le Parfum', auteur: 'Patrick Süskind', genre: 'historique', epaisseur: 0.5, hauteur: 2.0, shelf: 3, order: 6 },
  { titre: 'Le Pendule de Foucault', auteur: 'Umberto Eco', genre: 'thriller', epaisseur: 0.7, hauteur: 2.2, shelf: 3, order: 7 },
]

async function main() {
  // 1. Créer la bibliothèque par défaut
  const biblioInsert = db.insert(schema.bibliotheques)
    .values({ nom: 'Ma bibliothèque', slug: 'ma-bibliotheque', ambiance: 'classique' })
    .returning()

  const biblio = await biblioInsert
  const biblioId = biblio[0]!.id
  console.log(`✅ Bibliothèque créée : "${biblio[0]!.nom}" (id=${biblioId})`)

  // 2. Insérer tous les livres
  for (const book of BOOKS) {
    const couleur = genreColor(book.genre, book.order)

    const livreInsert = db.insert(schema.livres)
      .values({
        titre: book.titre,
        auteur: book.auteur,
        genre: book.genre,
        hauteur: book.hauteur,
        epaisseur: book.epaisseur,
        couleur_dos: couleur,
      })
      .returning()

    const livre = await livreInsert
    const livreId = livre[0]!.id

    // 3. Associer à la bibliothèque
    await db.insert(schema.livresBibliotheques).values({
      livre_id: livreId,
      bibliotheque_id: biblioId,
      etagere: book.shelf,
      position_x: book.order * 0.6,
      position_y: 0,
    })
  }

  console.log(`✅ ${BOOKS.length} livres insérés et associés à la bibliothèque.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erreur :', err)
  process.exit(1)
})
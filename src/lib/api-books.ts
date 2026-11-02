/**
 * Wrapper Google Books API.
 * Nécessite une clé API Google Books activée dans Google Cloud Console.
 * https://console.cloud.google.com/apis/library/books/v1
 *
 * Free tier : 1 000 requêtes / jour.
 */

const API_BASE = 'https://www.googleapis.com/books/v1'

function getApiKey(): string {
  return process.env.GOOGLE_BOOKS_API_KEY || ''
}

export interface BookSuggestion {
  titre: string
  auteur: string
  isbn?: string
  couverture_url?: string
  resume?: string
  pages?: number
  editeur?: string
}

/** Nettoie une chaîne des caractères invisibles */
function clean(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

/** Extrait l'ISBN des identifiants du volume */
function extractIsbn(identifiers: Array<{ type: string; identifier: string }> | undefined): string | undefined {
  if (!identifiers) return undefined
  const isbn13 = identifiers.find(i => i.type === 'ISBN_13')
  if (isbn13) return isbn13.identifier
  const isbn10 = identifiers.find(i => i.type === 'ISBN_10')
  return isbn10?.identifier
}

/**
 * Cherche des livres sur Google Books.
 * Retourne un tableau de suggestions pour l'auto-complétion.
 */
export async function searchBooks(query: string): Promise<BookSuggestion[]> {
  if (query.length < 2) return []

  const key = getApiKey()
  const url = `${API_BASE}/volumes?q=${encodeURIComponent(query)}&langRestrict=fr&maxResults=8${key ? `&key=${key}` : ''}`

  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`Google Books API error: ${res.status} ${res.statusText}`)
    return []
  }

  const data = await res.json() as { items?: Array<{
    volumeInfo: {
      title?: string
      authors?: string[]
      industryIdentifiers?: Array<{ type: string; identifier: string }>
      imageLinks?: { thumbnail?: string }
      description?: string
      pageCount?: number
      publisher?: string
    }
  }> }

  if (!data.items) return []

  return data.items.map((item) => {
    const v = item.volumeInfo
    return {
      titre: clean(v.title || 'Sans titre'),
      auteur: v.authors?.map(clean).join(', ') || 'Auteur inconnu',
      isbn: extractIsbn(v.industryIdentifiers),
      couverture_url: v.imageLinks?.thumbnail?.replace('http:', 'https:'),
      resume: v.description ? clean(v.description.slice(0, 500)) : undefined,
      pages: v.pageCount,
      editeur: v.publisher,
    }
  })
}

/**
 * Récupère les infos d'un livre par ISBN.
 */
export async function getBookByIsbn(isbn: string): Promise<BookSuggestion | null> {
  const key = getApiKey()
  const url = `${API_BASE}/volumes?q=isbn:${isbn}${key ? `&key=${key}` : ''}`

  const res = await fetch(url)
  if (!res.ok) return null

  const data = await res.json() as { items?: Array<{ volumeInfo: any }> }
  if (!data.items?.[0]) return null

  const v = data.items[0].volumeInfo
  return {
    titre: clean(v.title || 'Sans titre'),
    auteur: v.authors?.map(clean).join(', ') || 'Auteur inconnu',
    isbn: extractIsbn(v.industryIdentifiers),
    couverture_url: v.imageLinks?.thumbnail?.replace('http:', 'https:'),
    resume: v.description ? clean(v.description.slice(0, 500)) : undefined,
    pages: v.pageCount,
    editeur: v.publisher,
  }
}

/** Dimensions 3D par défaut selon le nombre de pages */
export function guessDimensions(pages?: number): { hauteur: number; epaisseur: number } {
  if (!pages) return { hauteur: 2.0, epaisseur: 0.6 }
  // Ratio approximatif : plus de pages → livre plus épais et plus haut
  const epaisseur = Math.max(0.3, Math.min(1.5, pages * 0.004))
  const hauteur = Math.max(1.5, Math.min(2.8, pages * 0.012))
  return { hauteur: Math.round(hauteur * 10) / 10, epaisseur: Math.round(epaisseur * 10) / 10 }
}
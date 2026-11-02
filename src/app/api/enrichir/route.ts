import { NextResponse } from 'next/server'
import { searchBooks, getBookByIsbn } from '@/lib/api-books'

// GET /api/enrichir?q=...  — recherche Google Books (auto-complétion)
// GET /api/enrichir?isbn=...  — recherche par ISBN
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const isbn = searchParams.get('isbn')

  if (isbn) {
    const book = await getBookByIsbn(isbn)
    if (!book) {
      return NextResponse.json({ suggestions: [] })
    }
    return NextResponse.json({ suggestions: [book] })
  }

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const suggestions = await searchBooks(query)
  return NextResponse.json({ suggestions })
}
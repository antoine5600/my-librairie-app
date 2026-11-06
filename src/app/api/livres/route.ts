import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'

// GET /api/livres — liste tous les livres
//   ?bibliotheque_id=N  → livres d'une bibliothèque
//   ?q=...              → recherche globale (titre) avec bibliothèques
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bibliothequeId = searchParams.get('bibliotheque_id')
  const query = searchParams.get('q')

  // Recherche globale
  if (query && query.length >= 2) {
    const pattern = `%${query}%`
    const livres = await db.query.livres.findMany({
      where: (l, { like, or }) => or(like(l.titre, pattern), like(l.auteur, pattern)),
      orderBy: (l, { asc }) => [asc(l.titre)],
    })

    // Pour chaque livre, trouver ses bibliothèques
    const result = await Promise.all(livres.map(async (livre) => {
      const assoc = await db.query.livresBibliotheques.findMany({
        where: (lb, { eq }) => eq(lb.livre_id, livre.id),
        with: { bibliotheque: true },
      })
      return {
        ...livre,
        bibliotheques: assoc.map((a) => ({
          id: a.bibliotheque.id,
          nom: a.bibliotheque.nom,
          ambiance: a.bibliotheque.ambiance,
          association_id: a.id,
        })),
      }
    }))

    return NextResponse.json({ livres: result })
  }

  if (bibliothequeId) {
    const id = Number(bibliothequeId)
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: 'ID invalide.' }, { status: 400 })
    }
    const assoc = await db.query.livresBibliotheques.findMany({
      where: (lb, { eq }) => eq(lb.bibliotheque_id, id),
      with: { livre: true },
    })
    const livres = assoc.map((a) => ({
      ...a.livre,
      etagere: a.etagere,
      position_x: a.position_x,
      position_y: a.position_y,
      association_id: a.id,
    }))
    return NextResponse.json({ livres })
  }

  const livres = await db.query.livres.findMany({
    orderBy: (l, { asc }) => [asc(l.titre)],
  })
  return NextResponse.json({ livres })
}

// POST /api/livres — ajoute un livre
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)

  if (!body?.titre || typeof body.titre !== 'string' || body.titre.trim() === '') {
    return NextResponse.json({ error: 'Le titre est requis.' }, { status: 400 })
  }

  const inserted = await db.insert(schema.livres)
    .values({
      titre: body.titre.trim(),
      auteur: (body.auteur as string)?.trim() || 'Auteur inconnu',
      genre: (body.genre as string) || 'classique',
      isbn: body.isbn || null,
      couverture_url: body.couverture_url || null,
      hauteur: typeof body.hauteur === 'number' ? body.hauteur : 2.0,
      epaisseur: typeof body.epaisseur === 'number' ? body.epaisseur : 0.6,
      couleur_dos: body.couleur_dos || '#6b7280',
    })
    .returning()

  return NextResponse.json({ livre: inserted[0] }, { status: 201 })
}
import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'

// GET /api/bibliotheques — liste toutes les bibliothèques (avec compte de livres)
export async function GET() {
  const bibliotheques = await db.query.bibliotheques.findMany({
    orderBy: (b, { asc }) => [asc(b.nom)],
  })

  // Compter les livres par bibliothèque
  const result = await Promise.all(
    bibliotheques.map(async (b) => {
      const livres = await db.query.livresBibliotheques.findMany({
        where: (lb, { eq }) => eq(lb.bibliotheque_id, b.id),
      })
      return { ...b, nombre_livres: livres.length }
    })
  )

  return NextResponse.json({ bibliotheques: result })
}

// POST /api/bibliotheques — crée une bibliothèque
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)

  if (!body?.nom || typeof body.nom !== 'string' || body.nom.trim() === '') {
    return NextResponse.json({ error: 'Le nom de la bibliothèque est requis.' }, { status: 400 })
  }

  const nom = body.nom.trim()
  const slug = (body.slug as string)?.trim()
    || nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const ambiance = (body.ambiance as string) || 'classique'

  try {
    const inserted = await db.insert(schema.bibliotheques)
      .values({ nom, slug, ambiance })
      .returning()
    return NextResponse.json({ bibliotheque: inserted[0] }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error && err.message.includes('UNIQUE')
      ? 'Cette bibliothèque existe déjà (slug dupliqué).'
      : 'Erreur lors de la création.'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

async function getLivre(id: number) {
  const rows = await db.query.livres.findMany({ where: (l, { eq }) => eq(l.id, id) })
  return rows[0] ?? null
}

// GET /api/livres/[id] — détail d'un livre
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 })
  }

  const livre = await getLivre(id)
  if (!livre) {
    return NextResponse.json({ error: 'Livre introuvable.' }, { status: 404 })
  }
  return NextResponse.json({ livre })
}

// PUT /api/livres/[id] — modifier
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 })
  }

  const livre = await getLivre(id)
  if (!livre) {
    return NextResponse.json({ error: 'Livre introuvable.' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  const values: Record<string, string | number | null> = {}

  for (const field of ['titre', 'auteur', 'genre', 'isbn', 'couverture_url', 'couleur_dos'] as const) {
    if (typeof body?.[field] === 'string') values[field] = body[field].trim()
    else if (body?.[field] === null) values[field] = null
  }
  if (typeof body?.hauteur === 'number') values.hauteur = body.hauteur
  if (typeof body?.epaisseur === 'number') values.epaisseur = body.epaisseur

  const updated = await db.update(schema.livres)
    .set(values)
    .where(eq(schema.livres.id, id))
    .returning()

  return NextResponse.json({ livre: updated[0] })
}

// DELETE /api/livres/[id] — supprimer
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 })
  }

  const livre = await getLivre(id)
  if (!livre) {
    return NextResponse.json({ error: 'Livre introuvable.' }, { status: 404 })
  }

  await db.delete(schema.livres).where(eq(schema.livres.id, id))
  return NextResponse.json({ success: true })
}
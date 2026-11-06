import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { and, eq } from 'drizzle-orm'

// POST /api/bibliotheques/[id]/livres — associe un livre existant à la bibliothèque
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const biblioId = Number(idStr)
  if (!Number.isInteger(biblioId)) {
    return NextResponse.json({ error: 'ID bibliothèque invalide.' }, { status: 400 })
  }

  const body = await req.json().catch(() => null)
  const livreId = Number(body?.livre_id)

  if (!Number.isInteger(livreId)) {
    return NextResponse.json({ error: 'livre_id est requis.' }, { status: 400 })
  }

  // Vérifier que la bibliothèque et le livre existent
  const biblio = await db.query.bibliotheques.findMany({
    where: (b, { eq }) => eq(b.id, biblioId),
  })
  if (!biblio[0]) {
    return NextResponse.json({ error: 'Bibliothèque introuvable.' }, { status: 404 })
  }

  const livre = await db.query.livres.findMany({ where: (l, { eq }) => eq(l.id, livreId) })
  if (!livre[0]) {
    return NextResponse.json({ error: 'Livre introuvable.' }, { status: 404 })
  }

  // Éviter les doublons
  const existing = await db.query.livresBibliotheques.findMany({
    where: (lb, { and, eq }) => and(eq(lb.livre_id, livreId), eq(lb.bibliotheque_id, biblioId)),
  })
  if (existing[0]) {
    return NextResponse.json({ error: 'Ce livre est déjà dans cette bibliothèque.' }, { status: 409 })
  }

  const inserted = await db.insert(schema.livresBibliotheques)
    .values({
      livre_id: livreId,
      bibliotheque_id: biblioId,
      etagere: typeof body.etagere === 'number' ? body.etagere : 0,
      position_x: typeof body.position_x === 'number' ? body.position_x : 0,
      position_y: typeof body.position_y === 'number' ? body.position_y : 0,
    })
    .returning()

  return NextResponse.json({ association: inserted[0] }, { status: 201 })
}

// DELETE /api/bibliotheques/[id]/livres — retire l'association (livre de la bibliothèque)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const biblioId = Number(idStr)
  if (!Number.isInteger(biblioId)) {
    return NextResponse.json({ error: 'ID bibliothèque invalide.' }, { status: 400 })
  }

  const body = await req.json().catch(() => null)
  const associationId = Number(body?.association_id)

  if (!Number.isInteger(associationId)) {
    return NextResponse.json({ error: 'association_id est requis.' }, { status: 400 })
  }

  const deleted = await db.delete(schema.livresBibliotheques)
    .where(
      and(eq(schema.livresBibliotheques.id, associationId), eq(schema.livresBibliotheques.bibliotheque_id, biblioId))
    )
    .returning()

  if (!deleted[0]) {
    return NextResponse.json({ error: 'Association introuvable.' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

// PUT /api/bibliotheques/[id]/livres — prêter ou récupérer (statut)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const biblioId = Number(idStr)
  if (!Number.isInteger(biblioId)) {
    return NextResponse.json({ error: 'ID bibliothèque invalide.' }, { status: 400 })
  }

  const body = await req.json().catch(() => null)
  const associationId = Number(body?.association_id)
  if (!Number.isInteger(associationId)) {
    return NextResponse.json({ error: 'association_id requis.' }, { status: 400 })
  }

  const statut = body?.statut as string
  if (statut !== 'present' && statut !== 'prete') {
    return NextResponse.json({ error: 'statut invalide (present/prete).' }, { status: 400 })
  }

  const updates: Record<string, string | null> = { statut }
  if (statut === 'prete') updates.emprunteur = (body?.emprunteur as string)?.trim() || null
  else updates.emprunteur = null

  const updated = await db.update(schema.livresBibliotheques)
    .set(updates)
    .where(
      and(eq(schema.livresBibliotheques.id, associationId), eq(schema.livresBibliotheques.bibliotheque_id, biblioId))
    )
    .returning()

  if (!updated[0]) {
    return NextResponse.json({ error: 'Association introuvable.' }, { status: 404 })
  }

  return NextResponse.json({ association: updated[0] })
}
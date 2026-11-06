import { NextResponse } from 'next/server'
import { db, schema } from '@/lib/db'
import { eq } from 'drizzle-orm'

async function getBibliotheque(id: number) {
  const rows = await db.query.bibliotheques.findMany({ where: (b, { eq }) => eq(b.id, id) })
  return rows[0] ?? null
}

// GET /api/bibliotheques/[id] — détail avec les livres
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 })
  }

  const bibliotheque = await getBibliotheque(id)
  if (!bibliotheque) {
    return NextResponse.json({ error: 'Bibliothèque introuvable.' }, { status: 404 })
  }

  // Livres associés avec leurs infos
  const assoc = await db.query.livresBibliotheques.findMany({
    where: (lb, { eq }) => eq(lb.bibliotheque_id, id),
    with: { livre: true },
  })

  const livres = assoc.map((a) => ({
    ...a.livre,
    etagere: a.etagere,
    position_x: a.position_x,
    position_y: a.position_y,
    statut: a.statut || 'present',
    emprunteur: a.emprunteur,
    association_id: a.id,
  }))

  return NextResponse.json({ bibliotheque: { ...bibliotheque, livres } })
}

// PUT /api/bibliotheques/[id] — modifier
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 })
  }

  const bibliotheque = await getBibliotheque(id)
  if (!bibliotheque) {
    return NextResponse.json({ error: 'Bibliothèque introuvable.' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  const nom = (body?.nom as string)?.trim()
  const ambiance = (body?.ambiance as string)?.trim()

  const updated = await db.update(schema.bibliotheques)
    .set({
      ...(nom ? { nom } : {}),
      ...(ambiance ? { ambiance } : {}),
    })
    .where(eq(schema.bibliotheques.id, id))
    .returning()

  return NextResponse.json({ bibliotheque: updated[0] })
}

// DELETE /api/bibliotheques/[id] — supprimer
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params
  const id = Number(idStr)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 })
  }

  const bibliotheque = await getBibliotheque(id)
  if (!bibliotheque) {
    return NextResponse.json({ error: 'Bibliothèque introuvable.' }, { status: 404 })
  }

  await db.delete(schema.bibliotheques).where(eq(schema.bibliotheques.id, id))
  return NextResponse.json({ success: true })
}
'use client'

import { useState, useRef, useEffect } from 'react'

export interface Suggestion {
  titre: string
  auteur: string
  isbn?: string
  couverture_url?: string
}

interface AjouterLivreProps {
  bibliothequeId: number
  onLivreAjoute: () => void
  onClose: () => void
}

export default function AjouterLivre({ bibliothequeId, onLivreAjoute, onClose }: AjouterLivreProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Suggestion | null>(null)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [duplicateDetected, setDuplicateDetected] = useState(false)
  const [forceAdd, setForceAdd] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Stocke les livres existants pour calculer le placement
  const etagereDispo = useRef<Record<number, { count: number; totalWidth: number }>>({
    0: { count: 0, totalWidth: 0 },
    1: { count: 0, totalWidth: 0 },
    2: { count: 0, totalWidth: 0 },
    3: { count: 0, totalWidth: 0 },
  })
  const livresExistants = useRef<Array<{ titre: string; isbn?: string | null; biblio?: string }>>([])
  const [matchLibraries, setMatchLibraries] = useState<string[]>([])

  // Focus input + charger les livres de toutes les bibliothèques (pour détection doublon)
  useEffect(() => {
    inputRef.current?.focus()
    // 1. Récup la liste des bibliothèques
    fetch('/api/bibliotheques')
      .then(r => r.json())
      .then(data => {
        const biblioList: Array<{ id: number; nom: string }> = data.bibliotheques || []
        // 2. Pour chaque biblio, récup ses livres
        Promise.all(biblioList.map((b) =>
          fetch(`/api/bibliotheques/${b.id}`).then(r => r.json())
        )).then((results) => {
          const dispo: Record<number, { count: number; totalWidth: number }> = {
            0: { count: 0, totalWidth: 0 }, 1: { count: 0, totalWidth: 0 },
            2: { count: 0, totalWidth: 0 }, 3: { count: 0, totalWidth: 0 },
          }
          const tous: Array<{ titre: string; isbn?: string | null; biblio?: string }> = []

          for (const res of results) {
            const livres: any[] = res.bibliotheque?.livres || []
            const nom = biblioList.find((b) => b.id === res.bibliotheque?.id)?.nom || '?'

            for (const l of livres) {
              tous.push({ titre: l.titre || '', isbn: l.isbn || null, biblio: nom })
              const shelf = l.etagere ?? 0
              if (dispo[shelf]) {
                dispo[shelf].count++
                dispo[shelf].totalWidth += (l.epaisseur ?? 0.6) + 0.08
              }
            }
          }

          livresExistants.current = tous
          const sorted = Object.entries(dispo).sort(([, a], [, b]) => a.totalWidth - b.totalWidth)
          etagereDispo.current = { 0: dispo[0], 1: dispo[1], 2: dispo[2], 3: dispo[3], sorted } as any
        })
      })
      .catch(() => {})
  }, [bibliothequeId])

  /** Calcule la meilleure étagère et position pour le nouveau livre */
  function calculerPlacement(epaisseur: number): { etagere: number; position_x: number } {
    const dispo = etagereDispo.current as any
    const rows = dispo.sorted || [[0, { totalWidth: 0 }]]
    for (const [shelfStr, info] of rows) {
      const shelf = Number(shelfStr)
      const SHELF_WIDTH = 7.0
      const GAP = 0.08
      const startX = -SHELF_WIDTH / 2 + 0.25
      const used = info.totalWidth
      if (startX + used + epaisseur + GAP <= SHELF_WIDTH / 2 - 0.25) {
        // Il y a de la place sur cette étagère
        const nextX = startX + used + epaisseur / 2
        return { etagere: shelf, position_x: Math.round(nextX * 100) / 100 }
      }
    }
    // Toutes pleines : on met sur l'étagère 0 à la suite (débordera)
    return { etagere: 0, position_x: 0 }
  }

  // Debounced search
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (query.length < 2) { setResults([]); return }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/enrichir?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.suggestions || [])
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 350)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  const handleSelect = (s: Suggestion) => {
    setSelected(s)
    setResults([])
    setQuery(`${s.titre} — ${s.auteur}`)
    setError('')

    // Détection doublon (toutes bibliothèques)
    setDuplicateDetected(false)
    setForceAdd(false)
    setMatchLibraries([])
    const existing = livresExistants.current

    // Par ISBN
    let matches: string[] = []
    if (s.isbn) matches = existing.filter((l) => l.isbn === s.isbn).map((l) => l.biblio || '').filter(Boolean)
    // Par titre si pas d'ISBN ou pas trouvé par ISBN
    if (matches.length === 0) {
      matches = existing.filter((l) => l.titre.toLowerCase().trim() === s.titre.toLowerCase().trim()).map((l) => l.biblio || '').filter(Boolean)
    }
    // Dédupliquer les noms
    const uniq = [...new Set(matches)]
    if (uniq.length > 0) {
      setDuplicateDetected(true)
      setMatchLibraries(uniq)
    }
  }

  const handleAdd = async () => {
    if (!selected) return
    // Forcer si doublon détecté + pas encore forcé
    if (duplicateDetected && !forceAdd) {
      setForceAdd(true)
      setAdding(false)
      setError('')
      return
    }
    setAdding(true)
    setError('')

    try {
      // 1. Créer le livre
      const livreRes = await fetch('/api/livres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: selected.titre,
          auteur: selected.auteur,
          genre: 'classique',
          isbn: selected.isbn || null,
          couverture_url: selected.couverture_url || null,
          hauteur: 2.0,
          epaisseur: 0.6,
        }),
      })
      const livreData = await livreRes.json()
      if (!livreRes.ok) throw new Error(livreData.error || 'Erreur création livre')
      const livreId = livreData.livre.id

      // 2. Calculer le placement optimal
      const epaisseur = 0.6
      const { etagere, position_x } = calculerPlacement(epaisseur)

      // 3. Associer à la bibliothèque
      const assocRes = await fetch(`/api/bibliotheques/${bibliothequeId}/livres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livre_id: livreId, etagere, position_x, position_y: 0 }),
      })
      if (!assocRes.ok) {
        const assocData = await assocRes.json()
        throw new Error(assocData.error || 'Erreur association')
      }

      onLivreAjoute()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
    setAdding(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40">
      <div className="bg-[#374151] rounded-xl shadow-2xl border border-[#4f5a73] w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#4f5a73]">
          <h2 className="text-white font-semibold text-sm">Ajouter un livre</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-white text-lg leading-none">&times;</button>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
            placeholder="Rechercher un livre (titre, auteur…)"
            className="w-full bg-[#1f2937] text-white rounded-lg px-4 py-2.5 text-sm border border-[#4f5a73] placeholder-[#6b7280] outline-none focus:border-[#6b8fbf]"
          />

          {/* Loading indicator */}
          {loading && (
            <div className="text-[#9ca3af] text-xs mt-2 px-1">Recherche en cours…</div>
          )}

          {/* Results list */}
          {results.length > 0 && !selected && (
            <ul className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-[#4f5a73] divide-y divide-[#4f5a73] bg-[#1f2937]">
              {results.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(s)}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#374151] transition-colors"
                >
                  {s.couverture_url ? (
                    <img src={s.couverture_url} alt="" className="w-8 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-8 h-12 bg-[#4f5a73] rounded flex items-center justify-center text-[10px] text-[#9ca3af]">?</div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{s.titre}</p>
                    <p className="text-[#9ca3af] text-xs truncate">{s.auteur}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Selected preview */}
          {selected && (
            <div className="mt-3 p-3 rounded-lg bg-[#1f2937] border border-[#4f5a73]">
              <div className="flex items-center gap-3">
                {selected.couverture_url ? (
                  <img src={selected.couverture_url} alt="" className="w-10 h-14 object-cover rounded" />
                ) : (
                  <div className="w-10 h-14 bg-[#4f5a73] rounded flex items-center justify-center text-xs text-[#9ca3af]">📖</div>
                )}
                <div>
                  <p className="text-white font-medium text-sm">{selected.titre}</p>
                  <p className="text-[#9ca3af] text-xs">{selected.auteur}</p>
                  {selected.isbn && <p className="text-[#6b7280] text-[10px] mt-0.5">ISBN: {selected.isbn}</p>}
                </div>
              </div>
              {/* Alerte doublon */}
              {duplicateDetected && !forceAdd && (
                <div className="mt-2 flex items-start gap-3 p-2 rounded-lg bg-yellow-900/20 border border-yellow-600">
                  <span className="text-yellow-400 text-base shrink-0">⚠️</span>
                  <div className="min-w-0">
                    <p className="text-yellow-300 text-xs font-semibold">Ce livre existe déjà</p>
                    <p className="text-[#9ca3af] text-[10px]">
                      Dans : {matchLibraries.length > 0 ? matchLibraries.join(', ') : 'cette bibliothèque'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 pb-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#9ca3af] hover:text-white rounded-lg border border-[#4f5a73]">
            Annuler
          </button>
          <button
            onClick={handleAdd}
            disabled={!selected || adding}
            className="px-5 py-2 text-sm text-white bg-[#3b6b9f] hover:bg-[#4a7dbf] disabled:bg-[#4f5a73] disabled:text-[#6b7280] rounded-lg transition-colors"
          >
            {adding ? 'Ajout…' : (duplicateDetected && !forceAdd ? 'Ajouter quand même' : 'Ajouter à la bibliothèque')}
          </button>
        </div>
      </div>
    </div>
  )
}
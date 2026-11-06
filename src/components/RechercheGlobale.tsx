'use client'

import { useState, useRef, useEffect } from 'react'

interface SearchResult {
  id: number
  titre: string
  auteur: string
  genre: string
  bibliotheques: Array<{ id: number; nom: string; ambiance: string }>
}

interface RechercheGlobaleProps {
  onNavigate: (biblioId: number) => void
}


export default function RechercheGlobale({ onNavigate }: RechercheGlobaleProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<SearchResult | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Debounced search
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (query.length < 2) { setResults([]); return }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/livres?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.livres || [])
      } catch { setResults([]) }
      setLoading(false)
    }, 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setSelected(null); setResults([]) }}
        onFocus={() => inputRef.current?.select()}
        placeholder="🔍 Chercher un livre…"
        className="w-full bg-[#1f2937] text-white rounded-lg px-4 py-2 text-sm border border-[#4f5a73] placeholder-[#6b7280] outline-none focus:border-[#6b8fbf]"
      />

      {loading && (
        <div className="text-[#9ca3af] text-[10px] mt-1 px-1">Recherche…</div>
      )}

      {results.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-lg border border-[#4f5a73] bg-[#1f2937] z-10 shadow-xl">
          {results.map((r) => (
            <div key={r.id} className="px-3 py-2 border-b border-[#4f5a73]/50 last:border-b-0">
              <div className="flex items-start gap-2 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{r.titre}</p>
                  <p className="text-[#9ca3af] text-[10px] truncate">{r.auteur}</p>
                </div>
              </div>
              {/* Bibliothèques */}
              {r.bibliotheques.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {r.bibliotheques.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setQuery(''); setResults([]); setSelected(null); onNavigate(b.id) }}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#3b6b9f] hover:bg-[#4a7dbf] text-white transition-colors"
                    >
                      📚 {b.nom}
                    </button>
                  ))}
                </div>
              )}
              {r.bibliotheques.length === 0 && (
                <p className="text-[#6b7280] text-[10px] mt-0.5">Aucune bibliothèque</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
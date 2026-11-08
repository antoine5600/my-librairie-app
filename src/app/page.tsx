"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import AjouterLivre from "@/components/AjouterLivre"
import RechercheGlobale from "@/components/RechercheGlobale"
import { AMBIANCES, AMBIANCE_LIST } from "@/components/3d/ambiances"

const BibliothequeScene = dynamic(
  () => import("@/components/3d/BibliothequeScene"),
  { ssr: false }
)

interface BiblioInfo {
  id: number
  nom: string
  slug: string
  ambiance: string
  nombre_livres: number
  capacite_max?: number
}

export default function Home() {
  const [bibliotheques, setBibliotheques] = useState<BiblioInfo[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // Stocke les livres prêtés de toutes les bibliothèques
  const [prets, setPrets] = useState<Array<{ titre: string; emprunteur?: string; associationId?: number; biblioNom?: string; biblioId?: number }>>([])

  // Charger la liste des bibliothèques
  useEffect(() => {
    fetch("/api/bibliotheques")
      .then(r => r.json())
      .then(data => {
        const list: BiblioInfo[] = data.bibliotheques || []
        setBibliotheques(list)
        if (!activeId && list.length > 0) setActiveId(list[0].id)
      })
      .catch(() => {})
    // Charger les prêtés de toutes les bibliothèques — pas besoin d'activeId
    fetch('/api/bibliotheques')
      .then(r => r.json())
      .then(async (data) => {
        const biblioList: Array<{ id: number; nom: string }> = data.bibliotheques || []
        const tousPrets: Array<{ titre: string; emprunteur?: string; associationId?: number; biblioNom?: string; biblioId?: number }> = []

        for (const b of biblioList) {
          const res = await fetch(`/api/bibliotheques/${b.id}`).then(r => r.json())
          const livres: any[] = res.bibliotheque?.livres || []
          for (const l of livres) {
            if (l.statut === 'prete') {
              tousPrets.push({ titre: l.titre, emprunteur: l.emprunteur, associationId: l.association_id, biblioNom: b.nom, biblioId: b.id })
            }
          }
        }
        setPrets(tousPrets)
      })
      .catch(() => {})
  }, [refreshKey, activeId])

  const activeBiblio = bibliotheques.find(b => b.id === activeId)
  const activeAmbiance = activeBiblio?.ambiance || "classique"

  const handleLivreAjoute = () => setRefreshKey(k => k + 1)

  return (
    <div className="flex flex-col h-screen bg-[#4f5a73]">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-[#4f5a73]/80 border-b border-[#3d4760] text-white shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-lg hover:bg-[#3d4760] p-1.5 rounded"
            title="Bibliothèques"
          >
            ☰
          </button>
          <h1 className="text-sm sm:text-lg font-bold tracking-tight truncate">
            📚 {activeBiblio?.nom || "Chargement…"}
          </h1>
          {activeBiblio && (
            <span className="hidden sm:inline text-[#9ca3af] text-xs bg-[#3d4760] px-2 py-0.5 rounded-full">
              {activeBiblio.nombre_livres} livre{activeBiblio.nombre_livres !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-white bg-[#3b6b9f] hover:bg-[#4a7dbf] rounded-lg transition-colors"
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </header>

      {/* Corps : sidebar + scène */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Overlay mobile quand sidebar ouverte */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar bibliothèques */}
        <aside className={`${
          sidebarOpen
            ? 'fixed sm:static inset-y-0 left-0 z-40 w-72 max-w-[85vw] sm:w-56 bg-[#374151]'
            : 'hidden sm:block sm:w-0 sm:overflow-hidden'
        } border-r border-[#4f5a73] overflow-y-auto p-3 space-y-2 shrink-0 transition-all`}>
          {/* Recherche globale */}
          <div className="mb-4">
            <RechercheGlobale onNavigate={(biblioId) => { setActiveId(biblioId); setAddOpen(false); setSidebarOpen(false) }} />
          </div>

          <h2 className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wider px-2 mb-3">
            Bibliothèques
          </h2>
          {bibliotheques.map((b) => {
            const amb = AMBIANCES[b.ambiance] || AMBIANCES.classique
            return (
              <button
                key={b.id}
                onClick={() => { setActiveId(b.id); setAddOpen(false); setSidebarOpen(false) }}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeId === b.id
                    ? "bg-[#4a7dbf] text-white"
                    : "text-[#d1d5db] hover:bg-[#4f5a73]"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/20"
                  style={{ background: amb.bois }}
                />
                <span className="truncate">{b.nom}</span>
              </button>
            )
          })}

          {/* Livres prêtés */}
          <h2 className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wider px-2 mt-4 mb-2">
            📤 Prêtés {prets.length > 0 ? `(${prets.length})` : ''}
          </h2>
          {prets.length === 0 && (
            <p className="text-[#6b7280] text-[10px] px-2">Aucun livre prêté</p>
          )}
          {prets.map((p, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 text-xs text-[#d1d5db]">
              <span className="truncate flex-1 min-w-0">
                {p.titre}
                {p.emprunteur && <span className="text-[#9ca3af] text-[10px] block">→ {p.emprunteur}</span>}
                {p.biblioNom && <span className="text-[#6b7280] text-[9px] block">📚 {p.biblioNom}</span>}
              </span>
              {p.associationId && p.biblioId && (
                <button
                  onClick={async () => {
                    try {
                      await fetch(`/api/bibliotheques/${p.biblioId}/livres`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ association_id: p.associationId, statut: 'present' }),
                      })
                      setRefreshKey(k => k + 1)
                    } catch {}
                  }}
                  className="px-2 py-0.5 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors shrink-0"
                  title="Récupérer ce livre"
                >
                  📥
                </button>
              )}
            </div>
          ))}
        </aside>

        {/* Scene 3D */}
        <main className="flex-1 min-h-0">
          <BibliothequeScene
            key={`${activeId}-${refreshKey}`}
            className="w-full h-full"
            bibliothequeId={activeId ?? undefined}
            ambianceId={activeAmbiance}
            capaciteMax={activeBiblio?.capacite_max}
            onChange={() => setRefreshKey(k => k + 1)}
          />
        </main>
      </div>

      {/* Modal ajout livre */}
      {addOpen && activeId && (
        <AjouterLivre
          bibliothequeId={activeId}
          onLivreAjoute={handleLivreAjoute}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  )
}
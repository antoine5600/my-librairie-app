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
}

export default function Home() {
  const [bibliotheques, setBibliotheques] = useState<BiblioInfo[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [prets, setPrets] = useState<Array<{ titre: string; emprunteur?: string }>>([])

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
    // Charger les prêtés de la bibliothèque active
    if (activeId) {
      fetch(`/api/bibliotheques/${activeId}`)
        .then(r => r.json())
        .then(data => {
          const livres: any[] = data.bibliotheque?.livres || []
          setPrets(livres.filter((l: any) => l.statut === 'prete').map((l: any) => ({ titre: l.titre, emprunteur: l.emprunteur })))
        })
        .catch(() => {})
    }
  }, [refreshKey, activeId])

  const activeBiblio = bibliotheques.find(b => b.id === activeId)
  const activeAmbiance = activeBiblio?.ambiance || "classique"

  const handleLivreAjoute = () => setRefreshKey(k => k + 1)

  return (
    <div className="flex flex-col h-screen bg-[#4f5a73]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#4f5a73]/80 border-b border-[#3d4760] text-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-lg hover:bg-[#3d4760] p-1 rounded"
            title="Bibliothèques"
          >
            ☰
          </button>
          <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm text-white bg-[#3b6b9f] hover:bg-[#4a7dbf] rounded-lg transition-colors"
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </header>

      {/* Corps : sidebar + scène */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar bibliothèques */}
        {sidebarOpen && (
          <aside className="w-56 shrink-0 bg-[#374151] border-r border-[#4f5a73] overflow-y-auto p-3 space-y-2">
            {/* Recherche globale */}
            <div className="mb-4">
              <RechercheGlobale onNavigate={(biblioId) => { setActiveId(biblioId); setAddOpen(false) }} />
            </div>

            <h2 className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wider px-2 mb-3">
              Bibliothèques
            </h2>
            {bibliotheques.map((b) => {
              const amb = AMBIANCES[b.ambiance] || AMBIANCES.classique
              return (
                <button
                  key={b.id}
                  onClick={() => { setActiveId(b.id); setAddOpen(false) }}
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
                              {prets.length > 0 && (
                                <>
                                  <h2 className="text-[#9ca3af] text-xs font-semibold uppercase tracking-wider px-2 mt-4 mb-2">
                                    📤 Prêtés ({prets.length})
                                  </h2>
                                  {prets.map((p, i) => (
                                    <div key={i} className="px-3 py-2 text-xs text-[#d1d5db] border-b border-[#4f5a73]/30 last:border-b-0">
                                      <p className="font-medium truncate">{p.titre}</p>
                                      {p.emprunteur && <p className="text-[#9ca3af] text-[10px] mt-0.5">→ {p.emprunteur}</p>}
                                    </div>
                                  ))}
                                </>
                              )}
                            </aside>
        )}

        {/* Scene 3D */}
        <main className="flex-1 min-h-0">
          <BibliothequeScene
            key={`${activeId}-${refreshKey}`}
            className="w-full h-full"
            bibliothequeId={activeId ?? undefined}
            ambianceId={activeAmbiance}
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
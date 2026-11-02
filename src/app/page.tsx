"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import AjouterLivre from "@/components/AjouterLivre"

const BibliothequeScene = dynamic(
  () => import("@/components/3d/BibliothequeScene"),
  { ssr: false }
)

// ID de la bibliothèque par défaut (seed)
const BIBLIOTHEQUE_ID = 1

export default function Home() {
  const [nom, setNom] = useState("Ma bibliothèque")
  const [addOpen, setAddOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [compteur, setCompteur] = useState(0)

  // Charger les infos de la bibliothèque
  useEffect(() => {
    fetch(`/api/bibliotheques/${BIBLIOTHEQUE_ID}`)
      .then(r => r.json())
      .then(data => {
        const b = data.bibliotheque
        if (b) {
          setNom(b.nom)
          setCompteur(b.livres?.length || 0)
        }
      })
      .catch(() => {})
  }, [refreshKey])

  const handleLivreAjoute = () => {
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="flex flex-col h-screen bg-[#4f5a73]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#4f5a73]/80 border-b border-[#3d4760] text-white">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">
            📚 {nom}
          </h1>
          <span className="text-[#9ca3af] text-xs bg-[#3d4760] px-2 py-0.5 rounded-full whitespace-nowrap">
            {compteur} livre{compteur !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm text-white bg-[#3b6b9f] hover:bg-[#4a7dbf] rounded-lg transition-colors"
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:inline">Ajouter un livre</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#9ca3af] ml-2">
            <span>🖱️ Cliquer</span>
            <span className="text-[#6b7280]">|</span>
            <span>🔄 Zoomer</span>
          </div>
        </div>
      </header>

      {/* Scene 3D */}
      <main className="flex-1 min-h-0">
        <BibliothequeScene
          key={refreshKey}
          className="w-full h-full"
          bibliothequeId={BIBLIOTHEQUE_ID}
        />
      </main>

      {/* Modal ajout livre */}
      {addOpen && (
        <AjouterLivre
          bibliothequeId={BIBLIOTHEQUE_ID}
          onLivreAjoute={handleLivreAjoute}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  )
}
"use client"

import dynamic from "next/dynamic"

const BibliothequeScene = dynamic(
  () => import("@/components/3d/BibliothequeScene"),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#4a6d9a]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#4a6d9a]/80 border-b border-[#3d4760] text-white">
        <h1 className="text-lg font-bold tracking-tight">
          📚 My Librairie App
        </h1>
        <div className="flex items-center gap-3 text-sm text-[#b0b8cc]">
          <span>🖱️ Cliquer → sélectionner</span>
          <span className="text-[#8f98b0]">|</span>
          <span>🔄 Molette → zoomer</span>
        </div>
      </header>

      {/* Scene 3D — prend tout l'espace restant */}
      <main className="flex-1 min-h-0">
        <BibliothequeScene className="w-full h-full" />
      </main>
    </div>
  )
}
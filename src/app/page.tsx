"use client"

import dynamic from "next/dynamic"

const BibliothequeScene = dynamic(
  () => import("@/components/3d/BibliothequeScene"),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <h1 className="text-lg font-bold text-white tracking-tight">
          📚 My Librairie App
        </h1>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span>🖱️ Cliquer un livre pour le sélectionner</span>
          <span className="text-slate-600">|</span>
          <span>🔄 Molette pour zoomer</span>
        </div>
      </header>

      {/* Scene 3D */}
      <main className="flex-1">
        <BibliothequeScene className="w-full h-full" />
      </main>
    </div>
  )
}
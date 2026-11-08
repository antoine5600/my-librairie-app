'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/')
      } else {
        setError('Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4f5a73]">
      <form onSubmit={handleSubmit} className="bg-[#374151] p-8 rounded-xl shadow-2xl border border-[#4f5a73] w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📚</div>
          <h1 className="text-white text-xl font-bold">Ma Librairie</h1>
          <p className="text-[#9ca3af] text-sm mt-1">Entrez le mot de passe pour accéder</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          placeholder="Mot de passe"
          className="w-full bg-[#1f2937] text-white rounded-lg px-4 py-2.5 text-sm border border-[#4f5a73] mb-3 focus:border-[#6b8fbf] outline-none transition-colors"
          autoFocus
          disabled={loading}
        />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2.5 bg-[#3b6b9f] hover:bg-[#4a7dbf] disabled:bg-[#4f5a73] disabled:text-[#6b7280] text-white rounded-lg text-sm transition-colors"
        >
          {loading ? 'Connexion…' : 'Accéder à ma bibliothèque'}
        </button>
      </form>
    </div>
  )
}
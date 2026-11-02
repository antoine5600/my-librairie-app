import { describe, it, expect } from 'vitest'
import { genreColor, GENRES, GENRE_LIST } from '@/components/3d/genres'
import type { GenreId } from '@/components/3d/genres'

describe('genres', () => {
  it('devrait retourner une couleur pour chaque genre', () => {
    for (const genre of Object.keys(GENRES) as GenreId[]) {
      const color = genreColor(genre, 0)
      expect(color).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  it('GENRES devrait contenir 14 genres', () => {
    expect(Object.keys(GENRES)).toHaveLength(14)
  })

  it('devrait alterner base/alt selon la variation', () => {
    const colorEven = genreColor('classique', 0)
    const colorOdd = genreColor('classique', 1)
    expect(colorEven).not.toBe(colorOdd)
  })

  it('GENRE_LIST devrait contenir tous les genres', () => {
    expect(GENRE_LIST).toHaveLength(14)
  })
})

describe('schéma DB', () => {
  it('devrait exporter les 3 tables', async () => {
    const schema = await import('@/lib/db/schema')
    expect(schema.bibliotheques).toBeDefined()
    expect(schema.livres).toBeDefined()
    expect(schema.livresBibliotheques).toBeDefined()
  })
})

describe('couleurs', () => {
  it('le genre polar devrait être rouge foncé', () => {
    expect(GENRES.polar.color).toBe('#8e3328')
  })

  it('le genre romance devrait être rose', () => {
    expect(GENRES.romance.color).toBe('#d4638a')
  })

  it('le genre sf devrait être bleu', () => {
    expect(GENRES.sf.color).toBe('#1f6feb')
  })
})
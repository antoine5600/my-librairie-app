'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { RoundedBox, OrbitControls } from '@react-three/drei'
import Livre3D from './Livre3D'
import type { Book3D } from './types'
import { genreColor } from './genres'

// ---------- Données de secours (si pas de bibliothequeId fourni) ----------
function Fond() {
  return (
    <mesh position={[0, 0, -20]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial color="#4f5a73" />
    </mesh>
  )
}

// ---------- Données d'exemple (34 livres, genres → couleurs) ----------
const SAMPLE_BOOKS: Book3D[] = [
  { id: '1', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', genre: 'classique', thickness: 0.5, height: 1.8, coverColor: genreColor('classique', 0), shelf: 0, order: 0 },
  { id: '2', title: '1984', author: 'George Orwell', genre: 'sf', thickness: 0.7, height: 2.0, coverColor: genreColor('sf', 1), shelf: 0, order: 1 },
  { id: '3', title: 'Dune', author: 'Frank Herbert', genre: 'sf', thickness: 0.9, height: 2.2, coverColor: genreColor('sf', 2), shelf: 0, order: 2 },
  { id: '4', title: 'Fondation', author: 'Isaac Asimov', genre: 'sf', thickness: 0.6, height: 2.0, coverColor: genreColor('sf', 3), shelf: 0, order: 3 },
  { id: '5', title: 'Le Seigneur des Anneaux', author: 'J.R.R. Tolkien', genre: 'fantasy', thickness: 1.0, height: 2.4, coverColor: genreColor('fantasy', 4), shelf: 0, order: 4 },
  { id: '6', title: 'Harry Potter', author: 'J.K. Rowling', genre: 'fantastique', thickness: 0.8, height: 2.1, coverColor: genreColor('fantastique', 5), shelf: 0, order: 5 },
  { id: '7', title: 'Orgueil et Préjugés', author: 'Jane Austen', genre: 'romance', thickness: 0.5, height: 1.8, coverColor: genreColor('romance', 6), shelf: 0, order: 6 },
  { id: '8', title: 'Gatsby le Magnifique', author: 'F. Scott Fitzgerald', genre: 'drame', thickness: 0.5, height: 1.7, coverColor: genreColor('drame', 7), shelf: 0, order: 7 },
  { id: '9', title: 'Brave New World', author: 'Aldous Huxley', genre: 'sf', thickness: 0.6, height: 2.0, coverColor: genreColor('sf', 0), shelf: 0, order: 8 },
  { id: '10', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'aventure', thickness: 0.7, height: 2.1, coverColor: genreColor('aventure', 1), shelf: 1, order: 0 },
  { id: '11', title: 'Neuromancien', author: 'William Gibson', genre: 'sf', thickness: 0.5, height: 1.9, coverColor: genreColor('sf', 2), shelf: 1, order: 1 },
  { id: '12', title: 'Le Comte de Monte-Cristo', author: 'Alexandre Dumas', genre: 'aventure', thickness: 1.0, height: 2.3, coverColor: genreColor('aventure', 3), shelf: 1, order: 2 },
  { id: '13', title: 'Les Trois Mousquetaires', author: 'Alexandre Dumas', genre: 'aventure', thickness: 0.8, height: 2.1, coverColor: genreColor('aventure', 0), shelf: 1, order: 3 },
  { id: '14', title: 'Blade Runner', author: 'Philip K. Dick', genre: 'sf', thickness: 0.5, height: 1.7, coverColor: genreColor('sf', 1), shelf: 1, order: 4 },
  { id: '15', title: "L'Étranger", author: 'Albert Camus', genre: 'philosophie', thickness: 0.4, height: 1.8, coverColor: genreColor('philosophie', 2), shelf: 1, order: 5 },
  { id: '16', title: 'La Peste', author: 'Albert Camus', genre: 'drame', thickness: 0.5, height: 1.9, coverColor: genreColor('drame', 3), shelf: 1, order: 6 },
  { id: '17', title: 'Les Misérables', author: 'Victor Hugo', genre: 'classique', thickness: 1.2, height: 2.5, coverColor: genreColor('classique', 4), shelf: 1, order: 7 },
  { id: '18', title: 'Le Nom de la Rose', author: 'Umberto Eco', genre: 'historique', thickness: 0.7, height: 2.1, coverColor: genreColor('historique', 5), shelf: 2, order: 0 },
  { id: '19', title: 'Cent ans de solitude', author: 'Gabriel García Márquez', genre: 'classique', thickness: 0.6, height: 2.0, coverColor: genreColor('classique', 6), shelf: 2, order: 1 },
  { id: '20', title: 'La Guerre des Mondes', author: 'H.G. Wells', genre: 'sf', thickness: 0.5, height: 1.9, coverColor: genreColor('sf', 7), shelf: 2, order: 2 },
  { id: '21', title: '20 000 lieues sous les mers', author: 'Jules Verne', genre: 'aventure', thickness: 0.7, height: 2.1, coverColor: genreColor('aventure', 0), shelf: 2, order: 3 },
  { id: '22', title: 'Dracula', author: 'Bram Stoker', genre: 'horreur', thickness: 0.6, height: 2.0, coverColor: genreColor('horreur', 1), shelf: 2, order: 4 },
  { id: '23', title: 'Frankenstein', author: 'Mary Shelley', genre: 'horreur', thickness: 0.6, height: 2.0, coverColor: genreColor('horreur', 2), shelf: 2, order: 5 },
  { id: '24', title: 'Jane Eyre', author: 'Charlotte Brontë', genre: 'classique', thickness: 0.7, height: 2.1, coverColor: genreColor('classique', 3), shelf: 2, order: 6 },
  { id: '25', title: 'Crime et Châtiment', author: 'Fiodor Dostoïevski', genre: 'drame', thickness: 0.9, height: 2.3, coverColor: genreColor('drame', 4), shelf: 2, order: 7 },
  { id: '26', title: 'Moby Dick', author: 'Herman Melville', genre: 'aventure', thickness: 0.8, height: 2.2, coverColor: genreColor('aventure', 5), shelf: 2, order: 8 },
  { id: '27', title: 'La Ferme des Animaux', author: 'George Orwell', genre: 'classique', thickness: 0.4, height: 1.6, coverColor: genreColor('classique', 6), shelf: 4, order: 0 },
  { id: '28', title: 'Sa Majesté des Mouches', author: 'William Golding', genre: 'drame', thickness: 0.5, height: 1.8, coverColor: genreColor('drame', 7), shelf: 4, order: 1 },
  { id: '29', title: 'Le Vieil Homme et la Mer', author: 'Ernest Hemingway', genre: 'classique', thickness: 0.4, height: 1.7, coverColor: genreColor('classique', 0), shelf: 4, order: 2 },
  { id: '30', title: 'Autant en emporte le vent', author: 'Margaret Mitchell', genre: 'romance', thickness: 1.0, height: 2.3, coverColor: genreColor('romance', 1), shelf: 4, order: 3 },
  { id: '31', title: 'Les Hauts de Hurlevent', author: 'Emily Brontë', genre: 'classique', thickness: 0.6, height: 2.0, coverColor: genreColor('classique', 2), shelf: 5, order: 0 },
  { id: '32', title: "Tess d'Urberville", author: 'Thomas Hardy', genre: 'drame', thickness: 0.7, height: 2.1, coverColor: genreColor('drame', 3), shelf: 5, order: 1 },
  { id: '33', title: 'Le Parfum', author: 'Patrick Süskind', genre: 'historique', thickness: 0.5, height: 2.0, coverColor: genreColor('historique', 4), shelf: 5, order: 2 },
  { id: '34', title: 'Le Pendule de Foucault', author: 'Umberto Eco', genre: 'thriller', thickness: 0.7, height: 2.2, coverColor: genreColor('thriller', 5), shelf: 5, order: 3 },
  // --- Livres ajoutés pour remplir les étagères ---
  { id: '35', title: 'Bel-Ami', author: 'Guy de Maupassant', genre: 'classique', thickness: 0.6, height: 2.0, coverColor: genreColor('classique', 0), shelf: 5, order: 4 },
  { id: '36', title: 'Germinal', author: 'Émile Zola', genre: 'drame', thickness: 0.9, height: 2.3, coverColor: genreColor('drame', 1), shelf: 5, order: 5 },
  { id: '37', title: 'Madame Bovary', author: 'Gustave Flaubert', genre: 'classique', thickness: 0.7, height: 2.1, coverColor: genreColor('classique', 2), shelf: 5, order: 6 },
  { id: '38', title: 'Le Rouge et le Noir', author: 'Stendhal', genre: 'classique', thickness: 0.8, height: 2.2, coverColor: genreColor('classique', 3), shelf: 5, order: 7 },
  { id: '39', title: 'Les Fleurs du Mal', author: 'Charles Baudelaire', genre: 'classique', thickness: 0.4, height: 1.7, coverColor: genreColor('classique', 4), shelf: 5, order: 8 },
  { id: '40', title: 'Le Grand Meaulnes', author: 'Alain-Fournier', genre: 'drame', thickness: 0.6, height: 2.0, coverColor: genreColor('drame', 5), shelf: 6, order: 0 },
  { id: '41', title: 'Voyage au bout de la nuit', author: 'Louis-Ferdinand Céline', genre: 'drame', thickness: 0.8, height: 2.2, coverColor: genreColor('drame', 6), shelf: 6, order: 1 },
  { id: '42', title: 'La Condition Humaine', author: 'André Malraux', genre: 'drame', thickness: 0.7, height: 2.1, coverColor: genreColor('drame', 7), shelf: 6, order: 2 },
  { id: '43', title: 'Zadig', author: 'Voltaire', genre: 'philosophie', thickness: 0.4, height: 1.6, coverColor: genreColor('philosophie', 0), shelf: 6, order: 3 },
  { id: '44', title: 'Candide', author: 'Voltaire', genre: 'philosophie', thickness: 0.4, height: 1.7, coverColor: genreColor('philosophie', 1), shelf: 6, order: 4 },
  { id: '45', title: "L'Île au Trésor", author: 'R.L. Stevenson', genre: 'aventure', thickness: 0.6, height: 2.0, coverColor: genreColor('aventure', 0), shelf: 6, order: 5 },
  { id: '46', title: 'Le Tour du Monde en 80 Jours', author: 'Jules Verne', genre: 'aventure', thickness: 0.7, height: 2.1, coverColor: genreColor('aventure', 1), shelf: 6, order: 6 },
  { id: '47', title: 'Robinson Crusoé', author: 'Daniel Defoe', genre: 'aventure', thickness: 0.8, height: 2.2, coverColor: genreColor('aventure', 2), shelf: 6, order: 7 },
  { id: '48', title: 'Les Contemplations', author: 'Victor Hugo', genre: 'classique', thickness: 0.7, height: 2.1, coverColor: genreColor('classique', 3), shelf: 6, order: 8 },
]

// ---------- Paramètres bibliothèque (7 étagères, ~100 livres) ----------
const SHELF_COUNT = 7
const SHELF_HEIGHTS = [2.4, 2.5, 2.6, 2.4, 2.5, 2.6, 2.4]
const SHELF_THICKNESS = 0.15
const SHELF_WIDTH = 11.0
const SHELF_DEPTH = 1.6
const CABINET_HEIGHT = SHELF_HEIGHTS.reduce((a, b) => a + b, 0) + SHELF_THICKNESS * (SHELF_COUNT + 1)
const CABINET_DEPTH = SHELF_DEPTH + 0.25
const GAP = 0.08

function shelfBottomY(index: number): number {
  let y = 0
  for (let i = 0; i < index; i++) y += SHELF_HEIGHTS[i] + SHELF_THICKNESS
  return y
}

// ---------- Composants ----------

function Mur() {
  return (
    <mesh position={[0, CABINET_HEIGHT / 2, -CABINET_DEPTH / 2 - 0.3]}>
      <planeGeometry args={[CABINET_HEIGHT * 1.2, CABINET_HEIGHT + 2]} />
      <meshStandardMaterial color="#4a6d9a" roughness={0.6} />
    </mesh>
  )
}

function Plante() {
  return (
    <group position={[-SHELF_WIDTH / 2 - 0.15, CABINET_HEIGHT + 0.1, 0.3]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.35, 0.4, 12]} />
        <meshStandardMaterial color="#c0734f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
        <meshStandardMaterial color="#5d7a3f" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#6d9a5f" roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 0.85, 0.1]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color="#7aaa5f" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Boussole() {
  return (
    <group position={[SHELF_WIDTH / 2 + 0.15, CABINET_HEIGHT + 0.15, 0.3]}>
      <mesh castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#d4a030" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial color="#8f7f3f" />
      </mesh>
    </group>
  )
}

function CadreBibliotheque() {
  const woodColor = '#b77e68'
  const woodDark = '#8b6048'
  const ft = 0.18
  const r = 0.14 // rayon d'arrondi des coins

  return (
    <group>
      {/* Panneau arrière */}
      <mesh position={[0, CABINET_HEIGHT / 2, -CABINET_DEPTH / 2 + 0.06]} receiveShadow>
        <boxGeometry args={[SHELF_WIDTH + 0.3, CABINET_HEIGHT, 0.04]} />
        <meshStandardMaterial color="#c4a882" roughness={0.9} />
      </mesh>

      {/* Côté gauche — arrondi */}
      <RoundedBox args={[ft, CABINET_HEIGHT, CABINET_DEPTH]} radius={r} position={[-SHELF_WIDTH / 2 - ft / 2, CABINET_HEIGHT / 2, 0]} castShadow>
        <meshStandardMaterial color={woodColor} roughness={0.7} />
      </RoundedBox>

      {/* Côté droit — arrondi */}
      <RoundedBox args={[ft, CABINET_HEIGHT, CABINET_DEPTH]} radius={r} position={[SHELF_WIDTH / 2 + ft / 2, CABINET_HEIGHT / 2, 0]} castShadow>
        <meshStandardMaterial color={woodColor} roughness={0.7} />
      </RoundedBox>

      {/* Dessus — arrondi */}
      <RoundedBox args={[SHELF_WIDTH + 0.5, ft, CABINET_DEPTH + 0.15]} radius={r} position={[0, CABINET_HEIGHT + ft / 2, 0]} castShadow>
        <meshStandardMaterial color={woodDark} roughness={0.6} />
      </RoundedBox>

      {/* Dessous */}
      <mesh position={[0, -ft / 2, 0]}>
        <boxGeometry args={[SHELF_WIDTH + 0.5, ft, CABINET_DEPTH + 0.15]} />
        <meshStandardMaterial color={woodDark} roughness={0.6} />
      </mesh>

      {/* Pieds avant */}
      {[-1, 1].map(side => (
        <mesh key={`pied-${side}`} position={[side * (SHELF_WIDTH / 2 - 0.3), -ft / 2 - 0.25, CABINET_DEPTH / 2 - 0.05]}>
          <cylinderGeometry args={[0.04, 0.06, 0.3, 8]} />
          <meshStandardMaterial color={woodDark} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Etageres() {
  const woodColor = '#c48f6f'
  const r = 0.06
  // Positions corrigées : chaque planche est SOUS le compartiment qu'elle supporte
  const positions: number[] = []
  positions.push(SHELF_THICKNESS / 2)                            // planche du bas
  for (let i = 1; i < SHELF_COUNT; i++) {
    positions.push(shelfBottomY(i) - SHELF_THICKNESS / 2)        // planches intermédiaires
  }
  positions.push(CABINET_HEIGHT - SHELF_THICKNESS / 2)           // planche du haut

  return (
    <group>
      {positions.map((y, i) => (
        <RoundedBox key={i} args={[SHELF_WIDTH, SHELF_THICKNESS, SHELF_DEPTH]} radius={r} position={[0, y, 0]} receiveShadow castShadow>
          <meshStandardMaterial color={woodColor} roughness={0.8} />
        </RoundedBox>
      ))}
    </group>
  )
}

function Livres({ books, onSelectBook, selectedId }: {
  books: Book3D[]
  onSelectBook: (id: string) => void
  selectedId: string | null
}) {
  const booksByShelf: Book3D[][] = Array.from({ length: SHELF_COUNT }, () => [])
  for (const book of books) booksByShelf[book.shelf]?.push(book)

  return (
    <group>
      {booksByShelf.map((shelfBooks, shelfIndex) => {
        const sorted = [...shelfBooks].sort((a, b) => a.order - b.order)
        let cursorX = -SHELF_WIDTH / 2 + 0.25
        const baseY = shelfBottomY(shelfIndex) + SHELF_THICKNESS + 0.04

        return sorted.map((book) => {
          const depthOffset = (Math.sin(book.order * 2.7) * 0.08)
          const x = cursorX + book.thickness / 2
          const pos: [number, number, number] = [x, baseY, depthOffset]
          cursorX += book.thickness + GAP

          return (
            <Livre3D
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              thickness={book.thickness}
              height={Math.min(book.height, SHELF_HEIGHTS[shelfIndex] - 0.08)}
              depth={SHELF_DEPTH - 0.25}
              color={book.coverColor}
              position={pos}
              selected={book.id === selectedId}
              onSelect={onSelectBook}
            />
          )
        })
      })}
    </group>
  )
}

// ---------- Scene principale ----------

export default function BibliothequeScene({ className, bibliothequeId }: { className?: string; bibliothequeId?: number }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book3D | null>(null)
  const [books, setBooks] = useState<Book3D[]>(SAMPLE_BOOKS)
  const [bibliothequeNom, setBibliothequeNom] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Charger les livres depuis la DB si un ID est fourni
  useEffect(() => {
    if (!bibliothequeId) return
    setLoading(true)
    fetch(`/api/bibliotheques/${bibliothequeId}`)
      .then(r => r.json())
      .then(data => {
        const b = data.bibliotheque
        setBibliothequeNom(b.nom || '')
        const loaded: Book3D[] = (b.livres || []).map((l: any, i: number) => ({
          id: String(l.id),
          title: l.titre,
          author: l.auteur,
          genre: l.genre || 'classique',
          thickness: l.epaisseur ?? 0.6,
          height: l.hauteur ?? 2.0,
          coverColor: l.couleur_dos || genreColor(l.genre || 'classique', i),
          shelf: l.etagere ?? 0,
          order: Math.floor(l.position_x / 0.6) || i,
        }))
        setBooks(loaded)
      })
      .catch(() => { /* fallback SAMPLE_BOOKS */ })
      .finally(() => setLoading(false))
  }, [bibliothequeId])

  const currentBooks = books.length > 0 ? books : SAMPLE_BOOKS

  const handleSelectBook = (id: string) => {
    setSelectedId(id === selectedId ? null : id)
    setSelectedBook(currentBooks.find(b => b.id === id) ?? null)
  }

  return (
    <div className={`relative ${className ?? ''}`} style={{ background: '#4f5a73', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, CABINET_HEIGHT * 0.5, CABINET_HEIGHT * 1.25], fov: 50 }}
        onCreated={(state) => { 
          state.gl.setClearColor('#4f5a73', 1)
        }}
        onPointerMissed={() => { setSelectedId(null); setSelectedBook(null) }}
      >
        <ambientLight intensity={0.25} color="#ffe4c4" />
        <directionalLight
          position={[2, 6, 4]}
          intensity={0.2}
          color="#ffd9a0"
        />
        <pointLight
          position={[0, CABINET_HEIGHT + 1.5, -1]}
          intensity={0.08}
          color="#ffeedd"
        />
        <directionalLight
          position={[-1, 2, -2]}
          intensity={0.06}
          color="#ffccaa"
        />

        <Fond />
        <Mur />
        <Plante />
        <Boussole />
        <CadreBibliotheque />
        <Etageres />
        <Livres
          books={currentBooks}
          onSelectBook={handleSelectBook}
          selectedId={selectedId}
        />

        {/* ZOOM uniquement */}
        <OrbitControls
          enableRotate={false}
          enablePan={false}
          enableZoom
          enableDamping
          dampingFactor={0.1}
          minDistance={CABINET_HEIGHT * 0.2}
          maxDistance={CABINET_HEIGHT * 2.2}
          target={[0, CABINET_HEIGHT / 2, 0]}
        />
      </Canvas>

      {selectedBook && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-900/85 text-white rounded-xl px-5 py-2.5 shadow-xl border border-amber-700 max-w-sm text-center backdrop-blur-sm">
          <p className="font-bold text-sm tracking-tight">{selectedBook.title}</p>
          <p className="text-amber-300 text-[11px]">{selectedBook.author}</p>
        </div>
      )}
    </div>
  )
}
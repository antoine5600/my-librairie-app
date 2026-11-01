'use client'

import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Vector3 } from 'three'
import Livre3D from './Livre3D'
import type { Book3D } from './types'

// ---------- Données d'exemple ----------
const SAMPLE_BOOKS: Book3D[] = [
  { id: '1', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', thickness: 0.6, height: 2.2, coverColor: '#4a90d9', shelf: 0, order: 0 },
  { id: '2', title: '1984', author: 'George Orwell', thickness: 0.8, height: 2.4, coverColor: '#c0392b', shelf: 0, order: 1 },
  { id: '3', title: 'Dune', author: 'Frank Herbert', thickness: 1.0, height: 2.6, coverColor: '#8e44ad', shelf: 0, order: 2 },
  { id: '4', title: 'Fondation', author: 'Isaac Asimov', thickness: 0.7, height: 2.3, coverColor: '#2980b9', shelf: 0, order: 3 },
  { id: '5', title: 'Le Seigneur des Anneaux', author: 'J.R.R. Tolkien', thickness: 1.2, height: 2.8, coverColor: '#27ae60', shelf: 0, order: 4 },
  { id: '6', title: 'Harry Potter à l\'école des sorciers', author: 'J.K. Rowling', thickness: 0.9, height: 2.5, coverColor: '#e67e22', shelf: 0, order: 5 },
  { id: '7', title: 'Pride and Prejudice', author: 'Jane Austen', thickness: 0.6, height: 2.1, coverColor: '#e84393', shelf: 1, order: 0 },
  { id: '8', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', thickness: 0.5, height: 2.0, coverColor: '#00b894', shelf: 1, order: 1 },
  { id: '9', title: 'Brave New World', author: 'Aldous Huxley', thickness: 0.7, height: 2.3, coverColor: '#6c5ce7', shelf: 1, order: 2 },
  { id: '10', title: 'The Hobbit', author: 'J.R.R. Tolkien', thickness: 0.8, height: 2.4, coverColor: '#d63031', shelf: 1, order: 3 },
  { id: '11', title: 'Neuromancien', author: 'William Gibson', thickness: 0.6, height: 2.2, coverColor: '#2d3436', shelf: 1, order: 4 },
  { id: '12', title: 'Le Comte de Monte-Cristo', author: 'Alexandre Dumas', thickness: 1.1, height: 2.7, coverColor: '#b7950b', shelf: 1, order: 5 },
  { id: '13', title: 'Les Trois Mousquetaires', author: 'Alexandre Dumas', thickness: 0.9, height: 2.5, coverColor: '#cd6133', shelf: 2, order: 0 },
  { id: '14', title: 'Blade Runner', author: 'Philip K. Dick', thickness: 0.5, height: 2.0, coverColor: '#1e3799', shelf: 2, order: 1 },
  { id: '15', title: 'L\'Étranger', author: 'Albert Camus', thickness: 0.5, height: 2.1, coverColor: '#78e08f', shelf: 2, order: 2 },
  { id: '16', title: 'La Peste', author: 'Albert Camus', thickness: 0.6, height: 2.2, coverColor: '#fa983a', shelf: 2, order: 3 },
  { id: '17', title: 'Les Misérables', author: 'Victor Hugo', thickness: 1.3, height: 2.9, coverColor: '#0c2461', shelf: 2, order: 4 },
  { id: '18', title: 'Orgueil et Préjugés', author: 'Jane Austen', thickness: 0.6, height: 2.1, coverColor: '#eccc68', shelf: 2, order: 5 },
  { id: '19', title: 'Le Nom de la Rose', author: 'Umberto Eco', thickness: 0.8, height: 2.4, coverColor: '#b33939', shelf: 3, order: 0 },
  { id: '20', title: 'Cent ans de solitude', author: 'Gabriel García Márquez', thickness: 0.7, height: 2.3, coverColor: '#218c74', shelf: 3, order: 1 },
  { id: '21', title: 'La Guerre des Mondes', author: 'H.G. Wells', thickness: 0.6, height: 2.2, coverColor: '#8854d0', shelf: 3, order: 2 },
  { id: '22', title: 'Vingt mille lieues sous les mers', author: 'Jules Verne', thickness: 0.8, height: 2.4, coverColor: '#0abde3', shelf: 3, order: 3 },
  { id: '23', title: 'Dracula', author: 'Bram Stoker', thickness: 0.7, height: 2.3, coverColor: '#eb2f06', shelf: 3, order: 4 },
]

// ---------- Paramètres de la bibliothèque ----------
const SHELF_COUNT = 4
const SHELF_HEIGHTS = [3.0, 2.8, 2.8, 3.0] // hauteur disponible sur chaque étagère
const SHELF_THICKNESS = 0.2
const SHELF_WIDTH = 8.0
const SHELF_DEPTH = 1.8
const CABINET_HEIGHT = SHELF_HEIGHTS.reduce((a, b) => a + b, 0) + SHELF_THICKNESS * (SHELF_COUNT + 1)
const CABINET_DEPTH = SHELF_DEPTH + 0.3
const GAP = 0.12 // espace entre les livres

// Calcul de la position Y du dessous de chaque étagère
function shelfBottomY(index: number): number {
  let y = 0
  for (let i = 0; i < index; i++) {
    y += SHELF_HEIGHTS[i] + SHELF_THICKNESS
  }
  return y
}

// ---------- Composants de la scène ----------

function Sol() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#2c2c2c" roughness={0.9} />
    </mesh>
  )
}

function Mur() {
  return (
    <mesh position={[0, CABINET_HEIGHT / 2, -CABINET_DEPTH / 2 - 0.5]} receiveShadow>
      <planeGeometry args={[12, 10]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
    </mesh>
  )
}

function CadreBibliotheque() {
  const woodColor = '#5d4037'
  const frameThickness = 0.2

  return (
    <group>
      {/* Panneau arrière */}
      <mesh position={[0, CABINET_HEIGHT / 2, -CABINET_DEPTH / 2 + 0.05]} receiveShadow>
        <boxGeometry args={[SHELF_WIDTH + 0.4, CABINET_HEIGHT, 0.05]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>

      {/* Côté gauche */}
      <mesh position={[-SHELF_WIDTH / 2 - frameThickness / 2, CABINET_HEIGHT / 2, 0]}>
        <boxGeometry args={[frameThickness, CABINET_HEIGHT, CABINET_DEPTH]} />
        <meshStandardMaterial color={woodColor} roughness={0.7} />
      </mesh>

      {/* Côté droit */}
      <mesh position={[SHELF_WIDTH / 2 + frameThickness / 2, CABINET_HEIGHT / 2, 0]}>
        <boxGeometry args={[frameThickness, CABINET_HEIGHT, CABINET_DEPTH]} />
        <meshStandardMaterial color={woodColor} roughness={0.7} />
      </mesh>

      {/* Dessus */}
      <mesh position={[0, CABINET_HEIGHT + frameThickness / 2, 0]}>
        <boxGeometry args={[SHELF_WIDTH + 0.6, frameThickness, CABINET_DEPTH + 0.2]} />
        <meshStandardMaterial color="#4e342e" roughness={0.6} />
      </mesh>

      {/* Dessous */}
      <mesh position={[0, -frameThickness / 2, 0]}>
        <boxGeometry args={[SHELF_WIDTH + 0.6, frameThickness, CABINET_DEPTH + 0.2]} />
        <meshStandardMaterial color="#4e342e" roughness={0.6} />
      </mesh>
    </group>
  )
}

function Etageres() {
  const woodColor = '#6d4c41'
  const shelfPositions = Array.from({ length: SHELF_COUNT + 1 }, (_, i) => {
    if (i === 0) return -SHELF_THICKNESS / 2
    if (i === SHELF_COUNT) return shelfBottomY(SHELF_COUNT) + SHELF_HEIGHTS[SHELF_COUNT - 1] + SHELF_THICKNESS / 2
    return shelfBottomY(i) + SHELF_HEIGHTS[i - 1] + SHELF_THICKNESS / 2
  })

  return (
    <group>
      {shelfPositions.map((y, i) => (
        <mesh key={i} position={[0, y, 0]} receiveShadow castShadow>
          <boxGeometry args={[SHELF_WIDTH, SHELF_THICKNESS, SHELF_DEPTH]} />
          <meshStandardMaterial color={woodColor} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Livres({ books, onSelectBook, selectedId }: {
  books: Book3D[]
  onSelectBook: (id: string) => void
  selectedId: string | null
}) {
  // Grouper les livres par étagère
  const booksByShelf: Book3D[][] = Array.from({ length: SHELF_COUNT }, () => [])
  for (const book of books) {
    booksByShelf[book.shelf]?.push(book)
  }

  return (
    <group>
      {booksByShelf.map((shelfBooks, shelfIndex) => {
        // Trier par order
        const sorted = [...shelfBooks].sort((a, b) => a.order - b.order)

        // Calculer l'espace total occupé
        let cursorX = -SHELF_WIDTH / 2 + 0.3
        const baseY = shelfBottomY(shelfIndex) + SHELF_THICKNESS + 0.05

        return sorted.map((book) => {
          const x = cursorX + book.thickness / 2
          const pos: [number, number, number] = [x, baseY, 0]
          cursorX += book.thickness + GAP

          return (
            <Livre3D
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              thickness={book.thickness}
              height={Math.min(book.height, SHELF_HEIGHTS[shelfIndex] - 0.1)}
              depth={SHELF_DEPTH - 0.2}
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

export default function BibliothequeScene({ className }: { className?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book3D | null>(null)

  const handleSelectBook = (id: string) => {
    setSelectedId(id === selectedId ? null : id)
    const book = SAMPLE_BOOKS.find(b => b.id === id)
    setSelectedBook(book ?? null)
  }

  return (
    <div className={`relative ${className ?? ''}`}>
      <Canvas
        camera={{ position: [8, 5, 8], fov: 45 }}
        shadows
        gl={{ antialias: true }}
        onPointerMissed={() => { setSelectedId(null); setSelectedBook(null) }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-3, 5, -2]} intensity={0.3} />

        <Sol />
        <Mur />
        <CadreBibliotheque />
        <Etageres />
        <Livres
          books={SAMPLE_BOOKS}
          onSelectBook={handleSelectBook}
          selectedId={selectedId}
        />

        <ContactShadows position={[0, -0.05, 0]} opacity={0.4} scale={15} blur={2} />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, CABINET_HEIGHT / 2, 0]}
        />
      </Canvas>

      {/* Info du livre sélectionné */}
      {selectedBook && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white rounded-xl px-6 py-3 shadow-xl border border-slate-700 backdrop-blur-sm max-w-md text-center">
          <p className="font-bold text-sm">{selectedBook.title}</p>
          <p className="text-slate-400 text-xs">{selectedBook.author}</p>
        </div>
      )}
    </div>
  )
}
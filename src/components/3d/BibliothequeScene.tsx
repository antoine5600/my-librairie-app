'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { RoundedBox, ContactShadows, OrbitControls } from '@react-three/drei'
import Livre3D from './Livre3D'
import type { Book3D } from './types'

// ---------- Données d'exemple (style Tiny Bookshop) ----------
const SAMPLE_BOOKS: Book3D[] = [
  { id: '1', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', thickness: 0.5, height: 1.8, coverColor: '#d4a574', shelf: 0, order: 0 },
  { id: '2', title: '1984', author: 'George Orwell', thickness: 0.7, height: 2.0, coverColor: '#c0392b', shelf: 0, order: 1 },
  { id: '3', title: 'Dune', author: 'Frank Herbert', thickness: 0.9, height: 2.2, coverColor: '#8e6f4e', shelf: 0, order: 2 },
  { id: '4', title: 'Fondation', author: 'Isaac Asimov', thickness: 0.6, height: 2.0, coverColor: '#5b7fbf', shelf: 0, order: 3 },
  { id: '5', title: 'Le Seigneur des Anneaux', author: 'J.R.R. Tolkien', thickness: 1.0, height: 2.4, coverColor: '#5d8a5e', shelf: 0, order: 4 },
  { id: '6', title: 'Harry Potter', author: 'J.K. Rowling', thickness: 0.8, height: 2.1, coverColor: '#b85a2d', shelf: 0, order: 5 },
  { id: '7', title: 'Orgueil et Préjugés', author: 'Jane Austen', thickness: 0.5, height: 1.8, coverColor: '#d4a7c4', shelf: 0, order: 6 },
  { id: '8', title: 'Gatsby le Magnifique', author: 'F. Scott Fitzgerald', thickness: 0.5, height: 1.7, coverColor: '#7fbf7f', shelf: 0, order: 7 },
  { id: '9', title: 'Brave New World', author: 'Aldous Huxley', thickness: 0.6, height: 2.0, coverColor: '#6c5ce7', shelf: 0, order: 8 },
  { id: '10', title: 'The Hobbit', author: 'J.R.R. Tolkien', thickness: 0.7, height: 2.1, coverColor: '#bf6f3f', shelf: 1, order: 0 },
  { id: '11', title: 'Neuromancien', author: 'William Gibson', thickness: 0.5, height: 1.9, coverColor: '#3f3f5f', shelf: 1, order: 1 },
  { id: '12', title: 'Monte-Cristo', author: 'Alexandre Dumas', thickness: 1.0, height: 2.3, coverColor: '#8f6f3f', shelf: 1, order: 2 },
  { id: '13', title: 'Les Trois Mousquetaires', author: 'Alexandre Dumas', thickness: 0.8, height: 2.1, coverColor: '#bf3030', shelf: 1, order: 3 },
  { id: '14', title: 'Blade Runner', author: 'Philip K. Dick', thickness: 0.5, height: 1.7, coverColor: '#1f3f7f', shelf: 1, order: 4 },
  { id: '15', title: "L'Étranger", author: 'Albert Camus', thickness: 0.4, height: 1.8, coverColor: '#7fbf8f', shelf: 1, order: 5 },
  { id: '16', title: 'La Peste', author: 'Albert Camus', thickness: 0.5, height: 1.9, coverColor: '#bf8f3f', shelf: 1, order: 6 },
  { id: '17', title: 'Les Misérables', author: 'Victor Hugo', thickness: 1.2, height: 2.5, coverColor: '#1f3f3f', shelf: 1, order: 7 },
  { id: '18', title: 'Le Nom de la Rose', author: 'Umberto Eco', thickness: 0.7, height: 2.1, coverColor: '#7f3f3f', shelf: 2, order: 0 },
  { id: '19', title: 'Cent ans de solitude', author: 'Gabriel García Márquez', thickness: 0.6, height: 2.0, coverColor: '#3f7f5f', shelf: 2, order: 1 },
  { id: '20', title: 'La Guerre des Mondes', author: 'H.G. Wells', thickness: 0.5, height: 1.9, coverColor: '#7f5fbf', shelf: 2, order: 2 },
  { id: '21', title: '20 000 lieues sous les mers', author: 'Jules Verne', thickness: 0.7, height: 2.1, coverColor: '#3f7f8f', shelf: 2, order: 3 },
  { id: '22', title: 'Dracula', author: 'Bram Stoker', thickness: 0.6, height: 2.0, coverColor: '#bf3f1f', shelf: 2, order: 4 },
  { id: '23', title: 'Frankenstein', author: 'Mary Shelley', thickness: 0.6, height: 2.0, coverColor: '#5f7f3f', shelf: 2, order: 5 },
  { id: '24', title: 'Jane Eyre', author: 'Charlotte Brontë', thickness: 0.7, height: 2.1, coverColor: '#8f5f7f', shelf: 2, order: 6 },
  { id: '25', title: 'Crime et Châtiment', author: 'Fiodor Dostoïevski', thickness: 0.9, height: 2.3, coverColor: '#3f3f1f', shelf: 2, order: 7 },
  { id: '26', title: 'Moby Dick', author: 'Herman Melville', thickness: 0.8, height: 2.2, coverColor: '#5f7f8f', shelf: 2, order: 8 },
  { id: '27', title: 'La Ferme des Animaux', author: 'George Orwell', thickness: 0.4, height: 1.6, coverColor: '#af6f3f', shelf: 3, order: 0 },
  { id: '28', title: 'Sa Majesté des Mouches', author: 'William Golding', thickness: 0.5, height: 1.8, coverColor: '#6f8f3f', shelf: 3, order: 1 },
  { id: '29', title: 'Le Vieil Homme et la Mer', author: 'Ernest Hemingway', thickness: 0.4, height: 1.7, coverColor: '#6f9fbf', shelf: 3, order: 2 },
  { id: '30', title: 'Autant en emporte le vent', author: 'Margaret Mitchell', thickness: 1.0, height: 2.3, coverColor: '#bf8f6f', shelf: 3, order: 3 },
  { id: '31', title: 'Les Hauts de Hurlevent', author: 'Emily Brontë', thickness: 0.6, height: 2.0, coverColor: '#5f7f7f', shelf: 3, order: 4 },
  { id: '32', title: "Tess d'Urberville", author: 'Thomas Hardy', thickness: 0.7, height: 2.1, coverColor: '#8f8f5f', shelf: 3, order: 5 },
  { id: '33', title: 'Le Parfum', author: 'Patrick Süskind', thickness: 0.5, height: 2.0, coverColor: '#5f5f3f', shelf: 3, order: 6 },
  { id: '34', title: 'Le Pendule de Foucault', author: 'Umberto Eco', thickness: 0.7, height: 2.2, coverColor: '#5f3f2f', shelf: 3, order: 7 },
]

// ---------- Paramètres bibliothèque ----------
const SHELF_COUNT = 4
const SHELF_HEIGHTS = [2.5, 2.5, 2.6, 2.4]
const SHELF_THICKNESS = 0.15
const SHELF_WIDTH = 7.0
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

function Sol() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial color="#8b7355" roughness={1.0} />
    </mesh>
  )
}

function Mur() {
  return (
    <group>
      <mesh position={[0, CABINET_HEIGHT / 2, -CABINET_DEPTH / 2 - 0.3]} receiveShadow>
        <planeGeometry args={[14, CABINET_HEIGHT + 2]} />
        <meshStandardMaterial color="#f0e6d3" roughness={0.6} />
      </mesh>
      <mesh position={[0, CABINET_HEIGHT + 1, -CABINET_DEPTH / 2 - 0.3]}>
        <planeGeometry args={[14, 0.08]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.5} />
      </mesh>
    </group>
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
  const r = 0.06 // petit arrondi pour les étagères
  const positions: number[] = []
  for (let i = 0; i <= SHELF_COUNT; i++) {
    if (i === 0) positions.push(-SHELF_THICKNESS / 2)
    else if (i === SHELF_COUNT) positions.push(shelfBottomY(SHELF_COUNT) + SHELF_HEIGHTS[SHELF_COUNT - 1] + SHELF_THICKNESS / 2)
    else positions.push(shelfBottomY(i) + SHELF_HEIGHTS[i - 1] + SHELF_THICKNESS / 2)
  }

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

export default function BibliothequeScene({ className }: { className?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book3D | null>(null)

  const handleSelectBook = (id: string) => {
    setSelectedId(id === selectedId ? null : id)
    setSelectedBook(SAMPLE_BOOKS.find(b => b.id === id) ?? null)
  }

  return (
    <div className={`relative ${className ?? ''}`}>
      <Canvas
        camera={{ position: [0, CABINET_HEIGHT * 0.45, 8], fov: 38 }}
        shadows
        gl={{ antialias: true }}
        onPointerMissed={() => { setSelectedId(null); setSelectedBook(null) }}
      >
        <ambientLight intensity={0.25} color="#ffe4c4" />
        <directionalLight
          position={[2, 6, 4]}
          intensity={0.15}
          color="#ffd9a0"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
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

        <Sol />
        <Mur />
        <Plante />
        <Boussole />
        <CadreBibliotheque />
        <Etageres />
        <Livres
          books={SAMPLE_BOOKS}
          onSelectBook={handleSelectBook}
          selectedId={selectedId}
        />

        <ContactShadows position={[0, -0.04, 0]} opacity={0.35} scale={10} blur={2.5} />

        {/* ZOOM uniquement — pas de rotation ni déplacement */}
        <OrbitControls
          enableRotate={false}
          enablePan={false}
          enableZoom
          enableDamping
          dampingFactor={0.1}
          minDistance={4}
          maxDistance={18}
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
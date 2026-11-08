'use client'

import { useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { RoundedBox, OrbitControls } from '@react-three/drei'
import Livre3D from './Livre3D'
import type { Book3D } from './types'
import { genreColor } from './genres'
import { getAmbiance, AMBIANCE_LIST } from './ambiances'

// ---------- Données de secours (si pas de bibliothequeId fourni) ----------
function Fond({ color }: { color: string }) {
  return (
    <mesh position={[0, 0, -20]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial color={color} />
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

// ========== Config étagères ==========
// Valeurs par défaut (100 livres, SAMPLE_BOOKS). Surchargées par applyConfig().
let SHELF_COUNT = 7
let SHELF_HEIGHTS: number[] = [2.4, 2.5, 2.6, 2.4, 2.5, 2.6, 2.4]
let SHELF_THICKNESS = 0.15
let SHELF_WIDTH = 11.0
let SHELF_DEPTH = 1.6
let CABINET_HEIGHT = SHELF_HEIGHTS.reduce((a, b) => a + b, 0) + SHELF_THICKNESS * (SHELF_COUNT + 1)
let CABINET_DEPTH = SHELF_DEPTH + 0.25
let GAP = 0.08

function applyConfig(capaciteMax: number) {
  const st = 0.15
  let shelves: number[], width: number
  if (capaciteMax <= 40) {
    shelves = [2.5, 2.6, 2.5]; width = 7.0         // Salon  (30)
  } else if (capaciteMax <= 70) {
    shelves = [2.4, 2.5, 2.6, 2.5, 2.4]; width = 8.5  // Bureau (50)
  } else {
    shelves = [2.4, 2.5, 2.6, 2.4, 2.5, 2.6, 2.4]; width = 11.0  // Chambre/Grenier (100)
  }
  SHELF_COUNT = shelves.length
  SHELF_HEIGHTS = shelves
  SHELF_WIDTH = width
  CABINET_HEIGHT = shelves.reduce((a, b) => a + b, 0) + st * (shelves.length + 1)
  CABINET_DEPTH = SHELF_DEPTH + 0.25
}

function shelfBottomY(index: number): number {
  let y = 0
  for (let i = 0; i < index; i++) y += SHELF_HEIGHTS[i] + SHELF_THICKNESS
  return y
}

// ---------- Composants ----------

function Mur({ color }: { color: string }) {
  return (
    <mesh position={[0, CABINET_HEIGHT / 2, -CABINET_DEPTH / 2 - 0.3]}>
      <planeGeometry args={[CABINET_HEIGHT * 1.2, CABINET_HEIGHT + 2]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

// ========== Décorations de scène ==========

/** Tapis au sol devant la bibliothèque */
function Tapis() {
  return (
    <mesh position={[0, 0.01, SHELF_DEPTH + 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[SHELF_WIDTH * 0.7, 1.2]} />
      <meshStandardMaterial color="#6b4c3f" roughness={0.9} />
    </mesh>
  )
}

function Fauteuil() {
  return (
    <group position={[SHELF_WIDTH / 3, 0, SHELF_DEPTH + 0.6]}>
      <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.5, 0.3, 0.3]} /><meshStandardMaterial color="#8b6048" roughness={0.8} /></mesh>
      <mesh position={[0, 0.35, -0.15]}><boxGeometry args={[0.5, 0.4, 0.08]} /><meshStandardMaterial color="#a07050" roughness={0.8} /></mesh>
      <mesh position={[-0.22, 0.25, 0]}><boxGeometry args={[0.06, 0.4, 0.3]} /><meshStandardMaterial color="#8b6048" roughness={0.8} /></mesh>
      <mesh position={[0.22, 0.25, 0]}><boxGeometry args={[0.06, 0.4, 0.3]} /><meshStandardMaterial color="#8b6048" roughness={0.8} /></mesh>
    </group>
  )
}

function TableBasse() {
  return (
    <group position={[-SHELF_WIDTH / 3, 0, SHELF_DEPTH + 0.7]}>
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.4, 0.05, 0.3]} /><meshStandardMaterial color="#6b4c3f" roughness={0.7} /></mesh>
      <mesh position={[-0.15, 0.1, -0.1]}><cylinderGeometry args={[0.03, 0.04, 0.2, 6]} /><meshStandardMaterial color="#5d4037" roughness={0.8} /></mesh>
      <mesh position={[0.15, 0.1, -0.1]}><cylinderGeometry args={[0.03, 0.04, 0.2, 6]} /><meshStandardMaterial color="#5d4037" roughness={0.8} /></mesh>
      <mesh position={[-0.15, 0.1, 0.1]}><cylinderGeometry args={[0.03, 0.04, 0.2, 6]} /><meshStandardMaterial color="#5d4037" roughness={0.8} /></mesh>
      <mesh position={[0.15, 0.1, 0.1]}><cylinderGeometry args={[0.03, 0.04, 0.2, 6]} /><meshStandardMaterial color="#5d4037" roughness={0.8} /></mesh>
    </group>
  )
}

function PetiteTable() {
  return (
    <group position={[SHELF_WIDTH / 3, 0, SHELF_DEPTH + 0.6]}>
      <mesh position={[0, 0.25, 0]}><boxGeometry args={[0.3, 0.04, 0.25]} /><meshStandardMaterial color="#374151" roughness={0.6} /></mesh>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.03, 0.03, 0.25, 6]} /><meshStandardMaterial color="#4a5568" roughness={0.7} /></mesh>
    </group>
  )
}

function Lit() {
  return (
    <group position={[SHELF_WIDTH / 4, 0, SHELF_DEPTH + 0.4]}>
      <mesh position={[0, 0.15, 0]}><boxGeometry args={[1.2, 0.1, 0.6]} /><meshStandardMaterial color="#5d4037" roughness={0.7} /></mesh>
      <mesh position={[0, 0.25, 0]}><boxGeometry args={[1.1, 0.1, 0.5]} /><meshStandardMaterial color="#d4c8b0" roughness={0.9} /></mesh>
      <mesh position={[0, 0.35, 0]}><boxGeometry args={[1.0, 0.15, 0.4]} /><meshStandardMaterial color="#e8dcc8" roughness={0.9} /></mesh>
      <mesh position={[-0.55, 0.08, -0.25]}><cylinderGeometry args={[0.04, 0.06, 0.2, 6]} /><meshStandardMaterial color="#5d4037" roughness={0.8} /></mesh>
      <mesh position={[0.55, 0.08, -0.25]}><cylinderGeometry args={[0.04, 0.06, 0.2, 6]} /><meshStandardMaterial color="#5d4037" roughness={0.8} /></mesh>
      <mesh position={[-0.55, 0.08, 0.25]}><cylinderGeometry args={[0.04, 0.06, 0.2, 6]} /><meshStandardMaterial color="#5d4037" roughness={0.8} /></mesh>
      <mesh position={[0.55, 0.08, 0.25]}><cylinderGeometry args={[0.04, 0.06, 0.2, 6]} /><meshStandardMaterial color="#5d4037" roughness={0.8} /></mesh>
    </group>
  )
}

function BibliothequeGrenier() {
  return (
    <group position={[-SHELF_WIDTH / 3, 0, SHELF_DEPTH + 0.5]}>
      <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.35, 0.25, 0.35]} /><meshStandardMaterial color="#4e342e" roughness={0.9} /></mesh>
      <mesh position={[-0.1, 0.35, 0]}><boxGeometry args={[0.25, 0.15, 0.3]} /><meshStandardMaterial color="#5d4037" roughness={0.9} /></mesh>
      <mesh position={[0.1, 0.4, 0]}><boxGeometry args={[0.15, 0.2, 0.2]} /><meshStandardMaterial color="#6d4c41" roughness={0.9} /></mesh>
    </group>
  )
}

function Chat() {
  return (
    <group position={[SHELF_WIDTH / 3, 0.02, SHELF_DEPTH + 1.0]}>
      <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#f0e0d0" roughness={0.9} /></mesh>
      <mesh position={[0.08, 0.1, 0]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#f0e0d0" roughness={0.9} /></mesh>
      <mesh position={[0.04, 0.06, 0.04]}><sphereGeometry args={[0.02, 6, 6]} /><meshStandardMaterial color="#2d3436" roughness={0.9} /></mesh>
    </group>
  )
}

// Petites décos réutilisées
function Plante() { return (<group position={[-SHELF_WIDTH / 3, 0, SHELF_DEPTH + 0.5]}><mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.15, 0.25, 0.3, 12]} /><meshStandardMaterial color="#c0734f" roughness={0.8} /></mesh><mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.04, 0.04, 0.25, 6]} /><meshStandardMaterial color="#5d7a3f" /></mesh><mesh position={[0, 0.6, 0]}><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color="#6d9a5f" roughness={0.9} /></mesh></group>) }
function LampeBureau() { return (<group position={[-SHELF_WIDTH / 3, 0, SHELF_DEPTH + 0.5]}><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.12, 0.18, 0.25, 12]} /><meshStandardMaterial color="#374151" roughness={0.7} /></mesh><mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.04, 0.04, 0.3, 8]} /><meshStandardMaterial color="#6b7280" roughness={0.6} /></mesh><mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.2, 0.04, 0.25, 12]} /><meshStandardMaterial color="#9ca3af" roughness={0.5} /></mesh></group>) }
function VaseFleurs() { return (<group position={[-SHELF_WIDTH / 3, 0, SHELF_DEPTH + 0.5]}><mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.1, 0.15, 0.25, 10]} /><meshStandardMaterial color="#e8d5c4" roughness={0.8} /></mesh><mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.15, 6, 6]} /><meshStandardMaterial color="#f0a0b0" roughness={0.9} /></mesh><mesh position={[0.08, 0.4, 0.05]}><sphereGeometry args={[0.1, 6, 6]} /><meshStandardMaterial color="#e08090" roughness={0.9} /></mesh></group>) }
function Caisses() { return (<group position={[-SHELF_WIDTH / 3, 0, SHELF_DEPTH + 0.5]}><mesh position={[0.05, 0.12, 0]}><boxGeometry args={[0.25, 0.25, 0.25]} /><meshStandardMaterial color="#6d4c41" roughness={0.8} /></mesh><mesh position={[-0.1, 0.25, 0]}><boxGeometry args={[0.2, 0.15, 0.25]} /><meshStandardMaterial color="#8b6048" roughness={0.8} /></mesh></group>) }

function SceneDecor({ ambianceId }: { ambianceId?: string }) {
  return (
    <group>
      <Tapis />
      {ambianceId === 'sombre' && (
        <>
          <LampeBureau />
          <PetiteTable />
        </>
      )}
      {ambianceId === 'clair' && (
        <>
          <VaseFleurs />
          <Lit />
        </>
      )}
      {ambianceId === 'rustique' && (
        <>
          <Caisses />
          <BibliothequeGrenier />
        </>
      )}
      {(!ambianceId || ambianceId === 'classique') && (
        <>
          <Plante />
          <Fauteuil />
          <TableBasse />
          <Chat />
        </>
      )}
    </group>
  )
}

function Boussole() {
  return (
    <group position={[SHELF_WIDTH / 2 + 0.15, CABINET_HEIGHT + 0.15, 0.3]}>
      <mesh><sphereGeometry args={[0.08, 12, 12]} /><meshStandardMaterial color="#d4a030" roughness={0.3} metalness={0.4} /></mesh>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.02, 0.02, 0.15, 8]} /><meshStandardMaterial color="#8f7f3f" /></mesh>
    </group>
  )
}

function CadreBibliotheque({ bois, boisFonce }: { bois: string; boisFonce: string }) {
  const ft = 0.18
  const r = 0.14

  return (
    <group>
      {/* Panneau arrière */}
      <mesh position={[0, CABINET_HEIGHT / 2, -CABINET_DEPTH / 2 + 0.06]} receiveShadow>
        <boxGeometry args={[SHELF_WIDTH + 0.3, CABINET_HEIGHT, 0.04]} />
        <meshStandardMaterial color="#c4a882" roughness={0.9} />
      </mesh>

      {/* Côté gauche — arrondi */}
      <RoundedBox args={[ft, CABINET_HEIGHT, CABINET_DEPTH]} radius={r} position={[-SHELF_WIDTH / 2 - ft / 2, CABINET_HEIGHT / 2, 0]} castShadow>
        <meshStandardMaterial color={bois} roughness={0.7} />
      </RoundedBox>

      {/* Côté droit — arrondi */}
      <RoundedBox args={[ft, CABINET_HEIGHT, CABINET_DEPTH]} radius={r} position={[SHELF_WIDTH / 2 + ft / 2, CABINET_HEIGHT / 2, 0]} castShadow>
        <meshStandardMaterial color={bois} roughness={0.7} />
      </RoundedBox>

      {/* Dessus — arrondi */}
      <RoundedBox args={[SHELF_WIDTH + 0.5, ft, CABINET_DEPTH + 0.15]} radius={r} position={[0, CABINET_HEIGHT + ft / 2, 0]} castShadow>
        <meshStandardMaterial color={boisFonce} roughness={0.6} />
      </RoundedBox>

      {/* Dessous */}
      <mesh position={[0, -ft / 2, 0]}>
        <boxGeometry args={[SHELF_WIDTH + 0.5, ft, CABINET_DEPTH + 0.15]} />
        <meshStandardMaterial color={boisFonce} roughness={0.6} />
      </mesh>

      {/* Pieds avant */}
      {[-1, 1].map(side => (
        <mesh key={`pied-${side}`} position={[side * (SHELF_WIDTH / 2 - 0.3), -ft / 2 - 0.25, CABINET_DEPTH / 2 - 0.05]}>
          <cylinderGeometry args={[0.04, 0.06, 0.3, 8]} />
          <meshStandardMaterial color={boisFonce} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Etageres({ boisEtagere }: { boisEtagere: string }) {
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
          <meshStandardMaterial color={boisEtagere} roughness={0.8} />
        </RoundedBox>
      ))}
    </group>
  )
}

function Livres({ books, onSelectBook, selectedId, draggingId, dragTarget, onPointerDownBook }:
{
  books: Book3D[]
  onSelectBook: (id: string) => void
  selectedId: string | null
  draggingId: string | null
  dragTarget: { shelf: number; x: number } | null
  onPointerDownBook: (id: string) => void
}) {
  const booksByShelf: Book3D[][] = Array.from({ length: SHELF_COUNT }, () => [])
  for (const book of books) {
    if (book.id !== draggingId) booksByShelf[book.shelf]?.push(book)
  }

  return (
    <group>
      {booksByShelf.map((shelfBooks, shelfIndex) => {
        const baseY = shelfBottomY(shelfIndex) + SHELF_THICKNESS + 0.04

        return shelfBooks.map((book) => {
          // Placement libre par positionX — ou fallback ordre séquentiel
          let x: number
          if (typeof book.positionX === 'number') {
            x = -SHELF_WIDTH / 2 + 0.25 + book.positionX + book.thickness / 2
          } else {
            // Fallback séquentiel pour anciennes données / SAMPLE_BOOKS
            const sorted = [...shelfBooks].filter(b => !b.positionX && b.order !== undefined).sort((a, b) => a.order - b.order)
            const idx = sorted.findIndex(b => b.id === book.id)
            x = -SHELF_WIDTH / 2 + 0.25 + (idx >= 0 ? sorted.slice(0, idx).reduce((s, b) => s + b.thickness + GAP, 0) : 0) + book.thickness / 2
          }

          const depthOffset = (typeof book.positionX === 'number' ? Math.sin(book.positionX * 5) : Math.sin(book.order * 2.7)) * 0.08
          const pos: [number, number, number] = [x, baseY, depthOffset]

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
              onPointerDownBook={onPointerDownBook}
              dragging={book.id === draggingId}
            />
          )
        })
      })}
      {/* Livre en cours de glissement */}
      {draggingId && dragTarget && (() => {
        const book = books.find(b => b.id === draggingId)
        if (!book) return null
        const baseY = shelfBottomY(dragTarget.shelf) + SHELF_THICKNESS + 0.04
        return (
          <Livre3D
            key={`drag-${book.id}`}
            id={book.id}
            title={book.title}
            author={book.author}
            thickness={book.thickness}
            height={Math.min(book.height, SHELF_HEIGHTS[dragTarget.shelf] - 0.08)}
            depth={SHELF_DEPTH - 0.25}
            color={book.coverColor}
            position={[dragTarget.x, baseY, 0.5]}
            selected={false}
            onSelect={() => {}}
            onPointerDownBook={() => {}}
            dragging={true}
          />
        )
      })()}
    </group>
  )
}

// ---------- Scene principale ----------

export default function BibliothequeScene({ className, bibliothequeId, ambianceId, capaciteMax, onChange }: { className?: string; bibliothequeId?: number; ambianceId?: string; capaciteMax?: number; onChange?: () => void }) {
  // Appliquer la config selon capacité
  applyConfig(capaciteMax || 100)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book3D | null>(null)
  const [books, setBooks] = useState<Book3D[]>(SAMPLE_BOOKS)
  const [bibliothequeNom, setBibliothequeNom] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const ambiance = getAmbiance(ambianceId || 'classique')

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
          positionX: typeof l.position_x === 'number' ? l.position_x : undefined,
          associationId: l.association_id,
          statut: l.statut || 'present',
          emprunteur: l.emprunteur,
        }))
        setBooks(loaded)
      })
      .catch(() => { /* fallback SAMPLE_BOOKS */ })
      .finally(() => setLoading(false))
  }, [bibliothequeId])

  const currentBooks = books.length > 0 ? books.filter((b) => !b.statut || b.statut === 'present') : SAMPLE_BOOKS

  // Drag & Drop
  const [dragState, setDragState] = useState<{ id: string; shelf: number; x: number } | null>(null)
  const [dragCandidate, setDragCandidate] = useState<{ id: string; startX: number; startY: number; shelf: number; x: number } | null>(null)

  const handleBookPointerDown = useCallback((id: string) => {
    const book = currentBooks.find(b => b.id === id)
    if (!book) return
    setDragCandidate({ id, startX: 0, startY: 0, shelf: book.shelf, x: 0 })
  }, [currentBooks])

  // Détection du drag avec seuil de déplacement (8px)
  useEffect(() => {
    if (!dragCandidate) return
    const handleMove = (e: PointerEvent) => {
      if (dragCandidate.startX === 0 && dragCandidate.startY === 0) {
        // Premier move : initialiser la position de départ
        setDragCandidate(prev => prev ? { ...prev, startX: e.clientX, startY: e.clientY } : null)
        return
      }
      const dx = Math.abs(e.clientX - dragCandidate.startX)
      const dy = Math.abs(e.clientY - dragCandidate.startY)
      if (dx + dy > 8) {
        // Seuil atteint → démarrer le drag
        setDragState({ id: dragCandidate.id, shelf: dragCandidate.shelf, x: dragCandidate.x })
        setDragCandidate(null)
      }
    }
    const handleUp = () => setDragCandidate(null)
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [dragCandidate])

  const handleDragMove = useCallback((target: { shelf: number; x: number }) => {
    setDragState(prev => prev ? { ...prev, shelf: target.shelf, x: target.x } : null)
  }, [])

  const handleDragEnd = useCallback(async () => {
    if (!dragState || !bibliothequeId || !currentBooks) return
    const { id, shelf, x } = dragState
    const book = currentBooks.find(b => b.id === id)
    if (!book || !book.associationId) return

    const posX = Math.max(0, Math.round(((x - book.thickness / 2) + SHELF_WIDTH / 2 - 0.25) * 100) / 100)
    try {
      await fetch(`/api/bibliotheques/${bibliothequeId}/livres`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ association_id: book.associationId, etagere: shelf, position_x: posX }),
      })
      // Recharger les livres
      const res = await fetch(`/api/bibliotheques/${bibliothequeId}`)
      const data = await res.json()
      const b = data.bibliotheque
      const loaded: Book3D[] = (b.livres || []).map((l: any, i: number) => ({
        id: String(l.id), title: l.titre, author: l.auteur,
        genre: l.genre || 'classique', thickness: l.epaisseur ?? 0.6,
        height: l.hauteur ?? 2.0,
        coverColor: l.couleur_dos || genreColor(l.genre || 'classique', i),
        shelf: l.etagere ?? 0, order: Math.floor(l.position_x / 0.6) || i,
        positionX: typeof l.position_x === 'number' ? l.position_x : undefined,
        associationId: l.association_id,
        statut: l.statut || 'present',
        emprunteur: l.emprunteur,
      }))
      setBooks(loaded)
      onChange?.()
    } catch (e) {
      console.error('Erreur déplacement livre:', e)
    }
    setDragState(null)
  }, [dragState, bibliothequeId, currentBooks, onChange])

  function DragPlane() {
    return (
      <mesh
        position={[0, CABINET_HEIGHT / 2, 0.5]}
        onPointerMove={(e) => {
          e.stopPropagation()
          const clampedX = Math.max(-SHELF_WIDTH / 2 + 0.2, Math.min(SHELF_WIDTH / 2 - 0.2, e.point.x))
          let targetShelf = 0
          for (let i = SHELF_COUNT - 1; i >= 0; i--) {
            if (e.point.y >= shelfBottomY(i)) { targetShelf = i; break }
          }
          handleDragMove({ shelf: Math.min(targetShelf, SHELF_COUNT - 1), x: clampedX })
        }}
        onPointerUp={() => { handleDragEnd() }}
      >
        <planeGeometry args={[SHELF_WIDTH + 2, CABINET_HEIGHT + 2]} />
        <meshBasicMaterial transparent opacity={0.1} />
      </mesh>
    )
  }

  // Helper recharger les livres de la bibliothèque courante
  const reloadBooks = async (biblioId: number): Promise<Book3D[]> => {
    const res = await fetch(`/api/bibliotheques/${biblioId}`)
    const data = await res.json()
    const b = data.bibliotheque
    return (b.livres || []).map((l: any, i: number) => ({
      id: String(l.id), title: l.titre, author: l.auteur,
      genre: l.genre || 'classique', thickness: l.epaisseur ?? 0.6,
      height: l.hauteur ?? 2.0,
      coverColor: l.couleur_dos || genreColor(l.genre || 'classique', i),
      shelf: l.etagere ?? 0, order: Math.floor(l.position_x / 0.6) || i,
      positionX: typeof l.position_x === 'number' ? l.position_x : undefined,
      associationId: l.association_id,
      statut: l.statut || 'present',
      emprunteur: l.emprunteur,
    }))
  }

  const handleSelectBook = (id: string) => {
    setSelectedId(id === selectedId ? null : id)
    setSelectedBook(currentBooks.find(b => b.id === id) ?? null)
  }

  return (
    <div className={`relative ${className ?? ''}`} style={{ background: ambiance.sceneBg, width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, CABINET_HEIGHT * 0.5, CABINET_HEIGHT * 1.25], fov: 50 }}
        onCreated={(state) => { 
          state.gl.setClearColor(ambiance.sceneBg, 1)
        }}
        onPointerMissed={() => { setSelectedId(null); setSelectedBook(null) }}
      >
        <ambientLight intensity={ambiance.lumiereIntensity} color={ambiance.lumiere} />
        <directionalLight
          position={[2, 6, 4]}
          intensity={0.2}
          color="#ffd9a0"
        />
        <pointLight
          position={[0, CABINET_HEIGHT + 1.5, -1]}
          intensity={0.08}
          color={ambiance.lumiere}
        />
        <directionalLight
          position={[-1, 2, -2]}
          intensity={0.06}
          color={ambiance.lumiere}
        />

        <Fond color={ambiance.fond} />
        <Mur color={ambiance.mur} />
        <SceneDecor ambianceId={ambianceId} />
        <Boussole />
        <CadreBibliotheque bois={ambiance.bois} boisFonce={ambiance.boisFonce} />
        <Etageres boisEtagere={ambiance.boisEtagere} />
        <Livres
          books={currentBooks}
          onSelectBook={handleSelectBook}
          selectedId={selectedId}
          draggingId={dragState?.id ?? null}
          dragTarget={dragState ? { shelf: dragState.shelf, x: dragState.x } : null}
          onPointerDownBook={handleBookPointerDown}
        />
        {dragState && <DragPlane />}

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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-850/85 text-white rounded-xl px-4 py-2.5 shadow-xl border border-amber-700 max-w-xs backdrop-blur-sm flex flex-col items-center gap-2">
          <div className="text-center leading-tight min-w-0 w-full">
            <p className="font-bold text-sm tracking-tight">{selectedBook.title}</p>
            <p className="text-amber-300 text-[11px]">{selectedBook.author}</p>
            {selectedBook.emprunteur && (
              <p className="text-yellow-400 text-[10px] mt-0.5">📤 Prêté à {selectedBook.emprunteur}</p>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {selectedBook.associationId && bibliothequeId && (
              selectedBook.statut === 'prete' ? (
                <button
                  onClick={async () => {
                    try {
                      await fetch(`/api/bibliotheques/${bibliothequeId}/livres`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ association_id: selectedBook.associationId, statut: 'present' }),
                      })
                      reloadBooks(bibliothequeId).then((b) => { setBooks(b); onChange?.() })
                      setSelectedId(null); setSelectedBook(null)
                    } catch {}
                  }}
                  className="px-3 py-1.5 text-xs text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  📥 Récupérer
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    id={`pret-input-${selectedBook.id}`}
                    placeholder="Prêté à…"
                    className="w-20 bg-[#1f2937] text-white rounded px-2 py-1 text-[10px] border border-[#4f5a73] outline-none placeholder-[#6b7280]"
                  />
                  <button
                    onClick={async () => {
                      const nom = document.getElementById(`pret-input-${selectedBook.id}`) as HTMLInputElement
                      try {
                        await fetch(`/api/bibliotheques/${bibliothequeId}/livres`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ association_id: selectedBook.associationId, statut: 'prete', emprunteur: nom?.value || '' }),
                        })
                        reloadBooks(bibliothequeId).then((b) => { setBooks(b); onChange?.() })
                        setSelectedId(null); setSelectedBook(null)
                      } catch {}
                    }}
                    className="px-3 py-1.5 text-xs text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                  >
                    📤 Prêter
                  </button>
                </div>
              )
            )}
            {selectedBook.associationId && bibliothequeId && selectedBook.statut !== 'prete' && (
              <button
                onClick={async () => {
                  try {
                    await fetch(`/api/bibliotheques/${bibliothequeId}/livres`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ association_id: selectedBook.associationId }),
                    })
                    reloadBooks(bibliothequeId).then((b) => { setBooks(b); onChange?.() })
                    setSelectedId(null); setSelectedBook(null)
                  } catch {}
                }}
                className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                ✕ Retirer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Vector3 } from 'three'
import { Text, Html } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'

interface Livre3DProps {
  thickness: number
  height: number
  depth?: number
  color: string
  title: string
  author: string
  position: Vector3 | [number, number, number]
  onSelect?: (id: string) => void
  id?: string
  selected?: boolean
}

function darken(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount)
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount)
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function lighten(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount)
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount)
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/** Tronque le titre pour qu'il tienne sur le dos du livre */
function shortTitle(title: string, maxLen: number = 14): string {
  if (title.length <= maxLen) return title
  return title.slice(0, maxLen - 1) + '…'
}

/** Taille de police de l'auteur (horizontal, bas du dos) */
function fontSizeFor(thickness: number): number {
  return Math.max(0.08, Math.min(thickness * 0.35, 0.25))
}

/** Taille de police du titre vertical : limitée par l'épaisseur du dos */
function titleFontSize(thickness: number): number {
  return Math.max(0.09, Math.min(thickness * 0.55, 0.3))
}

/** Nombre max de caractères pour que le titre vertical tienne dans la hauteur du livre */
function titleMaxChars(title: string, height: number, fontSize: number): number {
  const available = height * 0.65 // espace vertical entre les deux filets (0.15-0.85)
  const max = Math.floor(available / (fontSize * 0.62))
  if (title.length <= max) return title.length
  return max
}

export default function Livre3D({
  thickness,
  height,
  depth = 1,
  color,
  title,
  author,
  position,
  onSelect,
  id,
  selected = false,
}: Livre3DProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (onSelect && id) onSelect(id)
  }

  const edgeColor = darken(color, 35)
  const topColor = lighten(color, 20)
  const fs = fontSizeFor(thickness)          // taille police auteur
  const ts = titleFontSize(thickness)         // taille police titre (vertical)
  const maxTitleChars = titleMaxChars(title, height, ts)
  const label = shortTitle(title, maxTitleChars)

  return (
    <group
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Corps principal — dos du livre */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[thickness, height, depth]} />
        <meshStandardMaterial
          color={hovered || selected ? '#ffd700' : color}
          roughness={hovered ? 0.3 : 0.65}
        />
      </mesh>

      {/* Tranche supérieure (dessus) — colorée */}
      <mesh position={[0, height, 0]} receiveShadow>
        <boxGeometry args={[thickness, 0.02, depth]} />
        <meshStandardMaterial color={topColor} roughness={0.7} />
      </mesh>

      {/* Tranche avant (côté pages) — colorée plus sombre */}
      <mesh position={[0, height / 2, depth / 2 + 0.01]} receiveShadow>
        <planeGeometry args={[thickness, height]} />
        <meshStandardMaterial color={edgeColor} roughness={0.8} />
      </mesh>

      {/* Filet décoratif doré haut */}
      <mesh position={[0, height * 0.15, depth / 2 + 0.02]}>
        <planeGeometry args={[thickness - 0.1, 0.04]} />
        <meshBasicMaterial color="#c4a050" />
      </mesh>

      {/* Filet décoratif doré bas */}
      <mesh position={[0, height * 0.85, depth / 2 + 0.02]}>
        <planeGeometry args={[thickness - 0.1, 0.04]} />
        <meshBasicMaterial color="#c4a050" />
      </mesh>

      {/* Titre — entre les 2 filets dorés, écrit de haut en bas */}
      {label.length > 0 && (
        <Text
          position={[0, height * 0.5, depth / 2 + 0.03]}
          rotation={[0, 0, -Math.PI / 2]}
          fontSize={ts}
          color="#f5e6c8"
          anchorX="center"
          anchorY="middle"
          maxWidth={height * 0.68}
          whiteSpace="nowrap"
          letterSpacing={0.05}
        >
          {label}
        </Text>
      )}

      {/* Auteur — sous le filet doré, en bas du livre */}
      {author.length > 0 && (
        <Text
          position={[0, height * 0.08, depth / 2 + 0.03]}
          fontSize={fs * 0.6}
          color="#d4c8a8"
          anchorX="center"
          anchorY="middle"
          maxWidth={thickness * 1.5}
          letterSpacing={0.02}
        >
          {author.length > 8 ? author.slice(0, 7) + '…' : author}
        </Text>
      )}

      {/* Effet de surbrillance au hover */}
      {hovered && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[thickness + 0.04, height + 0.04, depth + 0.04]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.18} />
        </mesh>
      )}

      {/* Tooltip au hover */}
      {hovered && (
        <Html position={[0, height + 0.6, 0]} center>
          <div className="bg-amber-900 text-white text-xs rounded-md px-3 py-1.5 whitespace-nowrap shadow-lg border border-amber-700 pointer-events-none backdrop-blur-sm">
            <p className="font-semibold">{title}</p>
            <p className="text-amber-300 text-[10px]">{author}</p>
          </div>
        </Html>
      )}
    </group>
  )
}
'use client'

import { useState } from 'react'
import { Mesh, Vector3 } from 'three'
import { Box, Plane, Html } from '@react-three/drei'
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

  // Couleurs : si plus claire pour le dos + tranche
  const spineColor = color
  const pageColor = '#f5f0e8'

  return (
    <group
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Livre — corps principal (dos visible) */}
      <mesh
        position={[0, height / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[thickness, height, depth]} />
        <meshStandardMaterial
          color={hovered || selected ? '#ffd700' : spineColor}
          roughness={hovered ? 0.3 : 0.6}
          metalness={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Pages (tranche blanche côté +Z) */}
      <mesh position={[0, height / 2, depth / 2 + 0.01]} receiveShadow>
        <planeGeometry args={[thickness, height]} />
        <meshStandardMaterial color={pageColor} roughness={0.8} />
      </mesh>

      {/* Effet de surbrillance au hover */}
      {hovered && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[thickness + 0.04, height + 0.04, depth + 0.04]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.15} />
        </mesh>
      )}

      {/* Tooltip au hover — titre et auteur */}
      {hovered && (
        <Html position={[0, height + 0.5, 0]} center>
          <div className="bg-slate-900 text-white text-xs rounded-md px-3 py-1.5 whitespace-nowrap shadow-lg border border-slate-700 pointer-events-none">
            <p className="font-semibold">{title}</p>
            <p className="text-slate-400 text-[10px]">{author}</p>
          </div>
        </Html>
      )}
    </group>
  )
}
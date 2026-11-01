# 📚 My Librairie App

Application web mobile-friendly pour visualiser et gérer sa bibliothèque personnelle avec une vue 3D.

## Stack

| Technologie | Usage |
|-------------|-------|
| **Next.js 16** + **React 19** | Framework frontend |
| **React Three Fiber** + **drei** | Rendu 3D de la bibliothèque |
| **Tailwind CSS** | Styling |
| **Turso** (SQLite cloud) | Base de données |
| **Drizzle ORM** | Accès DB |
| **Vercel** | Hébergement |

## Fonctionnalités

- ✅ **POC 3D** — Bibliothèque en bois avec étagères et livres en 3D
- 🖱️ Rotation, zoom, déplacement (OrbitControls)
- ✨ Hover avec tooltip (titre + auteur)
- 👆 Sélection de livre avec affichage d'info
- 📦 23 livres exemples préchargés

*À venir : gestion CRUD des livres, saisie textuelle avec enrichissement Google Books, multi-bibliothèques, scan ISBN, tags.*

## Pour commencer

```bash
npm install --legacy-peer-deps
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```
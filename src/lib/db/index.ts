import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'
import path from 'path'

/** En développement, utiliser SQLite local. En prod (Vercel), utiliser Turso. */
const isVercel = process.env.VERCEL === '1'

/** Construit une URL file: compatible Windows (espaces) et Unix */
const dbUrl = isVercel
  ? process.env.TURSO_DATABASE_URL!
  : `file:${path.join(process.cwd(), 'data', 'app.db').replace(/\\/g, '/')}`

const client = createClient(
  isVercel
    ? { url: dbUrl, authToken: process.env.TURSO_AUTH_TOKEN! }
    : { url: dbUrl }
)

export const db = drizzle(client, { schema })
export { schema }
export type DB = typeof db
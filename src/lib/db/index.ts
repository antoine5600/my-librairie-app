import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'
import path from 'path'

/** En développement, utiliser SQLite local. En prod (Vercel), utiliser Turso. */
const isVercel = process.env.VERCEL === '1'

const client = createClient(
  isVercel
    ? {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      }
    : { url: `file:${path.join(process.cwd(), 'data', 'app.db')}` }
)

export const db = drizzle(client, { schema })
export { schema }
export type DB = typeof db
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>
  drizzleDb?: ReturnType<typeof drizzle<typeof schema>>
}

function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing.")
  }

  const client =
    globalForDb.postgresClient ??
    postgres(process.env.DATABASE_URL, {
      prepare: false,
    })

  if (process.env.NODE_ENV !== "production") {
    globalForDb.postgresClient = client
  }

  return drizzle(client, { schema })
}

export function getDb() {
  const db = globalForDb.drizzleDb ?? createDb()

  if (process.env.NODE_ENV !== "production") {
    globalForDb.drizzleDb = db
  }

  return db
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver)
  },
})

export { schema }

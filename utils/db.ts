import knex, { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Board {
    id: number
    title: string
    content: string
    // eslint-disable-next-line camelcase
    created_at: number
    views: number,
    tags: string
  }

  // eslint-disable-next-line no-unused-vars
  interface Tables {
    board: Board
  }
}

let cachedConnection: Knex | undefined

export const createDBConnection = () => {
  if (cachedConnection) {
    console.log('Cached Connection')
    return cachedConnection
  }

  console.log('New Connection')

  const connection = knex({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'board',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'board'
    }
  })

  cachedConnection = connection
  return connection
}

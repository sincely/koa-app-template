import knex from 'knex'
import { dbConfig } from './setting.js'

const setup = {
  client: 'mysql2',
  connection: {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port || 3306
  },
  pool: {
    min: 2,
    max: dbConfig.connectionLimit || 10
  }
}

export const knexSetup = setup
export const db = knex(setup)

'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

/** @type {import('@adonisjs/ignitor/src/Helpers')} */
const Helpers = use('Helpers')

module.exports = {
  connection: Env.get('DB_CONNECTION', 'mysql'),

  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('DB_HOST', '127.0.0.1'),
      port: Env.get('DB_PORT', '3307'),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', 'betalent123'),
      database: Env.get('DB_DATABASE', 'betalent')
    }
  }
}
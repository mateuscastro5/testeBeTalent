'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PhonesSchema extends Schema {
  up () {
    this.create('phones', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('phones')
  }
}

module.exports = PhonesSchema

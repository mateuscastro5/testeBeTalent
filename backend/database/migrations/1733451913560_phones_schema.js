'use strict'

const Schema = use('Schema')

class PhonesSchema extends Schema {
  up () {
    this.create('phones', (table) => {
      table.increments()
      table.integer('client_id').unsigned().references('id').inTable('clients')
      table.string('number').notNullable()
      table.string('type').notNullable() // mobile, home, work
      table.timestamps()
    })
  }

  down () {
    this.drop('phones')
  }
}

module.exports = PhonesSchema
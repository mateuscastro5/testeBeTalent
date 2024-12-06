// app/Models/Product.js
'use strict'

const Model = use('Model')

class Product extends Model {
  static boot () {
    super.boot()
    this.addTrait('@provider:Lucid/SoftDeletes')
  }

  sales () {
    return this.hasMany('App/Models/Sale')
  }
}

module.exports = Product
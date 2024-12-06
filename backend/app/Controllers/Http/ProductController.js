// app/Controllers/Http/ProductController.js
'use strict'

const Product = use('App/Models/Product')

class ProductController {
  async index ({ response }) {
    const products = await Product.query()
      .whereNull('deleted_at')
      .orderBy('name', 'asc')
      .fetch()

    return response.json(products)
  }

  async show ({ params, response }) {
    const product = await Product.findOrFail(params.id)
    return response.json(product)
  }

  async store ({ request, response }) {
    const data = request.only(['name', 'description', 'price'])
    const product = await Product.create(data)
    
    return response.status(201).json(product)
  }

  async update ({ params, request, response }) {
    const product = await Product.findOrFail(params.id)
    const data = request.only(['name', 'description', 'price'])
    
    product.merge(data)
    await product.save()
    
    return response.json(product)
  }

  async destroy ({ params, response }) {
    const product = await Product.findOrFail(params.id)
    product.deleted_at = new Date()
    await product.save()
    
    return response.status(204).send()
  }
}

module.exports = ProductController
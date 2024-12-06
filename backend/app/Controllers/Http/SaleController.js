// app/Controllers/Http/SaleController.js
'use strict'

const Sale = use('App/Models/Sale')
const Product = use('App/Models/Product')

class SaleController {
  async store ({ request, response }) {
    const data = request.only(['client_id', 'product_id', 'quantity'])
    
    const product = await Product.findOrFail(data.product_id)
    
    const sale = await Sale.create({
      ...data,
      unit_price: product.price,
      total_price: product.price * data.quantity
    })
    
    await sale.load('client')
    await sale.load('product')
    
    return response.status(201).json(sale)
  }
}

module.exports = SaleController
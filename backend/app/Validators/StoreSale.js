// app/Validators/StoreSale.js
'use strict'

class StoreSale {
  get rules () {
    return {
      client_id: 'required|integer|exists:clients,id',
      product_id: 'required|integer|exists:products,id',
      quantity: 'required|integer|min:1'
    }
  }

  get messages () {
    return {
      'client_id.required': 'Client is required',
      'product_id.required': 'Product is required',
      'quantity.required': 'Quantity is required',
      'quantity.min': 'Quantity must be at least 1'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).json({
      status: 'error',
      message: errorMessages[0].message
    })
  }
}

module.exports = StoreSale
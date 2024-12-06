// app/Validators/StoreProduct.js
'use strict'

class StoreProduct {
  get rules () {
    return {
      name: 'required|string|max:255',
      description: 'string',
      price: 'required|number|min:0'
    }
  }

  get messages () {
    return {
      'name.required': 'Product name is required',
      'price.required': 'Product price is required',
      'price.min': 'Price must be greater than or equal to 0'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).json({
      status: 'error',
      message: errorMessages[0].message
    })
  }
}

module.exports = StoreProduct
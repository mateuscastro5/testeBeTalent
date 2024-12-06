'use strict'

class ViewController {
  async home({ view }) {
    return view.render('home')
  }

  async login({ view }) {
    return view.render('auth/login')
  }

  async register({ view }) {
    return view.render('auth/register')
  }

  async clients({ view }) {
    return view.render('clients/index')
  }

  async products({ view }) {
    return view.render('products/index')
  }

  async sales({ view }) {
    return view.render('sales/index')
  }
}

module.exports = ViewController
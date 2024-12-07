'use strict'

class ViewController {
  async home({ view, auth, response }) {
    try {
      await auth.check();
      return view.render('home');
    } catch (error) {
      return response.redirect('/login');
    }
  }

  async login({ view }) {
    return view.render('auth/login')  // Changed from auth.login to auth/login
  }

  async register({ view }) {
    return view.render('auth/register')  // Changed from auth.register to auth/register
  }

  async clients({ view, auth, response }) {
    try {
      await auth.check()
      return view.render('clients/index')  // Changed from clients.index to clients/index
    } catch (error) {
      return response.redirect('/login')
    }
  }

  async products({ view, auth, response }) {
    try {
      await auth.check()
      return view.render('products/index')  // Changed from products.index to products/index
    } catch (error) {
      return response.redirect('/login')
    }
  }

  async sales({ view, auth, response }) {
    try {
      await auth.check()
      return view.render('sales/index')  // Changed from sales.index to sales/index
    } catch (error) {
      return response.redirect('/login')
    }
  }
}

module.exports = ViewController
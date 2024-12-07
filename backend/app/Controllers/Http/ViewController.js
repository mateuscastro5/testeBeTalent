'use strict'

const View = use('View')

class ViewController {
  async home({ view, auth, response }) {
    try {
      await auth.check();
      return view.render('home');
    } catch (error) {
      return response.redirect('/login');
    }
  }

  async login({ view, session }) {
    return view.render('auth/login', {
      csrfToken: session.get('csrf-token')
    })
  }

  async register({ view, session }) {
    // Pass CSRF token to view
    return view.render('auth/register', { 
      csrfToken: session.get('csrf-token')
    })
  }

  async clients({ view, auth, response }) {
    try {
      await auth.check()
      return view.render('clients/index')
    } catch (error) {
      return response.redirect('/login')
    }
  }

  async products({ view, auth, response }) {
    try {
      await auth.check()
      return view.render('products/index')
    } catch (error) {
      return response.redirect('/login')
    }
  }
}

module.exports = ViewController
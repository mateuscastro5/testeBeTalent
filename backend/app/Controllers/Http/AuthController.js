'use strict'

const User = use('App/Models/User')

class AuthController {
  async login({ request, auth, response }) {
    try {
      const { email, password } = request.all()
      // Use JWT authentication instead of session
      const token = await auth.attempt(email, password)
      
      return response.json({
        status: 'success',
        data: { token }
      })
    } catch (error) {
      return response.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }
  }

  async register({ request, response }) {
    try {
      const userData = request.only(['username', 'email', 'password'])
      await User.create(userData)
      
      if (request.accepts('json')) {
        return response.json({
          status: 'success',
          message: 'Registration successful'
        })
      }
      return response.redirect('/login')
    } catch (error) {
      if (request.accepts('json')) {
        return response.status(400).json({
          status: 'error',
          message: error.message
        })
      }
      return response.redirect('back')
    }
  }
}

module.exports = AuthController
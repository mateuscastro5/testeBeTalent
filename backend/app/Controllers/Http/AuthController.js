'use strict'

const User = use('App/Models/User')

class AuthController {
  async register({ request, auth, response }) {
    try {
      const userData = request.only(['username', 'email', 'password'])
      
      // Check if user already exists
      const existingUser = await User.query()
        .where('email', userData.email)
        .orWhere('username', userData.username)
        .first()
      
      if (existingUser) {
        return response.status(400).json({
          status: 'error',
          message: 'Username or email already in use'
        })
      }

      const user = await User.create(userData)
      const token = await auth.generate(user)

      return response.status(201).json({
        status: 'success',
        data: {
          user: user,
          token: token.token
        }
      })
    } catch (error) {
      console.error('Registration error:', error)
      return response.status(400).json({
        status: 'error',
        message: 'Failed to register user. Please try a different username or email.'
      })
    }
  }

  async login({ request, auth, response }) {
    try {
      const { email, password } = request.all()
      const token = await auth.attempt(email, password)
      
      return response.json({
        status: 'success',
        data: token
      })
    } catch (error) {
      return response.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }
  }
}

module.exports = AuthController
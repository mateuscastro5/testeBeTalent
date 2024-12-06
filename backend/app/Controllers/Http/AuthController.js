'use strict'

const User = use('App/Models/User')

class AuthController {
  async register({ request, auth, response }) {
    try {
      const userData = request.only(['username', 'email', 'password'])
      
      const user = await User.create(userData)
      const token = await auth.generate(user)

      return response.json({
        status: 'success',
        data: {
          user: user,
          token: token
        }
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Error during registration: ' + error.message
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

  async profile({ auth, response }) {
    try {
      return response.json({
        status: 'success',
        data: auth.current.user
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Error fetching profile'
      })
    }
  }
}

module.exports = AuthController
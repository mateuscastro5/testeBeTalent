'use strict'

const User = use('App/Models/User')

class AuthController {
  async register({ request, auth, response }) {
    try {
      const userData = request.only(['username', 'email', 'password'])
      console.log('Registering user with data:', userData)
      
      const user = await User.create(userData)
      console.log('User created:', user)
      
      const token = await auth.generate(user)
      console.log('Token generated:', token)

      return response.json({
        status: 'success',
        data: {
          user: user,
          token: token
        }
      })
    } catch (error) {
      console.error('Error during registration:', error)
      return response.status(400).json({
        status: 'error',
        message: 'Error during registration: ' + error.message
      })
    }
  }

  async login({ request, auth, response }) {
    try {
      const { email, password } = request.all()
      console.log('Attempting login with email:', email)
      const token = await auth.attempt(email, password)
      console.log('Login successful, token:', token)
      
      return response.json({
        status: 'success',
        data: token
      })
    } catch (error) {
      console.error('Login failed:', error)
      return response.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }
  }
}

module.exports = AuthController
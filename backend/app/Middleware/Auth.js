'use strict'

class Auth {
  async handle({ request, auth, response }, next) {
    try {
      const authHeader = request.header('Authorization')
      console.log('Authorization Header:', authHeader)
      if (!authHeader) {
        throw new Error('No token provided')
      }

      const token = authHeader.replace('Bearer ', '')
      await auth.authenticator('jwt').setToken(token)
      await auth.authenticator('jwt').check()
      console.log('Authenticated User:', auth.user)
      
      await next()
    } catch (error) {
      console.error('Auth error:', error.message)
      
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(401).json({
          status: 'error',
          message: 'Authentication failed'
        })
      }
      return response.redirect('/login')
    }
  }
}

module.exports = Auth
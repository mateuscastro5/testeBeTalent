'use strict'

class Auth {
  async handle({ request, auth, response }, next) {
    try {
      const token = request.cookie('token') || 
                    request.header('Authorization')?.replace('Bearer ', '')
      
      if (!token) {
        throw new Error('No token provided')
      }

      try {
        await auth.authenticator('jwt').setToken(token)
        await auth.authenticator('jwt').check()
        await next()
      } catch (error) {
        console.error('JWT validation error:', error.message)
        response.clearCookie('token')
        throw error
      }

    } catch (error) {
      console.error('Auth error:', error.message)
      response.clearCookie('token')
      
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
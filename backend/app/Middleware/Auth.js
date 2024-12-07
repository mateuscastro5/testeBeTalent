'use strict'

class Auth {
  async handle({ request, auth, response }, next) {
    try {
      await auth.check();
      await next();
    } catch (error) {
      console.error('Auth error:', error);
      return response.status(401).json({
        error: 'Unauthorized access'
      });
    }
  }
}

module.exports = Auth
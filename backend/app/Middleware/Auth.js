'use strict'

class Auth {
  async handle({ request, auth, response }, next) {
    try {
      // Use JWT authentication
      await auth.check();
      await next();
    } catch (error) {
      console.error('Auth error:', error);
      // API routes should return JSON
      if (request.url().startsWith('/api/')) {
        return response.status(401).json({
          error: 'Unauthorized access'
        });
      }
      // Web routes should redirect
      return response.redirect('/login');
    }
  }
}

module.exports = Auth
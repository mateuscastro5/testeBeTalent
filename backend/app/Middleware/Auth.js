'use strict'

class Auth {
  async handle({ request, auth, response }, next) {
    try {
      console.log('🔒 Checking authentication...');
      
      // Check for token in both header and cookie
      const headerToken = request.header('Authorization');
      const cookieToken = request.cookie('token');
      
      console.log('🔑 Header token:', headerToken ? 'Present' : 'Missing');
      console.log('🔑 Cookie token:', cookieToken ? 'Present' : 'Missing');
      
      if (!headerToken && !cookieToken) {
        console.log('❌ No token found in request');
        throw new Error('No token provided');
      }
      
      try {
        if (headerToken) {
          const token = headerToken.replace('Bearer ', '');
          console.log('🔍 Validating header token...');
          await auth.authenticator('jwt').check();
        } else if (cookieToken) {
          console.log('🔍 Validating cookie token...');
          await auth.authenticator('jwt').check();
        }
        console.log('✅ Token validated successfully');
      } catch (authError) {
        console.error('❌ Token validation failed:', authError.message);
        throw authError;
      }
      
      await next();
    } catch (error) {
      console.error('❌ Authentication error:', error.message);
      if (request.accepts('html')) {
        session.flash({ error: `Authentication failed: ${error.message}` });
        return response.redirect('/login');
      }
      return response.status(401).json({
        error: 'Unauthorized access',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

module.exports = Auth
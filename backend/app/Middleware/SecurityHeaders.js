'use strict'

class SecurityHeaders {
  async handle({ response }, next) {
    response.header('X-Content-Type-Options', 'nosniff');
    response.header('X-Frame-Options', 'DENY');
    response.header('X-XSS-Protection', '1; mode=block');
    response.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.header('Pragma', 'no-cache');
    response.header('Expires', '0');
    response.header('Surrogate-Control', 'no-store');
    
    await next();
  }
}

module.exports = SecurityHeaders
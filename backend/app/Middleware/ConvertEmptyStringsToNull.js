'use strict'

class ConvertEmptyStringsToNull {
  async handle({ request }, next) {
    // Skip auth routes and home route
    const skipRoutes = ['/api/auth/login', '/api/auth/register', '/home'];
    if (skipRoutes.includes(request.url())) {
      return await next();
    }

    // Skip if it's an authenticated request
    if (request.header('Authorization') || request.cookie('token')) {
      return await next();
    }

    if (request.body && Object.keys(request.body).length) {
      request.body = Object.entries(request.body).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value === '' ? null : value
      }), {});
    }

    await next();
  }
}

module.exports = ConvertEmptyStringsToNull
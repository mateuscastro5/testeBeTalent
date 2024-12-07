'use strict'

const Logger = use('Logger')
const fs = require('fs')
const path = require('path')

class AuthLogger {
  async handle({ request, auth, session }, next) {
    const logFile = path.join('tmp', 'auth.log')
    const timestamp = new Date().toISOString()
    
    try {
      // Log request details
      this.log(`
=== Auth Request ${timestamp} ===
URL: ${request.url()}
Method: ${request.method()}
Headers: ${JSON.stringify(request.headers(), null, 2)}
Cookies: ${JSON.stringify(request.cookies(), null, 2)}
Session Data: ${JSON.stringify(session.all(), null, 2)}
      `)

      // Check authentication state before
      try {
        const user = await auth.getUser()
        this.log(`Pre-Request Auth State: Authenticated as ${user.email}`)
      } catch (e) {
        this.log(`Pre-Request Auth State: Not authenticated - ${e.message}`)
      }

      // Execute request
      await next()

      // Check authentication state after
      try {
        const user = await auth.getUser()
        this.log(`Post-Request Auth State: Authenticated as ${user.email}`)
      } catch (e) {
        this.log(`Post-Request Auth State: Not authenticated - ${e.message}`)
      }

      this.log('=== Request Complete ===\n')
    } catch (error) {
      this.log(`
=== Auth Error ${timestamp} ===
Error: ${error.message}
Stack: ${error.stack}
=== Error End ===\n
      `)
      throw error
    }
  }

  log(message) {
    const logFile = path.join('tmp', 'auth.log')
    fs.appendFileSync(logFile, message + '\n')
  }
}

module.exports = AuthLogger
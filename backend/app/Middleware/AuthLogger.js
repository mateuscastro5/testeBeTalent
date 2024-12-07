'use strict'

const Logger = use('Logger')
const fs = require('fs')
const path = require('path')

class AuthLogger {
  async handle({ request, auth, response, session }, next) {
    const timestamp = new Date().toISOString()
    const logFile = path.join(__dirname, '../../tmp/auth.log')
    
    try {
      // Log request details
      this.log(`
=== Auth Request ${timestamp} ===
URL: ${request.url()}
Method: ${request.method()}
Headers: ${JSON.stringify(request.headers(), null, 2)}
Body: ${JSON.stringify(request.all(), null, 2)}
Session: ${JSON.stringify(session.all(), null, 2)}
Cookies: ${JSON.stringify(request.cookies(), null, 2)}
`)

      await next()

      // Log response details
      this.log(`
Response Status: ${response.response.statusCode}
Response Headers: ${JSON.stringify(response.response.getHeaders(), null, 2)}
=== Request Complete ===\n`)

    } catch (error) {
      this.log(`
=== Error ${timestamp} ===
Error: ${error.message}
Stack: ${error.stack}
=== Error End ===\n`)
      throw error
    }
  }

  log(message) {
    const logFile = path.join(__dirname, '../../tmp/auth.log')
    // Ensure tmp directory exists
    if (!fs.existsSync(path.dirname(logFile))) {
      fs.mkdirSync(path.dirname(logFile), { recursive: true })
    }
    fs.appendFileSync(logFile, message + '\n')
  }
}

module.exports = AuthLogger
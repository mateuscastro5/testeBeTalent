'use strict'

const Server = use('Server')

const globalMiddleware = [
  'Adonis/Middleware/Static',  // Adicione esta linha
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session',
  'Adonis/Middleware/AuthInit',
  'App/Middleware/AuthLogger'
]

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly'
}

Server
  .registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
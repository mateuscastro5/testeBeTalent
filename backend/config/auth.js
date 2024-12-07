'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  /*
  |-------------------------------------------------------------------------- 
  | Authenticator
  |-------------------------------------------------------------------------- 
  | 
  | Change the authenticator from 'session' to 'jwt' 
  | 
  */
  authenticator: 'jwt',

  /*
  |-------------------------------------------------------------------------- 
  | Session
  |-------------------------------------------------------------------------- 
  | 
  | Session authenticator makes use of sessions to authenticate a user. 
  | Session authentication is always persistent. 
  | 
  */
  session: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'session',
    uid: 'email',
    password: 'password'
  },

  /*
  |-------------------------------------------------------------------------- 
  | Basic Auth
  |-------------------------------------------------------------------------- 
  | 
  | The basic auth authenticator uses basic auth header to authenticate a 
  | user. 
  | 
  | NOTE: 
  | This scheme is not persistent and users are supposed to pass 
  | login credentials on each request. 
  | 
  */
  basic: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'basic',
    uid: 'email',
    password: 'password'
  },

  /*
  |-------------------------------------------------------------------------- 
  | Jwt
  |-------------------------------------------------------------------------- 
  | 
  | Configure JWT authentication 
  | 
  */
  jwt: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'jwt',
    uid: 'email',
    password: 'password',
    options: {
      secret: Env.get('APP_KEY'),
      expiresIn: '2h',
      algorithm: 'HS256',
      issuer: 'betalent-api'
    }
  },

  /*
  |-------------------------------------------------------------------------- 
  | Api
  |-------------------------------------------------------------------------- 
  | 
  | The Api scheme makes use of API personal tokens to authenticate a user. 
  | 
  */
  api: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'api',
    uid: 'email',
    password: 'password'
  }
}

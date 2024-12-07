'use strict'

class StoreUser {
  get rules () {
    return {
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required|min:6'
    }
  }

  get messages () {
    return {
      'username.required': 'Username is required',
      'username.unique': 'Username already exists',
      'email.required': 'Email is required',
      'email.email': 'Invalid email format',
      'email.unique': 'Email already exists',
      'password.required': 'Password is required',
      'password.min': 'Password must be at least 6 characters'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).json({
      status: 'error',
      message: errorMessages[0].message
    })
  }
}

module.exports = StoreUser
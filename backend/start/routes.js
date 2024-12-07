'use strict'

const Route = use('Route')

// Public routes (guest only)
Route.group(() => {
  Route.get('/', 'ViewController.login')
  Route.get('/login', 'ViewController.login').as('auth.loginPage')
  Route.get('/register', 'ViewController.register').as('auth.registerPage')
}).middleware(['guest'])

// Auth routes
Route.group(() => {
  Route.post('login', 'AuthController.login').as('auth.login')
  Route.post('register', 'AuthController.register')
    .validator('StoreUser')
    .as('auth.register')
}).prefix('api/auth')

// Protected routes 
Route.group(() => {
  Route.get('/dashboard', 'ViewController.home').as('dashboard')
  Route.get('/home', 'ViewController.home').as('home')
  Route.get('/logout', 'AuthController.logout').as('auth.logout')
}).middleware(['auth'])
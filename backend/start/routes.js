'use strict'

const Route = use('Route')

// Public routes
Route.get('/', 'ViewController.login')
Route.get('/login', 'ViewController.login').as('auth.loginPage')
Route.get('/register', 'ViewController.register').as('auth.registerPage') // Esta é a rota que acessa a página

// Auth routes
Route.group(() => {
  Route.post('login', 'AuthController.login').as('auth.login')
  Route.post('register', 'AuthController.register') // Esta é a rota que processa o registro
    .validator('StoreUser')
    .as('auth.register')
}).prefix('api/auth')

// Protected routes
Route.group(() => {
  Route.get('/home', 'ViewController.home').as('home')
}).middleware(['auth'])
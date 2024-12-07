'use strict'

const Route = use('Route')

// Public routes (no auth required)
Route.get('/', 'ViewController.login')
Route.get('/login', 'ViewController.login')
Route.get('/register', 'ViewController.register')

// Auth routes (no auth required)
Route.group(() => {
  Route.post('register', 'AuthController.register').validator('StoreUser')
  Route.post('login', 'AuthController.login')
}).prefix('api/auth')

// Protected routes (auth required)
Route.group(() => {
  Route.get('/home', 'ViewController.home')
  Route.get('/clients', 'ViewController.clients')
  Route.get('/products', 'ViewController.products')
  Route.get('/sales', 'ViewController.sales')
}).middleware(['auth'])
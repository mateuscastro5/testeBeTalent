'use strict'

const Route = use('Route')

// Public routes
Route.get('/', 'ViewController.login')
Route.get('/login', 'ViewController.login')
Route.get('/register', 'ViewController.register')

// Auth routes
Route.group(() => {
  Route.post('register', 'AuthController.register').validator('StoreUser')
  Route.post('login', 'AuthController.login')
}).prefix('api/auth')

// Protected routes
Route.group(() => {
  Route.get('/home', 'ViewController.home')
  Route.get('/clients', 'ViewController.clients')
  Route.get('/products', 'ProductController.index')
  Route.get('/sales', 'SaleController.index')
}).middleware(['auth'])
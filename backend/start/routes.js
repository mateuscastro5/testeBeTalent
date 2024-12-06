'use strict'

const Route = use('Route')

// View Routes
Route.get('/', 'ViewController.login').middleware(['guest'])
Route.get('/login', 'ViewController.login').middleware(['guest'])
Route.get('/register', 'ViewController.register').middleware(['guest'])
Route.get('/home', 'ViewController.home').middleware(['auth'])
Route.get('/clients', 'ViewController.clients').middleware(['auth'])
Route.get('/products', 'ViewController.products').middleware(['auth'])
Route.get('/sales', 'ViewController.sales').middleware(['auth'])

// Auth routes
Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.get('profile', 'AuthController.profile').middleware('auth')
}).prefix('api/auth')

// Protected routes
Route.group(() => {
  // Client routes
  Route.get('clients', 'ClientController.index')
  Route.get('clients/:id', 'ClientController.show')
  Route.post('clients', 'ClientController.store')
  Route.put('clients/:id', 'ClientController.update')
  Route.delete('clients/:id', 'ClientController.destroy')
  Route.get('clients/:id/sales/:year/:month', 'ClientController.salesByMonth')

  // Product routes
  Route.get('products', 'ProductController.index')
  Route.get('products/:id', 'ProductController.show')
  Route.post('products', 'ProductController.store')
  Route.put('products/:id', 'ProductController.update')
  Route.delete('products/:id', 'ProductController.destroy')

  // Sales routes
  Route.post('sales', 'SaleController.store')
}).prefix('api').middleware('auth')
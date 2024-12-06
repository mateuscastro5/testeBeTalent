'use strict'

const Route = use('Route')

// Auth routes
Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.get('profile', 'AuthController.profile').middleware('auth')
}).prefix('api/auth')

// Protected routes
Route.group(() => {
  // Client routes
  Route.resource('clients', 'ClientController')
        .apiOnly()
        .validator(new Map([
          [['clients.store'], ['StoreClient']],
          [['clients.update'], ['UpdateClient']]
        ]))

  // Product routes  
  Route.resource('products', 'ProductController')
        .apiOnly()
        .validator(new Map([
          [['products.store'], ['StoreProduct']],
          [['products.update'], ['UpdateProduct']]
        ]))

  // Sales routes
  Route.post('sales', 'SaleController.store')
        .validator('StoreSale')

}).prefix('api').middleware('auth')
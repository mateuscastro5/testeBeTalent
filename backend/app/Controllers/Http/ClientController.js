// app/Controllers/Http/ClientController.js
'use strict'

const Client = use('App/Models/Client')

class ClientController {
  async index ({ request, response }) {
    const clients = await Client.query()
      .where('active', true)
      .orderBy('id', 'asc')
      .fetch()

    return response.json(clients)
  }

  async show ({ params, response }) {
    const client = await Client.findOrFail(params.id)
    await client.loadMany(['addresses', 'phones'])
    
    const sales = await client.sales()
      .with('product')
      .orderBy('created_at', 'desc')
      .fetch()

    return response.json({
      client,
      sales
    })
  }

  async store ({ request, response }) {
    const data = request.only(['name', 'cpf'])
    const client = await Client.create(data)
    
    return response.status(201).json(client)
  }

  async update ({ params, request, response }) {
    const client = await Client.findOrFail(params.id)
    const data = request.only(['name', 'cpf'])
    
    client.merge(data)
    await client.save()
    
    return response.json(client)
  }

  async destroy ({ params, response }) {
    const client = await Client.findOrFail(params.id)
    client.active = false
    await client.save()
    
    return response.status(204).send()
  }
}

module.exports = ClientController
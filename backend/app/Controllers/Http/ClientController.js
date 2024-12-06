// app/Controllers/Http/ClientController.js
'use strict'

const Client = use('App/Models/Client')
const Database = use('Database')

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
  
  async salesByMonth ({ params, response }) {
    const { id, year, month } = params
    const client = await Client.findOrFail(id)
    
    const sales = await client.sales()
      .whereRaw('YEAR(created_at) = ? AND MONTH(created_at) = ?', [year, month])
      .with('product')
      .orderBy('created_at', 'desc')
      .fetch()
  
    return response.json(sales)
  }

  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const { name, cpf, addresses, phones } = request.all()
      const client = await Client.create({ name, cpf }, trx)
      
      if (addresses && addresses.length) {
        await client.addresses().createMany(addresses, trx)
      }
      
      if (phones && phones.length) {
        await client.phones().createMany(phones, trx)
      }
      
      await trx.commit()
      return response.status(201).json(client)
    } catch (error) {
      await trx.rollback()
      return response.status(400).json({
        status: 'error',
        message: 'Error creating client: ' + error.message
      })
    }
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
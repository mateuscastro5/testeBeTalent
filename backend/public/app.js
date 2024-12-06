// Product management functions
async function loadProducts() {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const products = await response.json()
      
      const tbody = document.getElementById('productsTableBody')
      if (tbody) {
        tbody.innerHTML = products.map(product => `
          <tr>
            <td>${product.name}</td>
            <td>R$ ${product.price}</td>
            <td>
              <button onclick="viewProduct(${product.id})" class="btn btn-sm">View</button>
              <button onclick="editProduct(${product.id})" class="btn btn-sm">Edit</button>
              <button onclick="deleteProduct(${product.id})" class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        `).join('')
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }
  
  async function viewProduct(id) {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const product = await response.json()
      
      const modal = document.createElement('div')
      modal.className = 'modal'
      modal.innerHTML = `
        <div class="modal-content">
          <h3>Product Details</h3>
          <div class="product-info">
            <p><strong>Name:</strong> ${product.name}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> R$ ${product.price}</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" class="btn">Close</button>
        </div>
      `
      document.body.appendChild(modal)
    } catch (error) {
      console.error('Failed to load product details:', error)
    }
  }
  
  // Sales management functions
  async function createSale() {
    const token = localStorage.getItem('token')
    
    try {
      // Fetch clients and products for dropdowns
      const [clientsResponse, productsResponse] = await Promise.all([
        fetch('/api/clients', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      const clients = await clientsResponse.json()
      const products = await productsResponse.json()
      
      const modal = document.createElement('div')
      modal.className = 'modal'
      modal.innerHTML = `
        <div class="modal-content">
          <h3>Register Sale</h3>
          <form onsubmit="handleSaleSubmit(event)">
            <div class="form-group">
              <label for="client_id">Client</label>
              <select id="client_id" name="client_id" required>
                <option value="">Select a client</option>
                ${clients.map(client => `
                  <option value="${client.id}">${client.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="product_id">Product</label>
              <select id="product_id" name="product_id" required>
                <option value="">Select a product</option>
                ${products.map(product => `
                  <option value="${product.id}">${product.name} - R$ ${product.price}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input type="number" id="quantity" name="quantity" min="1" required>
            </div>
            <button type="submit" class="btn btn-primary">Register Sale</button>
            <button type="button" onclick="this.parentElement.parentElement.parentElement.remove()" class="btn">Cancel</button>
          </form>
        </div>
      `
      document.body.appendChild(modal)
    } catch (error) {
      console.error('Failed to prepare sale form:', error)
    }
  }
  
  async function handleSaleSubmit(event) {
    event.preventDefault()
    const token = localStorage.getItem('token')
    const formData = new FormData(event.target)
    
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      })
      
      if (response.ok) {
        event.target.parentElement.parentElement.remove()
        alert('Sale registered successfully!')
      }
    } catch (error) {
      console.error('Failed to register sale:', error)
    }
  }
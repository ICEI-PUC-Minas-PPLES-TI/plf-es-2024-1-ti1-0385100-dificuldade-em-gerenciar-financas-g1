class Api {
  constructor() {
    this.base = 'https://cashcraft-server-git-deploy-cashcraft.vercel.app'
    this.clientesUrl = this.base + '/clientes'
  }

  /** CRUD Cliente */

  async createClient(body) {
    try {
      const response = await fetch(this.clientesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.statusText
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async readClient(username) {
    const cliente = (await this.getAllClients()).find(cliente => cliente.username === username)
    try {
      const response = await fetch(`${this.clientesUrl}/${cliente.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json();
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async updateClient(body, id) {
    try {
      const response = await fetch(`${this.clientesUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.status
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async deleteClient(id) {
    try {
      const response = await fetch(`${this.clientesUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.status
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getAllClients() {
    try {
      const response = await fetch(this.clientesUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

export default Api

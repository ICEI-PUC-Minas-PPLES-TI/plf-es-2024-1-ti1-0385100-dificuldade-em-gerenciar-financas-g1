class Api {
  constructor() {
    this.urlClients = '/api/clientes'
    this.urlLaunches = '/api/lancamentos'
    this.urlMethods = '/api/metodos'
    this.urlCategories = '/api/categorias'
  }

  /** CRUD Cliente */

  async createClient(body) {
    try {
      const response = await fetch(this.urlClients, {
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
      const response = await fetch(`${this.urlClients}/${cliente.id}`, {
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
      const response = await fetch(`${this.urlClients}/${id}`, {
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
      const response = await fetch(`${this.urlClients}/${id}`, {
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
      const response = await fetch(this.urlClients, {
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


  /** CRUD Lançamentos */

  async getUserLaunches(username) {
    const cliente = (await this.getAllClients()).find(cliente => cliente.username === username)
    try {
      const response = await fetch(`${this.urlClients}/${cliente.id}/lancamentos`, {
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

  async getLaunch(id) {
    try {
      const response = await fetch(`${this.urlLaunches}/${id}`, {
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

  async createLaunch(body) {
    try {
      const response = await fetch(this.urlLaunches, {
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

      return response.status
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async updateLaunch(body, id) {
    try {
      const response = await fetch(`${this.urlLaunches}/${id}`, {
        method: 'PUT',
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

  async deleteLaunch(id) {
    try {
      const response = await fetch(`${this.urlLaunches}/${id}`, {
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

  /** GET DB default params */

  async getMethods() {
    try{
      const response = await fetch(this.urlMethods, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json();
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getCategories() {
    try{
      const response = await fetch(this.urlCategories, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json();
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

export default Api

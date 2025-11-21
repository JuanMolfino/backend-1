const fs = require("fs").promises;
const path = require("path");

class ClientManager {
  constructor() {
    this.path = path.join(__dirname, "../clients.json");
    this.clients = [];
    this.initialized = false;
  }

  // Inicializar cargando clientes desde el archivo
  async init() {
    if (!this.initialized) {
      await this.loadClients();
      this.initialized = true;
    }
  }

  // Cargar clientes desde el archivo de manera asíncrona
  async loadClients() {
    try {
      const fileContent = await fs.readFile(this.path, "utf-8");
      this.clients = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // El archivo no existe, crear uno vacío
        this.clients = [];
        await this.saveClients();
      } else {
        console.error("Error al cargar clientes:", error);
        throw new Error(`Error al cargar clientes: ${error.message}`);
      }
    }
  }

  // Guardar clientes en el archivo de manera asíncrona
  async saveClients() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.clients, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error("Error al guardar clientes:", error);
      throw new Error(`Error al guardar clientes: ${error.message}`);
    }
  }

  // Obtener todos los clientes (incluyendo los eliminados)
  async getClients() {
    await this.init();
    return this.clients;
  }

  // Obtener todos los clientes activos (no eliminados)
  async getActiveClients() {
    await this.init();
    return this.clients.filter(client => !client.deleted);
  }

  // Obtener cliente por ID
  async getClientById(id) {
    await this.init();
    const client = this.clients.find((c) => c.id === parseInt(id));
    return client || null;
  }

  // Crear un nuevo cliente
  async addClient(clientData) {
    await this.init();
    
    // Validar datos requeridos
    const { nombre, email, edad, genero } = clientData;
    if (!nombre || !email || !edad || !genero) {
      throw new Error("Faltan datos vitales: nombre, email, edad y genero son requeridos");
    }

    // Generar ID único
    const maxId = this.clients.length > 0 
      ? Math.max(...this.clients.map((c) => c.id)) 
      : 0;
    const newId = maxId + 1;

    const newClient = {
      id: newId,
      nombre,
      email,
      edad: parseInt(edad),
      genero,
      deleted: false
    };

    this.clients.push(newClient);
    
    try {
      await this.saveClients();
      return newClient;
    } catch (error) {
      // Revertir el cambio si falla el guardado
      this.clients.pop();
      throw error;
    }
  }

  // Actualizar un cliente
  async updateClient(id, updateData) {
    await this.init();
    
    const clientIndex = this.clients.findIndex((c) => c.id === parseInt(id));
    
    if (clientIndex === -1) {
      return null;
    }

    // Guardar el estado original para poder revertir
    const originalClient = { ...this.clients[clientIndex] };

    // No permitir actualizar el ID ni el deleted directamente
    const { id: clientId, deleted, ...dataToUpdate } = updateData;
    
    // Actualizar campos
    if (dataToUpdate.nombre !== undefined) {
      this.clients[clientIndex].nombre = dataToUpdate.nombre;
    }
    if (dataToUpdate.email !== undefined) {
      this.clients[clientIndex].email = dataToUpdate.email;
    }
    if (dataToUpdate.edad !== undefined) {
      this.clients[clientIndex].edad = parseInt(dataToUpdate.edad);
    }
    if (dataToUpdate.genero !== undefined) {
      this.clients[clientIndex].genero = dataToUpdate.genero;
    }

    try {
      await this.saveClients();
      return this.clients[clientIndex];
    } catch (error) {
      // Revertir cambios si falla el guardado
      this.clients[clientIndex] = originalClient;
      throw error;
    }
  }

  // Soft delete - Marcar cliente como eliminado
  async deleteClient(id) {
    await this.init();
    
    const clientIndex = this.clients.findIndex((c) => c.id === parseInt(id));
    
    if (clientIndex === -1) {
      return null;
    }

    // Si ya está eliminado, retornar el cliente sin cambios
    if (this.clients[clientIndex].deleted) {
      return this.clients[clientIndex];
    }

    // Guardar el estado original para poder revertir
    const originalDeleted = this.clients[clientIndex].deleted;
    
    // Marcar como eliminado
    this.clients[clientIndex].deleted = true;

    try {
      await this.saveClients();
      return this.clients[clientIndex];
    } catch (error) {
      // Revertir cambios si falla el guardado
      this.clients[clientIndex].deleted = originalDeleted;
      throw error;
    }
  }
}

module.exports = ClientManager;


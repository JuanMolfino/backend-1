const express = require("express");
const router = express.Router();
const ClientManager = require("../managers/ClientManager");

const clientManager = new ClientManager();

// GET /api/clientes - Listar todos los clientes activos
router.get("/", async (req, res) => {
  try {
    const clients = await clientManager.getActiveClients();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    res.status(500).json({ error: `Error al obtener los clientes: ${error.message}` });
  }
});

// GET /api/clientes/:id - Obtener cliente por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientManager.getClientById(id);
    
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ error: "El cliente no se encontró" });
    }
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    res.status(500).json({ error: `Error al obtener el cliente: ${error.message}` });
  }
});

// POST /api/clientes - Crear nuevo cliente
router.post("/", async (req, res) => {
  try {
    const { nombre, email, edad, genero } = req.body;
    
    if (!nombre || !email || !edad || !genero) {
      return res.status(400).json({ error: "Faltan datos vitales: nombre, email, edad y genero son requeridos" });
    }

    const newClient = await clientManager.addClient({ nombre, email, edad, genero });
    
    res.status(201).json({ creado: true, cliente: newClient });
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    res.status(500).json({ error: `Error al crear el cliente: ${error.message}` });
  }
});

// PUT /api/clientes/:id - Actualizar cliente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedClient = await clientManager.updateClient(id, updateData);
    
    if (updatedClient) {
      res.status(200).json({ modificado: true, cliente: updatedClient });
    } else {
      res.status(404).json({ error: "El cliente no ha sido encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    res.status(500).json({ error: `Error al actualizar el cliente: ${error.message}` });
  }
});

// DELETE /api/clientes/:id - Soft delete (marcar como eliminado)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClient = await clientManager.deleteClient(id);
    
    if (deletedClient) {
      if (deletedClient.deleted) {
        res.status(200).json({ 
          eliminado: true, 
          mensaje: "Cliente eliminado correctamente",
          cliente: deletedClient 
        });
      } else {
        res.status(200).json({ 
          eliminado: false, 
          mensaje: "Cliente ya eliminado",
          cliente: deletedClient 
        });
      }
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    res.status(500).json({ error: `Error al eliminar el cliente: ${error.message}` });
  }
});

module.exports = router;


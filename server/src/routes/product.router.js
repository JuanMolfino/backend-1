const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");

const productManager = new ProductManager();

// GET /api/products/ - Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// GET /api/products/:pid - Obtener producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// POST /api/products - Crear nuevo producto
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
    
    if (newProduct) {
      res.status(201).json({ creado: true, product: newProduct });
    } else {
      res.status(500).json({ error: "Error al crear el producto" });
    }
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: `Error al crear el producto: ${error.message}` });
  }
});

// PUT /api/products/:pid - Actualizar producto
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;
    const updatedProduct = await productManager.updateProduct(pid, updateData);
    
    if (updatedProduct) {
      res.status(200).json({ actualizado: true, product: updatedProduct });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: `Error al actualizar el producto: ${error.message}` });
  }
});

// DELETE /api/products/:pid - Eliminar producto
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await productManager.deleteProduct(pid);
    
    if (deleted) {
      res.status(200).json({ eliminado: true, mensaje: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: `Error al eliminar el producto: ${error.message}` });
  }
});

module.exports = router;


const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");

const productManager = new ProductManager();

// GET /api/products/ - Listar todos los productos
router.get("/", (req, res) => {
  try {
    const products = productManager.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// GET 
router.get("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const product = productManager.getProductById(pid);
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// POST 
router.post("/", (req, res) => {
  try {
    const productData = req.body;
    const newProduct = productManager.addProduct(productData);
    
    if (newProduct) {
      res.status(201).json({ creado: true, product: newProduct });
    } else {
      res.status(500).json({ error: "Error al crear el producto" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// PUT  
router.put("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;
    const updatedProduct = productManager.updateProduct(pid, updateData);
    
    if (updatedProduct) {
      res.status(200).json({ actualizado: true, product: updatedProduct });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// DELETE (soft obveo)
router.delete("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = productManager.deleteProduct(pid);
    
    if (deleted) {
      res.status(200).json({ eliminado: true, mensaje: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;


const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager");

const cartManager = new CartManager();
const productManager = new ProductManager();

// POST /api/carts - Crear nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    
    if (newCart) {
      res.status(201).json({ creado: true, cart: newCart });
    } else {
      res.status(500).json({ error: "Error al crear el carrito" });
    }
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: `Error al crear el carrito: ${error.message}` });
  }
});

// GET /api/carts/:cid - Obtener carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: `Error al obtener el carrito: ${error.message}` });
  }
});

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    // Verificar que el producto existe
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    // Verificar que el carrito existe
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    
    // Agregar producto al carrito
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (updatedCart) {
      res.status(200).json({ 
        actualizado: true, 
        cart: updatedCart 
      });
    } else {
      res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: `Error al agregar producto al carrito: ${error.message}` });
  }
});

module.exports = router;



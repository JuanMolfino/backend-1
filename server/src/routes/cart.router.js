const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager");

const cartManager = new CartManager();
const productManager = new ProductManager();

// POST 
router.post("/", (req, res) => {
  try {
    const newCart = cartManager.createCart();
    
    if (newCart) {
      res.status(201).json({ creado: true, cart: newCart });
    } else {
      res.status(500).json({ error: "Error al crear el carrito" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// GET 
router.get("/:cid", (req, res) => {
  try {
    const { cid } = req.params;
    const cart = cartManager.getCartById(cid);
    
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

// POST  (Agregar producto al carrito)
router.post("/:cid/product/:pid", (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    // Verificar que el producto existe
    const product = productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    // Verificar que el carrito existe
    const cart = cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    // Agregar producto al carrito
    const updatedCart = cartManager.addProductToCart(cid, pid);
    if (updatedCart) {
      res.status(200).json({ 
        actualizado: true, 
        cart: updatedCart 
      });
    } else {
      res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

module.exports = router;


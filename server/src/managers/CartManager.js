const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../carts.json");
    this.carts = [];
    this.loadCarts();
  }

  // Cargar carritos desde el archivo
  loadCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const fileContent = fs.readFileSync(this.path, "utf-8");
        this.carts = JSON.parse(fileContent);
      } else {
        this.carts = [];
        this.saveCarts();
      }
    } catch (error) {
      console.error("Error al cargar carritos:", error);
      this.carts = [];
    }
  }

  // Guardar carritos en el archivo
  saveCarts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error("Error al guardar carritos:", error);
      return false;
    }
  }

  // Crear un nuevo carrito
  createCart() {
    // Generar ID único (luego implementar UUID para mas consistencia )
    const maxId = this.carts.length > 0 
      ? Math.max(...this.carts.map((c) => c.id)) 
      : 0;
    const newId = maxId + 1;

    const newCart = {
      id: newId,
      products: []
    };

    this.carts.push(newCart);
    
    if (this.saveCarts()) {
      return newCart;
    }
    return null;
  }

  // Obtener carrito por ID
  getCartById(cid) {
    const cart = this.carts.find((c) => c.id === parseInt(cid));
    return cart || null;
  }

  // Agregar producto al carrito
  addProductToCart(cid, pid) {
    const cartIndex = this.carts.findIndex((c) => c.id === parseInt(cid));
    
    if (cartIndex === -1) {
      return null;
    }

    const cart = this.carts[cartIndex];
    
    // Buscar si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(
      (p) => p.product === parseInt(pid)
    );

    if (existingProductIndex !== -1) {
      // Si existe, incrementar quantity
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Si no existe, agregarlo con quantity = 1
      cart.products.push({
        product: parseInt(pid),
        quantity: 1
      });
    }

    if (this.saveCarts()) {
      return cart;
    }
    return null;
  }
}

module.exports = CartManager;


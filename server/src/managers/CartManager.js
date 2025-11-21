const fs = require("fs").promises;
const path = require("path");

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../carts.json");
    this.carts = [];
    this.initialized = false;
  }

  // Inicializar cargando carritos desde el archivo
  async init() {
    if (!this.initialized) {
      await this.loadCarts();
      this.initialized = true;
    }
  }

  // Cargar carritos desde el archivo de manera asíncrona
  async loadCarts() {
    try {
      const fileContent = await fs.readFile(this.path, "utf-8");
      this.carts = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // El archivo no existe, crear uno vacío
        this.carts = [];
        await this.saveCarts();
      } else {
        console.error("Error al cargar carritos:", error);
        throw new Error(`Error al cargar carritos: ${error.message}`);
      }
    }
  }

  // Guardar carritos en el archivo de manera asíncrona
  async saveCarts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error("Error al guardar carritos:", error);
      throw new Error(`Error al guardar carritos: ${error.message}`);
    }
  }

  // Crear un nuevo carrito
  async createCart() {
    await this.init();
    
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
    
    try {
      await this.saveCarts();
      return newCart;
    } catch (error) {
      // Revertir el cambio si falla el guardado
      this.carts.pop();
      throw error;
    }
  }

  // Obtener carrito por ID
  async getCartById(cid) {
    await this.init();
    const cart = this.carts.find((c) => c.id === parseInt(cid));
    return cart || null;
  }

  // Agregar producto al carrito
  async addProductToCart(cid, pid) {
    await this.init();
    
    const cartIndex = this.carts.findIndex((c) => c.id === parseInt(cid));
    
    if (cartIndex === -1) {
      return null;
    }

    const cart = this.carts[cartIndex];
    
    // Guardar el estado original para poder revertir
    const originalProducts = JSON.parse(JSON.stringify(cart.products));
    
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

    try {
      await this.saveCarts();
      return cart;
    } catch (error) {
      // Revertir cambios si falla el guardado
      cart.products = originalProducts;
      throw error;
    }
  }
}

module.exports = CartManager;


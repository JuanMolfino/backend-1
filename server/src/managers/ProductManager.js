const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../products.json");
    this.products = [];
    this.initialized = false;
  }

  // Inicializar cargando productos desde el archivo
  async init() {
    if (!this.initialized) {
      await this.loadProducts();
      this.initialized = true;
    }
  }

  // Cargar productos desde el archivo de manera asíncrona
  async loadProducts() {
    try {
      const fileContent = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(fileContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // El archivo no existe, crear uno vacío
        this.products = [];
        await this.saveProducts();
      } else {
        console.error("Error al cargar productos:", error);
        throw new Error(`Error al cargar productos: ${error.message}`);
      }
    }
  }

  // Guardar productos en el archivo de manera asíncrona
  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error("Error al guardar productos:", error);
      throw new Error(`Error al guardar productos: ${error.message}`);
    }
  }

  // Obtener todos los productos
  async getProducts() {
    await this.init();
    return this.products;
  }

  // Obtener producto por ID
  async getProductById(pid) {
    await this.init();
    const product = this.products.find((p) => p.id === parseInt(pid));
    return product || null;
  }

  // Agregar un nuevo producto
  async addProduct(productData) {
    await this.init();
    
    // Generar ID único
    const maxId = this.products.length > 0 
      ? Math.max(...this.products.map((p) => p.id)) 
      : 0;
    const newId = maxId + 1;

    const newProduct = {
      id: newId,
      ...productData
    };

    this.products.push(newProduct);
    
    try {
      await this.saveProducts();
      return newProduct;
    } catch (error) {
      // Revertir el cambio si falla el guardado
      this.products.pop();
      throw error;
    }
  }

  // Actualizar un producto
  async updateProduct(pid, updateData) {
    await this.init();
    
    const productIndex = this.products.findIndex((p) => p.id === parseInt(pid));
    
    if (productIndex === -1) {
      return null;
    }

    // Guardar el estado original para poder revertir
    const originalProduct = { ...this.products[productIndex] };

    // No permitir actualizar el ID
    const { id, ...dataToUpdate } = updateData;
    
    // Actualizar campos
    Object.keys(dataToUpdate).forEach((key) => {
      if (dataToUpdate[key] !== undefined) {
        this.products[productIndex][key] = dataToUpdate[key];
      }
    });

    try {
      await this.saveProducts();
      return this.products[productIndex];
    } catch (error) {
      // Revertir cambios si falla el guardado
      this.products[productIndex] = originalProduct;
      throw error;
    }
  }

  // Eliminar un producto
  async deleteProduct(pid) {
    await this.init();
    
    const productIndex = this.products.findIndex((p) => p.id === parseInt(pid));
    
    if (productIndex === -1) {
      return false;
    }

    const deletedProduct = this.products.splice(productIndex, 1)[0];
    
    try {
      await this.saveProducts();
      return true;
    } catch (error) {
      // Revertir el cambio si falla el guardado
      this.products.splice(productIndex, 0, deletedProduct);
      throw error;
    }
  }
}

module.exports = ProductManager;


const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../products.json");
    this.products = [];
    this.loadProducts();
  }

  // Cargar productos desde el archivo
  loadProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const fileContent = fs.readFileSync(this.path, "utf-8");
        this.products = JSON.parse(fileContent);
      } else {
        this.products = [];
        this.saveProducts();
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      this.products = [];
    }
  }

  // Guardar productos en el archivo
  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error("Error al guardar productos:", error);
      return false;
    }
  }

  // Obtener todos los productos
  getProducts() {
    return this.products;
  }

  // Obtener producto por ID
  getProductById(pid) {
    const product = this.products.find((p) => p.id === parseInt(pid));
    return product || null;
  }

  // Agregar un nuevo producto
  addProduct(productData) {
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
    
    if (this.saveProducts()) {
      return newProduct;
    }
    return null;
  }

  // Actualizar un producto
  updateProduct(pid, updateData) {
    const productIndex = this.products.findIndex((p) => p.id === parseInt(pid));
    
    if (productIndex === -1) {
      return null;
    }

    // No permitir actualizar el ID
    const { id, ...dataToUpdate } = updateData;
    
    // Actualizar campos
    Object.keys(dataToUpdate).forEach((key) => {
      if (dataToUpdate[key] !== undefined) {
        this.products[productIndex][key] = dataToUpdate[key];
      }
    });

    if (this.saveProducts()) {
      return this.products[productIndex];
    }
    return null;
  }

  // Eliminar un producto
  deleteProduct(pid) {
    const productIndex = this.products.findIndex((p) => p.id === parseInt(pid));
    
    if (productIndex === -1) {
      return false;
    }

    this.products.splice(productIndex, 1);
    
    return this.saveProducts();
  }
}

module.exports = ProductManager;


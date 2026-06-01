// ========================================
// FACTORY PATTERN - Creación de Productos
// ========================================
// Patrón Creacional: Factory Pattern
// Responsable de crear instancias de productos

class ProductFactory {
  /**
   * Crea una instancia de Product a partir de datos
   * @param {Object} data - Datos del producto
   * @returns {Product} Instancia del producto
   */
  static createProduct(data) {
    return new Product(data);
  }

  /**
   * Crea múltiples instancias a partir de un array
   * @param {Array} dataArray - Array de datos de productos
   * @returns {Array} Array de instancias de Product
   */
  static createProducts(dataArray) {
    return dataArray.map(data => this.createProduct(data));
  }

  /**
   * Crea un producto vacío con valores por defecto
   * @returns {Product} Producto vacío
   */
  static createEmptyProduct() {
    return new Product({
      code: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      qualityStatus: QUALITY_STATUS.PENDING
    });
  }

  /**
   * Valida y crea un producto, retornando resultado con errores
   * @param {Object} data - Datos a validar
   * @returns {Object} {success, product, errors}
   */
  static createAndValidate(data) {
    const product = this.createProduct(data);
    const validation = product.validate();

    return {
      success: validation.isValid,
      product: validation.isValid ? product : null,
      errors: validation.errors
    };
  }

  /**
   * Crea un producto a partir de un formulario HTML
   * @param {HTMLFormElement} form - Formulario HTML
   * @returns {Product} Instancia del producto
   */
  static createFromForm(form) {
    const formData = new FormData(form);
    const data = {
      code: formData.get('code'),
      name: formData.get('name'),
      description: formData.get('description'),
      category_id: parseInt(formData.get('category_id')),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      image_url: formData.get('image_url') || './assets/placeholder.jpg',
      is_active: formData.get('is_active') === 'on',
      quality_status: formData.get('quality_status') || QUALITY_STATUS.PENDING
    };

    return this.createProduct(data);
  }

  /**
   * Crea productos de ejemplo para pruebas
   * @returns {Array} Array de productos de ejemplo
   */
  static createMockProducts() {
    const mockData = [
      {
        id: 1,
        code: 'CAMI-001',
        name: 'Camiseta Básica Negra',
        description: 'Camiseta de algodón 100% perfecto para uso diario',
        category_id: 1,
        category: 'Camisetas',
        price: 19.99,
        stock: 50,
        image_url: 'https://via.placeholder.com/300x400?text=Camiseta+Negra',
        is_active: true,
        quality_status: QUALITY_STATUS.APPROVED
      },
      {
        id: 2,
        code: 'JEANS-001',
        name: 'Jeans Premium Azul',
        description: 'Jeans azul oscuro con ajuste perfecto y confort premium',
        category_id: 2,
        category: 'Pantalones',
        price: 59.99,
        stock: 35,
        image_url: 'https://via.placeholder.com/300x400?text=Jeans+Azul',
        is_active: true,
        quality_status: QUALITY_STATUS.APPROVED
      },
      {
        id: 3,
        code: 'VEST-001',
        name: 'Vestido Elegante Rojo',
        description: 'Vestido elegante para ocasiones especiales',
        category_id: 3,
        category: 'Vestidos',
        price: 89.99,
        stock: 15,
        image_url: 'https://via.placeholder.com/300x400?text=Vestido+Rojo',
        is_active: true,
        quality_status: QUALITY_STATUS.APPROVED
      },
      {
        id: 4,
        code: 'CINT-001',
        name: 'Cinturón de Cuero Negro',
        description: 'Cinturón de cuero genuino con hebilla metálica',
        category_id: 4,
        category: 'Accesorios',
        price: 29.99,
        stock: 20,
        image_url: 'https://via.placeholder.com/300x400?text=Cinturon',
        is_active: true,
        quality_status: QUALITY_STATUS.APPROVED
      }
    ];

    return this.createProducts(mockData);
  }
}

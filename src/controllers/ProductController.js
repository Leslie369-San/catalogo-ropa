// ========================================
// CONTROLADOR: Gestión de Productos
// ========================================
// Maneja la lógica de negocio para productos

class ProductController {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.pageSize = CONFIG.MAX_PRODUCTS_PER_PAGE;
  }

  /**
   * Obtiene todos los productos disponibles consumiendo la Vista de Supabase
   */
  async fetchProducts() {
    try {
      // Consultamos directamente la vista que unifica productos y nombres de categorías
      const { data, error } = await supabaseClient
        .from('v_products_detail') 
        .select('*');

      if (error) {
        console.error('Error al obtener productos desde la vista:', error);
        return { success: false, error: error.message };
      }

      this.products = ProductFactory.createProducts(data || []);
      this.filteredProducts = [...this.products];

      console.log(`✓ ${this.products.length} productos reales cargados desde la vista`);
      return { success: true, data: this.products };
    } catch (error) {
      console.error('Error en fetchProducts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene productos con paginación
   */
  getPaginatedProducts(page = 1) {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  /**
   * Obtiene el total de páginas
   */
  getTotalPages() {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  /**
   * Filtra productos por categoría
   */
  filterByCategory(categoryId) {
    if (categoryId === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      // Validamos usando tanto categoryId como category_id por si el mapeo del Factory varía
      this.filteredProducts = this.products.filter(p => 
        (p.categoryId == categoryId) || (p.category_id == categoryId)
      );
    }
    this.currentPage = 1;
    return this.filteredProducts;
  }

  /**
   * Filtra productos por rango de precio
   */
  filterByPrice(minPrice, maxPrice) {
    this.filteredProducts = this.products.filter(
      p => p.price >= minPrice && p.price <= maxPrice
    );
    this.currentPage = 1;
    return this.filteredProducts;
  }

  /**
   * Busca productos por término
   */
  searchProducts(term) {
    const searchTerm = term.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.code.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
    this.currentPage = 1;
    return this.filteredProducts;
  }

  /**
   * Obtiene un producto por ID
   */
  getProductById(id) {
    return this.products.find(p => p.id == id);
  }

  /**
   * Crea un nuevo producto
   */
  async createProduct(productData) {
    try {
      // Validar con Factory
      const result = ProductFactory.createAndValidate(productData);
      if (!result.success) {
        return { success: false, errors: result.errors };
      }

      const product = result.product;
      const { data, error } = await supabaseClient
        .from(TABLES.PRODUCTS)
        .insert([product.toJSON()])
        .select();

      if (error) {
        console.error('Error al crear producto:', error);
        return { success: false, error: error.message };
      }

      // Crear instancia con ID retornado
      const newProduct = ProductFactory.createProduct(data[0]);
      this.products.push(newProduct);
      this.filteredProducts.push(newProduct);

      console.log('✓ Producto creado:', product.name);
      return { success: true, data: newProduct };
    } catch (error) {
      console.error('Error en createProduct:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualiza un producto
   */
  async updateProduct(id, productData) {
    try {
      const { data, error } = await supabaseClient
        .from(TABLES.PRODUCTS)
        .update(productData)
        .eq('id', id)
        .select();

      if (error) {
        return { success: false, error: error.message };
      }

      // Actualizar en lista local
      const index = this.products.findIndex(p => p.id == id);
      if (index !== -1) {
        this.products[index] = ProductFactory.createProduct(data[0]);
      }

      console.log('✓ Producto actualizado');
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error en updateProduct:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Elimina un producto (soft delete)
   */
  async deleteProduct(id) {
    try {
      const { data, error } = await supabaseClient
        .from(TABLES.PRODUCTS)
        .update({ is_active: false })
        .eq('id', id)
        .select();

      if (error) {
        return { success: false, error: error.message };
      }

      // Remover de lista local
      this.products = this.products.filter(p => p.id != id);
      this.filteredProducts = this.filteredProducts.filter(p => p.id != id);

      console.log('✓ Producto eliminado');
      return { success: true };
    } catch (error) {
      console.error('Error en deleteProduct:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtiene estadísticas de productos
   */
  getStatistics() {
    return {
      totalProducts: this.products.length,
      availableProducts: this.products.filter(p => p.isAvailable()).length,
      outOfStockProducts: this.products.filter(p => p.stock === 0).length,
      averagePrice: this.products.length > 0
        ? (this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length).toFixed(2)
        : 0,
      totalStock: this.products.reduce((sum, p) => sum + p.stock, 0)
    };
  }

  /**
   * Obtiene productos no aprobados (necesitan revisión de calidad)
   */
  getPendingApprovalProducts() {
    return this.products.filter(p => p.qualityStatus !== QUALITY_STATUS.APPROVED);
  }
}

// Instancia global del controlador
const productController = new ProductController();

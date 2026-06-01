// ========================================
// MODELO: Producto
// ========================================
// Representa una prenda de ropa en el catálogo

class Product {
  constructor(data = {}) {
    this.id = data.id || null;
    this.code = data.code || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.categoryId = data.category_id || null;
    this.categoryId = data.category_id || data.categoryId || null;
    this.category = (data.category && typeof data.category === 'object') 
      ? data.category.name 
      : (data.category || '');
    this.price = data.price || 0;
    this.stock = data.stock || 0;
    this.imageUrl = data.image_url || '';
    this.isActive = data.is_active !== false;
    this.qualityStatus = data.quality_status || QUALITY_STATUS.PENDING;
    this.createdAt = data.created_at || new Date().toISOString();
    this.updatedAt = data.updated_at || new Date().toISOString();
    this.createdBy = data.created_by || 'system';
  }

  /**
   * Valida los datos del producto según ISO 9001
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.length < VALIDATION.PRODUCT_NAME_MIN) {
      errors.push(`El nombre debe tener al menos ${VALIDATION.PRODUCT_NAME_MIN} caracteres`);
    }

    if (this.name.length > VALIDATION.PRODUCT_NAME_MAX) {
      errors.push(`El nombre no puede exceder ${VALIDATION.PRODUCT_NAME_MAX} caracteres`);
    }

    if (this.price < VALIDATION.PRICE_MIN) {
      errors.push(`El precio debe ser mayor o igual a ${VALIDATION.PRICE_MIN}`);
    }

    if (this.stock < VALIDATION.STOCK_MIN) {
      errors.push(`El stock debe ser mayor o igual a ${VALIDATION.STOCK_MIN}`);
    }

    if (!this.code) {
      errors.push('El código del producto es requerido');
    }

    if (this.description.length > VALIDATION.DESCRIPTION_MAX) {
      errors.push(`La descripción no puede exceder ${VALIDATION.DESCRIPTION_MAX} caracteres`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Obtiene el formato de precio localizado
   */
  getFormattedPrice() {
    return `${CONFIG.CURRENCY_SYMBOL}${this.price.toFixed(2)}`;
  }

  /**
   * Obtiene el estado de disponibilidad
   */
  isAvailable() {
    return this.isActive && this.stock > 0 && this.qualityStatus === QUALITY_STATUS.APPROVED;
  }

  /**
   * Obtiene la información como objeto
   */
toJSON() {
  return {
    code: this.code,
    name: this.name,
    description: this.description,
    category_id: this.categoryId,
    price: this.price,
    stock: this.stock,       
    image_url: this.imageUrl,
    is_active: this.isActive,
    quality_status: this.qualityStatus,
    created_by: this.createdBy
  };
}

  /**
   * Obtiene la información como HTML
   */
  toHTML() {
    const availabilityClass = this.isAvailable() ? 'available' : 'unavailable';
    const stockText = this.stock > 0 ? `${this.stock} en stock` : 'Agotado';

    return `
      <div class="product-card ${availabilityClass}" data-product-id="${this.id}">
        <div class="product-image">
          <img src="${this.imageUrl || 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&h=500&fit=crop'}" alt="${this.name}" onerror="this.style.display='none'">
        </div>
        <div class="product-info">
          <h3 class="product-name">${this.name}</h3>
          <p class="product-code">Código: ${this.code}</p>
          <p class="product-category">${this.category}</p>
          <p class="product-description">${this.description}</p>
          <div class="product-footer">
            <span class="product-price">${this.getFormattedPrice()}</span>
            <span class="product-stock ${this.stock > 5 ? 'in-stock' : 'low-stock'}">${stockText}</span>
          </div>
          <div class="product-status">
            <span class="quality-badge status-${this.qualityStatus}">${this.qualityStatus.toUpperCase()}</span>
          </div>
          ${this.isAvailable() ? `<button class="btn-add-to-cart" onclick="addToCart(${this.id})">Agregar al carrito</button>` : ''}
        </div>
      </div>
    `;
  }
}

// ========================================
// UTILIDADES: Carrito de Compras
// ========================================

class ShoppingCart {
  constructor() {
    this.items = this.loadFromStorage();
  }

  /**
   * Agrega un producto al carrito
   */
  addItem(productId, quantity = 1) {
    const product = productController.getProductById(productId);
    if (!product) return false;

    const existingItem = this.items.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: productId,
        code: product.code,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl
      });
    }

    this.saveToStorage();
    return true;
  }

  /**
   * Elimina un producto del carrito
   */
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
  }

  /**
   * Actualiza la cantidad de un producto
   */
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeItem(productId);
      } else {
        this.saveToStorage();
      }
    }
  }

  /**
   * Obtiene el total del carrito
   */
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Obtiene la cantidad total de items
   */
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Obtiene todos los items
   */
  getItems() {
    return this.items;
  }

  /**
   * Limpia el carrito
   */
  clear() {
    this.items = [];
    this.saveToStorage();
  }

  /**
   * Procesa la compra enviando los datos a Supabase (ISO 9001 - Trazabilidad de Ventas)
   */
  async checkout(customerName, customerEmail) {
    if (this.items.length === 0) return { success: false, error: "El carrito está vacío" };

    try {
      const orderNumber = `ORD-${Date.now()}`;
      const totalAmount = this.getTotal();

      // 1. Insertar la Cabecera de la Orden
      const { data: orderData, error: orderError } = await supabaseClient
        .from('orders')
        .insert([{
          order_number: orderNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          total_amount: totalAmount,
          status: 'pending'
        }])
        .select();

      if (orderError) throw new Error(`Error en Orden: ${orderError.message}`);
      const insertedOrder = orderData[0];

      // 2. Preparar los Detalles de la Orden mapeados exactamente a tu esquema SQL
      const detailsToInsert = this.items.map(item => ({
        order_id: insertedOrder.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      // 3. Insertar los detalles en bloque
      const { error: detailsError } = await supabaseClient
        .from('order_details')
        .insert(detailsToInsert);

      if (detailsError) throw new Error(`Error en Detalles: ${detailsError.message}`);

      // 4. Registrar éxito en la auditoría local e ISO
      auditLogger.logPurchase(this.items, totalAmount);

      // 5. Limpiar carrito
      this.clear();
      console.log(`✓ Compra procesada con éxito: ${orderNumber}`);
      return { success: true, orderNumber: orderNumber };

    } catch (error) {
      console.error('❌ Error en el proceso de checkout:', error);
      auditLogger.logError(error.message, { context: 'checkout' });
      return { success: false, error: error.message };
    }
  }
  /**
   * Guarda el carrito en localStorage
   */
  saveToStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.items));
  }

  /**
   * Carga el carrito desde localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('shoppingCart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error cargando carrito:', error);
      return [];
    }
  }

  /**
   * Obtiene HTML del carrito
   */
  toHTML() {
    if (this.items.length === 0) {
      return '<p class="empty-cart">El carrito está vacío</p>';
    }

    let html = '<table class="cart-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th><th>Acción</th></tr></thead><tbody>';

    this.items.forEach(item => {
      const subtotal = (item.price * item.quantity).toFixed(2);
      html += `
        <tr class="cart-item">
          <td>${item.name}</td>
          <td><input type="number" value="${item.quantity}" min="1" onchange="shoppingCart.updateQuantity(${item.id}, this.value)"></td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${subtotal}</td>
          <td><button onclick="shoppingCart.removeItem(${item.id})">Eliminar</button></td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    html += `<div class="cart-summary">
      <p>Total: <strong>$${this.getTotal().toFixed(2)}</strong></p>
      <button class="btn-checkout" onclick="openCheckoutModal()">Proceder al Pago</button>
      <button class="btn-continue-shopping" onclick="goToSection('catalog')">Continuar Comprando</button>
    </div>`;

    return html;
  }
}
/**
 * Abre el modal de pago alternativo al prompt rústico
 */
function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('show');
    // Auto-rellenar si hay datos de prueba
    document.getElementById('checkout-form').reset();
  }
}

/**
 * Cierra el modal de pago
 */
function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('show');
}

/**
 * Maneja el envío del formulario del modal de checkout
 */
async function submitCheckoutForm(event) {
  event.preventDefault();
  
  const name = document.getElementById('modal-customer-name').value.trim();
  const email = document.getElementById('modal-customer-email').value.trim();
  
  closeCheckoutModal();
  showNotification('Procesando su orden de compra...', 'info');

  const result = await shoppingCart.checkout(name, email);
  
  if (result.success) {
    showNotification(`¡Compra exitosa! Código de Orden: ${result.orderNumber}`, 'success');
    if (typeof goToSection === 'function') goToSection('catalog');
  } else {
    showNotification(`Error al registrar el pedido: ${result.error}`, 'error');
  }
}

// Instancia global del carrito
const shoppingCart = new ShoppingCart();

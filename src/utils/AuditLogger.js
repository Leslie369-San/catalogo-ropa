// ========================================
// UTILIDADES: Logger y Auditoría (ISO 9001)
// ========================================

class AuditLogger {
  constructor() {
    this.logs = this.loadFromStorage();
  }

  /**
   * Registra una acción en el sistema
   */
  log(action, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: action,
      details: details,
      userAgent: navigator.userAgent
    };

    this.logs.push(logEntry);

    // Mantener solo los últimos 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    this.saveToStorage();
    console.log(`[${action}]`, details);

    return logEntry;
  }

  /**
   * Registra un producto visto
   */
  logProductView(product) {
    this.log('PRODUCT_VIEW', {
      productId: product.id,
      productName: product.name,
      category: product.category
    });
  }

  /**
   * Registra un producto agregado al carrito
   */
  logAddToCart(product, quantity) {
    this.log('ADD_TO_CART', {
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      price: product.price
    });
  }

  /**
   * Registra una compra completada
   */
  logPurchase(cartItems, total) {
    this.log('PURCHASE_COMPLETED', {
      itemCount: cartItems.length,
      total: total,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Registra un error
   */
  logError(errorMessage, context = {}) {
    this.log('ERROR', {
      message: errorMessage,
      context: context
    });
  }

  /**
   * Obtiene todos los logs
   */
  getLogs() {
    return this.logs;
  }

  /**
   * Obtiene logs de una acción específica
   */
  getLogsByAction(action) {
    return this.logs.filter(log => log.action === action);
  }

  /**
   * Exporta logs en formato CSV
   */
  exportToCSV() {
    let csv = 'Timestamp,Action,Details\n';
    this.logs.forEach(log => {
      csv += `"${log.timestamp}","${log.action}","${JSON.stringify(log.details)}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  /**
   * Guarda los logs en localStorage
   */
  saveToStorage() {
    localStorage.setItem('auditLogs', JSON.stringify(this.logs));
  }

  /**
   * Carga los logs desde localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('auditLogs');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error cargando logs:', error);
      return [];
    }
  }

  /**
   * Limpia todos los logs
   */
  clear() {
    this.logs = [];
    this.saveToStorage();
  }
}

// Instancia global del logger
const auditLogger = new AuditLogger();

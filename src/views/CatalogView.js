// ========================================
// VISTA: Catálogo de Productos
// ========================================

class CatalogView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentFilters = {
      category: 'all',
      searchTerm: '',
      minPrice: 0,
      maxPrice: 1000
    };
  }

  /**
   * Renderiza el catálogo de productos
   */
  render(products) {
    if (!this.container) return;

    if (products.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>No se encontraron productos</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = products
      .map(product => product.toHTML())
      .join('');

    // Agregar event listeners
    this.attachEventListeners();
  }

  /**
   * Renderiza la paginación
   */
  renderPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    let html = `<div class="pagination">`;

    // Botón anterior
    if (currentPage > 1) {
      html += `<button class="btn-pagination" onclick="goToPage(${currentPage - 1})">← Anterior</button>`;
    }

    // Números de página
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      html += `<button class="btn-pagination" onclick="goToPage(1)">1</button>`;
      if (startPage > 2) html += `<span class="pagination-dots">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
      const activeClass = i === currentPage ? 'active' : '';
      html += `<button class="btn-pagination ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += `<span class="pagination-dots">...</span>`;
      html += `<button class="btn-pagination" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Botón siguiente
    if (currentPage < totalPages) {
      html += `<button class="btn-pagination" onclick="goToPage(${currentPage + 1})">Siguiente →</button>`;
    }

    html += `</div>`;
    paginationContainer.innerHTML = html;
  }

  /**
   * Renderiza el panel de filtros
   */
  renderFilters(categories) {
    const filterPanel = document.getElementById('filter-panel');
    if (!filterPanel) return;

    let html = `
      <div class="filter-section">
        <h3>Filtros</h3>
        
        <div class="filter-group">
          <label>Categoría</label>
          <select id="category-filter" onchange="applyFilters()">
            <option value="all">Todas las categorías</option>
    `;

    categories.forEach(cat => {
      html += `<option value="${cat.id}">${cat.name}</option>`;
    });

    html += `
          </select>
        </div>

        <div class="filter-group">
          <label>Rango de Precio</label>
          <input type="range" id="price-filter" min="0" max="500" step="10" value="500" onchange="applyFilters()">
          <div class="price-display">
            <span>$0 - $<span id="price-value">500</span></span>
          </div>
        </div>

        <button class="btn-reset-filters" onclick="resetFilters()">Limpiar Filtros</button>
      </div>
    `;

    filterPanel.innerHTML = html;
  }

  /**
   * Renderiza la barra de búsqueda
   */
  renderSearchBar() {
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer) return;

    searchContainer.innerHTML = `
      <div class="search-bar">
        <input 
          type="text" 
          id="search-input" 
          placeholder="Buscar productos..."
          onkeyup="handleSearch()"
          class="search-input"
        >
        <button class="btn-search" onclick="handleSearch()">🔍 Buscar</button>
      </div>
    `;
  }

  /**
   * Renderiza la información de estadísticas
   */
  renderStatistics(stats) {
    const statsContainer = document.getElementById('statistics');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Total Productos</span>
          <span class="stat-value">${stats.totalProducts}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Disponibles</span>
          <span class="stat-value">${stats.availableProducts}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Agotados</span>
          <span class="stat-value">${stats.outOfStockProducts}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Precio Promedio</span>
          <span class="stat-value">\$${stats.averagePrice}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Stock Total</span>
          <span class="stat-value">${stats.totalStock}</span>
        </div>
      </div>
    `;
  }

  /**
   * Adjunta event listeners a los productos
   */
  attachEventListeners() {
    const cards = this.container.querySelectorAll('.product-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.classList.add('hover');
      });
      card.addEventListener('mouseleave', function() {
        this.classList.remove('hover');
      });
    });
  }

  /**
   * Muestra un mensaje de notificación
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Limpia la vista
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Instancia global
const catalogView = new CatalogView('products-container');

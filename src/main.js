// ========================================
// SCRIPT PRINCIPAL - Orquestación de la Aplicación
// ========================================

let currentSection = 'catalog';
let categories = [];

/**
 * Inicializa la aplicación de forma latente (Esperando autenticación)
 */
async function initializeApp() {
  console.log('🚀 Iniciando Sistema de Gestión de Catálogo de Ropa...');
  console.log(`📋 Versión: ${CONFIG.VERSION}`);
  console.log(`🏛️ Norma ISO: ${CONFIG.ISO_COMPLIANCE}`);
  console.log(`🔨 Patrón de Diseño: ${CONFIG.DESIGN_PATTERN}`);

  try {
    // Validar conexión a Supabase
    if (!supabaseClient) {
      throw new Error('Supabase no está configurado correctamente');
    }

    // Cargar categorías
    await loadCategories();

    // Cargar productos en memoria del controlador
    const result = await productController.fetchProducts();
    if (!result.success) {
      console.error('Error cargando productos:', result.error);
      showNotification('Error al cargar productos', 'error');
      
      // Cargar datos de prueba como fallback
      loadMockData();
    }

    // Sincronizar el conteo visual del carrito
    renderCartBadge();

    // Log de inicialización técnica
    auditLogger.log('APP_INITIALIZED', {
      version: CONFIG.VERSION,
      productsLoaded: productController.products.length
    });

    console.log('✅ Aplicación inicializada en segundo plano. Esperando Login...');
  } catch (error) {
    console.error('❌ Error en inicialización:', error);
    auditLogger.logError('APP_INITIALIZATION_FAILED', { error: error.message });
    loadMockData(); // Fallback de contingencia
  }
}

/**
 * Carga las categorías de Supabase
 */
async function loadCategories() {
  try {
    const { data, error } = await supabaseClient
      .from(TABLES.CATEGORIES)
      .select('*');

    if (error) throw error;

    categories = data || [
      { id: 1, name: 'Camisetas' },
      { id: 2, name: 'Pantalones' },
      { id: 3, name: 'Vestidos' },
      { id: 4, name: 'Accesorios' }
    ];

    console.log(`✓ ${categories.length} categorías cargadas`);
  } catch (error) {
    console.error('Error cargando categorías:', error);
    categories = [
      { id: 1, name: 'Camisetas' },
      { id: 2, name: 'Pantalones' },
      { id: 3, name: 'Vestidos' },
      { id: 4, name: 'Accesorios' }
    ];
  }
}

/**
 * Carga datos de prueba (Mock)
 */
function loadMockData() {
  console.log('📝 Cargando datos de prueba...');
  productController.products = ProductFactory.createMockProducts();
  productController.filteredProducts = [...productController.products];
  auditLogger.log('MOCK_DATA_LOADED', { productCount: productController.products.length });
}

/**
 * Renderiza el catálogo de productos
 */
async function renderCatalog() {
  // Renderizar barra de búsqueda
  catalogView.renderSearchBar();

  // Renderizar filtros
  catalogView.renderFilters(categories);

  // Obtener primera página
  const page = 1;
  const products = productController.getPaginatedProducts(page);
  catalogView.render(products);

  // Renderizar paginación
  const totalPages = productController.getTotalPages();
  catalogView.renderPagination(page, totalPages);

  // Renderizar estadísticas
  const stats = productController.getStatistics();
  catalogView.renderStatistics(stats);

  const categoryFilterElement = document.getElementById('category-filter');
  if (categoryFilterElement) {
    categoryFilterElement.addEventListener('change', applyFilters);
  }

  auditLogger.log('CATALOG_RENDERED', {
    productsCount: products.length,
    totalProducts: productController.products.length
  });
}

/**
 * Navega a una página específica
 */
function goToPage(page) {
  const products = productController.getPaginatedProducts(page);
  catalogView.render(products);
  catalogView.renderPagination(page, productController.getTotalPages());
  window.scrollTo(0, 0);

  auditLogger.log('PAGE_CHANGED', { page: page });
}

/**
 * Aplica los filtros seleccionados
 */
function applyFilters() {
  const categorySelect = document.getElementById('category-filter');
  const priceRange = document.getElementById('price-filter');
  const priceValue = document.getElementById('price-value');

  if (categorySelect) {
    const categoryValue = categorySelect.value;
    const categoryParam = categoryValue === 'all' ? 'all' : parseInt(categoryValue, 10);
    productController.filterByCategory(categoryParam);
  }

  if (priceRange) {
    const maxPrice = parseInt(priceRange.value);
    if (priceValue) priceValue.textContent = maxPrice;
    productController.filterByPrice(0, maxPrice);
  }

  const filtered = productController.getPaginatedProducts(1);
  catalogView.render(filtered);
  catalogView.renderPagination(1, productController.getTotalPages());
  catalogView.renderStatistics(productController.getStatistics());

  auditLogger.log('FILTERS_APPLIED_AND_RENDERED', { count: filtered.length });
}

/**
 * Limpia los filtros
 */
function resetFilters() {
  productController.filteredProducts = [...productController.products];
  productController.currentPage = 1;

  const categorySelect = document.getElementById('category-filter');
  const priceRange = document.getElementById('price-filter');

  if (categorySelect) categorySelect.value = 'all';
  if (priceRange) priceRange.value = 500;

  renderCatalog();
  auditLogger.log('FILTERS_RESET', {});
}

/**
 * Maneja la búsqueda
 */
function handleSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  const term = searchInput.value.trim();
  if (term.length === 0) {
    resetFilters();
    return;
  }

  productController.searchProducts(term);
  goToPage(1);

  auditLogger.log('SEARCH_PERFORMED', {
    searchTerm: term,
    resultsFound: productController.filteredProducts.length
  });
}

/**
 * Agrega un producto al carrito
 */
function addToCart(productId) {
  const product = productController.getProductById(productId);
  if (!product) return;

  shoppingCart.addItem(productId, 1);
  renderCartBadge();

  auditLogger.logAddToCart(product, 1);
  showNotification(`${product.name} agregado al carrito`, 'success');
}

/**
 * Actualiza el badge del carrito
 */
function renderCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const count = shoppingCart.getItemCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

/**
 * Renderiza la sección del carrito
 */
function renderCartSection() {
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;

  cartContainer.innerHTML = shoppingCart.toHTML();
  auditLogger.log('CART_VIEWED', { itemCount: shoppingCart.getItemCount() });
}

/**
 * Navega a una sección específica
 */
function goToSection(sectionName) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  const section = document.getElementById(`${sectionName}-section`);
  if (section) {
    section.classList.add('active');
    currentSection = sectionName;

    if (sectionName === 'cart') {
      renderCartSection();
    } else if (sectionName === 'admin') {
      renderAdminPanel();
    } else if (sectionName === 'catalog') {
      renderCatalog();
    }

    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    
    if (event && event.target && event.target.classList.contains('nav-btn')) {
      event.target.classList.add('active');
    }

    window.scrollTo(0, 0);
    auditLogger.log('SECTION_CHANGED', { section: sectionName });
  }
}

/**
 * Renderiza el panel de administración
 */
function renderAdminPanel() {
  const categorySelect = document.getElementById('category-select');
  if (categorySelect) {
    categorySelect.innerHTML = categories
      .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
      .join('');
  }
  showAdminTab('dashboard');
}

/**
 * Muestra una pestaña del admin
 */
function showAdminTab(tabName) {
  document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  const tab = document.getElementById(`${tabName}-tab`);
  if (tab) {
    tab.classList.add('active');
    if (event && event.target) event.target.classList.add('active');

    if (tabName === 'dashboard') {
      loadDashboard();
    } else if (tabName === 'products') {
      loadProductsList();
    } else if (tabName === 'audit') {
      loadAuditLogs();
    }
  }
}

/**
 * Carga el dashboard
 */
function loadDashboard() {
  const statsContainer = document.getElementById('admin-statistics');
  const pendingContainer = document.getElementById('pending-approval');

  const stats = productController.getStatistics();
  statsContainer.innerHTML = `
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
      <span class="stat-value">$${stats.averagePrice}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Stock Total</span>
      <span class="stat-value">${stats.totalStock}</span>
    </div>
  `;

  const pendingProducts = productController.getPendingApprovalProducts();
  if (pendingProducts.length > 0) {
    pendingContainer.innerHTML = `
      <h3>⚠️ Productos Pendientes de Aprobación</h3>
      <div class="pending-list">
        ${pendingProducts.map(p => `
          <div class="pending-item">
            <span>${p.name} (${p.code})</span>
            <button onclick="approveProduct(${p.id})">Aprobar</button>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    pendingContainer.innerHTML = '';
  }
}

/**
 * Carga la lista de productos en admin
 */
function loadProductsList() {
  const listContainer = document.getElementById('products-list');
  listContainer.innerHTML = `
    <h4>Productos Registrados (${productController.products.length})</h4>
    <table class="admin-products-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${productController.products.map(p => `
          <tr>
            <td>${p.code}</td>
            <td>${p.name}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td><span class="badge status-${p.qualityStatus}">${p.qualityStatus}</span></td>
            <td>
              <button onclick="deleteProductAdmin(${p.id})" class="btn-small btn-danger">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Carga los logs de auditoría
 */
function loadAuditLogs() {
  const logsContainer = document.getElementById('audit-logs');
  const logs = auditLogger.getLogs().reverse();

  if (logs.length === 0) {
    logsContainer.innerHTML = '<p>No hay registros de auditoría</p>';
    return;
  }

  logsContainer.innerHTML = `
    <table class="audit-table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Acción</th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody>
        ${logs.slice(0, 50).map(log => `
          <tr>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
            <td><strong>${log.action}</strong></td>
            <td>${JSON.stringify(log.details)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Maneja el envío del formulario de producto
 */
async function handleProductSubmit(event) {
  event.preventDefault();
  try {
    const product = ProductFactory.createFromForm(event.target);
    const result = await productController.createProduct(product.toJSON());

    if (result.success) {
      event.target.reset();
      showNotification('Producto creado correctamente', 'success');
      loadProductsList();
      renderCatalog();
    } else {
      showNotification(result.errors.join(', '), 'error');
    }
  } catch (error) {
    console.error('Error al crear producto:', error);
  }
}

/**
 * Elimina un producto desde admin
 */
async function deleteProductAdmin(productId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
  const result = await productController.deleteProduct(productId);
  if (result.success) {
    showNotification('Producto eliminado', 'success');
    loadProductsList();
    renderCatalog();
  }
}

/**
 * Aprueba un producto
 */
async function approveProduct(productId) {
  const result = await productController.updateProduct(productId, {
    quality_status: QUALITY_STATUS.APPROVED
  });
  if (result.success) {
    showNotification('Producto aprobado', 'success');
    loadDashboard();
    renderCatalog();
  }
}

/**
 * Limpia los logs de auditoría
 */
function clearAuditLogs() {
  if (confirm('¿Deseas limpiar todos los logs de auditoría?')) {
    auditLogger.clear();
    loadAuditLogs();
    showNotification('Logs limpiados', 'success');
  }
}

/**
 * Muestra una notificación en pantalla
 */
function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications-container');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = `notification notification-${type} show`;
  notification.textContent = message;
  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Alterna el tema claro/oscuro
 */
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/**
 * Carga el tema guardado
 */
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
}

/**
 * CONTROLADOR DE AUTENTICACIÓN (LOGIN DE USUARIOS)
 */
async function handleLogin(event) {
  event.preventDefault();
  
  const usernameInput = document.getElementById('login-username').value.trim();
  const passwordInput = document.getElementById('login-password').value.trim();
  
  showNotification('Verificando credenciales...', 'info');

  try {
    const { data, error } = await supabaseClient
      .from('usuarios')
      .select('*, roles(nombre_rol)')
      .eq('username', usernameInput)
      .eq('password_hash', passwordInput);

    if (error) {
      console.error('Error en consulta Supabase:', error);
      showNotification('Error de comunicación con el servidor', 'error');
      return;
    }

    if (!data || data.length === 0) {
      showNotification('Usuario o contraseña incorrectos', 'error');
      return;
    }

    const usuarioValido = data[0];
    const userRole = (usuarioValido.roles && usuarioValido.roles.nombre_rol) 
      ? usuarioValido.roles.nombre_rol 
      : 'cliente';
    
    const sessionUser = {
      username: usuarioValido.username,
      fullName: usuarioValido.nombre_completo,
      role: userRole
    };
    sessionStorage.setItem('activeSession', JSON.stringify(sessionUser));

    showNotification(`¡Bienvenido, ${usuarioValido.nombre_completo}!`, 'success');
    applyRoleAuthorization(userRole);

  } catch (err) {
    console.error('Error en proceso de login:', err);
    showNotification('Error crítico en el flujo de autenticación', 'error');
  }
}

/**
 * RENDERIZADO CONDICIONAL POR ROLES
 */
function applyRoleAuthorization(role) {
  document.getElementById('login-section').classList.remove('active');
  
  const catalogBtn = document.getElementById('nav-catalog-btn');
  const cartBtn = document.getElementById('nav-cart-btn');
  const adminBtn = document.getElementById('nav-admin-btn');

  if (catalogBtn) catalogBtn.style.display = 'inline-block';
  if (cartBtn) cartBtn.style.display = 'inline-block';

  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) logoutBtn.style.display = 'inline-block';

  if (role === 'admin') {
    if (adminBtn) adminBtn.style.display = 'inline-block';
    goToSection('admin');
  } else {
    if (adminBtn) adminBtn.style.display = 'none';
    goToSection('catalog');
  }
}
function handleLogout() {
  sessionStorage.removeItem('activeSession');

  // Ocultar botones del nav
  document.getElementById('nav-catalog-btn').style.display = 'none';
  document.getElementById('nav-cart-btn').style.display = 'none';
  document.getElementById('nav-admin-btn').style.display = 'none';
  document.getElementById('nav-logout-btn').style.display = 'none';

  // Volver al login
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('login-section').classList.add('active');

  // Limpiar el formulario
  document.getElementById('login-form').reset();

  auditLogger.log('USER_LOGOUT', {});
  showNotification('Sesión cerrada correctamente', 'info');
}

// ========================================
// UNICO PUNTO DE ENTRADA DOMContentLoaded
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
  loadTheme();
  await initializeApp();

  // Validación preventiva de persistencia de sesión
  const savedSession = sessionStorage.getItem('activeSession');
  if (savedSession) {
    const user = JSON.parse(savedSession);
    setTimeout(() => applyRoleAuthorization(user.role), 500);
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === 'shoppingCart') {
    shoppingCart.items = shoppingCart.loadFromStorage();
    renderCartBadge();
  }
});

console.log('✅ Script principal orquestado correctamente');
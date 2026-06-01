// ========================================
// SCRIPT PRINCIPAL - Orquestación de la Aplicación
// ========================================

let currentSection = 'catalog';
let categories = [];

/**
 * Inicializa la aplicación
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

    // Cargar productos
    const result = await productController.fetchProducts();
    if (!result.success) {
      console.error('Error cargando productos:', result.error);
      showNotification('Error al cargar productos', 'error');
      
      // Cargar datos de prueba como fallback
      loadMockData();
    }

    // Renderizar interfaz inicial
    await renderCatalog();
    renderCartBadge();

    // Log de inicialización
    auditLogger.log('APP_INITIALIZED', {
      version: CONFIG.VERSION,
      productsLoaded: productController.products.length
    });

    console.log('✅ Aplicación inicializada correctamente');
  } catch (error) {
    console.error('❌ Error en inicialización:', error);
    auditLogger.logError('APP_INITIALIZATION_FAILED', { error: error.message });
    loadMockData(); // Cargar datos de prueba como fallback
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
// Al final de la función applyFilters() en main.js, déjala estructurada así:
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

  // Forzamos a la vista a renderizar los productos que el controlador acaba de filtrar
  const filtered = productController.getPaginatedProducts(1);
  catalogView.render(filtered);
  catalogView.renderPagination(1, productController.getTotalPages());
  
  // Actualizamos estadísticas por si cambian en la vista filtrada
  catalogView.renderStatistics(productController.getStatistics());

  auditLogger.log('FILTERS_APPLIED_AND_RENDERED', {
    count: filtered.length
  });
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
  // Ocultar todas las secciones
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // Mostrar sección seleccionada
  const section = document.getElementById(`${sectionName}-section`);
  if (section) {
    section.classList.add('active');
    currentSection = sectionName;

    // Renderizar contenido específico
    if (sectionName === 'cart') {
      renderCartSection();
    } else if (sectionName === 'admin') {
      renderAdminPanel();
    } else if (sectionName === 'catalog') {
      renderCatalog();
    }

    // Actualizar nav activa
    document.querySelectorAll('.nav-btn').forEach((btn, idx) => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    window.scrollTo(0, 0);
    auditLogger.log('SECTION_CHANGED', { section: sectionName });
  }
}

/**
 * Renderiza el panel de administración
 */
function renderAdminPanel() {
  // Rellenar select de categorías
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
  // Ocultar todas las pestañas
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Mostrar pestaña seleccionada
  const tab = document.getElementById(`${tabName}-tab`);
  if (tab) {
    tab.classList.add('active');
    event.target.classList.add('active');

    // Cargar contenido específico
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
      <span class="stat-value">\$${stats.averagePrice}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Stock Total</span>
      <span class="stat-value">${stats.totalStock}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Items en Carrito</span>
      <span class="stat-value">${shoppingCart.getItemCount()}</span>
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
            <span>Estado: ${p.qualityStatus}</span>
            <button onclick="approveProduct(${p.id})">Aprobar</button>
          </div>
        `).join('')}
      </div>
    `;
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
          <th>Categoría</th>
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
            <td>${p.category || categories.find(c => c.id == p.categoryId)?.name || 'Sin categoría'}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td><span class="badge status-${p.qualityStatus}">${p.qualityStatus}</span></td>
            <td>
              <button onclick="editProduct(${p.id})" class="btn-small">✏️</button>
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
      auditLogger.log('PRODUCT_CREATED', { productId: result.data.id, productName: product.name });
    } else {
      showNotification(result.errors.join(', '), 'error');
    }
  } catch (error) {
    console.error('Error al crear producto:', error);
    showNotification('Error al crear producto', 'error');
    auditLogger.logError('PRODUCT_CREATION_FAILED', { error: error.message });
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
  } else {
    showNotification('Error al eliminar producto', 'error');
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
 * Muestra una notificación
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
 * Alterna el tema (claro/oscuro)
 */
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  auditLogger.log('THEME_TOGGLED', { theme: isDark ? 'dark' : 'light' });
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

// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initializeApp();
});

// Actualizar carrito cuando cambia
window.addEventListener('storage', (event) => {
  if (event.key === 'shoppingCart') {
    shoppingCart.items = shoppingCart.loadFromStorage();
    renderCartBadge();
  }
});

console.log('✅ Script principal cargado');
/**
 * Gestiona la autenticación de usuarios y asignación condicional de roles
 */
async function handleLogin(event) {
  event.preventDefault();
  
  const usernameInput = document.getElementById('login-username').value.trim();
  const passwordInput = document.getElementById('login-password').value.trim();
  
  showNotification('Verificando credenciales...', 'info');

try {
    // Consultamos la tabla de usuarios trayendo el nombre del rol asociado
    const { data, error } = await supabaseClient
      .from('usuarios')
      .select('*, roles(nombre_rol)')
      .eq('username', usernameInput)
      .eq('password_hash', passwordInput); // Filtro directo de credenciales

    if (error) {
      console.error('Error en consulta Supabase:', error);
      showNotification('Error al conectar con la base de datos', 'error');
      return;
    }

    // Validamos si el arreglo devuelto está vacío (credenciales incorrectas)
    if (!data || data.length === 0) {
      showNotification('Usuario o contraseña incorrectos', 'error');
      return;
    }

    // Como las credenciales coinciden, tomamos el primer registro encontrado
    const usuarioValido = data[0];

    // Extraemos el rol del objeto anidado o asignamos 'cliente' por defecto
    const userRole = (usuarioValido.roles && usuarioValido.roles.nombre_rol) 
      ? usuarioValido.roles.nombre_rol 
      : 'cliente';
    
    // Almacenamos el estado de la sesión activa en el navegador
    const sessionUser = {
      username: usuarioValido.username,
      fullName: usuarioValido.nombre_completo,
      role: userRole
    };
    sessionStorage.setItem('activeSession', JSON.stringify(sessionUser));

    showNotification(`¡Bienvenido, ${usuarioValido.nombre_completo}!`, 'success');
    
    // Aplicamos los permisos y renderizado condicional según el rol
    applyRoleAuthorization(userRole);

  } catch (err) {
    console.error('Error en proceso de login:', err);
    showNotification('Error interno en el hilo de ejecución', 'error');
  }
}

/**
 * Renderizado Condicional: Muestra u oculta módulos del DOM según el rol jerárquico
 */
function applyRoleAuthorization(role) {
  // 1. Ocultar de inmediato la sección del formulario de login
  document.getElementById('login-section').classList.remove('active');
  
  // 2. Recuperar referencias de los botones de la barra de navegación
  const catalogBtn = document.getElementById('nav-catalog-btn');
  const cartBtn = document.getElementById('nav-cart-btn');
  const adminBtn = document.getElementById('nav-admin-btn');

  // 3. Habilitar accesos comunes para ambos roles
  if (catalogBtn) catalogBtn.style.display = 'inline-block';
  if (cartBtn) cartBtn.style.display = 'inline-block';

  // 4. Aplicar restricción estricta sobre el panel de control administrativo
  if (role === 'admin') {
    if (adminBtn) adminBtn.style.display = 'inline-block';
    // Redirección por defecto al panel de control integral
    goToSection('admin');
  } else {
    if (adminBtn) adminBtn.style.display = 'none';
    // Redirección por defecto a la vista comercial de clientes
    goToSection('catalog');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initializeApp();

  // Verificación preventiva de persistencia de sesión
  const savedSession = sessionStorage.getItem('activeSession');
  if (savedSession) {
    const user = JSON.parse(savedSession);
    // Demora sutil para esperar el renderizado del catálogo cloud
    setTimeout(() => applyRoleAuthorization(user.role), 500);
  }
});
# 🏗️ ARQUITECTURA DEL SISTEMA

## Visión General

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENTE (Frontend)                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Navegador Web                           │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ HTML (index.html)                                  │  │ │
│  │  │ - Header, Nav, Sections                            │  │ │
│  │  │ - Contenedores para componentes dinámicos          │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ CSS (assets/styles.css)                            │  │ │
│  │  │ - Diseño responsivo (mobile, tablet, desktop)      │  │ │
│  │  │ - Tema claro/oscuro                                │  │ │
│  │  │ - Componentes reutilizables                        │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ JavaScript (src/ + main.js)                        │  │ │
│  │  │                                                    │  │ │
│  │  │ ┌────────────────────────────────────────────────┐ │  │ │
│  │  │ │ CAPA DE PRESENTACIÓN (Views)                 │ │  │ │
│  │  │ │ - CatalogView.js                             │ │  │ │
│  │  │ │ - Renderización de UI                        │ │  │ │
│  │  │ └────────────────────────────────────────────────┘ │  │ │
│  │  │                        ▲                            │  │ │
│  │  │                        │                            │  │ │
│  │  │ ┌────────────────────────────────────────────────┐ │  │ │
│  │  │ │ CAPA DE CONTROL (Controllers)                │ │  │ │
│  │  │ │ - ProductController.js                       │ │  │ │
│  │  │ │ - Lógica de negocio                          │ │  │ │
│  │  │ │ - Filtrado, búsqueda, paginación            │ │  │ │
│  │  │ └────────────────────────────────────────────────┘ │  │ │
│  │  │                        ▲                            │  │ │
│  │  │                        │                            │  │ │
│  │  │ ┌────────────────────────────────────────────────┐ │  │ │
│  │  │ │ CAPA DE DATOS (Models + Factory)              │ │  │ │
│  │  │ │ - Product.js (Modelo)                         │ │  │ │
│  │  │ │ - ProductFactory.js (Patrón Creacional)      │ │  │ │
│  │  │ │ - ShoppingCart.js (Utilidad)                 │ │  │ │
│  │  │ │ - AuditLogger.js (Auditoría)                 │ │  │ │
│  │  │ └────────────────────────────────────────────────┘ │  │ │
│  │  │                        │                            │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Almacenamiento Local                          │ │
│  │  - LocalStorage (Carrito, Configuración, Logs)            │ │
│  │  - SessionStorage (Estado temporal)                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────┬──────────────────────────┘
                                       │ HTTPS
┌──────────────────────────────────────▼──────────────────────────┐
│                     SERVIDOR (Backend)                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Supabase (Cloud Backend as a Service)                    │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ API REST                                             │ │ │
│  │  │ - GET /products                                      │ │ │
│  │  │ - POST /products                                     │ │ │
│  │  │ - PUT /products/:id                                  │ │ │
│  │  │ - DELETE /products/:id                               │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                        ▲                                  │ │
│  │                        │                                  │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ PostgreSQL Database                                  │ │ │
│  │  │ ┌──────────────────────────────────────────────────┐ │ │
│  │  │ │ Tables:                                         │ │ │
│  │  │ │ - products (Catálogo)                           │ │ │
│  │  │ │ - categories (Categorías)                       │ │ │
│  │  │ │ - sizes (Tallas)                                │ │ │
│  │  │ │ - colors (Colores)                              │ │ │
│  │  │ │ - product_inventory (Inventario)                │ │ │
│  │  │ │ - orders (Órdenes)                              │ │ │
│  │  │ │ - order_details (Detalles de orden)             │ │ │
│  │  │ │ - audit_logs (Auditoría ISO 9001)               │ │ │
│  │  │ └──────────────────────────────────────────────────┘ │ │
│  │  │                                                      │ │
│  │  │ ┌──────────────────────────────────────────────────┐ │ │
│  │  │ │ Índices optimizados                             │ │ │
│  │  │ │ - idx_products_category                         │ │ │
│  │  │ │ - idx_products_active                           │ │ │
│  │  │ │ - idx_audit_logs_timestamp                      │ │ │
│  │  │ └──────────────────────────────────────────────────┘ │ │
│  │  │                                                      │ │
│  │  │ ┌──────────────────────────────────────────────────┐ │ │
│  │  │ │ Triggers y Funciones                            │ │ │
│  │  │ │ - log_product_changes() [Auditoría]             │ │ │
│  │  │ │ - RLS (Row Level Security)                      │ │ │
│  │  │ └──────────────────────────────────────────────────┘ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Componentes Principales

### 1. **config.js** - Configuración Global
```javascript
Función: Centralizar toda configuración
Contenido:
  - SUPABASE_URL y ANON_KEY
  - Constantes de la app
  - Mapeo de tablas
  - Estados permitidos
  - Validaciones
```

### 2. **Product.js** - Modelo de Datos
```javascript
Clase: Product
Responsabilidades:
  - Representar un producto
  - Validar datos (ISO 9001)
  - Formatear salida (HTML, JSON)
  - Calcular disponibilidad
  
Métodos:
  - validate()
  - toJSON()
  - toHTML()
  - getFormattedPrice()
  - isAvailable()
```

### 3. **ProductFactory.js** - Patrón Factory (CREACIONAL)
```javascript
Clase: ProductFactory
Patrón: Factory Pattern (Creacional)
Responsabilidades:
  - Crear instancias de Product
  - Centralizar lógica de creación
  - Validar durante creación
  - Convertir datos externos

Métodos:
  - createProduct(data)
  - createProducts(dataArray)
  - createFromForm(form)
  - createAndValidate(data)
  - createMockProducts()
  - createEmptyProduct()

Ventajas:
  ✓ Encapsulación de lógica de creación
  ✓ Fácil de extender (nuevos tipos de productos)
  ✓ Mejor testabilidad
  ✓ Separación de responsabilidades
```

### 4. **ProductController.js** - Lógica de Negocio
```javascript
Clase: ProductController
Responsabilidades:
  - Gestionar lista de productos
  - Aplicar filtros y búsquedas
  - Paginación
  - Operaciones CRUD
  - Estadísticas

Métodos Públicos:
  - fetchProducts()           // Cargar desde Supabase
  - filterByCategory()        // Filtrar por categoría
  - filterByPrice()          // Filtrar por rango de precio
  - searchProducts()         // Buscar término
  - getPaginatedProducts()   // Obtener página
  - getTotalPages()
  - getProductById()
  - createProduct()
  - updateProduct()
  - deleteProduct()
  - getStatistics()
```

### 5. **CatalogView.js** - Capa de Presentación
```javascript
Clase: CatalogView
Responsabilidades:
  - Renderizar HTML
  - Actualizar DOM
  - Mostrar notificaciones
  - Manejar interacción de usuario

Métodos:
  - render(products)
  - renderPagination()
  - renderFilters()
  - renderStatistics()
  - showNotification()
  - clear()
```

### 6. **ShoppingCart.js** - Utilidad
```javascript
Clase: ShoppingCart
Responsabilidades:
  - Gestionar items del carrito
  - Persistencia en LocalStorage
  - Cálculos de total

Métodos:
  - addItem()
  - removeItem()
  - updateQuantity()
  - getTotal()
  - getItemCount()
  - clear()
```

### 7. **AuditLogger.js** - Auditoría (ISO 9001)
```javascript
Clase: AuditLogger
Responsabilidades:
  - Registrar todas las acciones
  - Cumplir ISO 9001 (trazabilidad)
  - Persistencia en LocalStorage
  - Exportar logs

Métodos:
  - log(action, details)
  - logProductView()
  - logAddToCart()
  - logPurchase()
  - logError()
  - exportToCSV()
```

---

## Flujo de Datos: Ejemplo - Búsqueda de Producto

```
USUARIO ESCRIBE EN SEARCH-INPUT
            ↓
     handleSearch() [main.js]
            ↓
   productController.searchProducts(term)
            ↓
   Recibe: this.products (array de Product)
   Retorna: filtered array
            ↓
  productController.filteredProducts = resultado
            ↓
     goToPage(1)
            ↓
  productController.getPaginatedProducts(1)
            ↓
  Retorna: array[0:12] de Product
            ↓
  catalogView.render(products)
            ↓
  products.map(p => p.toHTML()) [Genera HTML]
            ↓
  container.innerHTML = htmlString
            ↓
  catalogView.attachEventListeners()
            ↓
  auditLogger.log('SEARCH_PERFORMED', {...})
            ↓
  PANTALLA ACTUALIZADA
```

---

## Patrones de Diseño Implementados

### 1. **Factory Pattern** (CREACIONAL)
- **Ubicación**: `ProductFactory.js`
- **Propósito**: Crear instancias de Product de manera centralizada
- **Beneficio**: Fácil validación y transformación

### 2. **MVC Pattern** (ARQUITECTÓNICO)
- **Model**: `Product.js`, `ShoppingCart.js`
- **View**: `CatalogView.js`, HTML
- **Controller**: `ProductController.js`, `main.js`

### 3. **Singleton Pattern** (IMPLÍCITO)
- Instancias globales: `productController`, `catalogView`, `shoppingCart`
- Un único punto de entrada a funcionalidades

### 4. **Observer Pattern** (IMPLÍCITO)
- Event listeners en el DOM
- LocalStorage eventos (`storage` event)

---

## Flujo de Inicialización

```
DOMContentLoaded
        ↓
loadTheme() [carga preferencia oscuro/claro]
        ↓
initializeApp()
        ↓
    ├─► loadCategories() → Supabase
    ├─► productController.fetchProducts() → Supabase
    ├─► ProductFactory.createProducts(data)
    ├─► renderCatalog()
    │   ├─► catalogView.renderSearchBar()
    │   ├─► catalogView.renderFilters(categories)
    │   ├─► catalogView.render(products)
    │   ├─► catalogView.renderPagination()
    │   └─► catalogView.renderStatistics(stats)
    ├─► renderCartBadge()
    └─► auditLogger.log('APP_INITIALIZED')
        ↓
APP LISTA PARA USAR
```

---

## Seguridad y Validación

### Niveles de Validación

```
┌──────────────────────────────────────────────┐
│ USUARIO INGRESA DATOS (Formulario)           │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│ VALIDACIÓN CLIENTE (JavaScript)              │
│ - Tipos de dato                              │
│ - Rangos mínimo/máximo                       │
│ - Campos requeridos                          │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│ Product.validate() en Model                  │
│ - Lógica de negocio                          │
│ - Reglas específicas                         │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│ ProductFactory.createAndValidate()           │
│ - Creación + Validación                      │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│ VALIDACIÓN SERVIDOR (Supabase)               │
│ - CHECK constraints en SQL                   │
│ - Tipos de dato en BD                        │
│ - Triggers y funciones                       │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────▼───────────────────────────┐
│ AUDITORÍA (audit_logs)                       │
│ - Registro de cambios (ISO 9001)             │
│ - Trazabilidad completa                      │
└──────────────────────────────────────────────┘
```

---

## Rendimiento

### Optimizaciones Implementadas

1. **Paginación**
   - Máximo 12 productos por página
   - Reduce DOM elements y memory

2. **Búsqueda en Memoria**
   - Filtrado en JavaScript (rápido)
   - Menos llamadas a API

3. **Lazy Loading**
   - Imágenes con `onerror` fallback
   - Placeholder mientras carga

4. **Índices en BD**
   ```sql
   - idx_products_category
   - idx_products_active
   - idx_audit_logs_timestamp
   ```

5. **LocalStorage**
   - Carrito sin sincronización BD
   - Logs en cliente primero

---

## Escalabilidad

### Para Crecer el Sistema

1. **Más Productos**
   - Implementar API pagination en Supabase
   - Caché en cliente

2. **Múltiples Usuarios**
   - Agregar autenticación Supabase Auth
   - Roles y permisos

3. **Mobile App**
   - Reutilizar lógica (Controllers, Models)
   - Framework: React Native, Flutter

4. **Backend Independiente**
   - Migrar de Supabase a servidor propio
   - API con Node.js/Express

---

## Diagrama de Despliegue

```
┌─────────────────────────────────────────────┐
│         CDN / SERVIDOR WEB                  │
│  ┌───────────────────────────────────────┐  │
│  │ index.html                            │  │
│  │ assets/styles.css                     │  │
│  │ src/*.js                              │  │
│  │ Supabase.js (CDN)                     │  │
│  └───────────────────────────────────────┘  │
└────────────┬────────────────────────────────┘
             │ HTTPS
┌────────────▼────────────────────────────────┐
│      SUPABASE (Cloud Backend)               │
│  ┌───────────────────────────────────────┐  │
│  │ REST API                              │  │
│  │ PostgreSQL Database                   │  │
│  │ Auth (Futuro)                         │  │
│  │ Storage (Futuro)                      │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

**Arquitectura Finalizada: ✅**  
Patrón Factory implementado correctamente  
Cumplimiento ISO 9001 verificado  
Responsivo en Desktop y Mobile  

# 📋 DOCUMENTACIÓN - Sistema de Gestión de Catálogo de Ropa

## 🎯 Resumen Ejecutivo

Este proyecto es un **Sistema de Gestión de Catálogo de Ropa** multiplataforma desarrollado como aplicación web moderna con las siguientes características:

- ✅ **Funcional en Desktop y Responsive (Mobile)**
- ✅ **Patrón de Diseño: Factory (Creacional)**
- ✅ **Cumple ISO 9001:2015 (Gestión de Calidad)**
- ✅ **Integración con Supabase**
- ✅ **Interfaz Moderna y Responsiva**
- ✅ **Registro de Auditoría Completo**

---

## 📁 Estructura del Proyecto

```
actividad7/
├── index.html                  # Archivo principal HTML
├── supabase-setup.sql         # Script SQL para Supabase
├── assets/
│   └── styles.css             # Estilos principales
├── src/
│   ├── config.js              # Configuración global
│   ├── main.js                # Script principal (orquestación)
│   ├── models/
│   │   └── Product.js         # Modelo de Producto
│   ├── factory/
│   │   └── ProductFactory.js  # Patrón Factory para crear productos
│   ├── controllers/
│   │   └── ProductController.js  # Controlador de lógica de negocio
│   ├── views/
│   │   └── CatalogView.js     # Vista del catálogo
│   └── utils/
│       ├── ShoppingCart.js    # Carrito de compras
│       └── AuditLogger.js     # Logger de auditoría (ISO 9001)
└── docs/
    ├── ARQUITECTURA.md        # Diagrama y descripción de arquitectura
    ├── UI_UX_DESIGN.md        # Diseño de interfaces
    ├── PRUEBAS.md             # Plan de pruebas
    ├── INSTALACION.md         # Guía de instalación
    └── ISO_9001_COMPLIANCE.md # Cumplimiento de norma ISO 9001
```

---

## 🏗️ Arquitectura del Sistema

### Patrón MVC + Factory Pattern

```
┌─────────────────────────────────────────────────┐
│              VISTA (View Layer)                  │
│  - CatalogView.js (Renderización HTML)          │
│  - Componentes UI                               │
└────────────────────────┬────────────────────────┘
                         │
┌────────────────────────▼────────────────────────┐
│          CONTROLADOR (Controller Layer)          │
│  - ProductController.js                         │
│  - Lógica de filtrado, paginación               │
│  - Gestión de estado                            │
└────────────────────────┬────────────────────────┘
                         │
┌────────────────────────▼────────────────────────┐
│        FACTORY + MODELO (Business Logic)        │
│  - ProductFactory.js (Patrón Creacional)        │
│  - Product.js (Modelo de datos)                 │
│  - Validaciones                                 │
└────────────────────────┬────────────────────────┘
                         │
┌────────────────────────▼────────────────────────┐
│          CAPA DE DATOS (Data Layer)             │
│  - Supabase (PostgreSQL)                        │
│  - API REST                                     │
│  - LocalStorage (Carrito, Auditoría)            │
└─────────────────────────────────────────────────┘
```

### Factory Pattern

El patrón Factory se implementa en `ProductFactory.js`:

```javascript
// Creación centralizada de instancias de Product
ProductFactory.createProduct(data)              // Crear un producto
ProductFactory.createProducts(dataArray)        // Crear múltiples
ProductFactory.createFromForm(form)             // Desde formulario
ProductFactory.createAndValidate(data)          // Con validación
ProductFactory.createMockProducts()             // Datos de prueba
```

**Ventajas:**
- Centraliza la lógica de creación
- Facilita validación y transformación de datos
- Permite crear variantes del producto fácilmente
- Mejora mantenibilidad y testabilidad

---

## 💾 Base de Datos (Supabase)

### Tablas Principales

#### 1. **products** (Catálogo)
```sql
- id (PK)
- code (UNIQUE)
- name
- description
- category_id (FK)
- price
- stock
- image_url
- is_active (soft delete)
- quality_status (approved, pending, rejected) [ISO 9001]
- created_at
- updated_at
- created_by [Auditoría]
```

#### 2. **categories** (Categorías)
```sql
- id (PK)
- name
- description
```

#### 3. **product_inventory** (Inventario por Talla/Color)
```sql
- product_id (FK)
- size_id (FK)
- color_id (FK)
- quantity
```

#### 4. **orders** (Órdenes)
```sql
- id (PK)
- order_number
- customer_name
- total_amount
- status (pending, confirmed, shipped, delivered)
- created_at
```

#### 5. **audit_logs** (ISO 9001 - Trazabilidad)
```sql
- id (PK)
- action (INSERT, UPDATE, DELETE)
- table_name
- record_id
- old_data (JSONB)
- new_data (JSONB)
- user_id
- timestamp
```

### Triggers y Funciones

- **log_product_changes()**: Registra todos los cambios en productos
- **Índices optimizados**: Para búsquedas rápidas
- **RLS (Row Level Security)**: Protección de datos

---

## 🎨 Interfaz de Usuario (UI/UX)

### Principios de Diseño

1. **Claridad**: Interfaz limpia y organizada
2. **Accesibilidad**: Colores contrastantes, textos legibles
3. **Responsividad**: Funciona en desktop, tablet y mobile
4. **Feedback**: Notificaciones visuales de acciones
5. **Eficiencia**: Navegación intuitiva

### Componentes Principales

| Componente | Descripción |
|-----------|------------|
| **Header** | Branding + Navegación principal |
| **Search Bar** | Búsqueda en tiempo real |
| **Filter Panel** | Filtros por categoría y precio |
| **Product Grid** | Display en grid responsivo |
| **Product Card** | Información detallada del producto |
| **Shopping Cart** | Vista de carrito con resumen |
| **Admin Panel** | Gestión de productos y auditoría |
| **Notifications** | Toast notifications de acciones |

### Paleta de Colores

```css
Primary: #6366f1 (Indigo)
Secondary: #ec4899 (Pink)
Success: #10b981 (Green)
Danger: #ef4444 (Red)
Warning: #f59e0b (Amber)
Info: #3b82f6 (Blue)
```

### Breakpoints Responsivos

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

---

## 🏛️ Cumplimiento ISO 9001:2015

### Áreas Implementadas

#### 1. **Gestión de Procesos**
- Documentación de flujos (Catálogo → Carrito → Compra)
- Procedimientos estandarizados

#### 2. **Control de Calidad**
- Estado de calidad por producto (approved/pending/rejected)
- Validación de datos en todos los niveles
- Pruebas de entrada

#### 3. **Trazabilidad Completa**
- Tabla `audit_logs` registra todas las acciones
- Timestamp y usuario de cada operación
- Histórico de cambios en productos

#### 4. **Documentación**
- Manuales de usuario
- Especificaciones técnicas
- Registro de cambios

#### 5. **Mejora Continua**
- Métricas disponibles en dashboard
- Estadísticas de uso
- Identificación de productos problemáticos

### Campos de Auditoría (Trazabilidad)

```javascript
{
  action: 'INSERT' | 'UPDATE' | 'DELETE',
  table_name: 'products',
  record_id: 123,
  old_data: {...},           // Estado anterior
  new_data: {...},           // Estado nuevo
  user_id: 'admin',
  timestamp: '2026-05-30T10:30:00Z'
}
```

---

## 🔐 Seguridad

### Medidas Implementadas

1. **Validación de Entrada**
   - Validación en modelo `Product.js`
   - Rangos mínimo/máximo de valores
   - Limpieza de datos

2. **Row Level Security (RLS)**
   - Solo productos activos visibles al público
   - Datos sensibles protegidos

3. **Control de Acceso**
   - Rol admin para gestión
   - Separación de funciones

4. **Inyección SQL**
   - Uso de parámetros en queries (Supabase)
   - No concatenación de strings

---

## 🧪 Pruebas

### Estrategia de Testing

#### Pruebas Unitarias
- Modelo `Product`: Validación, formateo
- `ProductFactory`: Creación de instancias
- `ShoppingCart`: Agregar, eliminar items

#### Pruebas de Integración
- `ProductController` + Supabase
- Flujo: Buscar → Filtrar → Agregar al carrito

#### Pruebas de UI
- Responsive en diferentes tamaños
- Interactividad de componentes
- Notificaciones

#### Pruebas de Carga
- Performance con 1000+ productos
- Paginación eficiente

### Casos de Prueba Críticos

```
✅ [CT-001] Cargar catálogo de productos
✅ [CT-002] Filtrar por categoría
✅ [CT-003] Buscar producto por nombre
✅ [CT-004] Agregar producto al carrito
✅ [CT-005] Actualizar cantidad en carrito
✅ [CT-006] Crear nuevo producto (Admin)
✅ [CT-007] Aprobar producto (Control de Calidad)
✅ [CT-008] Verificar auditoría
✅ [CT-009] Responsividad en mobile
✅ [CT-010] Tema oscuro/claro
```

Ver: `docs/PRUEBAS.md`

---

## 🚀 Instalación y Configuración

### Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet
- Cuenta Supabase (gratuita en supabase.com)

### Pasos de Instalación

1. **Clonar/Descargar proyecto**
   ```bash
   # Desde terminal en el directorio del proyecto
   cd /home/creeper/Escritorio/actividad7
   ```

2. **Configurar Supabase**
   - Crear proyecto en https://supabase.com
   - Ejecutar script SQL: `supabase-setup.sql`
   - Copiar URL y API Key

3. **Actualizar credenciales**
   - Editar `src/config.js`
   - Reemplazar `SUPABASE_URL` y `SUPABASE_ANON_KEY`

4. **Abrir en navegador**
   ```bash
   # Opción 1: Abrir index.html directamente
   firefox index.html
   
   # Opción 2: Servir con Live Server (VS Code)
   # Extensión: Live Server
   ```

Ver: `docs/INSTALACION.md`

---

## 📊 Diagrama de Entidad-Relación

```
┌──────────────────┐
│   categories     │
├──────────────────┤
│ id (PK)          │
│ name             │
└────────┬─────────┘
         │ 1:N
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│    products      │◄───────►│    orders        │
├──────────────────┤ 1:N     ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ code             │         │ order_number     │
│ name             │         │ customer_name    │
│ price            │         │ total_amount     │
│ category_id (FK) │         │ status           │
│ quality_status   │         └────────┬─────────┘
└────────┬─────────┘                  │
         │ 1:N                        │ 1:N
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│product_inventory │         │ order_details    │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ product_id (FK)  │         │ order_id (FK)    │
│ size_id (FK)     │         │ product_id (FK)  │
│ color_id (FK)    │         │ quantity         │
│ quantity         │         │ unit_price       │
└──────────────────┘         └──────────────────┘
         ▲
         │
┌────────┴──────────┐
│  ┌─────────────┐  │
│  │   sizes     │  │
│  ├─────────────┤  │
│  │ id (PK)     │  │
│  │ size_code   │  │
│  └─────────────┘  │
│  ┌─────────────┐  │
│  │   colors    │  │
│  ├─────────────┤  │
│  │ id (PK)     │  │
│  │ color_name  │  │
│  └─────────────┘  │
└────────────────────┘

┌──────────────────┐  [Auditoría - ISO 9001]
│  audit_logs      │
├──────────────────┤
│ id (PK)          │
│ action           │
│ table_name       │
│ old_data (JSONB) │
│ new_data (JSONB) │
│ timestamp        │
└──────────────────┘
```

---

## 📈 Flujo de Datos

### Flujo de Carga de Productos

```
1. Página carga → DOMContentLoaded
2. initializeApp() se ejecuta
3. loadCategories() → Supabase (categorías)
4. productController.fetchProducts() → Supabase (productos)
5. ProductFactory.createProducts() → Instancias de Product
6. renderCatalog() → Muestra productos en grid
7. auditLogger.log() → Registra carga de app
```

### Flujo de Búsqueda

```
Usuario escribe en search-input
         ↓
handleSearch() se ejecuta
         ↓
productController.searchProducts(term)
         ↓
Filtra en memoria (array de productos)
         ↓
goToPage(1) → renderiza resultados
         ↓
auditLogger.log() → Registra búsqueda
```

### Flujo de Compra

```
Usuario hace clic "Agregar al carrito"
         ↓
addToCart(productId)
         ↓
shoppingCart.addItem() → LocalStorage
         ↓
renderCartBadge() → Actualiza contador
         ↓
showNotification() → Feedback visual
         ↓
auditLogger.logAddToCart()
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| HTML5 | 5 | Estructura |
| CSS3 | 3 | Estilos + Responsive |
| JavaScript | ES6+ | Lógica + Interactividad |
| Supabase | 2.x | Backend + Base de datos |
| PostgreSQL | 13+ | Motor de BD |

### Librerías Externas

- **Supabase.js**: Cliente para API Supabase
- **Supabase CDN**: Hosted library

---

## 📝 Convenciones de Código

### Nomenclatura

```javascript
// Clases: PascalCase
class ProductController {}

// Funciones/Métodos: camelCase
function handleSearch() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_PRODUCTS_PER_PAGE = 12;

// Elementos DOM: descriptivo
const productsContainer = document.getElementById('products-container');

// IDs CSS: kebab-case
<div id="products-container">
```

### Estructura de Funciones

```javascript
/**
 * Descripción clara de qué hace
 * @param {Tipo} paramName - Descripción del parámetro
 * @returns {Tipo} Descripción del retorno
 */
function myFunction(paramName) {
  // Implementación
}
```

---

## 🐛 Resolución de Problemas

### Error: "Supabase no está configurado"
**Solución**: Verificar `src/config.js` - actualizar URL y API Key

### Error: "No se cargan los productos"
**Solución**: 
1. Verificar conexión a Internet
2. Ejecutar `supabase-setup.sql` en Supabase
3. Ver consola (F12) para errores

### El carrito se vacía al recargar
**Solución**: Es normal si no está guardado en BD. LocalStorage es temporal.

### Estilos no aplican
**Solución**: Verificar ruta de `assets/styles.css` en `index.html`

---

## 📞 Contacto y Soporte

- **Documentación Completa**: Ver carpeta `docs/`
- **Código Fuente**: Comentado y autodocumentado
- **Issues**: Reportar en la consola del navegador (F12)

---

## 📄 Licencia

Proyecto educativo - Libre para uso y distribución.

---

**Versión**: 1.0.0  
**Fecha**: 30 de mayo de 2026  
**Autor**: Desarrollo Web  
**Norma ISO**: 9001:2015  
**Patrón de Diseño**: Factory (Creacional) + MVC  

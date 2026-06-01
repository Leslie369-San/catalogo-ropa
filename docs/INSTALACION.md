# 📦 GUÍA DE INSTALACIÓN Y CONFIGURACIÓN

## Requisitos Previos

### Hardware Mínimo
- Procesador: 1 GHz
- RAM: 512 MB
- Espacio en disco: 100 MB
- Conexión a Internet: Requerida

### Software Requerido
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Editor de texto (VS Code, Sublime, Notepad++)
- Cuenta Supabase (gratuita): https://supabase.com

### Navegadores Soportados
| Navegador | Versión Mínima |
|-----------|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

---

## Paso 1: Descargar/Clonar el Proyecto

### Opción A: Descargar ZIP
```bash
# 1. Descargar desde repositorio
# 2. Extraer en ubicación deseada
cd /home/creeper/Escritorio/actividad7
```

### Opción B: Clonar (si está en Git)
```bash
git clone <repository-url>
cd actividad7
```

---

## Paso 2: Configurar Supabase

### 2.1 Crear Proyecto en Supabase

1. **Ir a**: https://supabase.com
2. **Registrarse/Ingresar** con Google o Email
3. **Click**: "New Project"
4. **Rellenar**:
   - Organization: Tu organización
   - Project name: `catalogo-ropa`
   - Database password: `GenerarPasswordSegura123!`
   - Region: `South America (São Paulo)`
5. **Click**: "Create new project"
6. **Esperar**: 2-3 minutos mientras se crea

### 2.2 Obtener Credenciales

1. **En Supabase Dashboard**:
   - Click en "Settings" (ícono engranaje)
   - Click en "API" (menú izquierdo)

2. **Copiar**:
   ```
   Project URL:    https://YOUR_PROJECT.supabase.co
   anon public:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Guardar temporalmente** en un archivo de texto

### 2.3 Ejecutar Script SQL

1. **En Supabase Dashboard**:
   - Click en "SQL Editor" (menú izquierdo)
   - Click en "New Query"

2. **Copiar contenido** de `supabase-setup.sql`:
   ```bash
   cat supabase-setup.sql
   ```

3. **Pegar en editor** de Supabase

4. **Click**: "Run" (botón azul)

5. **Esperar**: Ejecución completada (~5 segundos)

6. **Verificar**: En tabla "Database" → Tables aparecen todas las tablas

#### Tablas Creadas:
- ✅ categories
- ✅ sizes
- ✅ colors
- ✅ products
- ✅ product_inventory
- ✅ orders
- ✅ order_details
- ✅ audit_logs

---

## Paso 3: Configurar Aplicación

### 3.1 Editar config.js

1. **Abrir archivo**:
   ```bash
   nano src/config.js
   # o en VS Code:
   code src/config.js
   ```

2. **Reemplazar líneas 9-10**:
   ```javascript
   // ANTES:
   const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
   const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

   // DESPUÉS (tus valores):
   const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

3. **Guardar** (Ctrl+S)

### 3.2 Verificar Estructura de Carpetas

```bash
# Ejecutar en terminal:
tree -I 'node_modules'
```

Debería mostrar:
```
actividad7/
├── index.html
├── supabase-setup.sql
├── assets/
│   └── styles.css
├── src/
│   ├── config.js           ✅ Configurado
│   ├── main.js
│   ├── models/
│   │   └── Product.js
│   ├── factory/
│   │   └── ProductFactory.js
│   ├── controllers/
│   │   └── ProductController.js
│   ├── views/
│   │   └── CatalogView.js
│   └── utils/
│       ├── ShoppingCart.js
│       └── AuditLogger.js
└── docs/
    ├── README.md
    ├── ARQUITECTURA.md
    ├── UI_UX_DESIGN.md
    ├── PRUEBAS.md
    ├── INSTALACION.md
    └── ISO_9001_COMPLIANCE.md
```

---

## Paso 4: Ejecutar la Aplicación

### Opción A: Abrir Directamente (Local File)

```bash
# En Windows:
start index.html

# En macOS:
open index.html

# En Linux:
firefox index.html
```

**Nota**: Puede haber CORS warnings (normal para file://)

### Opción B: Usar Live Server (Recomendado)

#### VS Code + Live Server Extension

1. **Instalar extensión**:
   - Abrir VS Code
   - Extensions (Ctrl+Shift+X)
   - Buscar: "Live Server"
   - Instalar (Ritchie Wild)

2. **Ejecutar**:
   - Click derecho en `index.html`
   - "Open with Live Server"
   - Se abre en navegador automáticamente

#### Python SimpleHTTPServer (Alternativa)

```bash
cd /home/creeper/Escritorio/actividad7

# Python 3
python3 -m http.server 8000

# Python 2 (antiguo)
python -m SimpleHTTPServer 8000
```

Luego abrir: http://localhost:8000

#### Node.js http-server

```bash
# Instalar globalmente (una vez):
npm install -g http-server

# Ejecutar:
cd /home/creeper/Escritorio/actividad7
http-server

# Abrir: http://localhost:8080
```

---

## Paso 5: Verificar Instalación

### 5.1 Checklist de Validación

- [ ] Página carga sin errores (F12 → Console)
- [ ] Logo y header visibles
- [ ] Barra de búsqueda funciona
- [ ] Productos cargan (4+ tarjetas)
- [ ] Filtros responden
- [ ] Carrito badge actualiza
- [ ] Tema oscuro/claro funciona
- [ ] Notificaciones aparecen
- [ ] Admin panel accesible
- [ ] Console sin errores rojos

### 5.2 Prueba de Conexión Supabase

En consola del navegador (F12 → Console):

```javascript
// Verificar Supabase cargado
console.log(supabaseClient);
// Debe retornar: SupabaseClient {...}

// Verificar configuración
console.log(CONFIG);
// Debe retornar: {APP_NAME: "...", VERSION: "1.0.0", ...}

// Intentar cargar productos
productController.fetchProducts().then(r => console.log(r));
// Debe retornar: {success: true, data: [...]}
```

### 5.3 Test Rápido

1. **Escribir en búsqueda**: "camiseta"
2. **Debe filtrar** productos automáticamente
3. **Hacer click** en "Agregar al carrito"
4. **Carrito badge** debe mostrar "1"
5. **Ir a Carrito** → debe mostrar el item

---

## Paso 6: Datos de Prueba

### 6.1 Con Mock Data (Fallback)

Si no carga de Supabase, automáticamente usa datos de prueba:

```javascript
ProductFactory.createMockProducts()
// Retorna: Array de 4 productos de ejemplo
```

### 6.2 Agregar Productos Manualmente

1. **Ir a**: Admin (⚙️)
2. **Tab**: Productos
3. **Rellenar formulario**:
   - Código: `PROD-002`
   - Nombre: `Jeans Premium`
   - Categoría: Pantalones
   - Precio: `59.99`
   - Stock: `30`
4. **Click**: "Guardar Producto"
5. **Verificar**: Aparece en lista y catálogo

---

## Solución de Problemas

### Error: "Supabase no está configurado"

**Solución:**
```javascript
// En src/config.js, verificar:
console.log(SUPABASE_URL);        // Debe tener URL
console.log(SUPABASE_ANON_KEY);   // Debe tener key
```

Si están vacíos, copiar credenciales nuevamente.

---

### Error: "Cannot POST /products" o 401 Unauthorized

**Solución:**
1. Verificar URL de Supabase correcta
2. Verificar API Key correcta
3. En Supabase → SQL Editor ejecutar:
   ```sql
   SELECT * FROM products LIMIT 1;
   ```
   Si retorna datos, BD está OK

---

### Productos no cargan

**Verificar**:
1. Red tab en F12 → debería ver GET requests a Supabase
2. Console → debería mostrar logs de carga
3. Supabase → verificar tabla `products` no vacía
4. Si nada carga, usar mock data (F12 → ejecutar):
   ```javascript
   productController.products = ProductFactory.createMockProducts();
   catalogView.render(productController.products);
   ```

---

### Carrito se vacía al recargar

**Esto es normal** - LocalStorage es temporal. Para persistencia en BD:

1. **En futuro**: Implementar autenticación + user table
2. **Actualmente**: Datos guardados en sesión

---

### Estilos no cargan

**Solución**:
1. Verificar ruta en `index.html` línea 10:
   ```html
   <link rel="stylesheet" href="./assets/styles.css">
   ```
2. Verificar archivo existe:
   ```bash
   ls -la assets/styles.css
   ```
3. En Live Server, debe funcionar automáticamente

---

### Admin no funciona

**Verificar**:
1. Categorías cargadas (debería ver dropdown)
2. Formulario valida antes de enviar
3. Console para ver errores específicos
4. Supabase → verificar tabla `categories` tiene datos

---

## Configuración Avanzada

### Usar Base de Datos Diferente

```javascript
// En src/config.js:

// Cambiar de Supabase a otra BD (futuro):
const USE_SUPABASE = false;
const API_ENDPOINT = 'https://tu-servidor.com/api';
```

---

### Configurar Https Personalizado

```bash
# Generar certificado auto-firmado (desarrollo):
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# Servir con https:
python3 -m http.server --crl 443 --certificate cert.pem --key key.pem
```

---

### Environment Variables

Crear archivo `.env.local`:
```
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

Luego en `src/config.js`:
```javascript
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
```

---

## Despliegue a Producción

### Opción 1: GitHub Pages

```bash
# 1. Crear repo en GitHub
# 2. Empujar código:
git add .
git commit -m "Initial commit"
git push origin main

# 3. En repo settings → Pages → Source: main branch
# 4. Sitio disponible en: https://usuario.github.io/repositorio
```

### Opción 2: Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI:
npm i -g vercel

# 2. Deploy:
vercel

# 3. Seguir prompts
# 4. Sitio en: https://proyecto.vercel.app
```

### Opción 3: Netlify

```bash
# 1. Conectar GitHub a Netlify
# 2. Auto-deploy en cada push
# 3. Sitio en: https://proyecto.netlify.app
```

### Opción 4: Servidor Propio

```bash
# 1. Subir archivos a servidor web (nginx, apache)
# 2. Configurar HTTPS
# 3. Configurar CORS en Supabase
```

---

## Mantenimiento Post-Instalación

### Actualizaciones

```bash
# Verificar versión actual:
grep VERSION src/config.js

# Actualizar a nueva versión:
git pull origin main

# Limpiar cache:
# Navegador: Ctrl+Shift+Del → Clear browsing data
```

### Backups

```bash
# Backup de BD Supabase:
# 1. Dashboard → Settings → Backups
# 2. Click "Download"

# Backup local de proyecto:
tar -czf actividad7-backup-$(date +%Y%m%d).tar.gz actividad7/
```

### Logs y Monitoreo

```javascript
// Ver logs en navegador:
F12 → Console → auditLogger.getLogs()

// Descargar logs:
F12 → Console → auditLogger.exportToCSV()

// Ver en Supabase:
SQL Editor → SELECT * FROM audit_logs LIMIT 100;
```

---

## Checklist Final

- ✅ Supabase creado y configurado
- ✅ Script SQL ejecutado
- ✅ config.js actualizado
- ✅ App abre sin errores
- ✅ Productos cargan
- ✅ Búsqueda funciona
- ✅ Carrito persiste
- ✅ Admin accesible
- ✅ Auditoría registra cambios
- ✅ Responsivo en mobile
- ✅ Documentación leída
- ✅ Test de carga completado

---

## Soporte y Recursos

| Recurso | URL |
|---------|-----|
| Documentación Proyecto | Ver `docs/README.md` |
| Supabase Docs | https://supabase.com/docs |
| SQL Tutorial | https://www.postgresql.org/docs/ |
| JavaScript MDN | https://developer.mozilla.org/en-US/docs/Web/ |
| VS Code Help | https://code.visualstudio.com/docs |

---

**Instalación Completada: ✅**  
Versión: 1.0  
Fecha: 30 de mayo de 2026  

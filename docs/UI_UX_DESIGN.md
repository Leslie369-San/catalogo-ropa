# 🎨 DISEÑO DE INTERFAZ (UI/UX)

## Principios de Diseño

### 1. **Claridad**
- Jerarquía visual clara
- Textos legibles
- Espacios en blanco adecuados
- Organización lógica de información

### 2. **Accesibilidad**
- Contraste de colores (WCAG AA)
- Textos altamente legibles
- Botones grandes y clickeables
- Soporte para lectores de pantalla

### 3. **Responsividad**
- Mobile First
- Breakpoints: 480px, 768px, 1024px
- Touch-friendly (44x44px mínimo)
- Fluid layouts

### 4. **Feedback del Usuario**
- Transiciones suaves (0.3s)
- Hover states claros
- Notificaciones de acciones
- Indicadores de carga

### 5. **Consistencia**
- Paleta de colores fija
- Tipografía uniforme
- Componentes reutilizables
- Spacing system (4px base)

---

## Paleta de Colores

```css
PRIMARY:    #6366f1 (Indigo 500)        - CTAs, highlights
SECONDARY: #ec4899 (Pink 500)          - Accents, brand
SUCCESS:   #10b981 (Green 500)         - Confirmación, precios
DANGER:    #ef4444 (Red 500)           - Errores, eliminar
WARNING:   #f59e0b (Amber 500)         - Atención, stock bajo
INFO:      #3b82f6 (Blue 500)          - Información

NEUTRAL:
  Dark:    #1f2937 (Gray 800)          - Fondo oscuro
  Light:   #f9fafb (Gray 50)           - Fondo claro
  Border:  #e5e7eb (Gray 200)          - Líneas
  Text:    #111827 (Gray 900)          - Texto principal
  Muted:   #9ca3af (Gray 400)          - Texto secundario
```

### Modo Oscuro
```css
Invierte automáticamente:
- Dark-bg ↔ Light-bg
- Text colors adecuados
- Border colors más claros
```

---

## Tipografía

```css
Font-Family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif
Line-Height: 1.6

TAMAÑOS:
  h1: 2.5rem    (40px)   - Títulos principales
  h2: 2rem      (32px)   - Subtítulos sección
  h3: 1.5rem    (24px)   - Subtítulos subsección
  h4: 1.25rem   (20px)   - Subencabezados
  body: 1rem    (16px)   - Texto normal
  small: 0.85rem (14px)  - Texto pequeño
  tiny: 0.75rem (12px)   - Etiquetas, badges

PESOS:
  Regular: 400
  Medium: 500
  SemiBold: 600
  Bold: 700
```

---

## Componentes UI

### 1. **Header**

```
┌────────────────────────────────────────┐
│  👗 Catálogo de Ropa                  │
│  Sistema de Gestión de Inventario     │
├────────────────────────────────────────┤
│  📦 Catálogo  🛒 Carrito (5)  ⚙️ Admin  │
└────────────────────────────────────────┘
```

**Especificaciones:**
- Altura: 120-150px
- Background: Gradient (Primary → Secondary)
- Color: Blanco
- Position: Sticky (opcional)
- Logo/Título: 2.5rem, Bold

**Comportamiento:**
- Logo clickeable (home)
- Carrito con badge de contador
- Nav items highlight en hover
- Responsive: Hamburger en mobile

---

### 2. **Search Bar**

```
┌─────────────────────────────────────┐
│  🔍 Buscar productos...    [Buscar]  │
└─────────────────────────────────────┘
```

**Especificaciones:**
- Altura: 44px
- Border: 2px solid border-color
- Border-radius: 8px
- Focus state: border-color → primary
- Placeholder: Gray 400

**Comportamiento:**
- Search en tiempo real (onkeyup)
- Clear on escape
- Enter para buscar
- Sugerencias (futuro)

---

### 3. **Filter Panel**

```
┌─────────────────────────┐
│  FILTROS               │
├─────────────────────────┤
│ Categoría              │
│ ┌────────────────────┐ │
│ │ Todas ▼            │ │
│ └────────────────────┘ │
│                        │
│ Rango de Precio       │
│ ├────●────────────┤   │
│ $0    -    $500  │
│                        │
│ [Limpiar Filtros]     │
└─────────────────────────┘
```

**Especificaciones:**
- Ancho: 250px (desktop)
- Position: Sticky (top: 20px)
- Background: White
- Box-shadow: 2px 4px 6px rgba(0,0,0,0.1)
- Padding: 24px

**Breakpoints:**
- Desktop (>768px): Sidebar izquierdo
- Mobile (<768px): Colapsable arriba

---

### 4. **Product Card**

```
┌───────────────────────┐
│                       │
│  [Imagen Producto]    │
│                       │
├───────────────────────┤
│ Código: CAMI-001      │
│ CAMISETAS             │
│                       │
│ Camiseta Básica Negra │
│ Camiseta de algodón   │
│ 100% perfecto para... │
├───────────────────────┤
│  $19.99   50 en stock │
│ [APPROVED]            │
├───────────────────────┤
│ [Agregar al carrito]  │
└───────────────────────┘
```

**Especificaciones:**
- Ancho: Fluido (280px min)
- Height: Auto
- Background: White
- Border-radius: 8px
- Box-shadow: 2px 4px 6px (hover: 10px 15px 20px)
- Transition: 0.3s

**Secciones:**
1. Imagen: 250px height, object-fit: cover
2. Info: 1.5rem padding
3. Descripción: Gray 500, pequeña
4. Footer: Flexbox space-between
5. Badge: Status de calidad
6. Botón: Full width, primary color

**Estados:**
- Normal: opacity 1
- Hover: translateY(-8px), shadow aumenta
- Unavailable: opacity 0.7
- Loading: skeleton loader (futuro)

---

### 5. **Product Grid**

```
┌─────┬─────┬─────┬─────┐
│Card │Card │Card │Card │
├─────┼─────┼─────┼─────┤
│Card │Card │Card │Card │
├─────┼─────┼─────┼─────┤
│Card │Card │Card │Card │
└─────┴─────┴─────┴─────┘
```

**CSS Grid:**
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 2rem;
```

**Breakpoints:**
- Desktop (>1024px): 4-5 columnas
- Tablet (768-1024px): 2-3 columnas
- Mobile (<768px): 1 columna

---

### 6. **Pagination**

```
┌────────────────────────────────┐
│ ← [1] [2] [3] ... [10] [11] → │
└────────────────────────────────┘
```

**Especificaciones:**
- Botones: 36x36px, border-radius 4px
- Gap: 0.5rem
- Active: background primary, white text
- Disabled: opacity 0.5

**Comportamiento:**
- Máximo 7 números visible
- Saltos a primera/última página
- "..." para gaps grandes

---

### 7. **Shopping Cart**

```
┌──────────────────────────────────┐
│ Carrito de Compras               │
├──────────────────────────────────┤
│ Producto │Cant│Precio│Sub│Acción│
├──────────────────────────────────┤
│ Camiseta │ [2]│$19.99│$39│  🗑️  │
│ Jeans    │ [1]│$59.99│$59│  🗑️  │
├──────────────────────────────────┤
│                                  │
│        Total: $98.99             │
│ [Proceder al Pago] [Continuar]   │
└──────────────────────────────────┘
```

**Table Specifications:**
- Width: 100%
- Border-collapse: collapse
- Header background: Primary
- Row hover: rgba(primary, 0.05)
- Responsive: Horizontal scroll en mobile

---

### 8. **Notifications**

```
✅ Producto agregado al carrito
❌ Error al crear producto
ℹ️ Información importante
⚠️ Producto pendiente de aprobación
```

**Toast Notification:**
```
Position: top-right
Animation: slideIn 0.3s
Duration: 3000ms then slideOut
z-index: 1000
Width: max 400px
```

**Colores:**
- Success: Green 500
- Error: Red 500
- Info: Blue 500
- Warning: Amber 500

---

### 9. **Admin Tabs**

```
┌──────────┬──────────┬──────────┐
│Dashboard │Productos │Auditoría │
├──────────┴──────────┴──────────┤
│ Contenido del tab activo       │
│                                │
│                                │
└────────────────────────────────┘
```

**Tab Styling:**
- Borde inferior 3px transparent
- Active: color primary, border-bottom primary
- Hover: color primary
- Padding: 1rem 1.5rem

---

### 10. **Statistics Cards**

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│Total         │ │Disponibles   │ │Agotados      │
│Productos     │ │             │ │              │
│     156      │ │     142     │ │      14      │
└──────────────┘ └──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐
│Precio        │ │Stock Total   │
│Promedio      │ │              │
│   $45.32     │ │     2,458    │
└──────────────┘ └──────────────┘
```

**Card Specifications:**
- Padding: 24px
- Border-left: 4px solid primary
- Box-shadow: 2px 4px 6px
- Grid: auto-fit, minmax(200px, 1fr)
- Gap: 1rem

---

## Flujo de Pantallas

### Pantalla 1: Catálogo (Home)

```
┌─────────────────────────────────────┐
│ HEADER                              │
├─────────────────────────────────────┤
│ [Search Bar]                        │
├─────────────────────────────────────┤
│ [Stats Grid]                        │
├────────────┬───────────────────────┤
│ FILTROS    │ PRODUCTO GRID         │
│            │ ┌─────┐ ┌─────┐      │
│ Categoría  │ │Card │ │Card │      │
│ Precio     │ │     │ │     │      │
│ [Limpiar]  │ └─────┘ └─────┘      │
│            │ ┌─────┐ ┌─────┐      │
│            │ │Card │ │Card │      │
│            │ └─────┘ └─────┘      │
│            │                       │
│            │ [Paginación]          │
└────────────┴───────────────────────┘
```

---

### Pantalla 2: Carrito

```
┌─────────────────────────────────┐
│ HEADER                          │
├─────────────────────────────────┤
│ Carrito de Compras              │
├─────────────────────────────────┤
│ Tabla de productos              │
│ Producto │Cant│Precio│Subtotal │
│ ─────────────────────────────── │
│ Item 1   │  2 │$19.99│  $39.98 │
│ Item 2   │  1 │$59.99│  $59.99 │
├─────────────────────────────────┤
│                                 │
│        Total: $99.97            │
│ [Pagar]  [Continuar Comprando]  │
└─────────────────────────────────┘
```

---

### Pantalla 3: Admin Panel

```
┌─────────────────────────────────┐
│ HEADER                          │
├─────────────────────────────────┤
│ [Dashboard] [Productos] [Audit] │
├─────────────────────────────────┤
│ Tab Content                     │
│                                 │
│ Dashboard:                      │
│ - Stats Grid                    │
│ - Pending Products Section      │
│                                 │
│ Productos:                      │
│ - Formulario de creación        │
│ - Tabla de productos            │
│                                 │
│ Auditoría:                      │
│ - Logs table                    │
│ - Export CSV button             │
└─────────────────────────────────┘
```

---

## Mockups vs Real

### Estado: Implementado ✅

El diseño está completamente implementado en:
- `index.html` - Estructura
- `assets/styles.css` - Estilos responsivos
- `src/views/CatalogView.js` - Renderización dinámica

**Características Reales:**
- ✅ Grid responsivo con auto-fit
- ✅ Filtros funcionales
- ✅ Búsqueda en tiempo real
- ✅ Carrito persistente
- ✅ Admin panel completo
- ✅ Tema oscuro/claro
- ✅ Notificaciones toast
- ✅ Auditoría visible

---

## Responsive Breakpoints

### Mobile (< 480px)
```css
- Font sizes: -10%
- Padding/Margin: -25%
- Card columns: 1
- Header: Stack vertical
- Filtros: Colapsable
- Cart: Compact view
```

### Tablet (480px - 768px)
```css
- Grid: 2 columns
- Sidebar: Desapare
- Filtros: Top area
- Layout: Single column
```

### Desktop (768px - 1024px)
```css
- Grid: 3 columns
- Sidebar: 250px left
- 2-column layout
```

### Large Desktop (> 1024px)
```css
- Grid: 4-5 columns
- Sidebar: Fixed
- Full featured layout
- Max-width: 1200px
```

---

## Interacciones y Animaciones

### Transiciones
```css
Duración estándar: 300ms (0.3s)
Easing: ease (smooth)

Elementos animados:
- Botones: hover scale + shadow
- Cards: hover translateY + shadow
- Fade in/out: opacity
- Slide: transform translateX
```

### Hover States
```
Buttons:        background change + lift effect
Cards:          shadow + lift + zoom imagen
Links:          underline + color change
Inputs:         border glow + shadow
```

### Loading States
```
Spinner: Animación rotativa
Skeleton: Placeholder gris
Disabled: Opacity 0.5 + no-pointer-events
```

---

## Accesibilidad

### Cumplimiento WCAG 2.1 AA

- ✅ Contraste mínimo 4.5:1
- ✅ Textos descriptivos
- ✅ Etiquetas en inputs
- ✅ Navegación con teclado
- ✅ Focus visible
- ✅ Alt text en imágenes
- ✅ Títulos semánticos (h1, h2, h3)
- ✅ Colores no solo para indicar estado

### Screen Reader Friendly
```html
<button aria-label="Agregar producto al carrito">
  Agregar
</button>

<span role="status" aria-live="polite">
  Producto agregado al carrito
</span>
```

---

## Performance Visual

### Optimizaciones
- CSS minified (producción)
- SVG para iconos (futuro)
- Lazy loading de imágenes
- CSS Grid en lugar de flexbox (donde aplica)
- Will-change en animaciones pesadas

### Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## Dark Mode

### Implementación

```css
body.dark-theme {
  --text-dark: #f9fafb;       /* Invierte */
  --text-light: #d1d5db;      /* Más claro */
  --dark-bg: #0f172a;         /* Más oscuro */
  --light-bg: #1f2937;        /* Invierte */
  --border-color: #374151;    /* Más visible */
}
```

**Transiciones:**
- Suave (0.3s)
- Preserva contraste
- Readable en ambos modos

---

**Diseño Finalizado: ✅**  
Responsive en todos los dispositivos  
Accesible y usable  
Moderno y profesional  

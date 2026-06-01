# 🔧 DIAGNÓSTICO DEL SISTEMA

## Problemas Comunes y Soluciones

### 1. ❌ Las imágenes no aparecen

**Causa:** Los productos en Supabase no tienen URLs de imágenes

**Solución:** 
```sql
UPDATE products SET image_url = 'https://via.placeholder.com/300x400?text=Prenda' WHERE image_url IS NULL;
```

O ejecuta esto en SQL Editor de Supabase:

```sql
-- Actualizar productos con imágenes placeholder
UPDATE products SET 
  image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'
WHERE code = 'PROD-001';

UPDATE products SET 
  image_url = 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=500&fit=crop'
WHERE code = 'PROD-002';
```

---

### 2. ❌ La conexión a Supabase falla

**Síntomas:**
- Los productos no cargan
- La consola muestra errores
- El carrito no funciona

**Verificar:**
1. Abre la consola del navegador (F12)
2. Mira si hay errores rojos
3. Verifica que las credenciales en `src/config.js` sean correctas

**Soluciones:**

a) **Revisar credenciales:**
```javascript
// En src/config.js debe estar:
const SUPABASE_URL = 'https://obbgpwfbrdkrmtgyqtgf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGc...'; // Tu key real
```

b) **Verificar que ejecutaste el SQL:**
- Ve a Supabase → SQL Editor
- Copia todo el contenido de `supabase-setup.sql`
- Ejecuta
- Verifica que se crearon 8 tablas

c) **Permitir CORS:**
- En Supabase → Settings → Authentication
- Verifica que `http://localhost:*` está en "Redirect URLs"

---

### 3. ❌ Los datos de prueba no aparecen

**Verificar que existan:**
1. Ve a Supabase
2. En "Table Editor" verifica:
   - ✅ categories (debe tener al menos 2 categorías)
   - ✅ products (debe tener 2 productos)
   - ✅ sizes, colors (deben tener datos)

**Si no hay datos:**

Ejecuta en SQL Editor:
```sql
-- Insertar categorías
INSERT INTO categories (name, description) VALUES 
('Camisetas', 'Camisetas y tops'),
('Pantalones', 'Jeans y pantalones')
ON CONFLICT (name) DO NOTHING;

-- Insertar tallas
INSERT INTO sizes (size_code, description) VALUES 
('XS', 'Extra Pequeño'),
('S', 'Pequeño'),
('M', 'Mediano'),
('L', 'Large'),
('XL', 'Extra Large'),
('XXL', 'Extra Extra Large')
ON CONFLICT (size_code) DO NOTHING;

-- Insertar colores
INSERT INTO colors (color_name, color_hex) VALUES 
('Blanco', '#FFFFFF'),
('Negro', '#000000'),
('Rojo', '#FF0000'),
('Azul', '#0000FF'),
('Verde', '#008000'),
('Gris', '#808080'),
('Beige', '#F5F5DC')
ON CONFLICT (color_name) DO NOTHING;

-- Insertar productos
INSERT INTO products (code, name, description, category_id, price, stock, image_url, is_active, quality_status, created_by)
VALUES 
('PROD-001', 'Camiseta Básica', 'Camiseta de algodón 100% de alta calidad', 1, 19.99, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', true, 'approved', 'admin'),
('PROD-002', 'Jeans Premium', 'Jeans azul oscuro con ajuste perfecto', 2, 59.99, 30, 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=500&fit=crop', true, 'approved', 'admin'),
('PROD-003', 'Vestido Negro', 'Elegante vestido negro para ocasiones especiales', 1, 79.99, 20, 'https://images.unsplash.com/photo-1595777707802-221b6f9b0c6b?w=400&h=500&fit=crop', true, 'approved', 'admin'),
('PROD-004', 'Polo Deportivo', 'Polo técnico para deportes y casual', 1, 39.99, 40, 'https://images.unsplash.com/photo-1508014780951-368ea2f3a7ae?w=400&h=500&fit=crop', true, 'approved', 'admin')
ON CONFLICT (code) DO NOTHING;
```

---

### 4. ❌ El carrito o admin no funcionan

**Soluciones:**
- Abre la consola (F12)
- Busca errores en rojo
- Copia el error y búscalo en la documentación

**Errores comunes:**
- `Cannot read property 'supabaseClient'` → Las credenciales están mal
- `CORS error` → Problema con Supabase configuration
- `404` → Un archivo JS no se encontró

---

### 5. 🔍 Cómo ver la consola

**Firefox:**
- Presiona `F12`
- Ve a pestaña "Console"

**Chrome:**
- Presiona `F12`
- Ve a pestaña "Console"

**Safari:**
- Presiona `Cmd + Option + I`
- Ve a pestaña "Console"

---

### 6. ✅ Verificación Rápida

Copia esto en la consola del navegador:

```javascript
// Verificar configuración
console.log('✓ Supabase URL:', SUPABASE_URL);
console.log('✓ Supabase conectado:', !!supabaseClient);
console.log('✓ Config:', CONFIG);

// Verificar datos
supabaseClient.from('products').select('count').then(r => {
  console.log('✓ Productos en BD:', r.data[0]?.count || 0);
});
```

---

## 📊 Checklist de Verificación

- [ ] Supabase proyecto creado
- [ ] SQL ejecutado en SQL Editor
- [ ] Credenciales en `src/config.js`
- [ ] Datos en Supabase (ver Table Editor)
- [ ] Imágenes en productos
- [ ] Sin errores en consola (F12)
- [ ] Live Server activo
- [ ] Página se carga sin errores

---

## 📞 Problemas Persistentes

Si nada funciona:

1. **Verifica en Supabase:**
   - Proyecto activo
   - Credenciales correctas
   - CORS permitido (settings)

2. **Verifica en navegador:**
   - Consola sin errores (F12)
   - Live Server en `http://localhost:5500`
   - No hay bloqueador de contenido

3. **Reinicia:**
   - Recarga la página (Ctrl+Shift+R)
   - Reinicia Live Server
   - Limpia LocalStorage: `localStorage.clear()`

---

¡Gracias por usar el Sistema! 🎉

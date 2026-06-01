# 🔴 PROBLEMA CON LAS IMÁGENES Y CONEXIÓN

Hemos detectado que hay fallos en la interfaz. Aquí está la solución:

---

## ⚡ SOLUCIÓN RÁPIDA (3 PASOS)

### Paso 1: Abrir el Verificador
```
Abre en tu navegador:
http://localhost:5500/VERIFICADOR.html
```

Este archivo te dirá **exactamente** qué está fallando.

### Paso 2: Seguir las Instrucciones
El verificador te mostrará:
- ✅ Si la conexión funciona
- ✅ Cuántos productos hay
- ✅ Qué hacer para arreglar

### Paso 3: Recarga la App
```
Después de seguir las instrucciones:
http://localhost:5500
Presiona: Ctrl + Shift + R
```

---

## 🐛 PROBLEMAS TÍPICOS Y SOLUCIONES

### 1. Las imágenes no aparecen
**Causa:** Los productos no tienen URLs de imagen

**Solución:**
1. Abre VERIFICADOR.html
2. Presiona el botón "Copiar SQL"
3. Ve a Supabase → SQL Editor
4. Pega y ejecuta el SQL
5. Recarga la página

### 2. Los productos no aparecen
**Causa:** El SQL no se ejecutó

**Solución:**
1. Ve a Supabase → SQL Editor
2. Abre supabase-setup.sql (desde tu PC)
3. Copia TODO el contenido
4. Pégalo en Supabase
5. Ejecuta
6. Recarga navegador

### 3. Error de conexión
**Causa:** Credenciales incorrectas o CORS

**Solución:**
1. Abre src/config.js
2. Verifica que tenga tus credenciales reales:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
3. Si están vacías:
   - Ve a Supabase
   - Settings → API
   - Copia y pega en src/config.js
4. Ve a Supabase → Settings → Authentication
5. Agrega `http://localhost:*` en Redirect URLs

---

## 📁 ARCHIVOS DE AYUDA

| Archivo | Para qué | Abre |
|---------|----------|------|
| VERIFICADOR.html | Diagnosticar problemas | Navegador |
| PROBLEMAS.txt | Soluciones paso a paso | Bloc de notas |
| DIAGNOSTICO.md | Troubleshooting completo | Markdown |

---

## 🎯 CHECKLIST FINAL

Cuando TODO funcione, verás:
- ✅ Productos con imágenes
- ✅ Buscador funcionando
- ✅ Filtros funcionando
- ✅ Carrito funcionando
- ✅ Sin errores en F12 (consola)

---

## 📞 ¿Si nada funciona?

1. Abre F12 (Consola)
2. Busca mensajes rojos
3. Lee el archivo DIAGNOSTICO.md
4. Busca tu error en ese archivo
5. Sigue la solución

---

**👉 Siguiente paso: Abre http://localhost:5500/VERIFICADOR.html**

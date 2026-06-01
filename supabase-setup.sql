-- ================================================================
-- SQL SETUP PARA SUPABASE - SISTEMA DE GESTIÓN DE CATÁLOGO DE ROPA
-- ================================================================
-- Cumple con normas ISO 9001 (Gestión de Calidad)
-- Incluye campos de auditoría y trazabilidad

-- 1. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Tallas
CREATE TABLE IF NOT EXISTS sizes (
  id BIGSERIAL PRIMARY KEY,
  size_code VARCHAR(10) NOT NULL UNIQUE,
  description VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Colores
CREATE TABLE IF NOT EXISTS colors (
  id BIGSERIAL PRIMARY KEY,
  color_name VARCHAR(50) NOT NULL UNIQUE,
  color_hex VARCHAR(7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Productos (PRINCIPAL)
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  quality_status VARCHAR(20) DEFAULT 'approved', -- approved, pending, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(100),
  CHECK (price >= 0),
  CHECK (stock >= 0)
);

-- 5. Tabla de Inventario por Talla y Color (Detalle)
CREATE TABLE IF NOT EXISTS product_inventory (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_id BIGINT NOT NULL REFERENCES sizes(id) ON DELETE CASCADE,
  color_id BIGINT NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 0,
  UNIQUE(product_id, size_id, color_id),
  CHECK (quantity >= 0)
);

-- 6. Tabla de Auditoría (ISO 9001 - Trazabilidad)
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id BIGINT,
  old_data JSONB,
  new_data JSONB,
  user_id VARCHAR(100),
  ip_address VARCHAR(45),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de Ordenes de Compra
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(100),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (total_amount >= 0)
);

-- 8. Tabla de Detalles de Orden
CREATE TABLE IF NOT EXISTS order_details (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  size_id BIGINT NOT NULL REFERENCES sizes(id),
  color_id BIGINT NOT NULL REFERENCES colors(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  CHECK (quantity > 0),
  CHECK (unit_price >= 0),
  CHECK (subtotal >= 0)
);

-- ================================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
-- ================================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_inventory_product ON product_inventory(product_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_details_order ON order_details(order_id);

-- ================================================================
-- DATOS INICIALES
-- ================================================================

-- Categorías
INSERT INTO categories (name, description) VALUES
('Camisetas', 'Camisetas y tops'),
('Pantalones', 'Pantalones y jeans'),
('Vestidos', 'Vestidos para ocasiones'),
('Accesorios', 'Cinturones, gorras, etc.')
ON CONFLICT (name) DO NOTHING;

-- Tallas
INSERT INTO sizes (size_code, description) VALUES
('XS', 'Extra Small'),
('S', 'Small'),
('M', 'Medium'),
('L', 'Large'),
('XL', 'Extra Large'),
('XXL', '2X Large')
ON CONFLICT (size_code) DO NOTHING;

-- Colores
INSERT INTO colors (color_name, color_hex) VALUES
('Negro', '#000000'),
('Blanco', '#FFFFFF'),
('Rojo', '#FF0000'),
('Azul', '#0000FF'),
('Verde', '#008000'),
('Gris', '#808080'),
('Beige', '#F5F5DC')
ON CONFLICT (color_name) DO NOTHING;

-- Ejemplo de Productos (Con Imágenes)
INSERT INTO products (code, name, description, category_id, price, stock, image_url, is_active, quality_status, created_by)
VALUES 
('PROD-001', 'Camiseta Básica', 'Camiseta de algodón 100% de alta calidad', 1, 19.99, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', true, 'approved', 'admin'),
('PROD-002', 'Jeans Premium', 'Jeans azul oscuro con ajuste perfecto', 2, 59.99, 30, 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=500&fit=crop', true, 'approved', 'admin'),
('PROD-003', 'Vestido Negro Elegante', 'Elegante vestido negro para ocasiones especiales', 1, 79.99, 20, 'https://images.unsplash.com/photo-1595777707802-221b6f9b0c6b?w=400&h=500&fit=crop', true, 'approved', 'admin'),
('PROD-004', 'Polo Deportivo', 'Polo técnico para deportes y casual', 1, 39.99, 40, 'https://images.unsplash.com/photo-1508014780951-368ea2f3a7ae?w=400&h=500&fit=crop', true, 'approved', 'admin'),
('PROD-005', 'Shorts de Verano', 'Shorts cómodos y frescos para el verano', 2, 29.99, 60, 'https://images.unsplash.com/photo-1592505643966-f3fc860eab7e?w=400&h=500&fit=crop', true, 'approved', 'admin'),
('PROD-006', 'Chaqueta de Cuero', 'Chaqueta de cuero genuino estilo clásico', 3, 149.99, 15, 'https://images.unsplash.com/photo-1597881761160-ec3f43cea335?w=400&h=500&fit=crop', true, 'pending', 'admin')
ON CONFLICT (code) DO NOTHING;

-- ================================================================
-- FUNCIONES Y TRIGGERS PARA AUDITORÍA (ISO 9001)
-- ================================================================

-- Función para registrar cambios en productos
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (action, table_name, record_id, old_data, user_id)
    VALUES ('DELETE', 'products', OLD.id, row_to_json(OLD), current_user);
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (action, table_name, record_id, old_data, new_data, user_id)
    VALUES ('UPDATE', 'products', NEW.id, row_to_json(OLD), row_to_json(NEW), current_user);
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (action, table_name, record_id, new_data, user_id)
    VALUES ('INSERT', 'products', NEW.id, row_to_json(NEW), current_user);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auditar productos
DROP TRIGGER IF EXISTS product_audit_trigger ON products;
CREATE TRIGGER product_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION log_product_changes();

-- ================================================================
-- RLS (Row Level Security) - Seguridad
-- ================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (is_active = true);

-- ================================================================
-- VISTAS ÚTILES
-- ================================================================

-- Vista de Productos Disponibles con Detalles
CREATE OR REPLACE VIEW v_products_detail AS
SELECT 
  p.id,
  p.code,
  p.name,
  p.description,
  c.name as category,
  p.price,
  p.stock,
  p.image_url,
  p.is_active,
  p.quality_status,
  p.created_at,
  p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true;

-- Vista de Inventario Detallado
CREATE OR REPLACE VIEW v_inventory_detail AS
SELECT 
  p.code,
  p.name,
  s.size_code,
  col.color_name,
  pi.quantity,
  p.price
FROM product_inventory pi
JOIN products p ON pi.product_id = p.id
JOIN sizes s ON pi.size_id = s.id
JOIN colors col ON pi.color_id = col.id
WHERE p.is_active = true;

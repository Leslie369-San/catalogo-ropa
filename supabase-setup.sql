-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.roles (
  id_rol integer NOT NULL DEFAULT nextval('roles_id_rol_seq'::regclass),
  nombre_rol character varying NOT NULL UNIQUE,
  CONSTRAINT roles_pkey PRIMARY KEY (id_rol)
);
CREATE TABLE public.usuarios (
  id_usuario integer NOT NULL DEFAULT nextval('usuarios_id_usuario_seq'::regclass),
  nombre_completo character varying NOT NULL,
  username character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  id_rol integer,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario),
  CONSTRAINT usuarios_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol)
);
CREATE TABLE public.proveedores (
  id_proveedor integer NOT NULL DEFAULT nextval('proveedores_id_proveedor_seq'::regclass),
  nombre_empresa character varying NOT NULL UNIQUE,
  telefono character varying,
  CONSTRAINT proveedores_pkey PRIMARY KEY (id_proveedor)
);
CREATE TABLE public.categorias (
  id_categoria integer NOT NULL DEFAULT nextval('categorias_id_categoria_seq'::regclass),
  nombre character varying NOT NULL,
  CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria)
);
CREATE TABLE public.productos (
  id_producto integer NOT NULL DEFAULT nextval('productos_id_producto_seq'::regclass),
  codigo_barras character varying UNIQUE,
  nombre character varying NOT NULL,
  presentacion character varying DEFAULT 'Unidad'::character varying,
  es_fraccionable boolean DEFAULT false,
  unidades_por_caja integer DEFAULT 1,
  precio_venta_caja numeric,
  precio_venta_unidad numeric,
  stock_minimo_alerta integer DEFAULT 5,
  id_categoria integer,
  id_proveedor integer,
  CONSTRAINT productos_pkey PRIMARY KEY (id_producto),
  CONSTRAINT productos_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria),
  CONSTRAINT productos_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES public.proveedores(id_proveedor)
);
CREATE TABLE public.lotes (
  id_lote integer NOT NULL DEFAULT nextval('lotes_id_lote_seq'::regclass),
  id_producto integer,
  codigo_lote character varying,
  fecha_vencimiento date NOT NULL,
  cantidad_cajas integer NOT NULL,
  cantidad_unidades_sueltas integer DEFAULT 0,
  precio_compra_caja numeric NOT NULL,
  activo boolean DEFAULT true,
  CONSTRAINT lotes_pkey PRIMARY KEY (id_lote),
  CONSTRAINT lotes_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto)
);
CREATE TABLE public.ventas (
  id_venta integer NOT NULL DEFAULT nextval('ventas_id_venta_seq'::regclass),
  fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  id_usuario integer,
  total numeric NOT NULL,
  CONSTRAINT ventas_pkey PRIMARY KEY (id_venta),
  CONSTRAINT ventas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);
CREATE TABLE public.detalle_ventas (
  id_detalle integer NOT NULL DEFAULT nextval('detalle_ventas_id_detalle_seq'::regclass),
  id_venta integer,
  id_producto integer,
  tipo_venta character varying DEFAULT 'Caja'::character varying,
  cantidad integer NOT NULL,
  precio_unitario_aplicado numeric NOT NULL,
  subtotal numeric NOT NULL,
  CONSTRAINT detalle_ventas_pkey PRIMARY KEY (id_detalle),
  CONSTRAINT detalle_ventas_id_venta_fkey FOREIGN KEY (id_venta) REFERENCES public.ventas(id_venta),
  CONSTRAINT detalle_ventas_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto)
);
CREATE TABLE public.movimientos_inventario (
  id_movimiento integer NOT NULL DEFAULT nextval('movimientos_inventario_id_movimiento_seq'::regclass),
  fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  id_producto integer,
  id_usuario integer,
  tipo_movimiento character varying NOT NULL,
  cantidad_cajas integer DEFAULT 0,
  motivo character varying,
  CONSTRAINT movimientos_inventario_pkey PRIMARY KEY (id_movimiento),
  CONSTRAINT movimientos_inventario_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto),
  CONSTRAINT movimientos_inventario_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);
CREATE TABLE public.caja_chica (
  id_transaccion integer NOT NULL DEFAULT nextval('caja_chica_id_transaccion_seq'::regclass),
  fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  id_usuario integer,
  tipo_transaccion character varying NOT NULL,
  monto numeric NOT NULL,
  concepto character varying NOT NULL,
  CONSTRAINT caja_chica_pkey PRIMARY KEY (id_transaccion),
  CONSTRAINT caja_chica_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario)
);
CREATE TABLE public.categories (
  id bigint NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sizes (
  id bigint NOT NULL DEFAULT nextval('sizes_id_seq'::regclass),
  size_code character varying NOT NULL UNIQUE,
  description character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sizes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.colors (
  id bigint NOT NULL DEFAULT nextval('colors_id_seq'::regclass),
  color_name character varying NOT NULL UNIQUE,
  color_hex character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT colors_pkey PRIMARY KEY (id)
);
CREATE TABLE public.products (
  id bigint NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  category_id bigint NOT NULL,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url character varying,
  is_active boolean DEFAULT true,
  quality_status character varying DEFAULT 'approved'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by character varying,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.audit_logs (
  id bigint NOT NULL DEFAULT nextval('audit_logs_id_seq'::regclass),
  action character varying NOT NULL,
  table_name character varying NOT NULL,
  record_id bigint,
  old_data jsonb,
  new_data jsonb,
  user_id character varying,
  ip_address character varying,
  timestamp timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.orders (
  id bigint NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
  order_number character varying NOT NULL UNIQUE,
  customer_name character varying NOT NULL,
  customer_email character varying,
  total_amount numeric NOT NULL CHECK (total_amount >= 0::numeric),
  status character varying DEFAULT 'pending'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order_details (
  id bigint NOT NULL DEFAULT nextval('order_details_id_seq'::regclass),
  order_id bigint NOT NULL,
  product_id bigint NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0::numeric),
  subtotal numeric NOT NULL CHECK (subtotal >= 0::numeric),
  CONSTRAINT order_details_pkey PRIMARY KEY (id),
  CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_details_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
// ========================================
// CONFIGURACIÓN DE SUPABASE
// ========================================

// IMPORTANTE: Reemplaza con tus credenciales reales de Supabase
const SUPABASE_URL = 'https://obbgpwfbrdkrmtgyqtgf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYmdwd2ZicmRrcm10Z3lxdGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTM1MzgsImV4cCI6MjA5NDk2OTUzOH0.M2_utf-akO4WCGLkUKsZ8fJaAdEqMTkz1uZeV_kOFis';

// Cargar Supabase desde CDN
const { createClient } = supabase;

// Crear cliente de Supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Configuración de la aplicación
const CONFIG = {
  APP_NAME: 'Gestión de Catálogo de Ropa',
  VERSION: '1.0.0',
  ISO_COMPLIANCE: 'ISO 9001:2015',
  DESIGN_PATTERN: 'Factory Pattern (Creacional)',
  API_TIMEOUT: 10000,
  MAX_PRODUCTS_PER_PAGE: 12,
  CURRENCY: 'USD',
  CURRENCY_SYMBOL: '$'
};

// Mapeo de tablas
const TABLES = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  SIZES: 'sizes',
  COLORS: 'colors',
  ORDERS: 'orders',
  ORDER_DETAILS: 'order_details',
  AUDIT_LOGS: 'audit_logs'
};

// Estados de calidad (ISO 9001)
const QUALITY_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected'
};

// Estados de orden
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered'
};

// Validaciones
const VALIDATION = {
  PRODUCT_NAME_MIN: 3,
  PRODUCT_NAME_MAX: 150,
  PRICE_MIN: 0,
  STOCK_MIN: 0,
  DESCRIPTION_MAX: 500
};

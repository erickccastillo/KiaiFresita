import express, { Request, Response } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Validar credenciales para evitar que Render truene si faltan las variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// ENDPOINTS DE PRODUCTOS Y TOPPINGS
// ==========================================

// Obtener catálogo
app.get('/api/products', async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('products').select('*').order('name');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Crear producto nuevo
app.post('/api/products', async (req: Request, res: Response) => {
  // Ahora aceptamos la categoría para diferenciar productos de toppings
  const { name, description, price, category } = req.body;
  const { data, error } = await supabase.from('products').insert([{ name, description, price, category }]);
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});


// ==========================================
// ENDPOINTS DE VENTAS Y CARRITO
// ==========================================

// Historial de ventas
app.get('/api/sales', async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Registrar la orden del día (Carrito)
app.post('/api/sales', async (req: Request, res: Response) => {
  const { total_amount, items } = req.body;
  
  // Ajustamos la hora para México (CST) para que las ventas de la noche no cuenten como "mañana" por el UTC de los servidores
  const now = new Date();
  now.setHours(now.getHours() - 6); 
  const today = now.toISOString().split('T')[0];

  // 1. Buscar el número de orden más alto de hoy
  const { data: todaySales, error: fetchError } = await supabase
    .from('sales')
    .select('daily_order_number')
    .eq('sale_date', today)
    .order('daily_order_number', { ascending: false })
    .limit(1);

  if (fetchError) return res.status(400).json({ error: fetchError.message });

  // 2. Calcular el consecutivo
  let nextOrderNumber = 1;
  if (todaySales && todaySales.length > 0) {
    nextOrderNumber = todaySales[0].daily_order_number + 1;
  }

  // 3. Guardar la orden completa
  const { data, error } = await supabase.from('sales').insert([{
    daily_order_number: nextOrderNumber,
    total_amount,
    items, // El array completo de JSONB
    sale_date: today
  }]);
  
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, order_number: nextOrderNumber, data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🥋 Backend de Kiai Fresita en puerto ${PORT}`));
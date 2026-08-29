import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// Endpoint para guardar una venta (Lo usarás en tu vista Admin)
app.post('/api/sales', async (req, res) => {
  const { amount, description } = req.body;
  const { data, error } = await supabase.from('sales').insert([{ amount, description }]);
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Endpoint para obtener todas las ventas
app.get('/api/sales', async (req, res) => {
  const { data, error } = await supabase.from('sales').select('*').order('sale_date', { ascending: false });
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').order('name');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/products', async (req, res) => {
  const { name, description, price } = req.body;
  const { data, error } = await supabase.from('products').insert([{ name, description, price }]);
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/sales', async (req, res) => {
  const { total_amount, items } = req.body;
  
  // Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

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
    items, // El array del carrito
    sale_date: today
  }]);
  
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, order_number: nextOrderNumber, data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🥋 Backend de Kiai Fresita en puerto ${PORT}`));
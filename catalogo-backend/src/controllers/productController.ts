import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Función para obtener productos (Catálogo)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { q, category } = req.query;

    let query = supabase
      .from('products')
      .select('*');

    // Buscar por nombre
    if (q && typeof q === 'string') {
      query = query.ilike('name', `%${q}%`);
    }

    // Filtrar por categoría
    if (
      category &&
      typeof category === 'string' &&
      category !== 'TODOS'
    ) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order(
      'created_at',
      { ascending: false }
    );

    if (error) throw error;

    res.json({
      products: data,
      totalProducts: data.length,
      totalPages: 1,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener productos',
    });
  }
};

// Función para crear productos (Panel de Administrador)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image_url,
      color,
      material,
      medidas
    } = req.body;

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description,
          price,
          category,
          image_url,
          color,
          material,
          medidas
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const {
    name,
    description,
    price,
    category,
    image_url,
    color,
    material,
    medidas
  } = req.body;

  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        category,
        image_url,
        color,
        material,
        medidas
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.status(200).json({
      message: 'Producto actualizado con éxito',
      product: data[0]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

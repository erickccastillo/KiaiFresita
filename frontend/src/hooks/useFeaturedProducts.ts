import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // 1. Usamos la variable de entorno que apunta a tu Backend en Render
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        // 2. Hacemos la petición a tu API
        // Usamos /api/products que sabemos que ya funciona perfectamente
        const response = await fetch(`${apiUrl}/api/products`);
        
        if (!response.ok) throw new Error('Error al cargar destacados');
        
        const data = await response.json();
        
        // 3. Tomamos solo los primeros 4 productos para mostrarlos como "Destacados"
        const allProducts = data.products || [];
        
        const randomProducts = [...allProducts]
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        
        setProducts(randomProducts);
        
      } catch (error) {
        console.error("Error cargando productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { products, loading };
};

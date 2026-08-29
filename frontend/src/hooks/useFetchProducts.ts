import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';

interface UseFetchProductsArgs {
  page: number;
  q: string;
  category: string;
}

export const useFetchProducts = ({ page, q, category }: UseFetchProductsArgs) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construimos los parámetros de la URL dinámicamente
        const params = new URLSearchParams({
          page: page.toString(),
        });
        
        if (q) params.append('q', q);
        if (category !== 'TODOS') params.append('category', category);

        // Apunta al backend de producción en Render o al local en desarrollo
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        const response = await fetch(`${apiUrl}/api/products?${params}`);
        if (!response.ok) throw new Error('Error al cargar el catálogo');
        
        const data = await response.json();
        
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 0);
        setTotalProducts(data.totalProducts || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Aplicamos un "debounce" de 300ms para evitar peticiones excesivas al escribir
    const timerId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timerId);
  }, [page, q, category]);

  return { products, loading, error, totalPages, totalProducts };
};
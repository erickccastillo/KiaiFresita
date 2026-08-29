import React from 'react';
import type { Product } from '../types/Product';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onProductClick?: (product: Product) => void; // Recibimos el clic desde Catalog.tsx
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductClick }) => {
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: '#666' }}>
        <p>No se encontraron productos con estos filtros.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
      gap: '2.5rem' 
    }}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          // Pasamos la orden de ejecutar el clic y le mandamos qué producto es
          onClick={() => {
            if (onProductClick) {
              onProductClick(product);
            }
          }} 
        />
      ))}
    </div>
  );
};

export default ProductList;
import React, { useState } from 'react';
import type { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onClick: () => void; // Recibe la función onClick
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  // Estado para controlar si el cursor está sobre la tarjeta (Hover)
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.card,
        // Efecto visual: se levanta ligeramente al pasar el cursor
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 12px 20px -8px rgba(0,0,0,0.15)' 
          : '0 4px 10px rgba(0,0,0,0.05)'
      }}
    >
      {/* Contenedor de Imagen */}
      <div style={styles.imageWrapper}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={styles.image} />
        ) : (
          <div style={styles.noImage}>Sin Imagen</div>
        )}
        
        {/* Etiqueta flotante de categoría */}
        {product.category && (
          <div style={styles.categoryTag}>{product.category}</div>
        )}
      </div>

      {/* Detalles del Producto */}
      <div style={styles.cardBody}>
        <h3 style={styles.title}>{product.name}</h3>
        
        {/* Precio (si existe) */}
        {product.price > 0 && (
          <p style={styles.price}>${product.price.toFixed(2)} MXN</p>
        )}
      </div>
    </div>
  );
};

// --- ESTILOS DE LA TARJETA ---
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #f3f4f6',
    cursor: 'pointer', // Manita para indicar que se puede hacer clic
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Transición suave
  },
  imageWrapper: {
    width: '100%',
    height: '240px', // Altura uniforme
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  categoryTag: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#111827',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '1px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardBody: {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 0.5rem 0',
    lineHeight: 1.4,
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#e1b71f',
    margin: 0,
    marginTop: 'auto', // Lo alinea al fondo
  },
};

export default ProductCard;
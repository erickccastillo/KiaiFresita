import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import { useFetchProducts } from '../hooks/useFetchProducts';
import type { Product } from '../types/Product';

// --- FUNCIÓN INTELIGENTE CON DISEÑO A 2 COLUMNAS ---
const formatTechnicalDescription = (text?: string) => {
  if (!text) return <p style={{ color: '#6b7280' }}>Descripción no disponible.</p>;

  const keywords = [
    "MARCA:", "APARIENCIA:", "ACABADO:", "ESPESOR:", "M²/CAJA:", 
    "PZS/CAJA:", "KG/CAJA:", "USO:", "ÁREA DE APLICACIÓN:", 
    "CALIDAD:", "ACABADO ESPECIAL:", "NIVEL DE ESFUMADO:", 
    "ABSORCIÓN:", "TRÁNSITO:", "MODELO:", "FORMATO:", "TIPO:"
  ];

  let formattedText = text;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\s*${keyword}`, 'g');
    formattedText = formattedText.replace(regex, `\n${keyword}`);
  });

  const lines = formattedText.split('\n').filter(line => line.trim() !== '');

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', // Crea 2 columnas dinámicas
      columnGap: '2rem', 
      rowGap: '0.75rem',
      marginBottom: '1.5rem' 
    }}>
      {lines.map((line, index) => {
        const [key, ...rest] = line.split(':');
        const value = rest.join(':').trim();
        
        if (key && value) {
          return (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              borderBottom: '1px solid #f3f4f6', 
              paddingBottom: '0.4rem',
            }}>
              <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.85rem' }}>
                {key.trim()}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'right', maxWidth: '60%' }}>
                {value}
              </span>
            </div>
          );
        }
        
        // Si el texto es muy largo y no tiene "Llave: Valor", que ocupe las dos columnas enteras
        return (
          <p key={index} style={{ 
            color: '#4b5563', 
            fontSize: '0.95rem', 
            margin: 0,
            gridColumn: '1 / -1' 
          }}>
            {line}
          </p>
        );
      })}
    </div>
  );
};

const Catalog: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('TODOS');
  const [page, setPage] = useState(1);

  const { products, loading, error, totalPages, totalProducts } = useFetchProducts({
    page,
    q: query,
    category,
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const categories = [
    'TODOS', 'PISOS', 'MUROS', 'CERÁMICO', 'MPB', 
    'AZULEJOS', 'DECORATIVOS', 'MONOMANDOS', 'MEZCLADORAS', 'LAVABOS'
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section style={styles.container}>
      {/* Cabecera del Catálogo */}
      <div style={styles.header}>
        <div style={styles.accentLine}></div>
        <h2 style={styles.title}>Catálogo de Productos</h2>
        <p style={styles.subtitle}>
          Explora nuestra colección completa. Pisos y azulejos seleccionados pieza por pieza para tus proyectos.
        </p>
      </div>

      {/* Panel de Controles */}
      <div style={styles.controlsCard}>
        <div style={styles.searchWrapper}>
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
          />
        </div>

        <div style={styles.categoriesWrapper}>
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                style={{
                  ...styles.categoryButton,
                  backgroundColor: isActive ? '#0a2a5e' : '#f3f4f6',
                  color: isActive ? '#ffffff' : '#4b5563',
                  borderColor: isActive ? '#0a2a5e' : '#e5e7eb',
                  boxShadow: isActive ? '0 4px 6px -1px rgba(10, 42, 94, 0.2)' : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div style={styles.statusMessage}>
          <div style={styles.spinner}></div>
          <p>Cargando nuestro catálogo...</p>
        </div>
      )}
      
      {error && (
        <div style={styles.errorMessage}>
          <span style={{ fontWeight: 'bold' }}>¡Ups! Ha ocurrido un error:</span> {error}
        </div>
      )}

      {/* Lista de Productos */}
      {!loading && !error && (
        <div style={styles.productSection}>
         <ProductList 
            products={products as Product[]} 
            onProductClick={(producto) => setSelectedProduct(producto)} 
          />
        </div>
      )}

      {/* Controles de Paginación */}
      {!loading && !error && totalProducts > 0 && (
        <div style={styles.paginationContainer}>
          <div style={styles.paginationInfo}>
            Mostrando <span style={styles.highlightText}>{products?.length ?? 0}</span> de <span style={styles.highlightText}>{totalProducts ?? 0}</span> productos
          </div>

          {totalPages > 1 && (
            <div style={styles.paginationControls}>
              <button
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  scrollToTop();
                }}
                disabled={page === 1}
                style={{
                  ...styles.pageButton,
                  opacity: page === 1 ? 0.5 : 1,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Anterior
              </button>

              <div style={styles.pageIndicator}>
                Página <span style={{ fontWeight: 700, color: '#0a2a5e' }}>{page}</span> de {totalPages}
              </div>

              <button
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  scrollToTop();
                }}
                disabled={page === totalPages}
                style={{
                  ...styles.pageButton,
                  opacity: page === totalPages ? 0.5 : 1,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================
          MODAL (VENTANA FLOTANTE DE DETALLES)
          ========================================= */}
      {selectedProduct && (
        <div style={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={() => setSelectedProduct(null)}>
              ✕
            </button>
            
            <div style={styles.modalGrid}>
              {/* Columna Izquierda: Imagen */}
              <div style={styles.modalImageWrapper}>
                {selectedProduct.image_url ? (
                  <img 
                    src={selectedProduct.image_url} 
                    alt={selectedProduct.name} 
                    style={styles.modalImage} 
                  />
                ) : (
                  <div style={{ color: '#9ca3af', fontWeight: 600 }}>Sin Imagen</div>
                )}
              </div>

              {/* Columna Derecha: Detalles */}
              <div style={styles.modalDetails}>
                <span style={styles.modalCategory}>{selectedProduct.category}</span>
                <h2 style={styles.modalTitle}>{selectedProduct.name}</h2>
                
                {selectedProduct.price > 0 && (
                  <p style={styles.modalPrice}>${selectedProduct.price?.toFixed(2)} MXN</p>
                )}
                
                {/* LA DESCRIPCIÓN TÉCNICA AHORA ESTÁ A 2 COLUMNAS */}
                {formatTechnicalDescription(selectedProduct.description)}

                {/* Especificaciones Extras (Color, Material, Medidas) a 2 columnas */}
                <div style={styles.specsContainer}>
                  {selectedProduct.color && (
                    <div style={styles.specItem}>
                      <span style={styles.specLabel}>Color</span>
                      <span style={styles.specValue}>{selectedProduct.color}</span>
                    </div>
                  )}
                  {selectedProduct.material && (
                    <div style={styles.specItem}>
                      <span style={styles.specLabel}>Material</span>
                      <span style={styles.specValue}>{selectedProduct.material}</span>
                    </div>
                  )}
                  {selectedProduct.medidas && (
                    <div style={styles.specItem}>
                      <span style={styles.specLabel}>Medidas</span>
                      <span style={styles.specValue}>{selectedProduct.medidas}</span>
                    </div>
                  )}
                </div>

                <a href="/quote" style={styles.modalButton}>
                  SOLICITAR COTIZACIÓN
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Objeto de estilos
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '4rem 2rem',
    maxWidth: '1280px',
    margin: '0 auto',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  accentLine: {
    width: '60px',
    height: '4px',
    backgroundColor: '#FFD700',
    borderRadius: '2px',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#111827',
    margin: '0 0 1rem 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6b7280',
    maxWidth: '600px',
    lineHeight: 1.6,
    margin: 0,
  },
  controlsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f3f4f6',
    marginBottom: '3rem',
  },
  searchWrapper: {
    maxWidth: '600px',
    margin: '0 auto 2rem auto',
  },
  categoriesWrapper: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryButton: {
    padding: '0.5rem 1.25rem',
    borderRadius: '9999px',
    border: '1px solid',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  productSection: {
    minHeight: '400px',
  },
  statusMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
    color: '#6b7280',
    fontSize: '1.125rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f4f6',
    borderTopColor: '#0a2a5e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid #f87171',
    textAlign: 'center',
    margin: '2rem 0',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4rem',
    paddingTop: '2rem',
    borderTop: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  paginationInfo: {
    fontSize: '0.95rem',
    color: '#6b7280',
  },
  highlightText: {
    fontWeight: 700,
    color: '#111827',
  },
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  pageButton: {
    padding: '0.5rem 1.25rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontWeight: 600,
    fontSize: '0.9rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s',
  },
  pageIndicator: {
    fontSize: '0.95rem',
    color: '#6b7280',
    minWidth: '100px',
    textAlign: 'center',
  },

  /* --- ESTILOS DEL MODAL FLOTANTE --- */
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(17, 24, 39, 0.85)', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
    boxSizing: 'border-box',
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    maxWidth: '1050px', // CAMBIO: Aumentado para dar espacio a las 2 columnas
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: '#4b5563',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'background-color 0.2s',
  },
  modalGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2.5rem',
    padding: '2.5rem',
  },
  modalImageWrapper: {
    flex: '1 1 350px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  modalImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '500px',
    objectFit: 'contain',
  },
  modalDetails: {
    flex: '2 1 450px', // CAMBIO: Le damos más ancho disponible a los detalles
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  modalCategory: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#e1b71f',
    letterSpacing: '1px',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#111827',
    marginBottom: '0.5rem',
    lineHeight: 1.2,
  },
  modalPrice: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#e1b71f',
    marginBottom: '1.5rem',
  },
  // CAMBIO: Este contenedor ahora también usa Grid de 2 columnas para igualar al de arriba
  specsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    columnGap: '2rem',
    rowGap: '0.75rem',
    marginBottom: '2.5rem',
    backgroundColor: '#f9fafb',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  specItem: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.4rem',
  },
  specLabel: {
    fontWeight: 600,
    color: '#111827',
    fontSize: '0.85rem'
  },
  specValue: {
    color: '#6b7280',
    fontSize: '0.85rem'
  },
  modalButton: {
    backgroundColor: '#111827', 
    color: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(17, 24, 39, 0.2)',
    transition: 'transform 0.2s',
    marginTop: 'auto', // Asegura que el botón se empuje hacia abajo si hay espacio
  },
};

export default Catalog;
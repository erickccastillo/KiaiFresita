import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import { useFetchProducts } from '../hooks/useFetchProducts';
import type { Product } from '../types/Product';

const Catalog: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('TODOS');
  const [page, setPage] = useState(1);
  
  // ESTADO NUEVO: Controla qué producto está seleccionado para mostrar en el Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { products, loading, error, totalPages, totalProducts } = useFetchProducts({
    page,
    q: query,
    category,
  });

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
                  backgroundColor: isActive ? '#111827' : '#f3f4f6', // Gris oscuro elegante
                  color: isActive ? '#ffffff' : '#4b5563',
                  borderColor: isActive ? '#111827' : '#e5e7eb',
                  boxShadow: isActive ? '0 4px 6px -1px rgba(17, 24, 39, 0.2)' : 'none',
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

      {/* 
        Lista de Productos 
        NOTA: Le pasamos la función setSelectedProduct para que la lista 
        sepa qué producto abrir al hacer clic. 
      */}
      {!loading && !error && (
        <div style={styles.productSection}>
          <ProductList 
            products={products as Product[]} 
            onProductClick={setSelectedProduct} 
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
                Página <span style={{ fontWeight: 700, color: '#111827' }}>{page}</span> de {totalPages}
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
                <img 
                  src={selectedProduct.image_url} 
                  alt={selectedProduct.name} 
                  style={styles.modalImage} 
                />
              </div>

              {/* Columna Derecha: Detalles */}
              <div style={styles.modalDetails}>
                <span style={styles.modalCategory}>{selectedProduct.category}</span>
                <h2 style={styles.modalTitle}>{selectedProduct.name}</h2>
                <p style={styles.modalPrice}>${selectedProduct.price?.toFixed(2)} MXN</p>
                
                <p style={styles.modalDescription}>
                  {selectedProduct.description || 'Descripción no disponible para este producto.'}
                </p>

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

                <a 
                  href="/quote" 
                  style={styles.modalButton}
                  onClick={(e) => {
                    // Opcional: Aquí podrías guardar el producto en un estado global (Zustand/Redux) o LocalStorage antes de ir a cotizar
                  }}
                >
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
    backgroundColor: '#e1b71f',
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
    borderTopColor: '#e1b71f',
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
    backgroundColor: 'rgba(17, 24, 39, 0.8)', // Fondo oscuro semitransparente
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // Para que aparezca sobre todo
    padding: '1rem',
    boxSizing: 'border-box',
    backdropFilter: 'blur(4px)', // Difumina ligeramente el fondo
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    maxWidth: '900px',
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
    gap: '2rem',
    padding: '2rem',
  },
  modalImageWrapper: {
    flex: '1 1 350px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '500px',
    objectFit: 'contain',
  },
  modalDetails: {
    flex: '1 1 350px',
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
    marginBottom: '1rem',
    lineHeight: 1.2,
  },
  modalPrice: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '1.5rem',
  },
  modalDescription: {
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  specsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
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
    paddingBottom: '0.5rem',
  },
  specLabel: {
    fontWeight: 600,
    color: '#374151',
  },
  specValue: {
    color: '#6b7280',
  },
  modalButton: {
    backgroundColor: '#e1b71f',
    color: '#111827',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(225, 183, 31, 0.3)',
    transition: 'transform 0.2s',
  },
};

export default Catalog;
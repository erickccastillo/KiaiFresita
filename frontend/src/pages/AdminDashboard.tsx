import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetchProducts } from '../hooks/useFetchProducts';
import SearchBar from '../components/SearchBar';


const AdminDashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  
  // Reutilizamos tu hook mágico del catálogo, pero solo pedimos la página 1 
  // (podemos traer muchos de un golpe si el buscador es bueno)
  const { products, loading, error } = useFetchProducts({
    page: 1,
    q: query,
    category: 'TODOS',
  });


  return (
    <div style={{ padding: '2rem', paddingTop: '120px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#0a2a5e', margin: 0 }}>Gestión de Productos</h2>
        
        {/* Botón para crear un nuevo producto */}
        <Link 
          to="/admin/new" 
          style={{ 
            backgroundColor: '#0a2a5e', color: 'white', padding: '0.75rem 1.5rem', 
            borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' 
          }}
        >
          + Nuevo Producto
        </Link>
      </div>


      <div style={{ marginBottom: '2rem', maxWidth: '500px' }}>
        <SearchBar 
          value={query} 
          onChange={(v) => setQuery(v)} 
        />
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '-10px' }}>
          Escribe el nombre para buscar un producto y editarlo.
        </p>
      </div>


      {loading && <p>Cargando inventario...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}


      {/* Tabla de Productos */}
      {!loading && !error && (
        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eaeaea' }}>
              <th style={{ padding: '1rem' }}>Imagen</th>
              <th style={{ padding: '1rem' }}>Nombre</th>
              <th style={{ padding: '1rem' }}>Categoría</th>
              <th style={{ padding: '1rem' }}>Color</th>
              <th style={{ padding: '1rem' }}>Material</th>
              <th style={{ padding: '1rem' }}>Medidas</th>
              <th style={{ padding: '1rem' }}>Precio</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Acción</th>
            </tr>
          </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                    <td style={{ padding: '1rem' }}>
                      <img src={product.image_url} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '1rem', color: '#666' }}>{product.category}</td>
                  <td style={{ padding: '1rem' }}>{product.color}</td>
                  <td style={{ padding: '1rem' }}>{product.material}</td>
                  <td style={{ padding: '1rem' }}>{product.medidas}</td>
                  <td style={{ padding: '1rem', color: '#0a2a5e', fontWeight: 'bold' }}>${product.price}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', verticalAlign: 'middle',}}>
                      {/* Botón que te lleva al formulario de edición con el ID dinámico */}
                      <Link
                      to={`/admin/edit/${product.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        backgroundColor: '#e1b71f',
                        color: '#0a2a5e',
                        padding: '0.75rem 1.2rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        minWidth: '110px',
                      }}
                    >
                      Editar 
                    </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


export default AdminDashboard;

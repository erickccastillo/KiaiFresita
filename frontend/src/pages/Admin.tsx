import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setIsLoading(false);
      });
  }, []);

  // Filtrado de productos en tiempo real basado en la búsqueda
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, query]);

  return (
    <div className="admin-dashboard">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ color: 'var(--verde-hoja)', margin: 0 }}>🥋 Panel de Control</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/new-sale" className="btn-rojo" style={{ textDecoration: 'none', backgroundColor: 'var(--verde-hoja)' }}>
            + Nueva Venta
          </Link>
          <Link to="/admin/new" className="btn-rojo" style={{ textDecoration: 'none' }}>
            + Nuevo Producto
          </Link>
        </div>
      </div>

  

      <div style={{ marginTop: '2rem', backgroundColor: 'var(--blanco)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--fondo)', color: '#333' }}>
            <tr>
              <th style={{ padding: '1rem', borderBottom: '2px solid var(--rojo-kiai)' }}>Producto</th>
              <th style={{ padding: '1rem', borderBottom: '2px solid var(--rojo-kiai)' }}>Precio</th>
              <th style={{ padding: '1rem', borderBottom: '2px solid var(--rojo-kiai)', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Cargando productos...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No se encontraron productos.</td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{product.name}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>${Number(product.price).toFixed(2)}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <Link 
                      to={`/admin/edit/${product.id}`} 
                      className="btn-rojo" 
                      style={{ 
                        padding: '8px 12px', 
                        fontSize: '0.9rem', 
                        textDecoration: 'none', 
                        backgroundColor: '#333' 
                      }}
                    >
                      ✏️ Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
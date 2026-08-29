import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string; 
}

export default function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
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

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const catA = a.category || 'producto';
        const catB = b.category || 'producto';

        if (catA === 'producto' && catB !== 'producto') return -1;
        if (catA !== 'producto' && catB === 'producto') return 1;
        
        return a.name.localeCompare(b.name);
      });
  }, [products, query]);

  return (
    <div className="admin-dashboard" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '0 10px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ color: 'var(--verde-hoja)', margin: 0 }}>🥋 Panel de Control</h2>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/admin/new-sale" className="btn-rojo" style={{ textDecoration: 'none', backgroundColor: 'var(--verde-hoja)', fontSize: '0.9rem', padding: '8px 12px' }}>
            + Venta
          </Link>
          <Link to="/admin/new" className="btn-rojo" style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '8px 12px' }}>
            + Producto
          </Link>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--blanco)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
          <thead style={{ backgroundColor: 'var(--fondo)', color: '#333' }}>
            <tr>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid var(--rojo-kiai)', width: '50%' }}>Producto</th>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid var(--rojo-kiai)', width: '25%' }}>Precio</th>
              <th style={{ padding: '12px 8px', borderBottom: '2px solid var(--rojo-kiai)', width: '25%', textAlign: 'center' }}>Acciones</th>
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
                  <td style={{ padding: '12px 8px', wordBreak: 'break-word' }}>
                    <div style={{ fontWeight: '500' }}>{product.name}</div>
                    <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'capitalize' }}>
                      {product.category || 'Producto base'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>${Number(product.price).toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <Link 
                      to={`/admin/edit/${product.id}`} 
                      className="btn-rojo" 
                      style={{ 
                        padding: '6px 10px', 
                        fontSize: '0.8rem', 
                        textDecoration: 'none', 
                        backgroundColor: '#333',
                        display: 'inline-block'
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
    </div>
  );
}
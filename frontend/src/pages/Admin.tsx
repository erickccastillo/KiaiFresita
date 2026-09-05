import React, { useState, useEffect, useMemo } from "react";
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
    const getApiUrl = () => {
      try {
        // @ts-ignore
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
          // @ts-ignore
          return import.meta.env.VITE_API_URL;
        }
      } catch (e) {
        // Fallback seguro
      }
      return "https://ejemplo.com/api";
    };

    const API_URL = getApiUrl();
    
    fetch(`${API_URL}/products`)
      .then(res => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        // Datos simulados de respaldo para visualización en caso de que falle la API
        setProducts([
          { id: '1', name: 'Vaso Kiai Pequeño', price: 45.00, category: 'Fresas con Crema' },
          { id: '2', name: 'Vaso Kiai Mediano', price: 65.00, category: 'Fresas con Crema' },
          { id: '3', name: 'Playera Roja', price: 250.00, category: 'Mercancía' }
        ]);
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@400;600;700&display=swap');

        :root {
          --ink: #891411;         
          --primary: #c61d0f;     
          --surface: #fef1e4;     
          --white: #ffffff;
        }

        .admin-wrapper {
          background-color: var(--surface);
          min-height: 100vh;
          font-family: "Nunito", Arial, sans-serif;
          color: var(--ink);
          padding: 2rem 0;
        }

        .btn-rojo {
          color: var(--white);
          border-radius: 9999px;
          font-weight: 700;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(137, 20, 17, 0.15);
          text-align: center;
          border: none;
          cursor: pointer;
          font-family: "Nunito", sans-serif;
        }
        .btn-rojo:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(137, 20, 17, 0.2);
          filter: brightness(1.1);
        }
      `}</style>

      <div className="admin-wrapper">
        <div className="admin-dashboard" style={{ width: '100%', maxWidth: '850px', margin: '0 auto', padding: '0 15px', boxSizing: 'border-box' }}>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ 
              color: 'var(--ink)', 
              margin: 0, 
              fontFamily: '"Fredoka", sans-serif',
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              fontSize: '2rem'
            }}>
              <img 
                src="image_fe5f4c.png" 
                alt="Kiai Fresita Logo" 
                style={{ height: '50px', width: 'auto' }} 
              />
              Panel de Control
            </h2>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/admin/new-sale" className="btn-rojo" style={{ textDecoration: 'none', backgroundColor: 'var(--primary)', padding: '0.6rem 1.2rem', display: 'inline-flex', alignItems: 'center' }}>
                + Nueva Venta
              </Link>
              <Link to="/admin/new" className="btn-rojo" style={{ textDecoration: 'none', backgroundColor: 'var(--ink)', padding: '0.6rem 1.2rem', display: 'inline-flex', alignItems: 'center' }}>
                + Nuevo Producto
              </Link>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--white)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(137, 20, 17, 0.08)', border: '2px solid rgba(137, 20, 17, 0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
              <thead style={{ backgroundColor: 'rgba(254, 241, 228, 0.5)', color: 'var(--ink)', fontFamily: '"Fredoka", sans-serif', fontSize: '1.1rem' }}>
                <tr>
                  <th style={{ padding: '1.2rem 1.5rem', borderBottom: '3px solid var(--primary)', width: '55%' }}>Producto</th>
                  <th style={{ padding: '1.2rem 1.5rem', borderBottom: '3px solid var(--primary)', width: '25%' }}>Precio</th>
                  <th style={{ padding: '1.2rem 1.5rem', borderBottom: '3px solid var(--primary)', width: '20%', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink)', opacity: 0.7, fontFamily: '"Fredoka", sans-serif', fontSize: '1.1rem' }}>
                      Cargando productos...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink)', opacity: 0.7, fontFamily: '"Fredoka", sans-serif', fontSize: '1.1rem' }}>
                      No se encontraron productos.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid rgba(137, 20, 17, 0.1)' }}>
                      <td style={{ padding: '1.2rem 1.5rem', wordBreak: 'break-word' }}>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--ink)', marginBottom: '0.2rem' }}>
                          {product.name}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', backgroundColor: 'rgba(137, 20, 17, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '999px', display: 'inline-block' }}>
                          {product.category || 'Producto base'}
                        </span>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary)' }}>
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', textAlign: 'center' }}>
                        <Link 
                          to={`/admin/edit/${product.id}`} 
                          className="btn-rojo" 
                          style={{ 
                            padding: '0.4rem 1rem', 
                            fontSize: '0.85rem', 
                            textDecoration: 'none', 
                            backgroundColor: 'var(--ink)',
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
      </div>
    </>
  );
}
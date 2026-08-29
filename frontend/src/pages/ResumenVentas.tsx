import { useEffect, useState, useMemo } from 'react';
import './Home.css'; 

interface Sale { id: string; amount: number; sale_date: string; description: string; }

export default function ResumenVentas() {
  const [allSales, setAllSales] = useState<Sale[]>([]);
  
  // Estados para los filtros
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchProduct, setSearchProduct] = useState('');

  useEffect(() => {
    // Tu backend conectado a Supabase
    fetch('http://localhost:3000/api/sales')
      .then(res => res.json())
      .then(data => setAllSales(data))
      .catch(error => console.error("Error al cargar ventas:", error));
  }, []);

  // 1. Filtrar las ventas primero
  const filteredSales = useMemo(() => {
    return allSales.filter(sale => {
      const matchStart = startDate ? sale.sale_date >= startDate : true;
      const matchEnd = endDate ? sale.sale_date <= endDate : true;
      const matchProduct = searchProduct 
        ? sale.description.toLowerCase().includes(searchProduct.toLowerCase()) 
        : true;
        
      return matchStart && matchEnd && matchProduct;
    });
  }, [allSales, startDate, endDate, searchProduct]);

  // 2. Agrupar las ventas ya filtradas por día
  const salesByDate = useMemo(() => {
    return filteredSales.reduce((acc: Record<string, Sale[]>, sale) => {
      (acc[sale.sale_date] = acc[sale.sale_date] || []).push(sale);
      return acc;
    }, {});
  }, [filteredSales]);

  return (
    <div className="home-container">
      <h2 style={{ color: 'var(--verde-hoja)', marginBottom: '1rem' }}>🥋 Resumen de Ventas</h2>
      
      {/* Panel de Filtros */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        flexWrap: 'wrap', 
        backgroundColor: 'var(--blanco)', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Buscar Producto:</label>
          <input 
            type="text" 
            placeholder="Ej. Fresas con crema..."
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Desde:</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Hasta:</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        
        {/* Botón para limpiar filtros */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button 
            onClick={() => { setStartDate(''); setEndDate(''); setSearchProduct(''); }}
            className="btn-rojo"
            style={{ backgroundColor: '#666', padding: '9px 15px' }}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Renderizado de Ventas Agrupadas */}
      {Object.keys(salesByDate).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>No se encontraron ventas con estos filtros.</p>
      ) : (
        Object.entries(salesByDate).map(([date, sales]) => (
          <div key={date} className="day-card" style={{ background: 'white', padding: '1.5rem', marginBottom: '1.5rem', borderRadius: '8px', borderLeft: '5px solid var(--rojo-kiai)' }}>
            <h3 style={{ color: 'var(--verde-hoja)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>📅 {date}</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {sales.map(s => (
                <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px dashed #eee' }}>
                  <span>{s.description}</span>
                  <strong>${Number(s.amount).toFixed(2)}</strong>
                </li>
              ))}
            </ul>
            <p style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--rojo-kiai)', fontSize: '1.2rem', marginTop: '1rem' }}>
              Total del día: ${sales.reduce((sum, s) => sum + Number(s.amount), 0).toFixed(2)}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
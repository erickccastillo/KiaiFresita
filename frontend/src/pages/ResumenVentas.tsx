import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

interface SaleItem {
  product_name: string;
  toppings: string[];
  quantity: number;
  subtotal: number;
}

interface Sale { 
  id: string; 
  total_amount: number; 
  sale_date: string; 
  items: SaleItem[];
  daily_order_number: number;
}

export default function ResumenVentas() {
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchProduct, setSearchProduct] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/sales`)
      .then(res => res.json())
      .then(data => setAllSales(data))
      .catch(error => console.error("Error al cargar ventas:", error));
  }, []);

  const filteredSales = useMemo(() => {
    return allSales.filter(sale => {
      const matchStart = startDate ? sale.sale_date >= startDate : true;
      const matchEnd = endDate ? sale.sale_date <= endDate : true;
      
      const matchProduct = searchProduct 
        ? sale.items?.some(item => 
            item.product_name.toLowerCase().includes(searchProduct.toLowerCase())
          )
        : true;
        
      return matchStart && matchEnd && matchProduct;
    });
  }, [allSales, startDate, endDate, searchProduct]);

  const salesByDate = useMemo(() => {
    return filteredSales.reduce((acc: Record<string, Sale[]>, sale) => {
      (acc[sale.sale_date] = acc[sale.sale_date] || []).push(sale);
      return acc;
    }, {});
  }, [filteredSales]);

  return (
    <div className="home-container" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '0 10px' }}>
      <h2 style={{ color: 'var(--verde-hoja)', marginBottom: '1rem' }}>🥋 Resumen de Ventas</h2>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: 'var(--blanco)', padding: '1.2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>Buscar:</label>
          <input 
            type="text" 
            placeholder="Ej. Fresas..."
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ flex: '1 1 130px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>Desde:</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ flex: '1 1 130px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>Hasta:</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
          <button 
            onClick={() => { setStartDate(''); setEndDate(''); setSearchProduct(''); }}
            className="btn-rojo"
            style={{ backgroundColor: '#666', padding: '8px 12px', width: '100%', fontSize: '0.9rem' }}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {Object.keys(salesByDate).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>No se encontraron ventas con estos filtros.</p>
      ) : (
        Object.entries(salesByDate).map(([date, sales]) => (
          <div key={date} className="day-card" style={{ background: 'white', padding: '1.2rem', marginBottom: '1.5rem', borderRadius: '8px', borderLeft: '5px solid var(--rojo-kiai)' }}>
            <h3 style={{ color: 'var(--verde-hoja)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', fontSize: '1.1rem' }}>📅 {date}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.8rem' }}>
              {sales.map(s => (
                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', padding: '0.8rem', backgroundColor: '#fafafa', borderRadius: '6px', border: '1px solid #eee', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#333' }}>Orden #{s.daily_order_number || '-'}</strong>
                    <strong style={{ color: 'var(--rojo-kiai)', fontSize: '1rem' }}>${Number(s.total_amount || 0).toFixed(2)}</strong>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: '#555', wordBreak: 'break-word' }}>
                    {s.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ') || 'Venta sin detalle'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <Link 
                      to={`/admin/ventas/${s.id}`} 
                      style={{ textDecoration: 'none', backgroundColor: '#333', color: '#fff', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-block' }}
                    >
                      👁️ Ver detalle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <p style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--rojo-kiai)', fontSize: '1.1rem', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '8px' }}>
              Total del día: ${sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0).toFixed(2)}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
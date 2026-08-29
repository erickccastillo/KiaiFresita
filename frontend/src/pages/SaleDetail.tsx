import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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
  daily_order_number: number;
  items: SaleItem[];
}

export default function SaleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/sales/${id}`)
      .then(res => res.json())
      .then(data => {
        setSale(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar la orden:', err);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar la Orden #${sale?.daily_order_number}?`);
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sales/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la venta');

      alert('Orden eliminada correctamente.');
      navigate(-1); // Regresa a la vista anterior
    } catch (error) {
      console.error(error);
      alert('Hubo un error al eliminar la orden.');
      setDeleting(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando detalles de la orden...</p>;
  if (!sale) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No se encontró la orden solicitada.</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ backgroundColor: 'var(--blanco)', borderTop: '5px solid var(--rojo-kiai)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '650px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ color: 'var(--verde-hoja)', margin: 0 }}>📋 Orden #{sale.daily_order_number}</h2>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>Fecha: {sale.sale_date}</span>
          </div>
          <Link to={-1 as any} style={{ textDecoration: 'none', color: '#555', fontSize: '0.9rem', border: '1px solid #ccc', padding: '6px 12px', borderRadius: '4px' }}>
            ← Volver
          </Link>
        </div>

        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '1rem' }}>Desglose de Productos</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
          {sale.items?.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--fondo)', borderRadius: '6px' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: '#222' }}>{item.quantity}x {item.product_name}</strong>
                {item.toppings && item.toppings.length > 0 && (
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '3px' }}>
                    + {item.toppings.join(', ')}
                  </div>
                )}
              </div>
              <strong style={{ color: 'var(--rojo-kiai)' }}>${Number(item.subtotal).toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#f9f9f9', padding: '1.2rem', borderRadius: '6px', textAlign: 'right', marginBottom: '2rem', border: '1px solid #eee' }}>
          <span style={{ fontSize: '1rem', color: '#666', marginRight: '10px' }}>Total de la venta:</span>
          <strong style={{ fontSize: '1.8rem', color: 'var(--verde-hoja)' }}>${Number(sale.total_amount).toFixed(2)}</strong>
        </div>

        <button 
          onClick={handleDelete}
          disabled={deleting}
          style={{ width: '100%', padding: '12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {deleting ? 'Eliminando...' : '🗑️ Eliminar esta Orden'}
        </button>
      </div>
    </div>
  );
}
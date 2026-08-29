import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'producto' | 'topping'>('producto');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isFetching, setIsFetching] = useState(true);

  // Cargar los datos actuales del producto
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setDescription(data.description || '');
        setPrice(data.price.toString());
        setCategory(data.category || 'producto');
        setIsFetching(false);
      })
      .catch(err => {
        console.error("Error al cargar el producto:", err);
        setIsFetching(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        method: 'PUT', // Método para actualizar
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          description, 
          price: parseFloat(price),
          category
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar el elemento');

      setStatus('success');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (isFetching) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando datos del producto...</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
      <div style={{ backgroundColor: 'var(--blanco)', borderTop: '5px solid var(--rojo-kiai)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: 'var(--verde-hoja)', marginTop: 0 }}>✏️ Editar Producto</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Categoría</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as 'producto' | 'topping')}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="producto">Producto Base</option>
              <option value="topping">Topping Extra</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Nombre</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Descripción</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Precio ($)</label>
            <input 
              type="number" 
              min="1"
              step="0.50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-rojo"
            disabled={status === 'loading'}
            style={{ padding: '12px', fontSize: '1.1rem', marginTop: '10px', backgroundColor: '#333' }}
          >
            {status === 'loading' ? 'Guardando...' : '💾 Guardar Cambios'}
          </button>
        </form>

        {status === 'success' && <div style={{ marginTop: '1rem', color: 'var(--verde-hoja)', fontWeight: 'bold', textAlign: 'center' }}>¡Actualizado con éxito!</div>}
        {status === 'error' && <div style={{ marginTop: '1rem', color: 'var(--rojo-kiai)', fontWeight: 'bold', textAlign: 'center' }}>Error al actualizar.</div>}
      </div>
    </div>
  );
}
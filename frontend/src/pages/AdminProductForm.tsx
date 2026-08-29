import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'producto' | 'topping'>('producto');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Cambio aplicado aquí:
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          description, 
          price: parseFloat(price),
          category
        }),
      });

      if (!response.ok) throw new Error('Error al registrar el elemento');

      setStatus('success');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
      <div style={{ backgroundColor: 'var(--blanco)', borderTop: '5px solid var(--rojo-kiai)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: 'var(--verde-hoja)', marginTop: 0 }}>🍓 Nuevo Registro</h2>
        
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
              placeholder="Ej. Fresas con Crema Especial"
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Descripción</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Vaso de 1 litro con doble crema, nuez y chispas."
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
              placeholder="0.00"
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-rojo"
            disabled={status === 'loading'}
            style={{ padding: '12px', fontSize: '1.1rem', marginTop: '10px' }}
          >
            {status === 'loading' ? 'Guardando...' : '🥋 Guardar Elemento'}
          </button>
        </form>

        {status === 'success' && <div style={{ marginTop: '1rem', color: 'var(--verde-hoja)', fontWeight: 'bold', textAlign: 'center' }}>¡Registro exitoso!</div>}
        {status === 'error' && <div style={{ marginTop: '1rem', color: 'var(--rojo-kiai)', fontWeight: 'bold', textAlign: 'center' }}>Error al guardar.</div>}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product { id: string; name: string; price: number; category: 'producto' | 'topping'; }
interface CartItem { id: string; baseProduct: Product; toppings: Product[]; quantity: number; subtotal: number; }

// --- SUBCOMPONENTE: Fila individual por producto ---
function ProductRow({ product, availableToppings, onAdd }: { product: Product, availableToppings: Product[], onAdd: (p: Product, q: number, t: Product[]) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const handleToggle = (toppingId: string) => {
    setSelectedToppings(prev => prev.includes(toppingId) ? prev.filter(id => id !== toppingId) : [...prev, toppingId]);
  };

  const handleAdd = () => {
    const toppings = availableToppings.filter(t => selectedToppings.includes(t.id));
    onAdd(product, quantity, toppings);
    setQuantity(1);
    setSelectedToppings([]);
  };

  const currentToppingsCost = availableToppings.filter(t => selectedToppings.includes(t.id)).reduce((sum, t) => sum + Number(t.price), 0);
  const subtotal = ((Number(product.price) + currentToppingsCost) * quantity).toFixed(2);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #eee', gap: '1rem' }}>
      <div style={{ flex: '1 1 200px' }}>
        <strong style={{ fontSize: '1.1rem', color: '#333' }}>{product.name}</strong>
        <div style={{ color: 'var(--verde-hoja)', fontWeight: 'bold' }}>${Number(product.price).toFixed(2)}</div>
      </div>
      
      {availableToppings.length > 0 && (
        <div style={{ flex: '2 1 250px', backgroundColor: 'var(--fondo)', padding: '10px', borderRadius: '5px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '5px' }}>Toppings:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {availableToppings.map(t => (
              <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedToppings.includes(t.id)} onChange={() => handleToggle(t.id)} />
                {t.name} (+${t.price})
              </label>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="number" min="1" value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))} 
          style={{ width: '60px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'center' }}
        />
        <button onClick={handleAdd} className="btn-rojo" style={{ padding: '8px 15px', backgroundColor: '#333', fontSize: '0.9rem' }}>
          🛒 Agregar (${subtotal})
        </button>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function AdminSaleForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error cargando productos", err));
  }, []);

  const baseProducts = products.filter(p => p.category === 'producto' || !p.category);
  const availableToppings = products.filter(p => p.category === 'topping');

  const addToCart = (baseProduct: Product, quantity: number, toppings: Product[]) => {
    const toppingsCost = toppings.reduce((sum, t) => sum + Number(t.price), 0);
    const subtotal = (Number(baseProduct.price) + toppingsCost) * quantity;
    
    setCart([...cart, { id: Math.random().toString(36).substr(2, 9), baseProduct, toppings, quantity, subtotal }]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;
    setStatus('loading');

    const itemsToSave = cart.map(item => ({
      product_name: item.baseProduct.name,
      toppings: item.toppings.map(t => t.name),
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    try {
      const response = await fetch('http://localhost:3000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_amount: cartTotal, items: itemsToSave }),
      });
      if (!response.ok) throw new Error('Error al registrar orden');
      setStatus('success');
      setTimeout(() => navigate('/admin/ventas'), 1500);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem', gap: '2rem' }}>
      
      {/* SECCIÓN 1: LISTA DE PRODUCTOS */}
      <div style={{ backgroundColor: 'var(--blanco)', borderTop: '5px solid var(--rojo-kiai)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '900px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: 'var(--verde-hoja)', margin: '0 0 1rem 0' }}>🍓 Catálogo de Productos</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {baseProducts.length === 0 ? <p>Cargando menú...</p> : (
            baseProducts.map(product => (
              <ProductRow 
                key={product.id} 
                product={product} 
                availableToppings={availableToppings} 
                onAdd={addToCart} 
              />
            ))
          )}
        </div>
      </div>

      {/* SECCIÓN 2: CARRITO DE LA ORDEN */}
      {cart.length > 0 && (
        <div style={{ backgroundColor: 'var(--blanco)', borderTop: '5px solid var(--verde-hoja)', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '900px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: 'var(--verde-hoja)', margin: '0 0 1rem 0' }}>📋 Resumen de la Orden</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
            {cart.map(item => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px dashed #ccc' }}>
                <div>
                  <strong>{item.quantity}x {item.baseProduct.name}</strong>
                  {item.toppings.length > 0 && (
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                      + {item.toppings.map(t => t.name).join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <strong>${item.subtotal.toFixed(2)}</strong>
                  <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} style={{ background: 'none', border: 'none', color: 'var(--rojo-kiai)', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ backgroundColor: 'var(--fondo)', padding: '1.5rem', borderRadius: '5px', textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.2rem', color: '#555' }}>Total a cobrar: </span>
            <strong style={{ fontSize: '2rem', color: 'var(--rojo-kiai)', display: 'block' }}>${cartTotal.toFixed(2)}</strong>
          </div>

          <button onClick={handleSubmitOrder} className="btn-rojo" disabled={status === 'loading'} style={{ width: '100%', padding: '15px', fontSize: '1.2rem', backgroundColor: 'var(--verde-hoja)' }}>
            {status === 'loading' ? 'Procesando...' : '🥋 Finalizar Venta'}
          </button>
        </div>
      )}
    </div>
  );
}
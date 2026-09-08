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
<>
<style>{`
.sale-page{
  background:#fef1e4;
  min-height:100vh;
  padding:24px;
}

.sale-container{
  max-width:1400px;
  margin:auto;
}

.sale-hero{
  margin-bottom:24px;
}

.sale-label{
  color:#c61d0f;
  text-transform:uppercase;
  letter-spacing:.2em;
  font-size:.8rem;
  font-weight:700;
}

.sale-title{
  margin:0;
  color:#891411;
  font-size:clamp(2.5rem,5vw,5rem);
  line-height:.9;
  font-weight:900;
}

.products-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:18px;
}

.product-card{
  background:white;
  border-radius:24px;
  padding:20px;
  box-shadow:0 10px 30px rgba(0,0,0,.05);
}

.product-name{
  font-size:1.2rem;
  font-weight:800;
  color:#891411;
}

.product-price{
  font-size:2rem;
  font-weight:900;
  color:#c61d0f;
  margin:10px 0;
}

.toppings{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin:12px 0;
}

.topping-chip{
  padding:8px 12px;
  border-radius:999px;
  background:#fef1e4;
  font-size:.85rem;
  cursor:pointer;
  border:2px solid transparent;
}

.topping-chip.active{
  border-color:#c61d0f;
  background:#fff5f2;
}

.qty-input{
  width:80px;
  text-align:center;
  padding:10px;
  border-radius:12px;
  border:1px solid #ddd;
}

.add-btn{
  width:100%;
  margin-top:12px;
  border:none;
  border-radius:14px;
  padding:12px;
  background:#891411;
  color:white;
  font-weight:700;
  cursor:pointer;
}

.add-btn:hover{
  background:#c61d0f;
}

.order-card{
  background:white;
  margin-top:24px;
  border-radius:24px;
  padding:24px;
  box-shadow:0 10px 30px rgba(0,0,0,.05);
}

.total-box{
  background:#fef1e4;
  border-radius:18px;
  padding:20px;
  text-align:center;
  margin:20px 0;
}

.total-price{
  font-size:3rem;
  font-weight:900;
  color:#c61d0f;
}

.checkout-btn{
  width:100%;
  border:none;
  border-radius:16px;
  padding:16px;
  background:#891411;
  color:white;
  font-weight:800;
  font-size:1.1rem;
  cursor:pointer;
}

.checkout-btn:hover{
  background:#c61d0f;
}

.cart-item{
  display:flex;
  justify-content:space-between;
  gap:12px;
  padding:14px 0;
  border-bottom:1px solid #eee;
}

.delete-btn{
  border:none;
  background:none;
  cursor:pointer;
  font-size:1.2rem;
}

@media(max-width:768px){

  .sale-page{
    padding:16px;
  }

  .products-grid{
    grid-template-columns:1fr;
  }

  .sale-title{
    font-size:3rem;
  }

  .total-price{
    font-size:2.5rem;
  }

}
`}</style>

<div className="sale-page">
<div className="sale-container">

<div className="sale-hero">
<div className="sale-label">
Nueva Orden
</div>

<h1 className="sale-title">
NUEVA VENTA
</h1>
</div>

<div className="products-grid">

{baseProducts.length === 0 ? (
  <p>Cargando menú...</p>
) : (
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

{cart.length > 0 && (
<div className="order-card">

<h2
style={{
marginTop:0,
color:"#891411"
}}
>
📋 Resumen
</h2>

{cart.map(item => (
<div
key={item.id}
className="cart-item"
>
<div>

<strong>
{item.quantity}x {item.baseProduct.name}
</strong>

{item.toppings.length > 0 && (
<div
style={{
fontSize:".85rem",
color:"#666",
marginTop:"4px"
}}
>
+ {item.toppings.map(t => t.name).join(", ")}
</div>
)}

</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px"
}}
>

<strong>
${item.subtotal.toFixed(2)}
</strong>

<button
className="delete-btn"
onClick={() =>
setCart(cart.filter(c => c.id !== item.id))
}
>
🗑️
</button>

</div>
</div>
))}

<div className="total-box">
<div>Total a cobrar</div>

<div className="total-price">
${cartTotal.toFixed(2)}
</div>
</div>

<button
onClick={handleSubmitOrder}
disabled={status === "loading"}
className="checkout-btn"
>
{status === "loading"
? "Procesando..."
: "🥋 Finalizar Venta"}
</button>

</div>
)}

</div>
</div>
</>
);


// --- COMPONENTE PRINCIPAL ---
export default function AdminSaleForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    // Cambio 1: Cargar catálogo desde la variable de entorno
    fetch(`${import.meta.env.VITE_API_URL}/products`)
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
      // Cambio 2: Registrar la venta en la variable de entorno
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sales`, {
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

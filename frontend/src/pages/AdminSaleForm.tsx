import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  category: "producto" | "topping";
}

interface CartItem {
  id: string;
  baseProduct: Product;
  toppings: Product[];
  quantity: number;
  subtotal: number;
}

function ProductRow({
  product,
  availableToppings,
  onAdd,
}: {
  product: Product;
  availableToppings: Product[];
  onAdd: (
    product: Product,
    quantity: number,
    toppings: Product[]
  ) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const handleToggle = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const handleAdd = () => {
    const toppings = availableToppings.filter((t) =>
      selectedToppings.includes(t.id)
    );

    onAdd(product, quantity, toppings);

    setQuantity(1);
    setSelectedToppings([]);
  };

  const currentToppingsCost = availableToppings
    .filter((t) => selectedToppings.includes(t.id))
    .reduce((sum, t) => sum + Number(t.price), 0);

  const subtotal = (
    (Number(product.price) + currentToppingsCost) *
    quantity
  ).toFixed(2);

  return (
    <div className="product-card">
      <h3 className="product-name">{product.name}</h3>

      <div className="product-price">
        ${Number(product.price).toFixed(2)}
      </div>

      {availableToppings.length > 0 && (
        <>
          <div className="section-label">
            Toppings
          </div>

          <div className="toppings">
            {availableToppings.map((topping) => (
              <button
                key={topping.id}
                type="button"
                onClick={() => handleToggle(topping.id)}
                className={`topping-chip ${
                  selectedToppings.includes(topping.id)
                    ? "active"
                    : ""
                }`}
              >
                {topping.name} (+${topping.price})
              </button>
            ))}
          </div>
        </>
      )}

      <div className="quantity-row">
        <span>Cantidad</span>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
          className="qty-input"
        />
      </div>

      <button
        className="add-btn"
        onClick={handleAdd}
      >
        🛒 Agregar · ${subtotal}
      </button>
    </div>
  );
}

export default function AdminSaleForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error(
          "Error cargando productos",
          err
        )
      );
  }, []);

  const baseProducts = products.filter(
    (p) => p.category === "producto" || !p.category
  );

  const availableToppings = products.filter(
    (p) => p.category === "topping"
  );

  const addToCart = (
    baseProduct: Product,
    quantity: number,
    toppings: Product[]
  ) => {
    const toppingsCost = toppings.reduce(
      (sum, t) => sum + Number(t.price),
      0
    );

    const subtotal =
      (Number(baseProduct.price) + toppingsCost) *
      quantity;

    setCart([
      ...cart,
      {
        id: crypto.randomUUID(),
        baseProduct,
        toppings,
        quantity,
        subtotal,
      },
    ]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;

    setStatus("loading");

    const itemsToSave = cart.map((item) => ({
      product_name: item.baseProduct.name,
      toppings: item.toppings.map((t) => t.name),
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sales`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            total_amount: cartTotal,
            items: itemsToSave,
          }),
        }
      );

      if (!response.ok)
        throw new Error(
          "Error al registrar venta"
        );

      setStatus("success");

      setTimeout(() => {
        navigate("/admin/ventas");
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        .sale-page{
          background:#fef1e4;
          width:100%;
          padding:24px;
        }

        .sale-container{
          max-width:1400px;
          margin:0 auto;
        }

        .sale-label{
          color:#c61d0f;
          text-transform:uppercase;
          letter-spacing:.2em;
          font-size:.8rem;
          font-weight:700;
        }

        .sale-title{
          margin:.3rem 0 2rem;
          color:#891411;
          font-size:clamp(2.5rem,5vw,4.5rem);
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
          box-shadow:0 8px 25px rgba(0,0,0,.05);
        }

        .product-name{
          margin:0;
          color:#891411;
          font-size:1.25rem;
          font-weight:800;
        }

        .product-price{
          margin:10px 0;
          color:#c61d0f;
          font-size:2rem;
          font-weight:900;
        }

        .section-label{
          font-size:.75rem;
          text-transform:uppercase;
          letter-spacing:.08em;
          color:#999;
          margin-bottom:10px;
        }

        .toppings{
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          margin-bottom:16px;
        }

        .topping-chip{
          border:none;
          cursor:pointer;
          padding:8px 12px;
          border-radius:999px;
          background:#fef1e4;
          font-size:.85rem;
        }

        .topping-chip.active{
          background:#891411;
          color:white;
        }

        .quantity-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-top:12px;
        }

        .qty-input{
          width:80px;
          text-align:center;
          border-radius:12px;
          border:1px solid #ddd;
          padding:10px;
        }

        .add-btn{
          width:100%;
          margin-top:15px;
          border:none;
          border-radius:14px;
          padding:13px;
          background:#891411;
          color:white;
          cursor:pointer;
          font-weight:700;
        }

        .add-btn:hover{
          background:#c61d0f;
        }

        .order-card{
          margin-top:24px;
          background:white;
          border-radius:24px;
          padding:24px;
          box-shadow:0 8px 25px rgba(0,0,0,.05);
        }

        .order-title{
          margin-top:0;
          color:#891411;
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

        .total-box{
          background:#fef1e4;
          border-radius:20px;
          padding:20px;
          margin:20px 0;
          text-align:center;
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
          font-size:1.1rem;
          font-weight:800;
          cursor:pointer;
        }

        .checkout-btn:hover{
          background:#c61d0f;
        }

        @media(max-width:768px){

          .sale-page{
            padding:16px;
          }

          .sale-title{
            font-size:3rem;
          }

          .products-grid{
            grid-template-columns:1fr;
          }

          .cart-item{
            flex-direction:column;
          }

          .total-price{
            font-size:2.5rem;
          }
        }
      `}</style>

      <div className="sale-page">
        <div className="sale-container">

          <div className="sale-label">
            Administración
          </div>

          <h1 className="sale-title">
            NUEVA VENTA
          </h1>

          <div className="products-grid">
            {baseProducts.length === 0 ? (
              <p>Cargando menú...</p>
            ) : (
              baseProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  availableToppings={
                    availableToppings
                  }
                  onAdd={addToCart}
                />
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="order-card">
              <h2 className="order-title">
                📋 Resumen de la Orden
              </h2>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                >
                  <div>
                    <strong>
                      {item.quantity}x{" "}
                      {item.baseProduct.name}
                    </strong>

                    {item.toppings.length > 0 && (
                      <div
                        style={{
                          color: "#666",
                          marginTop: "4px",
                          fontSize: ".85rem",
                        }}
                      >
                        +{" "}
                        {item.toppings
                          .map((t) => t.name)
                          .join(", ")}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <strong>
                      $
                      {item.subtotal.toFixed(
                        2
                      )}
                    </strong>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        setCart(
                          cart.filter(
                            (c) =>
                              c.id !== item.id
                          )
                        )
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
                className="checkout-btn"
                onClick={handleSubmitOrder}
                disabled={
                  status === "loading"
                }
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
}

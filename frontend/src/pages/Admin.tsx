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
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No fue posible cargar los productos.");
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const catA = a.category || "producto";
        const catB = b.category || "producto";

        if (catA === "producto" && catB !== "producto") return -1;
        if (catA !== "producto" && catB === "producto") return 1;

        return a.name.localeCompare(b.name);
      });
  }, [products, query]);

  return (
    <>
      <style>{`
.dashboard {
  min-height: 100vh;
  background: #fef1e4;
  padding: 1.25rem;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.hero {
  margin-bottom: 1.25rem;
}

.hero-label {
  color: #c61d0f;
  text-transform: uppercase;
  letter-spacing: .18em;
  font-weight: 700;
  margin-bottom: .25rem;
  font-size: .8rem;
}

.hero-title {
  font-size: clamp(2.5rem, 4.5vw, 4.5rem);
  line-height: .9;
  font-weight: 900;
  color: #891411;
  margin: 0;
}

.hero-subtitle {
  margin-top: .5rem;
  color: #666;
  font-size: .95rem;
}

.search-box {
  margin: 1.25rem 0;
}

.search-input {
  width: 100%;
  height: 56px;
  border: none;
  outline: none;
  border-radius: 999px;
  padding: 0 20px;
  font-size: .95rem;
  background: white;
  box-shadow: 0 8px 18px rgba(0,0,0,.04);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
  gap: .85rem;
  margin-bottom: 1.25rem;
}

.action-card {
  background: white;
  border-radius: 18px;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: #891411;
  transition: .2s;
  box-shadow: 0 8px 18px rgba(0,0,0,.04);
}

.action-card:hover {
  transform: translateY(-3px);
}

.action-card span {
  display: block;
  color: #999;
  font-size: .72rem;
  margin-bottom: .4rem;
  text-transform: uppercase;
}

.action-card strong {
  display: block;
  font-size: 1.2rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
  gap: .85rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 18px;
  padding: 1rem 1.25rem;
  box-shadow: 0 8px 18px rgba(0,0,0,.04);
}

.stat-number {
  font-size: clamp(2rem,3vw,3rem);
  font-weight: 900;
  color: #c61d0f;
  line-height: 1;
}

.stat-label {
  margin-top: .35rem;
  color: #777;
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: .72rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(240px,1fr));
  gap: 1rem;
}

.product-card {
  background: white;
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 8px 18px rgba(0,0,0,.04);
  transition: .2s;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-category {
  font-size: .72rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: .5rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #891411;
  margin-bottom: .75rem;
  min-height: 52px;
}

.product-price {
  font-size: 1.9rem;
  font-weight: 900;
  color: #c61d0f;
  margin-bottom: 1rem;
}

.edit-btn {
  display: block;
  text-align: center;
  background: #891411;
  color: white;
  text-decoration: none;
  padding: .75rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: .9rem;
  transition: .2s;
}

.edit-btn:hover {
  background: #c61d0f;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

.error-state {
  text-align: center;
  padding: 1rem;
  color: #c61d0f;
  font-weight: bold;
}

@media (max-width: 768px) {

  .dashboard {
    padding: .85rem;
  }

  .hero-title {
    font-size: 2.8rem;
  }

  .hero-subtitle {
    font-size: .9rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-name {
    min-height: auto;
  }
}
`}</style>


      <div className="dashboard">
        <div className="dashboard-container">

          <section className="hero">
            <div className="hero-label">Administración</div>

            <h1 className="hero-title">
              KIAI CONTROL
            </h1>

            <p className="hero-subtitle">
              Gestiona productos, ventas y catálogo desde un solo lugar.
            </p>
          </section>

          <div className="search-box">
            <input
              className="search-input"
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="action-grid">
            <Link to="/admin/new-sale" className="action-card">
              <span>Ventas</span>
              <strong>➕ Nueva Venta</strong>
            </Link>

            <Link to="/admin/new" className="action-card">
              <span>Inventario</span>
              <strong>📦 Nuevo Producto</strong>
            </Link>
          </div>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-number">{products.length}</div>
              <div className="stat-label">Productos</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">{filteredProducts.length}</div>
              <div className="stat-label">Resultados</div>
            </div>
          </div>

          {error && (
            <div className="error-state">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="loading-state">
              Cargando productos...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              No se encontraron productos.
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-category">
                    {product.category || "Producto Base"}
                  </div>

                  <div className="product-name">
                    {product.name}
                  </div>

                  <div className="product-price">
                    ${Number(product.price).toFixed(2)}
                  </div>

                  <Link
                    to={`/admin/edit/${product.id}`}
                    className="edit-btn"
                  >
                    Editar Producto
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

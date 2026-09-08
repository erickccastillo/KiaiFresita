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
          padding: 2rem;
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero {
          margin-bottom: 3rem;
        }

        .hero-label {
          color: #c61d0f;
          text-transform: uppercase;
          letter-spacing: .25em;
          font-weight: 700;
          margin-bottom: .5rem;
        }

        .hero-title {
          font-size: clamp(3rem, 9vw, 8rem);
          line-height: .85;
          font-weight: 900;
          color: #891411;
          margin: 0;
        }

        .hero-subtitle {
          margin-top: 1rem;
          color: #666;
          font-size: 1.1rem;
        }

        .search-box {
          margin: 2.5rem 0;
        }

        .search-input {
          width: 100%;
          height: 68px;
          border: none;
          outline: none;
          border-radius: 999px;
          padding: 0 24px;
          font-size: 1rem;
          background: white;
          box-shadow: 0 10px 30px rgba(0,0,0,.05);
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .action-card {
          background: white;
          border-radius: 24px;
          padding: 1.5rem;
          text-decoration: none;
          color: #891411;
          transition: .25s;
          box-shadow: 0 10px 25px rgba(0,0,0,.05);
        }

        .action-card:hover {
          transform: translateY(-4px);
        }

        .action-card span {
          display: block;
          color: #999;
          font-size: .8rem;
          margin-bottom: .5rem;
          text-transform: uppercase;
        }

        .action-card strong {
          display: block;
          font-size: 1.4rem;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,.05);
        }

        .stat-number {
          font-size: clamp(2rem,5vw,4rem);
          font-weight: 900;
          color: #c61d0f;
          line-height: 1;
        }

        .stat-label {
          margin-top: .5rem;
          color: #777;
          text-transform: uppercase;
          letter-spacing: .1em;
          font-size: .8rem;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
          gap: 1.25rem;
        }

        .product-card {
          background: white;
          border-radius: 28px;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,.05);
          transition: .25s;
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .product-category {
          font-size: .75rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-bottom: .75rem;
        }

        .product-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: #891411;
          margin-bottom: 1rem;
        }

        .product-price {
          font-size: 1.8rem;
          font-weight: 900;
          color: #c61d0f;
          margin-bottom: 1.25rem;
        }

        .edit-btn {
          display: block;
          text-align: center;
          background: #891411;
          color: white;
          text-decoration: none;
          padding: .85rem;
          border-radius: 14px;
          font-weight: 700;
          transition: .25s;
        }

        .edit-btn:hover {
          background: #c61d0f;
        }

        .empty-state,
        .loading-state {
          text-align: center;
          padding: 4rem 1rem;
          color: #666;
        }

        .error-state {
          text-align: center;
          padding: 2rem;
          color: #c61d0f;
          font-weight: bold;
        }

        @media(max-width:768px){
          .dashboard{
            padding:1rem;
          }

          .hero{
            text-align:center;
          }

          .hero-title{
            font-size:4rem;
          }
        }
      `}</style>

      <div className="dashboard">
        <div className="dashboard-container">

          <section className="hero">
            <div className="hero-label">Administración</div>

            <h1 className="hero-title">
              KIAI
              <br />
              CONTROL
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

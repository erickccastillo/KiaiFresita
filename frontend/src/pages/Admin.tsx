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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
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

  const averagePrice =
    products.length > 0
      ? products.reduce((acc, item) => acc + Number(item.price), 0) /
        products.length
      : 0;

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      {/* HERO */}

      <div
        style={{
          background:
            "linear-gradient(135deg,var(--rojo-kiai),#891411)",
          borderRadius: "28px",
          padding: "32px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "24px",
          boxShadow: "0 15px 40px rgba(0,0,0,.15)",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              opacity: 0.8,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Administración
          </p>

          <h1
            style={{
              margin: "8px 0 0",
              fontSize: "clamp(2rem,5vw,3rem)",
            }}
          >
            🥋 Panel de Control
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/admin/new-sale"
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              background: "#ffffff",
              color: "#891411",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ➕ Nueva Venta
          </Link>

          <Link
            to="/admin/new"
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              background: "rgba(255,255,255,.15)",
              border: "1px solid rgba(255,255,255,.3)",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
              backdropFilter: "blur(16px)",
            }}
          >
            📦 Nuevo Producto
          </Link>
        </div>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "22px",
            boxShadow: "0 10px 30px rgba(0,0,0,.05)",
          }}
        >
          <div style={{ color: "#888" }}>Productos</div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--rojo-kiai)",
            }}
          >
            {products.length}
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "22px",
            boxShadow: "0 10px 30px rgba(0,0,0,.05)",
          }}
        >
          <div style={{ color: "#888" }}>Resultados</div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--verde-hoja)",
            }}
          >
            {filteredProducts.length}
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "22px",
            boxShadow: "0 10px 30px rgba(0,0,0,.05)",
          }}
        >
          <div style={{ color: "#888" }}>Precio Promedio</div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#333",
            }}
          >
            ${averagePrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div
        style={{
          background: "white",
          padding: "18px",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,.05)",
          marginBottom: "24px",
        }}
      >
        <input
          type="text"
          placeholder="🔎 Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "16px 18px",
            borderRadius: "16px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            outline: "none",
          }}
        />
      </div>

      {/* DESKTOP TABLE */}

      <div
        className="desktop-table"
        style={{
          background: "white",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,.05)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#fafafa",
              }}
            >
              <th style={{ padding: "18px", textAlign: "left" }}>
                Producto
              </th>
              <th style={{ padding: "18px", textAlign: "left" }}>
                Categoría
              </th>
              <th style={{ padding: "18px", textAlign: "left" }}>
                Precio
              </th>
              <th style={{ padding: "18px", textAlign: "center" }}>
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} style={{ padding: "40px", textAlign: "center" }}>
                  Cargando productos...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "40px", textAlign: "center" }}>
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  style={{
                    borderTop: "1px solid #f0f0f0",
                  }}
                >
                  <td style={{ padding: "18px", fontWeight: 600 }}>
                    {product.name}
                  </td>

                  <td
                    style={{
                      padding: "18px",
                      textTransform: "capitalize",
                      color: "#666",
                    }}
                  >
                    {product.category || "Producto Base"}
                  </td>

                  <td
                    style={{
                      padding: "18px",
                      fontWeight: 700,
                      color: "var(--rojo-kiai)",
                    }}
                  >
                    ${Number(product.price).toFixed(2)}
                  </td>

                  <td
                    style={{
                      padding: "18px",
                      textAlign: "center",
                    }}
                  >
                    <Link
                      to={`/admin/edit/${product.id}`}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: "#333",
                        color: "white",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}

      <div className="mobile-cards">
        {!isLoading &&
          filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                background: "white",
                borderRadius: "22px",
                padding: "18px",
                marginBottom: "15px",
                boxShadow: "0 10px 25px rgba(0,0,0,.05)",
              }}
            >
              <h3
        

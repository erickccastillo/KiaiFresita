import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/sales`)
      .then((res) => res.json())
      .then((data) => setAllSales(data))
      .catch((error) =>
        console.error("Error al cargar ventas:", error)
      );
  }, []);

  const filteredSales = useMemo(() => {
    return allSales.filter((sale) => {
      const matchStart = startDate
        ? sale.sale_date >= startDate
        : true;

      const matchEnd = endDate
        ? sale.sale_date <= endDate
        : true;

      const matchProduct = searchProduct
        ? sale.items?.some((item) =>
            item.product_name
              .toLowerCase()
              .includes(searchProduct.toLowerCase())
          )
        : true;

      return matchStart && matchEnd && matchProduct;
    });
  }, [
    allSales,
    startDate,
    endDate,
    searchProduct,
  ]);

  const salesByDate = useMemo(() => {
    return filteredSales.reduce(
      (acc: Record<string, Sale[]>, sale) => {
        (acc[sale.sale_date] =
          acc[sale.sale_date] || []).push(sale);

        return acc;
      },
      {}
    );
  }, [filteredSales]);

  const totalSalesAmount = filteredSales.reduce(
    (sum, sale) =>
      sum + Number(sale.total_amount || 0),
    0
  );

  const totalDays = Object.keys(salesByDate).length;

  return (
    <>
      <style>{`
        .sales-page{
          background:#fef1e4;
          min-height:100vh;
          padding:20px;
        }

        .sales-container{
          max-width:1400px;
          margin:auto;
        }

        .sales-label{
          color:#c61d0f;
          text-transform:uppercase;
          letter-spacing:.2em;
          font-size:.8rem;
          font-weight:700;
        }

        .sales-title{
          color:#891411;
          font-size:clamp(2.5rem,5vw,4.8rem);
          line-height:.9;
          font-weight:900;
          margin:.3rem 0 1.5rem;
        }

        .filters-card{
          background:white;
          border-radius:20px;
          padding:18px;
          margin-bottom:20px;
          box-shadow:0 8px 25px rgba(0,0,0,.05);
        }

        .filters-grid{
          display:grid;
          grid-template-columns:2fr 1fr 1fr auto;
          gap:12px;
          align-items:end;
        }

        .filter-group{
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .filter-group label{
          font-size:.75rem;
          text-transform:uppercase;
          letter-spacing:.08em;
          color:#777;
        }

        .filter-input{
          height:48px;
          border:1px solid #ddd;
          border-radius:12px;
          padding:0 14px;
          background:white;
        }

        .clear-btn{
          height:48px;
          border:none;
          border-radius:12px;
          background:#666;
          color:white;
          padding:0 18px;
          cursor:pointer;
          font-weight:700;
        }

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:14px;
          margin-bottom:20px;
        }

        .stat-card{
          background:white;
          border-radius:18px;
          padding:18px;
          box-shadow:0 8px 25px rgba(0,0,0,.05);
        }

        .stat-value{
          font-size:2rem;
          font-weight:900;
          color:#c61d0f;
          line-height:1;
        }

        .stat-label{
          margin-top:8px;
          color:#888;
          font-size:.75rem;
          text-transform:uppercase;
        }

        .day-card{
          background:white;
          border-radius:24px;
          padding:20px;
          margin-bottom:20px;
          box-shadow:0 8px 25px rgba(0,0,0,.05);
        }

        .day-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          margin-bottom:16px;
          flex-wrap:wrap;
        }

        .day-title{
          font-size:1.3rem;
          font-weight:800;
          color:#891411;
        }

        .day-summary{
          background:linear-gradient(
            135deg,
            #891411,
            #c61d0f
          );

          color:white;
          padding:10px 16px;
          border-radius:14px;
          font-weight:700;
        }

        .sales-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
          gap:14px;
        }

        .sale-card{
          background:white;
          border-radius:16px;
          padding:14px;
          border:1px solid #f0f0f0;
          box-shadow:0 4px 12px rgba(0,0,0,.04);
        }

        .sale-card-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        }

        .sale-order{
          color:#891411;
          font-weight:800;
        }

        .sale-total{
          color:#c61d0f;
          font-weight:900;
          font-size:1.1rem;
        }

        .sale-products{
          color:#666;
          font-size:.9rem;
          line-height:1.45;
          min-height:48px;
        }

        .detail-btn{
          display:block;
          width:100%;
          text-align:center;
          margin-top:12px;
          text-decoration:none;
          background:#891411;
          color:white;
          padding:10px;
          border-radius:10px;
          font-size:.85rem;
          font-weight:700;
        }

        .detail-btn:hover{
          background:#c61d0f;
        }

        .day-total{
          margin-top:18px;
          padding-top:12px;
          border-top:1px solid #eee;
          text-align:right;
          font-size:1.2rem;
          font-weight:900;
          color:#c61d0f;
        }

        .empty-state{
          text-align:center;
          padding:40px 20px;
          color:#777;
        }

        @media(max-width:768px){

          .sales-page{
            padding:12px;
          }

          .sales-title{
            font-size:2.6rem;
          }

          .filters-grid{
            grid-template-columns:1fr;
          }

          .sales-grid{
            grid-template-columns:1fr;
          }

          .day-header{
            flex-direction:column;
            align-items:flex-start;
          }

          .day-summary{
            width:100%;
            text-align:center;
          }

          .stat-value{
            font-size:1.7rem;
          }
        }
      `}</style>

      <div className="sales-page">
        <div className="sales-container">

          <div className="sales-label">
            Administración
          </div>

          <h1 className="sales-title">
            RESUMEN DE VENTAS
          </h1>

          <div className="filters-card">
            <div className="filters-grid">

              <div className="filter-group">
                <label>Buscar producto</label>
                <input
                  className="filter-input"
                  type="text"
                  placeholder="Ej. Cheesecake..."
                  value={searchProduct}
                  onChange={(e) =>
                    setSearchProduct(e.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <label>Desde</label>
                <input
                  className="filter-input"
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <label>Hasta</label>
                <input
                  className="filter-input"
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                />
              </div>

              <button
                className="clear-btn"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSearchProduct("");
                }}
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-value">
                {filteredSales.length}
              </div>
              <div className="stat-label">
                Ventas
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                ${totalSalesAmount.toFixed(0)}
              </div>
              <div className="stat-label">
                Total vendido
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {totalDays}
              </div>
              <div className="stat-label">
                Días
              </div>
            </div>

          </div>

          {Object.keys(salesByDate).length === 0 ? (
            <div className="empty-state">
              No se encontraron ventas con estos filtros.
            </div>
          ) : (
            Object.entries(salesByDate).map(
              ([date, sales]) => (
                <div
                  key={date}
                  className="day-card"
                >
                  <div className="day-header">

                    <div className="day-title">
                      📅 {date}
                    </div>

                    <div className="day-summary">
                      {sales.length} órdenes
                    </div>

                  </div>

                  <div className="sales-grid">

                    {sales.map((sale) => (
                      <div
                        key={sale.id}
                        className="sale-card"
                      >
                        <div className="sale-card-header">

                          <div className="sale-order">
                            Orden #
                            {sale.daily_order_number ||
                              "-"}
                          </div>

                          <div className="sale-total">
                            $
                            {Number(
                              sale.total_amount || 0
                            ).toFixed(2)}
                          </div>

                        </div>

                        <div className="sale-products">
                          {sale.items?.map(
                            (item) =>
                              `${item.quantity}x ${item.product_name}`
                          ).join(", ") ||
                            "Venta sin detalle"}
                        </div>

                        <Link
                          to={`/admin/ventas/${sale.id}`}
                          className="detail-btn"
                        >
                          👁️ Ver detalle
                        </Link>

                      </div>
                    ))}

                  </div>

                  <div className="day-total">
                    Total del día: $
                    {sales
                      .reduce(
                        (sum, sale) =>
                          sum +
                          Number(
                            sale.total_amount || 0
                          ),
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>
              )
            )
          )}

        </div>
      </div>
    </>
  );
}

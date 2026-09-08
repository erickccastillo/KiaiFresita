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

  const [expandedDays, setExpandedDays] = useState<
    Record<string, boolean>
  >({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadSales = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/sales`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Error al cargar las ventas: ${response.status}`
          );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "La respuesta del servidor no contiene una lista de ventas."
          );
        }

        setAllSales(data as Sale[]);
      } catch (requestError) {
        if (
          requestError instanceof Error &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        console.error("Error al cargar ventas:", requestError);
        setError("No fue posible cargar las ventas.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadSales();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredSales = useMemo(() => {
    const normalizedSearch = searchProduct
      .trim()
      .toLocaleLowerCase();

    return allSales.filter((sale) => {
      const matchStart = startDate
        ? sale.sale_date >= startDate
        : true;

      const matchEnd = endDate
        ? sale.sale_date <= endDate
        : true;

      const matchProduct = normalizedSearch
        ? sale.items?.some((item) =>
            String(item.product_name || "")
              .toLocaleLowerCase()
              .includes(normalizedSearch)
          )
        : true;

      return matchStart && matchEnd && matchProduct;
    });
  }, [allSales, startDate, endDate, searchProduct]);

  const salesByDate = useMemo(() => {
    return filteredSales.reduce(
      (accumulator: Record<string, Sale[]>, sale) => {
        const date = sale.sale_date || "Sin fecha";

        if (!accumulator[date]) {
          accumulator[date] = [];
        }

        accumulator[date].push(sale);

        return accumulator;
      },
      {}
    );
  }, [filteredSales]);

  const orderedSalesByDate = useMemo(() => {
    return Object.entries(salesByDate)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, sales]): [string, Sale[]] => {
        const orderedSales = [...sales].sort(
          (saleA, saleB) =>
            Number(saleB.daily_order_number || 0) -
            Number(saleA.daily_order_number || 0)
        );

        return [date, orderedSales];
      });
  }, [salesByDate]);

  const totalSalesAmount = useMemo(() => {
    return filteredSales.reduce(
      (sum, sale) => sum + Number(sale.total_amount || 0),
      0
    );
  }, [filteredSales]);

  const totalDays = orderedSalesByDate.length;

  const hasActiveFilters =
    searchProduct.trim() !== "" ||
    startDate !== "" ||
    endDate !== "";

  const toggleDay = (date: string) => {
    setExpandedDays((previousDays) => ({
      ...previousDays,
      !previousDays[date],
    }));
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchProduct("");
  };

  return (
    <>
      <style>{`
        .sales-page,
        .sales-page * {
          box-sizing: border-box;
        }

        .sales-page {
          width: 100%;
          min-height: 100vh;
          padding: 20px;
          background: #fef1e4;
          color: #2f2927;
        }

        .sales-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .sales-label {
          color: #c61d0f;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .sales-title {
          margin: 0.3rem 0 1.5rem;
          color: #891411;
          font-size: clamp(2.5rem, 5vw, 4.8rem);
          font-weight: 900;
          line-height: 0.9;
        }

        .filters-card {
          margin-bottom: 20px;
          padding: 18px;
          background: #ffffff;
          border: 1px solid rgba(137, 20, 17, 0.06);
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(137, 20, 17, 0.06);
        }

        .filters-grid {
          display: grid;
          grid-template-columns:
            minmax(220px, 2fr)
            minmax(150px, 1fr)
            minmax(150px, 1fr)
            auto;
          gap: 12px;
          align-items: end;
        }

        .filter-group {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          color: #77706c;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .filter-input {
          width: 100%;
          height: 48px;
          padding: 0 14px;
          background: #ffffff;
          color: #332e2b;
          border: 1px solid #ded7d1;
          border-radius: 12px;
          outline: none;
          font: inherit;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .filter-input:focus {
          border-color: #c61d0f;
          box-shadow: 0 0 0 3px rgba(198, 29, 15, 0.12);
        }

        .clear-btn {
          height: 48px;
          padding: 0 18px;
          background: #625d59;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font: inherit;
          font-weight: 700;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .clear-btn:hover:not(:disabled) {
          background: #423e3b;
          transform: translateY(-1px);
        }

        .clear-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .stat-card {
          min-width: 0;
          padding: 18px;
          background: #ffffff;
          border: 1px solid rgba(137, 20, 17, 0.06);
          border-radius: 18px;
          box-shadow: 0 8px 25px rgba(137, 20, 17, 0.05);
        }

        .stat-value {
          color: #c61d0f;
          font-size: 2rem;
          font-weight: 900;
          line-height: 1;
          overflow-wrap: anywhere;
        }

        .stat-label {
          margin-top: 8px;
          color: #88817d;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .day-card {
          margin-bottom: 16px;
          padding: 0;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(137, 20, 17, 0.07);
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(137, 20, 17, 0.05);
        }

        .day-toggle {
          display: flex;
          width: 100%;
          min-height: 78px;
          padding: 16px 18px;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          background: transparent;
          color: inherit;
          border: none;
          cursor: pointer;
          text-align: left;
          font: inherit;
          transition: background 0.2s ease;
        }

        .day-toggle:hover {
          background: #fff8f1;
        }

        .day-toggle:focus-visible {
          outline: 3px solid rgba(198, 29, 15, 0.22);
          outline-offset: -3px;
        }

        .day-information {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 12px;
        }

        .day-information-text {
          display: flex;
          min-width: 0;
          flex-direction: column;
        }

        .day-calendar {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          place-items: center;
          background: #fef1e4;
          border-radius: 12px;
          font-size: 1.15rem;
        }

        .day-title {
          color: #891411;
          font-size: 1.15rem;
          font-weight: 900;
          line-height: 1.2;
        }

        .day-total-preview {
          margin-top: 4px;
          color: #716a66;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .day-summary {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          background: linear-gradient(
            135deg,
            #891411,
            #c61d0f
          );
          color: #ffffff;
          border-radius: 12px;
          font-size: 0.83rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .day-arrow {
          display: inline-block;
          font-size: 0.72rem;
          transition: transform 0.25s ease;
        }

        .day-arrow.expanded {
          transform: rotate(180deg);
        }

        .day-content {
          padding: 0 18px 18px;
          border-top: 1px solid #f0e7df;
          animation: sales-reveal 0.24s ease-out;
        }

        @keyframes sales-reveal {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sales-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fill, minmax(240px, 1fr));
          gap: 14px;
          padding-top: 16px;
        }

        .sale-card {
          display: flex;
          min-width: 0;
          flex-direction: column;
          padding: 14px;
          background: #fffdfa;
          border: 1px solid #eee4dc;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.035);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .sale-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(137, 20, 17, 0.08);
        }

        .sale-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .sale-order {
          color: #891411;
          font-weight: 900;
        }

        .sale-total {
          flex: 0 0 auto;
          color: #c61d0f;
          font-size: 1.1rem;
          font-weight: 900;
        }

        .sale-products {
          min-height: 48px;
          color: #625d59;
          font-size: 0.88rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .detail-btn {
          display: block;
          width: 100%;
          margin-top: auto;
          padding: 10px;
          background: #891411;
          color: #ffffff;
          border-radius: 10px;
          text-align: center;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 800;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .detail-btn:hover {
          background: #c61d0f;
          transform: translateY(-1px);
        }

        .day-total {
          margin-top: 16px;
          padding: 14px 16px;
          background: #fef1e4;
          color: #891411;
          border-radius: 14px;
          text-align: right;
          font-size: 1.1rem;
          font-weight: 900;
        }

        .feedback-state {
          padding: 38px 20px;
          background: #ffffff;
          color: #706965;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
        }

        .feedback-state.error {
          color: #891411;
          border: 1px solid rgba(198, 29, 15, 0.18);
        }

        @media (max-width: 900px) {
          .filters-grid {
            grid-template-columns: 1fr 1fr;
          }

          .filter-group:first-child {
            grid-column: 1 / -1;
          }

          .clear-btn {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .sales-page {
            min-height: auto;
            padding: 12px;
          }

          .sales-title {
            margin-bottom: 1rem;
            font-size: 2.6rem;
          }

          .filters-card {
            padding: 14px;
            border-radius: 16px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .filter-group:first-child {
            grid-column: auto;
          }

          .stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
          }

          .stat-card {
            padding: 12px 10px;
            border-radius: 14px;
          }

          .stat-value {
            font-size: clamp(1.15rem, 5vw, 1.65rem);
          }

          .stat-label {
            font-size: 0.65rem;
          }

          .day-card {
            border-radius: 16px;
          }

          .day-toggle {
            min-height: 70px;
            padding: 12px;
          }

          .day-information {
            gap: 9px;
          }

          .day-calendar {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
            border-radius: 10px;
            font-size: 1rem;
          }

          .day-title {
            font-size: 0.98rem;
          }

          .day-total-preview {
            font-size: 0.74rem;
          }

          .day-summary {
            padding: 8px 9px;
            gap: 6px;
            font-size: 0.72rem;
          }

          .day-content {
            padding: 0 12px 12px;
          }

          .sales-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            padding-top: 12px;
          }

          .sale-card {
            padding: 12px;
          }

          .sale-products {
            min-height: auto;
          }

          .day-total {
            font-size: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 420px) {
          .day-toggle {
            align-items: flex-start;
          }

          .day-summary {
            flex-direction: column;
            gap: 2px;
            text-align: center;
          }

          .day-arrow {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .day-content,
          .day-arrow,
          .sale-card,
          .detail-btn,
          .clear-btn {
            animation: none;
            transition: none;
          }
        }
      `}</style>

      <main className="sales-page">
        <div className="sales-container">
          <div className="sales-label">
            Administración
          </div>

          <h1 className="sales-title">
            RESUMEN DE VENTAS
          </h1>

          <section
            className="filters-card"
            aria-label="Filtros de ventas"
          >
            <div className="filters-grid">
              <div className="filter-group">
                <label htmlFor="sales-product-search">
                  Buscar producto
                </label>

                <input
                  id="sales-product-search"
                  className="filter-input"
                  type="search"
                  placeholder="Ej. Cheesecake..."
                  value={searchProduct}
                  onChange={(event) =>
                    setSearchProduct(event.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <label htmlFor="sales-start-date">
                  Desde
                </label>

                <input
                  id="sales-start-date"
                  className="filter-input"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) =>
                    setStartDate(event.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <label htmlFor="sales-end-date">
                  Hasta
                </label>

                <input
                  id="sales-end-date"
                  className="filter-input"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) =>
                    setEndDate(event.target.value)
                  }
                />
              </div>

              <button
                type="button"
                className="clear-btn"
                disabled={!hasActiveFilters}
                onClick={clearFilters}
              >
                Limpiar
              </button>
            </div>
          </section>

          <section
            className="stats-grid"
            aria-label="Resumen general de ventas"
          >
            <article className="stat-card">
              <div className="stat-value">
                {filteredSales.length}
              </div>

              <div className="stat-label">
                Ventas
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-value">
                ${totalSalesAmount.toFixed(2)}
              </div>

              <div className="stat-label">
                Total vendido
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-value">
                {totalDays}
              </div>

              <div className="stat-label">
                Días
              </div>
            </article>
          </section>

          {isLoading ? (
            <div
              className="feedback-state"
              role="status"
            >
              Cargando ventas...
            </div>
          ) : error ? (
            <div
              className="feedback-state error"
              role="alert"
            >
              {error}
            </div>
          ) : orderedSalesByDate.length === 0 ? (
            <div className="feedback-state">
              No se encontraron ventas con estos filtros.
            </div>
          ) : (
            orderedSalesByDate.map(([date, sales]) => {
              const isExpanded =
                Boolean(expandedDays[date]);

              const dayTotal = sales.reduce(
                (sum, sale) =>
                  sum + Number(sale.total_amount || 0),
                0
              );

              const contentId = `sales-day-${date.replace(
                /[^a-zA-Z0-9_-]/g,
                "-"
              )}`;

              return (
                <section
                  key={date}
                  className="day-card"
                >
                  <button
                    type="button"
                    className="day-toggle"
                    aria-expanded={isExpanded}
                    aria-controls={contentId}
                    onClick={() => toggleDay(date)}
                  >
                    <span className="day-information">
                      <span
                        className="day-calendar"
                        aria-hidden="true"
                      >
                        📅
                      </span>

                      <span className="day-information-text">
                        <span className="day-title">
                          {date}
                        </span>

                        <span className="day-total-preview">
                          Total del día: $
                          {dayTotal.toFixed(2)}
                        </span>
                      </span>
                    </span>

                    <span className="day-summary">
                      <span>
                        {sales.length}{" "}
                        {sales.length === 1
                          ? "orden"
                          : "órdenes"}
                      </span>

                      <span>
                        {isExpanded
                          ? "Ocultar"
                          : "Ver"}
                      </span>

                      <span
                        className={`day-arrow ${
                          isExpanded
                            ? "expanded"
                            : ""
                        }`}
                        aria-hidden="true"
                      >
                        ▼
                      </span>
                    </span>
                  </button>

                  {isExpanded && (
                    <div
                      id={contentId}
                      className="day-content"
                    >
                      <div className="sales-grid">
                        {sales.map((sale) => (
                          <article
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
                              {sale.items?.length
                                ? sale.items
                                    .map(
                                      (item) =>
                                        `${item.quantity}x ${item.product_name}`
                                    )
                                    .join(", ")
                                : "Venta sin detalle"}
                            </div>

                            <Link
                              to={`/admin/ventas/${sale.id}`}
                              className="detail-btn"
                            >
                              Ver detalle
                            </Link>
                          </article>
                        ))}
                      </div>

                      <div className="day-total">
                        Total del día: $
                        {dayTotal.toFixed(2)}
                      </div>
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}

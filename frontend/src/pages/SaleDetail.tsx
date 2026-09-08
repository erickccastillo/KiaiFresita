import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  daily_order_number: number;
  items: SaleItem[];
}

export default function SaleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadSale = async () => {
      if (!id) {
        setError("No se recibió el identificador de la orden.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/sales/${id}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("No se encontró la orden solicitada.");
          }

          throw new Error(
            `No fue posible cargar la orden. Código ${response.status}.`
          );
        }

        const data: Sale = await response.json();

        setSale(data);
      } catch (requestError) {
        if (
          requestError instanceof Error &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        console.error("Error al cargar la orden:", requestError);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar la orden."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSale();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleDelete = async () => {
    if (!sale || !id || deleting) {
      return;
    }

    const confirmDelete = window.confirm(
      `¿Estás seguro de eliminar la Orden #${sale.daily_order_number}? Esta acción no se puede deshacer.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/sales/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error al eliminar la venta. Código ${response.status}.`
        );
      }

      window.alert("Orden eliminada correctamente.");

      navigate("/admin/ventas", {
        replace: true,
      });
    } catch (deleteError) {
      console.error("Error al eliminar la orden:", deleteError);

      setError(
        "Hubo un error al eliminar la orden. Inténtalo nuevamente."
      );

      setDeleting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const itemsCount =
    sale?.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    ) ?? 0;

  return (
    <>
      <style>{`
        .sale-detail-page,
        .sale-detail-page * {
          box-sizing: border-box;
        }

        .sale-detail-page {
          width: 100%;
          min-height: 100vh;
          padding: 20px;
          background: #fef1e4;
          color: #2f2927;
        }

        .sale-detail-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .sale-detail-label {
          color: #c61d0f;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .sale-detail-title {
          margin: 0.3rem 0 1.4rem;
          color: #891411;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 900;
          line-height: 0.9;
        }

        .sale-detail-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.75fr);
          gap: 18px;
          align-items: start;
        }

        .sale-detail-card {
          min-width: 0;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(137, 20, 17, 0.07);
          border-radius: 22px;
          box-shadow: 0 10px 30px rgba(137, 20, 17, 0.06);
        }

        .sale-detail-header {
          display: flex;
          padding: 20px;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: linear-gradient(
            135deg,
            rgba(254, 241, 228, 0.8),
            rgba(255, 255, 255, 0.95)
          );
          border-bottom: 1px solid #f0e5db;
        }

        .sale-detail-order-wrapper {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 12px;
        }

        .sale-detail-icon {
          display: grid;
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          place-items: center;
          background: #891411;
          color: #ffffff;
          border-radius: 14px;
          font-size: 1.25rem;
        }

        .sale-detail-order {
          margin: 0;
          color: #891411;
          font-size: clamp(1.3rem, 3vw, 1.8rem);
          font-weight: 900;
          line-height: 1.1;
        }

        .sale-detail-date {
          display: block;
          margin-top: 5px;
          color: #746d69;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .back-btn {
          flex: 0 0 auto;
          padding: 9px 13px;
          background: #ffffff;
          color: #5d5753;
          border: 1px solid #ded6cf;
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-size: 0.84rem;
          font-weight: 800;
          transition:
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }

        .back-btn:hover {
          color: #891411;
          border-color: #891411;
          transform: translateY(-1px);
        }

        .sale-items-section {
          padding: 20px;
        }

        .sale-items-heading {
          display: flex;
          margin-bottom: 14px;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .sale-items-title {
          margin: 0;
          color: #3b3532;
          font-size: 1rem;
          font-weight: 900;
        }

        .item-count {
          padding: 6px 10px;
          background: #fef1e4;
          color: #891411;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 900;
        }

        .sale-items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sale-item {
          display: flex;
          padding: 13px 14px;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: #fffaf5;
          border: 1px solid #f0e4da;
          border-radius: 14px;
        }

        .sale-item-information {
          min-width: 0;
        }

        .sale-item-name {
          color: #312c29;
          font-size: 0.96rem;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        .sale-item-quantity {
          display: inline-grid;
          min-width: 28px;
          height: 28px;
          margin-right: 7px;
          place-items: center;
          background: #891411;
          color: #ffffff;
          border-radius: 8px;
          font-size: 0.76rem;
          font-weight: 900;
          vertical-align: middle;
        }

        .sale-item-toppings {
          margin-top: 6px;
          color: #77706c;
          font-size: 0.82rem;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .sale-item-price {
          flex: 0 0 auto;
          color: #c61d0f;
          font-size: 1rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .no-items {
          padding: 25px 16px;
          background: #fffaf5;
          color: #77706c;
          border: 1px dashed #d9cec5;
          border-radius: 14px;
          text-align: center;
        }

        .sale-summary-card {
          position: sticky;
          top: 110px;
          padding: 18px;
          background: #ffffff;
          border: 1px solid rgba(137, 20, 17, 0.07);
          border-radius: 22px;
          box-shadow: 0 10px 30px rgba(137, 20, 17, 0.06);
        }

        .summary-heading {
          margin: 0 0 14px;
          color: #891411;
          font-size: 0.8rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .summary-information {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #6d6662;
          font-size: 0.88rem;
        }

        .summary-row strong {
          color: #3b3532;
          font-weight: 900;
        }

        .total-box {
          padding: 20px 16px;
          background: linear-gradient(
            135deg,
            #891411,
            #c61d0f
          );
          color: #ffffff;
          border-radius: 18px;
          text-align: center;
          box-shadow: 0 10px 20px rgba(137, 20, 17, 0.16);
        }

        .total-label {
          display: block;
          margin-bottom: 6px;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.85;
        }

        .total-value {
          display: block;
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 900;
          line-height: 1;
          overflow-wrap: anywhere;
        }

        .delete-section {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid #eee4dc;
        }

        .delete-help {
          margin: 0 0 10px;
          color: #89817c;
          font-size: 0.74rem;
          line-height: 1.4;
          text-align: center;
        }

        .delete-btn {
          width: 100%;
          min-height: 46px;
          padding: 10px 14px;
          background: #ffffff;
          color: #b2202e;
          border: 1px solid rgba(178, 32, 46, 0.3);
          border-radius: 12px;
          cursor: pointer;
          font: inherit;
          font-size: 0.86rem;
          font-weight: 900;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .delete-btn:hover:not(:disabled) {
          background: #b2202e;
          color: #ffffff;
          border-color: #b2202e;
          transform: translateY(-1px);
        }

        .delete-btn:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .detail-feedback {
          width: 100%;
          max-width: 700px;
          margin: 30px auto;
          padding: 32px 20px;
          background: #ffffff;
          color: #706965;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
        }

        .detail-feedback.error {
          color: #891411;
          border: 1px solid rgba(198, 29, 15, 0.18);
        }

        .feedback-back-btn {
          display: inline-block;
          margin-top: 16px;
          padding: 10px 15px;
          background: #891411;
          color: #ffffff;
          border: none;
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-weight: 800;
        }

        @media (max-width: 780px) {
          .sale-detail-page {
            min-height: auto;
            padding: 12px;
          }

          .sale-detail-title {
            margin-bottom: 1rem;
            font-size: 2.5rem;
          }

          .sale-detail-layout {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .sale-detail-card,
          .sale-summary-card {
            border-radius: 17px;
          }

          .sale-summary-card {
            position: static;
            order: -1;
            padding: 14px;
          }

          .summary-information {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
          }

          .summary-row {
            min-width: 0;
            padding: 9px;
            flex-direction: column;
            align-items: flex-start;
            gap: 3px;
            background: #fff8f1;
            border-radius: 10px;
            font-size: 0.72rem;
          }

          .summary-row strong {
            font-size: 0.82rem;
            overflow-wrap: anywhere;
          }

          .total-box {
            padding: 16px;
            border-radius: 14px;
          }

          .total-value {
            font-size: 2.45rem;
          }

          .sale-detail-header {
            padding: 14px;
          }

          .sale-detail-icon {
            width: 40px;
            height: 40px;
            flex-basis: 40px;
            border-radius: 11px;
            font-size: 1rem;
          }

          .sale-detail-order {
            font-size: 1.2rem;
          }

          .sale-detail-date {
            font-size: 0.76rem;
          }

          .back-btn {
            padding: 8px 10px;
            font-size: 0.76rem;
          }

          .sale-items-section {
            padding: 14px;
          }

          .sale-item {
            padding: 11px;
          }

          .sale-item-name {
            font-size: 0.9rem;
          }

          .sale-item-toppings {
            font-size: 0.76rem;
          }

          .sale-item-price {
            font-size: 0.92rem;
          }
        }

        @media (max-width: 440px) {
          .sale-detail-header {
            align-items: flex-start;
          }

          .sale-detail-order-wrapper {
            gap: 8px;
          }

          .sale-detail-icon {
            display: none;
          }

          .summary-information {
            grid-template-columns: 1fr 1fr;
          }

          .summary-row:last-child {
            grid-column: 1 / -1;
          }

          .sale-item {
            align-items: flex-start;
          }

          .sale-item-price {
            padding-top: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .back-btn,
          .delete-btn,
          .sale-item {
            transition: none;
          }
        }
      `}</style>

      <main className="sale-detail-page">
        <div className="sale-detail-container">
          <div className="sale-detail-label">
            Administración
          </div>

          <h1 className="sale-detail-title">
            DETALLE DE VENTA
          </h1>

          {loading ? (
            <div
              className="detail-feedback"
              role="status"
            >
              Cargando detalles de la orden...
            </div>
          ) : error && !sale ? (
            <div
              className="detail-feedback error"
              role="alert"
            >
              <div>{error}</div>

              <button
                type="button"
                className="feedback-back-btn"
                onClick={handleBack}
              >
                ← Volver
              </button>
            </div>
          ) : !sale ? (
            <div className="detail-feedback">
              <div>
                No se encontró la orden solicitada.
              </div>

              <button
                type="button"
                className="feedback-back-btn"
                onClick={handleBack}
              >
                ← Volver
              </button>
            </div>
          ) : (
            <div className="sale-detail-layout">
              <section className="sale-detail-card">
                <header className="sale-detail-header">
                  <div className="sale-detail-order-wrapper">
                    <div
                      className="sale-detail-icon"
                      aria-hidden="true"
                    >
                      📋
                    </div>

                    <div>
                      <h2 className="sale-detail-order">
                        Orden #
                        {sale.daily_order_number || "-"}
                      </h2>

                      <span className="sale-detail-date">
                        Fecha: {sale.sale_date}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="back-btn"
                    onClick={handleBack}
                  >
                    ← Volver
                  </button>
                </header>

                <div className="sale-items-section">
                  <div className="sale-items-heading">
                    <h3 className="sale-items-title">
                      Desglose de productos
                    </h3>

                    <span className="item-count">
                      {itemsCount}{" "}
                      {itemsCount === 1
                        ? "producto"
                        : "productos"}
                    </span>
                  </div>

                  {!sale.items?.length ? (
                    <div className="no-items">
                      Esta venta no contiene productos registrados.
                    </div>
                  ) : (
                    <div className="sale-items-list">
                      {sale.items.map((item, index) => (
                        <article
                          key={`${item.product_name}-${index}`}
                          className="sale-item"
                        >
                          <div className="sale-item-information">
                            <div className="sale-item-name">
                              <span className="sale-item-quantity">
                                {item.quantity}x
                              </span>

                              {item.product_name}
                            </div>

                            {item.toppings?.length > 0 && (
                              <div className="sale-item-toppings">
                                + {item.toppings.join(", ")}
                              </div>
                            )}
                          </div>

                          <strong className="sale-item-price">
                            $
                            {Number(
                              item.subtotal || 0
                            ).toFixed(2)}
                          </strong>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <aside className="sale-summary-card">
                <h2 className="summary-heading">
                  Resumen de la orden
                </h2>

                <div className="summary-information">
                  <div className="summary-row">
                    <span>Número</span>

                    <strong>
                      #{sale.daily_order_number || "-"}
                    </strong>
                  </div>

                  <div className="summary-row">
                    <span>Fecha</span>

                    <strong>{sale.sale_date}</strong>
                  </div>

                  <div className="summary-row">
                    <span>Productos</span>

                    <strong>{itemsCount}</strong>
                  </div>
                </div>

                <div className="total-box">
                  <span className="total-label">
                    Total de la venta
                  </span>

                  <strong className="total-value">
                    $
                    {Number(
                      sale.total_amount || 0
                    ).toFixed(2)}
                  </strong>
                </div>

                {error && (
                  <div
                    className="detail-feedback error"
                    role="alert"
                    style={{
                      margin: "14px 0 0",
                      padding: "12px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="delete-section">
                  <p className="delete-help">
                    Eliminar la orden también la retirará del
                    resumen de ventas.
                  </p>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting
                      ? "Eliminando orden..."
                      : "🗑️ Eliminar esta orden"}
                  </button>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

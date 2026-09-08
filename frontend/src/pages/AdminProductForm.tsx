import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type ProductCategory = "producto" | "topping";
type FormStatus = "idle" | "loading" | "success" | "error";

export default function AdminProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] =
    useState<ProductCategory>("producto");
  const [status, setStatus] =
    useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const isLoading = status === "loading";

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedDescription = description.trim();
    const parsedPrice = Number(price);

    if (!normalizedName) {
      setStatus("error");
      setErrorMessage("Escribe el nombre del elemento.");
      return;
    }

    if (!normalizedDescription) {
      setStatus("error");
      setErrorMessage("Escribe una descripción.");
      return;
    }

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0
    ) {
      setStatus("error");
      setErrorMessage(
        "Escribe un precio válido mayor que cero."
      );
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: normalizedName,
            description: normalizedDescription,
            price: parsedPrice,
            category,
          }),
        }
      );

      if (!response.ok) {
        let serverMessage = "";

        try {
          const errorData = await response.json();

          serverMessage =
            errorData?.message ||
            errorData?.error ||
            "";
        } catch {
          serverMessage = "";
        }

        throw new Error(
          serverMessage ||
            `No fue posible guardar el elemento. Código ${response.status}.`
        );
      }

      setStatus("success");

      window.setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error("Error al guardar el elemento:", error);

      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar el elemento."
      );
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <style>{`
        .product-form-page,
        .product-form-page * {
          box-sizing: border-box;
        }

        .product-form-page {
          width: 100%;
          min-height: 100vh;
          padding: 20px;
          background: #fef1e4;
          color: #302a27;
        }

        .product-form-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }

        .product-form-label {
          color: #c61d0f;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .product-form-title {
          margin: 0.3rem 0 1.4rem;
          color: #891411;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 900;
          line-height: 0.9;
        }

        .product-form-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.45fr)
            minmax(260px, 0.75fr);
          gap: 18px;
          align-items: start;
        }

        .product-form-card {
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(137, 20, 17, 0.07);
          border-radius: 22px;
          box-shadow:
            0 10px 30px rgba(137, 20, 17, 0.06);
        }

        .product-form-card-header {
          display: flex;
          padding: 18px 20px;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          background: linear-gradient(
            135deg,
            rgba(254, 241, 228, 0.9),
            rgba(255, 255, 255, 0.96)
          );
          border-bottom: 1px solid #f0e5db;
        }

        .product-form-heading-wrapper {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 12px;
        }

        .product-form-icon {
          display: grid;
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          place-items: center;
          background: #891411;
          color: #ffffff;
          border-radius: 13px;
          font-size: 1.15rem;
        }

        .product-form-heading {
          margin: 0;
          color: #891411;
          font-size: 1.25rem;
          font-weight: 900;
          line-height: 1.15;
        }

        .product-form-subtitle {
          display: block;
          margin-top: 4px;
          color: #77706c;
          font-size: 0.8rem;
          line-height: 1.3;
        }

        .product-back-btn {
          flex: 0 0 auto;
          padding: 9px 13px;
          background: #ffffff;
          color: #5d5753;
          border: 1px solid #ded6cf;
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-size: 0.82rem;
          font-weight: 800;
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .product-back-btn:hover {
          color: #891411;
          border-color: #891411;
          transform: translateY(-1px);
        }

        .product-form {
          display: flex;
          padding: 20px;
          flex-direction: column;
          gap: 17px;
        }

        .product-form-row {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(150px, 0.45fr);
          gap: 14px;
        }

        .product-field {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 7px;
        }

        .product-field-label {
          color: #514b47;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .product-required {
          color: #c61d0f;
        }

        .product-input,
        .product-select,
        .product-textarea {
          width: 100%;
          background: #fffdfa;
          color: #302a27;
          border: 1px solid #ded5ce;
          border-radius: 12px;
          outline: none;
          font: inherit;
          font-size: 0.92rem;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .product-input,
        .product-select {
          height: 46px;
          padding: 0 13px;
        }

        .product-textarea {
          min-height: 105px;
          padding: 12px 13px;
          line-height: 1.45;
          resize: vertical;
        }

        .product-input:hover,
        .product-select:hover,
        .product-textarea:hover {
          border-color: #cabbaf;
        }

        .product-input:focus,
        .product-select:focus,
        .product-textarea:focus {
          background: #ffffff;
          border-color: #c61d0f;
          box-shadow:
            0 0 0 3px rgba(198, 29, 15, 0.12);
        }

        .product-input:disabled,
        .product-select:disabled,
        .product-textarea:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .product-field-help {
          color: #8d8580;
          font-size: 0.73rem;
          line-height: 1.35;
        }

        .price-field-wrapper {
          position: relative;
        }

        .price-symbol {
          position: absolute;
          top: 50%;
          left: 13px;
          color: #891411;
          font-weight: 900;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .product-price-input {
          padding-left: 29px;
        }

        .category-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .category-option {
          position: relative;
          display: block;
          cursor: pointer;
        }

        .category-option input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .category-option-content {
          display: flex;
          min-height: 74px;
          padding: 12px;
          align-items: center;
          gap: 10px;
          background: #fffaf5;
          border: 1px solid #eadfd6;
          border-radius: 13px;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .category-option:hover
        .category-option-content {
          border-color: #d8bbae;
          transform: translateY(-1px);
        }

        .category-option input:checked
        + .category-option-content {
          background: #fef1e4;
          border-color: #c61d0f;
          box-shadow:
            0 0 0 2px rgba(198, 29, 15, 0.09);
        }

        .category-option input:focus-visible
        + .category-option-content {
          outline: 3px solid rgba(198, 29, 15, 0.2);
          outline-offset: 2px;
        }

        .category-icon {
          display: grid;
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          place-items: center;
          background: #ffffff;
          border-radius: 10px;
          font-size: 1rem;
        }

        .category-name {
          display: block;
          color: #891411;
          font-size: 0.87rem;
          font-weight: 900;
        }

        .category-description {
          display: block;
          margin-top: 2px;
          color: #7a726d;
          font-size: 0.7rem;
          line-height: 1.25;
        }

        .product-submit-btn {
          width: 100%;
          min-height: 50px;
          margin-top: 2px;
          padding: 11px 16px;
          background: linear-gradient(
            135deg,
            #891411,
            #c61d0f
          );
          color: #ffffff;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font: inherit;
          font-size: 0.95rem;
          font-weight: 900;
          box-shadow:
            0 9px 18px rgba(137, 20, 17, 0.16);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .product-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 12px 22px rgba(137, 20, 17, 0.22);
        }

        .product-submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .product-status {
          padding: 11px 13px;
          border-radius: 11px;
          text-align: center;
          font-size: 0.82rem;
          font-weight: 800;
          line-height: 1.4;
        }

        .product-status.success {
          background: #edf8ef;
          color: #26703a;
          border: 1px solid #cce9d2;
        }

        .product-status.error {
          background: #fff0f0;
          color: #a82834;
          border: 1px solid #f0c9cc;
        }

        .product-preview {
          position: sticky;
          top: 110px;
          padding: 18px;
          background: #ffffff;
          border: 1px solid rgba(137, 20, 17, 0.07);
          border-radius: 22px;
          box-shadow:
            0 10px 30px rgba(137, 20, 17, 0.06);
        }

        .preview-label {
          margin-bottom: 13px;
          color: #891411;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.11em;
        }

        .preview-card {
          overflow: hidden;
          background: #fffaf5;
          border: 1px solid #efe1d6;
          border-radius: 18px;
        }

        .preview-accent {
          height: 7px;
          background: linear-gradient(
            90deg,
            #891411,
            #c61d0f
          );
        }

        .preview-content {
          padding: 18px;
        }

        .preview-category {
          display: inline-flex;
          padding: 6px 9px;
          background: #fef1e4;
          color: #891411;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .preview-name {
          margin: 13px 0 7px;
          color: #891411;
          font-size: 1.25rem;
          font-weight: 900;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .preview-description {
          min-height: 48px;
          margin: 0 0 17px;
          color: #756d68;
          font-size: 0.8rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .preview-price {
          color: #c61d0f;
          font-size: 2.1rem;
          font-weight: 900;
          line-height: 1;
        }

        .preview-help {
          margin: 13px 0 0;
          color: #8e8580;
          font-size: 0.72rem;
          line-height: 1.4;
          text-align: center;
        }

        @media (max-width: 780px) {
          .product-form-page {
            min-height: auto;
            padding: 12px;
          }

          .product-form-title {
            margin-bottom: 1rem;
            font-size: 2.5rem;
          }

          .product-form-layout {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .product-form-card,
          .product-preview {
            border-radius: 17px;
          }

          .product-preview {
            position: static;
            order: -1;
            padding: 13px;
          }

          .preview-label,
          .preview-help,
          .preview-description {
            display: none;
          }

          .preview-card {
            border-radius: 14px;
          }

          .preview-accent {
            height: 5px;
          }

          .preview-content {
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              auto;
            padding: 13px;
            align-items: center;
            gap: 5px 12px;
          }

          .preview-category {
            width: fit-content;
            padding: 5px 8px;
          }

          .preview-name {
            grid-column: 1;
            margin: 2px 0 0;
            font-size: 1rem;
          }

          .preview-price {
            grid-column: 2;
            grid-row: 1 / span 2;
            font-size: 1.5rem;
          }

          .product-form-card-header {
            padding: 14px;
          }

          .product-form-icon {
            width: 39px;
            height: 39px;
            flex-basis: 39px;
            border-radius: 11px;
            font-size: 1rem;
          }

          .product-form-heading {
            font-size: 1.1rem;
          }

          .product-form-subtitle {
            font-size: 0.74rem;
          }

          .product-form {
            padding: 14px;
            gap: 15px;
          }

          .product-form-row {
            grid-template-columns: 1fr;
          }

          .product-textarea {
            min-height: 88px;
          }
        }

        @media (max-width: 440px) {
          .product-form-card-header {
            align-items: flex-start;
          }

          .product-form-icon {
            display: none;
          }

          .product-back-btn {
            padding: 8px 10px;
            font-size: 0.76rem;
          }

          .category-options {
            grid-template-columns: 1fr;
          }

          .category-option-content {
            min-height: 62px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-back-btn,
          .product-input,
          .product-select,
          .product-textarea,
          .category-option-content,
          .product-submit-btn {
            transition: none;
          }
        }
      `}</style>

      <main className="product-form-page">
        <div className="product-form-container">
          <div className="product-form-label">
            Administración
          </div>

          <h1 className="product-form-title">
            NUEVO REGISTRO
          </h1>

          <div className="product-form-layout">
            <section className="product-form-card">
              <header className="product-form-card-header">
                <div className="product-form-heading-wrapper">
                  <div
                    className="product-form-icon"
                    aria-hidden="true"
                  >
                    🍓
                  </div>

                  <div>
                    <h2 className="product-form-heading">
                      Crear elemento
                    </h2>

                    <span className="product-form-subtitle">
                      Agrega un producto base o un topping al
                      catálogo.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="product-back-btn"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  ← Volver
                </button>
              </header>

              <form
                className="product-form"
                onSubmit={handleSubmit}
              >
                <fieldset
                  className="product-field"
                  disabled={isLoading}
                  style={{
                    margin: 0,
                    padding: 0,
                    border: "none",
                  }}
                >
                  <legend className="product-field-label">
                    Categoría{" "}
                    <span className="product-required">
                      *
                    </span>
                  </legend>

                  <div className="category-options">
                    <label className="category-option">
                      <input
                        type="radio"
                        name="category"
                        value="producto"
                        checked={category === "producto"}
                        onChange={() =>
                          setCategory("producto")
                        }
                      />

                      <span className="category-option-content">
                        <span
                          className="category-icon"
                          aria-hidden="true"
                        >
                          🍓
                        </span>

                        <span>
                          <span className="category-name">
                            Producto base
                          </span>

                          <span className="category-description">
                            Producto principal para una venta
                          </span>
                        </span>
                      </span>
                    </label>

                    <label className="category-option">
                      <input
                        type="radio"
                        name="category"
                        value="topping"
                        checked={category === "topping"}
                        onChange={() =>
                          setCategory("topping")
                        }
                      />

                      <span className="category-option-content">
                        <span
                          className="category-icon"
                          aria-hidden="true"
                        >
                          ✨
                        </span>

                        <span>
                          <span className="category-name">
                            Topping extra
                          </span>

                          <span className="category-description">
                            Complemento que aumenta el precio
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                </fieldset>

                <div className="product-form-row">
                  <div className="product-field">
                    <label
                      className="product-field-label"
                      htmlFor="product-name"
                    >
                      Nombre{" "}
                      <span className="product-required">
                        *
                      </span>
                    </label>

                    <input
                      id="product-name"
                      className="product-input"
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder={
                        category === "producto"
                          ? "Ej. Fresas con crema especial"
                          : "Ej. Nutella"
                      }
                      maxLength={100}
                      autoComplete="off"
                      disabled={isLoading}
                      required
                    />

                    <span className="product-field-help">
                      {name.length}/100 caracteres
                    </span>
                  </div>

                  <div className="product-field">
                    <label
                      className="product-field-label"
                      htmlFor="product-price"
                    >
                      Precio{" "}
                      <span className="product-required">
                        *
                      </span>
                    </label>

                    <div className="price-field-wrapper">
                      <span className="price-symbol">$</span>

                      <input
                        id="product-price"
                        className="product-input product-price-input"
                        type="number"
                        min="0.01"
                        step="0.50"
                        inputMode="decimal"
                        value={price}
                        onChange={(event) =>
                          setPrice(event.target.value)
                        }
                        placeholder="0.00"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <span className="product-field-help">
                      Precio en pesos mexicanos
                    </span>
                  </div>
                </div>

                <div className="product-field">
                  <label
                    className="product-field-label"
                    htmlFor="product-description"
                  >
                    Descripción{" "}
                    <span className="product-required">
                      *
                    </span>
                  </label>

                  <textarea
                    id="product-description"
                    className="product-textarea"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder={
                      category === "producto"
                        ? "Ej. Vaso de un litro con doble crema, nuez y chispas."
                        : "Ej. Porción adicional para complementar el producto."
                    }
                    maxLength={300}
                    disabled={isLoading}
                    required
                  />

                  <span className="product-field-help">
                    {description.length}/300 caracteres
                  </span>
                </div>

                {status === "success" && (
                  <div
                    className="product-status success"
                    role="status"
                  >
                    Registro guardado correctamente. Regresando
                    al panel...
                  </div>
                )}

                {status === "error" && (
                  <div
                    className="product-status error"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="product-submit-btn"
                  disabled={
                    isLoading || status === "success"
                  }
                >
                  {isLoading
                    ? "Guardando registro..."
                    : status === "success"
                      ? "Registro guardado"
                      : "Guardar elemento"}
                </button>
              </form>
            </section>

            <aside
              className="product-preview"
              aria-label="Vista previa del elemento"
            >
              <div className="preview-label">
                Vista previa
              </div>

              <div className="preview-card">
                <div className="preview-accent" />

                <div className="preview-content">
                  <span className="preview-category">
                    {category === "producto"
                      ? "Producto base"
                      : "Topping extra"}
                  </span>

                  <h2 className="preview-name">
                    {name.trim() ||
                      (category === "producto"
                        ? "Nombre del producto"
                        : "Nombre del topping")}
                  </h2>

                  <p className="preview-description">
                    {description.trim() ||
                      "La descripción del elemento aparecerá aquí."}
                  </p>

                  <div className="preview-price">
                    $
                    {price &&
                    Number.isFinite(Number(price))
                      ? Number(price).toFixed(2)
                      : "0.00"}
                  </div>
                </div>
              </div>

              <p className="preview-help">
                Esta vista se actualiza automáticamente mientras
                completas el formulario.
              </p>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

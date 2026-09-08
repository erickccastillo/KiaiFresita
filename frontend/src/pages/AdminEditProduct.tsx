import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

type ProductCategory = "producto" | "topping";
type FormStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: ProductCategory;
}

export default function AdminEditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] =
    useState<ProductCategory>("producto");

  const [status, setStatus] =
    useState<FormStatus>("idle");
  const [isFetching, setIsFetching] =
    useState(true);
  const [fetchError, setFetchError] =
    useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  const isSaving = status === "loading";

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      if (!id) {
        setFetchError(
          "No se recibió el identificador del producto."
        );
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        setFetchError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${id}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "No se encontró el producto solicitado."
            );
          }

          throw new Error(
            `No fue posible cargar el producto. Código ${response.status}.`
          );
        }

        const data: Product =
          await response.json();

        setName(data.name || "");
        setDescription(
          data.description || ""
        );
        setPrice(
          data.price !== undefined &&
            data.price !== null
            ? String(data.price)
            : ""
        );
        setCategory(
          data.category === "topping"
            ? "topping"
            : "producto"
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Error al cargar el producto:",
          error
        );

        setFetchError(
          error instanceof Error
            ? error.message
            : "No fue posible cargar el producto."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsFetching(false);
        }
      }
    };

    loadProduct();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id || isSaving) {
      return;
    }

    const normalizedName = name.trim();
    const normalizedDescription =
      description.trim();
    const parsedPrice = Number(price);

    if (!normalizedName) {
      setStatus("error");
      setErrorMessage(
        "Escribe el nombre del elemento."
      );
      return;
    }

    if (!normalizedDescription) {
      setStatus("error");
      setErrorMessage(
        "Escribe una descripción."
      );
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
        `${import.meta.env.VITE_API_URL}/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: normalizedName,
            description:
              normalizedDescription,
            price: parsedPrice,
            category,
          }),
        }
      );

      if (!response.ok) {
        let serverMessage = "";

        try {
          const errorData =
            await response.json();

          serverMessage =
            errorData?.message ||
            errorData?.error ||
            "";
        } catch {
          serverMessage = "";
        }

        throw new Error(
          serverMessage ||
            `No fue posible actualizar el elemento. Código ${response.status}.`
        );
      }

      setStatus("success");

      window.setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (error) {
      console.error(
        "Error al actualizar el elemento:",
        error
      );

      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar el elemento."
      );
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <style>{`
        .edit-product-page,
        .edit-product-page * {
          box-sizing: border-box;
        }

        .edit-product-page {
          width: 100%;
          min-height: 100vh;
          padding: 20px;
          background: #fef1e4;
          color: #302a27;
        }

        .edit-product-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }

        .edit-product-label {
          color: #c61d0f;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .edit-product-title {
          margin: 0.3rem 0 1.4rem;
          color: #891411;
          font-size: clamp(
            2.5rem,
            5vw,
            4.5rem
          );
          font-weight: 900;
          line-height: 0.9;
        }

        .edit-product-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.45fr)
            minmax(260px, 0.75fr);
          gap: 18px;
          align-items: start;
        }

        .edit-product-card {
          min-width: 0;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid
            rgba(137, 20, 17, 0.07);
          border-radius: 22px;
          box-shadow:
            0 10px 30px
            rgba(137, 20, 17, 0.06);
        }

        .edit-card-header {
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

        .edit-heading-wrapper {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 12px;
        }

        .edit-heading-icon {
          display: grid;
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          place-items: center;
          background: #891411;
          color: #ffffff;
          border-radius: 13px;
          font-size: 1.1rem;
        }

        .edit-heading {
          margin: 0;
          color: #891411;
          font-size: 1.25rem;
          font-weight: 900;
          line-height: 1.15;
        }

        .edit-subtitle {
          display: block;
          margin-top: 4px;
          color: #77706c;
          font-size: 0.8rem;
          line-height: 1.3;
        }

        .edit-back-btn {
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

        .edit-back-btn:hover:not(:disabled) {
          color: #891411;
          border-color: #891411;
          transform: translateY(-1px);
        }

        .edit-back-btn:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .edit-form {
          display: flex;
          padding: 20px;
          flex-direction: column;
          gap: 17px;
        }

        .edit-form-row {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(150px, 0.45fr);
          gap: 14px;
        }

        .edit-field {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 7px;
        }

        .edit-field-label {
          color: #514b47;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .edit-required {
          color: #c61d0f;
        }

        .edit-input,
        .edit-textarea {
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

        .edit-input {
          height: 46px;
          padding: 0 13px;
        }

        .edit-textarea {
          min-height: 105px;
          padding: 12px 13px;
          line-height: 1.45;
          resize: vertical;
        }

        .edit-input:hover,
        .edit-textarea:hover {
          border-color: #cabbaf;
        }

        .edit-input:focus,
        .edit-textarea:focus {
          background: #ffffff;
          border-color: #c61d0f;
          box-shadow:
            0 0 0 3px
            rgba(198, 29, 15, 0.12);
        }

        .edit-input:disabled,
        .edit-textarea:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .edit-field-help {
          color: #8d8580;
          font-size: 0.73rem;
          line-height: 1.35;
        }

        .edit-price-wrapper {
          position: relative;
        }

        .edit-price-symbol {
          position: absolute;
          top: 50%;
          left: 13px;
          color: #891411;
          font-weight: 900;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .edit-price-input {
          padding-left: 29px;
        }

        .edit-category-fieldset {
          min-width: 0;
          margin: 0;
          padding: 0;
          border: none;
        }

        .edit-category-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 7px;
        }

        .edit-category-option {
          position: relative;
          display: block;
          cursor: pointer;
        }

        .edit-category-option input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .edit-category-content {
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

        .edit-category-option:hover
        .edit-category-content {
          border-color: #d8bbae;
          transform: translateY(-1px);
        }

        .edit-category-option
        input:checked
        + .edit-category-content {
          background: #fef1e4;
          border-color: #c61d0f;
          box-shadow:
            0 0 0 2px
            rgba(198, 29, 15, 0.09);
        }

        .edit-category-option
        input:focus-visible
        + .edit-category-content {
          outline: 3px solid
            rgba(198, 29, 15, 0.2);
          outline-offset: 2px;
        }

        .edit-category-icon {
          display: grid;
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          place-items: center;
          background: #ffffff;
          border-radius: 10px;
          font-size: 1rem;
        }

        .edit-category-name {
          display: block;
          color: #891411;
          font-size: 0.87rem;
          font-weight: 900;
        }

        .edit-category-description {
          display: block;
          margin-top: 2px;
          color: #7a726d;
          font-size: 0.7rem;
          line-height: 1.25;
        }

        .edit-status {
          padding: 11px 13px;
          border-radius: 11px;
          text-align: center;
          font-size: 0.82rem;
          font-weight: 800;
          line-height: 1.4;
        }

        .edit-status.success {
          background: #edf8ef;
          color: #26703a;
          border: 1px solid #cce9d2;
        }

        .edit-status.error {
          background: #fff0f0;
          color: #a82834;
          border: 1px solid #f0c9cc;
        }

        .edit-submit-btn {
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
            0 9px 18px
            rgba(137, 20, 17, 0.16);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .edit-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 12px 22px
            rgba(137, 20, 17, 0.22);
        }

        .edit-submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .edit-preview {
          position: sticky;
          top: 110px;
          padding: 18px;
          background: #ffffff;
          border: 1px solid
            rgba(137, 20, 17, 0.07);
          border-radius: 22px;
          box-shadow:
            0 10px 30px
            rgba(137, 20, 17, 0.06);
        }

        .edit-preview-label {
          margin-bottom: 13px;
          color: #891411;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.11em;
        }

        .edit-preview-card {
          overflow: hidden;
          background: #fffaf5;
          border: 1px solid #efe1d6;
          border-radius: 18px;
        }

        .edit-preview-accent {
          height: 7px;
          background: linear-gradient(
            90deg,
            #891411,
            #c61d0f
          );
        }

        .edit-preview-content {
          padding: 18px;
        }

        .edit-preview-category {
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

        .edit-preview-name {
          margin: 13px 0 7px;
          color: #891411;
          font-size: 1.25rem;
          font-weight: 900;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .edit-preview-description {
          min-height: 48px;
          margin: 0 0 17px;
          color: #756d68;
          font-size: 0.8rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .edit-preview-price {
          color: #c61d0f;
          font-size: 2.1rem;
          font-weight: 900;
          line-height: 1;
        }

        .edit-preview-help {
          margin: 13px 0 0;
          color: #8e8580;
          font-size: 0.72rem;
          line-height: 1.4;
          text-align: center;
        }

        .edit-feedback {
          width: 100%;
          max-width: 700px;
          margin: 30px auto;
          padding: 32px 20px;
          background: #ffffff;
          color: #706965;
          border-radius: 20px;
          text-align: center;
          box-shadow:
            0 8px 25px
            rgba(0, 0, 0, 0.04);
        }

        .edit-feedback.error {
          color: #891411;
          border: 1px solid
            rgba(198, 29, 15, 0.18);
        }

        .edit-feedback-btn {
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
          .edit-product-page {
            min-height: auto;
            padding: 12px;
          }

          .edit-product-title {
            margin-bottom: 1rem;
            font-size: 2.5rem;
          }

          .edit-product-layout {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .edit-product-card,
          .edit-preview {
            border-radius: 17px;
          }

          .edit-preview {
            position: static;
            order: -1;
            padding: 13px;
          }

          .edit-preview-label,
          .edit-preview-help,
          .edit-preview-description {
            display: none;
          }

          .edit-preview-card {
            border-radius: 14px;
          }

          .edit-preview-accent {
            height: 5px;
          }

          .edit-preview-content {
            display: grid;
            grid-template-columns:
              minmax(0, 1fr)
              auto;
            padding: 13px;
            align-items: center;
            gap: 5px 12px;
          }

          .edit-preview-category {
            width: fit-content;
            padding: 5px 8px;
          }

          .edit-preview-name {
            grid-column: 1;
            margin: 2px 0 0;
            font-size: 1rem;
          }

          .edit-preview-price {
            grid-column: 2;
            grid-row: 1 / span 2;
            font-size: 1.5rem;
          }

          .edit-card-header {
            padding: 14px;
          }

          .edit-heading-icon {
            width: 39px;
            height: 39px;
            flex-basis: 39px;
            border-radius: 11px;
            font-size: 1rem;
          }

          .edit-heading {
            font-size: 1.1rem;
          }

          .edit-subtitle {
            font-size: 0.74rem;
          }

          .edit-form {
            padding: 14px;
            gap: 15px;
          }

          .edit-form-row {
            grid-template-columns: 1fr;
          }

          .edit-textarea {
            min-height: 88px;
          }
        }

        @media (max-width: 440px) {
          .edit-card-header {
            align-items: flex-start;
          }

          .edit-heading-icon {
            display: none;
          }

          .edit-back-btn {
            padding: 8px 10px;
            font-size: 0.76rem;
          }

          .edit-category-options {
            grid-template-columns: 1fr;
          }

          .edit-category-content {
            min-height: 62px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .edit-back-btn,
          .edit-input,
          .edit-textarea,
          .edit-category-content,
          .edit-submit-btn {
            transition: none;
          }
        }
      `}</style>

      <main className="edit-product-page">
        <div className="edit-product-container">
          <div className="edit-product-label">
            Administración
          </div>

          <h1 className="edit-product-title">
            EDITAR REGISTRO
          </h1>

          {isFetching ? (
            <div
              className="edit-feedback"
              role="status"
            >
              Cargando datos del producto...
            </div>
          ) : fetchError ? (
            <div
              className="edit-feedback error"
              role="alert"
            >
              <div>{fetchError}</div>

              <button
                type="button"
                className="edit-feedback-btn"
                onClick={handleBack}
              >
                ← Volver
              </button>
            </div>
          ) : (
            <div className="edit-product-layout">
              <section className="edit-product-card">
                <header className="edit-card-header">
                  <div className="edit-heading-wrapper">
                    <div
                      className="edit-heading-icon"
                      aria-hidden="true"
                    >
                      ✏️
                    </div>

                    <div>
                      <h2 className="edit-heading">
                        Editar elemento
                      </h2>

                      <span className="edit-subtitle">
                        Actualiza los datos del producto o
                        topping seleccionado.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="edit-back-btn"
                    onClick={handleBack}
                    disabled={isSaving}
                  >
                    ← Volver
                  </button>
                </header>

                <form
                  className="edit-form"
                  onSubmit={handleSubmit}
                >
                  <fieldset
                    className="edit-category-fieldset"
                    disabled={isSaving}
                  >
                    <legend className="edit-field-label">
                      Categoría{" "}
                      <span className="edit-required">
                        *
                      </span>
                    </legend>

                    <div className="edit-category-options">
                      <label className="edit-category-option">
                        <input
                          type="radio"
                          name="category"
                          value="producto"
                          checked={
                            category === "producto"
                          }
                          onChange={() => {
                            setCategory("producto");
                            setStatus("idle");
                          }}
                        />

                        <span className="edit-category-content">
                          <span
                            className="edit-category-icon"
                            aria-hidden="true"
                          >
                            🍓
                          </span>

                          <span>
                            <span className="edit-category-name">
                              Producto base
                            </span>

                            <span className="edit-category-description">
                              Producto principal para una venta
                            </span>
                          </span>
                        </span>
                      </label>

                      <label className="edit-category-option">
                        <input
                          type="radio"
                          name="category"
                          value="topping"
                          checked={
                            category === "topping"
                          }
                          onChange={() => {
                            setCategory("topping");
                            setStatus("idle");
                          }}
                        />

                        <span className="edit-category-content">
                          <span
                            className="edit-category-icon"
                            aria-hidden="true"
                          >
                            ✨
                          </span>

                          <span>
                            <span className="edit-category-name">
                              Topping extra
                            </span>

                            <span className="edit-category-description">
                              Complemento que aumenta el precio
                            </span>
                          </span>
                        </span>
                      </label>
                    </div>
                  </fieldset>

                  <div className="edit-form-row">
                    <div className="edit-field">
                      <label
                        className="edit-field-label"
                        htmlFor="edit-product-name"
                      >
                        Nombre{" "}
                        <span className="edit-required">
                          *
                        </span>
                      </label>

                      <input
                        id="edit-product-name"
                        className="edit-input"
                        type="text"
                        value={name}
                        onChange={(event) => {
                          setName(event.target.value);
                          setStatus("idle");
                        }}
                        placeholder={
                          category === "producto"
                            ? "Ej. Fresas con crema especial"
                            : "Ej. Nutella"
                        }
                        maxLength={100}
                        autoComplete="off"
                        disabled={isSaving}
                        required
                      />

                      <span className="edit-field-help">
                        {name.length}/100 caracteres
                      </span>
                    </div>

                    <div className="edit-field">
                      <label
                        className="edit-field-label"
                        htmlFor="edit-product-price"
                      >
                        Precio{" "}
                        <span className="edit-required">
                          *
                        </span>
                      </label>

                      <div className="edit-price-wrapper">
                        <span className="edit-price-symbol">
                          $
                        </span>

                        <input
                          id="edit-product-price"
                          className="edit-input edit-price-input"
                          type="number"
                          min="0.01"
                          step="0.50"
                          inputMode="decimal"
                          value={price}
                          onChange={(event) => {
                            setPrice(
                              event.target.value
                            );
                            setStatus("idle");
                          }}
                          placeholder="0.00"
                          disabled={isSaving}
                          required
                        />
                      </div>

                      <span className="edit-field-help">
                        Precio en pesos mexicanos
                      </span>
                    </div>
                  </div>

                  <div className="edit-field">
                    <label
                      className="edit-field-label"
                      htmlFor="edit-product-description"
                    >
                      Descripción{" "}
                      <span className="edit-required">
                        *
                      </span>
                    </label>

                    <textarea
                      id="edit-product-description"
                      className="edit-textarea"
                      value={description}
                      onChange={(event) => {
                        setDescription(
                          event.target.value
                        );
                        setStatus("idle");
                      }}
                      placeholder={
                        category === "producto"
                          ? "Ej. Vaso de un litro con doble crema, nuez y chispas."
                          : "Ej. Porción adicional para complementar el producto."
                      }
                      maxLength={300}
                      disabled={isSaving}
                      required
                    />

                    <span className="edit-field-help">
                      {description.length}/300 caracteres
                    </span>
                  </div>

                  {status === "success" && (
                    <div
                      className="edit-status success"
                      role="status"
                    >
                      Elemento actualizado correctamente.
                      Regresando al panel...
                    </div>
                  )}

                  {status === "error" && (
                    <div
                      className="edit-status error"
                      role="alert"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="edit-submit-btn"
                    disabled={
                      isSaving ||
                      status === "success"
                    }
                  >
                    {isSaving
                      ? "Guardando cambios..."
                      : status === "success"
                        ? "Cambios guardados"
                        : "Guardar cambios"}
                  </button>
                </form>
              </section>

              <aside
                className="edit-preview"
                aria-label="Vista previa del elemento"
              >
                <div className="edit-preview-label">
                  Vista previa
                </div>

                <div className="edit-preview-card">
                  <div className="edit-preview-accent" />

                  <div className="edit-preview-content">
                    <span className="edit-preview-category">
                      {category === "producto"
                        ? "Producto base"
                        : "Topping extra"}
                    </span>

                    <h2 className="edit-preview-name">
                      {name.trim() ||
                        (category === "producto"
                          ? "Nombre del producto"
                          : "Nombre del topping")}
                    </h2>

                    <p className="edit-preview-description">
                      {description.trim() ||
                        "La descripción del elemento aparecerá aquí."}
                    </p>

                    <div className="edit-preview-price">
                      $
                      {price !== "" &&
                      Number.isFinite(
                        Number(price)
                      )
                        ? Number(price).toFixed(2)
                        : "0.00"}
                    </div>
                  </div>
                </div>

                <p className="edit-preview-help">
                  La vista previa se actualiza
                  automáticamente con los cambios.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

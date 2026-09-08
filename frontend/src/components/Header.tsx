import { Link } from "react-router-dom";
import logo from "../images/logo.png";

export default function Header() {
  return (
    <>
      <style>{`
        .kiai-header {
  position: sticky;
  top: 0;
  z-index: 100;

  display: flex;
  width: 100%;
  height: 82px;
  min-height: 82px;
  padding: 8px 24px;

  align-items: center;
  justify-content: space-between;
  gap: 16px;

  overflow: hidden;

  background: rgba(254, 241, 228, 0.96);
  border-bottom: 3px solid #891411;
  box-shadow: 0 4px 16px rgba(137, 20, 17, 0.08);

  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.kiai-header-logo-link {
  display: flex;
  width: 170px;
  height: 62px;
  flex: 0 0 170px;

  align-items: center;
  justify-content: flex-start;

  overflow: hidden;
  text-decoration: none;
}

.kiai-header-logo {
  display: block !important;

  width: 100% !important;
  height: 100% !important;
  max-width: 170px !important;
  max-height: 62px !important;

  object-fit: contain !important;
  object-position: left center;

  transition: transform 0.2s ease;
}

.kiai-header-logo-link:hover .kiai-header-logo {
  transform: scale(1.03);
}

        .kiai-header-navigation {
          display: flex;
          min-width: 0;

          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .kiai-header-link {
          display: inline-flex;
          min-height: 42px;
          padding: 9px 18px;

          align-items: center;
          justify-content: center;

          border: 1px solid transparent;
          border-radius: 999px;

          color: #fef1e4;

          font-family:
            "Nunito",
            Arial,
            Helvetica,
            sans-serif;

          font-size: 0.9rem;
          font-weight: 800;
          line-height: 1.1;
          text-align: center;
          text-decoration: none;
          white-space: nowrap;

          box-shadow:
            0 5px 12px
            rgba(137, 20, 17, 0.14);

          transition:
            background-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .kiai-header-link-admin {
          background-color: #891411;
        }

        .kiai-header-link-sales {
          background-color: #c61d0f;
        }

        .kiai-header-link:hover {
          color: #ffffff;

          box-shadow:
            0 8px 16px
            rgba(137, 20, 17, 0.2);

          transform: translateY(-1px);
        }

        .kiai-header-link-admin:hover {
          background-color: #a41612;
        }

        .kiai-header-link-sales:hover {
          background-color: #dd281a;
        }

        .kiai-header-link:focus-visible,
        .kiai-header-logo-link:focus-visible {
          outline: 3px solid rgba(198, 29, 15, 0.3);
          outline-offset: 3px;
        }

       @media (max-width: 600px) {
  .kiai-header {
    height: 76px;
    min-height: 76px;
    padding: 7px 12px;
    gap: 10px;
  }

  .kiai-header-logo-link {
    width: 118px;
    height: 52px;
    flex-basis: 118px;
  }

  .kiai-header-logo {
    max-width: 118px !important;
    max-height: 52px !important;
  }

  .kiai-header-navigation {
    display: grid;
    min-width: 0;
    flex: 1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
  }

  .kiai-header-link {
    min-width: 0;
    min-height: 36px;
    padding: 6px 8px;
    font-size: 0.7rem;
    white-space: normal;
  }
}

@media (max-width: 390px) {
  .kiai-header {
    height: auto;
    min-height: 70px;
    padding: 7px 10px;
  }

  .kiai-header-logo-link {
    width: 96px;
    height: 46px;
    flex-basis: 96px;
  }

  .kiai-header-logo {
    max-width: 96px !important;
    max-height: 46px !important;
  }

  .kiai-header-link {
    min-height: 34px;
    padding: 5px 6px;
    font-size: 0.64rem;
  }
}

        @media (prefers-reduced-motion: reduce) {
          .kiai-header-logo,
          .kiai-header-link {
            transition: none;
          }
        }
      `}</style>

      <header className="kiai-header">
        <Link
          to="/"
          className="kiai-header-logo-link"
          aria-label="Ir al inicio de Kiai Fresita"
        >
          <img
src={logo}
alt="Kiai Fresita"
            />
        </Link>

        <nav
          className="kiai-header-navigation"
          aria-label="Navegación administrativa"
        >
          <Link
            to="/admin"
            className="kiai-header-link kiai-header-link-admin"
          >
            Panel Admin
          </Link>

          <Link
            to="/admin/ventas"
            className="kiai-header-link kiai-header-link-sales"
          >
            Resumen Ventas
          </Link>
        </nav>
      </header>
    </>
  );
}

import { Link } from "react-router-dom";
import logo from "../images/logo.png";

export default function Header() {
  return (
    <>
      <style>{`
        .kiai-header,
        .kiai-header * {
          box-sizing: border-box;
        }

        .kiai-header {
          position: sticky;
          top: 0;
          z-index: 100;

          display: flex;
          width: 100%;
          min-height: 88px;
          padding: 10px 24px;

          align-items: center;
          justify-content: space-between;
          gap: 18px;

          background: rgba(254, 241, 228, 0.96);
          border-bottom: 3px solid #891411;

          box-shadow: 0 4px 16px rgba(137, 20, 17, 0.08);

          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .kiai-header-logo-link {
          display: inline-flex;
          flex: 0 0 auto;

          align-items: center;
          justify-content: center;

          border-radius: 12px;

          color: inherit;
          text-decoration: none;
        }

        .kiai-header-logo {
  display: block;
  width: auto;
  height: 52px;
  max-width: 140px;
  object-fit: contain;
  transition: transform 0.2s ease;
}

        .kiai-header-logo-link:hover .kiai-header-logo {
          transform: scale(1.04);
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
            min-height: auto;
            padding: 9px 14px;
            gap: 10px;
          }

          .kiai-header-logo {
            height: 54px;
          }

          .kiai-header-navigation {
            display: grid;
            flex: 1 1 auto;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 8px;
          }

          .kiai-header-link {
            min-width: 0;
            min-height: 38px;
            padding: 7px 9px;

            font-size: 0.76rem;
            white-space: normal;
          }
        }

        @media (max-width: 390px) {
          .kiai-header {
            padding: 8px 10px;
            gap: 8px;
          }


@media (max-width: 390px) {
  .kiai-header-logo {
    height: 38px;
    max-width: 95px;
  }
}

          .kiai-header-navigation {
            gap: 6px;
          }

          .kiai-header-link {
            min-height: 36px;
            padding: 6px;

            font-size: 0.68rem;
          }
        }

        @media (max-width: 330px) {
          .kiai-header {
            align-items: flex-start;
          }

          .kiai-header-logo {
            height: 44px;
          }

          .kiai-header-navigation {
            grid-template-columns: 1fr;
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

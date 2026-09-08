import logo from "../images/logo.png";

export default function Header() {
  return (
    <header className="sticky top-0 left-0 w-full z-50 px-6 py-3 bg-[#fef1e4]/95 backdrop-blur-md border-b-[3px] border-[#891411] shadow-sm flex flex-wrap justify-between items-center gap-4 box-border">
      <a
        href="/"
        className="group flex items Fresita Logo"
          classwrap font-['Nunito',sans-serif]">
        <a
          href="/admin"
          className="header-navigation-link px-5 py-2 text-[#fef1e4] font-bold rounded-full shadow hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm sm:text-base bgnsition-all hover:-translate-y-0.5 text-sm sm:text-base bg-[#c61d0f] hover:brightness-110 no-underline100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .header-navigation-link {
            display: flex;
            min-width: 0;
            padding: 9px 8px;
            align-items: center;
            justify-content: center;
            font-size: 0.78rem;
            text-align: center;
            white-space: nowrap;
          }
        }

        @media (max-width: 350px) {
          .header-navigation {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </header>
  );
}

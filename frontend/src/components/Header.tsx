export default function Header() {
  return (
    <header className="relative w-screen m-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] z-20 px-6 py-4 bg-white/40 backdrop-blur-md border-b-[3px] border-[#4CAF50] shadow-sm flex flex-wrap justify-between items-center gap-4">
      {}
      <a href="/" className="group flex items-center gap-2 no-underline">
        <h1 className="font-extrabold text-2xl md:text-3xl tracking-tighter m-0 transition-transform group-hover:scale-105 text-[#E63946]">
          🍓🥋 Kiai Fresita
        </h1>
      </a>
      
      {}
      {/* Navegación (Botones Admin) */}
      <nav className="flex gap-3 flex-wrap">
        <a 
          href="/admin" 
          className="px-5 py-2 text-white font-semibold rounded-full shadow hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm sm:text-base bg-gray-800 hover:bg-gray-700 no-underline"
        >
          Panel Admin
        </a>
        <a 
          href="/admin/ventas" 
          className="px-5 py-2 text-white font-semibold rounded-full shadow hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm sm:text-base hover:brightness-110 no-underline bg-[#E63946]"
        >
          Resumen Ventas
        </a>
      </nav>
    </header>
  );
}
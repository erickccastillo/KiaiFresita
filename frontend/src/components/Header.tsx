import React from 'react';
import logo from '../images/logo.png';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 px-6 py-3 bg-[#fef1e4]/80 backdrop-blur-md border-b-[3px] border-[#891411] shadow-sm flex flex-wrap justify-between items-center gap-4 box-border">
      <a href="/" className="group flex items-center gap-2 no-underline">
        <img 
          src={logo}
          alt="Kiai Fresita Logo" 
          className="h-14 md:h-16 w-auto transition-transform group-hover:scale-105"
        />
      </a>
      
      <nav className="flex gap-3 flex-wrap font-['Nunito',sans-serif]">
        <a 
          href="/admin" 
          className="px-5 py-2 text-[#fef1e4] font-bold rounded-full shadow hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm sm:text-base bg-[#891411] hover:bg-[#c61d0f] no-underline"
        >
          Panel Admin
        </a>
        <a 
          href="/admin/ventas" 
          className="px-5 py-2 text-[#fef1e4] font-bold rounded-full shadow hover:shadow-lg transition-all hover:-translate-y-0.5 text-sm sm:text-base bg-[#c61d0f] hover:brightness-110 no-underline"
        >
          Resumen Ventas
        </a>
      </nav>
    </header>
  );
}
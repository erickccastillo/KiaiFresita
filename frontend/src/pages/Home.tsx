import React from 'react';
import { ChevronRight, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KiaiFresitaHome() {
  const theme = {
    rojoKiai: '#E63946',
    verdeHoja: '#4CAF50',
  };

  return (
    <div className="relative w-screen min-h-[calc(100vh-76px)] bg-red-50 overflow-hidden font-sans flex flex-col m-0 p-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      
      {/* ============================================================ */}
      {/* 1. ESPACIOS PARA IMÁGENES DIFUMINADAS DE FONDO               */}
      <div
        className="absolute inset-0 z-0 opacity-40 blur-[8px] bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542345812-d98b8cd6eb98?q=80&w=2000&auto=format&fit=crop')" }}
      />
      
      {/* Elementos decorativos (Blobs/Manchas) animadas */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ backgroundColor: theme.rojoKiai }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ backgroundColor: theme.verdeHoja, animationDelay: '2s' }}></div>

      {/* ============================================================ */}
      {/* CONTENIDO PRINCIPAL (HERO SECTION)                           */}
      {/* ============================================================ */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        
        {/* Tarjeta de Cristal (Glassmorphism) - Totalmente responsiva */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl md:rounded-[3rem] shadow-2xl border border-white/70 p-6 sm:p-10 md:p-16 max-w-4xl w-full text-center transform transition-transform hover:scale-[1.01] duration-300 mx-auto">
          
          {/* Emojis con animación suave */}
          <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 flex justify-center gap-2 hover:animate-bounce cursor-default">
            <span className="drop-shadow-lg">🍓</span>
            <span className="drop-shadow-lg">🥋</span>
          </div>
          
          {/* Título Principal responsivo */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 sm:mb-6 tracking-tight drop-shadow-sm" style={{ color: theme.rojoKiai }}>
            Kiai Fresita
          </h1>
          
          {/* Descripción responsiva */}
          <p className="text-base sm:text-lg md:text-2xl text-gray-800 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-medium px-2">
            ¡El <span className="font-bold" style={{ color: theme.rojoKiai }}>golpe perfecto</span> de sabor! 
            Disfruta de las mejores fresas con crema, preparadas con ingredientes frescos y toda la disciplina de un verdadero maestro.
          </p>
          
          {/* Botones de Acción - Columna en móvil, fila en escritorio */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 w-full max-w-lg mx-auto sm:max-w-none">
            
            {/* Botón Ver Menú */}
            <a 
              href="/catalog"
              className="group relative px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-white text-lg sm:text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden no-underline"
              style={{ backgroundColor: theme.verdeHoja }}
            >
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
              <span className="relative z-10">Ver Menú</span>
            </a>
            
            {/* Botón Cotizar */}
            <a 
              href="/quote"
              className="group px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-lg sm:text-xl font-bold rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2 border-2 bg-white/80 backdrop-blur-sm no-underline"
              style={{ borderColor: theme.rojoKiai, color: theme.rojoKiai }}
            >
              <span>Cotizar Pedido</span>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" style={{ color: theme.rojoKiai }} />
            </a>
            
          </div>
        </div>
      </main>
    </div>
  );
}
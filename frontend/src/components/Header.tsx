import React from 'react';
import { Link, NavLink } from 'react-router-dom';

// 1. Importa la imagen aquí. Ajusta la ruta dependiendo de dónde esté tu archivo.
// Ejemplo: si está en una carpeta images sería import logo from '../images/logo.png';
import logo from '../images/logo.png'; 

const Header: React.FC = () => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img
          src={logo} // 2. Usa la variable importada aquí (sin comillas)
          alt="Logo Revestimento"
          style={{
            width: 60,
            height: 60,
            borderRadius: 6,
            objectFit: 'cover',
          }}
        />
        <div>
          <div style={{ fontFamily: 'Georgia', fontWeight: 700, fontSize: '1.25rem', color: '#000000' }}>
            Revestimento
          </div>
          <div style={{ fontSize: '0.65rem', color: '#ba9e10' }}>PISOS & AZULEJOS</div>
        </div>
      </div>

      {/* Navegación */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            textDecoration: isActive ? 'underline' : 'none',
            color: '#333',
            fontWeight: 500,
          })}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/catalog"
          style={({ isActive }) => ({
            textDecoration: isActive ? 'underline' : 'none',
            color: '#333',
            fontWeight: 500,
          })}
        >
          Catálogo
        </NavLink>
        <Link
          to="/quote"
          style={{
            backgroundColor: '#FFD700',
            color: '#0a2a5e',
            padding: '0.5rem 1rem',
            borderRadius: 6,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Cotizar
        </Link>
      </nav>
    </header>
  );
};

export default Header;
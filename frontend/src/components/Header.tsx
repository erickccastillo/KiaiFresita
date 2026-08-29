import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={{ 
      backgroundColor: 'var(--blanco)', 
      borderBottom: '3px solid var(--verde-hoja)', 
      padding: '1rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ color: 'var(--rojo-kiai)', margin: 0 }}>🍓🥋 Kiai Fresita</h1>
      </Link>
      
      <nav style={{ display: 'flex', gap: '15px' }}>
        <Link to="/admin" className="btn-rojo" style={{ textDecoration: 'none', backgroundColor: '#333' }}>
          Panel Admin
        </Link>
        <Link to="/admin/ventas" className="btn-rojo" style={{ textDecoration: 'none' }}>
          Resumen Ventas
        </Link>
      </nav>
    </header>
  );
}
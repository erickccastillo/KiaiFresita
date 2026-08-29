import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🍓🥋</div>
      <h1 style={{ color: 'var(--rojo-kiai)', fontSize: '3rem', margin: '0 0 1rem 0' }}>
        Kiai Fresita
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
        ¡El golpe perfecto de sabor! Disfruta de las mejores fresas con crema, preparadas con ingredientes frescos y toda la disciplina de un verdadero maestro.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link 
          to="/catalog" 
          className="btn-rojo" 
          style={{ textDecoration: 'none', fontSize: '1.2rem', padding: '15px 30px', backgroundColor: 'var(--verde-hoja)' }}
        >
          Ver Menú
        </Link>
        <Link 
          to="/quote" 
          className="btn-rojo" 
          style={{ textDecoration: 'none', fontSize: '1.2rem', padding: '15px 30px' }}
        >
          Cotizar Pedido
        </Link>
      </div>
    </div>
  );
}
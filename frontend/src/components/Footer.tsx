export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: 'var(--rojo-kiai)', 
      color: 'var(--blanco)', 
      textAlign: 'center', 
      padding: '1rem', 
      marginTop: 'auto' 
    }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>
        © {new Date().getFullYear()} Kiai Fresita. Todos los derechos reservados. 🥋
      </p>
    </footer>
  );
}